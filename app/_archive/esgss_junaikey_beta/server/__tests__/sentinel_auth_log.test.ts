import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// We need to mock the config module BEFORE importing the middleware
vi.mock('../src/config/index', () => ({
  default: {
    jwt: {
      secret: 'CRITICAL_SECRET_DO_NOT_LEAK',
    },
  },
}));

import { authenticateToken } from '../middleware/authMiddleware';

// Mock logger to suppress actual logging during test
vi.mock('../utils/omniLogger', () => ({
  default: {
    warn: vi.fn(),
  },
  LogCategory: { AUTH: 'AUTH' },
}));

describe('Sentinel Security Check: Auth Middleware', () => {
  let req: any;
  let res: any;
  let next: any;
  let consoleLogSpy: any;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer invalid_token',
      },
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should NOT log the JWT secret when token verification fails', () => {
    // Act
    authenticateToken(req, res, next);

    // Assert
    // This assertion ensures that the secret is NOT exposed in the logs.
    // If the vulnerability exists, this test will fail.
    expect(consoleLogSpy).not.toHaveBeenCalledWith(expect.stringContaining('CRITICAL_SECRET_DO_NOT_LEAK'));
  });
});
