import { NextResponse } from "next/server";
import { orchestrationFlow } from "@/lib/genkit/flows/orchestration";
import { omniManager } from "../../../omni-manager";

export async function POST(req: Request) {
    try {
        const { cycleId, scope } = await req.json();

        // Log activity in the manager so the UI updates
        omniManager.addTask({
            id: `TASK-${Date.now()}`,
            agent: "Orchestrator",
            task: `Initiating ${scope} disclosure cycle for ${cycleId}`,
            status: "running"
        });

        // Run the Genkit flow
        const result = await orchestrationFlow({ cycleId, scope: scope || "FULL" });

        // Update task status
        omniManager.addTask({
            id: `RESULT-${Date.now()}`,
            agent: "Vault_Agent",
            task: `Report sealed: ${result.hash.substring(0, 16)}...`,
            status: "complete"
        });

        return NextResponse.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error("[Orchestrate API] Flow execution failed:", error);
        return NextResponse.json({ success: false, error: "Orchestration failed" }, { status: 500 });
    }
}
