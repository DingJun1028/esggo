import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 簡單的健康檢查路由繞過
    if (request.nextUrl.pathname === '/api/health') {
        return NextResponse.next();
    }

    // 暫時所有的路由都允許，直到我們修復 Redis 連線
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/:path*',
    ],
};
