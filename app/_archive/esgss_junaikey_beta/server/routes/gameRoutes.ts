import express, { Request, Response } from 'express';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cacheMiddleware.js';
import redisService from '../services/redisService.js';
import { supabase } from '../db/supabaseClient.js';
import { ValidationError, OmniError, ErrorCode } from '../utils/omniError.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateRequest } from '../middleware/authMiddleware.js';

const router = express.Router();

// ===============================================
// CONSTANTS & UTILS
// ===============================================
const GAME_STATE_TTL = 86400; // 24 Hours

// Validation helper (Simple for now, can perform Zod validation later)
const validateSessionData = (sessionData: any) => {
    if (!sessionData || !sessionData.uuid || !sessionData.evidence) {
        throw new ValidationError('Invalid Session Data: Missing UUID or Evidence');
    }
    if (!sessionData.evidence.trustworthy?.hash_lock) {
        throw new ValidationError('Invalid 5T Proof: Missing Hash Lock');
    }
};

/**
 * @route GET /api/game/state/:userId
 * @desc Retrieve synced game state (Redis -> DB Fallback)
 */
router.get('/state/:userId', cacheMiddleware({ ttl: 3600, keyPrefix: 'game_state', useUserContext: true }), asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    // 1. Try Redis (handled by middleware, but if we are here, it's a MISS or logic requires manual check? 
    // Wait, cacheMiddleware checks cache first. If it hits, this handler is NOT called.
    // So if we are here, we need to fetch data and return it. cacheMiddleware will cache the response.)

    // However, the original code had fallback to DB. 
    // cacheMiddleware caches what we send via res.json.
    // So we just need to get the data (from Redis or DB) and send it.

    // Original logic:
    // const key = `game:impact_nexus:user:${userId}`;
    // const cachedState = await redisService.get(key);
    // if (cachedState) return ...

    // With cacheMiddleware, we don't need to manually check Redis for the *response* cache, 
    // BUT the 'state' itself is stored in Redis by the /sync endpoint using `redisService.set`.
    // The `cacheMiddleware` caches the *HTTP response*.
    // So effectively we are double caching: 
    // 1. /sync stores state in Redis key `game:impact_nexus:user:ID`.
    // 2. /state endpoint response is cached in Redis key `cache:game_state:ID`.

    // This is fine. It speeds up the read.

    const key = `game:impact_nexus:user:${userId}`;
    const cachedState = await redisService.get(key);

    if (cachedState) {
        return res.json({ success: true, state: cachedState, source: 'redis_store' });
    }

    // 2. Fallback: Try Database (game_players)
    const { data: player, error } = await supabase
        .from('game_players')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error || !player) {
        return res.json({ success: false, message: 'New Game' });
    }

    return res.json({ success: false, message: 'State expired or not found' });
}));

/**
 * @route POST /api/game/sync
 * @desc Sync local game state to Redis for persistence
 */
router.post('/sync', asyncHandler(async (req: Request, res: Response) => {
    const { userId, state } = req.body;

    if (!userId || !state) {
        throw new ValidationError('Missing userId or state');
    }

    const key = `game:impact_nexus:user:${userId}`;
    await redisService.set(key, state, GAME_STATE_TTL);

    // Invalidate associated village cache if necessary
    await invalidateCache(`village:${userId}`);

    // Invalidate the HTTP response cache for the state endpoint
    await invalidateCache(`game_state:${userId}`); // Assuming useUserContext uses userId or we need to match the key prefix mechanism.
    // cacheMiddleware with useUserContext=true uses `prefix:userId`. 
    // So `game_state:${userId}` shoud work.
    // Let's verify cacheMiddleware implementation.
    // cacheMiddleware uses: key = `${options.keyPrefix}:${req.user?.userId || req.params.userId ...}`

    await invalidateCache('game_state:*'); // Safer to invalidate all game states or specific one? 
    // The previous implementation plan said `invalidateCache('game_state:*')`. I'll stick to that for now or be specific if I can.

    return res.json({ success: true, timestamp: Date.now() });
}));

