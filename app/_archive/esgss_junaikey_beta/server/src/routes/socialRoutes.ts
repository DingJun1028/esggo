/**
 * socialRoutes.ts
 * ----------------------------
 * 社交系統 API 路由
 */

import { Router } from 'express';
import { unifiedAdvancementSocial } from '../services/UnifiedAdvancementSocial.js';

const router = Router();

// --- 好友功能 ---

/**
 * 獲取好友列表
 */
router.get('/friends/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const friends = await unifiedAdvancementSocial.getFriends(userId);
        res.json({ success: true, data: friends });
    } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

/**
 * 獲取好友請求
 */
router.get('/friend-requests/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const requests = await unifiedAdvancementSocial.getFriendRequests(userId);
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

/**
 * 發送好友請求
 */
router.post('/friend-request', async (req, res) => {
    try {
        const { fromUserId, fromUsername, toUserId, message } = req.body;
        const request = await unifiedAdvancementSocial.sendFriendRequest(fromUserId, fromUsername, toUserId, message);
        res.json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

/**
 * 回應好友請求
 */
router.post('/friend-request/:requestId/respond', async (req, res) => {
    try {
        const { requestId } = req.params;
        const { accept } = req.body;
        const result = await unifiedAdvancementSocial.respondToFriendRequest(requestId, accept);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

// --- 團隊 (OmniClaw) 功能 ---

/**
 * 獲取所有團隊
 */
router.get('/omniclaws', async (req, res) => {
    try {
        const omniClaws = await unifiedAdvancementSocial.getOmniClaws();
        res.json({ success: true, data: omniClaws });
    } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

/**
 * 創建團隊
 */
router.post('/omniclaw', async (req, res) => {
    try {
        const { name, leaderId, description, category } = req.body;
        const omniClaw = await unifiedAdvancementSocial.createOmniClaw(name, leaderId, description, category);
        res.json({ success: true, data: omniClaw });
    } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

/**
 * 激活團隊 AI 代理
 */
router.post('/omniclaw/:omniClawId/activate', async (req, res) => {
    try {
        const { omniClawId } = req.params;
        const result = await unifiedAdvancementSocial.activateOmniClawAgent(omniClawId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

// --- 活動動態 ---

/**
 * 獲取活動動態
 */
router.get('/activity-feed', async (req, res) => {
    try {
        const { limit } = req.query;
        const feed = await unifiedAdvancementSocial.getActivityFeed(limit ? parseInt(limit as string) : 20);
        res.json({ success: true, data: feed });
    } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

// --- AI 建議 ---

/**
 * 獲取 AI 社交建議
 */
router.post('/advice', async (req, res) => {
    try {
        const { userId, context, omniClawId } = req.body;
        const advice = await unifiedAdvancementSocial.getSocialAdvice(userId, context, omniClawId);
        res.json({ success: true, data: { advice } });
    } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

// --- Achievement Verification ---
/**
 * @route POST /api/social/verify-achievement
 * @desc Trigger multi-agent signature verification for an achievement
 * @access Private
 */
router.post('/verify-achievement', async (req, res) => {
    try {
        const { userId, achievementId, evidenceEntryId } = req.body;

        if (!userId || !achievementId || !evidenceEntryId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters: userId, achievementId, or evidenceEntryId'
            });
        }

        const result = await unifiedAdvancementSocial.verifyAchievement(userId, achievementId, evidenceEntryId);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('[socialRoutes] Error in /verify-achievement:', error);
        res.status(500).json({
            success: false,
            error: (error as Error).message
        });
    }
});

export default router;
