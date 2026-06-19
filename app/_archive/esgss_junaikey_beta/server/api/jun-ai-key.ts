import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { MCPService } from '../services/MCPService.js';
import { AnalysisService } from '../services/AnalysisService.js';
import { readLimiter, writeLimiter } from '../middleware/rateLimiters.js';
import { OmniError, ErrorCode } from '../utils/omniError.js';

const router = express.Router();
const mcpService = new MCPService();
const analysisService = new AnalysisService();

const API_CONFIG = {
  apiKey: process.env.VITE_JUNAIKEY_API_KEY || 'your_secret_api_key',
};

// 🛡️ Sentinel: Warn if using default secret
if (API_CONFIG.apiKey === 'your_secret_api_key') {
  console.warn(
    '⚠️ [SECURITY] JunAiKey API is using the default unsafe API Key. Please set VITE_JUNAIKEY_API_KEY.'
  );
}

export const authenticate = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers['x-api-key'] || req.headers['authorization'];
  const apiKey = typeof authHeader === 'string' ? authHeader.replace('Bearer ', '') : undefined;

  if (!apiKey) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized. Missing API key.' });
  }

  // 🛡️ Sentinel: Constant-time comparison to prevent timing attacks
  const inputHash = crypto.createHash('sha256').update(apiKey).digest();
  const validHash = crypto.createHash('sha256').update(API_CONFIG.apiKey).digest();

  if (!crypto.timingSafeEqual(inputHash, validHash)) {
    return next(new OmniError('Unauthorized. Invalid API key.', 401, ErrorCode.UNAUTHORIZED));
  }
  return next();
};

router.post('/execute', writeLimiter, authenticate, async (req: Request, res: Response, next: NextFunction) => {
  const { endpoint, params } = req.body;
  let result;

  try {
    switch (endpoint) {
      case 'fetch':
        result = await mcpService.fetchAsMarkdown(params.url, params.selector);
        break;
      case 'sequential-thinking':
        result = await mcpService.solveProblem(params.problem, params.steps);
        break;
      case 'deploy-page':
        result = await mcpService.deployContent(params.content, params.isMarkdown);
        break;
      case 'arxiv-search':
        result = await mcpService.searchArxiv(params.query, params.maxResults);
        break;
      case 'context7-docs':
        result = await mcpService.getContext7Docs(params.library, params.version);
        break;
      case 'analyze-trend':
        result = await analysisService.analyzeTrend(params.data);
        break;
      default:
        result = { status: 'error', message: 'Unknown endpoint.' };
    }

    return res.status(result?.status === 'success' ? 200 : 400).json(result ?? { status: 'error', message: 'Unknown endpoint.' });
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/arxiv-search', readLimiter, authenticate, async (req: Request, res: Response, next: NextFunction) => {
  const { query, maxResults } = req.query as { query?: string; maxResults?: string };
  const result = await mcpService.searchArxiv(query ?? '', Number(maxResults) || 5);
  return res.json(result);
});

// Direct endpoint for fetch-url (called by client)
router.post('/fetch-url', writeLimiter, authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ status: 'error', message: 'URL is required' });
    }
    const result = await mcpService.fetchAsMarkdown(url);
    return res.json(result);
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('[JunAiKey] Fetch URL error:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

// Direct endpoint for analyze-trend (called by client)
router.post('/analyze-trend', writeLimiter, authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data } = req.body;
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ status: 'error', message: 'Data array is required' });
    }
    const result = await analysisService.analyzeTrend(data);
    return res.json(result);
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('[JunAiKey] Analyze trend error:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
