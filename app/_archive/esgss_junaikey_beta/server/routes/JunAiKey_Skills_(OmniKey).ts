/**
 * JunAiKey_Skills_(OmniKey).ts
 * 
 * Capability: Sovereign Key Management & Cryptographic Operations
 * Description: Manages the lifecycle of digital keys, verified credentials, and cryptographic signatures within the 5T ecosystem.
 */

import { Router, Request, Response } from 'express';
import OmniKeyService from '../services/OmniKeyService.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateRequest } from '../middleware/authMiddleware.js';
import { ValidationError } from '../utils/omniError.js';

const router = Router();

// ==================== Skill Registry (OmniKey Capabilities) ====================

const OMNIKEY_SKILL_REGISTRY = [
    {
        name: 'key_generate',
        description: 'Creates a new cryptographic key pair for a user or agent.',
        parameters: {
            type: 'object',
            properties: {
                type: { type: 'string', description: 'Key type (default: ed25519)' },
                owner: { type: 'string', description: 'Key owner' }
            },
            required: []
        }
    },
    {
        name: 'key_verify',
        description: 'Verifies a digital signature against a known key.',
        parameters: {
            type: 'object',
            properties: {
                keyId: { type: 'string', description: 'Key ID to verify against' },
                data: { type: 'object', description: 'Data that was signed' },
                signature: { type: 'string', description: 'Digital signature' }
            },
            required: ['keyId', 'data', 'signature']
        }
    },
    {
        name: 'key_revoke',
        description: 'Revokes a compromised or obsolete key.',
        parameters: {
            type: 'object',
            properties: {
                keyId: { type: 'string', description: 'Key ID to revoke' },
                reason: { type: 'string', description: 'Reason for revocation' }
            },
            required: ['keyId']
        }
    },
    {
        name: 'key_status',
        description: 'Retrieves the current status and metadata of a key.',
        parameters: {
            type: 'object',
            properties: {
                keyId: { type: 'string', description: 'Key ID to check' }
            },
            required: ['keyId']
        }
    }
];

// ==================== Routes ====================

/**
 * GET /api/skills/omni-key/registry
 */
router.get('/registry', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    return res.json({
        success: true,
        data: { skills: OMNIKEY_SKILL_REGISTRY }
    });
}));

/**
 * POST /api/skills/omni-key/dispatch
 * 
 * [5T: Traceable] Logs intent discovery
 */
router.post('/dispatch', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { prompt } = req.body;
    const userId = (req as any).user?.userId;

    if (!prompt) throw new ValidationError('Prompt is required');

    omniLogger.info(LogCategory.AI, `[JunAiKey_Skills (OmniKey)] Dispatching prompt: "${prompt}"`, { userId });

    let skillName = 'unknown';
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes('generate') || lowerPrompt.includes('create key')) {
        skillName = 'key_generate';
    } else if (lowerPrompt.includes('verify') || lowerPrompt.includes('validate')) {
        skillName = 'key_verify';
    } else if (lowerPrompt.includes('revoke') || lowerPrompt.includes('delete key')) {
        skillName = 'key_revoke';
    } else if (lowerPrompt.includes('status') || lowerPrompt.includes('check key')) {
        skillName = 'key_status';
    }

    if (skillName === 'unknown') {
        return res.json({
            success: false,
            message: "Key management intent not recognized. Try 'generate', 'verify', or 'revoke'."
        });
    }

    return res.json({
        success: true,
        data: {
            skill: skillName,
            message: `Key intent recognized: ${skillName}`
        }
    });
}));

/**
 * POST /api/skills/omni-key/execute
 * 
 * [5T: Trustworthy] Executes cryptographic operations
 */
router.post('/execute', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { skill, parameters } = req.body;
    const userId = (req as any).user?.userId;

    if (!skill || !parameters) throw new ValidationError('Skill and parameters required');

    omniLogger.info(LogCategory.AI, `[JunAiKey_Skills (OmniKey)] Executing skill: ${skill}`, { parameters, userId });

    let result;
    switch (skill) {
        case 'key_generate':
            result = await OmniKeyService.generateKey(parameters.type || 'ed25519', parameters.owner || userId || 'system');
            break;

        case 'key_verify':
            result = await OmniKeyService.verifySignature(parameters.keyId, parameters.data, parameters.signature);
            break;

        case 'key_revoke':
            result = await OmniKeyService.revokeKey(parameters.keyId, parameters.reason || 'Manual revocation');
            break;

        case 'key_status':
            result = await OmniKeyService.getKeyStatus(parameters.keyId);
            break;

        default:
            return res.status(404).json({ success: false, error: 'Skill not found' });
    }

    return res.json({
        success: true,
        data: result,
        meta: {
            intent: `EXECUTION_${skill.toUpperCase()}`,
            timestamp: Date.now(),
            provider: 'OmniKey::Core'
        }
    });
}));

export default router;


