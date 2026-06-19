import { NextRequest, NextResponse } from "next/server";
import { limiters } from "@/core/rate-limiter";
import { AgenticTwinService } from "@/core/agentic-twin-service";
import { OmniDecisionValidator } from "@/core/omni-decision-validator";

export async function POST(req: NextRequest) {
    try {
        // 1. Rate limiting check
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const { success } = await limiters.aiSymphony(ip);
        if (!success) {
            return new NextResponse('Rate limit exceeded', { status: 429 });
        }

        const body = await req.json();
        const { twinUuid, context } = body;

        if (!twinUuid || !context) {
            return NextResponse.json(
                { error: "Missing 'twinUuid' or 'context' parameters" },
                { status: 400 }
            );
        }

        // 2. Business logic
        const decision = await AgenticTwinService.generateDecision(twinUuid, context);

        // 3. 5T verification
        const validation = OmniDecisionValidator.validateDecision(decision);

        return NextResponse.json({
            success: true,
            data: decision,
            validation
        });
    } catch (error: any) {
        console.error("🔴 Agentic Twin Query API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
