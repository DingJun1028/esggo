import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock DB
jest.unstable_mockModule('../db/index.js', () => ({
  default: { query: jest.fn() },
}));

// Mock Evidence Service
jest.unstable_mockModule('../services/evidenceService.js', () => ({
  getPendingEvidence: jest.fn().mockResolvedValue([]),
  updateEvidenceStatus: jest.fn().mockResolvedValue({ id: 123, status: 'approved' }),
}));

// Mock Auth Middleware
jest.unstable_mockModule('../middleware/authMiddleware.js', () => ({
  authenticateToken: (req, res, next) => {
    if (req.headers.authorization === 'Bearer valid-token') {
      req.user = { id: 1, role: 'admin' };
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  },
}));

// Dynamic import after mocks
const { default: evidenceRouter } = await import('../routes/evidenceRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/evidence', evidenceRouter);

describe('Evidence Routes Security', () => {
  it('GET /pending should be protected', async () => {
    // Attempt without token
    const res = await request(app).get('/api/evidence/pending');
    expect(res.status).toBe(401);
  });

  it('PUT /:id/status should be protected', async () => {
    const res = await request(app).put('/api/evidence/123/status').send({ status: 'approved' });

    expect(res.status).toBe(401);
  });

  it('GET /pending should work with valid token', async () => {
    const res = await request(app)
      .get('/api/evidence/pending')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(200);
  });
});
