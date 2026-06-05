import { NextRequest, NextResponse } from 'next/server';
export declare function POST(req: NextRequest): Promise<NextResponse<{
    success: boolean;
    data: {
        executed: boolean;
        tool: any;
        args: any;
    };
    metadata: {
        timestamp: number;
        trustScore: number;
        transactionId: string;
    };
}> | NextResponse<{
    success: boolean;
    error: string;
}>>;
//# sourceMappingURL=route.d.ts.map