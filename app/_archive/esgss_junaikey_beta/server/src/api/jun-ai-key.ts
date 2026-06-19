import express from 'express';
import { MCPService, ApiResponse } from '../services/MCPService.js';

const router = express.Router();
const mcpService = new MCPService();

// Core Configuration
const API_CONFIG = {
  apiKey: process.env.VITE_JUNAIKEY_API_KEY || 'your_secret_api_key',
};

// Middleware for authentication
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

  if (apiKey !== API_CONFIG.apiKey) {
    res.status(401).json({ status: 'error', message: 'Unauthorized. Invalid API key.' });
    return;
  }
  next();
};

/**
 * Unified Request Handler
 * POST /api/v1/jun-ai-key/execute
 * Body: { endpoint: string, params: any }
 */
router.post('/execute', authenticate, async (req, res) => {
  const { endpoint, params } = req.body;

  let result: ApiResponse<any>;

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
      default:
        result = { status: 'error', message: 'Unknown endpoint.' };
    }

    res.status(result.status === 'success' ? 200 : 400).json(result);
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Individual endpoints for convenience
router.get('/arxiv-search', authenticate, async (req, res) => {
  const { query, maxResults } = req.query;
  const result = await mcpService.searchArxiv(query as string, Number(maxResults) || 5);
  res.json(result);
});

export default router;
