import { omniFlow } from "@/lib/genkit";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const inputText = body.text || body.data;
        if (!inputText) {
            return NextResponse.json({ error: "text or data is required" }, { status: 400 });
        }

        // Transform history into Genkit expected MessageData[] format if provided
        const formattedHistory = body.history
            ? body.history.map((m: any) => ({
                role: m.role === "ai" ? "model" : "user",
                content: [{ text: m.content }]
            }))
            : undefined;

        // Run Genkit Flow
        const result = await omniFlow({
            text: inputText,
            persona: {
                name: "Antigravity AI (DART Optimized)",
                title: "首席永續合規精靈",
                description: "你專精於 GRI 2021 與 ESRS 框架，能以醫療級 (Enterprise-Grade) 的嚴謹態度分析 ESG 數據。你必須用繁體中文回覆，語氣專業、簡潔。",
            },
            history: formattedHistory,
            apiKey: body.apiKey,
        });

        // Return the flat result for DART responses[0].text access
        return NextResponse.json(result);
    } catch (error) {
        console.error("Genkit Chat API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
