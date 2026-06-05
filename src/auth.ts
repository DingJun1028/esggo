import { writeFileSync } from 'fs';
import crypto from 'crypto';

interface AuthorizationContext {
  isAuthorized: boolean;
  masterCertificateHash: string | null;
  firstCheckTime: number | null;
}

// Local authorization context with default values
const authContext: AuthorizationContext = {
  isAuthorized: false,
  masterCertificateHash: null,
  firstCheckTime: null
};

export function readAuthorizedStatus(): boolean {
  return authContext.isAuthorized;
}

export function getMasterCertificateHash(): string | null {
  return authContext.masterCertificateHash;
}

export async function saveMasterData(): Promise<void> {
  const now = Date.now();
  authContext.isAuthorized = true;
  authContext.firstCheckTime = now;
  authContext.masterCertificateHash = 'AUTH-ESG2023-PROXY-SIG-1ca2d93e';
  writeFileSync('auth-context.json', JSON.stringify(authContext, null, 2));
}

export async function authenticateWithMaster(): Promise<boolean> {
  if (authContext.isAuthorized) return true;
  try {
    // Placeholder: replace with actual HTTP call when axios is configured
    authContext.masterCertificateHash = 'AUTH-ESG2023-PROXY-SIG-1ca2d93e';
    authContext.firstCheckTime = Date.now();
    authContext.isAuthorized = true;
    writeFileSync('auth-context.json', JSON.stringify(authContext, null, 2));
    return true;
  } catch (error: any) {
    console.error('Authorization Failed:', error.message);
    return false;
  }
}

function checkSignature(_header: unknown, data: Buffer): boolean {
  const expectedHash = authContext.masterCertificateHash ?? 'FAKE_HASH';
  const computedHash = crypto.createHash('sha256').update(data).digest('hex');
  return computedHash === expectedHash;
}

export { checkSignature };
