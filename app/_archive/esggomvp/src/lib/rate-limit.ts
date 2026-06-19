import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * 🛡️ Security Hardening: Rate Limiting & Protections
 * Implementing the 5T Security Layer: [Trustworthy] & [Traceable]
 */

// Initialize Redis connection
// Note: In development, make sure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are in .env
const redis = Redis.fromEnv();

/**
 * 1. Global API Rate Limiter
 * 100 requests per 15 minutes
 */
export const apiRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "15 m"),
    analytics: true,
    prefix: "esggo:global",
});

/**
 * 2. Read-intensive GET requests
 * 200 requests per minute
 */
export const readLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(200, "1 m"),
    prefix: "esggo:read",
});

/**
 * 3. Write-intensive POST/PUT/DELETE
 * 50 requests per minute
 */
export const writeLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, "1 m"),
    prefix: "esggo:write",
});

/**
 * 4. Sensitive Operations (Login/Register/Reset)
 * 5 requests per 15 minutes
 */
export const sensitiveOperationLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    prefix: "esggo:auth",
});

/**
 * 5. AI Chat Generation
 * 30 requests per minute
 */
export const aiChatLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 m"),
    prefix: "esggo:ai",
});

/**
 * 6. File Uploads
 * 10 requests per 15 minutes
 */
export const uploadLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "15 m"),
    prefix: "esggo:upload",
});

/**
 * 🐢 Slow Down Logic
 * Prevents rapid-fire brute force by introducing synthetic delay.
 */
export async function applySlowDown(key: string, baseDelayMs: number = 500) {
    const redisKey = `slowdown:${key}`;
    const count = await redis.incr(redisKey);
    await redis.expire(redisKey, 60); // Reset every minute

    if (count > 5) {
        const delay = Math.min(baseDelayMs * (count - 5), 5000); // Cap at 5s delay
        await new Promise(resolve => setTimeout(resolve, delay));
        return { delayed: true, ms: delay };
    }
    return { delayed: false, ms: 0 };
}
