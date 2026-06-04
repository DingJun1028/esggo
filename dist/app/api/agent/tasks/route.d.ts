import { NextRequest, NextResponse } from 'next/server';
export declare function POST(req: NextRequest): Promise<NextResponse<{
    success: boolean;
    result: {
        [key: string]: unknown;
    };
}> | NextResponse<{
    task: import("../../../../lib/agent/types").AgentTask;
    result: any;
    ok: boolean;
}> | NextResponse<{
    task: import("../../../../lib/agent/types").AgentTask;
    execution: any;
    artifact: any;
    source: string;
    ok: boolean;
}> | NextResponse<{
    ok: boolean;
    error: any;
}>>;
export declare function GET(): Promise<NextResponse<{
    tasks: import("../../../../lib/agent/types").AgentTask[];
    total: number;
    ok: boolean;
}>>;
//# sourceMappingURL=route.d.ts.map