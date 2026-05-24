/**
 * ESG GO | AI ESG Flows
 * Google Gemini × GRI 2021 × 5T Protocol
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
  if (!apiKey || apiKey === 'your_gemini_api_key_here') return "";

  try {
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'user', parts: [{ text: systemPrompt }] });
      messages.push({ role: 'model', parts: [{ text: '了解。' }] });
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

    if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
    const json = await res.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  } catch (err) {
    console.warn('[AI] Error:', err);
    return "";
  }
}

// ── GRI Content Generation Flow ────────────────────────────────────────────
export async function runGRIContentFlow(
  input: GRIContentInput
): Promise<GRIContentOutput & { hashLock: string }> {
  // If word count is high, use Recursive Expansion Strategy
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

  const prompt = `你是一位資深的 ESG 撰寫專家。請依據以下資訊，撰寫一份專業且具備深度洞察的 ${input.chapter} 章節內容。
目標字數：約 ${input.wordCount} 字。
撰寫風格：${personaPrompts[input.persona]}

已填報指標數據：
${metricsStr}

要求：嚴格遵循 GRI 2021 結構，包含管理方針與績效。
輸出格式（JSON）：{"content":"...","griIndicators":[],"keyPoints":[],"evidenceRequired":[]}`;

  const rawResponse = await callGemini(prompt);
  const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
  const result = JSON.parse(jsonMatch?.[0] ?? '{"content":""}') as GRIContentOutput;
  const hashLock = computeHashLock({ input, result });
  return { ...result, hashLock };
}

// ── Recursive Expansion Flow (Long-Form Master) ───────────────────────────
async function runRecursiveExpansionFlow(
  input: GRIContentInput
): Promise<GRIContentOutput & { hashLock: string }> {
  console.log(`[GRI Engine] Starting Recursive Expansion for ${input.wordCount} words...`);
  
  const outlinePrompt = `為 GRI 章節「${input.chapter}」建立一個包含 6 個極詳細子段落的專業大綱。
每個子段落應專注於特定的 GRI 揭露要求。
指標數據：${JSON.stringify(input.metrics)}
輸出格式（JSON）：{"sections": [{"title": "...", "focus": "..."}]}`;
  
  const rawOutline = await callGemini(outlinePrompt);
  const outlineData = JSON.parse(rawOutline.match(/\{[\s\S]*\}/)?.[0] || '{"sections":[]}');
  const sections = outlineData.sections || [];
  
  let fullContent = "";
  const allIndicators: string[] = [];
  const allKeyPoints: string[] = [];
  
  for (const section of sections) {
    const sectionPrompt = `作為 ESG 專家，請深入撰寫「${input.chapter}」中的「${section.title}」子章節。
重點關注：${section.focus}
數據背景：${JSON.stringify(input.metrics)}
要求：撰寫至少 1200 字的專業內容。
輸出格式（JSON）：{"content": "...", "indicators": []}`;
    
    const rawSection = await callGemini(sectionPrompt);
    const secData = JSON.parse(rawSection.match(/\{[\s\S]*\}/)?.[0] || '{"content":""}');
    
    fullContent += `\n\n## ${section.title}\n\n${secData.content}`;
    if (secData.indicators) allIndicators.push(...secData.indicators);
    allKeyPoints.push(section.title);
  }

  const result = {
    content: fullContent.trim(),
    griIndicators: [...new Set(allIndicators)],
    keyPoints: allKeyPoints,
    evidenceRequired: ['Auto-extracted from recursive expansion'],
  };

  const hashLock = computeHashLock({ input, result });
  return { ...result, hashLock };
}

// ── Zero-Compute Expert Templates ────────────────────────────────────────
export const EXPERT_SACRED_TEMPLATES: Record<string, string> = {
  'general_v1': `# 組織概況與治理架構 (Expert Master Template)\n\n## 1. 組織詳細資訊\n[GRI 2-1] 本公司正式名稱為 {{company_name}}...`,
  'environmental_v1': `# 環境永續報告深度框架 (T1-T5 Level)\n\n## 1. 溫室氣體管理策略\n[GRI 305] 基於 SBTi 1.5°C 情境...`
};

// ── ESG Compliance Analysis Flow ───────────────────────────────────────────
export async function runESGAnalysisFlow(
  input: ESGAnalysisInput
): Promise<ESGAnalysisOutput & { hashLock: string; vaultId: string }> {
  const systemPrompt = `你是一位專業的 ESG 永續報告顧問。請以 JSON 格式輸出分析結果。
輸出格式：{"summary":"...","compliance":{"score":0,"gaps":[],"recommendations":[]},"greenwashingRisks":[],"griAlignment":[],"formula":"..."}`;

  const prompt = `請分析以下 ESG 內容：\n${input.content}`;
  const rawResponse = await callGemini(prompt, systemPrompt);
  const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
  const result = JSON.parse(jsonMatch?.[0] ?? '{"summary":""}') as ESGAnalysisOutput;

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

// ── Greenwashing Scanner ───────────────────────────────────────────────────
export async function scanGreenwashing(text: string): Promise<{
  risks: Array<{ phrase: string; riskLevel: string; suggestion: string }>;
  overallRisk: 'low' | 'medium' | 'high';
  hashLock: string;
}> {
  const prompt = `請掃描綠漂風險：\n${text}\n輸出 JSON 格式：{"risks":[],"overallRisk":"low"}`;
  const rawResponse = await callGemini(prompt);
  const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
  const result = JSON.parse(jsonMatch?.[0] ?? '{"risks":[]}') as any;
  return { ...result, hashLock: computeHashLock(result) };
}
