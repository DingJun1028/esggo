import { NextRequest, NextResponse } from "next/server";
import { alignmentEngine } from "@/lib/core/alignment-engine";
import { EsgMetrics } from "@/lib/services/omni-service";

export const maxDuration = 60; // Extended execution time for AI alignment processing

export async function POST(req: NextRequest) {
    try {
        const metrics: EsgMetrics = await req.json();
        const results = await alignmentEngine.analyze(metrics);
        return NextResponse.json(results);
    } catch (error) {
        console.error("Alignment Engine API Error:", error);
        return NextResponse.json({ error: "Failed to analyze metrics" }, { status: 500 });
    }
}
