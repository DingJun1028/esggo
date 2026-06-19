import express, { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { junAiKeyService } from '../services/JunAiKeyService.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { OmniError, ErrorCode } from '../utils/omniError.js';

const router = express.Router();

// ============================================================================
// Rate Limiting Configuration
// ============================================================================

const interactionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 interaction requests per minute
  message: { error: 'Too many interactions, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: { error: 'Too many API requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply API limiter to all routes
router.use(apiLimiter);

// Redundant local error handler removed as we use global middleware

// ============================================================================
// Health Check Endpoint
// ============================================================================

/**
 * @swagger
 * /api/junaikey/health:
 *   get:
 *     summary: Health check for JunAiKey Service
 *     tags: [JunAiKey]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/health', asyncHandler(async (req: Request, res: Response) => {
  // Return simple ASCII-only response to avoid encoding issues
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.json({
    status: 'healthy',
    service: 'JunAiKey',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
}));

/**
 * @swagger
 * /api/junaikey/manifest:
 *   post:
 *     summary: Manifest an Agent Soul
 *     tags: [JunAiKey]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               agentId:
 *                 type: string
 */
router.post('/manifest', asyncHandler(async (req: Request, res: Response) => {
  const { agentId } = req.body;

  if (!agentId || typeof agentId !== 'string') {
    throw new OmniError('agentId is required and must be a string', 400, ErrorCode.VALIDATION_ERROR);
  }

  const soul = await junAiKeyService.manifest(agentId);
  if (!soul) {
    throw new OmniError('Agent not found', 404, ErrorCode.NOT_FOUND);
  }

  omniLogger.info(LogCategory.AI, `[JunAiKey] Agent manifested: ${agentId}`);
  return res.json(soul);
}));

/**
 * @swagger
 * /api/junaikey/interact:
 *   post:
 *     summary: Interact with an Agent (Streaming)
 *     tags: [JunAiKey]
 * */
router.post('/interact', interactionLimiter, asyncHandler(async (req: Request, res: Response) => {
  const { agentId, message, history } = req.body;

  if (!agentId || !message) {
    throw new OmniError('agentId and message are required', 400, ErrorCode.VALIDATION_ERROR);
  }

  if (typeof message !== 'string' || message.trim().length === 0) {
    throw new OmniError('message must be a non-empty string', 400, ErrorCode.VALIDATION_ERROR);
  }

  // SSE Setup
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // For Nginx

  try {
    omniLogger.info(LogCategory.AI, `[JunAiKey] Interaction started: agentId=${agentId}`);

    const stream = await junAiKeyService.interact({ agentId, message, history });

    for await (const chunk of stream) {
      const text = chunk.text();
      if (text) {
        res.write(`data: ${JSON.stringify({ type: 'text', content: text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error) {
    omniLogger.error(LogCategory.AI, `[JunAiKey] Interaction error: ${error}`);
    res.write(`data: ${JSON.stringify({ type: 'error', content: 'Interaction failed' })}\n\n`);
    res.end();
  }
}));

/**
 * @swagger
 * /api/junaikey/learn:
 *   post:
 *     summary: Inject knowledge into the Vector Store
 *     tags: [JunAiKey]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               metadata:
 *                 type: object
 */
router.post('/learn', asyncHandler(async (req: Request, res: Response) => {
  const { content, metadata } = req.body;

  if (!content || typeof content !== 'string') {
    throw new OmniError('Content is required and must be a string', 400, ErrorCode.VALIDATION_ERROR);
  }

  if (content.length > 100000) {
    throw new OmniError('Content exceeds maximum length of 100,000 characters', 400, ErrorCode.VALIDATION_ERROR);
  }

  const id = await junAiKeyService.learn({ content, metadata });

  omniLogger.info(LogCategory.KNOWLEDGE, `[JunAiKey] Knowledge learned: ${id}`);
  return res.json({
    success: true,
    id,
    timestamp: new Date().toISOString()
  });
}));

/**
 * @swagger
 * /api/junaikey/recall:
 *   post:
 *     summary: Retrieve relevant context
 *     tags: [JunAiKey]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *               limit:
 *                 type: number
 */
router.post('/recall', asyncHandler(async (req: Request, res: Response) => {
  const { query, limit } = req.body;

  if (!query || typeof query !== 'string') {
    throw new OmniError('Query is required and must be a string', 400, ErrorCode.VALIDATION_ERROR);
  }

  const context = await junAiKeyService.recall(query, limit);

  return res.json({
    context,
    query,
    limit: limit || 5,
    timestamp: new Date().toISOString()
  });
}));

// Export Router
export default router;
