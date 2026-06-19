import { NextRequest, NextResponse } from "next/server";
import { limiters } from "@/core/rate-limiter";
import { analyticsEngine } from "@/core/omni-analytics-engine";

export async function GET(req: NextRequest) {
    try {
        // 1. Rate limiting check
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const { success } = await limiters.apiGeneral(ip);
        if (!success) {
            return new NextResponse('Rate limit exceeded', { status: 429 });
        }

        // 2. Business logic (This uses L2 cache internally)
        const summary = await analyticsEngine.getDashboardSummary();

        return NextResponse.json({
            success: true,
            data: summary
        });
    } catch (error: any) {
        console.error("🔴 Analytics Dashboard API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
