import { alignmentAssistantFlow } from "@/lib/genkit";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (!body.evidenceList) {
            return NextResponse.json({ error: "evidenceList is required" }, { status: 400 });
        }

        // Run Genkit Flow (Genkit v1 format)
        const result = await alignmentAssistantFlow({
            evidenceList: body.evidenceList,
        });

        return NextResponse.json({ result });
    } catch (error) {
        console.error("Genkit Alignment Flow Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
