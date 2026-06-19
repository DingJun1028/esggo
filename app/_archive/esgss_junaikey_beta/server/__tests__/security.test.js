import { jest } from '@jest/globals';

// Define mocks BEFORE importing the app
jest.unstable_mockModule('../db/index.js', () => ({
  query: jest.fn(),
  initializeDatabase: jest.fn(),
  healthCheck: jest.fn(),
  default: { end: jest.fn() },
}));

jest.unstable_mockModule('../services/redisService.js', () => ({
  default: {
    healthCheck: jest.fn(),
  },
}));

jest.unstable_mockModule('../services/newsService.js', () => ({
  getGlobalNews: jest.fn(),
}));

const mockService = () => ({});
jest.unstable_mockModule('../services/rag.js', () => ({ default: mockService() }));
jest.unstable_mockModule('../controllers/metricsController.js', () => ({ getMetrics: jest.fn() }));
jest.unstable_mockModule('../services/amice.js', () => ({
  default: { validateSignature: jest.fn() },
}));
jest.unstable_mockModule('../services/sessionService.js', () => ({ default: {} }));
jest.unstable_mockModule('../services/swarmService.js', () => ({ runSwarm: jest.fn() }));
jest.unstable_mockModule('../services/blockchain.js', () => ({ default: {} }));
jest.unstable_mockModule('../services/zkpService.js', () => ({ default: {} }));
jest.unstable_mockModule('../services/omniAgentService.js', () => ({ default: {} }));

// Import dependencies dynamically
const request = (await import('supertest')).default;
const { app } = await import('../server.js');
const { getGlobalNews } = await import('../services/newsService.js');

describe('Security: Error Handling Leakage', () => {
  let originalEnv;

  beforeAll(() => {
    originalEnv = process.env.NODE_ENV;
  });

  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('should HIDE sensitive error details in PRODUCTION', async () => {
    process.env.NODE_ENV = 'production';

    const sensitiveError = 'SQL Error: Table users not found';
    getGlobalNews.mockRejectedValue(new Error(sensitiveError));

    const token = 'SUPER_SECRET_TOKEN';

    const res = await request(app).get('/api/news').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(500);
    // Verify protection
    expect(res.body).not.toHaveProperty('details');
    expect(res.body).not.toHaveProperty('message', sensitiveError);
    expect(res.body.error).toBe('Internal Server Error');
  });

  it('should SHOW error details in DEVELOPMENT', async () => {
    process.env.NODE_ENV = 'development';

    const sensitiveError = 'SQL Error: Table users not found';
    getGlobalNews.mockRejectedValue(new Error(sensitiveError));

    const token = 'SUPER_SECRET_TOKEN';

    const res = await request(app).get('/api/news').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(500);
    // Verify dev friendly info
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe(sensitiveError);
  });
});
