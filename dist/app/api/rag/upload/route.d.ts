import { NextRequest, NextResponse } from 'next/server';
export declare function POST(req: NextRequest): Promise<NextResponse<{
    success: boolean;
    fileName: string;
    chunksCount: number;
}> | NextResponse<{
    success: boolean;
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map