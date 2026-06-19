/**
 * reportTutorialRoutes.ts
 * -----------------------
 * 永續報告書撰寫中心 - 服務引導教學 API 路由
 * 
 * 核心理念：服務即教學，知識即資產
 */

import express, { Request, Response } from 'express';
import { reportTutorialService, TutorialStep } from '../services/ReportTutorialService.js';
import { sustainabilityReportService } from '../services/SustainabilityReportService.js';
import { reportAdvancementService } from '../services/ReportAdvancementService.js';

const router = express.Router();

// ============================================
// 教學相關 API
// ============================================

/**
 * GET /api/v1/report-tutorial/steps
 * 獲取所有教學步驟
 */
router.get('/steps', async (req: Request, res: Response) => {
    try {
        const { level } = req.query;

        let steps: TutorialStep[];
        if (level) {
            steps = reportTutorialService.getStepsByLevel(parseInt(level as string, 10));
        } else {
            steps = reportTutorialService.getAllTutorialSteps();
        }

        return res.json({
            success: true,
            data: {
                steps,
                total: steps.length,
            },
        });
    } catch (error) {
        console.error('Get tutorial steps error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to retrieve tutorial steps',
        });
    }
});

/**
 * GET /api/v1/report-tutorial/steps/:stepId
 * 獲取特定教學步驟內容
 */
router.get('/steps/:stepId', async (req: Request, res: Response) => {
    try {
        const { stepId } = req.params;
        const step = reportTutorialService.getTutorialStep(stepId);

        if (!step) {
            return res.status(404).json({
                success: false,
                error: 'Tutorial step not found',
            });
        }

        return res.json({
            success: true,
            data: step,
        });
    } catch (error) {
        console.error('Get tutorial step error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to retrieve tutorial step',
        });
    }
});

/**
 * GET /api/v1/report-tutorial/user/:userId
 * 獲取用戶的教學狀態
 */
router.get('/user/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const state = await reportTutorialService.getUserTutorialState(userId);
        const summary = reportTutorialService.generateTutorialSummary(state);

        return res.json({
            success: true,
            data: {
                ...state,
                summary,
            },
        });
    } catch (error) {
        console.error('Get user tutorial state error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to retrieve user tutorial state',
        });
    }
});

/**
 * POST /api/v1/report-tutorial/user/:userId/start
 * 開始特定教學步驟
 */
router.post('/user/:userId/start', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { stepId } = req.body;

        if (!stepId) {
            return res.status(400).json({
                success: false,
                error: 'stepId is required',
            });
        }

        const progress = await reportTutorialService.startTutorialStep(userId, stepId);

        return res.json({
            success: true,
            data: progress,
        });
    } catch (error) {
        console.error('Start tutorial step error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to start tutorial step',
        });
    }
});

/**
 * POST /api/v1/report-tutorial/user/:userId/complete
 * 完成特定教學步驟
 */
router.post('/user/:userId/complete', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { stepId, score } = req.body;

        if (!stepId) {
            return res.status(400).json({
                success: false,
                error: 'stepId is required',
            });
        }

        // 驗證完成條件
        const validation = reportTutorialService.validateCompletion(stepId, { score });
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                error: 'Completion criteria not met',
                missingCriteria: validation.missingCriteria,
            });
        }

        const newState = await reportTutorialService.completeTutorialStep(userId, stepId, score || 0);
        const summary = reportTutorialService.generateTutorialSummary(newState);

        return res.json({
            success: true,
            data: {
                ...newState,
                summary,
                message: '恭喜完成此教學模組！',
            },
        });
    } catch (error) {
        console.error('Complete tutorial step error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to complete tutorial step',
        });
    }
});

// ============================================
// 報告書相關 API
// ============================================

/**
 * POST /api/v1/report-tutorial/reports
 * 建立新報告書
 */
router.post('/reports', async (req: Request, res: Response) => {
    try {
        const { companyId, title, reportingPeriod, framework } = req.body;

        if (!companyId || !title || !framework) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: companyId, title, framework',
            });
        }

        const report = await sustainabilityReportService.createReport(companyId, {
            title,
            reportingPeriod: reportingPeriod || { start: '2024-01-01', end: '2024-12-31' },
            framework,
        });

        return res.json({
            success: true,
            data: report,
        });
    } catch (error) {
        console.error('Create report error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to create report',
        });
    }
});

/**
 * GET /api/v1/report-tutorial/reports/:reportId/completeness
 * 獲取報告書完整性報告
 */
router.get('/reports/:reportId/completeness', async (req: Request, res: Response) => {
    try {
        const { reportId } = req.params;

        // 模擬報告書數據
        const mockReport = await sustainabilityReportService.createReport('demo-company', {
            title: '2024 永續發展報告書',
            reportingPeriod: { start: '2024-01-01', end: '2024-12-31' },
            framework: 'GRI',
        });

        const completenessReport = sustainabilityReportService.generateCompletenessReport(mockReport);

        return res.json({
            success: true,
            data: completenessReport,
        });
    } catch (error) {
        console.error('Get report completeness error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to generate completeness report',
        });
    }
});

/**
 * GET /api/v1/report-tutorial/gri-standards
 * 獲取 GRI Standards 對照表
 */
