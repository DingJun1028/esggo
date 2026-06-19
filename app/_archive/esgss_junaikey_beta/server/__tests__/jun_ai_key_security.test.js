import { jest } from '@jest/globals';

// Set environment variable for the test
process.env.VITE_JUNAIKEY_API_KEY = 'TEST_API_KEY_12345';

// Mock the services to prevent side effects and ESM issues
jest.unstable_mockModule('../services/MCPService.js', () => ({
  MCPService: class {
    constructor() {}
    fetchAsMarkdown() {}
    solveProblem() {}
    deployContent() {}
    searchArxiv() {}
    getContext7Docs() {}
  },
}));

jest.unstable_mockModule('../services/AnalysisService.js', () => ({
  AnalysisService: class {
    constructor() {}
    analyzeTrend() {}
  },
}));

// Import the module under test dynamically after mocking
const { authenticate } = await import('../api/jun-ai-key.js');

describe('Security: JunAiKey Authentication', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should allow access with correct X-API-KEY header', () => {
    req.headers['x-api-key'] = 'TEST_API_KEY_12345';
    authenticate(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should allow access with correct Authorization Bearer header', () => {
    req.headers['authorization'] = 'Bearer TEST_API_KEY_12345';
    authenticate(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should deny access with incorrect API Key', () => {
    req.headers['x-api-key'] = 'WRONG_KEY';
    authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    expect(next).not.toHaveBeenCalled();
  });

  it('should deny access with incorrect API Key (same length to check logic)', () => {
    req.headers['x-api-key'] = 'TEST_API_KEY_54321'; // Same length as valid key
    authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should deny access with missing API Key', () => {
    authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Missing API key') })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
