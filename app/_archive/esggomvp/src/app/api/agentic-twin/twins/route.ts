import { NextRequest, NextResponse } from "next/server";
import { limiters } from "@/core/rate-limiter";
import { AgenticTwinService } from "@/core/agentic-twin-service";

export async function GET(req: NextRequest) {
    try {
        // 1. Rate limiting check
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const { success } = await limiters.apiGeneral(ip);
        if (!success) {
            return new NextResponse('Rate limit exceeded', { status: 429 });
        }

        // 2. Business logic
        const twins = AgenticTwinService.listTwins();

        return NextResponse.json({
            success: true,
            data: twins
        });
    } catch (error: any) {
        console.error("🔴 Agentic Twin List API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
