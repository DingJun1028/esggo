/**
 * POST /api/slack/push5t
 * 從 Dashboard 手動觸發 5T 報告推播至 Slack
 *
 * Body: { companyName: string, channel?: string }
 */
import { NextRequest, NextResponse } from 'next/server';
export declare const runtime = "nodejs";
export declare function POST(req: NextRequest): Promise<NextResponse<{
    ok: boolean;
    error: string;
}> | NextResponse<{
    ok: boolean;
    overallScore: number;
    channel: string;
    companyName: string;
}>>;
//# sourceMappingURL=route.d.ts.map