import { NextRequest, NextResponse } from 'next/server';
export declare function POST(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    extraction: string;
    confidence: number;
    gapAnalysis: string;
}>>;
//# sourceMappingURL=route.d.ts.map