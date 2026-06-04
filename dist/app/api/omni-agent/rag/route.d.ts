import { NextRequest, NextResponse } from 'next/server';
export declare function POST(req: NextRequest): Promise<NextResponse<import("@/types/src/AtomicFunction").AtomicFunctionResult<{
    results: any[];
    query: string;
}, Error>> | NextResponse<{
    success: boolean;
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map