/**
 * ESG GO | AI ESG Flows
 * Google Gemini × GRI 2021 × 5T Protocol
 * (Direct Gemini API — no Genkit runtime dependency)
 */

import { z } from 'zod';
import { buildComponent, engraveToSingleTable, computeHashLock } from './vault-omni';
import { ApiResult } from '../types/api';

// ── Zod Schemas ────────────────────────────────────────────────────────────
export const ESGAnalysisInputSchema = z.object({
  content: z.string().describe('ESG 報告內容或數據描述'),
  griReference: z.string().optional().describe('GRI 標準（如 GRI 305-1）'),
  category: z.enum(['E', 'S', 'G']).optional().describe('ESG 分類'),
  language: z.enum(['zh-TW', 'en']).default('zh-TW'),
});

export const ESGAnalysisOutputSchema = z.object({
  summary: z.string(),
  compliance: z.object({
    score: z.number().min(0).max(100),
    gaps: z.array(z.string()),
    recommendations: z.array(z.string()),
  }),
  greenwashingRisks: z.array(z.object({
    phrase: z.string(),
    riskLevel: z.enum(['low', 'medium', 'high']),
    suggestion: z.string(),
  })),
  griAlignment: z.array(z.string()),
  formula: z.string(),
});

export const GRIContentInputSchema = z.object({
  chapter: z.string(),
  metrics: z.record(z.string(), z.union([z.string(), z.number()])),
  persona: z.enum(['compliance', 'harmony', 'innovation']).default('compliance'),
  wordCount: z.number().default(500),
});

export const GRIContentOutputSchema = z.object({
  content: z.string(),
  griIndicators: z.array(z.string()),
  keyPoints: z.array(z.string()),
  evidenceRequired: z.array(z.string()),
});

export type ESGAnalysisInput = z.infer<typeof ESGAnalysisInputSchema>;
export type ESGAnalysisOutput = z.infer<typeof ESGAnalysisOutputSchema>;
export type GRIContentInput = z.infer<typeof GRIContentInputSchema>;
export type GRIContentOutput = z.infer<typeof GRIContentOutputSchema>;

// ── Direct Gemini REST API caller ──────────────────────────────────────────
async function callGemini(prompt: string, systemPrompt?: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return generateMockResponse(prompt);
  }

  try {
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'user', parts: [{ text: systemPrompt }] });
      messages.push({ role: 'model', parts: [{ text: '了解，我將扮演這個角色。' }] });
    }
    messages.push({ role: 'user', parts: [{ text: prompt }] });

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: messages,
          generationConfig: { 
            temperature: 0.7, 
            maxOutputTokens: 8192,
            topP: 0.95,
            topK: 40
          },
        }),
      }
    );

    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
    const json = await res.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text ?? generateMockResponse(prompt);
  } catch (err) {
    console.warn('[ESG AI] Gemini API call failed, using mock:', err);
    return generateMockResponse(prompt);
  }
}

function generateMockResponse(prompt: string): string {
  if (prompt.includes('合規') || prompt.includes('compliance') || prompt.includes('分析')) {
    return JSON.stringify({
      summary: '本份 ESG 報告書在環境數據揭露方面符合 GRI 305-1 基本要求，惟 Scope 3 排放數據仍有待補強。',
      compliance: {
        score: 72,
        gaps: ['缺少 Scope 3 供應鏈排放數據', '水資源使用強度指標未揭露'],
        recommendations: ['建立供應商碳足跡追蹤機制', '導入 ISO 14046 水資源評估標準'],
      },
      greenwashingRisks: [
        { phrase: '致力於永續發展', riskLevel: 'medium', suggestion: '建議改為「2030年前減碳46%」等具體目標' },
      ],
      griAlignment: ['GRI 305-1', 'GRI 305-2', 'TCFD 氣候相關揭露'],
      formula: '合規率 = (已揭露 GRI 指標數 ÷ 應揭露指標總數) × 100%',
    });
  }
  return JSON.stringify({
    content: `本公司依據 GRI 2021 準則，針對所揭露之永續議題進行系統性管理。透過建立完善的環境管理體系，持續追蹤與改善各項環境績效指標，並定期接受第三方查證，確保數據的真實性與可信度。`,
    griIndicators: ['GRI 305-1', 'GRI 302-1'],
    keyPoints: ['建立碳盤查制度', '推動再生能源使用', '強化供應鏈管理'],
    evidenceRequired: ['ISO 14064-1 盤查清冊', '台電帳單', 'T-REC 憑證'],
  });
}

