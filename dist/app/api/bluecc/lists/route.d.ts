import { NextRequest, NextResponse } from 'next/server';
/**
 * GET /api/bluecc/lists?projectId=xxx
 * 列出 Blue.cc 工作區中的所有 TodoLists
 */
export declare function GET(req: NextRequest): Promise<NextResponse<{
    ok: boolean;
    lists: import("@/lib/services/omni-blue").BlueCcTodoList[];
}> | NextResponse<{
    ok: boolean;
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map