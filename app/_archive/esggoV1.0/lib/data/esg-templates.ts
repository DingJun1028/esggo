/**
 * ESG GO - Writing Templates Registry
 * Based on GRI (Global Reporting Initiative) Standards 2021/2023
 */

export interface EsgTemplate {
    id: string;
    name: string;
    description: string;
    content: string;
}

export const ESG_TEMPLATES: Record<string, EsgTemplate[]> = {
    // Statement from senior decision-maker (GRI 2-22)
    "2-22": [
        {
            id: "pro-ceo",
            name: "專業願景型",
            description: "展現高層對永續發展的高度承諾與長期戰略眼光。",
            content: `### 經營者聲明：引領永續轉型，共創韌性未來

在瞬息萬變的全球環境中，[公司名稱] 始終將永續發展視為企業核心競爭力的基石。2025年，面對極端氣候與地緣政治帶來的韌性挑戰，本公司不僅在經濟表現上展現了深厚根基，更在環境保護 (E)、社會責任 (S) 及公司治理 (G) 各維度取得了長足進步。

**核心承諾：**
我們嚴格對標 TCFD 框架，並將淨零排放定為本公司 2050 年的終極目標。我們深信，透明且數據導向的揭露是建立利害關係人信任的唯一路徑。本年度報告採用了 5T 協議進行數據存證，確保每一筆數據皆具備可追溯性。

[執行長/董事長 簽名]
[日期]`
        },
        {
            id: "concise-ceo",
            name: "簡潔實務型",
            description: "重點式陳述，側重於當年度的具體達成指標與數據點。",
            content: `### 經營者聲明：以實效驅動永續轉型

[公司名稱] 向來重視永續實務。2025 年，我們專注於能源結構轉型與人才多元化佈局。

**關鍵績效回顧：**
1. **環境面**：Scope 1 & 2 排放量較去年降低 [X]%，再生能源使用率達到 [Y]%。
2. **社會面**：員工教育訓練時數平均增加 [Z] 小時，離職率降至 [A]%。
3. **治理面**：董事會獨立董事比例提升至 [B]%。

我們將持續精進，轉化永續指標為實質的社會價值。

[執行長 姓名]`
        },
        {
            id: "data-ceo",
            name: "數據驅動型",
            description: "適合需要大量引用標竿與具體科學目標 (SBTi) 的報告風格。",
            content: `### 2025 永續績效專案報告

本聲明旨在對標 GRI 2-22 指標，系統性回顧 [公司名稱] 之永續治理績效。

**治理架構與戰略連結：**
本公司之永續發展委員會（ESG Committee）直接隸屬於董事會，確保每一項 ESG 指標均能與財務 KPI 同步追蹤。
- **SBTi 承諾**：本公司已正式提交減碳近程目標，目標於 2030 年達成減碳 [X]%。
- **透明度標準**：本次報告書經數位安全簽章與 5T 協議封裝，確保數據完整性。

我們承諾，透明揭露將是本公司營運的常態。`
        }
    ],

    // Emissions (GRI 305)
    "305": [
        {
            id: "pro-emissons",
            name: "專業核證型",
            description: "符合 ISO 14064 規範要求的標準排放描述。",
            content: `### 氣候變遷管理與溫室氣體揭露

[公司名稱] 視氣候變遷為重大財務風險與機遇。我們依循 GRI 305 及 ISO 14064-1 進行溫室氣體盤查。

**排放實績分析：**
- **直接排放 (Scope 1)**：主要源於 [設施/設備名稱]，總計 [X] tCO2e。
- **能源間接排放 (Scope 2)**：主要受電力使用影響，總計 [Y] tCO2e。
- **碳密集度**：每單位營收之碳排放量較去年下降 [Z]%。

本數據經由第三方確信與 ZKP 存證連動，確保揭露準確度。`
        },
        {
            id: "concise-emissions",
            name: "減碳路徑型",
            description: "側重於減碳行動方案與目標進度。",
            content: `### 邁向淨零：本年度減碳成果

2025 年，[公司名稱] 成功削減了 [X]% 的碳足跡。

**關鍵行動：**
1. 汰換老舊空調設備，節電量達 [Y] 度。
2. 導入再生能源憑證，抵銷 Scope 2 排放達 [Z]%。
3. 啟動供應鏈 Scope 3 盤查專案。

我們將持續往 2050 淨零目標邁進。`
        },
        {
            id: "data-emissions",
            name: "高解析數據型",
            description: "包含細分項目數據，如特定排放源與移動熱點分析。",
            content: `### 溫室氣體數據詳報

本章節提供基於 5T 協議同步之即時排放數據：

1. **移動源排放**：公務車輛使用衍生之原油消耗與 CO2 釋放。
2. **逸散源排放**：冷媒充填等不可控排放。
3. **外購電力分析**：對標電力公司之排放係數 [係數值]。

| 指標名稱 | 2024 (tCO2e) | 2025 (tCO2e) | 增減率 |
| :--- | :--- | :--- | :--- |
| Scope 1 | [X] | [Y] | [Z]% |
| Scope 2 | [A] | [B] | [C]% |`
        }
    ]
};

/**
 * Get templates for a given chapter ID. 
 * Falls back to a general template if not found.
 */
export const getTemplatesForChapter = (chapterId: string): EsgTemplate[] => {
    // Normalize ID (e.g., "1-01" or "305-1" -> "2-22" fallback logic)
    let key = chapterId;
    if (chapterId.includes("1.01") || chapterId.includes("1-01")) key = "2-22";
    if (chapterId.includes("305")) key = "305";

    return ESG_TEMPLATES[key] || [
        {
            id: "gen-pro",
            name: "專業標準型",
            description: "通用型的 ESG 專業敘述，適用於大多數重大議題。",
            content: "### [章節標題]\n\n[公司名稱] 致力於確保業務營運與國際永續標準接軌。本章節描述我們在 [議題名稱] 方面的管理方針與實施績效。\n\n**管理目標：**\n...\n\n**具體績效：**\n..."
        },
        {
            id: "gen-concise",
            name: "簡潔概略型",
            description: "快速概述，適合非核心重大議題。",
            content: "### [章節標題] 簡報\n\n本公司持續關注 [議題名稱]，並已建立相關內部指引。2025 年度相關數據保持穩定，未發生重大違規事件。"
        },
        {
            id: "gen-data",
            name: "數據索引型",
            description: "以表格與數據導向，適合需要精確勾稽的章節。",
            content: "### [章節標題] 數據彙整\n\n對標 GRI 指標，本年度 [議題項目] 達成率為 [X]%。\n\n- 指標 1: [數字]\n- 指標 2: [數字]\n- 第三方確信: 是"
        }
    ];
};
