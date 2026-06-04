import { NextResponse } from 'next/server';
export declare const dynamic = "force-static";
export declare const revalidate = 60;
export declare function GET(): Promise<NextResponse<{
    status: string;
    message: string;
    analysis: {
        lastScan: string;
        growthSuggestion: string;
        impactScore: number;
        focusAreas: string[];
    };
    auditCount: number;
}>>;
//# sourceMappingURL=route.d.ts.map