router.get('/gri-standards', async (req: Request, res: Response) => {
    try {
        const { code } = req.query;

        if (code) {
            const standard = sustainabilityReportService.getGRIStandard(code as string);
            return res.json({
                success: true,
                data: standard || null,
            });
        }

        const standards = sustainabilityReportService.getGRIStandards();
        return res.json({
            success: true,
            data: standards,
        });
    } catch (error) {
        console.error('Get GRI standards error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to retrieve GRI standards',
        });
    }
});

/**
 * GET /api/v1/report-tutorial/tcfd-alignment
 * 獲取 TCFD 對齊狀態
 */
router.get('/tcfd-alignment', async (req: Request, res: Response) => {
    try {
        const alignment = sustainabilityReportService.getTCFDAlignment();

        const disclosedCount = alignment.filter(a => a.disclosed).length;
        const totalCount = alignment.length;
        const disclosureRate = Math.round((disclosedCount / totalCount) * 100);

        return res.json({
            success: true,
            data: {
                alignment,
                summary: {
                    total: totalCount,
                    disclosed: disclosedCount,
                    disclosureRate,
                    status: disclosureRate >= 80 ? '良好' : disclosureRate >= 50 ? '待加強' : '需改善',
                },
            },
        });
    } catch (error) {
        console.error('Get TCFD alignment error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to retrieve TCFD alignment',
        });
    }
});

/**
 * POST /api/v1/report-tutorial/generate-content
 * AI 生成章節內容
 */
router.post('/generate-content', async (req: Request, res: Response) => {
    try {
        const { sectionId, companyName, industry, metrics, framework } = req.body;

        if (!sectionId || !companyName) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: sectionId, companyName',
            });
        }

        const content = await sustainabilityReportService.generateSectionContent(sectionId, {
            companyName,
            industry: industry || '一般企業',
            metrics: metrics || {},
            framework: framework || 'GRI',
        });

        return res.json({
            success: true,
            data: {
                sectionId,
                content,
            },
        });
    } catch (error) {
        console.error('Generate content error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to generate content',
        });
    }
});

// ============================================
// 晉級相關 API
// ============================================

/**
 * GET /api/v1/report-tutorial/advancement/user/:userId
 * 獲取用戶晉級狀態
 */
router.get('/advancement/user/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        // 初始化用戶晉級狀態
        const rank = reportAdvancementService.initializeUserRank(userId);

        // 計算進度
        const progress = reportAdvancementService.calculateProgress(rank.experiencePoints);

        return res.json({
            success: true,
            data: {
                ...rank,
                progress,
            },
        });
    } catch (error) {
        console.error('Get user advancement error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to retrieve user advancement',
        });
    }
});

/**
 * POST /api/v1/report-tutorial/advancement/user/:userId/activity
 * 記錄用戶活動並更新經驗值
 */
router.post('/advancement/user/:userId/activity', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { type, description, metadata } = req.body;

        if (!type || !description) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: type, description',
            });
        }

        const updatedRank = await reportAdvancementService.updateUserRank(userId, {
            type,
            description,
            xpEarned: 0,
            metadata,
        });

        // 檢查成就
        const newAchievements = reportAdvancementService.checkAndGrantAchievements(updatedRank);

        return res.json({
            success: true,
            data: {
                rank: updatedRank,
                newAchievements,
                message: '活動已記錄',
            },
        });
    } catch (error) {
        console.error('Record activity error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to record activity',
        });
    }
});

/**
 * GET /api/v1/report-tutorial/advancement/badges
 * 獲取所有可用徽章
 */
router.get('/advancement/badges', async (req: Request, res: Response) => {
    try {
        const badges = reportAdvancementService.getAllBadges();
        const achievements = reportAdvancementService.getAllAchievements();

        return res.json({
            success: true,
            data: {
                badges,
                achievements,
            },
        });
    } catch (error) {
        console.error('Get badges error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to retrieve badges',
        });
    }
});

/**
 * GET /api/v1/report-tutorial/advancement/leaderboard
 * 獲取排行榜
 */
router.get('/advancement/leaderboard', async (req: Request, res: Response) => {
    try {
        const { limit, timeframe, criteria } = req.query;

        const leaderboard = await reportAdvancementService.getLeaderboard({
            limit: limit ? parseInt(limit as string, 10) : 10,
            timeframe: (timeframe as any) || 'allTime',
            criteria: (criteria as any) || 'xp',
        });

        return res.json({
            success: true,
            data: {
                leaderboard,
                lastUpdated: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error('Get leaderboard error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to retrieve leaderboard',
        });
    }
});

/**
 * GET /api/v1/report-tutorial/advancement/levels
 * 獲取所有等級閾值
 */
router.get('/advancement/levels', async (req: Request, res: Response) => {
    try {
        const { LEVEL_THRESHOLDS } = await import('../services/ReportAdvancementService.js');

        return res.json({
            success: true,
            data: {
                levels: LEVEL_THRESHOLDS,
                totalLevels: LEVEL_THRESHOLDS.length,
            },
        });
    } catch (error) {
        console.error('Get levels error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to retrieve levels',
        });
    }
});

export default router;
