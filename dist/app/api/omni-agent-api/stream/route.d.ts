import { NextRequest } from 'next/server';
/**
 * Push an event into the SSE broadcast channel.
 * Called by the OmniAgentBus broadcast hook layer.
 */
export declare function pushBusEvent(event: string, payload: Record<string, unknown>): void;
/**
 * GET /api/omni-agent-api/stream
 * Opens an SSE connection for real-time OmniAgent event streaming.
 */
export declare function GET(req: NextRequest): Promise<Response>;
//# sourceMappingURL=route.d.ts.map