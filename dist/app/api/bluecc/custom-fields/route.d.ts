import { NextResponse } from 'next/server';
/**
 * GET /api/bluecc/custom-fields
 * 列出 Blue.cc 工作區中的自訂欄位定義
 */
export declare function GET(): Promise<NextResponse<{
    ok: boolean;
    customFields: {
        id: string;
        name: string;
        type: string;
    }[];
}> | NextResponse<{
    ok: boolean;
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map