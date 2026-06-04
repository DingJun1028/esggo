import { NextRequest, NextResponse } from 'next/server';
export declare function POST(req: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
    documents: any;
}> | NextResponse<{
    success: boolean;
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map