import { NextRequest, NextResponse } from 'next/server';
export declare const runtime = "nodejs";
export declare const dynamic = "force-dynamic";
export declare function POST(request: NextRequest): Promise<NextResponse<{
    data: any;
    message: string;
}> | NextResponse<{
    errors: any;
}> | NextResponse<{
    error: any;
}>>;
export declare function GET(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    data: {
        id: string;
        category: "E" | "S" | "G";
        tags: string[];
        title: string;
        industry: string;
        strategy: string;
        benchmark_source: string;
        t5_compliance: {
            traceable: boolean;
            transparent: boolean;
            tangible: boolean;
            trackable: boolean;
            trustworthy: boolean;
        };
        impact_score: number;
        last_verified: string;
    }[];
}>>;
//# sourceMappingURL=route.d.ts.map