import { Router } from 'express';
import { getAgents, getAgentById, createAgent, calibrateAgent, crystallizeAgent } from '../controllers/agentController.js';
import { readLimiter, writeLimiter, sensitiveOperationLimiter } from '../middleware/rateLimiters.js';
import { authenticateRequest } from '../middleware/authMiddleware.js';
import { cacheMiddleware } from '../middleware/cacheMiddleware.js';

const router = Router();

// Cache agent list for 60s — short TTL balances freshness with DB load reduction
router.get('/', authenticateRequest, readLimiter, cacheMiddleware({ ttl: 60, keyPrefix: 'agents' }), getAgents);
// Cache single agent for 5 min — matches service-level getOrSet TTL
router.get('/:id', authenticateRequest, readLimiter, cacheMiddleware({ ttl: 300, keyPrefix: 'agents' }), getAgentById);
router.post('/', authenticateRequest, writeLimiter, createAgent);
router.post('/:id/calibrate', authenticateRequest, sensitiveOperationLimiter, calibrateAgent);
router.post('/:id/crystallize', authenticateRequest, sensitiveOperationLimiter, crystallizeAgent);

export default router;
