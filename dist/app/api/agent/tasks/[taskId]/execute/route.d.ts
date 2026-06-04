import { NextRequest, NextResponse } from 'next/server';
export declare function POST(req: NextRequest, { params }: {
    params: Promise<{
        taskId: string;
    }>;
}): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    ok: boolean;
    execution: import("../../../../../../lib/agent/types").AgentExecution;
    artifact: import("../../../../../../lib/agent/types").AgentArtifact;
}>>;
//# sourceMappingURL=route.d.ts.map