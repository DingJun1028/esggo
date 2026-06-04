import { NextResponse } from 'next/server';
/**
 * OmniAgent Command API
 * ─────────────────────
 * Receives mission commands from the Think Tank dashboard and
 * executes them via OmniCommander, broadcasting real-time status
 * through the SSE event stream.
 *
 * POST /api/omni-agent-api/command
 * Body: { task: string, context?: Record<string, unknown> }
 */
export declare function POST(req: Request): Promise<NextResponse<{
    error: string;
}> | NextResponse<import("@/lib/agents/omni-commander").MissionResult>>;
/**
 * GET /api/omni-agent-api/command
 * Returns command API status and available missions.
 */
export declare function GET(): Promise<NextResponse<{
    status: string;
    availableMissions: string[];
    documentation: {
        method: string;
        body: string;
    };
}>>;
//# sourceMappingURL=route.d.ts.map