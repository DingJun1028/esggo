/**
 * GET /api/slack/status
 * 回傳 Slack Gateway 設定狀態（是否有 Token）
 */
import { NextResponse } from 'next/server';
export declare const runtime = "nodejs";
export declare function GET(): Promise<NextResponse<{
    configured: boolean;
    hasToken: boolean;
    hasChannel: boolean;
    version: string;
}>>;
//# sourceMappingURL=route.d.ts.map