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

        // 2. Business logic
        const trends = await analyticsEngine.getTrendAnalysis();
        const metrics = await analyticsEngine.getKeyMetrics();

        return NextResponse.json({
            success: true,
            data: { trends, metrics }
        });
    } catch (error: any) {
        console.error("🔴 Analytics Query API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
