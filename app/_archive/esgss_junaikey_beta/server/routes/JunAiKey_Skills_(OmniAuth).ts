/**
 * 🔐 JunAiKey_Skills (OmniAuth) - 奧秘身份技能路由
 * --------------------------------------------------
 * 提供身份驗證、權限查詢與安全稽核相關的 AI 技能。
 */

import { Router, Request, Response } from 'express';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateRequest } from '../middleware/authMiddleware.js';
import { ValidationError } from '../utils/omniError.js';

const router = Router();

// ==================== Skill Registry (OmniAuth Capabilities) ====================

const OMNIAUTH_SKILL_REGISTRY = [
    {
        name: 'auth_check_permission',
        description: 'Check if a user has specific permissions for a resource.',
        parameters: {
            type: 'object',
            properties: {
                targetUserId: { type: 'string', description: 'The ID of the user to check' },
                resource: { type: 'string', description: 'The resource name (e.g., "emission_data")' },
                action: { type: 'string', description: 'The action (e.g., "write", "delete")' }
            },
            required: ['resource', 'action']
        }
    },
    {
        name: 'auth_get_user_profile',
        description: 'Retrieve technical profile and security clearance for a user.',
        parameters: {
            type: 'object',
            properties: {
                queryUserId: { type: 'string', description: 'The ID of the user' }
            },
            required: ['queryUserId']
        }
    },
    {
        name: 'auth_audit_log_query',
        description: 'Query security audit logs for specific events.',
        parameters: {
            type: 'object',
            properties: {
                category: { type: 'string', description: 'Log category (e.g., "auth", "api")' },
                limit: { type: 'number', default: 10 }
            }
        }
    }
];

// ==================== Routes ====================

/**
 * GET /api/skills/omni-auth/registry
 */
router.get('/registry', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    return res.json({
        success: true,
        data: { skills: OMNIAUTH_SKILL_REGISTRY }
    });
}));

/**
 * POST /api/skills/omni-auth/dispatch
 */
router.post('/dispatch', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { prompt } = req.body;
    const userId = (req as any).user?.userId;

    if (!prompt) throw new ValidationError('Prompt is required');

    omniLogger.info(LogCategory.AI, `[JunAiKey_Skills (OmniAuth)] Dispatching prompt: "${prompt}"`, { userId });

    let skillName = 'unknown';
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes('can i') || lowerPrompt.includes('permission') || lowerPrompt.includes('allow')) {
        skillName = 'auth_check_permission';
    } else if (lowerPrompt.includes('who is') || lowerPrompt.includes('profile') || lowerPrompt.includes('clearance')) {
        skillName = 'auth_get_user_profile';
    } else if (lowerPrompt.includes('audit') || lowerPrompt.includes('log') || lowerPrompt.includes('security')) {
        skillName = 'auth_audit_log_query';
    }

    if (skillName === 'unknown') {
        return res.json({
            success: false,
            message: "Identity/Auth intent not recognized. Try 'permission', 'profile', or 'audit'."
        });
    }

    return res.json({
        success: true,
        data: {
            skill: skillName,
            message: `Auth intent recognized: ${skillName}`
        }
    });
}));

/**
 * POST /api/skills/omni-auth/execute
 */
router.post('/execute', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { skill, parameters } = req.body;
    const userId = (req as any).user?.userId;

    if (!skill || !parameters) throw new ValidationError('Skill and parameters required');

    omniLogger.info(LogCategory.AI, `[JunAiKey_Skills (OmniAuth)] Executing skill: ${skill}`, { parameters, userId });

    // Mock Execution Logic for Auth Skills
    let result;
    switch (skill) {
        case 'auth_check_permission':
            result = {
                allowed: true,
                reason: 'Standard access tier for resource ' + parameters.resource,
                metrics: {
                    tangibleResult: "Access Granted",
                    traceableSource: "OmniAuth-Rbac-V1",
                    trackablePath: ["Identity_Verification", "Policy_Check"],
                    transparentLogic: "Rule_Engine_Alpha",
                    trustworthySeal: "AUTH_VERIFIED"
                }
            };
            break;
        case 'auth_get_user_profile':
            result = {
                userId: parameters.queryUserId || userId,
                role: 'ESG_SPECIALIST',
                clearance: 'LEVEL_3',
                metrics: {
                    tangibleResult: "Profile Retrieved",
                    traceableSource: "OmniAuth-Dir-V2",
                    trackablePath: ["Registry_Lookup"],
                    transparentLogic: "Identity_Core",
                    trustworthySeal: "INDENTITY_CONFIRMED"
                }
            };
            break;
        case 'auth_audit_log_query':
            result = {
                logs: [
                    { time: Date.now(), event: 'LoginSuccess', user: userId },
                    { time: Date.now() - 1000, event: 'DataAccess', resource: 'ESG_REPORT' }
                ],
                count: 2
            };
            break;
        default:
            return res.status(404).json({ success: false, error: 'Skill not found' });
    }

    return res.json({ success: true, data: result });
}));

export default router;
