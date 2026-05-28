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
  'general': `# 組織概況與治理架構 (零算力專家模板)

## 1. 組織詳細資訊
[GRI 2-1] 本公司正式名稱為 **{{company_name}}**。我們的總部位於 **{{hq_location}}**，在全球 **{{operating_countries}}** 個國家設有營運據點。
我們專注於 **{{main_business_activities}}**，致力於為客戶提供最具價值的服務。

## 2. 員工結構與多元化
[GRI 2-7] 截至報告年度末，本集團全球員工總數為 **{{emp_total}}** 人。我們致力於營造多元、公平與包容的職場環境，目前女性員工占比為 **{{female_emp_ratio}}**%，高階主管中女性比例達到 **{{female_exec_ratio}}**%。

## 3. 治理架構與最高治理單位
[GRI 2-9] 我們的最高治理單位為董事會。董事會目前由 **{{board_size}}** 席董事組成，其中獨立董事 **{{independent_directors}}** 席，佔比達 **{{independent_ratio}}**%。
董事會轄下設立「永續發展委員會」，由 **{{esg_committee_chair}}** 擔任主席，負責審議與監督集團的永續發展策略與氣候相關風險。

---
> 💡 專家提示：填妥上述雙括號 {{...}} 內之真實數據後，可切換至「AI 工具區」點擊「文章增長」或「圖表加強」進行自動擴寫。`,
  'emissions': `# 溫室氣體排放與氣候行動 (零算力專家模板)

## 1. 氣候變遷管理方針與承諾
[GRI 305] 面對全球氣候變遷的嚴峻挑戰，本公司已正式承諾於 **{{net_zero_year}}** 年達成全價值鏈淨零排放 (Net Zero)。我們依循 TCFD 框架，將氣候風險納入企業核心風險管理機制，並已向 SBTi 提交基於 1.5°C 情境的科學減碳目標。

## 2. 溫室氣體排放盤查結果
[GRI 305-1, 305-2] 依據 ISO 14064-1 標準，本報告年度溫室氣體排放盤查結果如下：
- **範疇一 (Scope 1) 直接排放**：**{{ghg_s1}}** 噸 CO2e
- **範疇二 (Scope 2) 間接排放**：**{{ghg_s2}}** 噸 CO2e
- **總排放量 (Scope 1+2)**：**{{ghg_total}}** 噸 CO2e

相較於基準年 (**{{base_year}}**)，我們已成功減量 **{{reduction_rate}}**%。

## 3. 減碳策略與行動方案
為達成既定目標，我們推動了以下核心行動：
1. **提升再生能源比例**：報告年度再生能源使用佔比已達 **{{renewable_energy_ratio}}**%。
2. **製程能效優化**：投入 **{{capex_energy}}** 萬元進行設備汰舊換新。
3. **供應鏈議合**：啟動「綠色價值鏈計畫」，輔導 **{{supplier_count}}** 家關鍵供應商進行碳盤查。

---
> 💡 專家提示：此為符合 GRI 標準之零算力骨架。請於「資料區」核實數據後，透過 AI 工具生成減碳趨勢圖表。`
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
    evidenceData: { input, result, timestamp: Date.now() },
    sourceOrigin: 'ESG AI Analysis Flow',
    griReference: input.griReference,
  });

  await engraveToSingleTable(component);

  return {
    ...result,
    hashLock: component.hash_lock,
    vaultId: component.uuid,
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

// ── OCR & Evidence Validation Flow ─────────────────────────────────────────

export const OCRInputSchema = z.object({
  imageUrl: z.string().describe('圖片 URL 或 Base64 編碼字串'),
  documentType: z.enum(['invoice', 'report', 'certificate', 'other']).default('other'),
  language: z.enum(['zh-TW', 'en']).default('zh-TW'),
});

export const OCROutputSchema = z.object({
  extractedText: z.string(),
  structuredData: z.record(z.string(), z.any()),
  confidenceScore: z.number().min(0).max(100),
});

export type OCRInput = z.infer<typeof OCRInputSchema>;
export type OCROutput = z.infer<typeof OCROutputSchema>;

export async function runOCRAnalysisFlow(
  input: OCRInput
): Promise<OCROutput & { hashLock: string }> {
  const prompt = `你是一個專業的 OCR 與文件分析模型。請分析這份 ${input.documentType} 文件。\n圖片連結: ${input.imageUrl}\n請提取文字並將關鍵數據結構化。\n輸出 JSON 格式：{"extractedText":"...","structuredData":{},"confidenceScore":95}`;
  
  const rawResponse = await callGemini(prompt);
  const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
  const result = JSON.parse(jsonMatch?.[0] ?? '{"extractedText":"","structuredData":{},"confidenceScore":0}') as OCROutput;
  const hashLock = computeHashLock({ input, result });
  
  return { ...result, hashLock };
}

export async function runEvidenceValidationFlow(
  evidenceText: string,
  griReference: string
): Promise<{ isValid: boolean; validationDetails: string; hashLock: string }> {
  const prompt = `作為審計專家，請自動驗證以下證據是否符合 GRI 標準 ${griReference}。\n證據內容：\n${evidenceText}\n輸出 JSON 格式：{"isValid":true,"validationDetails":"..."}`;
  
  const rawResponse = await callGemini(prompt);
  const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
  const result = JSON.parse(jsonMatch?.[0] ?? '{"isValid":false,"validationDetails":"Validation failed."}') as any;
  const hashLock = computeHashLock({ evidenceText, griReference, result });
  
  return { ...result, hashLock };
}
