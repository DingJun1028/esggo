import { NextRequest, NextResponse } from 'next/server';
export declare function POST(req: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
    review: {
        seal_id: string;
        gate: string;
        resource: string;
        hash: string;
        decision: "approved" | "rejected";
        reviewer: string;
        notes: string;
        reviewed_at: string;
    };
}>>;
/**
 * GET /api/omni-agent-api/hitl-review
 * Returns recent HITL review history from Supabase.
 */
export declare function GET(): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    reviews: any[];
    total: number;
}>>;
//# sourceMappingURL=route.d.ts.map