
/**
 * 🏢 JunAiKey_Skills (OmniTable) - 奧秘表格技能路由
 * --------------------------------------------------
 */

import { Router, Request, Response } from 'express';
import { OmniTableService } from '../services/OmniTableService.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateRequest } from '../middleware/authMiddleware.js';
import { ValidationError, OmniError, ErrorCode } from '../utils/omniError.js';

const router = Router();

// ==================== Skill Registry (OmniTable Capabilities) ====================
// These skills are advertised to the AI Agent (JunAiKey) to know what it can do.

const OMNITABLE_SKILL_REGISTRY = [
    {
        name: 'generate_chart',
        description: 'Generate a visual chart (bar, line, pie) based on data or description.',
        parameters: {
            type: 'object',
            properties: {
                prompt: { type: 'string', description: 'Description of the chart to generate (e.g., "Bar chart of Q1 revenue")' },
            },
            required: ['prompt']
        }
    },
    {
        name: 'generate_table',
        description: 'Generate a data table structure and mock data.',
        parameters: {
            type: 'object',
            properties: {
                prompt: { type: 'string', description: 'Description of the table (e.g., "List of employee tasks")' },
            },
            required: ['prompt']
        }
    },
    {
        name: 'generate_dashboard',
        description: 'Generate a full dashboard layout with multiple components.',
        parameters: {
            type: 'object',
            properties: {
                prompt: { type: 'string', description: 'Description of the dashboard (e.g., "Sales overview with a timeline")' },
            },
            required: ['prompt']
        }
    }
];

// ==================== Routes ====================

/**
 * GET /api/skills/omni-table/registry
 */
router.get('/registry', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    return res.json({
        success: true,
        data: { skills: OMNITABLE_SKILL_REGISTRY }
    });
}));

/**
 * POST /api/skills/omni-table/dispatch
 */
router.post('/dispatch', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { prompt } = req.body;
    const userId = (req as any).user?.userId;

    if (!prompt) throw new ValidationError('Prompt is required');

    omniLogger.info(LogCategory.AI, `[JunAiKey_Skills (OmniTable)] Dispatching prompt: "${prompt}"`, { userId });

    let skillName = '';
    if (prompt.includes('chart') || prompt.includes('graph')) skillName = 'generate_chart';
    else if (prompt.includes('table') || prompt.includes('list')) skillName = 'generate_table';
    else if (prompt.includes('dashboard')) skillName = 'generate_dashboard';
    else skillName = 'unknown';

    if (skillName === 'unknown') {
        return res.json({
            success: false,
            message: "I'm not sure how to help with that yet."
        });
    }

    const result = await OmniTableService.generate({
        type: skillName.replace('generate_', '') as any,
        prompt
    });

    return res.json({
        success: true,
        data: {
            skill: skillName,
            result
        }
    });
}));

/**
 * POST /api/skills/omni-table/execute
 */
router.post('/execute', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { skill, parameters } = req.body;
    const userId = (req as any).user?.userId;

    if (!skill || !parameters) throw new ValidationError('Skill and parameters required');

    omniLogger.info(LogCategory.AI, `[JunAiKey_Skills (OmniTable)] Executing skill: ${skill}`, { parameters, userId });

    let result;
    if (skill.startsWith('generate_')) {
        result = await OmniTableService.generate({
            type: skill.replace('generate_', '') as any,
            prompt: parameters.prompt
        });
    } else {
        throw new OmniError('Skill not found', 404, ErrorCode.NOT_FOUND);
    }

    return res.json({ success: true, data: result });
}));

// OmniTable Sync Operations
router.post('/sync/customer', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { customerId } = req.body;
    const result = await OmniTableService.syncCustomerToOmniTable(customerId);
    return res.json({ success: true, data: result });
}));

router.post('/sync/project', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.body;
    const result = await OmniTableService.syncProjectToOmniTable(projectId);
    return res.json({ success: true, data: result });
}));

router.post('/sync/metric', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { metricId } = req.body;
    const result = await OmniTableService.syncMetricToOmniTable(metricId);
    return res.json({ success: true, data: result });
}));

router.post('/sync/evidence', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { evidenceId } = req.body;
    const result = await OmniTableService.syncEvidenceToOmniTable(evidenceId);
    return res.json({ success: true, data: result });
}));

export default router;