/**
 * @route POST /api/game/crystallize
 * @desc Permanently record a game session (5T Proof) into the database
 */
router.post('/crystallize', asyncHandler(async (req: Request, res: Response) => {
    const { userId, sessionData } = req.body;

    if (!userId) throw new ValidationError('Missing userId');
    validateSessionData(sessionData);

    const { uuid, data, evidence } = sessionData;
    const crystalHash = evidence.trustworthy.hash_lock;

    omniLogger.info(LogCategory.SOVEREIGN, `[CRYSTAL_MINT] 💎 Minting Crystal for ${userId}`, {
        uuid,
        hash: crystalHash
    });

    // Retrieve Player ID from User ID
    const { data: player } = await supabase
        .from('game_players')
        .select('id')
        .eq('user_id', userId)
        .single();

    if (!player) {
        // Auto-create player if missing? Or throw?
        // validation required
        throw new ValidationError('Player profile not found for user');
    }

    // Insert into 'game_battle_history' (CORRECT TABLE from 008_game_system.sql)
    const { data: record, error } = await supabase
        .from('game_battle_history')
        .insert({
            player_id: player.id,
            battle_type: data?.battleType || 'PVE',
            result: 'win', // Crystallization implies success in this context usually
            difficulty: 'NORMAL',
            moves_log: data?.activeEvents || [], // JSONB
            xp_earned: data?.playerSoul?.xp || 0,
        })
        .select('id')
        .single();

    if (error) {
        omniLogger.error(LogCategory.AUDIT, '[CRYSTAL_MINT] DB Insert Failed', error);
        throw new OmniError('Database Insert Failed', 500, ErrorCode.DB_ERROR, error.message);
    }

    return res.json({
        success: true,
        message: 'Crystal Anchored',
        recordId: record.id
    });
}));

// ===============================================
// AWAKENING FEATURES (Phase 7)
// ===============================================

/**
 * @route POST /api/game/awaken/instant-win
 * @desc [Non-Action Virtue] Instantly resolve battle with S-Rank
 */
router.post('/awaken/instant-win', asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body;
    if (!userId) throw new ValidationError('Missing userId');

    omniLogger.info(LogCategory.SOVEREIGN, `[AWAKENING] 🌟 Triggering Instant Win for ${userId}`);

    // Retrieve Player
    const { data: player } = await supabase
        .from('game_players')
        .select('id')
        .eq('user_id', userId)
        .single();

    if (!player) throw new ValidationError('Player not found');

    // Create S-Rank Record
    const { error } = await supabase
        .from('game_battle_history')
        .insert({
            player_id: player.id,
            battle_type: 'AWAKENING',
            result: 'win',
            difficulty: 'LEGENDARY',
            damage_dealt: 9999,
            damage_taken: 0,
            xp_earned: 9999,
            duration_seconds: 0, // Non-action implies 0 time
            moves_log: [{ type: 'AWAKENING', description: 'Non-Action Marvelous Virtue Activated' }]
        });

    if (error) throw error;

    return res.json({
        success: true,
        message: 'Awakening Achieved: Non-Action Victory Recorded',
        rewards: {
            xp: 9999,
            item: 'Essence of Void'
        }
    });
}));

/**
 * @route GET /api/game/awaken/mystery
 * @desc [Omni-Mystery] Reveal hidden reward
 */
router.get('/awaken/mystery', asyncHandler(async (req: Request, res: Response) => {
    // Generate a mystery reward
    const mysteryCard = {
        id: `mystery-${Date.now()}`,
        name: 'The Unseen Hand',
        type: 'special',
        rarity: 'legendary',
        description: 'Actions without action. Progress without movement.'
    };

    return res.json({
        success: true,
        data: mysteryCard
    });
}));

export default router;
