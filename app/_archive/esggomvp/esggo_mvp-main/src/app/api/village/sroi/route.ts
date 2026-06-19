import { NextRequest, NextResponse } from "next/server";
import { limiters } from "@/core/rate-limiter";
import { sroiService } from "@/core/omni-sroi";

export async function GET(req: NextRequest) {
    try {
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const { success } = await limiters.apiGeneral(ip);
        if (!success) {
            return new NextResponse('Rate limit exceeded', { status: 429 });
        }

        const metrics = sroiService.getSROIMetrics();
        const aggregate = sroiService.getAggregateSROI();

        return NextResponse.json({
            success: true,
            data: { metrics, aggregate }
        });
    } catch (error: any) {
        console.error("🔴 Village SROI API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
