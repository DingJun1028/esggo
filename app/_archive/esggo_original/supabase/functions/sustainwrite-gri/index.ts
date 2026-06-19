import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GRI_PROMPTS: Record<string, (data: Record<string, unknown>) => string> = {
  "gri-2-organization": (d) => `
你是一位 GRI 2021 永續報告專家。請根據以下企業資料，撰寫「GRI 2-1 組織基本資料」章節。

企業資料：${JSON.stringify(d.profile || {})}
ESG 指標：${JSON.stringify((d.esg_data as unknown[] || []).slice(0, 10))}

請撰寫 300-500 字，包含：組織概述、主要業務、報告範疇、治理架構。
語氣須正式、客觀，並符合 GRI 2021 揭露要求。以繁體中文撰寫。
  `,
  "gri-305-emissions": (d) => `
你是一位 GRI 2021 永續報告專家。請根據以下數據，撰寫「GRI 305: 排放」章節。

溫室氣體數據：${JSON.stringify((d.esg_data as unknown[] || []).filter((m: unknown) => {
    const metric = m as Record<string, unknown>;
    const name = (metric.metric_name || '') as string;
    return name.includes('排放') || name.includes('GHG') || name.includes('範疇');
  }))}
路線圖里程碑：${JSON.stringify((d.milestones as unknown[] || []).slice(0, 5))}

請包含：
1. 範疇一（直接排放）
2. 範疇二（能源間接排放）
3. 減碳目標與行動
4. 第三方查驗聲明

以繁體中文撰寫，約 400-600 字。
  `,
  "gri-302-energy": (d) => `
你是 GRI 2021 能源管理專家。請撰寫「GRI 302: 能源」章節。

能源數據：${JSON.stringify((d.esg_data as unknown[] || []).filter((m: unknown) => {
    const metric = m as Record<string, unknown>;
    const name = (metric.metric_name || '') as string;
    return name.includes('電') || name.includes('能源') || name.includes('Energy');
  }))}

請包含：用電量、再生能源比例、節能措施、趨勢分析。以繁體中文撰寫，約 300-450 字。
  `,
  "gri-401-employment": (d) => `
你是 GRI 2021 社會議題專家。請撰寫「GRI 401: 勞雇關係」章節。

社會指標：${JSON.stringify((d.social as unknown[] || []).slice(0, 10))}

請包含：員工結構、新聘與離職率、多元化指標、員工福利。以繁體中文撰寫，約 350-500 字。
  `,
  "gri-403-ohs": (d) => `
你是 GRI 2021 職安衛專家。請撰寫「GRI 403: 職業健康與安全」章節。

安全指標：${JSON.stringify((d.social as unknown[] || []).filter((m: unknown) => {
    const metric = m as Record<string, unknown>;
    const name = (metric.metric_name || '') as string;
    return name.includes('安全') || name.includes('傷害') || name.includes('FR');
  }))}

請包含：傷害頻率、管理體系 (ISO 45001)、改善措施。以繁體中文撰寫，約 300-400 字。
  `,
  "gri-2-governance": (d) => `
你是 GRI 2021 公司治理專家。請撰寫「GRI 2-9~2-21: 治理架構」章節。

治理指標：${JSON.stringify((d.governance as unknown[] || []).slice(0, 10))}

請包含：董事會組成、獨立性、性別多元、永續委員會、反貪腐措施。以繁體中文撰寫，約 400-550 字。
  `,
  "gri-205-anti-corruption": (d) => `
你是 GRI 2021 商業道德專家。請撰寫「GRI 205: 反貪腐」章節。

道德指標：${JSON.stringify((d.governance as unknown[] || []).filter((m: unknown) => {
    const metric = m as Record<string, unknown>;
    const name = (metric.metric_name || '') as string;
    return name.includes('貪') || name.includes('道德') || name.includes('法規');
  }))}

請包含：政策聲明、培訓覆蓋率、事件數量、申訴機制。以繁體中文撰寫，約 300-400 字。
  `,
  "gri-3-materiality": (d) => `
你是 GRI 2021 重大性評估專家。請撰寫「GRI 3: 重大議題」章節。

路線圖目標：${JSON.stringify((d.milestones as unknown[] || []).slice(0, 8))}
ESG 概覽：${JSON.stringify((d.esg_data as unknown[] || []).slice(0, 5))}

請包含：重大性評估流程、利害關係人鑑別、重大議題清單、管理方針。以繁體中文撰寫，約 400-600 字。
  `,
};

