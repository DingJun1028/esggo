/**
 * OmniSpace CRM Sync API Routes
 * 
 * API endpoints for managing bi-directional sync between InfoOne and OmniSpace CRM
 */

import express, { Request, Response } from 'express';
import { OmniSyncService } from '../services/OmniSyncService.js';
import { authenticateRequest } from '../middleware/authMiddleware.js';
import { supabase } from '../db/supabaseClient.js';

const router = express.Router();

// ============================================================================
// Manual Sync Triggers
// ============================================================================

/**
 * @swagger
 * /api/sync/player/{id}:
 *   post:
 *     summary: 手動同步單一玩家資料到 CRM
 *     tags: [OmniSpace Sync]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Player UUID
 *     responses:
 *       200:
 *         description: 同步成功
 *       400:
 *         description: 同步失敗
 */
router.post('/player/:id', authenticateRequest, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await OmniSyncService.syncPlayerToContact(id);

        if (result.success) {
            res.json({
                success: true,
                omni_space_id: result.omni_space_id,
                message: '玩家資料已成功同步到 CRM',
            });
        } else {
            res.status(400).json({
                success: false,
                error: result.error,
                conflict: result.conflict,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * @swagger
 * /api/sync/players/bulk:
 *   post:
 *     summary: 批量同步多個玩家資料到 CRM
 *     tags: [OmniSpace Sync]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               player_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 批量同步完成
 */
router.post('/players/bulk', authenticateRequest, async (req: Request, res: Response) => {
    try {
        const { player_ids } = req.body;

        if (!Array.isArray(player_ids)) {
            return res.status(400).json({
                success: false,
                error: 'player_ids 必須是陣列',
            });
        }

        const results = await OmniSyncService.bulkSyncPlayers(player_ids);

        const succeeded = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        res.json({
            success: true,
            total: results.length,
            succeeded,
            failed,
            results,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * @swagger
 * /api/sync/achievement/{id}:
 *   post:
 *     summary: 同步成就到 CRM Badge
 *     tags: [OmniSpace Sync]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Achievement UUID
 *     responses:
 *       200:
 *         description: 同步成功
 */
router.post('/achievement/:id', authenticateRequest, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await OmniSyncService.syncAchievementToBadge(id);

        if (result.success) {
            res.json({
                success: true,
                omni_space_id: result.omni_space_id,
                message: '成就已同步為 CRM 徽章',
            });
        } else {
            res.status(400).json({
                success: false,
                error: result.error,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * @swagger
 * /api/sync/battle/{id}:
 *   post:
 *     summary: 同步戰鬥紀錄到 CRM Activity
 *     tags: [OmniSpace Sync]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Battle UUID
 *     responses:
 *       200:
 *         description: 同步成功
 */
router.post('/battle/:id', authenticateRequest, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await OmniSyncService.syncBattleToActivity(id);

        if (result.success) {
            res.json({
                success: true,
                omni_space_id: result.omni_space_id,
                message: '戰鬥紀錄已同步為 CRM 活動',
            });
        } else {
            res.status(400).json({
                success: false,
                error: result.error,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * @swagger
 * /api/sync/card/{id}:
 *   post:
 *     summary: 同步卡牌到 CRM Asset
 *     tags: [OmniSpace Sync]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Card UUID
 *     responses:
 *       200:
 *         description: 同步成功
 */
router.post('/card/:id', authenticateRequest, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await OmniSyncService.syncCardToAsset(id);

        if (result.success) {
            res.json({
                success: true,
                omni_space_id: result.omni_space_id,
                message: '卡牌已同步為 CRM 資產',
            });
        } else {
            res.status(400).json({
                success: false,
                error: result.error,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * @swagger
 * /api/sync/evidence/{id}:
 *   post:
 *     summary: 同步證據到 CRM Document
 *     tags: [OmniSpace Sync]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Evidence UUID
 *     responses:
 *       200:
 *         description: 同步成功
 */
router.post('/evidence/:id', authenticateRequest, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await OmniSyncService.syncEvidenceToDocument(id);

        if (result.success) {
            res.json({
                success: true,
                omni_space_id: result.omni_space_id,
                message: '證據已同步為 CRM 文件',
            });
        } else {
            res.status(400).json({
                success: false,
                error: result.error,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * @swagger
 * /api/sync/cards/bulk:
 *   post:
 *     summary: 批量同步卡牌到 CRM
 *     tags: [OmniSpace Sync]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               card_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 批量同步完成
 */
router.post('/cards/bulk', authenticateRequest, async (req: Request, res: Response) => {
    try {
        const { card_ids } = req.body;

        if (!Array.isArray(card_ids)) {
            return res.status(400).json({
                success: false,
                error: 'card_ids 必須是陣列',
            });
        }

        const results = await OmniSyncService.bulkSyncCards(card_ids);

        const succeeded = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        res.json({
            success: true,
            total: results.length,
            succeeded,
            failed,
            results,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * @swagger
 * /api/sync/evidence/bulk:
 *   post:
 *     summary: 批量同步證據到 CRM
 *     tags: [OmniSpace Sync]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               evidence_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 批量同步完成
 */
router.post('/evidence/bulk', authenticateRequest, async (req: Request, res: Response) => {
    try {
        const { evidence_ids } = req.body;

        if (!Array.isArray(evidence_ids)) {
            return res.status(400).json({
                success: false,
                error: 'evidence_ids 必須是陣列',
            });
        }

        const results = await OmniSyncService.bulkSyncEvidence(evidence_ids);

        const succeeded = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        res.json({
            success: true,
            total: results.length,
            succeeded,
            failed,
            results,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// ============================================================================
// Webhook Receiver (CRM → InfoOne)
// ============================================================================

/**
 * @swagger
 * /api/sync/webhook:
 *   post:
 *     summary: 接收 OmniSpace CRM Webhook 更新
 *     tags: [OmniSpace Sync]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *               data:
 *                 type: object
 *               timestamp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Webhook 已處理
 *       401:
 *         description: 簽章驗證失敗
 */
router.post('/webhook', async (req: Request, res: Response) => {
    try {
        const signature = req.headers['x-omni-space-signature'] as string;
        const payload = JSON.stringify(req.body);

        // Verify webhook signature
        if (!OmniSyncService.verifyWebhookSignature(payload, signature || '')) {
            return res.status(401).json({
                success: false,
                error: 'Invalid webhook signature',
            });
        }

        const { event, data } = req.body;

        // Handle different webhook events
        switch (event) {
            case 'contact.updated':
                await OmniSyncService.syncContactToPlayer(data.id);
                break;

            case 'contact.created':
                // Handle new contact (if needed)
                break;

            case 'contact.deleted':
                // Handle contact deletion (if needed)
                break;

            default:
                console.log(`Unhandled webhook event: ${event}`);
        }

        res.json({
            success: true,
            message: 'Webhook processed',
        });
    } catch (error: any) {
        console.error('Webhook processing error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// ============================================================================
// Sync Status & Monitoring
// ============================================================================

/**
 * @swagger
 * /api/sync/status/{entity_type}/{entity_id}:
 *   get:
 *     summary: 查詢實體同步狀態
 *     tags: [OmniSpace Sync]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entity_type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [player, achievement, battle, card, evidence]
 *       - in: path
 *         name: entity_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 同步狀態
 */
router.get('/status/:entity_type/:entity_id', authenticateRequest, async (req: Request, res: Response) => {
    try {
        const { entity_type, entity_id } = req.params;

        const { data: syncLog } = await supabase
            .from('omni_sync_log')
            .select('*')
            .eq('entity_type', entity_type)
            .eq('entity_id', entity_id)
            .order('synced_at', { ascending: false })
            .limit(1)
            .single();

        res.json({
            success: true,
            entity_type,
            entity_id,
            last_sync: syncLog || null,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * @swagger
 * /api/sync/conflicts:
 *   get:
 *     summary: 列出所有未解決的同步衝突
 *     tags: [OmniSpace Sync]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 衝突清單
 */
router.get('/conflicts', authenticateRequest, async (req: Request, res: Response) => {
    try {
        const { data: conflicts } = await supabase
            .rpc('get_unresolved_omni_conflicts');

        res.json({
            success: true,
            total: conflicts?.length || 0,
            conflicts: conflicts || [],
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * @swagger
 * /api/sync/logs:
 *   get:
 *     summary: 查詢同步日誌
 *     tags: [OmniSpace Sync]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: entity_type
 *         schema:
 *           type: string
 *       - in: query
 *         name: sync_status
 *         schema:
 *           type: string
 *           enum: [success, failed, conflict, pending]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: 同步日誌
 */
router.get('/logs', authenticateRequest, async (req: Request, res: Response) => {
    try {
        const { entity_type, sync_status, limit = 50 } = req.query;

        let query = supabase
            .from('omni_sync_log')
            .select('*')
            .order('synced_at', { ascending: false })
            .limit(parseInt(limit as string));

        if (entity_type) {
            query = query.eq('entity_type', entity_type);
        }

        if (sync_status) {
            query = query.eq('sync_status', sync_status);
        }

        const { data: logs } = await query;

        res.json({
            success: true,
            total: logs?.length || 0,
            logs: logs || [],
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;
