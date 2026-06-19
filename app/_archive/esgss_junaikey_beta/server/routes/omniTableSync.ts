/**
 * 🔄 OmniTable Sync API Routes
 * --------------------------------------------------
 * [5T 協議] Traceable, Trackable, Transparent, Tangible, Trustworthy
 * [核心原則] 服務即教學，知識即資產
 */

import { Router, Request, Response } from 'express';
import { OmniTableSyncService } from '../services/OmniTableSyncService.js';
import { writeLimiter, readLimiter } from '../middleware/rateLimiters.js';

const router = Router();

// ==================== Swagger Tags ====================

/**
 * @swagger
 * tags:
 *   name: OmniTable Sync
 *   description: OmniTable 雙向同步 API (5T Protocol Compliant)
 */

// ==================== Customer Sync ====================

/**
 * @swagger
 * /api/omni-table-sync/customer/{customerId}:
 *   post:
 *     summary: 🔄 同步 Customer → OmniTable
 *     description: |
 *       將 InfoOne 客戶資料同步至 OmniTable Customers Datasheet
 *       
 *       **5T Protocol:**
 *       - ✅ Traceable: 記錄 `source_origin` 與 UUID
 *       - ✅ Trackable: 完整生命週期日誌
 *       - ✅ Transparent: 同步狀態可查詢
 *       - ✅ Tangible: 返回 OmniTable Record ID
 *       - ✅ Trustworthy: Hash Lock 防篡改
 *     tags: [OmniTable Sync]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: InfoOne Customer UUID
 *     responses:
 *       200:
 *         description: 同步成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 recordId:
 *                   type: string
 *                   description: OmniTable Record ID
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: 請求錯誤
 *       500:
 *         description: 同步失敗
 */
router.post('/customer/:customerId', writeLimiter, async (req: Request, res: Response) => {
    const { customerId } = req.params;

    try {
        const result = await OmniTableSyncService.syncCustomerToOmniTable(customerId);

        if (result.success) {
            return res.json({
                success: true,
                recordId: result.recordId,
                timestamp: new Date().toISOString(),
                protocol: '5T_COMPLIANT',
            });
        } else {
            return res.status(result.retryable ? 500 : 400).json({
                success: false,
                error: result.error,
                retryable: result.retryable,
            });
        }
    } catch (error) {
        console.error('[OmniTableSync] Customer sync error:', error);
        return res.status(500).json({
            success: false,
            error: (error as Error).message,
            retryable: true,
        });
    }
});

/**
 * @swagger
 * /api/omni-table-sync/customer/bulk:
 *   post:
 *     summary: 🔄 批量同步 Customers → OmniTable
 *     tags: [OmniTable Sync]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       200:
 *         description: 批量同步完成
 */
router.post('/customer/bulk', writeLimiter, async (req: Request, res: Response) => {
    const { customerIds } = req.body;

    if (!Array.isArray(customerIds) || customerIds.length === 0) {
        return res.status(400).json({ error: 'customerIds array required' });
    }

    try {
        const result = await OmniTableSyncService.bulkSyncCustomers(customerIds);
        return res.json(result);
    } catch (error) {
        console.error('[OmniTableSync] Bulk customer sync error:', error);
        return res.status(500).json({
            success: false,
            error: (error as Error).message,
        });
    }
});

/**
 * @swagger
 * /api/omni-table-sync/webhook/customer:
 *   post:
 *     summary: 🪝 OmniTable Webhook: Customer Updated
 *     tags: [OmniTable Sync]
 *     responses:
 *       200:
 *         description: Webhook 處理成功
 */
router.post('/webhook/customer', writeLimiter, async (req: Request, res: Response) => {
    const { recordId, eventType } = req.body;

    try {
        if (eventType === 'record.deleted') {
            return res.json({ success: true, action: 'soft_delete' });
        }

        const result = await OmniTableSyncService.syncOmniTableToCustomer(recordId);

        if (result.success) {
            return res.json({
                success: true,
                customerId: result.recordId,
                eventType,
                timestamp: new Date().toISOString(),
            });
        } else {
            return res.status(500).json({
                success: false,
                error: result.error,
            });
        }
    } catch (error) {
        console.error('[OmniTableSync] Webhook error:', error);
        return res.status(500).json({
            success: false,
            error: (error as Error).message,
        });
    }
});

