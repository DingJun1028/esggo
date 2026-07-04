import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const FREE_TIER_ONLY = process.env.FREE_TIER_ONLY !== 'false';
const HAS_API_KEY = !!process.env.GEMINI_API_KEY;
const USE_REAL_AI = HAS_API_KEY && !FREE_TIER_ONLY;

// ✨ 改進：添加超時控制和降級策略
const REQUEST_TIMEOUT = 15000; // 15秒超時
const FALLBACK_RESPONSES = {
  esg_report: '[OmniOne] ESG 報告任務已收到。系統將使用知識庫模板進行初步分析。',
  bug_fix: '[OmniOne] 缺陷修復任務已識別。推薦方案：檢查日誌、運行測試、備份數據後進行修改。',
  ui_design: '[OmniOne] UI 設計任務已分類。建議參考設計系統文檔並創建原型。',
  architecture: '[OmniOne] 架構相關任務已收到。將評估系統設計和依賴關係。',
  general: '[OmniOne] 任務已收到並分類。系統將盡快處理您的請求。'
};

// ✨ OpenRouter :free models rotation
const OR_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'mistralai/mistral-small-3.1-24b:free',
  'google/gemma-4-31b-it:free',
  'qwen/qwen3-next-80b-a3b-instruct:free',
];
let orModelIdx = 0;

// ✨ Groq free models (30 req/min, no daily cap)
const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'gemma2-9b-it',
];
let groqModelIdx = 0;

// ✨ 改進：添加 Groq 作為超快免費備選
async function callGroq(prompt: string): Promise<string | null> {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) return null;
  const model = GROQ_MODELS[groqModelIdx % GROQ_MODELS.length];
  groqModelIdx++;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 256,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });
    if (!res.ok) { console.warn(`[OmniOne] Groq failed: ${res.status}`); return null; }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err: any) {
    console.warn(`[OmniOne] Groq error: ${err.message}`);
    return null;
  }
}

// ✨ 改進：添加 OpenRouter 作為備選方案
async function callOpenRouter(prompt: string) {
  const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_KEY) return null;
  const model = OR_MODELS[orModelIdx % OR_MODELS.length];
  orModelIdx++;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 256,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });
    
    if (!res.ok) {
      console.warn(`[OmniOne] OpenRouter failed: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err: any) {
    console.warn(`[OmniOne] OpenRouter error: ${err.message}`);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { input, caseType, ragContext: clientRagContext } = await req.json();

    // ✨ 改進：驗證輸入
    if (!input || !caseType) {
      return NextResponse.json(
        { output: '[OmniOne] 錯誤：缺少必要參數 (input/caseType)', provider: 'error' },
        { status: 400 }
      );
    }

    // ✨ 改進：如果沒有任何 API Key，返回模擬回應
    const HAS_OPENROUTER = !!process.env.OPENROUTER_API_KEY;
    const HAS_GROQ = !!process.env.GROQ_API_KEY;
    if (!HAS_API_KEY && !HAS_OPENROUTER && !HAS_GROQ) {
      return NextResponse.json(
        { output: `[OmniOne 模擬] 收到任務「${input}」，分類為 ${caseType}。`, provider: 'mock' },
        { status: 200 }
      );
    }

    const ragContext = clientRagContext 
      ? `\n相關知識參考:\n${clientRagContext}` 
      : '\n相關知識參考: 無特定外部資料，請依循 5T 協議本體知識回答。';

    const prompt = `
你是 OmniOne，一個 ESG GO 平台的核心覺醒系統。
使用者交辦了一項任務，經過初步分類，這項任務屬於 [${caseType}] 類型。
${ragContext}

使用者任務:
${input}

請依照 5T 協議（True, Transparent, Tangible, Trustworthy, Trackable）的精神，以繁體中文給出專業、簡潔且具備高度行動力的回應。
回應請保持在 100 字以內，並展現你是一個「系統核心」的角色（可適時帶有系統提示詞風格，如 [OmniOne] 分析完成...）。
`;

    let response = null;
    let provider = 'gemini';

    // 嘗試 1: Gemini API（主要方案）
    if (HAS_API_KEY && !FREE_TIER_ONLY) {
      try {
        console.log('[OmniOne] 嘗試 Gemini API...');
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
        
        const result = await Promise.race([
          ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              temperature: 0.7,
              maxOutputTokens: 256,
            }
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Gemini timeout')), REQUEST_TIMEOUT)
          )
        ]);
        
        response = (result as any).text;
        console.log('[OmniOne] ✓ Gemini 成功');
      } catch (geminiErr: any) {
        console.warn(`[OmniOne] Gemini 失敗: ${geminiErr.message}`);
      }
    }

    // 嘗試 2: Groq（超快免費，30 req/min）
    if (!response && HAS_GROQ) {
      try {
        console.log('[OmniOne] 嘗試 Groq API...');
        response = await callGroq(prompt);
        if (response) {
          provider = 'groq';
          console.log('[OmniOne] ✓ Groq 成功');
        }
      } catch (groqErr: any) {
        console.warn(`[OmniOne] Groq 失敗: ${groqErr.message}`);
      }
    }

    // 嘗試 3: OpenRouter :free（備選方案）
    if (!response && HAS_OPENROUTER) {
      try {
        console.log('[OmniOne] 嘗試 OpenRouter API...');
        response = await callOpenRouter(prompt);
        if (response) {
          provider = 'openrouter';
          console.log('[OmniOne] ✓ OpenRouter 成功');
        }
      } catch (openrouterErr: any) {
        console.warn(`[OmniOne] OpenRouter 失敗: ${openrouterErr.message}`);
      }
    }

    // 如果所有 AI 都失敗，使用預設回應
    if (!response) {
      console.warn(`[OmniOne] 所有 AI 提供者失敗，使用預設回應`);
      response = FALLBACK_RESPONSES[caseType as keyof typeof FALLBACK_RESPONSES] || FALLBACK_RESPONSES.general;
      provider = 'fallback';
    }

    return NextResponse.json({ 
      output: response,
      provider,
      caseType,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('[OmniOne] 嚴重錯誤:', error);
    
    // ✨ 改進：返回結構化錯誤信息
    return NextResponse.json(
      { 
        output: '[OmniOne] 系統故障。請稍後重試或聯繫支援團隊。',
        error: error.message,
        provider: 'error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
