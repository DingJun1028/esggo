import { NextResponse } from "next/server";
import { SustainabilityReportOrchestrator } from "@/lib/genkit/orchestrator";

/**
 * Genkit Agentic Orchestrator API
 * Exposes the multi-agent workflow to the frontend.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, flowName, chapterType, companyProfile, existingAnswers, rawAnswers, structuredData, title } = body;

        const actionToRun = action || flowName;

        console.log(`[Genkit API] Received action: ${actionToRun} for ${chapterType}`);

        switch (actionToRun) {
            case "DISCOVER": {
                const result = await SustainabilityReportOrchestrator.discover(chapterType, companyProfile, existingAnswers);
                return NextResponse.json(result);
            }
            case "STRUCTURE": {
                const result = await SustainabilityReportOrchestrator.structure(chapterType, rawAnswers);
                return NextResponse.json(result);
            }
            case "GENERATE": {
                const result = await SustainabilityReportOrchestrator.generate(chapterType, title, structuredData);
                return NextResponse.json(result);
            }
            case "omniFlow": {
                const { omniFlow } = await import("@/lib/genkit/flows/omni");
                const result = await omniFlow(body.input);
                return NextResponse.json({ result });
            }
            case "omniManagerFlow": {
                const { omniFlow } = await import("@/lib/genkit/flows/omni"); // Reuse omniFlow for now as manager
                const result = await omniFlow({ text: body.input.intent });
                return NextResponse.json({ result });
            }
            case "intelligenceFlow": {
                const { intelligenceFlow } = await import("@/lib/genkit/flows/intelligence");
                const result = await intelligenceFlow(body.input);
                return NextResponse.json({ result });
            }
            case "workspaceFlow": {
                const { workspaceFlow } = await import("@/lib/genkit/flows/workspace");
                const result = await workspaceFlow(body.input);
                return NextResponse.json({ result });
            }
            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (error: any) {
        console.error("Genkit API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
