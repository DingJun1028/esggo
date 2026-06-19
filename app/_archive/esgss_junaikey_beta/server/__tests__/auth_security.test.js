import { jest } from '@jest/globals';

// Set environment before import to prevent config loading default (if we care, but here we explicitly set it)
process.env.API_SECRET_TOKEN = 'SUPER_SECRET_TOKEN';

import { authenticateRequest } from '../src/middleware/authRequest.js';

describe('Security: authenticateRequest', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      path: '/api/some/protected/route',
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should allow access with correct token', () => {
    req.headers.authorization = 'Bearer SUPER_SECRET_TOKEN';
    authenticateRequest(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should deny access with incorrect token (same length)', () => {
    req.headers.authorization = 'Bearer WRONG_SECRET_TOKEN'; // Same length as SUPER_SECRET_TOKEN (18 chars)
    authenticateRequest(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden: Invalid token.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should deny access with incorrect token (different length)', () => {
    req.headers.authorization = 'Bearer SHORT';
    authenticateRequest(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('should deny access without Authorization header', () => {
    authenticateRequest(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should deny access with malformed Authorization header', () => {
    req.headers.authorization = 'Basic SUPER_SECRET_TOKEN';
    authenticateRequest(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should bypass auth for health check', () => {
    req.path = '/api/health';
    authenticateRequest(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
