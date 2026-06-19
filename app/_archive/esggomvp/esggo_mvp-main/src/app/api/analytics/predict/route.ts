import { NextRequest, NextResponse } from "next/server";
import { limiters } from "@/core/rate-limiter";
import { riskPredictor } from "@/core/omni-risk-predictor";

export async function POST(req: NextRequest) {
    try {
        // 1. Rate limiting check (predict is more intensive, aiSymphony is 30/min limit)
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const { success } = await limiters.aiSymphony(ip);
        if (!success) {
            return new NextResponse('Rate limit exceeded', { status: 429 });
        }

        const body = await req.json();
        const timeframe = body.timeframe || '6_months'; // Default 6 months

        // 2. Business logic
        const prediction = await riskPredictor.getRiskPrediction(timeframe);

        return NextResponse.json({
            success: true,
            data: prediction
        });
    } catch (error: any) {
        console.error("🔴 Analytics Predict API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
