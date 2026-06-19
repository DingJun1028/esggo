/**
 * 商情偵測中心 API 路由
 * Intelligence Detection Center API Routes
 */

import express, { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { IntelligenceController } from '../src/controllers/IntelligenceController.js';
import { authenticateJWT, optionalAuthenticateJWT } from '../src/middleware/auth.js';
import { errorHandlerMiddleware } from '../src/middleware/errorHandler.js';
import { omniLogger, LogCategory } from '../../src/omni/infrastructure/logging/OmniLogger.js';
import { cacheMiddleware } from '../middleware/cacheMiddleware.js';

const router: Router = express.Router();

// ============================================================================
// Rate Limiting Configuration
// ============================================================================

// 讀取操作限制器（較寬鬆）
const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 200, // 每個 IP 最多 200 個請求
  message: { error: 'Too many read requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// 寫入操作限制器（較嚴格）
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 50, // 每個 IP 最多 50 個請求
  message: { error: 'Too many write requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// 分析操作限制器（最嚴格）
const analysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 小時
  max: 20, // 每個 IP 最多 20 個請求
  message: { error: 'Too many analysis requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================================================
// Error Handling Middleware
// ============================================================================

interface ApiError extends Error {
  statusCode?: number;
  errorCode?: string;
}

const errorHandler = (err: ApiError, req: Request, res: Response, _next: NextFunction) => {
  omniLogger.error(LogCategory.SYSTEM, `[${req.method}] ${req.path} - Error: ${err.message}`, {
    error: err.stack,
    errorCode: err.errorCode
  });

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.errorCode || 'INTERNAL_ERROR',
      message: err.message || 'Internal Server Error',
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
};

// ============================================================================
// Health Check Endpoint
// ============================================================================

/**
 * @swagger
 * /api/intelligence/health:
 *   get:
 *     summary: Health check for Intelligence Detection Center
 *     tags: [Intelligence]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json({
      status: 'healthy',
      service: 'Intelligence Detection Center',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'Service error',
      timestamp: new Date().toISOString()
    });
  }
});

// ============================================================================
// 情報項目路由 (Intelligence Items)
// ============================================================================

/**
 * @swagger
 * /api/intelligence/items:
 *   get:
 *     summary: 取得情報項目列表
 *     tags: [Intelligence]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 頁碼
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 每頁數量
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 情報類別
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *         description: 優先級
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜尋關鍵字
 *     responses:
 *       200:
 *         description: 成功取得情報項目列表
 */
// Cache intelligence items list 3 min — high read frequency, low mutation rate
router.get('/items', readLimiter, optionalAuthenticateJWT, cacheMiddleware({ ttl: 180, keyPrefix: 'intel_items' }), IntelligenceController.getIntelligenceItems);

/**
 * @swagger
 * /api/intelligence/items/:id:
 *   get:
 *     summary: 取得單一情報項目
 *     tags: [Intelligence]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功取得情報項目
 */
router.get('/items/:id', readLimiter, optionalAuthenticateJWT, IntelligenceController.getIntelligenceItemById);

/**
 * @swagger
 * /api/intelligence/items:
 *   post:
 *     summary: 建立情報項目
 *     tags: [Intelligence]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - summary
 *               - content
 *               - source
 *               - category
 *               - priority
 *     responses:
 *       201:
 *         description: 成功建立情報項目
 */
router.post('/items', writeLimiter, authenticateJWT, IntelligenceController.createIntelligenceItem);

/**
 * @swagger
 * /api/intelligence/items/:id:
 *   put:
 *     summary: 更新情報項目
 *     tags: [Intelligence]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: 成功更新情報項目
 */
router.put('/items/:id', writeLimiter, authenticateJWT, IntelligenceController.updateIntelligenceItem);

/**
 * @swagger
 * /api/intelligence/items/:id:
 *   delete:
 *     summary: 刪除情報項目
 *     tags: [Intelligence]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功刪除情報項目
 */
router.delete('/items/:id', writeLimiter, authenticateJWT, IntelligenceController.deleteIntelligenceItem);

// ============================================================================
// 每日簡報路由 (Daily Briefs)
// ============================================================================

/**
 * @swagger
 * /api/intelligence/daily-briefs:
 *   get:
 *     summary: 取得每日簡報列表
 *     tags: [Intelligence]
 *     responses:
 *       200:
 *         description: 成功取得每日簡報列表
 */
// Cache daily briefs list 3 min — generated once daily, safe for short cache
router.get('/daily-briefs', readLimiter, optionalAuthenticateJWT, cacheMiddleware({ ttl: 180, keyPrefix: 'intel_briefs' }), IntelligenceController.getDailyBriefs);

/**
 * @swagger
 * /api/intelligence/daily-briefs/:id:
 *   get:
 *     summary: 取得單一每日簡報
 *     tags: [Intelligence]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功取得每日簡報
 */
router.get('/daily-briefs/:id', readLimiter, optionalAuthenticateJWT, IntelligenceController.getDailyBriefById);

/**
 * @swagger
 * /api/intelligence/daily-briefs:
 *   post:
 *     summary: 建立每日簡報
 *     tags: [Intelligence]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: 成功建立每日簡報
 */
router.post('/daily-briefs', writeLimiter, authenticateJWT, IntelligenceController.createDailyBrief);

// ============================================================================
// 趨勢預測路由 (Trend Predictions)
// ============================================================================

/**
 * @swagger
 * /api/intelligence/trends:
 *   get:
 *     summary: 取得趨勢預測列表
 *     tags: [Intelligence]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 類別篩選
 *     responses:
 *       200:
 *         description: 成功取得趨勢預測列表
 */
// Cache trend predictions 10 min — computational results that rarely change between requests
router.get('/trends', readLimiter, optionalAuthenticateJWT, cacheMiddleware({ ttl: 600, keyPrefix: 'intel_trends' }), IntelligenceController.getTrendPredictions);

// ============================================================================
// 類別路由 (Categories)
// ============================================================================

/**
 * @swagger
 * /api/intelligence/categories:
 *   get:
 *     summary: 取得類別列表
 *     tags: [Intelligence]
 *     responses:
 *       200:
 *         description: 成功取得類別列表
 */
// Cache categories 1 hour — nearly static lookup data
router.get('/categories', readLimiter, optionalAuthenticateJWT, cacheMiddleware({ ttl: 3600, keyPrefix: 'intel_categories' }), IntelligenceController.getCategories);

// ============================================================================
// 來源路由 (Sources)
// ============================================================================

/**
 * @swagger
 * /api/intelligence/sources:
 *   get:
 *     summary: 取得來源列表
 *     tags: [Intelligence]
 *     responses:
 *       200:
 *         description: 成功取得來源列表
 */
// Cache sources 1 hour — static reference data
router.get('/sources', readLimiter, optionalAuthenticateJWT, cacheMiddleware({ ttl: 3600, keyPrefix: 'intel_sources' }), IntelligenceController.getSources);

// ============================================================================
// 標籤路由 (Tags)
// ============================================================================

/**
 * @swagger
 * /api/intelligence/tags:
 *   get:
 *     summary: 取得標籤列表
 *     tags: [Intelligence]
 *     responses:
 *       200:
 *         description: 成功取得標籤列表
 */
// Cache tags 1 hour — static reference data
router.get('/tags', readLimiter, optionalAuthenticateJWT, cacheMiddleware({ ttl: 3600, keyPrefix: 'intel_tags' }), IntelligenceController.getTags);

// ============================================================================
// 分析路由 (Analysis)
// ============================================================================

/**
 * @swagger
 * /api/intelligence/analysis/:intelligenceId:
 *   post:
 *     summary: 分析情報項目
 *     tags: [Intelligence]
 *     parameters:
 *       - in: path
 *         name: intelligenceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - analysisTypes
 *             properties:
 *               analysisTypes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 成功分析情報項目
 */
router.post('/analysis/:intelligenceId', analysisLimiter, authenticateJWT, IntelligenceController.analyzeIntelligenceItem);

/**
 * @swagger
 * /api/intelligence/analysis/:intelligenceId:
 *   get:
 *     summary: 取得分析結果
 *     tags: [Intelligence]
 *     parameters:
 *       - in: path
 *         name: intelligenceId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: analysisType
 *         schema:
 *           type: string
 *         description: 分析類型篩選
 *     responses:
 *       200:
 *         description: 成功取得分析結果
 */
router.get('/analysis/:intelligenceId', readLimiter, optionalAuthenticateJWT, IntelligenceController.getAnalysisResults);

// ============================================================================
// 通知路由 (Notifications)
// ============================================================================

/**
 * @swagger
 * /api/intelligence/notifications:
 *   get:
 *     summary: 取得用戶通知
 *     tags: [Intelligence]
 *     parameters:
 *       - in: query
 *         name: unreadOnly
 *         schema:
 *           type: boolean
 *         description: 是否只顯示未讀通知
 *     responses:
 *       200:
 *         description: 成功取得用戶通知
 */
router.get('/notifications', readLimiter, authenticateJWT, IntelligenceController.getUserNotifications);

/**
 * @swagger
 * /api/intelligence/notifications/:id/read:
 *   put:
 *     summary: 標記通知為已讀
 *     tags: [Intelligence]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功標記通知為已讀
 */
router.put('/notifications/:id/read', writeLimiter, authenticateJWT, IntelligenceController.markNotificationAsRead);

/**
 * @swagger
 * /api/intelligence/notifications/read-all:
 *   put:
 *     summary: 標記所有通知為已讀
 *     tags: [Intelligence]
 *     responses:
 *       200:
 *         description: 成功標記所有通知為已讀
 */
router.put('/notifications/read-all', writeLimiter, authenticateJWT, IntelligenceController.markAllNotificationsAsRead);

/**
 * @swagger
 * /api/intelligence/notifications/:id:
 *   delete:
 *     summary: 刪除通知
 *     tags: [Intelligence]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功刪除通知
 */
router.delete('/notifications/:id', writeLimiter, authenticateJWT, IntelligenceController.deleteNotification);

// ============================================================================
// 偏好設定路由 (Preferences)
// ============================================================================

/**
 * @swagger
 * /api/intelligence/preferences:
 *   get:
 *     summary: 取得用戶偏好
 *     tags: [Intelligence]
 *     responses:
 *       200:
 *         description: 成功取得用戶偏好
 */
router.get('/preferences', readLimiter, authenticateJWT, IntelligenceController.getUserPreferences);

/**
 * @swagger
 * /api/intelligence/preferences:
 *   put:
 *     summary: 更新用戶偏好
 *     tags: [Intelligence]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: 成功更新用戶偏好
 */
router.put('/preferences', writeLimiter, authenticateJWT, IntelligenceController.updateUserPreferences);

// ============================================================================
// 法規更新對照表路由 (Regulation Updates)
// ============================================================================

/**
 * @swagger
 * /api/intelligence/regulation-updates:
 *   get:
 *     summary: 取得法規更新對照表
 *     tags: [Intelligence]
 *     responses:
 *       200:
 *         description: 成功取得法規更新對照表
 */
router.get('/regulation-updates', readLimiter, optionalAuthenticateJWT, IntelligenceController.getRegulationUpdates);

// ============================================================================
// 任務轉換路由 (Task Conversion)
// ============================================================================

/**
 * @swagger
 * /api/intelligence/items/:id/convert-to-task:
 *   post:
 *     summary: 轉換為任務
 *     tags: [Intelligence]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - actionId
 *             properties:
 *               actionId:
 *                 type: string
 *               assigneeId:
 *                 type: string
 *               dueDate:
 *                 type: string
 *               priority:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: 成功轉換為任務
 */
router.post('/items/:id/convert-to-task', writeLimiter, authenticateJWT, IntelligenceController.convertToTask);

// ============================================================================
// Export Router with Error Handler
// ============================================================================

router.use(errorHandler);

export default router;
