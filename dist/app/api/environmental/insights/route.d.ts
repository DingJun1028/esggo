import { NextRequest, NextResponse } from 'next/server';
export declare const runtime = "edge";
export declare function GET(request: NextRequest): Promise<NextResponse<{
    insights: any;
    metrics_analyzed: any;
}> | NextResponse<{
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map