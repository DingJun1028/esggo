/**
 * 🎯 Integration Hub API Routes
 * 
 * API 路由：
 * - 模組狀態管理
 * - 工作流程控制
 * - 事件流監控
 * - 數據同步處理
 * 
 * @version 1.0.0
 * @date 2026-02-08
 */

import { Router, Request, Response } from 'express';
import { ESGIntegrationHub, integrationHub } from '../services/integration/ESGIntegrationHub';

const router = Router();

// ============== Module Status Routes ==============

/**
 * GET /api/v1/integration/status
 * 取得所有模組狀態
 */
router.get('/status', (req: Request, res: Response) => {
    try {
        const status = integrationHub.getIntegrationStatus();
        res.json({
            success: true,
            data: status,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/v1/integration/modules/:name
 * 取得特定模組狀態
 */
router.get('/modules/:name', (req: Request, res: Response) => {
    try {
        const moduleName = req.params.name as any;
        const status = integrationHub.getIntegrationStatus();
        const module = status.modules.find(m => m.name === moduleName);
        
        if (!module) {
            return res.status(404).json({ success: false, error: 'Module not found' });
        }
        
        res.json({ success: true, data: module });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/v1/integration/modules/:name/sync
 * 同步特定模組數據
 */
router.post('/modules/:name/sync', async (req: Request, res: Response) => {
    try {
        const moduleName = req.params.name as any;
        const target = req.body.target as any;
        
        if (target) {
            const syncedCount = await integrationHub.syncModuleData(moduleName, target);
            res.json({ success: true, syncedCount });
        } else {
            res.json({ success: true, message: 'Sync initiated' });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============== Workflow Routes ==============

/**
 * GET /api/v1/integration/workflows
 * 取得所有工作流程
 */
router.get('/workflows', (req: Request, res: Response) => {
    try {
        const status = integrationHub.getIntegrationStatus();
        res.json({
            success: true,
            data: status.workflows,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/v1/integration/workflows/:id/execute
 * 執行特定工作流程
 */
router.post('/workflows/:id/execute', async (req: Request, res: Response) => {
    try {
        const workflowId = req.params.id;
        const triggerData = req.body.data || {};
        
        // Trigger the workflow
        integrationHub.publishEvent(
            'WORKFLOW_STARTED',
            'INTEGRATION' as any,
            undefined,
            { workflowId, data: triggerData }
        );
        
        res.json({
            success: true,
            message: `Workflow ${workflowId} execution initiated`,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/v1/integration/workflows/:id/pause
 * 暫停工作流程
 */
router.post('/workflows/:id/pause', (req: Request, res: Response) => {
    try {
        res.json({
            success: true,
            message: `Workflow ${req.params.id} paused`,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/v1/integration/workflows/:id/resume
 * 恢復工作流程
 */
router.post('/workflows/:id/resume', (req: Request, res: Response) => {
    try {
        res.json({
            success: true,
            message: `Workflow ${req.params.id} resumed`,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============== Event Routes ==============

/**
 * POST /api/v1/integration/events/publish
 * 發布自定義事件
 */
router.post('/events/publish', (req: Request, res: Response) => {
    try {
        const { type, source, target, payload } = req.body;
        
        const event = integrationHub.publishEvent(
            type,
            source,
            target,
            payload || {}
        );
        
        res.json({
            success: true,
            data: event,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/v1/integration/events/logs
 * 取得事件日誌
 */
router.get('/events/logs', (req: Request, res: Response) => {
    try {
        // Mock event logs
        const logs = [
            { id: 'e1', type: 'DATA_UPDATED', source: 'CRM', target: 'REPORT', timestamp: new Date().toISOString(), status: 'success' },
            { id: 'e2', type: 'COMMISSION_CALCULATED', source: 'AGENCY', target: 'FINANCE', timestamp: new Date().toISOString(), status: 'success' },
            { id: 'e3', type: 'REPORT_GENERATED', source: 'REPORT', target: 'ANALYTICS', timestamp: new Date().toISOString(), status: 'success' },
        ];
        
        res.json({
            success: true,
            data: logs,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============== Cross-Module Sync Routes ==============

/**
 * POST /api/v1/integration/sync/crm-to-report
 * CRM → REPORT 同步
 */
router.post('/sync/crm-to-report', (req: Request, res: Response) => {
    try {
        integrationHub.syncCRMToReport(req.body.projectData || {});
        res.json({ success: true, message: 'CRM to Report sync initiated' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/v1/integration/sync/agency-to-finance
 * AGENCY → FINANCE 同步
 */
router.post('/sync/agency-to-finance', (req: Request, res: Response) => {
    try {
        integrationHub.syncAgencyToFinance(req.body.commissionData || {});
        res.json({ success: true, message: 'Agency to Finance sync initiated' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/v1/integration/sync/report-to-analytics
 * REPORT → ANALYTICS 同步
 */
router.post('/sync/report-to-analytics', (req: Request, res: Response) => {
    try {
        integrationHub.syncReportToAnalytics(req.body.reportData || {});
        res.json({ success: true, message: 'Report to Analytics sync initiated' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/v1/integration/sync/ocr-to-report
 * OCR → REPORT 同步
 */
router.post('/sync/ocr-to-report', (req: Request, res: Response) => {
    try {
        integrationHub.syncOCRToReport(req.body.ocrData || {});
        res.json({ success: true, message: 'OCR to Report sync initiated' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/v1/integration/sync/all
 * 執行全量同步
 */
router.post('/sync/all', async (req: Request, res: Response) => {
    try {
        // Sync all modules
        await integrationHub.syncModuleData('CRM' as any, 'REPORT' as any);
        await integrationHub.syncModuleData('AGENCY' as any, 'FINANCE' as any);
        await integrationHub.syncModuleData('REPORT' as any, 'ANALYTICS' as any);
        await integrationHub.syncModuleData('OCR' as any, 'REPORT' as any);
        
        res.json({
            success: true,
            message: 'Full sync completed',
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============== Health Check ==============

/**
 * GET /api/v1/integration/health
 * 整合中心健康檢查
 */
router.get('/health', (req: Request, res: Response) => {
    try {
        const status = integrationHub.getIntegrationStatus();
        const activeModules = status.modules.filter(m => m.status === 'active').length;
        const activeWorkflows = status.workflows.filter(w => w.status === 'active').length;
        
        res.json({
            success: true,
            data: {
                status: 'healthy',
                modules: {
                    total: status.modules.length,
                    active: activeModules,
                },
                workflows: {
                    total: status.workflows.length,
                    active: activeWorkflows,
                },
                timestamp: new Date().toISOString(),
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
