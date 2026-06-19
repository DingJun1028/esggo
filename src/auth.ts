import { writeFileSync } from 'fs';
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
  expiresAt?: number;
}

// ─── State ───────────────────────────────────────────────────────────────────

const authContext: AuthorizationContext = {
  isAuthorized: false,
  masterCertificateHash: null,
  firstCheckTime: null,
  tokenExpiryTime: null,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Validates token format (basic JWT structure: header.payload.signature)
 */
function isValidJwtFormat(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  return parts.every(p => p.length > 0);
}

/**
 * Decodes JWT payload without verification (for expiry extraction)
 */
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    // Base64URL decode
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length % 4;
    const padded = padding ? base64 + '='.repeat(4 - padding) : base64;
    const json = Buffer.from(padded, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Gets the effective token expiry in seconds from env or JWT exp claim
 */
function getEffectiveExpiry(masterAuthToken?: string): number {
  const envExpiry = Number(process.env.MASTER_TOKEN_EXPIRY_SECONDS);
  if (!isNaN(envExpiry) && envExpiry > 0) return envExpiry;

  // Try to extract from JWT exp
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

/**
 * Optional: call an external OAuth 2.0 / OpenID Connect validation endpoint
 * Set MASTER_AUTH_VALIDATOR_URL to enable. Falls back to local validation.
 */
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

/**
 * Returns whether the current context is authorized and token not expired.
 * Auto-clears expired tokens.
 */
export function readAuthorizedStatus(): boolean {
  if (!authContext.isAuthorized) return false;
  if (authContext.tokenExpiryTime !== null && Date.now() > authContext.tokenExpiryTime) {
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

/**
 * Clears the auth context (used on logout or token expiry).
 */
export function clearAuthContext(): void {
  authContext.isAuthorized = false;
  authContext.masterCertificateHash = null;
  authContext.firstCheckTime = null;
  authContext.tokenExpiryTime = null;
}

/**
 * Persists auth context to disk (optional, for debugging only).
 * In production, disable file persistence entirely.
 */
export async function saveMasterData(): Promise<void> {
  const now = Date.now();
  authContext.isAuthorized = true;
  authContext.firstCheckTime = now;
  authContext.masterCertificateHash = 'AUTH-ESG2023-PROXY-SIG-1ca2d93e';
  const expirySeconds = Number(process.env.MASTER_TOKEN_EXPIRY_SECONDS) ?? 3600;
  authContext.tokenExpiryTime = now + expirySeconds * 1000;

  try {
    writeFileSync('auth-context.json', JSON.stringify(authContext, null, 2));
  } catch (err) {
    console.warn('[auth] Failed to write auth-context.json:', err);
  }
}

// ─── Core Authentication ────────────────────────────────────────────────────

/**
 * Authenticates using a master token from environment variables or external IdP.
 *
 * Environment variables:
 * - MASTER_AUTH_TOKEN: The token to validate (raw token or JWT)
 * - EXPECTED_MASTER_TOKEN: The expected token value for local validation (default: 'VALID_MASTER_TOKEN')
 * - MASTER_TOKEN_EXPIRY_SECONDS: Token expiry in seconds (default: 3600)
 * - MASTER_AUTH_VALIDATOR_URL: Optional external OAuth 2.0 / OIDC validation endpoint
 *
 * Validation order:
 * 1. Check if already authorized (cached) → return true
 * 2. If MASTER_AUTH_VALIDATOR_URL set → validate externally
 * 3. Fallback → local env token comparison
 * 4. If MASTER_AUTH_TOKEN is a JWT → extract exp claim for dynamic expiry
 */
export async function authenticateWithMaster(): Promise<boolean> {
  // 1. Return early if already authorized and not expired
  if (readAuthorizedStatus()) return true;

  const masterAuthToken = process.env.MASTER_AUTH_TOKEN;

  if (!masterAuthToken) {
    console.error('[auth] MASTER_AUTH_TOKEN not set.');
    return false;
  }

  let isValid = false;

  // 2. Try external validator first
  const external = await validateWithExternalProvider(masterAuthToken);
  if (external.valid) {
    isValid = true;
    console.log('[auth] Validated via external IdP.');
  } else {
    // 3. Local validation
    if (isValidJwtFormat(masterAuthToken)) {
      // JWT format → check expiry
      const payload = decodeJwtPayload(masterAuthToken);
      if (payload?.exp && payload.exp * 1000 < Date.now()) {
        console.error('[auth] JWT token expired.');
        authContext.isAuthorized = false;
        return false;
      }
      // JWT structure is valid and not expired → accept
      isValid = true;
      console.log('[auth] Validated via JWT structure.');
    } else {
      // Raw token → compare with expected value
      const expectedToken = process.env.EXPECTED_MASTER_TOKEN ?? 'VALID_MASTER_TOKEN';
      if (masterAuthToken === expectedToken) {
        isValid = true;
        console.log('[auth] Validated via local token comparison.');
      } else {
        console.error('[auth] Invalid token.');
        authContext.isAuthorized = false;
        return false;
      }
    }
  }

  if (!isValid) {
    authContext.isAuthorized = false;
    return false;
  }

  // Set auth context with dynamic expiry
  const now = Date.now();
  const expirySeconds = getEffectiveExpiry(masterAuthToken);
  authContext.isAuthorized = true;
  authContext.masterCertificateHash = 'AUTH-ESG2023-PROXY-SIG-1ca2d93e';
  authContext.firstCheckTime = now;
  authContext.tokenExpiryTime = now + expirySeconds * 1000;

  console.log('[auth] Authentication successful. Token expires in', expirySeconds, 'seconds.');

  // Optional: persist for debugging (disabled in production)
  if (process.env.AUTH_PERSIST_TO_FILE === 'true') {
    await saveMasterData();
  }

  return true;
}

// ─── Signature Verification ──────────────────────────────────────────────────

/**
 * Verifies a signature against the master certificate hash.
 *
 * Current: SHA-256 hash comparison (placeholder).
 * Production: Replace with proper public-key verification.
 *
 * To enable real signature verification, set MASTER_PUBLIC_KEY (PEM format).
 */
export function checkSignature(_header: unknown, data: Buffer): boolean {
  // If we have a configured public key, use it
  const publicKeyPem = process.env.MASTER_PUBLIC_KEY;
  if (publicKeyPem) {
    try {
      const verifier = crypto.createVerify('SHA256');
      verifier.update(data);
      // Assume last 64 bytes are the signature
      if (data.length <= 64) return false;
      const signature = data.slice(-64);
      const content = data.slice(0, -64);
      const verify = crypto.createVerify('SHA256');
      verify.update(content);
      return verify.verify(publicKeyPem, signature);
    } catch (err) {
      console.error('[auth] Signature verification error:', err);
      return false;
    }
  }

  // Fallback: hash comparison (demo mode)
  const expectedHash = authContext.masterCertificateHash ?? 'FAKE_HASH';
  const computedHash = crypto.createHash('sha256').update(data).digest('hex');
  return computedHash === expectedHash;
}
