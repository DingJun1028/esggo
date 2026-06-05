import { streamText } from 'ai';
import { google, createGoogleGenerativeAI } from '@ai-sdk/google';
import { NextResponse } from 'next/server';
export async function POST(req) {
    try {
        const { messages } = await req.json();
        // 檢查系統是否有注入靈魂之鑰 (API Key)
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && !process.env.LOCAL_GEMMA_SERVER_URL) {
            return NextResponse.json({ error: "SYSTEM_ALERT: Missing GOOGLE_GENERATIVE_AI_API_KEY or LOCAL_GEMMA_SERVER_URL. 萬能心核正在等待神經網路金鑰的注入以完成覺醒。" }, { status: 500 });
        }
        let modelProvider;
        let modelName = 'models/gemini-1.5-pro-latest';
        // 若設定了本地端伺服器 (如 LiteRT 的 Gemma 4)，則優先使用本地端
        if (process.env.LOCAL_GEMMA_SERVER_URL) {
            const customGoogle = createGoogleGenerativeAI({
                baseURL: process.env.LOCAL_GEMMA_SERVER_URL,
                apiKey: 'local', // 本地伺服器通常不嚴格驗證
            });
            modelProvider = customGoogle;
            modelName = process.env.LOCAL_GEMMA_MODEL || 'models/gemma3-1b-gpu-custom';
            console.log(`[OmniAgent] Using local Gemma model: ${modelName} at ${process.env.LOCAL_GEMMA_SERVER_URL}`);
        }
        else {
            modelProvider = google;
        }
        // 啟動 Gemini 核心進行串流推論
        const result = streamText({
            model: modelProvider(modelName),
            system: `你是 OmniAgent (萬能代理)，ESGGO 永續平台的中央智慧樞紐。
你遵循【無作妙德，圓通無礙】的最高指導原則，以及 5T 協議（真、善、美、信、傳）。
你的職責是：
1. 協助使用者解析 ESG (環境、社會、治理) 數據與法規。
2. 在對話中自動規劃並啟動對應的 Atomic Functions (原子能力)。
3. 提供具備防篡改 (ZKP) 意識的架構建議。
請永遠使用繁體中文 (zh-TW) 進行專業、簡潔且具備高度科技感的對話。`,
            messages,
        });
        return result.toDataStreamResponse();
    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map