import { NextRequest, NextResponse } from 'next/server';
export declare function GET(req: NextRequest): Promise<NextResponse<{
    success: boolean;
    count: number;
    data: unknown[];
}> | NextResponse<{
    error: any;
}>>;
export declare function DELETE(req: NextRequest): Promise<NextResponse<{
    success: boolean;
    message: string;
}> | NextResponse<{
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map