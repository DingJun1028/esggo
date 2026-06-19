/**
 * unifiedAdvancementRoutes.ts
 * ----------------------------
 * 奧秘晉級系統 API 路由
 * 
 * 核心理念：無縫接軌，觸類旁通
 * 設計哲學：上善若水，萬法歸一
 */

import { Router, Request, Response } from 'express';
import { unifiedAdvancementService, UnifiedUserProgress, SmartRecommendation, LearningPath } from '../services/UnifiedAdvancementService.js';
import { cacheMiddleware, invalidateCache } from '../../middleware/cacheMiddleware.js';
import { readLimiter } from '../../middleware/rateLimiters.js';
import omniLogger, { LogCategory } from '../../utils/omniLogger.js';

const router = Router();

// ============================================
// 用戶進度 API
// ============================================

/**
 * GET /api/uas/progress/:userId
 * 獲取用戶統一進度
 */
router.get('/progress/:userId', readLimiter, cacheMiddleware({ ttl: 300, keyPrefix: 'uas_progress' }), async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const progress = await unifiedAdvancementService.getUserProgress(userId);

    return res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get user progress',
    });
  }
});

/**
 * POST /api/uas/experience
 * 添加經驗值
 */
router.post('/experience', async (req: Request, res: Response) => {
  try {
    const { userId, xp, type, metadata } = req.body;

    if (!userId || !xp || !type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, xp, type',
      });
    }

    const progress = await unifiedAdvancementService.addExperience(userId, xp, type, metadata);

    // [REDIS] Invalidate user-specific progress and activity cache
    await invalidateCache(`uas_progress:*${userId}*`);
    await invalidateCache(`uas_activities:*${userId}*`);
    await invalidateCache(`uas_leaderboard:*`); // Leaderboard might change

    return res.json({
      success: true,
      data: {
        level: progress.combinedLevel,
        xp: progress.combinedXP,
        title: progress.combinedTitle,
      },
    });
  } catch (error) {
    console.error('Add experience error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to add experience',
    });
  }
});

// ============================================
// 智能推薦 API
// ============================================

/**
 * GET /api/uas/recommendations/:userId
 * 獲取智能推薦
 */
router.get('/recommendations/:userId', readLimiter, cacheMiddleware({ ttl: 600, keyPrefix: 'uas_recs' }), async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const recommendations = await unifiedAdvancementService.getSmartRecommendations(userId);

    return res.json({
      success: true,
      data: {
        recommendations,
        total: recommendations.length,
      },
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get recommendations',
    });
  }
});

/**
 * POST /api/uas/advice
 * 獲取 AI 學習建議
 */
router.post('/advice', async (req: Request, res: Response) => {
  try {
    const { userId, context } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: userId',
      });
    }

    const advice = await unifiedAdvancementService.generateLearningAdvice(userId, context || '提供一般性建議');

    return res.json({
      success: true,
      data: {
        advice,
      },
    });
  } catch (error) {
    console.error('Get advice error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get advice',
    });
  }
});

// ============================================
// 學習路徑 API
// ============================================

/**
 * GET /api/uas/learning-path/:userId
 * 獲取學習路徑
 */
router.get('/learning-path/:userId', readLimiter, cacheMiddleware({ ttl: 600, keyPrefix: 'uas_path' }), async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const paths = await unifiedAdvancementService.getLearningPath(userId);

    return res.json({
      success: true,
      data: {
        paths,
        total: paths.length,
      },
    });
  } catch (error) {
    console.error('Get learning path error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get learning path',
    });
  }
});

// ============================================
// 跨服務學習 API
// ============================================

/**
 * POST /api/uas/cross-learning
 * 完成跨服務學習
 */
router.post('/cross-learning', async (req: Request, res: Response) => {
  try {
    const { userId, reportModuleId, marketModuleId } = req.body;

    if (!userId || !reportModuleId || !marketModuleId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, reportModuleId, marketModuleId',
      });
    }

    const progress = await unifiedAdvancementService.completeCrossServiceLearning(
      userId,
      reportModuleId,
      marketModuleId
    );

    // [REDIS] Invalidate cache for new badges and progress
    await invalidateCache(`uas_progress:*${userId}*`);
    await invalidateCache(`uas_badges:*${userId}*`);
    await invalidateCache(`uas_leaderboard:*`);

    return res.json({
      success: true,
      data: {
        level: progress.combinedLevel,
        xp: progress.combinedXP,
        newBadge: progress.unifiedBadges[progress.unifiedBadges.length - 1],
      },
    });
  } catch (error) {
    console.error('Cross learning error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to complete cross learning',
    });
  }
});

