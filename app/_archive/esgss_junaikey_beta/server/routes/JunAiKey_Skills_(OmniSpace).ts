/**
 * 🌌 JunAiKey_Skills (OmniSpace) - 奧秘空間技能路由
 * --------------------------------------------------
 * 提供空間感應 (Spatial Sensing) 與環境建模 (Environmental Modeling) 能力。
 */

import { Router, Request, Response } from 'express';
import { OmniSpaceService } from '../services/OmniSpaceService.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateRequest } from '../middleware/authMiddleware.js';
import { ValidationError } from '../utils/omniError.js';

const router = Router();

// ==================== Skill Registry (OmniSpace Capabilities) ====================

const OMNISPACE_SKILL_REGISTRY = [
    {
        name: 'space_sense_data',
        description: 'Sense and analyze spatial/environmental data from natural language descriptions.',
        parameters: {
            type: 'object',
            properties: {
                prompt: { type: 'string', description: 'Description of the spatial context to sense (e.g., "Sense environmental stats for the main hallway")' },
            },
            required: ['prompt']
        }
    },
    {
        name: 'space_create_model',
        description: 'Create a new digital twin or environmental model.',
        parameters: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'The name of the environment model' },
                type: { type: 'string', enum: ['GEOSPATIAL', 'ARCHITECTURAL', 'ENVIRONMENTAL'], description: 'The type of model' },
            },
            required: ['name', 'type']
        }
    },
    {
        name: 'space_query_metrics',
        description: 'Query 5T spatial metrics and impact data.',
        parameters: {
            type: 'object',
            properties: {
                entityId: { type: 'string', description: 'The ID of the spatial entity' },
            },
            required: ['entityId']
        }
    }
];

// ==================== Routes ====================

/**
 * GET /api/skills/omni-space/registry
 */
router.get('/registry', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    return res.json({
        success: true,
        data: { skills: OMNISPACE_SKILL_REGISTRY }
    });
}));

/**
 * POST /api/skills/omni-space/dispatch
 */
router.post('/dispatch', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { prompt } = req.body;
    const userId = (req as any).user?.userId;

    if (!prompt) throw new ValidationError('Prompt is required');

    omniLogger.info(LogCategory.AI, `[JunAiKey_Skills (OmniSpace)] Dispatching prompt: "${prompt}"`, { userId });

    let skillName = 'unknown';
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes('sense') || lowerPrompt.includes('analyze') || lowerPrompt.includes('stat')) {
        skillName = 'space_sense_data';
    } else if (lowerPrompt.includes('model') || lowerPrompt.includes('twin') || lowerPrompt.includes('build')) {
        skillName = 'space_create_model';
    } else if (lowerPrompt.includes('metric') || lowerPrompt.includes('impact') || lowerPrompt.includes('5t')) {
        skillName = 'space_query_metrics';
    }

    if (skillName === 'unknown') {
        return res.json({
            success: false,
            message: "Spatial awareness intent not recognized. Try 'sense', 'model', or 'metrics'."
        });
    }

    return res.json({
        success: true,
        data: {
            skill: skillName,
            message: `Spatial intent recognized: ${skillName}`
        }
    });
}));

/**
 * POST /api/skills/omni-space/execute
 */
router.post('/execute', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { skill, parameters } = req.body;
    const userId = (req as any).user?.userId;

    if (!skill || !parameters) throw new ValidationError('Skill and parameters required');

    omniLogger.info(LogCategory.AI, `[JunAiKey_Skills (OmniSpace)] Executing skill: ${skill}`, { parameters, userId });

    let result;
    switch (skill) {
        case 'space_sense_data':
            result = await OmniSpaceService.senseSpatialData(parameters.prompt);
            break;
        case 'space_create_model':
            result = await OmniSpaceService.createEnvironmentModel({
                name: parameters.name,
                type: parameters.type
            });
            break;
        case 'space_query_metrics':
            result = await OmniSpaceService.get5TMetrics(parameters.entityId);
            break;
        default:
            return res.status(404).json({ success: false, error: 'Skill not found' });
    }

    return res.json({ success: true, data: result });
}));

export default router;
