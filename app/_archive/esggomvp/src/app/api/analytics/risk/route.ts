import { NextRequest, NextResponse } from "next/server";
import { limiters } from "@/core/rate-limiter";
import { riskPredictor } from "@/core/omni-risk-predictor";

export async function GET(req: NextRequest) {
    try {
        // 1. Rate limiting check
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const { success } = await limiters.apiGeneral(ip);
        if (!success) {
            return new NextResponse('Rate limit exceeded', { status: 429 });
        }

        // 2. Business logic
        const assessment = await riskPredictor.getRiskAssessment();
        const alerts = await riskPredictor.getRiskAlerts();
        const summary = await riskPredictor.getDashboardSummary();

        return NextResponse.json({
            success: true,
            data: {
                assessment,
                alerts,
                summary
            }
        });
    } catch (error: any) {
        console.error("🔴 Analytics Risk API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