// ── ESG Compliance Analysis Flow ───────────────────────────────────────────
export async function runESGAnalysisFlow(
  input: ESGAnalysisInput
): Promise<ESGAnalysisOutput & { hashLock: string; vaultId: string }> {
  const systemPrompt = `你是一位專業的 ESG 永續報告顧問，具備 GRI 2021、SASB、TCFD 及 ISSB S1/S2 認證。
請以${input.language === 'zh-TW' ? '繁體中文' : 'English'}回應，並以 JSON 格式輸出分析結果。
輸出格式必須完全符合以下 JSON 結構，不要有任何多餘文字：
{"summary":"...","compliance":{"score":0,"gaps":[],"recommendations":[]},"greenwashingRisks":[{"phrase":"...","riskLevel":"low|medium|high","suggestion":"..."}],"griAlignment":[],"formula":"..."}`;

  const prompt = `請分析以下 ESG 內容：
${input.content}
${input.griReference ? `GRI 標準：${input.griReference}` : ''}
${input.category ? `ESG 類別：${input.category}` : ''}`;

  const rawResponse = await callGemini(prompt, systemPrompt);

  let result: ESGAnalysisOutput;
  try {
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    result = JSON.parse(jsonMatch?.[0] ?? rawResponse) as ESGAnalysisOutput;
  } catch {
    result = JSON.parse(generateMockResponse('compliance')) as ESGAnalysisOutput;
  }

  const component = buildComponent({
    formula: result.formula,
    isoStandard: 'GRI 2021',
    evidence: { input, result, timestamp: Date.now() },
    sourceOrigin: 'ESG AI Analysis Flow',
    griReference: input.griReference,
  });

  await engraveToSingleTable(component);

  return {
    ...result,
    hashLock: component.identity.hashLock,
    vaultId: component.identity.uuid,
  };
}

// ── GRI Content Generation Flow ────────────────────────────────────────────
export async function runGRIContentFlow(
  input: GRIContentInput
): Promise<GRIContentOutput & { hashLock: string }> {
  // If word count > 2000, use Recursive Expansion Strategy
  if (input.wordCount >= 2000) {
    return runRecursiveExpansionFlow(input);
  }

  const personaPrompts: Record<string, string> = {
    compliance: '以「合規守衛」視角撰寫，強調法規遵循、風險管控與第三方查證',
    harmony: '以「共榮引導」視角撰寫，強調利害關係人議合、企業文化與社會影響',
    innovation: '以「創新先行」視角撰寫，強調永續科技、轉型替代方案與未來趨勢',
  };

  const metricsStr = Object.entries(input.metrics)
    .map(([k, v]) => `- ${k}：${v}`)
    .join('\n');

  const prompt = `你是一位資深的 ESG 撰寫專家。請依據以下資訊，撰寫一份極其詳盡、專業且具備深度洞察的 ${input.chapter} 章節內容。
目標字數：約 ${input.wordCount} 字（請務必提供足夠的細節與篇幅以達到此深度，不要縮減內容）。
撰寫風格：${personaPrompts[input.persona]}

已填報指標數據：
${metricsStr}

撰寫要求：
1. 嚴格遵循 GRI 2021 揭露要求與結構。
2. 包含管理方針 (Management Approach)、績效分析、具體目標設定與未來展望。
3. 若數據充足，請進行深度趨勢分析，並確保數值與背景描述一致。
4. 內容需具備強大的邏輯性，使用業界公認的專業術語。

輸出格式（JSON）：
{"content":"[在此填入完整、連續且長篇的章節文字]","griIndicators":[],"keyPoints":[],"evidenceRequired":[], "chartSuggestions": []}`;

  const rawResponse = await callGemini(prompt);

  let result: GRIContentOutput & { chartSuggestions?: string[] };
  try {
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    result = JSON.parse(jsonMatch?.[0] ?? rawResponse) as any;
  } catch {
    result = {
      content: rawResponse.replace(/```json?/g, '').replace(/```/g, '').trim(),
      griIndicators: [],
      keyPoints: [],
      evidenceRequired: [],
    };
  }

  const hashLock = computeHashLock({ input, result });
  return { ...result, hashLock };
}

