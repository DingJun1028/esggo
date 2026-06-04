import { NextResponse } from 'next/server';
/**
 * ⚡️ ESG GO | System Health & Composition Telemetry API
 * Provides live telemetry data for OmniMap v2.0
 */
export declare function GET(): Promise<NextResponse<{
    status: string;
    integrityScore: number;
    activeAgents: number;
    codexEntries: number;
    dbLatency: number;
    timestamp: string;
}>>;
//# sourceMappingURL=route.d.ts.map