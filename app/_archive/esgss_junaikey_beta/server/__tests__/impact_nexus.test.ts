
import { vi, describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';

// Set Env
process.env.API_SECRET_TOKEN = 'TEST_SECRET';
process.env.NODE_ENV = 'test';

// Mock Dependencies
vi.mock('../db/index.js', () => ({
    default: {
        query: vi.fn(),
    },
    query: vi.fn(),
    healthCheck: vi.fn(),
    initializeDatabase: vi.fn().mockResolvedValue(true),
}));

vi.mock('../services/redisService.js', () => ({
    default: {
        healthCheck: vi.fn(),
        get: vi.fn(),
        set: vi.fn(),
    },
}));

vi.mock('../services/amice.js', () => ({ default: {} }));
vi.mock('../services/sessionService.js', () => ({ default: {} }));
vi.mock('../services/swarmService.js', () => ({ runSwarm: vi.fn() }));
vi.mock('../services/blockchain.js', () => ({ default: {} }));
vi.mock('../services/zkpService.js', () => ({ default: {} }));
vi.mock('../services/universalAgentService.js', () => ({ default: {} }));

// Mock Auth Middleware to bypass for test
vi.mock('../src/middleware/authRequest.js', () => ({
    authenticateRequest: (req, res, next) => next()
}));

// Mock other routes to avoid loading them
const createMockRouter = () => express.Router();
vi.mock('../routes/agentRoutes.js', () => ({ default: createMockRouter() }));
vi.mock('../routes/evidenceRoutes.js', () => ({ default: createMockRouter() }));
vi.mock('../routes/profileRoutes.js', () => ({ default: createMockRouter() }));
vi.mock('../routes/taskRoutes.js', () => ({ default: createMockRouter() }));
vi.mock('../api/jun-ai-key.js', () => ({ default: createMockRouter() }));
vi.mock('../api/verification.js', () => ({ default: createMockRouter() }));
vi.mock('../routes/marketIntelligenceRoutes.js', () => ({ default: createMockRouter() }));
vi.mock('../api/jun-ai-key.js', () => ({ default: createMockRouter() }));
vi.mock('../src/routes/unifiedAdvancementRoutes.js', () => ({ default: createMockRouter() }));

// Import App (dynamic import to ensure mocks apply)
const { app } = await import('../server.ts');
import redisService from '../services/redisService.js';
import { query } from '../db/index.js';

describe('Impact Nexus Game API', () => {
    const userId = 'test-user-123';
    const mockState = { level: 1, xp: 100 };

    it('POST /api/game/sync - should sync game state to Redis', async () => {
        (redisService.set as any).mockResolvedValue(true);

        const res = await request(app)
            .post('/api/game/sync')
            .send({ userId, state: mockState });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(redisService.set).toHaveBeenCalledWith(
            `game:impact_nexus:user:${userId}`,
            mockState,
            86400
        );
    });

    it('GET /api/game/state/:userId - should retrieve game state from Redis', async () => {
        (redisService.get as any).mockResolvedValue(mockState);

        const res = await request(app).get(`/api/game/state/${userId}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.state).toEqual(mockState);
    });

    it('POST /api/game/crystallize - should save 5T proof to DB', async () => {
        // Mock successful DB insert
        (query as any).mockResolvedValue({
            rows: [{ id: 'battle-rec-001' }]
        });

        const sessionData = {
            uuid: 'session-uuid',
            evidence: {
                trustworthy: { hash_lock: 'sha256-hash-mock' }
            },
            data: { playerSoul: { xp: 500 } }
        };

        const res = await request(app)
            .post('/api/game/crystallize')
            .send({ userId, sessionData });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.status).toBe('PERMANENTLY_RECORDED');
        expect(query).toHaveBeenCalled();
    });
});
