import { NextRequest, NextResponse } from 'next/server';
export declare function POST(req: NextRequest): Promise<NextResponse<{
    success: boolean;
    message: string;
    data: import("../../../../lib/omni-space/global-healing").HealingResult;
}> | NextResponse<{
    success: boolean;
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map