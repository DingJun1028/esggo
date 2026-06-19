import { Router, Request, Response, NextFunction } from 'express';
import { BehavioralTrackingService } from '../services/BehavioralTrackingService.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { OmniError, ErrorCode } from '../utils/omniError.js';
import { supabase } from '../db/supabaseClient.js';
import { BehaviorAnalyticsService } from '../services/BehaviorAnalyticsService.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cacheMiddleware.js';
import { HeatmapService } from '../services/HeatmapService.js';
import { asyncHandler } from '../middleware/errorHandler.js';


/**
 * server/routes/behaviorRoutes.ts
 * User Behavior Analytics & Telemetry
 */

const router = Router();

/**
 * @api {post} /api/behavior/track Track User Event
 * @body {string} eventType - Name of the event (e.g., 'click_assessment')
 * @body {string} [userId] - User identifier
 * @body {string} [sessionId] - Session identifier
 * @body {string} [pageUrl] - Current page
 * @body {object} [metadata] - Additional event data
 */
router.post('/track', asyncHandler(async (req: Request, res: Response) => {
    const { eventType, userId, sessionId, pageUrl, metadata } = req.body;

    if (!eventType) {
        throw new OmniError('eventType is required', 400, ErrorCode.VALIDATION_ERROR);
    }

    // We use a fire-and-forget pattern or background tracking
    // But for consistency, we await the service call
    await BehavioralTrackingService.track({
        userId,
        eventType,
        sessionId,
        pageUrl,
        metadata: metadata || {}
    });

    // [REDIS] Invalidate analytics cache on new track (5T Trackable)
    await invalidateCache('behavior:*');

    return res.status(202).json({
        success: true,
        message: 'Event tracking initiated'
    });
}));

/**
 * @api {get} /api/behavior/analytics Get Behavior Summary
 * Internal analytics for the visualizer.
 */
router.get('/analytics', cacheMiddleware({ ttl: 60, keyPrefix: 'behavior_analytics' }), asyncHandler(async (req: Request, res: Response) => {
    const stats = await BehavioralTrackingService.getEventCountsGrouped();

    return res.json({
        success: true,
        data: stats
    });
}));


/**
 * @api {get} /api/behavior/habits Get User Habits
 */
router.get('/habits/:userId', cacheMiddleware({ ttl: 300, keyPrefix: 'behavior_habits' }), asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const habits = await BehavioralTrackingService.getUserHabits(userId);
    return res.json({ success: true, data: habits });
}));

/**
 * @api {get} /api/behavior/history/:userId Get Personal Event History
 */
router.get('/history/:userId', asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { data, error } = await supabase
        .from('behavioral_events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) throw error;
    return res.json({ success: true, data });
}));

/**
 * @api {post} /api/behavior/analyze Trigger Analysis
 */
router.post('/analyze/:userId', asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const result = await BehaviorAnalyticsService.analyzeUserHabits(userId);

    // [REDIS] Invalidate specific user habits
    await invalidateCache(`behavior_habits:*${userId}*`);
    await invalidateCache('behavior_trends:*');

    return res.json({ success: true, result });
}));

/**
 * @api {get} /api/behavior/trends Get Global Trend Summary
 */
router.get('/trends', cacheMiddleware({ ttl: 300, keyPrefix: 'behavior_trends' }), asyncHandler(async (req: Request, res: Response) => {
    // Trigger summary sync (can be heavy, but it's on a 5-min cache)
    await BehaviorAnalyticsService.summarizeGlobalTrends();
    const { data, error } = await supabase
        .from('big_data_summary')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) throw error;
    const result = data?.[0] || null;

    return res.json({ success: true, data: result });
}));


/**
 * @api {get} /api/behavior/heatmap Get Interaction Heatmap
 */
router.get('/heatmap', cacheMiddleware({ ttl: 120, keyPrefix: 'behavior_heatmap' }), asyncHandler(async (req: Request, res: Response) => {
    const heatmap = await HeatmapService.getBehavioralHeatmap();

    return res.json({ success: true, data: heatmap });
}));


/**
 * @api {get} /api/behavior/activity Get Daily Activity Counts
 */
router.get('/activity', cacheMiddleware({ ttl: 300, keyPrefix: 'behavior_activity' }), asyncHandler(async (req: Request, res: Response) => {
    const counts = await BehavioralTrackingService.getDailyActivityCounts();

    return res.json({ success: true, data: counts });
}));


/**
 * @api {get} /api/behavior/funnel Get Funnel Analysis
 */
router.get('/funnel', cacheMiddleware({ ttl: 60, keyPrefix: 'behavior_funnel' }), asyncHandler(async (req: Request, res: Response) => {
    const { steps } = req.query;
    const funnelSteps = typeof steps === 'string' ? steps.split(',') : ['page_view', 'action_click', 'report_generate', 'verify_success'];
    const funnelData = await BehavioralTrackingService.getEventCountsForFunnel(funnelSteps);

    return res.json({ success: true, data: funnelData });
}));



export default router;
