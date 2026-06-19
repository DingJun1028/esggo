import { NextRequest, NextResponse } from "next/server";
import { limiters } from "@/core/rate-limiter";
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
        const { decision } = body;

        if (!decision) {
            return NextResponse.json(
                { error: "Missing 'decision' payload in request body" },
                { status: 400 }
            );
        }

        // 2. 5T verification
        const validation = OmniDecisionValidator.validateDecision(decision);

        return NextResponse.json({
            success: true,
            data: validation
        });
    } catch (error: any) {
        console.error("🔴 Agentic Twin Validate API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
