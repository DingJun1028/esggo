// server/routes/reportRoutes.ts
import { Router } from 'express';
import { authenticateRequest } from '../middleware/authMiddleware.js';
import { readLimiter, writeLimiter } from '../middleware/rateLimitersEnhanced.js';
import { cacheMiddleware } from '../middleware/cacheMiddleware.js';
import {
    generateReport,
    getReportStatus,
    getReportHistory,
    getReportById,
    deleteReport,
} from '../controllers/reportController.js';

const router = Router();

// POST /api/reports/generate — 非同步生成，返回 jobId
router.post(
    '/generate',
    authenticateRequest,
    writeLimiter,
    generateReport
);

// GET /api/reports/status/:jobId — 查詢 Job 狀態
router.get(
    '/status/:jobId',
    authenticateRequest,
    readLimiter,
    getReportStatus
);

// GET /api/reports/history — 帶 Redis 快取 (300s) 的歷史列表
// NOTE: must register /history BEFORE /:id to avoid route shadowing
router.get(
    '/history',
    authenticateRequest,
    readLimiter,
    cacheMiddleware({ ttl: 300, keyPrefix: 'reports_history', useUserContext: true }),
    getReportHistory
);

// GET /api/reports/:id — 帶 Redis 快取 (300s) 的單筆報告
router.get(
    '/:id',
    authenticateRequest,
    readLimiter,
    cacheMiddleware({ ttl: 300, keyPrefix: 'reports_single' }),
    getReportById
);

// DELETE /api/reports/:id — 刪除報告
router.delete(
    '/:id',
    authenticateRequest,
    writeLimiter,
    deleteReport
);

export default router;
