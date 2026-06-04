import { NextResponse } from 'next/server';
export declare function GET(): Promise<NextResponse<{
    executions: import("../../../../lib/agent/types").AgentExecution[];
    total: number;
    ok: boolean;
}>>;
//# sourceMappingURL=route.d.ts.map