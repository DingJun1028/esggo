import express, { Request, Response } from 'express';
import { scalingEngine } from '../../src/services/ScalingEngine.js';
import { aiCoordinationService } from '../../src/services/AICoordinationService.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { authenticateRequest } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * GET /api/ai/risk-forecast
 * Returns predictive risk forecasts for ESG pillars
 */
router.get('/ai/risk-forecast', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    omniLogger.info(LogCategory.AI, 'API: Fetching Predictive Risk Forecast');

    // In a real scenario, we might pass some history from the DB
    // For now, we use the service's internal logic or mock data
    const forecasts = await aiCoordinationService.performPredictiveRiskAnalysis([]);

    res.json({
        success: true,
        data: forecasts
    });
}));

/**
 * GET /api/system/scaling
 * Returns current auto-scaling suggestions from the AI Scaling Engine
 */
router.get('/system/scaling', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    omniLogger.info(LogCategory.SYSTEM, 'API: Fetching Auto-Scaling Status');

    const decisions = await scalingEngine.evaluateScaling();

    res.json({
        success: true,
        data: decisions
    });
}));

export default router;
