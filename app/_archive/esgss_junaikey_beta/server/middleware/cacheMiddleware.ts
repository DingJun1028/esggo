/**
 * cacheMiddleware.ts
 * Redis 快取中間件 - 實作 Cache-Aside 模式
 * 
 * [5T 協議合規]
 * - Transparent: 快取命中時回傳 X-Cache: HIT 標頭
 * - Trackable: 記錄所有快取讀寫日誌
 * 
 * @example
 * router.get('/api/market-intel',
 *   cacheMiddleware({ ttl: 300, keyPrefix: 'market_intel' }),
 *   async (req, res) => { ... }
 * );
 */

import { incrementCacheMiss } from './cacheMissLimiter.js';
import { Request, Response, NextFunction } from 'express';
import redisService from '../services/redisService.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';

export interface CacheOptions {
    ttl?: number;           // 秒，預設 3600 (1小時)
    keyPrefix?: string;     // 快取鍵前綴
    useUserContext?: boolean; // 是否包含用戶上下文 (Session ID)
}

/**
 * 建立快取中間件
 */
export function cacheMiddleware(options: CacheOptions = {}) {
    const { ttl = 3600, keyPrefix = 'api-cache', useUserContext = false } = options;

    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // 僅快取 GET 請求
        if (req.method !== 'GET') {
            return next();
        }

        // 生成快取鍵
        let cacheKey = `${keyPrefix}:${req.originalUrl || req.url}`;

        // 如果需要用戶上下文
        if (useUserContext && (req as any).user?.id) {
            cacheKey += `:u:${(req as any).user.id}`;
        }

        try {
            // 嘗試獲取快取
            const cachedData = await redisService.get(cacheKey);

            if (cachedData) {
                omniLogger.info(LogCategory.SYSTEM, `[CACHE] [HIT] ${cacheKey}`, { path: req.path });

                // 設置自定義標頭以供追蹤 (Transparent)
                res.setHeader('X-Cache', 'HIT');
                res.setHeader('X-Cache-Key', cacheKey);

                res.json(cachedData);
                return;
            }

            omniLogger.debug(LogCategory.SYSTEM, `[CACHE] [MISS] ${cacheKey}`, { path: req.path });
            res.setHeader('X-Cache', 'MISS');
            res.setHeader('X-Cache-Key', cacheKey);

            // 🛡️ Security Check: Rate Limit Cache Misses
            const isSafe = await incrementCacheMiss(req);
            if (!isSafe) {
                res.status(429).json({
                    error: 'Too Many Requests',
                    message: 'Cache miss limit exceeded. Please try again later.'
                });
                return;
            }

            // 攔截 res.json 並在完成時存入快取
            const originalJson = res.json.bind(res);
            res.json = (body: any): Response => {
                // 僅在狀態碼為 2xx 時快取
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    redisService.set(cacheKey, body, ttl).catch(err => {
                        omniLogger.error(LogCategory.SYSTEM, `[CACHE] Failed to set cache for ${cacheKey}`, { error: err.message });
                    });
                }
                originalJson(body);
                return res; // Ensure it returns Response as expected by Express
            };

            next();
        } catch (error: any) {
            omniLogger.error(LogCategory.SYSTEM, `[CACHE] Middleware Error`, { error: error.message, key: cacheKey });
            next(); // 快取出錯時繼續處理，不影響正常請求
        }
    };
}

/**
 * 快取失效輔助工具
 */
export async function invalidateCache(pattern: string): Promise<void> {
    try {
        await redisService.delByPattern(pattern);
        omniLogger.info(LogCategory.SYSTEM, `[CACHE] [INVALIDATE] Pattern: ${pattern}`);
    } catch (error: any) {
        omniLogger.error(LogCategory.SYSTEM, `[CACHE] Invalidation Failed`, { error: error.message, pattern });
    }
}

/**
 * 獲取快取統計數據
 */
export async function getCacheStats() {
    return redisService.healthCheck();
}
