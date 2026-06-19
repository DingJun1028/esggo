// lib/rate-limit.ts
import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
    request: NextRequest,
    limit: number = 100,
    windowMs: number = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();

    let record = rateLimitMap.get(ip);

    // 重置過期的記錄
    if (!record || now > record.resetAt) {
        record = { count: 0, resetAt: now + windowMs };
        rateLimitMap.set(ip, record);
    }

    record.count++;

    return {
        allowed: record.count <= limit,
        remaining: Math.max(0, limit - record.count),
        resetAt: record.resetAt,
    };
}
