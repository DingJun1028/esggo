import { NextRequest, NextResponse } from 'next/server';
/**
 * GET /api/omni-table
 * 支援多雲與多租戶 RLS 隔離的歷史拉取與實時 SSE 監控
 */
export declare function GET(req: NextRequest): Promise<Response>;
/**
 * POST /api/omni-table
 * 支援數據同步、ZKP 封印，並可手動觸發時光重放 (Replay Action) 或 Browserbase 自動化技能 (Browserbase Action)
 */
export declare function POST(req: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    status: string;
    action: string;
    details: string;
    records_to_replay: any[];
}> | NextResponse<{
    status: string;
    message: string;
}>>;
/**
 * PATCH /api/omni-table
 * 模擬反向更新 (BLUE ➡️ AITable) 時對 AITable 進行數據回填的代理
 */
export declare function PATCH(req: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    status: string;
    message: string;
    backfilled_record: any;
}>>;
//# sourceMappingURL=route.d.ts.map