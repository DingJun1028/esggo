import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Set Env
process.env.API_SECRET_TOKEN = 'TEST_SECRET';
process.env.NODE_ENV = 'test';

// Mock Dependencies
const mockMiddleware = (req, res, next) => next();

// Mock DB
jest.unstable_mockModule('../db/index.js', () => ({
  default: {
    query: jest.fn(),
    on: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
  },
  query: jest.fn(),
  healthCheck: jest.fn(),
  initializeDatabase: jest.fn().mockResolvedValue(true),
}));

// Mock Services
jest.unstable_mockModule('../services/rag.js', () => ({ default: {} }));
jest.unstable_mockModule('../services/redisService.js', () => ({
  default: { healthCheck: jest.fn() },
}));
jest.unstable_mockModule('../controllers/metricsController.js', () => ({ getMetrics: jest.fn() }));
jest.unstable_mockModule('../services/newsService.js', () => ({ getGlobalNews: jest.fn() }));
jest.unstable_mockModule('../services/amice.js', () => ({
  default: { validateSignature: jest.fn() },
}));
jest.unstable_mockModule('../services/sessionService.js', () => ({
  default: { createSession: jest.fn() },
}));
jest.unstable_mockModule('../services/swarmService.js', () => ({ runSwarm: jest.fn() }));
jest.unstable_mockModule('../services/blockchain.js', () => ({
  default: { anchorHash: jest.fn() },
}));
jest.unstable_mockModule('../services/zkpService.js', () => ({
  default: { verifyProof: jest.fn() },
}));
jest.unstable_mockModule('../services/omniAgentService.js', () => ({
  default: {
    logStep: jest.fn().mockResolvedValue({ status: 'ok' }),
    finishTask: jest.fn().mockResolvedValue({ status: 'ok' }),
    lockProject: jest.fn().mockResolvedValue({ status: 'ok' }),
  },
}));

// Mock Routers
const createMockRouter = () => {
  const r = express.Router();
  r.get('/', (req, res) => res.send('mock'));
  return r;
};

jest.unstable_mockModule('../routes/agentRoutes.js', () => ({ default: createMockRouter() }));
jest.unstable_mockModule('../routes/evidenceRoutes.js', () => ({ default: createMockRouter() }));
jest.unstable_mockModule('../routes/profileRoutes.js', () => ({ default: createMockRouter() }));
jest.unstable_mockModule('../routes/taskRoutes.js', () => ({ default: createMockRouter() }));
jest.unstable_mockModule('../api/jun-ai-key.js', () => ({ default: createMockRouter() }));
jest.unstable_mockModule('../api/verification.js', () => ({ default: createMockRouter() }));

// Mock OCR & Evidence
jest.unstable_mockModule('../ocrService.js', () => ({ extractDataFromPdf: jest.fn() }));
jest.unstable_mockModule('../services/evidenceService.js', () => ({ addEvidence: jest.fn() }));
jest.unstable_mockModule('../services/storageService.js', () => ({
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
}));

// Mock Classes
jest.unstable_mockModule('../services/AgentCore.js', () => ({ AgentCore: class { } }));
jest.unstable_mockModule('../services/AuditSelfHealingService.js', () => ({
  AuditSelfHealingService: class { },
}));
jest.unstable_mockModule('../services/OmniHeartbeat.js', () => ({
  OmniHeartbeat: class {
    start() { }
    checkIntegrity() { }
  },
}));
jest.unstable_mockModule('../services/OmniEvolutionEngine.js', () => ({
  OmniEvolutionEngine: class { },
}));
jest.unstable_mockModule('../services/TalentPassportService.js', () => ({
  TalentPassportService: class { },
}));
jest.unstable_mockModule('../services/TypstService.js', () => ({ TypstService: class { } }));
jest.unstable_mockModule('../services/BerkeleyCertificationService.js', () => ({
  BerkeleyCertificationService: class { },
}));
jest.unstable_mockModule('@google/generative-ai', () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return { startChat: () => ({ sendMessageStream: () => ({ stream: [] }) }) };
    }
  },
}));

// Import App
const { app } = await import('../server.js');

describe('Omni Agent Security Check', () => {
  it('should block unauthenticated access to /api/v1/log-step', async () => {
    const res = await request(app).post('/api/v1/log-step').send({ log: 'test' });

    if (res.status !== 401 && res.status !== 403) {
      throw new Error(`Expected 401/403, got ${res.status}. Endpoint is unprotected!`);
    }
  });

  it('should block unauthenticated access to /api/v1/task-finish', async () => {
    // Current implementation uses app.use, so GET/POST might both work if unprotected.
    // We test POST as that's the intended method.
    const res = await request(app).post('/api/v1/task-finish').send({ taskId: '123' });

    if (res.status !== 401 && res.status !== 403) {
      throw new Error(`Expected 401/403, got ${res.status}. Endpoint is unprotected!`);
    }
  });

  it('should block unauthenticated access to /api/v1/project-lock', async () => {
    const res = await request(app).post('/api/v1/project-lock').send({ projectId: '123' });

    if (res.status !== 401 && res.status !== 403) {
      throw new Error(`Expected 401/403, got ${res.status}. Endpoint is unprotected!`);
    }
  });
});
