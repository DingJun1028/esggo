/**
 * ESG GO | AI ESG Flows
 * Google Gemini × GRI 2021 × 5T Protocol
 */

import { z } from 'zod';
import { buildComponent, engraveToSingleTable, computeHashLock } from './vault-omni';
import { ApiResult } from '@/src/shared/types';

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
export async function callGemini(prompt: string, systemPrompt?: string): Promise<string> {
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
    compliance: '以「合規守衛」視角撰寫，強調法規遵循、風險管控與第三方查證。在撰寫過程中，請與一位「創新先行」代理人進行虛擬辯論，確保在合規之餘也能展現技術前瞻性。',
    harmony: '以「共榮引導」視角撰寫，強調利害關係人議合、企業文化與社會影響。在撰寫過程中，請與一位「合規守衛」代理人討論，確保社會承諾具備可衡量的指標。',
    innovation: '以「創新先行」視角撰寫，強調永續科技、轉型替代方案與未來趨勢。在撰寫過程中，請與一位「共榮引導」代理人協作，確保技術轉型不忽視公正轉型(Just Transition)原則。',
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
  console.log(`[GRI Engine] Starting Deep Recursive Expansion for ${input.wordCount} words...`);
  
  const outlinePrompt = `為 GRI 章節「${input.chapter}」建立一個包含 5 個極詳細核心子段落的專業大綱，以確保能擴展至兩萬字規模。
每個子段落應專注於特定的 GRI 揭露要求、政策、行動與績效。
指標數據：${JSON.stringify(input.metrics)}
輸出格式（JSON）：{"sections": [{"title": "...", "focus": "..."}]}`;
  
  const rawOutline = await callGemini(outlinePrompt);
  const outlineData = JSON.parse(rawOutline.match(/\{[\s\S]*\}/)?.[0] || '{"sections":[]}');
  const sections = outlineData.sections || [];
  
  let fullContent = "";
  const allIndicators: string[] = [];
  const allKeyPoints: string[] = [];
  
  for (const section of sections) {
    const sectionPrompt = `作為 ESG 專家，請極度深入、詳盡地撰寫「${input.chapter}」中的「${section.title}」子章節。
重點關注：${section.focus}
數據背景：${JSON.stringify(input.metrics)}
要求：
1. 深入分析背景、利害關係人衝擊、具體管理方針與短中長期目標。
2. 引用業界最佳實踐與法規趨勢。
3. 本次任務目標為產出總計 30 萬字（約 250 頁）之企業級 ESG 永續報告，因此本子章節必須極度詳盡，產出至少 4000 字的專業內容，以達成單一章節 2 萬字之標準。請使用詳細案例、法規引述、影響評估來充實內容。
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

export const EXPERT_SACRED_TEMPLATES: Record<string, string> = {
  'general': `# 組織概況與治理架構 (零算力專家模板 v2.0 - 2萬字深度架構)

## 第一節：組織營運全貌與全球戰略佈局 (目標字數：4000字)
[GRI 2-1, 2-6] 本公司正式名稱為 **{{company_name}}**。我們的總部位於 **{{hq_location}}**，在全球 **{{operating_countries}}** 個國家設有營運據點。
【OmniAgent 擴充區塊 A：請詳述產業定位、市場沿革、價值鏈分佈與產品服務之社會價值。需涵蓋未來 10 年之市場前瞻分析。】

## 第二節：多元共融與人力資本發展 (目標字數：4000字)
[GRI 2-7, 2-8] 截至報告年度末，本集團全球員工總數為 **{{emp_total}}** 人。目前女性員工占比為 **{{female_emp_ratio}}**%，高階主管女性比例達 **{{female_exec_ratio}}**%。
【OmniAgent 擴充區塊 B：請探討非典型就業、跨國人才流動、人才培育投資報酬(ROI)與 DEI (多元平等包容) 政策之具體成效。】

## 第三節：最高治理單位結構與職能 (目標字數：4000字)
[GRI 2-9, 2-10, 2-11] 董事會目前由 **{{board_size}}** 席董事組成，獨立董事 **{{independent_directors}}** 席 (佔 **{{independent_ratio}}**%)。
【OmniAgent 擴充區塊 C：請深入分析董事會適任性矩陣 (Board Skills Matrix)、績效評估機制與接班梯隊計畫，並列舉國際最佳實踐。】

## 第四節：永續治理架構與高階薪酬連結 (目標字數：4000字)
[GRI 2-12, 2-13, 2-14] 「永續發展委員會」由 **{{esg_committee_chair}}** 擔任主席，統籌氣候與人權風險。
【OmniAgent 擴充區塊 D：請論述高階經理人薪酬與 ESG 績效指標(KPI)之連動機制、氣候變遷風險(TCFD)之監督與管理架構。】

## 第五節：利害關係人議合與重大性衝擊 (目標字數：4000字)
[GRI 2-29, 3-1, 3-2] 
【OmniAgent 擴充區塊 E：請剖析雙重重大性 (Double Materiality) 評估流程、利害關係人溝通頻率/管道，以及基於實際回饋的衝擊對應矩陣。】

---
> 💡 專家提示：此零算力模板已內建 5 段論述架構。請點擊「文章增長」，OmniAgent 將自動將各區塊擴充至 4000 字級別之專業深度，達成單章 2 萬字目標。`,

  'emissions': `# 溫室氣體排放與氣候行動 (零算力專家模板 v2.0 - 2萬字深度架構)

## 第一節：氣候變遷管理方針與淨零承諾 (目標字數：4000字)
[GRI 305] 面對氣候變遷，本公司承諾於 **{{net_zero_year}}** 年達成全價值鏈淨零排放 (Net Zero)。
【OmniAgent 擴充區塊 A：請詳述 TCFD 框架下之轉型風險與實體風險情境分析 (1.5°C 情境)，並說明內部碳定價(ICP)策略。】

## 第二節：溫室氣體排放盤查與驗證結果 (目標字數：4000字)
[GRI 305-1, 305-2] 盤查結果：範疇一 **{{ghg_s1}}** 噸 CO2e；範疇二 **{{ghg_s2}}** 噸 CO2e。相較基準年減量 **{{reduction_rate}}**%。
【OmniAgent 擴充區塊 B：請解析 ISO 14064-1 盤查邊界、排放源熱點分析，以及第三方查證聲明之關鍵細節。】

## 第三節：再生能源轉型與能效優化 (目標字數：4000字)
[GRI 302] 報告年度再生能源佔比達 **{{renewable_energy_ratio}}**%，投入 **{{capex_energy}}** 萬元優化設備。
【OmniAgent 擴充區塊 C：請論述 RE100 達成路徑、綠電採購合約(CPPA)之風險管理，及智慧電網之應用成效。】

## 第四節：範疇三排放與價值鏈減碳議合 (目標字數：4000字)
[GRI 305-3] 我們輔導了 **{{supplier_count}}** 家關鍵供應商進行碳盤查。
【OmniAgent 擴充區塊 D：請深度探討範疇三各類別 (特別是採購商品與服務、上下游運輸) 之計算方法學與供應商議合(Engagement)策略。】

## 第五節：碳權管理與技術前瞻 (目標字數：4000字)
[GRI 305-5] 
【OmniAgent 擴充區塊 E：請論述碳抵換(Carbon Offset)、自然碳匯(Nature-based Solutions)投資，及碳捕捉與封存(CCUS)之技術佈局。】

---
> 💡 專家提示：完整填寫後，利用「圖表加強」生成 SBTi 減碳路徑 Mermaid 圖表，以增加報告的視覺權威性。`,

  'social': `# 社會參與與員工照顧 (零算力專家模板 v2.0 - 2萬字深度架構)

## 第一節：勞工實務與人權盡職調查 (目標字數：4000字)
[GRI 401] 新進員工數 **{{new_hires}}** 人，離職率 **{{turnover_rate}}**%。
【OmniAgent 擴充區塊 A：詳述人權政策宣告、基於 UNGP 之人權盡職調查(HRDD)流程與救濟機制。】

## 第二節：職業安全與衛生管理體系 (目標字數：4000字)
[GRI 403] 總工時內 TRIR 降至 **{{trir_rate}}**，安全培訓達 **{{safety_training_hours}}** 小時。
【OmniAgent 擴充區塊 B：分析 ISO 45001 管理系統運作、承攬商安全管理與心理健康(EAP)支持計畫。】

## 第三節：人才發展與未來技能賦能 (目標字數：4000字)
[GRI 404] 
【OmniAgent 擴充區塊 C：闡述應對 AI 轉型之員工技能重塑(Reskilling/Upskilling)計畫及高潛力人才(Hi-Po)培訓地圖。】

## 第四節：多元、平等與包容 (DEI) 文化 (目標字數：4000字)
[GRI 405] 
【OmniAgent 擴充區塊 D：深入報導職場平權倡議、弱勢群體就業保障，以及跨世代溝通機制的建立。】

## 第五節：地方創生與社區共榮 (目標字數：4000字)
[GRI 413] 投入新台幣 **{{community_investment}}** 萬元於 **{{community_projects}}** 等專案。
【OmniAgent 擴充區塊 E：採用 LBG (London Benchmarking Group) 模型或 SROI 評估社區投資之實質社會影響力。】`,

  'governance': `# 企業治理與誠信經營 (零算力專家模板 v2.0 - 2萬字深度架構)

## 第一節：反貪腐與商業倫理 (目標字數：4000字)
[GRI 205] 反貪腐培訓比例達 **{{anti_corruption_training_ratio}}**%。
【OmniAgent 擴充區塊 A：探討吹哨者保護機制的運作、跨國營運之反洗錢與反貪腐法規遵循。】

## 第二節：資訊安全與隱私防護 (目標字數：4000字)
[GRI 418] 資料外洩事件目標為 **{{data_breach_count}}** 件。
【OmniAgent 擴充區塊 B：分析 ISO 27001 實作、零信任架構(Zero Trust)佈署及歐盟 GDPR 合規狀態。】

## 第三節：稅務治理與經濟貢獻 (目標字數：4000字)
[GRI 207] 
【OmniAgent 擴充區塊 C：說明全球稅務政策、移轉訂價風險管理及對當地政府的經濟價值分配。】

## 第四節：公共政策參與與遊說 (目標字數：4000字)
[GRI 415] 
【OmniAgent 擴充區塊 D：揭露參與之產業公協會、公共政策倡議立場及政治獻金(若有)之管控機制。】

## 第五節：智慧財產權與創新治理 (目標字數：4000字)
【OmniAgent 擴充區塊 E：敘述研發創新專利佈局、營業秘密保護及開放式創新(Open Innovation)之治理框架。】`,

  'supply_chain': `# 永續供應鏈管理 (零算力專家模板 v2.0 - 2萬字深度架構)

## 第一節：供應商 ESG 行為準則與篩選 (目標字數：4000字)
[GRI 308, 414] **{{new_suppliers_screened}}**% 新供應商通過標準，執行 **{{supplier_audits}}** 次稽核。
【OmniAgent 擴充區塊 A：詳述供應商行為準則(CoC)條款、新供應商 ESG 評估流程與風險分級機制。】

## 第二節：在地採購與供應鏈韌性 (目標字數：4000字)
[GRI 204] 在地採購比例 **{{local_procurement_ratio}}**%，金額 **{{local_procurement_amount}}** 億元。
【OmniAgent 擴充區塊 B：分析地緣政治風險下的短鏈佈局、關鍵原物料備援策略及供應鏈中斷演練。】

## 第三節：衝突礦產與責任採購 (目標字數：4000字)
【OmniAgent 擴充區塊 C：深入探討 RMI (負責任礦產倡議) 遵循情況、冶煉廠盡職調查及不當勞動之防範。】

## 第四節：供應商議合與能力建構 (目標字數：4000字)
【OmniAgent 擴充區塊 D：敘述供應商 ESG 培訓大會、碳盤查輔導資源挹注及綠色創新聯合開發專案。】

## 第五節：循環供應鏈與綠色物流 (目標字數：4000字)
【OmniAgent 擴充區塊 E：探討包材減量與回收計畫、低碳運輸(電動車隊/最佳化路徑)之實施績效。】`,

  'water_waste': `# 水資源與廢棄物管理 (零算力專家模板 v2.0 - 2萬字深度架構)

## 第一節：水資源風險評估與管理政策 (目標字數：4000字)
[GRI 303] 總取水量 **{{total_water_withdrawal}}** 兆公升，回收率 **{{water_recycle_rate}}**%。
【OmniAgent 擴充區塊 A：運用 WRI Aqueduct 進行水壓迫(Water Stress)分析，制定乾旱應變與水源多樣化計畫。】

## 第二節：製程水回收與廢水排放管控 (目標字數：4000字)
【OmniAgent 擴充區塊 B：詳述零排放(ZLD)技術佈局、廢水處理廠效能升級及放流水水質嚴格監測機制。】

## 第三節：廢棄物生命週期管理 (目標字數：4000字)
[GRI 306] 廢棄物產生量 **{{total_waste}}** 噸，資源回收率 **{{waste_recycle_rate}}**%，掩埋率 **{{landfill_rate}}**%。
【OmniAgent 擴充區塊 C：分析廢棄物產生熱點，推行源頭減量(Reduce)與生產工藝改善之實際成效。】

## 第四節：循環經濟模式與再生材料 (目標字數：4000字)
【OmniAgent 擴充區塊 D：探討產品設計導入可拆解/可回收原則、使用回收塑料/金屬之比例及閉環(Closed-loop)供應鏈。】

## 第五節：有害化學物質管理與替代 (目標字數：4000字)
【OmniAgent 擴充區塊 E：說明符合 RoHS/REACH 等國際法規之限用物質管理清單，及綠色化學替代方案之研發進度。】`
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
