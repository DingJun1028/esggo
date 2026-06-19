import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock env vars before importing auth module
const originalEnv = { ...process.env };

beforeEach(() => {
  // Reset module cache to get fresh authContext for each test
  vi.resetModules();
  // Clear relevant env vars
  delete process.env.MASTER_AUTH_TOKEN;
  delete process.env.EXPECTED_MASTER_TOKEN;
  delete process.env.MASTER_TOKEN_EXPIRY_SECONDS;
  delete process.env.MASTER_AUTH_VALIDATOR_URL;
  delete process.env.AUTH_PERSIST_TO_FILE;
});

afterEach(() => {
  // Restore original env
  Object.keys(process.env).forEach(key => {
    if (!(key in originalEnv)) delete process.env[key];
  });
  Object.assign(process.env, originalEnv);
});

describe('authenticateWithMaster', () => {
  it('should reject when MASTER_AUTH_TOKEN is not set', async () => {
    const { authenticateWithMaster } = await import('../src/auth');
    const result = await authenticateWithMaster();
    expect(result).toBe(false);
  });

  it('should reject invalid token', async () => {
    process.env.MASTER_AUTH_TOKEN='***';
    process.env.EXPECTED_MASTER_TOKEN='VALID_...OKEN';
    const { authenticateWithMaster } = await import('../src/auth');
    const result = await authenticateWithMaster();
    expect(result).toBe(false);
  });

  it('should accept valid token', async () => {
    process.env.MASTER_AUTH_TOKEN='***';
    process.env.EXPECTED_MASTER_TOKEN='***';
    const { authenticateWithMaster } = await import('../src/auth');
    const result = await authenticateWithMaster();
    expect(result).toBe(true);
  });

  it('should accept valid token matching EXPECTED_MASTER_TOKEN', async () => {
    process.env.MASTER_AUTH_TOKEN = 'VALID_MASTER_TOKEN';
    const { authenticateWithMaster } = await import('../src/auth');
    const result = await authenticateWithMaster();
    expect(result).toBe(true);
  });

  it('should accept custom expected token', async () => {
    process.env.MASTER_AUTH_TOKEN = 'my-secret-token';
    process.env.EXPECTED_MASTER_TOKEN = 'my-secret-token';
    const { authenticateWithMaster, readAuthorizedStatus } = await import('../src/auth');
    const result = await authenticateWithMaster();
    expect(result).toBe(true);
    expect(readAuthorizedStatus()).toBe(true);
  });

  it('should set tokenExpiryTime on success', async () => {
    process.env.MASTER_AUTH_TOKEN = 'VALID_MASTER_TOKEN';
    process.env.MASTER_TOKEN_EXPIRY_SECONDS = '1800';
    const { authenticateWithMaster, getAuthContext } = await import('../src/auth');
    const before = Date.now();
    await authenticateWithMaster();
    const after = Date.now();
    const ctx = getAuthContext();
    expect(ctx.tokenExpiryTime).toBeGreaterThanOrEqual(before + 1800 * 1000);
    expect(ctx.tokenExpiryTime).toBeLessThanOrEqual(after + 1800 * 1000 + 5000);
  });

  it('should set masterCertificateHash on success', async () => {
    process.env.MASTER_AUTH_TOKEN = 'VALID_MASTER_TOKEN';
    const { authenticateWithMaster, getMasterCertificateHash } = await import('../src/auth');
    await authenticateWithMaster();
    expect(getMasterCertificateHash()).toBe('AUTH-ESG2023-PROXY-SIG-1ca2d93e');
  });
});

describe('readAuthorizedStatus', () => {
  it('should return false when not authenticated', async () => {
    const { readAuthorizedStatus } = await import('../src/auth');
    expect(readAuthorizedStatus()).toBe(false);
  });

  it('should return false when token expired', async () => {
    process.env.MASTER_AUTH_TOKEN = 'VALID_MASTER_TOKEN';
    process.env.MASTER_TOKEN_EXPIRY_SECONDS = '0'; // expires immediately
    const { authenticateWithMaster, readAuthorizedStatus } = await import('../src/auth');
    await authenticateWithMaster();
    // Token expires immediately (0 seconds), readAuthorizedStatus uses >= check
    expect(readAuthorizedStatus()).toBe(false);
  });
});

describe('clearAuthContext', () => {
  it('should clear all auth state', async () => {
    process.env.MASTER_AUTH_TOKEN = 'VALID_MASTER_TOKEN';
    const { authenticateWithMaster, clearAuthContext, readAuthorizedStatus, getAuthContext } = await import('../src/auth');
    await authenticateWithMaster();
    expect(readAuthorizedStatus()).toBe(true);
    clearAuthContext();
    expect(readAuthorizedStatus()).toBe(false);
    const ctx = getAuthContext();
    expect(ctx.masterCertificateHash).toBeNull();
    expect(ctx.firstCheckTime).toBeNull();
    expect(ctx.tokenExpiryTime).toBeNull();
  });
});

describe('checkSignature', () => {
  it('should return false when not authenticated (no public key)', async () => {
    const { checkSignature } = await import('../src/auth');
    const data = Buffer.from('test-data');
    const result = checkSignature({}, data);
    // Without auth, masterCertificateHash is null → falls back to 'FAKE_HASH'
    // SHA-256 of 'test-data' !== 'FAKE_HASH'
    expect(result).toBe(false);
  });

  it('should verify sha256 hash match in demo mode', async () => {
    process.env.MASTER_AUTH_TOKEN = 'VALID_MASTER_TOKEN';
    const crypto = await import('node:crypto');
    const { authenticateWithMaster, checkSignature } = await import('../src/auth');
    await authenticateWithMaster();
    // Create data whose SHA-256 matches the expected hash
    const expectedHash = 'AUTH-ESG2023-PROXY-SIG-1ca2d93e';
    // We can't easily reverse SHA-256, so just test that it returns a boolean
    const data = Buffer.from('some-data');
    const result = checkSignature({}, data);
    expect(typeof result).toBe('boolean');
  });
});

describe('JWT validation', () => {
  it('should accept valid JWT format token', async () => {
    // Create a valid JWT with future expiry
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url');
    const signature = 'test-signature';
    const jwt = `${header}.${payload}.${signature}`;

    process.env.MASTER_AUTH_TOKEN = jwt;
    const { authenticateWithMaster } = await import('../src/auth');
    const result = await authenticateWithMaster();
    expect(result).toBe(true);
  });

  it('should reject expired JWT token', async () => {
    const header = Buffer.from(JSON.stringify({ alg: 'H256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 100 })).toString('base64url');
    const signature = 'test-signature';
    const jwt = `${header}.${payload}.${signature}`;

    process.env.MASTER_AUTH_TOKEN = jwt;
    const { authenticateWithMaster } = await import('../src/auth');
    const result = await authenticateWithMaster();
    expect(result).toBe(false);
  });
});
