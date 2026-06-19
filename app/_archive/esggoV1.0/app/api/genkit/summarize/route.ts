import { esgExecutiveSummaryFlow } from "@/lib/genkit";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (!body.metrics || !body.evidence) {
            return NextResponse.json({ error: "metrics and evidence are required" }, { status: 400 });
        }

        // Run Genkit Summarization Flow
        const result = await esgExecutiveSummaryFlow({
            metrics: body.metrics,
            evidence: body.evidence,
        });

        return NextResponse.json({ result });
    } catch (error) {
        console.error("Genkit Summarization Flow Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
