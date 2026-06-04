import { NextResponse } from 'next/server';
export declare function GET(): Promise<NextResponse<{
    success: boolean;
    defenseState: string;
    metrics: {
        totalSealedRecords: number;
        verifiedZkpRecords: number;
        lastAuditTime: string;
    };
    message: string;
}> | NextResponse<{
    success: boolean;
    defenseState: string;
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map