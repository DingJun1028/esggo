export declare const runtime = "nodejs";
export declare const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
export declare function POST(req: NextRequest): Promise<NextResponse<{
    success: boolean;
    count: number;
    persisted: boolean;
}> | NextResponse<{
    success: boolean;
    registry: any[];
}> | NextResponse<{
    success: boolean;
    error: any;
}>>;
export declare function GET(req: NextRequest): Promise<NextResponse<{
    success: boolean;
    registry: any;
}>>;
//# sourceMappingURL=route.d.ts.map