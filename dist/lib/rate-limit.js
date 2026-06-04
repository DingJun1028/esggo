/**
 * Rate Limiting Middleware
 * 為 API 提供流量控制保障
 */
import { NextResponse } from 'next/server';
const rateLimitMap = new Map();
export function checkRateLimit(request, limit = 100, windowMs = 60000) {
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
/**
 * 高階函數：為 Handler 加上速率限制
 */
export function withRateLimit(handler, limit = 100) {
    return async (request) => {
        const { allowed, remaining, resetAt } = checkRateLimit(request, limit);
        if (!allowed) {
            return NextResponse.json({
                success: false,
                error: {
                    code: 'RATE_LIMIT_EXCEEDED',
                    message: '請求過於頻繁，請稍後再試',
                },
            }, {
                status: 429,
                headers: {
                    'X-RateLimit-Limit': limit.toString(),
                    'X-RateLimit-Remaining': remaining.toString(),
                    'X-RateLimit-Reset': new Date(resetAt).toISOString(),
                },
            });
        }
        return handler(request);
    };
}
//# sourceMappingURL=rate-limit.js.map