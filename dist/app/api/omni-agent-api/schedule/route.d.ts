import { NextRequest, NextResponse } from 'next/server';
export declare function POST(req: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
    message: string;
    results?: unknown[];
    error?: string;
    agent?: string;
    commanderOutput?: string;
    swarmResults?: Record<string, any>;
    negotiation?: unknown;
    scheduled: boolean;
    mission: any;
}>>;
export declare function GET(req: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
    message: string;
    results?: unknown[];
    error?: string;
    agent?: string;
    commanderOutput?: string;
    swarmResults?: Record<string, any>;
    negotiation?: unknown;
    scheduled: boolean;
    mission: string;
}>>;
//# sourceMappingURL=route.d.ts.map