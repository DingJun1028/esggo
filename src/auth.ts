import * as crypto from 'crypto';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AuthorizationContext {
  isAuthorized: boolean;
  masterCertificateHash: string | null;
  firstCheckTime: number | null;
  tokenExpiryTime: number | null;
}

interface AuthResult {
  success: boolean;
  error?: string;
  errorCode?: 'MISSING_TOKEN' | 'INVALID_TOKEN' | 'EXPIRED_TOKEN' | 'EXTERNAL_VALIDATION_FAILED' | 'SERVER_ERROR';
  expiresAt?: number;
}

// ─── State (in-memory cache, per-process) ────────────────────────────────────
// NOTE: This cache is per-server-instance. For multi-instance deployments,
// use a shared session store (Redis, database) instead.

const authContext: AuthorizationContext = {
  isAuthorized: false,
  masterCertificateHash: null,
  firstCheckTime: null,
  tokenExpiryTime: null,
};

// ─── Safety Checks ───────────────────────────────────────────────────────────

/**
 * Validates that required environment variables are present.
 * Throws if MASTER_AUTH_TOKEN is missing (fail-fast).
 */
function safetyChecks(): void {
  if (!process.env.MASTER_AUTH_TOKEN) {
    throw new Error('[auth] Environment variable missing: MASTER_AUTH_TOKEN');
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isValidJwtFormat(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  return parts.every(p => p.length > 0);
}

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length % 4;
    const padded = padding ? base64 + '='.repeat(4 - padding) : base64;
    const json = Buffer.from(padded, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getEffectiveExpiry(masterAuthToken?: string): number {
  const envExpiry = Number(process.env.MASTER_TOKEN_EXPIRY_SECONDS);
  if (!isNaN(envExpiry) && envExpiry >= 0) return envExpiry;

  if (masterAuthToken) {
    const payload = decodeJwtPayload(masterAuthToken);
    if (payload?.exp) {
      const expMs = payload.exp * 1000;
      const diff = Math.floor((expMs - Date.now()) / 1000);
      if (diff > 0) return diff;
    }
  }

  return 3600; // default 1 hour
}

async function validateWithExternalProvider(token: string): Promise<{ valid: boolean; payload?: Record<string, any> }> {
  const validatorUrl = process.env.MASTER_AUTH_VALIDATOR_URL;
  if (!validatorUrl) return { valid: false };

  try {
    const res = await fetch(validatorUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { valid: false };
    const data = await res.json();
    return { valid: data.valid === true, payload: data };
  } catch (err) {
    console.warn('[auth] External validation failed, falling back to local:', err);
    return { valid: false };
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function readAuthorizedStatus(): boolean {
  if (!authContext.isAuthorized) return false;
  if (authContext.tokenExpiryTime !== null && Date.now() >= authContext.tokenExpiryTime) {
    clearAuthContext();
    console.log('[auth] Token expired, context cleared.');
    return false;
  }
  return true;
}

export function getMasterCertificateHash(): string | null {
  return authContext.masterCertificateHash;
}

export function getAuthContext(): Readonly<AuthorizationContext> {
  return { ...authContext };
}

export function clearAuthContext(): void {
  authContext.isAuthorized = false;
  authContext.masterCertificateHash = null;
  authContext.firstCheckTime = null;
  authContext.tokenExpiryTime = null;
}

// ─── Core Authentication ────────────────────────────────────────────────────

/**
 * Authenticates using a master token from environment variables or external IdP.
 *
 * Environment variables:
 * - MASTER_AUTH_TOKEN (REQUIRED): The token to validate
 * - EXPECTED_MASTER_TOKEN: Expected value for local comparison (default: 'VALID_MASTER_TOKEN')
 * - MASTER_TOKEN_EXPIRY_SECONDS: Expiry in seconds (default: 3600)
 * - MASTER_AUTH_VALIDATOR_URL: External OAuth 2.0 / OIDC validation endpoint
 *
 * @returns AuthResult with success status and error details
 */
export async function authenticateWithMaster(): Promise<AuthResult> {
  // 1. Return early if already authorized and not expired
  if (readAuthorizedStatus()) {
    return { success: true, expiresAt: authContext.tokenExpiryTime ?? undefined };
  }

  // 2. Safety check — throw if MASTER_AUTH_TOKEN is missing
  let masterAuthToken: string;
  try {
    safetyChecks();
    masterAuthToken = process.env.MASTER_AUTH_TOKEN!;
  } catch (err: any) {
    return { success: false, error: err.message, errorCode: 'MISSING_TOKEN' };
  }

  let isValid = false;

  // 3. Try external validator first
  try {
    const external = await validateWithExternalProvider(masterAuthToken);
    if (external.valid) {
      isValid = true;
      console.log('[auth] Validated via external IdP.');
    }
  } catch (err) {
    console.warn('[auth] External validation error:', err);
  }

  // 4. Fallback to local validation
  if (!isValid) {
    if (isValidJwtFormat(masterAuthToken)) {
      const payload = decodeJwtPayload(masterAuthToken);
      if (payload?.exp && payload.exp * 1000 < Date.now()) {
        console.error('[auth] JWT token expired.');
        authContext.isAuthorized = false;
        return { success: false, error: 'JWT token expired', errorCode: 'EXPIRED_TOKEN' };
      }
      isValid = true;
      console.log('[auth] Validated via JWT structure.');
    } else {
      const expectedToken = process.env.EXPECTED_MASTER_TOKEN ?? 'VALID_MASTER_TOKEN';
      if (masterAuthToken === expectedToken) {
        isValid = true;
        console.log('[auth] Validated via local token comparison.');
      } else {
        console.error('[auth] Invalid token.');
        authContext.isAuthorized = false;
        return { success: false, error: 'Invalid token', errorCode: 'INVALID_TOKEN' };
      }
    }
  }

  if (!isValid) {
    authContext.isAuthorized = false;
    return { success: false, error: 'All validation methods failed', errorCode: 'EXTERNAL_VALIDATION_FAILED' };
  }

  // 5. Set auth context with dynamic expiry
  const now = Date.now();
  const expirySeconds = getEffectiveExpiry(masterAuthToken);
  authContext.isAuthorized = true;
  authContext.masterCertificateHash = 'AUTH-ESG2023-PROXY-SIG-1ca2d93e';
  authContext.firstCheckTime = now;
  authContext.tokenExpiryTime = now + expirySeconds * 1000;

  console.log('[auth] Authentication successful. Token expires in', expirySeconds, 'seconds.');

  return { success: true, expiresAt: authContext.tokenExpiryTime };
}

// ─── Signature Verification ──────────────────────────────────────────────────

export function checkSignature(_header: unknown, data: Buffer): boolean {
  if (!data || data.length === 0) {
    console.warn('[auth] checkSignature: empty data');
    return false;
  }

  const publicKeyPem = process.env.MASTER_PUBLIC_KEY;

  if (publicKeyPem) {
    try {
      if (data.length < 5) {
        console.warn('[auth] checkSignature: data too short for public-key mode');
        return false;
      }
      const sigLength = data.readUInt32BE(0);
      if (sigLength === 0 || sigLength > data.length - 4) {
        console.warn('[auth] checkSignature: invalid signature length', sigLength);
        return false;
      }
      const signature = data.subarray(4, 4 + sigLength);
      const payload = data.subarray(4 + sigLength);
      const verifier = crypto.createVerify('SHA256');
      verifier.update(payload);
      return verifier.verify(publicKeyPem, signature);
    } catch (err) {
      console.error('[auth] Signature verification error:', err);
      return false;
    }
  }

  // Demo mode: hash comparison with timing-safe equal
  if (!authContext.isAuthorized || !authContext.masterCertificateHash) {
    console.warn('[auth] checkSignature: not authorized, rejecting');
    return false;
  }

  const computedHash = crypto.createHash('sha256').update(data).digest('hex');
  const expectedBuf = Buffer.from(authContext.masterCertificateHash, 'utf-8');
  const computedBuf = Buffer.from(computedHash, 'utf-8');
  if (expectedBuf.length !== computedBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, computedBuf);
}
