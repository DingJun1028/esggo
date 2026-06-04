import { NextResponse } from 'next/server';
export declare const runtime = "nodejs";
export declare const dynamic = "force-dynamic";
export declare function POST(): Promise<NextResponse<{
    success: boolean;
    message: string;
    shard: any;
}> | NextResponse<{
    success: boolean;
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map