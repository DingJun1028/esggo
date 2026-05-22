'use client';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface ESGAnalysisResult {
  greenwashingRisk: 'low' | 'medium' | 'high';
  riskScore: number;
  issues: string[];
  suggestions: string[];
  griAlignment: string[];
  complianceRate: number;
}

async function callGeminiAPI(prompt: string, systemInstruction?: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    return '⚠️ Gemini API 金鑰未設定，請在 .env 中配置 NEXT_PUBLIC_GEMINI_API_KEY。';
  }

  try {
    const body: any = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    };

    if (systemInstruction) {
      body.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Gemini API error');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '無回應內容';
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return `AI 服務暫時無法使用：${error.message}`;
  }
}

export async function analyzeGreenwashingRisk(text: string): Promise<ESGAnalysisResult> {
  const prompt = `
你是一位 ESG 合規專家，專門偵測「綠漂 (Greenwashing)」風險。
請分析以下永續報告內容，並以 JSON 格式回傳分析結果。

報告內容：
${text}

請回傳以下 JSON 格式（只回傳 JSON，不要有其他文字）：
{
  "greenwashingRisk": "low|medium|high",
  "riskScore": 0-100,
  "issues": ["問題1", "問題2"],
  "suggestions": ["建議1", "建議2"],
  "griAlignment": ["GRI 305-1", "GRI 302-1"],
  "complianceRate": 0-100
}
`;

  try {
    const result = await callGeminiAPI(prompt);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Parse error:', e);
  }

  return {
    greenwashingRisk: 'medium',
    riskScore: 45,
    issues: ['無法解析 AI 回應'],
    suggestions: ['請重新提交分析'],
    griAlignment: [],
    complianceRate: 50,
  };
}

export async function generateGRIContent(
  chapter: string,
  persona: 'compliance' | 'harmony' | 'innovation',
  companyContext: string,
  existingData?: string
): Promise<string> {
  const personaDescriptions = {
    compliance: '你是「合規守衛」，專注於 GRI 標準的精確遵循、風險控管與法規要求。文字風格嚴謹、精確、具說服力。',
    harmony: '你是「共榮引導」，強調利害關係人關係、社區影響與企業文化。文字風格溫暖、包容、具人文關懷。',
    innovation: '你是「創新先行」，探索永續技術、轉型機會與未來趨勢。文字風格前瞻、積極、具啟發性。',
  };

  const prompt = `
${personaDescriptions[persona]}

請為以下 ESG 報告章節撰寫 5000 字的專業內容（繁體中文），分為 5 個段落，每段約 1000 字。
必須符合 GRI 2021 標準，包含具體數據、指標與佐證說明。

章節：${chapter}
企業背景：${companyContext}
${existingData ? `現有數據：${existingData}` : ''}

請直接開始撰寫報告內容，不要有前言或說明。
`;

  return await callGeminiAPI(prompt);
}

export async function chatWithESGAssistant(
  messages: GeminiMessage[],
  persona: string,
  companyContext?: string
): Promise<string> {
  const systemInstruction = `
你是 ESG GO 善向永續平台的 AI 顧問助理，化身為「${persona}」角色。
${companyContext ? `企業背景：${companyContext}` : ''}

你的職責是：
1. 提供符合 GRI 2021、TCFD、SASB、ISSB 標準的 ESG 建議
2. 協助企業識別永續治理缺口
3. 提供具體、可操作的改善建議
4. 以繁體中文回應，專業且易於理解

請根據對話脈絡，提供最相關且有價值的 ESG 治理建議。
`;

  if (!GEMINI_API_KEY) {
    return '⚠️ Gemini API 金鑰未設定，請在 .env 中配置 NEXT_PUBLIC_GEMINI_API_KEY。';
  }

  try {
    const body = {
      contents: messages,
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Gemini API error');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '無法獲取回應';
  } catch (error: any) {
    return `AI 顧問暫時無法連線：${error.message}`;
  }
}

export async function generateESGSummary(reportData: any): Promise<string> {
  const prompt = `
請根據以下 ESG 數據，撰寫一份精簡的執行摘要（約 500 字，繁體中文）：

環境數據：${JSON.stringify(reportData.environmental || {})}
社會數據：${JSON.stringify(reportData.social || {})}
治理數據：${JSON.stringify(reportData.governance || {})}
合規率：${reportData.complianceRate || 0}%

請包含：主要成就、改善領域、未來目標。
`;

  return await callGeminiAPI(prompt);
}

export async function refineESGText(
  text: string,
  mode: 'expand' | 'refine' | 'proofread' | 'format' | 'translate'
): Promise<string> {
  const modeInstructions = {
    expand: '請將以下文字擴寫至約 3 倍長度，補充更多細節、數據引用與 ESG 背景說明：',
    refine: '請精煉以下文字，去除冗詞，使其更加精確、專業且具說服力：',
    proofread: '請校對以下文字，修正錯別字、統一專有名詞，確保語氣一致：',
    format: '請將以下文字重新排版，加入適當的段落結構、重點標記與層次感：',
    translate: '請將以下繁體中文翻譯成專業的英文（保留 ESG 專業術語）：',
  };

  const prompt = `${modeInstructions[mode]}\n\n${text}`;
  return await callGeminiAPI(prompt);
}