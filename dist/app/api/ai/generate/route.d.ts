export declare const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare function POST(request: NextRequest): Promise<NextResponse<{
    error: any;
}> | NextResponse<{
    text: any;
    usage: any;
    model: string;
}>>;
//# sourceMappingURL=route.d.ts.map