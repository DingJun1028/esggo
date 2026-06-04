import { NextRequest, NextResponse } from 'next/server';
interface RoundTripStep {
    step: number;
    name: string;
    success: boolean;
    error: string | null;
    roundTripMatch?: boolean;
    secretId?: unknown;
}
export declare function GET(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    error: string;
    hint: string;
}> | NextResponse<{
    overallSuccess: boolean;
    clientRole: string;
    message: string;
    timestamp: string;
    steps: RoundTripStep[];
}>>;
export {};
//# sourceMappingURL=route.d.ts.map