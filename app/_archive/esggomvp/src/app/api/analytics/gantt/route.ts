import { NextRequest, NextResponse } from "next/server";
import { limiters } from "@/core/rate-limiter";
import { analyticsEngine } from "@/core/omni-analytics-engine";

export async function GET(req: NextRequest) {
    try {
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const { success } = await limiters.apiGeneral(ip);
        if (!success) {
            return new NextResponse('Rate limit exceeded', { status: 429 });
        }

        const data = await analyticsEngine.getGanttData();

        return NextResponse.json({
            success: true,
            data: data
        });
    } catch (error: any) {
        console.error("🔴 Analytics Gantt API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
