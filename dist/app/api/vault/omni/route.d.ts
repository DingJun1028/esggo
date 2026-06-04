import { NextRequest, NextResponse } from 'next/server';
export declare function GET(req: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
    records: any;
}> | NextResponse<{
    success: boolean;
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map