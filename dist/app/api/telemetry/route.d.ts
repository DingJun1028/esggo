import { NextRequest, NextResponse } from 'next/server';
export declare function GET(req: NextRequest): Promise<NextResponse<{
    events: import("@/lib/telemetry/service").TelemetryEvent[];
    metrics: import("@/lib/telemetry/service").AgentMetrics | undefined;
}> | NextResponse<{
    events: import("@/lib/telemetry/service").TelemetryEvent[];
    metrics: import("@/lib/telemetry/service").AgentMetrics[];
}>>;
export declare function POST(req: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
}>>;
//# sourceMappingURL=route.d.ts.map