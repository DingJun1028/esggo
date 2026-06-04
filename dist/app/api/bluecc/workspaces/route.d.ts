import { NextResponse } from 'next/server';
/**
 * GET /api/bluecc/workspaces
 * 列出 Blue.cc 組織下所有工作區（Projects）
 */
export declare function GET(): Promise<NextResponse<{
    ok: boolean;
    workspaces: import("@/lib/services/omni-blue").BlueCcProject[];
    total: number;
}> | NextResponse<{
    ok: boolean;
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map