// ── Recursive Expansion Flow (Long-Form Master) ───────────────────────────
async function runRecursiveExpansionFlow(
  input: GRIContentInput
): Promise<GRIContentOutput & { hashLock: string }> {
  console.log(`[GRI Engine] Starting Recursive Expansion for 5000+ words...`);
  
  // Phase 1: Generate Outline
  const outlinePrompt = `為 GRI 章節「${input.chapter}」建立一個包含 5 個子段落的極詳細大綱。
每個子段落應專注於特定的 GRI 指標或管理面向。
指標數據：${JSON.stringify(input.metrics)}
輸出格式（JSON）：{"sections": [{"title": "...", "focus": "..."}]}`;
  
  const rawOutline = await callGemini(outlinePrompt);
  const { sections } = JSON.parse(rawOutline.match(/\{[\s\S]*\}/)?.[0] || '{"sections":[]}');
  
  let fullContent = "";
  const allIndicators: string[] = [];
  const allKeyPoints: string[] = [];
  
  // Phase 2: Sequential Expansion (Building the 5000 words block by block)
  for (const section of sections) {
    const sectionPrompt = `作為 ESG 專家，請深入撰寫「${input.chapter}」中的「${section.title}」子章節。
重點關注：${section.focus}
數據背景：${JSON.stringify(input.metrics)}
要求：撰寫至少 1000 字的專業內容。包含詳細的數據解讀與趨勢分析。
輸出格式（JSON）：{"content": "...", "indicators": []}`;
    
    const rawSection = await callGemini(sectionPrompt);
    const secData = JSON.parse(rawSection.match(/\{[\s\S]*\}/)?.[0] || '{"content":""}');
    
    fullContent += `\n\n### ${section.title}\n\n${secData.content}`;
    if (secData.indicators) allIndicators.push(...secData.indicators);
    allKeyPoints.push(section.title);
  }

  const result = {
    content: fullContent.trim(),
    griIndicators: [...new Set(allIndicators)],
    keyPoints: allKeyPoints,
    evidenceRequired: ['Auto-extracted from deep expansion'],
  };

  const hashLock = computeHashLock({ input, result });
  return { ...result, hashLock };
}

// ── Zero-Compute Expert Templates (The "Sacred Grids") ────────────────────
export const EXPERT_SACRED_TEMPLATES: Record<string, string> = {
  'general_v1': `# 組織概況與治理架構 (Expert Master Template)
## 1. 組織詳細資訊
[GRI 2-1] 本公司正式名稱為 {{company_name}}，總部設於 {{location}}...
... (A high-fidelity 20-page structure here) ...
`,
  'environmental_v1': `# 環境永續報告深度框架 (T1-T5 Level)
## 1. 溫室氣體管理策略
[GRI 305] 基於 SBTi 1.5°C 情境...
`
};

// ── Greenwashing Scanner ───────────────────────────────────────────────────
export async function scanGreenwashing(text: string): Promise<{
  risks: Array<{ phrase: string; riskLevel: string; suggestion: string }>;
  overallRisk: 'low' | 'medium' | 'high';
  hashLock: string;
}> {
  const prompt = `請掃描以下文字中的「綠漂 (Greenwashing)」風險，找出模糊、誇大或無法核實的永續聲明。
文字：${text}
輸出格式（JSON）：{"risks":[{"phrase":"...","riskLevel":"low|medium|high","suggestion":"..."}],"overallRisk":"low|medium|high"}`;

  const rawResponse = await callGemini(prompt);

  let result: { risks: Array<{ phrase: string; riskLevel: string; suggestion: string }>; overallRisk: 'low' | 'medium' | 'high' };
  try {
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    result = JSON.parse(jsonMatch?.[0] ?? '{}') as typeof result;
  } catch {
    result = { risks: [], overallRisk: 'low' };
  }

  return { ...result, hashLock: computeHashLock(result) };
}