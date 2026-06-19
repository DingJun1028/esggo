import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 🛡️ JunAiKey Next.js 全域中間件 (Global Middleware)
 * --------------------------------------------------
 * [協議] 🔴 Phase 5: 效能與底層優化
 * 
 * 核心職責：
 * 1. API 路由邊界防護。
 * 2. 注入 5T 協議追蹤標頭。
 * 3. 預留 Edge Rate Limiting 接口。
 */

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 僅攔截 API 路由
    if (pathname.startsWith('/api/')) {
        // 注入 Trace ID (Transparent)
        const traceId = crypto.randomUUID();
        const response = NextResponse.next();
        response.headers.set('X-Trace-Id', traceId);

        // 預留身份驗證檢查邏輯
        // const token = request.headers.get('authorization');
        // if (!token && isSensitivePath(pathname)) {
        //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        // }

        return response;
    }

    return NextResponse.next();
}

/**
 * 判斷是否為敏感路徑
 */
function isSensitivePath(path: string): boolean {
    return path.includes('/vault/write') || path.includes('/ai-proxy');
}

// 匹配路徑配置
export const config = {
    matcher: [
        '/api/:path*',
    ],
};
