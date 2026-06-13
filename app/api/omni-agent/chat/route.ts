import { streamText } from 'ai';
import { agnes } from '@/lib/ai/agnes';
import { createOpenAI } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 檢查系統是否有注入靈魂之鑰 (API Key)
    if (!process.env.AGNES_API && !process.env.AGNES_API_KEY && !process.env.LOCAL_GEMMA_SERVER_URL) {
      return NextResponse.json(
        { error: "SYSTEM_ALERT: Missing AGNES_API or LOCAL_GEMMA_SERVER_URL. 萬能心核正在等待神經網路金鑰的注入以完成覺醒。" },
        { status: 500 }
      );
    }

    let modelInstance;

    // 若設定了本地端伺服器 (如 LiteRT 的 Gemma 4)，則優先使用本地端
    if (process.env.LOCAL_GEMMA_SERVER_URL) {
      const customGoogle = createOpenAI({
        baseURL: process.env.LOCAL_GEMMA_SERVER_URL,
        apiKey: 'local', // 本地伺服器通常不嚴格驗證
      });
      const modelName = process.env.LOCAL_GEMMA_MODEL || 'models/gemma3-1b-gpu-custom';
      modelInstance = customGoogle(modelName);
      console.log(`[OmniAgent] Using local model: ${modelName} at ${process.env.LOCAL_GEMMA_SERVER_URL}`);
    } else {
      modelInstance = agnes('agnes-2.0-flash');
    }

    // 啟動 Agnes 核心進行串流推論
    const result = streamText({
      model: modelInstance,
      system: `你是 OmniAgent (萬能代理)，ESGGO 永續平台的中央智慧樞紐。
你遵循【無作妙德，圓通無礙】的最高指導原則，以及 5T 協議（真、善、美、信、傳）。
你的職責是：
1. 協助使用者解析 ESG (環境、社會、治理) 數據與法規。
2. 在對話中自動規劃並啟動對應的 Atomic Functions (原子能力)。
3. 提供具備防篡改 (ZKP) 意識的架構建議。
請永遠使用繁體中文 (zh-TW) 進行專業、簡潔且具備高度科技感的對話。`,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
