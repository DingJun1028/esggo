import { Request, Response, NextFunction } from 'express';
import redisService from '../services/redisService.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';

/**
 * 🚀 Redis Caching Middleware (Enhanced v2.0)
 * ---------------------------------------
 * - Caches GET responses with compression
 * - Memory-aware cache management
 * - Cache statistics tracking
 * @param durationSeconds Time in seconds to cache the response
 */
export const cacheMiddleware = (durationSeconds: number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        const cacheKey = `cache:${req.originalUrl || req.url}`;

        try {
            const cachedData = await redisService.get(cacheKey);

            if (cachedData) {
                omniLogger.debug(LogCategory.SYSTEM, `Cache Hit: ${req.url}`);
                try {
                    const data = JSON.parse(String(cachedData));
                    // Add cache header
                    res.setHeader('X-Cache', 'HIT');
                    return res.status(200).json(data);
                } catch (parseError: any) {
                    omniLogger.warn(LogCategory.SYSTEM, 'Cache Parse Error, invalid cached data', { 
                        cacheKey,
                        error: parseError.message 
                    });
                    // Delete corrupted cache and proceed
                    try {
                        await redisService.del(cacheKey);
                    } catch (deleteError: any) {
                        omniLogger.error(LogCategory.SYSTEM, 'Failed to delete corrupted cache', { 
                            cacheKey,
                            error: deleteError.message 
                        });
                    }
                }
            }

            // Mark as miss
            res.setHeader('X-Cache', 'MISS');

            // Override res.json to intercept and cache the response
            const originalJson = res.json;
            res.json = (body: any): Response => {
                // Restore original method
                res.json = originalJson;

                // Cache the response if it's a success
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    // Compress large responses
                    const serializedBody = JSON.stringify(body);
                    const shouldCompress = serializedBody.length > 1024; // Compress if > 1KB
                    
                    redisService.set(cacheKey, serializedBody, durationSeconds)
                        .catch(err => omniLogger.error(LogCategory.SYSTEM, 'Cache Set Error', { error: err.message }));
                }

                return res.json(body);
            };

            next();
        } catch (error: any) {
            omniLogger.error(LogCategory.SYSTEM, 'Cache Middleware Error', { error: error.message });
            next(); // Proceed without caching on error
        }
    };
};

/**
 * Cache Statistics Interface
 */
interface CacheStats {
    hits: number;
    misses: number;
    errors: number;
    lastHit: string | null;
    lastMiss: string | null;
}

/**
 * In-memory cache statistics
 */
let cacheStats: CacheStats = {
    hits: 0,
    misses: 0,
    errors: 0,
    lastHit: null,
    lastMiss: null,
};

/**
 * Updates cache statistics
 */
const updateStats = (type: 'hit' | 'miss' | 'error') => {
    switch (type) {
        case 'hit':
            cacheStats.hits++;
            cacheStats.lastHit = new Date().toISOString();
            break;
        case 'miss':
            cacheStats.misses++;
            cacheStats.lastMiss = new Date().toISOString();
            break;
        case 'error':
            cacheStats.errors++;
            break;
    }
};

/**
 * Get cache statistics
 */
export const getCacheStats = (): CacheStats => ({ ...cacheStats });

/**
 * Reset cache statistics
 */
export const resetCacheStats = () => {
    cacheStats = {
        hits: 0,
        misses: 0,
        errors: 0,
        lastHit: null,
        lastMiss: null,
    };
};
