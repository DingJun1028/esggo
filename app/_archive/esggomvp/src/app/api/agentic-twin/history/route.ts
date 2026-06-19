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

        const url = new URL(req.url);
        const twinUuid = url.searchParams.get("twinUuid");

        if (!twinUuid) {
            return NextResponse.json(
                { error: "Missing 'twinUuid' parameter in query string" },
                { status: 400 }
            );
        }

        // 2. Business logic
        const history = AgenticTwinService.getDecisions(twinUuid);

        return NextResponse.json({
            success: true,
            data: history
        });
    } catch (error: any) {
        console.error("🔴 Agentic Twin History API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
