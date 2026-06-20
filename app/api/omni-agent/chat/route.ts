// @ts-nocheck
import { generateText, streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { OmniLogger } from '@/lib/omni-logger';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const DEFAULT_OPENROUTER_MODEL = 'mistralai/mistral-small-3.1-24b:free';

function getModel() {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.AGNES_API;
  if (apiKey) {
    const openrouter = createOpenAI({
      baseURL: OPENROUTER_BASE_URL,
      apiKey: apiKey,
    });
    return openrouter(process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL);
  }
  return null;
}

// ─── Main Chat Endpoint (with multi-step thinking) ───
export async function POST(req: Request) {
  try {
    const { messages, context, step } = await req.json();
    const model = getModel();

    if (!model) {
      return NextResponse.json(
        { error: 'API key not configured. Please set OPENROUTER_API_KEY.' },
        { status: 500 }
      );
    }

    // Step-based processing
    if (step === 'analyze') {
      const result = await generateText({
        model,
        system: `你是 OmniAgent 的分析師。分析用戶的問題，提取：
1. 問題類型（ESG數據分析/報告撰寫/合規檢查/系統操作/一般查詢）
2. 關鍵實體（公司名、法規、標準等）
3. 所需數據來源
4. 預期輸出格式

用繁體中文回答，保持簡潔。`,
        prompt: `分析以下問題：${messages}`,
        maxTokens: 200,
      });
      return NextResponse.json({ step: 'analyze', result: result.text });
    }

    if (step === 'plan') {
      const result = await generateText({
        model,
        system: `你是 OmniAgent 的規劃師。根據分析結果，制定執行計劃：
1. 步驟清單（最多 5 步）
2. 每步的預期產出
3. 可能需要的子代理
4. 預估時間

用繁體中文回答，保持簡潔。`,
        prompt: `問題：${messages}\n分析：${context?.analysis || ''}\n\n制定執行計劃：`,
        maxTokens: 300,
      });
      return NextResponse.json({ step: 'plan', result: result.text });
    }

    // Default: stream chat response
    let contextStr = '';
    if (context?.analysis) {
      contextStr += `\n【問題分析】\n${context.analysis}`;
    }
    if (context?.plan) {
      contextStr += `\n【執行計劃】\n${context.plan}`;
    }

    const result = await streamText({
      model,
      system: `你是 OmniAgent，ESGGO 永續平台的中央智慧樞紐。
你遵循 5T 協議（真、善、美、信、通）。

你的職責：
1. 協助使用者解析 ESG 數據與法規
2. 提供永續報告撰寫建議
3. 執行合規檢查與數據分析
4. 管理子代理與任務分配

請使用繁體中文，保持專業、簡潔。${contextStr}`,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
