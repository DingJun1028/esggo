/**
 * 🏥 Health Check API Routes
 * Sprint 2: L1 Assessment Endpoint
 * --------------------------------------------------
 * POST /api/health-check/l1 - Submit L1 快篩評估
 */

import express, { Request, Response } from 'express';
import { L1AssessmentService } from '../services/L1AssessmentService.js';
import { OmniError, ErrorCode, ValidationError, UnauthorizedError } from '../utils/omniError.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { createClient } from '@supabase/supabase-js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateRequest } from '../middleware/authMiddleware.js';
import type { L1MinimalData, L1AssessmentResult } from '../../src/types/esg-go/l1-mvd.types.js';

const router = express.Router();

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * @openapi
 * /api/health-check/l1:
 *   post:
 *     summary: Submit L1 Health Check Assessment
 *     description: 提交 L1 快篩資料並獲得評估結果（G/E/S 三維度評分 + 缺失識別）
 *     tags:
 *       - Health Check
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyProfile:
 *                 type: object
 *                 properties:
 *                   companyName:
 *                     type: string
 *                     example: "台灣製造股份有限公司"
 *                   industry:
 *                     type: string
 *                     example: "製造業"
 *                   employeeCount:
 *                     type: string
 *                     example: "100-500"
 *                   revenue:
 *                     type: string
 *                     example: "1-5億"
 *                   isListed:
 *                     type: boolean
 *                     example: false
 *               governance:
 *                 type: object
 *                 properties:
 *                   hasBoardESGOversight:
 *                     type: boolean
 *                   hasEthicsPolicy:
 *                     type: boolean
 *                   hasStakeholderEngagement:
 *                     type: boolean
 *                   hasRiskManagement:
 *                     type: boolean
 *               environmental:
 *                 type: object
 *               social:
 *                 type: object
 *     responses:
 *       200:
 *         description: L1 assessment completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 overallScore:
 *                   type: integer
 *                   example: 45
 *                 dimensionScores:
 *                   type: object
 *                   properties:
 *                     governance:
 *                       type: integer
 *                     environmental:
 *                       type: integer
 *                     social:
 *                       type: integer
 *                 gaps:
 *                   type: array
 *                   items:
 *                     type: object
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/l1', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    // 0. 驗證用戶登入
    const userId = (req as any).user?.userId;
    if (!userId) {
        throw new UnauthorizedError('請先登入才能進行評估');
    }

    const data: L1MinimalData = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';

    // 1. 驗證必填欄位
    const validation = validateL1Data(data);
    if (!validation.valid) {
        throw new ValidationError('Validation failed', validation.errors);
    }

    // 2. 執行評估
    const result = await L1AssessmentService.assess(data, userId, ipAddress);

    // 3. 儲存結果至 Supabase
    const { data: insertedData, error: insertError } = await supabase
        .from('health_check_results')
        .insert({
            user_id: userId,
            company_id: (data.companyProfile as any).companyId || null,
            l1_score: result.overallScore,
            governance_score: result.dimensionScores?.governance || 0,
            environmental_score: result.dimensionScores?.environmental || 0,
            social_score: result.dimensionScores?.social || 0,
            gaps: result.gaps,
            recommendations: result.recommendations,
            estimated_workload_hours: result.estimatedWorkload,
            raw_data: data,
            hash_signature: result.metadata?.hashSignature || null,
            source_origin: result.metadata?.sourceOrigin || 'web_portal',
            ip_address: ipAddress,
            status: 'completed'
        })
        .select('id, created_at')
        .single();

    if (insertError) {
        throw new OmniError(`Database insert failed: ${insertError.message}`, 500, ErrorCode.DB_ERROR);
    }

    const assessmentId = insertedData.id;

    // 4. 返回結果
    return res.status(200).json({
        success: true,
        assessmentId,
        ...result,
    });
}));

/**
 * GET /api/health-check/history
 * 獲取用戶的評估歷史
 */
router.get('/history', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) {
        throw new UnauthorizedError();
    }

    const { limit = 10, offset = 0 } = req.query;

    const { data, error, count } = await supabase
        .from('health_check_results')
        .select('id, l1_score, governance_score, environmental_score, social_score, estimated_workload_hours, created_at', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
        throw new OmniError(`Failed to fetch history: ${error.message}`, 500, ErrorCode.DB_ERROR);
    }

    return res.json({
        success: true,
        data: {
            total: count || 0,
            assessments: data || []
        }
    });
}));

/**
 * GET /api/health-check/verify/:hash
 * 驗證評估結果的真實性 (5T: Trustworthy)
 */
router.get('/verify/:hash', asyncHandler(async (req: Request, res: Response) => {
    const { hash } = req.params;

    const { data, error } = await supabase
        .from('health_check_results')
        .select('id, l1_score, created_at, hash_signature, raw_data')
        .eq('hash_signature', hash)
        .single();

    if (error || !data) {
        return res.status(404).json({
            error: 'Not found',
            message: '找不到對應的評估記錄'
        });
    }

    // 重新計算 Hash 驗證
    const isValid = L1AssessmentService.verifyHashSignature(
        data.raw_data,
        hash
    );

    return res.json({
        success: true,
        data: {
            valid: isValid,
            assessmentId: data.id,
            score: data.l1_score,
            assessedAt: data.created_at,
            message: isValid ? '✅ 評估結果已驗證，數據未被篡改' : '❌ 驗證失敗，數據可能已被修改'
        }
    });
}));

/**
 * 驗證 L1 資料完整性
 */
function validateL1Data(data: L1MinimalData): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    // 公司資料
    if (!data.companyProfile) {
        errors.push('缺少公司基本資料');
    } else {
        if (!data.companyProfile.name) errors.push('公司名稱為必填');
        if (!data.companyProfile.industry) errors.push('產業類別為必填');
        if (!data.companyProfile.employeeCount) errors.push('員工人數為必填');
    }

    // 治理資料
    if (!data.governance) {
        errors.push('缺少治理檢核資料');
    }

    // 環境資料
    if (!data.environmental) {
        errors.push('缺少環境檢核資料');
    }

    // 社會資料
    if (!data.social) {
        errors.push('缺少社會檢核資料');
    }

    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined
    };
}

export default router;
