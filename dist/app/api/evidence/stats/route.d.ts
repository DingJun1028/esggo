import { NextRequest, NextResponse } from 'next/server';
export declare function GET(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    data: {
        environmental: {
            total: number;
            verified: number;
            unverified: number;
        };
        social: {
            total: number;
            verified: number;
            unverified: number;
        };
        governance: {
            total: number;
            verified: number;
            unverified: number;
        };
        vault: {
            total: number;
            sealed: number;
            unsealed: number;
            byCategory: Record<string, number>;
            byStatus: Record<string, number>;
        };
        audit: {
            total: number;
            byModule: Record<string, number>;
        };
        esgTotal: number;
        overallVerificationRate: number;
    };
}> | NextResponse<{
    success: boolean;
    error: string;
}>>;
//# sourceMappingURL=route.d.ts.map