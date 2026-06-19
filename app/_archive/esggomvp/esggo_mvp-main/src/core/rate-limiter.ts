/**
 * 🛡️ OmniLimit: Sentient Rate Limiting & Protection
 * Prevents system misuse and ensures equitable resource distribution.
 * Status: Alpha Production Grade
 */

import { omniLogger, LogCategory } from './omniLogger';
import { OmniCache } from './redis-cache';

interface IRateLimitOptions {
    windowMs: number;
    max: number;
    category: 'READ' | 'WRITE' | 'AI' | 'SENSITIVE';
}

/**
 * ⏱️ Core Rate Limiter Logic (Distributed via Redis)
 */
export async function checkRateLimit(ip: string, options: IRateLimitOptions): Promise<{ success: boolean; remaining: number; resetTime: number }> {
    const key = `ratelimit:${options.category}:${ip}`;
    const ttlSeconds = Math.ceil(options.windowMs / 1000);

    // Use Redis atomic increment
    const count = await OmniCache.incr(key, ttlSeconds);

    const isRateLimited = count > options.max;

    if (isRateLimited) {
        omniLogger.warn(
            LogCategory.SECURITY,
            `Rate limit exceeded for IP: ${ip} on category: ${options.category} (Count: ${count})`
        );
    }

    return {
        success: !isRateLimited,
        remaining: Math.max(0, options.max - count),
        resetTime: Date.now() + options.windowMs // Approximate reset time
    };
}

/**
 * 🛡️ Specialized Limiters
 */
export const limiters = {
    // 100 requests per 15 mins
    apiGeneral: (ip: string) => checkRateLimit(ip, { windowMs: 15 * 60 * 1000, max: 100, category: 'READ' }),

    // 50 writes per min
    writeHeavy: (ip: string) => checkRateLimit(ip, { windowMs: 60 * 1000, max: 50, category: 'WRITE' }),

    // 30 AI generations per min
    aiSymphony: (ip: string) => checkRateLimit(ip, { windowMs: 60 * 1000, max: 30, category: 'AI' }),

    // 5 attempts per 15 mins (Auth/Reset)
    sensitiveSovereignty: (ip: string) => checkRateLimit(ip, { windowMs: 15 * 60 * 1000, max: 5, category: 'SENSITIVE' })
};

/**
 * 🐢 Slow Down Mechanism
 * Gradually delays responses for suspicious repetitive attempts.
 */
export async function applySentientBrake(ip: string, strikeCount: number): Promise<void> {
    const delay = Math.min(10000, strikeCount * 500); // Max 10s delay
    if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}
