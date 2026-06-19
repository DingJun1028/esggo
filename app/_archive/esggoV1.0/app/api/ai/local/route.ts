import { NextResponse } from 'next/server';
import { genkit } from 'genkit';
import { ollama } from 'genkitx-ollama';

// Tier 2: Initialize Genkit for local API route execution
const ai = genkit({
    plugins: [
        ollama({
            models: [{ name: 'gemma' }],
            serverAddress: 'http://127.0.0.1:11434',
        }),
    ],
});

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        // Executes safely on the Node.js server hitting local Ollama Daemon
        const response = await ai.generate({
            model: 'ollama/gemma',
            prompt: prompt,
        });

        return NextResponse.json({ result: response.text });
    } catch (error: any) {
        console.error("Local Genkit Error:", error);
        return NextResponse.json({ error: error.message || "Internal Local AI Server Error" }, { status: 500 });
    }
}