async function generateContent(sectionKey: string, data: Record<string, unknown>): Promise<string> {
  const promptFn = GRI_PROMPTS[sectionKey];
  if (!promptFn) {
    return `## ${sectionKey}\n\n此章節尚待撰寫。請根據 GRI 2021 準則進行揭露。`;
  }

  const geminiKey = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("NEXT_PUBLIC_GEMINI_API_KEY");

  if (!geminiKey) {
    // 模擬回應（開發用）
    await new Promise((r) => setTimeout(r, 800));
    const templates: Record<string, string> = {
      "gri-2-organization": "## GRI 2-1 組織基本資料\n\n善向科技股份有限公司（以下簡稱「本公司」）成立於 2018 年，總部位於台北市信義區。我們致力於提供創新的 ESG 數位治理解決方案，協助台灣中小企業實現可持續發展目標。\n\n本公司主要業務涵蓋永續數據管理平台、ESG 顧問諮詢服務，以及基於零知識證明（ZKP）技術的數位確信服務。目前服務超過 200 家企業客戶，遍布科技、製造、金融等產業。\n\n本報告書依據 GRI 2021 準則編制，報告範疇涵蓋台灣地區所有營運據點，報告期間為 2024 年 1 月 1 日至 12 月 31 日。所有重要性數據均已通過 5T 誠信協議驗證，確保資訊的可溯源性與不可篡改性。",
      "gri-305-emissions": "## GRI 305 排放揭露\n\n### 一、溫室氣體盤查聲明\n\n本公司依據 ISO 14064-1:2018 標準完成年度溫室氣體盤查，基準年設定為 2021 年。\n\n**範疇一（直接排放）**：本年度直接溫室氣體排放量為 1,250 公噸 CO₂e，主要來源包含公務車輛燃油消耗（85%）及冷媒逸散（15%）。\n\n**範疇二（能源間接排放）**：本年度購買電力所產生之間接排放量為 940 公噸 CO₂e，採用台灣電力公司公布之排放係數（0.494 kgCO₂e/kWh）進行計算。\n\n### 二、減碳目標與行動\n\n本公司已加入 SBTi 1.5°C 減碳倡議，承諾於 2030 年較基準年減少 46% 的範疇一及範疇二排放量。主要減碳行動包括：導入再生能源、汰換高效節能設備、推動員工綠色通勤。\n\n所有排放數據均已取得第三方查驗機構 SGS 出具之查驗聲明書。",
      "gri-302-energy": "## GRI 302 能源揭露\n\n### 一、能源消耗概況\n\n本年度本公司總能源消耗量為 4,820,000 kWh，與去年同期相比下降約 8.3%。\n\n**電力消耗**：4,820,000 kWh（佔總能耗 100%）\n**再生能源比例**：38%（其中 T-REC 綠電憑證佔 22%，屋頂太陽能佔 16%）\n\n### 二、節能措施\n\n本年度實施 LED 照明全面升級，更新老舊空調系統為高效節能型號，並導入智慧能源管理系統（EMS）進行即時監控。上述措施預估每年節省 350,000 kWh 電力，相當於減少約 173 公噸 CO₂e 排放。\n\n### 三、再生能源目標\n\n2026 年目標達成 50% 再生能源使用比例，2030 年達成 100% 再生電力目標。",
    };
    return templates[sectionKey] || `## ${sectionKey.replace(/-/g, " ").toUpperCase()}\n\n本章節依據 GRI 2021 準則進行揭露。相關數據及說明如下：\n\n本組織致力於提升永續治理水準，並確保所有揭露資訊符合可比較性、完整性及準確性原則。各項指標均已通過內部審查，並可依要求提供相應佐證文件。`;
  }

  // 真實 Gemini API 呼叫
  const prompt = promptFn(data);
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );
  const json = await resp.json();
  return json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "生成失敗，請稍後重試。";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { projectId = "default", companyId = "default", sectionKey, sections } = body;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 抽取各模組現有數據作為生成上下文
    const [esgRes, socialRes, govRes, milestonesRes, profileRes] = await Promise.all([
      supabase.from("esg_data").select("*").eq("company_id", companyId).limit(30),
      supabase.from("social_metrics").select("*").eq("company_id", companyId).limit(20),
      supabase.from("governance_metrics").select("*").eq("company_id", companyId).limit(20),
      supabase.from("roadmap_milestones").select("*").eq("company_id", companyId).limit(15),
      supabase.from("company_profiles").select("*").eq("id", companyId).single(),
    ]);

    const contextData = {
      esg_data: esgRes.data ?? [],
      social: socialRes.data ?? [],
      governance: govRes.data ?? [],
      milestones: milestonesRes.data ?? [],
      profile: profileRes.data ?? {},
    };

    const targetSections: string[] = sections ?? [sectionKey].filter(Boolean);
    if (!targetSections.length) throw new Error("sectionKey or sections required");

    const results: Record<string, unknown>[] = [];

    for (const key of targetSections) {
      const content = await generateContent(key, contextData);
      const timestamp = new Date().toISOString();

      // SHA-256 hash
      const enc = new TextEncoder();
      const buf = await crypto.subtle.digest("SHA-256", enc.encode(content + projectId + timestamp));
      const hashValue = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");

      const { data: saved, error } = await supabase
        .from("sustainwrite_sections")
        .upsert({
          project_id: projectId,
          company_id: companyId,
          section_key: key,
          content_md: content,
          input_snapshot: contextData,
          hash_value: hashValue,
          status: "draft",
          version: "v1.0.0",
          updated_at: timestamp,
        }, { onConflict: "project_id,section_key" })
        .select()
        .single();

      if (error) throw error;
      results.push(saved);
    }

    return new Response(JSON.stringify({ success: true, sections: results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const error = err as Error;
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});