/**
 * marketIntelligenceRoutes.ts
 * ----------------------------
 * 商情偵測中心 API 路由
 * 
 * 核心理念：上善若水，知識即資產
 */

import express, { Request, Response } from 'express';
import { marketIntelligenceCenterService, MIC_CURRICULUM, MICModule } from '../services/MarketIntelligenceCenterService.js';

const router = express.Router();

// ============================================
// 教學模組 API
// ============================================

/**
 * GET /api/mic/modules
 * 獲取所有教學模組
 */
router.get('/modules', async (req: Request, res: Response) => {
  try {
    const { level, completed } = req.query;
    
    let modules = marketIntelligenceCenterService.getAllModules();
    
    if (level) {
      modules = modules.filter(m => m.level === parseInt(level as string));
    }

    return res.json({
      success: true,
      data: {
        modules,
        total: modules.length,
      },
    });
  } catch (error) {
    console.error('Get modules error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve modules',
    });
  }
});

/**
 * GET /api/mic/modules/:moduleId
 * 獲取特定模組內容
 */
router.get('/modules/:moduleId', async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const module = marketIntelligenceCenterService.getModule(moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found',
      });
    }

    return res.json({
      success: true,
      data: module,
    });
  } catch (error) {
    console.error('Get module error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve module',
    });
  }
});

/**
 * POST /api/mic/modules/:moduleId/complete
 * 完成教學模組
 */
router.post('/modules/:moduleId/complete', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const { moduleId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required',
      });
    }

    const progress = await marketIntelligenceCenterService.completeModule(userId, moduleId);

    return res.json({
      success: true,
      data: progress,
      message: `恭喜完成「${MIC_CURRICULUM.find(m => m.id === moduleId)?.title}」模組！`,
    });
  } catch (error) {
    console.error('Complete module error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to complete module',
    });
  }
});

// ============================================
// 用戶進度 API
// ============================================

/**
 * GET /api/mic/progress/:userId
 * 獲取用戶進度
 */
router.get('/progress/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const progress = await marketIntelligenceCenterService.getUserProgress(userId);

    return res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error('Get progress error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve progress',
    });
  }
});

// ============================================
// 情資報告 API
// ============================================

/**
 * POST /api/mic/reports/generate
 * 生成商情報告
 */
router.post('/reports/generate', async (req: Request, res: Response) => {
  try {
    const { userId, type, target, focusAreas } = req.body;

    if (!userId || !type || !target) {
      return res.status(400).json({
        success: false,
        error: 'userId, type, and target are required',
      });
    }

    const report = await marketIntelligenceCenterService.generateReport(userId, {
      type,
      target,
      focusAreas,
    });

    return res.json({
      success: true,
      data: report,
      message: '報告已成功生成！',
    });
  } catch (error) {
    console.error('Generate report error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate report',
    });
  }
});

// ============================================
// 智能推薦 API
// ============================================

/**
 * POST /api/mic/recommendations
 * 獲取智能推薦
 */
router.post('/recommendations', async (req: Request, res: Response) => {
  try {
    const { userId, recentAnalyses, interests, alerts } = req.body;

    const recommendations = await marketIntelligenceCenterService.getSmartRecommendations(
      userId,
      { recentAnalyses, interests, alerts }
    );

    return res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get recommendations',
    });
  }
});

// ============================================
// 警示系統 API
// ============================================

/**
 * GET /api/mic/alerts/:userId
 * 獲取智能警示
 */
router.get('/alerts/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const alerts = await marketIntelligenceCenterService.generateAlerts(userId);

    return res.json({
      success: true,
      data: {
        alerts,
        total: alerts.length,
        unread: alerts.filter(a => !a.read).length,
      },
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get alerts',
    });
  }
});

// ============================================
// 排行榜 API
// ============================================

/**
 * GET /api/mic/leaderboard
 * 獲取排行榜
 */
router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    const { limit, timeframe } = req.query;
    
    const leaderboard = [
      { rank: 1, userId: 'user-1', username: '情報之王', xp: 15000, level: 12 },
      { rank: 2, userId: 'user-2', username: '趨勢大師', xp: 12000, level: 10 },
      { rank: 3, userId: 'user-3', username: '風險獵人', xp: 10000, level: 9 },
      { rank: 4, userId: 'user-4', username: '競合達人', xp: 8000, level: 8 },
      { rank: 5, userId: 'user-5', username: '市場觀察家', xp: 6000, level: 7 },
    ];

    return res.json({
      success: true,
      data: {
        leaderboard: leaderboard.slice(0, parseInt(limit as string) || 10),
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

/**
 * GET /api/mic/levels
 * 獲取等級閾值
 */
router.get('/levels', async (req: Request, res: Response) => {
  try {
    const levels = [
      { level: 1, title: '見習情報員', xpRequired: 0, privileges: ['存取基礎模組'] },
      { level: 2, title: '情報分析師', xpRequired: 20, privileges: ['存取進階模組'] },
      { level: 3, title: '市場研究專家', xpRequired: 50, privileges: ['生成分析報告'] },
      { level: 4, title: '趨勢分析師', xpRequired: 100, privileges: ['存取趨勢分析'] },
      { level: 5, title: '風險評估師', xpRequired: 200, privileges: ['風險評估工具'] },
      { level: 6, title: '競合策略師', xpRequired: 350, privileges: ['競合分析'] },
      { level: 7, title: '情報顧問', xpRequired: 500, privileges: ['團隊協作'] },
      { level: 8, title: '資深顧問', xpRequired: 800, privileges: ['進階 AI 分析'] },
      { level: 9, title: '情報大師', xpRequired: 1200, privileges: ['自訂分析模板'] },
      { level: 10, title: '首席分析師', xpRequired: 2000, privileges: ['API 存取'] },
      { level: 11, title: '策略宗師', xpRequired: 3500, privileges: ['策略顧問'] },
      { level: 12, title: '商業預言家', xpRequired: 5000, privileges: ['優先新功能'] },
      { level: 13, title: '商情之神', xpRequired: 10000, privileges: ['終身成就'] },
    ];

    return res.json({
      success: true,
      data: {
        levels,
        totalLevels: levels.length,
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

export default router;
