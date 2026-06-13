import { NextResponse } from 'next/server';
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export const runtime = 'edge';

const API_KEYS = [
  process.env.AGNES_API_1,
  process.env.AGNES_API_2,
  process.env.AGNES_API_3,
  process.env.AGNES_API,
  process.env.OMNI_TOKEN
].filter(k => k && k.trim() !== '') as string[];

let currentKeyIndex = 0;

export async function POST(req: Request) {
  try {
    const { companyId, chapterName, content, prompt, targetWordCount } = await req.json();

    const systemInstruction = `
      你是 ESG GO 系統的「專家級永續報告撰寫大師 (SustainWrite Scribe)」。
      你熟悉 GRI、TCFD、SASB 等國際準則，並且擅長企業永續發展報告書的撰寫。
      請根據使用者提供的章節名稱、現有內容以及附加指示，進行專業、深度的擴寫。
      
      【撰寫精細度要求 (High Granularity & Precision)】：
      1. 數據與量化導向 (Quantitative Focus)：避免空泛描述。凡提及成效，必須預留或提供明確的數據、單位、比較基準（如基準年、YOY 成長率）。
      2. 結構化管理方針 (DMA Structure)：確保內容涵蓋：
         - 策略與願景 (Strategy & Vision)
         - 具體行動與落實措施 (Specific Actions & Initiatives)
         - 資源投入與權責單位 (Resource Allocation & Ownership)
         - 績效評估機制 (Performance Evaluation)
      3. 國際準則對齊 (Framework Alignment)：撰寫時需隱含 GRI 準則的揭露要求，確保內容涵蓋利害關係人關注的實質性議題。
      4. MECE 原則 (Mutually Exclusive, Collectively Exhaustive)：內容段落必須獨立不重疊，且全面涵蓋該章節應具備的子主題。
      
      【語氣要求】：
      - 專業、客觀、具備公信力。
      - 遣詞用字需符合上市櫃公司法定永續報告書之嚴謹度。
      - 符合系統「液態玻璃」設計哲學的俐落感，絕不說冗言贅字。
      
      當前章節：${chapterName}
    `;

    const userPrompt = `
      請協助擴寫以下章節內容。若為全新內容，請建構完整的章節骨架與充實的內文。
      
      【附加指示】：
      ${prompt || '無特定指示。請主動展開多維度面向（例如：政策規劃、執行計畫、成效數據、未來中長期目標），進行深度擴充。'}
      
      【現有內容】：
      ${content || '(尚未有內容，請依據上述高標準從頭開始撰寫具備豐富層次感的初稿)'}
    `;

    if (API_KEYS.length === 0) {
      throw new Error("系統錯誤：尚未配置任何有效的 Gemini API 密鑰");
    }

    let lastError: any = null;

    for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
      const apiKey = API_KEYS[currentKeyIndex];
      const agnes = createOpenAI({ baseURL: 'https://apihub.agnes-ai.com/v1', apiKey: process.env.AGNES_API || process.env.AGNES_API_KEY });

      try {
        const result = await streamText({
          model: agnes('agnes-2.0-flash'),
          system: systemInstruction,
          prompt: userPrompt,
          temperature: 0.4, // Keep it professional and focused
        });

        // If streamText succeeds, return the stream response
        return result.toTextStreamResponse();

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
