/**
 * oneClickReportRoutes.ts
 * -----------------------
 * 永續報告書一鍵生成 API 路由
 * 
 * 核心理念：服務即教學，知識即資產
 */

import express, { Request, Response } from 'express';
import { oneClickReportService, OneClickReportConfig } from '../services/OneClickReportService.js';

const router = express.Router();

// ============================================
// 一鍵生成 API
// ============================================

/**
 * POST /api/v1/report/one-click
 * 一鍵生成永續報告書
 * 
 * Request Body:
 * {
 *   "companyName": "○○股份有限公司",
 *   "industry": "半導體",
 *   "reportingPeriod": { "start": "2024-01-01", "end": "2024-12-31" },
 *   "framework": "GRI",
 *   "data": {
 *     "carbonEmission": 15000,
 *     "energyConsumption": 50000,
 *     "waterUsage": 100000,
 *     "employeeCount": 500
 *   },
 *   "options": {
 *     "includeTCFD": true,
 *     "includeGoals": true,
 *     "tone": "formal",
 *     "language": "zh-TW"
 *   }
 * }
 */
router.post('/one-click', async (req: Request, res: Response) => {
    try {
        const config: OneClickReportConfig = {
            companyName: req.body.companyName,
            industry: req.body.industry,
            reportingPeriod: req.body.reportingPeriod || {
                start: `${new Date().getFullYear()}-01-01`,
                end: `${new Date().getFullYear()}-12-31`,
            },
            framework: req.body.framework || 'GRI',
            data: req.body.data,
            options: req.body.options,
        };

        // 驗證必要欄位
        if (!config.companyName) {
            return res.status(400).json({
                success: false,
                error: 'companyName is required',
            });
        }

        // 生成報告書
        const result = await oneClickReportService.generateReport(config);

        return res.json({
            success: true,
            data: {
                report: result.report,
                generationTime: `${result.generationTime}ms`,
                completenessScore: result.completenessScore,
                warnings: result.warnings,
                nextSteps: result.nextSteps,
            },
            message: '報告書已成功生成！',
        });
    } catch (error) {
        console.error('One-click report generation error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to generate report',
        });
    }
});

/**
 * GET /api/v1/report/quick-templates
 * 獲取快速生成模板
 */
router.get('/quick-templates', async (req: Request, res: Response) => {
    try {
        const templates = [
            {
                id: 'basic',
                name: '基本模板',
                description: '適合中小企業的基礎報告書',
                sections: ['執行長的話', '關於我們', '環境永續', '社會責任', '公司治理'],
                estimatedTime: '5 分鐘',
                completeness: 60,
            },
            {
                id: 'standard',
                name: '標準模板',
                description: '符合 GRI Standards 的完整報告書',
                sections: [
                    '執行長的話',
                    '關於我們',
                    '永續治理',
                    '環境永續',
                    '社會責任',
                    '公司治理',
                    '利害關係人溝通',
                ],
                estimatedTime: '10 分鐘',
                completeness: 80,
            },
            {
                id: 'comprehensive',
                name: '完整模板',
                description: '包含 TCFD 氣候揭露的全面性報告書',
                sections: [
                    '執行長的話',
                    '關於我們',
                    '永續治理',
                    '環境永續',
                    '社會責任',
                    '公司治理',
                    'TCFD 治理',
                    'TCFD 策略',
                    'TCFD 風險管理',
                    'TCFD 指標與目標',
                ],
                estimatedTime: '15 分鐘',
                completeness: 95,
            },
        ];

        return res.json({
            success: true,
            data: templates,
        });
    } catch (error) {
        console.error('Get templates error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to retrieve templates',
        });
    }
});

/**
 * POST /api/v1/report/quick-generate
 * 快速生成（使用預設模板）
 */
