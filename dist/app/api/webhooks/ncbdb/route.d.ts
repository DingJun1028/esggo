import { NextRequest, NextResponse } from 'next/server';
/**
 * 📡 NCBDB 誠信感測器 Webhook (NCBDB Integrity Sensor)
 * v3.0 | #OmniCore #HealingGuardian
 */
export declare function POST(req: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    status: string;
    message: any;
}>>;
//# sourceMappingURL=route.d.ts.map