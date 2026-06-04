import { NextResponse } from 'next/server';
export declare function POST(request: Request): Promise<NextResponse<{
    success: boolean;
    result: import("@/lib/digital-twin-engine").ProjectionResult;
}> | NextResponse<{
    success: boolean;
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map