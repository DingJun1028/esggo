import { Request, Response, NextFunction } from 'express';
import redisService from '../services/redisService.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';

/**
 * cacheMissLimiter
 * 
 * 5T Security Middleware
 * Protects against "Cache Miss Attacks" (or Cache Stamping) where attackers
 * intentionally request non-existent keys to bypass the cache and flood the DB.
 */

const WINDOW_SIZE_SECONDS = 60;
const MAX_MISSES_PER_WINDOW = 50; // Strict limit for misses

export const cacheMissLimiter = async (req: Request, res: Response, next: NextFunction) => {
    // This middleware is intended to be called ONLY when a cache miss occurs.
    // Ideally integrated inside the cacheMiddleware logic.

    if (!redisService.isConnected) return next();

    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `miss_limit:${ip}`;

    try {
        const multi = redisService.client.multi();
        multi.incr(key);
        multi.expire(key, WINDOW_SIZE_SECONDS);
        const results = await multi.exec();

        // results[0] is from incr command: [error, newValue]
        const count = results?.[0]?.[1] as number;

        if (count > MAX_MISSES_PER_WINDOW) {
            omniLogger.warn(LogCategory.SECURITY, `[CACHE] 🛡️ Blocked Cache Miss Attack from ${ip}`, { count });
            return res.status(429).json({
                error: 'Too Many Cache Misses',
                message: 'Please slow down. Your IP has generated too many cache misses.'
            });
        }

        next();
    } catch (error: any) {
        omniLogger.error(LogCategory.SYSTEM, '[CACHE] Miss Limiter Error', { error: error.message });
        next(); // Fail open to avoid blocking legitimate users on Redis error
    }
};

// Helper function to manually increment miss count from other middleware
export const incrementCacheMiss = async (req: Request): Promise<boolean> => {
    if (!redisService.isConnected) return true;

    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `miss_limit:${ip}`;

    try {
        const multi = redisService.client.multi();
        multi.incr(key);
        multi.expire(key, WINDOW_SIZE_SECONDS, 'NX'); // Only set expire if not exists
        const results = await multi.exec();

        const count = results?.[0]?.[1] as number;

        if (count > MAX_MISSES_PER_WINDOW) {
            omniLogger.warn(LogCategory.SECURITY, `[CACHE] 🛡️ Cache Miss Limit Exceeded for ${ip}`, { count });
            return false; // Should block
        }
        return true; // Safe to proceed
    } catch (error) {
        return true; // Fail open
    }
}
