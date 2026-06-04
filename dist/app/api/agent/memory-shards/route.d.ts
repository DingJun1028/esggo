export declare const runtime = "nodejs";
export declare const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { MemoryShard, SkillUltimate } from '@/lib/agent/memory-shards';
export declare function POST(req: NextRequest): Promise<NextResponse<{
    success: boolean;
    shard: MemoryShard;
    persisted: boolean;
}> | NextResponse<{
    success: boolean;
    ultimate: SkillUltimate;
    persisted: boolean;
}> | NextResponse<{
    success: boolean;
    shards: MemoryShard[];
    ultimates: SkillUltimate[];
}> | NextResponse<{
    success: boolean;
    error: any;
}>>;
export declare function GET(req: NextRequest): Promise<NextResponse<{
    [x: string]: any;
    success: boolean;
}>>;
//# sourceMappingURL=route.d.ts.map