/**
 * 📊 QA Score Calculator API Routes
 * Sprint 2: ESG Report Quality Assessment
 * --------------------------------------------------
 * Endpoints:
 * - POST /api/qa-score/calculate - Calculate QA Score
 * - GET /api/qa-score/history - Get user's QA score history
 * - GET /api/qa-score/:id - Get specific QA score details
 */

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { QAScoreCalculatorService } from '../services/QAScoreCalculatorService.js';
import type { ReportData } from '../../src/types/esg-go/qa-score.types.js';

const router = express.Router();

// Initialize Supabase
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * @openapi
 * /api/qa-score/calculate:
 *   post:
 *     summary: Calculate QA Score for ESG report
 *     tags: [QA Score]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportData:
 *                 type: object
 *               l1AssessmentId:
 *                 type: string
 *                 format: uuid
 *               companyId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: QA Score calculated successfully
 */
router.post('/calculate', async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        const {
            reportData,
            l1AssessmentId,
            companyId,
            reportId
        } = req.body as {
            reportData: ReportData;
            l1AssessmentId?: string;
            companyId?: string;
            reportId?: string;
        };

        // Validate input
        if (!reportData) {
            return res.status(400).json({
                success: false,
                error: 'Report data is required'
            });
        }

        // Get evidence count for this user
        const { data: evidenceData, error: evidenceError } = await supabase
            .from('evidence_vault')
            .select('id, is_locked')
            .eq('user_id', userId);

        if (evidenceError) {
            console.error('Error fetching evidence:', evidenceError);
        }

        const evidenceCount = evidenceData?.length || 0;
        const lockedEvidenceCount = evidenceData?.filter(e => e.is_locked).length || 0;

        // Calculate QA Score
        const qaResult = await QAScoreCalculatorService.calculate(
            reportData,
            evidenceCount,
            lockedEvidenceCount
        );

        // Generate hash signature
        const hashSignature = QAScoreCalculatorService.generateHashSignature(qaResult);

        // Store in database
        const { data: qaScore, error: insertError } = await supabase
            .from('qa_scores')
            .insert({
                user_id: userId,
                company_id: companyId,
                report_id: reportId,
                l1_assessment_id: l1AssessmentId,
                overall_score: qaResult.overallScore,
                grade: qaResult.grade,
                completeness_score: qaResult.dimensions.completeness,
                accuracy_score: qaResult.dimensions.accuracy,
                consistency_score: qaResult.dimensions.consistency,
                comparability_score: qaResult.dimensions.comparability,
                trustworthy_score: qaResult.dimensions.trustworthy,
                gaps: qaResult.gaps,
                recommendations: qaResult.recommendations,
                evidence_count: evidenceCount,
                locked_evidence_count: lockedEvidenceCount,
                is_certifiable: qaResult.isCertifiable,
                certification_requirements: qaResult.certificationRequirements,
                hash_signature: hashSignature,
                calculation_timestamp: qaResult.timestamp
            })
            .select()
            .single();

        if (insertError) {
            console.error('Error inserting QA score:', insertError);
            return res.status(500).json({
                success: false,
                error: 'Failed to save QA score',
                details: insertError.message
            });
        }

        return res.status(201).json({
            success: true,
            data: {
                id: qaScore.id,
                overallScore: qaScore.overall_score,
                grade: qaScore.grade,
                dimensions: {
                    completeness: qaScore.completeness_score,
                    accuracy: qaScore.accuracy_score,
                    consistency: qaScore.consistency_score,
                    comparability: qaScore.comparability_score,
                    trustworthy: qaScore.trustworthy_score
                },
                gaps: qaScore.gaps,
                recommendations: qaScore.recommendations,
                isCertifiable: qaScore.is_certifiable,
                certificationRequirements: qaScore.certification_requirements,
                evidenceCount,
                lockedEvidenceCount,
                hashSignature,
                createdAt: qaScore.created_at
            }
        });

    } catch (error: any) {
        console.error('QA Score calculation error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
});

/**
 * @openapi
 * /api/qa-score/history:
 *   get:
 *     summary: Get user's QA score history
 *     tags: [QA Score]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: QA score history retrieved successfully
 */
router.get('/history', async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0;

        const { data: scores, error, count } = await supabase
            .from('qa_scores')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error('Error fetching QA scores:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch QA scores',
                details: error.message
            });
        }

        return res.json({
            success: true,
            data: scores.map(score => ({
                id: score.id,
                overallScore: score.overall_score,
                grade: score.grade,
                dimensions: {
                    completeness: score.completeness_score,
                    accuracy: score.accuracy_score,
                    consistency: score.consistency_score,
                    comparability: score.comparability_score,
                    trustworthy: score.trustworthy_score
                },
                isCertifiable: score.is_certifiable,
                createdAt: score.created_at
            })),
            pagination: {
                total: count || 0,
                limit,
                offset
            }
        });

    } catch (error: any) {
        console.error('QA Score history error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
});

/**
 * @openapi
 * /api/qa-score/{id}:
 *   get:
 *     summary: Get specific QA score details
 *     tags: [QA Score]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: QA score details retrieved successfully
 */
router.get('/:id', async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        const { id } = req.params;

        const { data: score, error } = await supabase
            .from('qa_scores')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (error || !score) {
            return res.status(404).json({
                success: false,
                error: 'QA score not found'
            });
        }

        return res.json({
            success: true,
            data: {
                id: score.id,
                overallScore: score.overall_score,
                grade: score.grade,
                dimensions: {
                    completeness: score.completeness_score,
                    accuracy: score.accuracy_score,
                    consistency: score.consistency_score,
                    comparability: score.comparability_score,
                    trustworthy: score.trustworthy_score
                },
                gaps: score.gaps,
                recommendations: score.recommendations,
                isCertifiable: score.is_certifiable,
                certificationRequirements: score.certification_requirements,
                evidenceCount: score.evidence_count,
                lockedEvidenceCount: score.locked_evidence_count,
                hashSignature: score.hash_signature,
                createdAt: score.created_at,
                updatedAt: score.updated_at
            }
        });

    } catch (error: any) {
        console.error('QA Score fetch error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
});

export default router;
