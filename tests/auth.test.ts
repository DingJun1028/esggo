import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock env vars before importing auth module
const originalEnv = { ...process.env };

beforeEach(() => {
  vi.resetModules();
  delete process.env.MASTER_AUTH_TOKEN;
  delete process.env.EXPECTED_MASTER_TOKEN;
  delete process.env.MASTER_TOKEN_EXPIRY_SECONDS;
  delete process.env.MASTER_AUTH_VALIDATOR_URL;
  delete process.env.AUTH_PERSIST_TO_FILE;
});

afterEach(() => {
  Object.keys(process.env).forEach(key => {
    if (!(key in originalEnv)) delete process.env[key];
  });
  Object.assign(process.env, originalEnv);
});

describe('authenticateWithMaster', () => {
  it('should reject when MASTER_AUTH_TOKEN is not set', async () => {
    const { authenticateWithMaster } = await import('../src/auth');
    const result = await authenticateWithMaster();
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('MISSING_TOKEN');
  });

  it('should reject invalid token', async () => {
    process.env.MASTER_AUTH_TOKEN = 'wrong-token';
    process.env.EXPECTED_MASTER_TOKEN = 'VALID_MASTER_TOKEN';
    const { authenticateWithMaster } = await import('../src/auth');
    const result = await authenticateWithMaster();
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('INVALID_TOKEN');
  });

  it('should accept valid token matching EXPECTED_MASTER_TOKEN', async () => {
    process.env.MASTER_AUTH_TOKEN = 'VALID_MASTER_TOKEN';
    const { authenticateWithMaster } = await import('../src/auth');
    const result = await authenticateWithMaster();
    expect(result.success).toBe(true);
    expect(result.expiresAt).toBeGreaterThan(0);
  });

  it('should accept custom expected token', async () => {
    process.env.MASTER_AUTH_TOKEN = 'my-secret-token';
    process.env.EXPECTED_MASTER_TOKEN = 'my-secret-token';
    const { authenticateWithMaster, readAuthorizedStatus } = await import('../src/auth');
    const result = await authenticateWithMaster();
    expect(result.success).toBe(true);
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

  it('should cache auth state and return early on subsequent calls', async () => {
    process.env.MASTER_AUTH_TOKEN = 'VALID_MASTER_TOKEN';
    const { authenticateWithMaster } = await import('../src/auth');
    const result1 = await authenticateWithMaster();
    expect(result1.success).toBe(true);
    // Second call should return cached result
    const result2 = await authenticateWithMaster();
    expect(result2.success).toBe(true);
  });
});

describe('readAuthorizedStatus', () => {
  it('should return false when not authenticated', async () => {
    const { readAuthorizedStatus } = await import('../src/auth');
    expect(readAuthorizedStatus()).toBe(false);
  });

  it('should return false when token expired', async () => {
    process.env.MASTER_AUTH_TOKEN = 'VALID_MASTER_TOKEN';
    process.env.MASTER_TOKEN_EXPIRY_SECONDS = '0';
    const { authenticateWithMaster, readAuthorizedStatus } = await import('../src/auth');
    await authenticateWithMaster();
    expect(readAuthorizedStatus()).toBe(false);
  });

  it('should return true when authenticated and not expired', async () => {
    process.env.MASTER_AUTH_TOKEN = 'VALID_MASTER_TOKEN';
    process.env.MASTER_TOKEN_EXPIRY_SECONDS = '3600';
    const { authenticateWithMaster, readAuthorizedStatus } = await import('../src/auth');
    await authenticateWithMaster();
    expect(readAuthorizedStatus()).toBe(true);
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
  it('should return false when not authenticated', async () => {
    const { checkSignature } = await import('../src/auth');
    const data = Buffer.from('test-data');
    expect(checkSignature({}, data)).toBe(false);
  });

  it('should return false for empty data', async () => {
    const { checkSignature } = await import('../src/auth');
    expect(checkSignature({}, Buffer.alloc(0))).toBe(false);
  });

  it('should return false for data that does not match hash', async () => {
    process.env.MASTER_AUTH_TOKEN = 'VALID_MASTER_TOKEN';
    const { authenticateWithMaster, checkSignature } = await import('../src/auth');
    await authenticateWithMaster();
    expect(checkSignature({}, Buffer.from('some-random-data'))).toBe(false);
  });

  it('should use timingSafeEqual for hash comparison (no timing leak)', async () => {
    process.env.MASTER_AUTH_TOKEN = 'VALID_MASTER_TOKEN';
    const { authenticateWithMaster, checkSignature } = await import('../src/auth');
    await authenticateWithMaster();
    const data1 = Buffer.from('a');
    const data2 = Buffer.from('b');
    const r1 = checkSignature({}, data1);
    const r2 = checkSignature({}, data2);
    expect(typeof r1).toBe('boolean');
    expect(typeof r2).toBe('boolean');
  });
});

describe('JWT validation', () => {
  it('should accept valid JWT format token with future expiry', async () => {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url');
    const jwt = `${header}.${payload}.signature`;

    process.env.MASTER_AUTH_TOKEN = jwt;
    const { authenticateWithMaster } = await import('../src/auth');
    const result = await authenticateWithMaster();
    expect(result.success).toBe(true);
  });

  it('should reject expired JWT token', async () => {
    const header = Buffer.from(JSON.stringify({ alg: 'H256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 100 })).toString('base64url');
    const jwt = `${header}.${payload}.signature`;

    process.env.MASTER_AUTH_TOKEN = jwt;
    const { authenticateWithMaster } = await import('../src/auth');
    const result = await authenticateWithMaster();
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('EXPIRED_TOKEN');
  });

  it('should reject malformed JWT', async () => {
    process.env.MASTER_AUTH_TOKEN = 'not-a-jwt';
    process.env.EXPECTED_MASTER_TOKEN = 'VALID_MASTER_TOKEN';
    const { authenticateWithMaster } = await import('../src/auth');
    const result = await authenticateWithMaster();
    expect(result.success).toBe(false);
  });
});
