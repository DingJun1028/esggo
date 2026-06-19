/**
 * healthRoutes.ts
 * 健康檢查路由 - 支援 Kubernetes/Docker 探針
 */

import { Router, Request, Response } from 'express';
import systemHealthService from '../services/SystemHealthService.js';

const router = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: 基本活性檢查 (Liveness Probe)
 *     description: 確認伺服器程序是否存活
 *     responses:
 *       200:
 *         description: 伺服器運作正常
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthStatus'
 */
router.get('/', (req: Request, res: Response) => {
    const status = systemHealthService.getLivenessStatus();
    res.status(200).json(status);
});

/**
 * @openapi
 * /api/health/deep:
 *   get:
 *     tags:
 *       - Health
 *     summary: 深度就緒檢查 (Readiness Probe)
 *     description: 確認所有外部依賴 (DB/Redis) 是否正常
 *     responses:
 *       200:
 *         description: 所有服務就緒
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadinessStatus'
 *       503:
 *         description: 部分服務未就緒
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadinessStatus'
 */
router.get('/deep', async (req: Request, res: Response) => {
    try {
        const status = await systemHealthService.getReadinessStatus();
        const httpStatus = status.ready ? 200 : 503;
        res.status(httpStatus).json(status);
    } catch (error: any) {
        res.status(500).json({
            ready: false,
            error: error.message,
            timestamp: new Date().toISOString(),
        });
    }
});

/**
 * @openapi
 * /api/health/metrics:
 *   get:
 *     tags:
 *       - Health
 *     summary: 系統指標快照
 *     description: 取得 API 吞吐量、錯誤率等指標
 *     responses:
 *       200:
 *         description: 系統指標
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uptime:
 *                   type: number
 *                   example: 3600
 *                 api_hits:
 *                   type: integer
 *                   example: 1000
 *                 error_count:
 *                   type: integer
 *                   example: 5
 *                 status:
 *                   type: string
 *                   enum: [OPTIMAL, DEGRADED, CRITICAL]
 */
router.get('/metrics', async (req: Request, res: Response) => {
    try {
        const snapshot = await systemHealthService.getSnapshot();
        res.status(200).json(snapshot);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