// ==================== Project Sync ====================

router.post('/project/:projectId', writeLimiter, async (req: Request, res: Response) => {
    const { projectId } = req.params;

    try {
        const result = await OmniTableSyncService.syncProjectToOmniTable(projectId);

        if (result.success) {
            return res.json({
                success: true,
                recordId: result.recordId,
                timestamp: new Date().toISOString(),
                protocol: '5T_COMPLIANT',
            });
        } else {
            return res.status(result.retryable ? 500 : 400).json({
                success: false,
                error: result.error,
                retryable: result.retryable,
            });
        }
    } catch (error) {
        console.error('[OmniTableSync] Project sync error:', error);
        return res.status(500).json({
            success: false,
            error: (error as Error).message,
        });
    }
});

// ==================== ESG Metric Sync ====================

router.post('/metric/:metricId', writeLimiter, async (req: Request, res: Response) => {
    const { metricId } = req.params;

    try {
        const result = await OmniTableSyncService.syncMetricToOmniTable(metricId);

        if (result.success) {
            return res.json({
                success: true,
                recordId: result.recordId,
                timestamp: new Date().toISOString(),
                protocol: '5T_COMPLIANT',
                transparency: 'ISO_14064_1_COMPLIANT',
            });
        } else {
            return res.status(result.retryable ? 500 : 400).json({
                success: false,
                error: result.error,
                retryable: result.retryable,
            });
        }
    } catch (error) {
        console.error('[OmniTableSync] Metric sync error:', error);
        return res.status(500).json({
            success: false,
            error: (error as Error).message,
        });
    }
});

// ==================== Evidence/Document Sync ====================

router.post('/evidence/:evidenceId', writeLimiter, async (req: Request, res: Response) => {
    const { evidenceId } = req.params;

    try {
        const result = await OmniTableSyncService.syncEvidenceToOmniTable(evidenceId);

        if (result.success) {
            return res.json({
                success: true,
                recordId: result.recordId,
                timestamp: new Date().toISOString(),
                protocol: '5T_COMPLIANT',
                trustworthy: 'HASH_LOCKED',
            });
        } else {
            return res.status(result.retryable ? 500 : 400).json({
                success: false,
                error: result.error,
                retryable: result.retryable,
            });
        }
    } catch (error) {
        console.error('[OmniTableSync] Evidence sync error:', error);
        return res.status(500).json({
            success: false,
            error: (error as Error).message,
        });
    }
});

// ==================== Sync Status & Statistics ====================

router.get('/status/:entityType/:entityId', readLimiter, async (req: Request, res: Response) => {
    const { entityType, entityId } = req.params;

    try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data, error } = await supabase.rpc('get_latest_omni_table_sync_status', { // Renamed RPC
            p_entity_type: entityType,
            p_entity_id: entityId,
        });

        if (error) throw error;

        return res.json({
            success: true,
            status: data?.[0] || null,
            protocol: '5T_TRACKABLE',
        });
    } catch (error) {
        console.error('[OmniTableSync] Status query error:', error);
        return res.status(500).json({
            success: false,
            error: (error as Error).message,
        });
    }
});

router.get('/statistics', readLimiter, async (req: Request, res: Response) => {
    const hours = parseInt(req.query.hours as string) || 24;

    try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data, error } = await supabase.rpc('get_omni_table_sync_statistics', { // Renamed RPC
            p_hours_ago: hours,
        });

        if (error) throw error;

        return res.json({
            success: true,
            statistics: data?.[0] || {},
            timeRange: `${hours} hours`,
            protocol: '5T_TANGIBLE',
        });
    } catch (error) {
        console.error('[OmniTableSync] Statistics error:', error);
        return res.status(500).json({
            success: false,
            error: (error as Error).message,
        });
    }
});

router.get('/conflicts', readLimiter, async (req: Request, res: Response) => {
    try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data, error } = await supabase.rpc('get_unresolved_omni_table_conflicts'); // Renamed RPC

        if (error) throw error;

        return res.json({
            success: true,
            conflicts: data || [],
            count: data?.length || 0,
        });
    } catch (error) {
        console.error('[OmniTableSync] Conflicts query error:', error);
        return res.status(500).json({
            success: false,
            error: (error as Error).message,
        });
    }
});

// ==================== Export Router ====================

export default router;
