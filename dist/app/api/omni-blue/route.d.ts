import { NextRequest, NextResponse } from 'next/server';
export declare function GET(request: NextRequest): Promise<NextResponse<{
    ok: boolean;
    status: any;
    resources: any;
}> | NextResponse<{
    ok: boolean;
    error: any;
}>>;
export declare function POST(request: NextRequest): Promise<NextResponse<{
    ok: boolean;
    result: any;
}> | NextResponse<{
    ok: boolean;
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map