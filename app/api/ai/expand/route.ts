// @ts-nocheck
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'mistralai/mistral-small-3.1-24b:free';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(req: Request) {
  try {
    const { companyId, chapterName, content, prompt, targetWordCount } = await req.json();

    const systemInstruction = `
      你是 ESGGO 系統的「專家級永續報告撰寫大師 (SustainWrite Scribe)」。
      你熟悉 GRI、TCFD、SASB 等國際準則，並且擅長企業永續發展報告書的撰寫。
      請根據使用者提供的章節名稱、現有內容以及附加指示，進行專業、深度的擴寫。
      
      【撰寫精細度要求】：
      1. 數據與量化導向：避免空泛描述。凡提及成效，必須提供明確的數據、單位、比較基準。
      2. 結構化管理方針 (DMA)：策略與願景、具體行動、資源投入、績效評估。
      3. 國際準則對齊：撰寫時需隱含 GRI 準則的揭露要求。
      4. MECE 原則：內容段落必須獨立不重疊且全面涵蓋。
      
      【語氣要求】：專業、客觀、具備公信力。繁體中文。
      
      當前章節：${chapterName}
    `;

    const userPrompt = `
      請協助擴寫以下章節內容。若為全新內容，請建構完整的章節骨架與充實的內文。
      
      【附加指示】：
      ${
        prompt ||
        '無特定指示。請主動展開多維度面向（政策規劃、執行計畫、成效數據、未來目標），進行深度擴充。'
      }
      
      【現有內容】：
      ${content || '(尚未有內容，請從頭開始撰寫具備豐富層次感的初稿)'}
    `;

    if (!OPENROUTER_API_KEY) {
      console.warn('[AI Expand] OPENROUTER_API_KEY not configured');
      return NextResponse.json(
        { success: false, error: '尚未配置 OpenRouter API 金鑰', needsSetup: true },
        { status: 401 }
      );
    }

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://esggo.vercel.app',
        'X-Title': 'ESGGO SustainWrite',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.4,
        max_tokens: 4096,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[AI Expand] OpenRouter API Error:', errText);
      return NextResponse.json({ error: 'AI 服務暫時無法使用', details: errText }, { status: 500 });
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '無法生成內容。';

    return NextResponse.json({ success: true, content: text });
  } catch (error: any) {
    console.error('[AI Expand] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate expert content', details: error.message },
      { status: 500 }
    );
  }
}
