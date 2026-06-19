
import express, { Request, Response, NextFunction } from 'express';
import redisService from '../services/redisService.js';
import { supabase } from '../db/supabaseClient.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { ValidationError, OmniError } from '../utils/omniError.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateRequest } from '../middleware/authMiddleware.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cacheMiddleware.js';

const router = express.Router();

// Middleware to ensure userId is provided (in body for now, or use auth middleware)
// For now, we'll assume the client sends userId in the body for simplicity in this phase.

/**
 * @route POST /api/game/sync
 * @desc Sync local game state to Redis for persistence across devices
 */
router.post('/sync', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { state } = req.body;
    const userId = (req as any).user?.userId;

    if (!userId || !state) {
        throw new ValidationError('Missing userId or state');
    }

    const key = `game:impact_nexus:user:${userId}`;
    await redisService.set(key, state, 86400); // 24 hour TTL

    // Invalidate game state cache for 5T Transparent consistency
    await invalidateCache('game_state:*');

    return res.json({ success: true, timestamp: Date.now() });
}));

/**
 * @route GET /api/game/state/:userId
 * @desc Retrieve synced game state
 */
router.get('/state/:userId', authenticateRequest, cacheMiddleware({ ttl: 3600, keyPrefix: 'game_state', useUserContext: true }), asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const key = `game:impact_nexus:user:${userId}`;
    const state = await redisService.get(key);

    if (!state) {
        return res.status(404).json({ success: false, error: 'No synced state found' });
    }

    return res.json({ success: true, state });
}));

/**
 * @route POST /api/game/crystallize
 * @desc Permanently record a game session (5T Proof) into the database
 */
router.post('/crystallize', authenticateRequest, asyncHandler(async (req: Request, res: Response) => {
    const { sessionData } = req.body;
    const userId = (req as any).user?.userId;

    if (!userId || !sessionData) {
        throw new ValidationError('Missing userId or sessionData');
    }

    const { uuid, version, timestamp, status, evidence, data } = sessionData;
    const crystalHash = evidence?.trustworthy?.hash_lock || '';

    if (!crystalHash) {
        throw new ValidationError('Invalid 5T Proof: Missing Hash Lock');
    }

    // Insert into battle_records (mapping session to battle record for now)
    const { data: record, error } = await supabase
        .from('battle_records')
        .insert({
            player1_id: userId,
            battle_type: 'PVE', // Default type
            difficulty: 'NORMAL', // Default difficulty
            crystal_hash: crystalHash,
            evidence: evidence, // Supabase can handle JSON object directly if column is jsonb
            battle_log: data?.activeEvents || [],
            rewards: { xp: data?.playerSoul?.xp || 0 }
        })
        .select('id')
        .single();

    if (error) throw error;

    omniLogger.info(LogCategory.AUDIT, 'Session Crystallized', { userId, recordId: record.id, hash: crystalHash });

    return res.json({
        success: true,
        recordId: record.id,
        status: 'PERMANENTLY_RECORDED'
    });
}));

export default router;