router.post('/quick-generate', async (req: Request, res: Response) => {
    try {
        const { templateId, companyName, industry } = req.body;

        // 選擇模板配置
        const templateConfigs: Record<string, Partial<OneClickReportConfig>> = {
            basic: {
                framework: 'GRI',
                options: { includeTCFD: false, includeGoals: false, tone: 'concise' },
            },
            standard: {
                framework: 'GRI',
                options: { includeTCFD: false, includeGoals: true, tone: 'professional' },
            },
            comprehensive: {
                framework: 'Integrated',
                options: { includeTCFD: true, includeGoals: true, tone: 'formal' },
            },
        };

        const config: OneClickReportConfig = {
            companyName: companyName || '○○股份有限公司',
            industry: industry || '一般企業',
            reportingPeriod: {
                start: `${new Date().getFullYear()}-01-01`,
                end: `${new Date().getFullYear()}-12-31`,
            },
            framework: templateConfigs[templateId || 'standard']?.framework || 'GRI',
            options: templateConfigs[templateId || 'standard']?.options as OneClickReportConfig['options'],
        };

        const result = await oneClickReportService.generateReport(config);

        return res.json({
            success: true,
            data: {
                report: result.report,
                templateUsed: templateId || 'standard',
                generationTime: `${result.generationTime}ms`,
                completenessScore: result.completenessScore,
            },
            message: '報告書已快速生成！',
        });
    } catch (error) {
        console.error('Quick generate error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to generate report',
        });
    }
});

/**
 * POST /api/v1/report/generate-section
 * 生成特定章節
 */
router.post('/generate-section', async (req: Request, res: Response) => {
    try {
        const { sectionId, companyName, industry, framework, data } = req.body;

        if (!sectionId || !companyName) {
            return res.status(400).json({
                success: false,
                error: 'sectionId and companyName are required',
            });
        }

        const config: OneClickReportConfig = {
            companyName,
            industry: industry || '一般企業',
            reportingPeriod: {
                start: `${new Date().getFullYear()}-01-01`,
                end: `${new Date().getFullYear()}-12-31`,
            },
            framework: framework || 'GRI',
            data,
        };

        const result = await oneClickReportService.generateReport(config);
        const section = result.report.sections.find(s => s.id === sectionId);

        if (!section) {
            return res.status(404).json({
                success: false,
                error: 'Section not found',
            });
        }

        return res.json({
            success: true,
            data: {
                sectionId,
                content: section.content,
                frameworkMapping: section.frameworkMapping,
            },
        });
    } catch (error) {
        console.error('Generate section error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to generate section',
        });
    }
});

/**
 * POST /api/v1/report/enhance
 * 增強現有報告書
 */
router.post('/enhance', async (req: Request, res: Response) => {
    try {
        const { report, enhancementType } = req.body;

        // 模擬增強功能
        const enhancedContent = report.sections?.map((section: any) => ({
            ...section,
            content: `[增強版] ${section.content}`,
        }));

        return res.json({
            success: true,
            data: {
                enhancedReport: {
                    ...report,
                    sections: enhancedContent,
                },
                enhancementType,
                message: `已根據 ${enhancementType} 增強報告書`,
            },
        });
    } catch (error) {
        console.error('Enhance report error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to enhance report',
        });
    }
});

/**
 * GET /api/v1/report/demo
 * 生成範例報告書（無需輸入）
 */
router.get('/demo', async (req: Request, res: Response) => {
    try {
        const config: OneClickReportConfig = {
            companyName: '範例科技股份有限公司',
            industry: '半導體',
            reportingPeriod: {
                start: '2024-01-01',
                end: '2024-12-31',
            },
            framework: 'Integrated',
            data: {
                carbonEmission: 15000,
                energyConsumption: 50000,
                waterUsage: 100000,
                wasteGenerated: 500,
                employeeCount: 500,
                employeeSatisfaction: 88,
                trainingHours: 40,
                incidentCount: 0,
                boardDiversity: 35,
                turnoverRate: 8,
            },
            options: {
                includeTCFD: true,
                includeGoals: true,
                tone: 'formal',
                language: 'zh-TW',
            },
        };

        const result = await oneClickReportService.generateReport(config);

        return res.json({
            success: true,
            data: {
                report: result.report,
                generationTime: `${result.generationTime}ms`,
                completenessScore: result.completenessScore,
                message: '這是一份範例報告書，可用於參考與測試',
            },
        });
    } catch (error) {
        console.error('Demo report generation error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to generate demo report',
        });
    }
});

export default router;
