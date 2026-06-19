import { vi, describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';

// Set Env
process.env.API_SECRET_TOKEN = 'TEST_SECRET';
process.env.NODE_ENV = 'test';

// Mock Dependencies
const mockMiddleware = (req, res, next) => next();
const createMockRouter = () => {
  const router = express.Router();
  router.get('/', (req, res) => res.send('mock'));
  router.post('/', (req, res) => res.send('mock'));
  return router;
};

// Mock DB
vi.mock('../db/index.js', () => ({
  default: {
    query: vi.fn(),
    on: vi.fn(),
    connect: vi.fn(),
    end: vi.fn(),
  },
  query: vi.fn(),
  healthCheck: vi.fn(),
  initializeDatabase: vi.fn().mockResolvedValue(true),
}));

// Mock Services
vi.mock('../services/rag.js', () => ({ default: {} }));
vi.mock('../services/redisService.js', () => ({
  default: { healthCheck: vi.fn() },
}));
vi.mock('../controllers/metricsController.js', () => ({ getMetrics: vi.fn() }));
vi.mock('../services/newsService.js', () => ({ getGlobalNews: vi.fn() }));
vi.mock('../services/amice.js', () => ({
  default: { validateSignature: vi.fn() },
}));
vi.mock('../services/sessionService.js', () => ({
  default: { createSession: vi.fn() },
}));
vi.mock('../services/swarmService.js', () => ({ runSwarm: vi.fn() }));
vi.mock('../services/blockchain.js', () => ({
  default: { anchorHash: vi.fn() },
}));
vi.mock('../services/zkpService.js', () => ({
  default: { verifyProof: vi.fn() },
}));
vi.mock('../services/universalAgentService.js', () => ({
  default: { logStep: vi.fn() },
}));

// Mock Routes
vi.mock('../routes/agentRoutes.js', () => ({ default: createMockRouter() }));
vi.mock('../routes/evidenceRoutes.js', () => ({ default: createMockRouter() }));
vi.mock('../routes/profileRoutes.js', () => ({ default: createMockRouter() }));
vi.mock('../routes/taskRoutes.js', () => ({ default: createMockRouter() }));
vi.mock('../api/jun-ai-key.js', () => ({ default: createMockRouter() }));
vi.mock('../api/verification.js', () => ({ default: createMockRouter() }));

// Mock OCR & Evidence
vi.mock('../ocrService.js', () => ({ extractDataFromPdf: vi.fn() }));
vi.mock('../services/evidenceService.js', () => ({ addEvidence: vi.fn() }));
vi.mock('../services/storageService.js', () => ({
  uploadFile: vi.fn(),
  deleteFile: vi.fn(),
}));

// Mock Classes
vi.mock('../services/AgentCore.js', () => ({ AgentCore: class {} }));
vi.mock('../services/AuditSelfHealingService.js', () => ({
  AuditSelfHealingService: class {},
}));
vi.mock('../services/OmniHeartbeat.js', () => ({
  OmniHeartbeat: class {
    start() {}
    checkIntegrity() {}
  },
}));
vi.mock('../services/OmniEvolutionEngine.js', () => ({
  OmniEvolutionEngine: class {},
}));
vi.mock('../services/TalentPassportService.js', () => ({
  TalentPassportService: class {},
}));
vi.mock('../services/TypstService.js', () => ({ TypstService: class {} }));
vi.mock('../services/BerkeleyCertificationService.js', () => ({
  BerkeleyCertificationService: class {},
}));
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return { startChat: () => ({ sendMessageStream: () => ({ stream: [] }) }) };
    }
  },
}));

// Import App
const { app } = await import('../server.js');

describe('API Security Sentinel Check', () => {
  // 🚨 CRITICAL: File Upload
  it('should block unauthenticated access to /api/upload-and-extract', async () => {
    const res = await request(app)
      .post('/api/upload-and-extract')
      .send();

    if (res.status !== 401 && res.status !== 403) {
      throw new Error(`Expected 401/403, got ${res.status}. Endpoint is unprotected!`);
    }
  });

  // 🚨 CRITICAL: Agent Manifestation
  it('should block unauthenticated access to /api/manifest', async () => {
    const res = await request(app).post('/api/manifest').send({ source_agent: 'test' });

    if (res.status !== 401 && res.status !== 403) {
      throw new Error(`Expected 401/403, got ${res.status}. Endpoint is unprotected!`);
    }
  });

  // ✨ Enhancement: Learn Endpoint
  it('should block unauthenticated access to /api/learn', async () => {
    const res = await request(app).post('/api/learn').send({ text: 'knowledge' });

    if (res.status !== 401 && res.status !== 403) {
      throw new Error(`Expected 401/403, got ${res.status}. Endpoint is unprotected!`);
    }
  });

  // ✨ Enhancement: Knowledge Search
  it('should block unauthenticated access to /api/knowledge/search', async () => {
    const res = await request(app).get('/api/knowledge/search').query({ query: 'test' });
    if (res.status !== 401 && res.status !== 403) {
      throw new Error(`Expected 401/403, got ${res.status}. Endpoint is unprotected!`);
    }
  });
});