// ============================================
// 傳承系統 API
// ============================================

/**
 * POST /api/uas/legacy/points
 * 添加傳承點數
 */
router.post('/legacy/points', async (req: Request, res: Response) => {
  try {
    const { userId, points, reason } = req.body;

    if (!userId || !points) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, points',
      });
    }

    const progress = await unifiedAdvancementService.addLegacyPoints(userId, points, reason || '一般獎勵');

    // [REDIS] Invalidate progress (legacy points part of it)
    await invalidateCache(`uas_progress:*${userId}*`);

    return res.json({
      success: true,
      data: {
        legacyPoints: progress.legacyPoints,
      },
    });
  } catch (error) {
    console.error('Add legacy points error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to add legacy points',
    });
  }
});

/**
 * POST /api/uas/legacy/transfer
 * 轉移傳承點數
 */
router.post('/legacy/transfer', async (req: Request, res: Response) => {
  try {
    const { fromUserId, toUserId, points, reason } = req.body;

    if (!fromUserId || !toUserId || !points) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: fromUserId, toUserId, points',
      });
    }

    const result = await unifiedAdvancementService.transferLegacyPoints(
      fromUserId,
      toUserId,
      points,
      reason || '知識傳承'
    );

    if (result.success) {
      await invalidateCache(`uas_progress:*${fromUserId}*`);
      await invalidateCache(`uas_progress:*${toUserId}*`);
    }

    return res.json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    console.error('Transfer legacy points error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to transfer legacy points',
    });
  }
});

// ============================================
// 排行榜 API
// ============================================

/**
 * GET /api/uas/leaderboard
 * 獲取排行榜
 */
router.get('/leaderboard', readLimiter, cacheMiddleware({ ttl: 300, keyPrefix: 'uas_leaderboard' }), async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    const leaderboard = await unifiedAdvancementService.getLeaderboard(parseInt(limit as string) || 10);

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
      error: 'Failed to get leaderboard',
    });
  }
});

// ============================================
// 活動記錄 API
// ============================================

/**
 * GET /api/uas/activities/:userId
 * 獲取用戶活動記錄
 */
router.get('/activities/:userId', readLimiter, cacheMiddleware({ ttl: 300, keyPrefix: 'uas_activities' }), async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;
    const activities = await unifiedAdvancementService.getUserActivities(userId, parseInt(limit as string) || 20);

    return res.json({
      success: true,
      data: {
        activities,
        total: activities.length,
      },
    });
  } catch (error) {
    console.error('Get activities error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get activities',
    });
  }
});

// ============================================
// AI 分析 API
// ============================================

/**
 * POST /api/uas/analyze
 * AI 智能分析用戶進度
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: userId',
      });
    }

    const analysis = await unifiedAdvancementService.analyzeProgressWithAI(userId);

    return res.json({
      success: true,
      data: {
        analysis,
      },
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to analyze progress',
    });
  }
});

// ============================================
// 等級閾值 API
// ============================================

/**
 * GET /api/uas/levels
 * 獲取等級閾值
 */
router.get('/levels', readLimiter, cacheMiddleware({ ttl: 86400, keyPrefix: 'uas_levels' }), async (req: Request, res: Response) => {
  try {
    const { UNIFIED_LEVELS } = await import('../services/UnifiedAdvancementService.js');

    return res.json({
      success: true,
      data: {
        levels: UNIFIED_LEVELS,
        totalLevels: UNIFIED_LEVELS.length,
      },
    });
  } catch (error) {
    console.error('Get levels error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get levels',
    });
  }
});

// ============================================
// 徽章與成就 API
// ============================================

/**
 * GET /api/uas/badges/:userId
 * 獲取用戶徽章
 */
router.get('/badges/:userId', readLimiter, cacheMiddleware({ ttl: 600, keyPrefix: 'uas_badges' }), async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const progress = await unifiedAdvancementService.getUserProgress(userId);

    return res.json({
      success: true,
      data: {
        badges: progress.unifiedBadges,
        total: progress.unifiedBadges.length,
      },
    });
  } catch (error) {
    console.error('Get badges error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get badges',
    });
  }
});

/**
 * GET /api/uas/achievements/:userId
 * 獲取用戶成就
 */
router.get('/achievements/:userId', readLimiter, cacheMiddleware({ ttl: 600, keyPrefix: 'uas_achievements' }), async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const progress = await unifiedAdvancementService.getUserProgress(userId);

    return res.json({
      success: true,
      data: {
        achievements: progress.unifiedAchievements,
        total: progress.unifiedAchievements.length,
      },
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get achievements',
    });
  }
});

export default router;
