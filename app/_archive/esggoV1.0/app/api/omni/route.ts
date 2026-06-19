import { NextResponse } from "next/server";
import { omniManager } from "../../../omni-manager";
import { calculateCompliance } from "@/lib/utils/compliance-engine";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const compliance = calculateCompliance();
        return NextResponse.json({
            squad: omniManager.getSquadStatus(),
            tasks: omniManager.getActiveTasks(),
            auditReadiness: compliance.readinessScore,
            indicators: compliance.indicators,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("[Omni API] Status fetch failed:", error);
        return NextResponse.json({ error: "Failed to fetch omni status" }, { status: 500 });
    }
}
