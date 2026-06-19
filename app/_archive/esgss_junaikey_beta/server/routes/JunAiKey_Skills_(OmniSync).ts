/**
 * 🔄 JunAiKey_Skills (OmniSync) - 奧秘同步技能路由
 * --------------------------------------------------
 */

import { Router, Request, Response } from 'express';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateRequest } from '../middleware/authMiddleware.js';
import { ValidationError } from '../utils/omniError.js';

const router = Router();

// ==================== Skill Registry (OmniSync Capabilities) ====================
// These skills are advertised to the AI Agent (JunAiKey) to know what it can do.

const OMNISYNC_SKILL_REGISTRY = [
    {
        name: 'sync_broadcast',
        description: 'Broadcast a resonance update to all connected tabs for cross-tab synchronization.',
        parameters: {
            type: 'object',
            properties: {
                uuid: { type: 'string', description: 'The UUID of the entity to sync' },
                dimension: { type: 'string', description: 'The resonance dimension' },
                resonance: { type: 'number', description: 'The resonance value' },
            },
            required: ['uuid', 'dimension', 'resonance']
        }
    },
    {
        name: 'sync_awaken',
        description: 'Broadcast an awakening event to all connected tabs.',
        parameters: {
            type: 'object',
            properties: {
                sourceUuid: { type: 'string', description: 'The UUID of the source of awakening' },
            },
            required: ['sourceUuid']
        }
    },
    {
        name: 'sync_subscribe',
        description: 'Subscribe to cross-tab synchronization events.',
        parameters: {
            type: 'object',
            properties: {
                eventType: { type: 'string', description: 'The type of event to subscribe to' },
            },
            required: ['eventType']
        }
    }
];

// ==================== Routes ====================

/**
 * GET /api/skills/omni-sync/registry
 */
router.get('/registry', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    return res.json({
        success: true,
        data: { skills: OMNISYNC_SKILL_REGISTRY }
    });
}));

/**
 * POST /api/skills/omni-sync/dispatch
 */
router.post('/dispatch', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { prompt } = req.body;
    const userId = (req as any).user?.userId;

    if (!prompt) throw new ValidationError('Prompt is required');

    omniLogger.info(LogCategory.AI, `[JunAiKey_Skills (OmniSync)] Dispatching prompt: "${prompt}"`, { userId });

    let skillName = '';
    if (prompt.includes('broadcast') || prompt.includes('sync')) skillName = 'sync_broadcast';
    else if (prompt.includes('awaken') || prompt.includes('wake')) skillName = 'sync_awaken';
    else if (prompt.includes('subscribe') || prompt.includes('listen')) skillName = 'sync_subscribe';
    else skillName = 'unknown';

    if (skillName === 'unknown') {
        return res.json({
            success: false,
            message: "I'm not sure how to help with that yet."
        });
    }

    return res.json({
        success: true,
        data: {
            skill: skillName,
            message: `Intent recognized: ${skillName}`
        }
    });
}));

/**
 * POST /api/skills/omni-sync/execute
 */
router.post('/execute', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { skill, parameters } = req.body;
    const userId = (req as any).user?.userId;

    if (!skill || !parameters) throw new ValidationError('Skill and parameters required');

    omniLogger.info(LogCategory.AI, `[JunAiKey_Skills (OmniSync)] Executing skill: ${skill}`, { parameters, userId });

    return res.json({
        success: true,
        data: {
            message: `OmniSync skill ${skill} executed.`,
            skill,
            parameters
        }
    });
}));

/**
 * GET /api/skills/omni-sync/status
 */
router.get('/status', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    return res.json({
        success: true,
        data: {
            status: 'active',
            message: 'OmniSync cross-tab synchronization is active'
        }
    });
}));

export default router;
