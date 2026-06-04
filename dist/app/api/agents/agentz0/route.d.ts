export declare const runtime = "nodejs";
export declare const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
export declare function POST(req: Request): Promise<NextResponse<{
    result: string;
}> | NextResponse<{
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map