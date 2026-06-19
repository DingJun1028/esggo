import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import slowDown from 'express-slow-down';
import redisService from '../services/redisService.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';

// Helper to create Redis Store
const createRedisStore = (prefix: string) => {
    // We need to pass the ioredis client. 
    // RedisService exposes .client, but it might be null or in fallback mode.
    // We should check connectivity.

    if (!redisService.isConnected || redisService.useMemoryFallback) {
        console.warn(`[RateLimit] Redis not connected/fallback. Using memory store for ${prefix}.`);
        return undefined; // Falls back to memory-store built-in to express-rate-limit
    }

    return new RedisStore({
        sendCommand: (...args: string[]) => redisService.client.call(...args),
        prefix: `rl:${prefix}:`,
    });
};

/**
 * 🛡️ Global API Rate Limiter
 * limit: 100 requests per 15 minutes
 */
export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    store: createRedisStore('api'),
    handler: (req, res) => {
        omniLogger.warn(LogCategory.SECURITY, `Rate Limit Exceeded: Global API - ${req.ip}`);
        res.status(429).json({
            status: 'error',
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later.',
        });
    },
    // skip: (req) => {
    //    // Whitelist localhost or internal IPs if needed
    //    return req.ip === '::1' || req.ip === '127.0.0.1';
    // }
});

/**
 * 🔐 Auth Rate Limiter (Detailed)
 * limit: 5 requests per 15 minutes (Prevent Brute Force)
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    store: createRedisStore('auth'),
    handler: (req, res) => {
        omniLogger.warn(LogCategory.SECURITY, `Rate Limit Exceeded: Auth - ${req.ip}`);
        res.status(429).json({
            status: 'error',
            code: 'AUTH_RATE_LIMIT',
            message: 'Too many login attempts. Please wait 15 minutes.',
        });
    },
});

/**
 * 🕵️ Read Operation Limiter (GET)
 * limit: 200 requests per minute
 */
export const readLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 200,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    store: createRedisStore('read'),
});


/**
 * 🚨 Sensitive Operation Limiter (Auth/Payment)
 * limit: 5 requests per 15 minutes
 */
export const sensitiveOperationLimiter = authLimiter; // Alias for consistency via server.ts

/**
 * 📤 Upload Rate Limiter
 * limit: 10 requests per 15 minutes
 */
export const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    store: createRedisStore('upload'),
    message: 'Too many uploads. Please wait.',
});

/**
 * 🐢 Slow Down Middleware
 * Delays responses incrementally after a certain number of requests.
 */
export const slowDownMiddleware = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 50, // allow 50 requests per 15 minutes, then...
    delayMs: (hits) => hits * 100, // add 100ms delay per request above 50
    store: createRedisStore('slowdown'), // Types might mismatch for slow-down store, but it usually accepts a similar store interface
    // Note: express-slow-down might not support rate-limit-redis store directly in Typescript without casting.
    // If it fails, we can fall back to memory or cast it.
});


/**
 * 🧠 AI Generation Rate Limiter
 * limit: 30 requests per minute (Cost Control)
 */
export const aiChatLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 30,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    store: createRedisStore('ai'),
    message: 'AI capacity reached. Please slow down.',
});

/**
 * 📝 Write Operation Limiter (POST/PUT/DELETE)
 * limit: 50 requests per minute
 */
export const writeLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 50,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    store: createRedisStore('write'),
});
