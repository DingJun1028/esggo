/**
 * 🏢 JunAiKey_Skills (OmniCRM) - 奧秘 CRM 技能路由
 * --------------------------------------------------
 */

import { Router, Request, Response } from 'express';
import { OmniCRMService } from '../services/OmniCRMService.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateRequest } from '../middleware/authMiddleware.js';
import { ValidationError } from '../utils/omniError.js';

const router = Router();

// ==================== Skill Registry (OmniCRM Capabilities) ====================
// These skills are advertised to the AI Agent (JunAiKey) to know what it can do.

const OMNICRM_SKILL_REGISTRY = [
    {
        name: 'crm_create_contact',
        description: 'Create a new contact in the CRM system using natural language description.',
        parameters: {
            type: 'object',
            properties: {
                prompt: { type: 'string', description: 'Natural language description of the contact (e.g., "Create contact for John Doe at Acme Inc as CEO")' },
            },
            required: ['prompt']
        }
    },
    {
        name: 'crm_create_deal',
        description: 'Create a new deal/opportunity in the CRM system using natural language.',
        parameters: {
            type: 'object',
            properties: {
                prompt: { type: 'string', description: 'Natural language description of the deal (e.g., "Create deal for 100k with Acme Inc")' },
            },
            required: ['prompt']
        }
    },
    {
        name: 'crm_bd_development',
        description: 'Start business development for a new company/industry.',
        parameters: {
            type: 'object',
            properties: {
                company: { type: 'string', description: 'The company name' },
                industry: { type: 'string', description: 'The industry sector' },
            },
            required: ['company', 'industry']
        }
    },
    {
        name: 'crm_query_contact',
        description: 'Query contacts from the CRM system.',
        parameters: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'Search query for contacts' },
            },
            required: ['query']
        }
    },
    {
        name: 'crm_query_deal',
        description: 'Query deals/opportunities from the CRM system.',
        parameters: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'Search query for deals' },
            },
            required: ['query']
        }
    }
];

// ==================== Routes ====================

/**
 * GET /api/skills/omni-crm/registry
 */
router.get('/registry', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    return res.json({
        success: true,
        data: { skills: OMNICRM_SKILL_REGISTRY }
    });
}));

/**
 * POST /api/skills/omni-crm/dispatch
 */
router.post('/dispatch', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { prompt } = req.body;
    const userId = (req as any).user?.userId;

    if (!prompt) throw new ValidationError('Prompt is required');

    omniLogger.info(LogCategory.AI, `[JunAiKey_Skills (OmniCRM)] Dispatching prompt: "${prompt}"`, { userId });

    let skillName = '';
    if (prompt.includes('contact') || prompt.includes('person')) skillName = 'crm_create_contact';
    else if (prompt.includes('deal') || prompt.includes('opportunity') || prompt.includes('sale')) skillName = 'crm_create_deal';
    else if (prompt.includes('BD') || prompt.includes('business development')) skillName = 'crm_bd_development';
    else if (prompt.includes('find') || prompt.includes('search')) {
        if (prompt.includes('contact')) skillName = 'crm_query_contact';
        else if (prompt.includes('deal')) skillName = 'crm_query_deal';
        else skillName = 'crm_query_contact';
    } else {
        skillName = 'unknown';
    }

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
 * POST /api/skills/omni-crm/execute
 */
router.post('/execute', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { skill, parameters } = req.body;
    const userId = (req as any).user?.userId;

    if (!skill || !parameters) throw new ValidationError('Skill and parameters required');

    omniLogger.info(LogCategory.AI, `[JunAiKey_Skills (OmniCRM)] Executing skill: ${skill}`, { parameters, userId });

    let result;
    switch (skill) {
        case 'crm_create_contact':
            result = await OmniCRMService.createContactFromNL(parameters.prompt);
            break;
        case 'crm_create_deal':
            result = await OmniCRMService.createDealFromNL(parameters.prompt);
            break;
        case 'crm_bd_development':
            result = await OmniCRMService.startBDDevelopment({
                company: parameters.company,
                industry: parameters.industry
            });
            break;
        default:
            return res.status(404).json({ success: false, error: 'Skill not found' });
    }

    return res.json({ success: true, data: result });
}));

router.post('/contact', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { prompt } = req.body;
    const result = await OmniCRMService.createContactFromNL(prompt);
    return res.json({ success: true, data: result });
}));

router.post('/deal', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { prompt } = req.body;
    const result = await OmniCRMService.createDealFromNL(prompt);
    return res.json({ success: true, data: result });
}));

router.post('/bd', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { company, industry } = req.body;
    const result = await OmniCRMService.startBDDevelopment({ company, industry });
    return res.json({ success: true, data: result });
}));

export default router;
