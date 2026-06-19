import express, { Request, Response, NextFunction } from 'express';
import { VisualizerService } from '../services/VisualizerService.js';
import { HeatmapService } from '../services/HeatmapService.js';
import { authenticateRequest } from '../middleware/authMiddleware.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { cacheMiddleware } from '../middleware/cacheMiddleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Apply authentication
router.use(authenticateRequest);

/**
 * GET /api/visualizer/funnel
 * Returns data for the evidence conversion funnel.
 */
router.get('/funnel', cacheMiddleware({ ttl: 600, keyPrefix: 'viz_funnel' }), asyncHandler(async (req: Request, res: Response) => {
    const data = await VisualizerService.getFunnelData();
    return res.json({
        success: true,
        data
    });
}));

/**
 * GET /api/visualizer/gantt
 * Returns data for the mission timeline chart.
 */
router.get('/gantt', cacheMiddleware({ ttl: 600, keyPrefix: 'viz_gantt' }), asyncHandler(async (req: Request, res: Response) => {
    const data = await VisualizerService.getGanttData();
    return res.json({
        success: true,
        data
    });
}));

/**
 * GET /api/visualizer/heatmap
 * Returns data for the global impact heatmap.
 */
router.get('/heatmap', cacheMiddleware({ ttl: 600, keyPrefix: 'viz_heatmap' }), asyncHandler(async (req: Request, res: Response) => {
    const data = await HeatmapService.getBehavioralHeatmap();
    return res.json({
        success: true,
        data
    });
}));


export default router;
