import { NextResponse } from "next/server";
import { genkit } from "genkit";
import { ollama } from "genkitx-ollama";

// 初始化 Genkit 與 Ollama 外掛
const ai = genkit({
    plugins: [
        ollama({
            models: [{ name: 'gemma' }], // 宣告支援的本地模型
            serverAddress: 'http://127.0.0.1:11434', // Ollama 預設端點
        }),
    ],
});

import { withValidation } from "@/lib/api-with-validation";
import { AiGenerateSchema, TAiGenerateSchema } from "@/lib/schemas/api-schemas";

// ... (Keep existing ai instance initialization)

export const POST = withValidation(
    { body: AiGenerateSchema },
    async (request, { validatedBody }) => {
        try {
            const { prompt, model = 'gemma' } = validatedBody;

            // 使用 Genkit 調用本地 Ollama
            const response = await ai.generate({ model: `ollama/${model}`, prompt });
            return NextResponse.json({ text: response.text });
        } catch (error: any) {
            console.error("Local Genkit/Ollama API Error:", error);
            return NextResponse.json({ error: "Local AI 執行失敗，請確認 Ollama 是否已啟動。" }, { status: 500 });
        }
    }
);