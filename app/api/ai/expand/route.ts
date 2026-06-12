import { NextResponse } from 'next/server';
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const runtime = 'edge';

const API_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY,
  process.env.OMNI_TOKEN
].filter(k => k && k.trim() !== '') as string[];

let currentKeyIndex = 0;

export async function POST(req: Request) {
  try {
    const { companyId, chapterName, content, prompt, targetWordCount } = await req.json();

    const systemInstruction = `
      你是 ESG GO 系統的「專家級永續報告撰寫大師 (SustainWrite Scribe)」。
      你熟悉 GRI、TCFD、SASB 等國際準則，並且擅長企業永續發展報告書的撰寫。
      請根據使用者提供的章節名稱、現有內容以及附加指示，進行專業深度的擴寫。
      
      語氣要求：
      - 專業、客觀、具備公信力。
      - 強調「具體行動」、「數據量化」與「管理方針 (DMA)」。
      - 符合「液態玻璃」設計哲學的俐落感，不說廢話。
      
      當前章節：${chapterName}
    `;

    const userPrompt = `
      請協助擴寫以下章節內容。
      
      附加指示：${prompt || '無特定指示，請根據章節主題進行標準深度擴充。'}
      
      現有內容：
      ${content || '(尚未有內容，請從頭開始撰寫草稿)'}
    `;

    if (API_KEYS.length === 0) {
      throw new Error("系統錯誤：尚未配置任何有效的 Gemini API 密鑰");
    }

    let lastError: any = null;

    for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
      const apiKey = API_KEYS[currentKeyIndex];
      const google = createGoogleGenerativeAI({ apiKey });

      try {
        const result = await streamText({
          model: google('gemini-1.5-pro'),
          system: systemInstruction,
          prompt: userPrompt,
          temperature: 0.4, // Keep it professional and focused
        });

        // If streamText succeeds, return the DataStreamResponse
        return result.toDataStreamResponse();

      } catch (error: any) {
        lastError = error;
        const errorMsg = error?.message || error?.toString() || '';
        const isQuotaExhausted = 
          error?.status === 429 ||
          errorMsg.includes('429') ||
          errorMsg.includes('quota') ||
          errorMsg.includes('exhausted') ||
          errorMsg.includes('spending cap');

        if (isQuotaExhausted && attempt < API_KEYS.length - 1) {
          console.warn(`[AI Expand] Key ${currentKeyIndex + 1} exhausted, rotating...`);
          currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
          continue; // Try next key
        }
        
        throw error; // Not a quota error, or exhausted all keys
      }
    }

    throw lastError || new Error('所有備用的 API Keys 均已耗盡');

  } catch (error: any) {
    console.error('SustainWrite API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate expert content', details: error.message },
      { status: 500 }
    );
  }
}
