export declare const runtime = "nodejs";
export declare const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
export declare function POST(request: Request): Promise<NextResponse<any>>;
export declare function GET(): Promise<NextResponse<any[]> | NextResponse<{
    error: string;
}>>;
//# sourceMappingURL=route.d.ts.map