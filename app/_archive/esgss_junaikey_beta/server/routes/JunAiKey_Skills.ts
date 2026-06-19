
import { Router, Request, Response } from 'express';
import { JunAiKeySkillsService } from '../services/JunAiKeySkillsService.js';
import { OmniTableService } from '../services/OmniTableService.js';
import { OmniCRMService } from '../services/OmniCRMService.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateRequest } from '../middleware/authMiddleware.js';
import { OmniError, ErrorCode, ValidationError } from '../utils/omniError.js';

const router = Router();

// ==================== Skill Registry (Omni_Table Capabilities) ====================
// These skills are advertised to the AI Agent (JunAiKey) to know what it can do.

const SKILL_REGISTRY = [
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
    },
    {
        name: 'create_note',
        description: 'Create a knowledge note (OmniNote) that automatically links to related content.',
        parameters: {
            type: 'object',
            properties: {
                title: { type: 'string', description: 'Title of the note' },
                content: { type: 'string', description: 'Content of the note' },
                tags: { type: 'string', description: 'Tags (comma separated)' }
            },
            required: ['title', 'content']
        }
    }
];

// ==================== Routes ====================

/**
 * GET /api/skills/registry
 * Returns the list of available Omni_Table skills.
 */
router.get('/registry', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    return res.json({
        success: true,
        data: {
            skills: SKILL_REGISTRY
        }
    });
}));

/**
 * POST /api/skills/dispatch
 * NL Interface: Accepts natural language, determines intent, and calls execute.
 */
router.post('/dispatch', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { prompt } = req.body;
    const userId = (req as any).user?.userId;

    if (!prompt) {
        throw new ValidationError('Prompt is required');
    }

    omniLogger.info(LogCategory.AI, `[JunAiKey] Dispatching prompt: "${prompt}"`, { userId });

    // In production, this would use JunAiKeySkillsService to parse intent via LLM.
    let skillName = '';

    if (prompt.includes('chart') || prompt.includes('graph')) skillName = 'generate_chart';
    else if (prompt.includes('table') || prompt.includes('list')) skillName = 'generate_table';
    else if (prompt.includes('dashboard')) skillName = 'generate_dashboard';
    else skillName = 'unknown';

    if (skillName === 'unknown') {
        return res.json({
            success: false,
            message: "I'm not sure how to help with that yet. Try asking for a chart, table, or dashboard."
        });
    }

    // Delegate to OmniTableService
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
 * POST /api/skills/execute
 * Direct Skill Execution (Structured Input)
 */
router.post('/execute', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { skill, parameters } = req.body;
    const userId = (req as any).user?.userId;

    if (!skill || !parameters) {
        throw new ValidationError('Skill and parameters are required');
    }

    omniLogger.info(LogCategory.AI, `[JunAiKey] Executing skill: ${skill}`, { parameters, userId });

    let result;
    if (skill.startsWith('generate_')) {
        result = await OmniTableService.generate({
            type: skill.replace('generate_', '') as any,
            prompt: parameters.prompt
        });
    } else {
        throw new OmniError('Skill not found', 404, ErrorCode.NOT_FOUND);
    }

    return res.json({ success: true, data: { result } });
}));

/**
 * Omni_CRM Skills (AI-Driven)
 */
router.post('/crm/contact', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { prompt } = req.body;
    if (!prompt) throw new ValidationError('Prompt required');

    const result = await OmniCRMService.createContactFromNL(prompt);
    return res.json({ success: true, data: result });
}));

router.post('/crm/deal', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { prompt } = req.body;
    if (!prompt) throw new ValidationError('Prompt required');

    const result = await OmniCRMService.createDealFromNL(prompt);
    return res.json({ success: true, data: result });
}));

router.post('/crm/bd', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { company, industry } = req.body;
    if (!company) throw new ValidationError('Company required');

    const result = await OmniCRMService.startBDDevelopment({ company, industry });
    return res.json({ success: true, data: result });
}));

export default router;
