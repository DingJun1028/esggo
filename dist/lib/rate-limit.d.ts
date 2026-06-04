/**
 * Rate Limiting Middleware
 * 為 API 提供流量控制保障
 */
import { NextRequest, NextResponse } from 'next/server';
export declare function checkRateLimit(request: NextRequest, limit?: number, windowMs?: number): {
    allowed: boolean;
    remaining: number;
    resetAt: number;
};
/**
 * 高階函數：為 Handler 加上速率限制
 */
export declare function withRateLimit(handler: (request: NextRequest) => Promise<NextResponse>, limit?: number): (request: NextRequest) => Promise<NextResponse<unknown>>;
//# sourceMappingURL=rate-limit.d.ts.map