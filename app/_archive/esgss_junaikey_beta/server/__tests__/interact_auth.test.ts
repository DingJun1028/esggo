
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

// Mock Config
vi.mock('../src/config/index.js', () => ({
  default: {
    security: {
      apiSecretToken: 'test-secret',
      cors: { origin: '*' }
    },
    upload: {
      uploadPath: 'uploads',
      maxFileSize: 1000000,
      allowedTypes: ['pdf']
    },
    ai: {
      gemini: { apiKey: 'test-key', model: 'gemini-pro' }
    }
  }
}));

// Mock Supabase
vi.mock('../src/config/supabase.js', () => ({
  supabase: {
    from: () => ({
      select: () => ({ data: [], error: null }),
      upsert: () => ({ error: null })
    }),
  },
  default: {
    from: () => ({
      select: () => ({ data: [], error: null }),
      upsert: () => ({ error: null })
    }),
  },
  testSupabaseConnection: async () => true,
  getDatabaseStats: async () => ({}),
}));

// Mock Redis
vi.mock('../services/redisService.js', () => ({
  default: {
    healthCheck: async () => 'ok',
    get: async () => null,
    set: async () => 'ok',
    del: async () => 'ok',
    getSession: async () => null,
    setSession: async () => {},
  }
}));

// Mock DB
vi.mock('../db/index.js', () => ({
  default: {
    end: async () => {},
    on: () => {},
    connect: async () => ({ release: () => {} })
  },
  query: async () => ({ rows: [], rowCount: 0 }),
  initializeDatabase: async () => {},
  healthCheck: async () => 'ok',
  transaction: async (cb: any) => cb({ query: async () => ({ rows: [] }) })
}));

// Import app AFTER mocks
import { app } from '../server';

describe('Security Check', () => {
  it('should require authentication for /api/manifest', async () => {
    const res = await request(app)
      .post('/api/manifest')
      .send({ source_agent: 'test' });

    expect(res.status).toBe(401);
  });

  it('should require authentication for /api/interact', async () => {
    const res = await request(app)
      .get('/api/interact')
      .query({ sessionId: '123', message: 'hello' });

    expect(res.status).toBe(401);
  });

  it('should allow access to /api/interact with query token', async () => {
    const res = await request(app)
      .get('/api/interact')
      .query({ sessionId: '123', message: 'hello', token: 'test-secret' });

    // Should pass auth (likely 404 because session missing)
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });

  it('should require authentication for /api/market/crawl', async () => {
    const res = await request(app)
      .post('/api/market/crawl')
      .send({ query: 'test' });

    expect(res.status).toBe(401);
  });
});
