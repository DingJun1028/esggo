import { NextRequest, NextResponse } from 'next/server';
/**
 * GET /api/bluecc/records?listId=xxx
 * 列出 Blue.cc 工作區中的 Records（Todos）
 * 如果有傳入 listId，只取得該 list 的 todos
 * 否則取得專案中所有 list 的 todos
 *
 * POST /api/bluecc/records
 * 建立新紀錄 { title, listId, customFields }
 */
export declare function GET(req: NextRequest): Promise<NextResponse<{
    ok: boolean;
    records: import("@/lib/services/omni-blue").BlueCcRecord[];
    total: number;
}> | NextResponse<{
    ok: boolean;
    error: any;
}>>;
export declare function POST(req: NextRequest): Promise<NextResponse<{
    ok: boolean;
    record: import("@/lib/services/omni-blue").BlueCcRecord | undefined;
}> | NextResponse<{
    ok: boolean;
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map