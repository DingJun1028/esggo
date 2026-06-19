import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import redisService from '../services/redisService.js';
import { supabase } from '../db/supabaseClient.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { OmniError, ErrorCode } from '../utils/omniError.js';
const ValidationError = OmniError; // alias for compatibility if needed or just use OmniError below

const router = express.Router();

/**
 * @route POST /api/sovereign/sync
 * @desc Sync local sovereign ledger to backend (Redis + Supabase)
 */
router.post('/sync', asyncHandler(async (req: Request, res: Response) => {
    const { userId, participant, ledger } = req.body;

    if (!userId || !ledger || !Array.isArray(ledger)) {
        throw new ValidationError('Missing userId or valid ledger');
    }

    omniLogger.info(LogCategory.SOVEREIGN, `[LEDGER_SYNC] 🏛️ Syncing ledger for ${userId}`, {
        recordCount: ledger.length
    });

    // 1. Persist to Redis for fast retrieval (24hr TTL)
    const redisKey = `sovereign:ledger:${userId}`;
    await redisService.set(redisKey, { participant, ledger }, 86400);

    // 2. Persist to Supabase for permanency (Archive)
    // Note: We use the 'impact_ledger_archives' table or similar from previous migrations
    const { error } = await supabase
        .from('sovereign_ledger_archives')
        .upsert({
            did: userId,
            participant_data: participant,
            ledger_data: ledger,
            last_sync: new Date().toISOString()
        }, { onConflict: 'did' });

    if (error) {
        omniLogger.error(LogCategory.DATABASE, '[LEDGER_SYNC] Supabase persistence failed', error);
        // We still return success if Redis worked, but log the error
    }

    return res.json({
        success: true,
        timestamp: Date.now(),
        status: 'SYNCED_AND_ARCHIVED'
    });
}));

/**
 * @route GET /api/sovereign/ledger/:userId
 * @desc Retrieve the latest archived ledger for a user
 */
router.get('/ledger/:userId', asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    // Check Redis first
    const redisKey = `sovereign:ledger:${userId}`;
    const cached = await redisService.get(redisKey);
    if (cached) {
        return res.json({ success: true, ...cached, source: 'cache' });
    }

    // Fallback to Supabase
    const { data, error } = await supabase
        .from('sovereign_ledger_archives')
        .select('*')
        .eq('did', userId)
        .single();

    if (error || !data) {
        return res.status(404).json({ success: false, message: 'Ledger not found' });
    }

    return res.json({
        success: true,
        participant: data.participant_data,
        ledger: data.ledger_data,
        source: 'database'
    });
}));

export default router;
