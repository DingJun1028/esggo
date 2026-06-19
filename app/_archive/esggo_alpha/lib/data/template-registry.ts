/**
 * ESG GO — Template Registry
 * Static, pre-authored section definitions for each ESG reporting standard.
 *
 * Design principle: ALL guidance content is pre-written locally.
 * NO AI calls are made when a template is applied.
 * AI is only invoked when the user explicitly requests "AI CoWrite" on a section.
 */

export interface GuidanceMeta {
    what: string;       // 做什麼：具體揭露要求
    why: string;        // 為什麼：解釋該項目的重要性與利害關係人關注點
    soWhat: string;     // 如何做：提供建議的撰寫路徑與邏輯
    benchmark?: string; // 標竿案例：行業領先者的最佳實踐
}

export interface TemplateSection {
    id: string;
    type: string;        // Category for display (e.g., "GRI 揭露", "指標")
    title: string;
    titleEn: string;
    chapter: string;
    chapterEn: string;
    guidanceZh: string;   // Pre-written guidance — displayed in editor as initial content
    guidanceEn: string;
    requiredData?: string[]; // Hints for data source linking / Document IDs
    documentIds?: string[];   // Specific document IDs assigned to this section
    guidanceMeta?: GuidanceMeta; // Detailed 3-part guidance + benchmark
}

export interface TemplateDefinition {
    id: string;
    name: string;
    nameEn: string;
    standard: string;
    description: string;
    descriptionEn: string;
    segments: number;
    sections: TemplateSection[];
}

// ─────────────────────────────────────────────────────────────
// GRI 2025
// ─────────────────────────────────────────────────────────────
const GRI_2025_SECTIONS: TemplateSection[] = [
    { id: "1.1", type: "一般揭露", title: "報告範疇與期間", titleEn: "Report Scope & Period", chapter: "第一章：概覽", chapterEn: "Chapter 1: Overview", guidanceZh: "請說明本報告涵蓋之時間範圍（如 2024年1月1日至2024年12月31日）及地理範疇。", guidanceEn: "State the reporting period and geographic scope of this sustainability report.", requiredData: ["company_profile", "report_year"] },
    {
        id: "1.2",
        type: "一般揭露",
        title: "組織概況",
        titleEn: "Organizational Profile",
        chapter: "第一章：概覽",
        chapterEn: "Chapter 1: Overview",
        guidanceZh: "依 GRI 2-1 至 2-6 揭露組織名稱、所有制形式、主要活動、員工規模及供應鏈概況。",
        guidanceEn: "Disclose per GRI 2-1 to 2-6: name, nature of ownership, activities, workforce size, supply chain overview.",
        requiredData: ["employee_count", "revenue", "supply_chain"],
        guidanceMeta: {
            what: "依據 GRI 2-1 至 2-6 的要求，完整說明公司的法律登記名稱、總部位置、營運地理分布、商業模式與供應鏈特性。",
            why: "本章節是報告的基石，讓讀者了解組織的規模與運作背景，是評估所有後續 ESG 績效的上下文。",
            soWhat: "撰寫建議：不應只是羅列數據。應強調公司的核心價值觀如何體現在組織結構中，並對供應鏈的廣度與深度有初步描述。",
            benchmark: "標竿案例：台積電 (TSMC) 的組織概況不僅提供數據，更以圖表清楚呈現全球營運據點與價值鏈上下游關係，值得參考。"
        }
    },
    {
        id: "1.3",
        type: "一般揭露",
        title: "利害關係人參與",
        titleEn: "Stakeholder Engagement",
        chapter: "第一章：概覽",
        chapterEn: "Chapter 1: Overview",
        guidanceZh: "說明貴公司如何識別、分類及與利害關係人溝通（GRI 2-29），包含鑑別方式與 2024 年度主要議合活動。",
        guidanceEn: "Describe how stakeholders are identified, categorized, and engaged (GRI 2-29).",
        requiredData: ["stakeholder_survey"],
        guidanceMeta: {
            what: "依據 GRI 2-29 的要求，說明組織如何識別其利害關係人，並描述在報告期間內與其議合的過程。",
            why: "利害關係人是評估重大主題的關鍵來源，良好的議合說明能展現組織的透明度與當責性。",
            soWhat: "撰寫建議：應具體列出溝通頻率與溝通渠道。如果 2024 年有針對特定議題（如氣候或人權）進行問卷或座談，請在此強調。",
            benchmark: "標竿案例：許多領先企業會以表格形式呈現利害關係人類別、關注議題與公司的回應方式，建議參考此種佈局。"
        }
    },
    { id: "1.4", type: "一般揭露", title: "重大主題鑑別", titleEn: "Material Topics", chapter: "第一章：概覽", chapterEn: "Chapter 1: Overview", guidanceZh: "依 GRI 3-1 至 3-3 說明重大性評估流程、確定之重大主題及其邊界。", guidanceEn: "Explain the material topics identification process (GRI 3-1 to 3-3) and resulting topics.", requiredData: ["materiality_matrix"] },
    { id: "2.1", type: "治理指標", title: "治理結構", titleEn: "Governance Structure", chapter: "第二章：治理", chapterEn: "Chapter 2: Governance", guidanceZh: "描述最高治理機構之組成（GRI 2-9），包含獨立董事比例、委員會設置及永續相關職責。", guidanceEn: "Describe the highest governance body (GRI 2-9) including board independence and sustainability roles.", requiredData: ["board_composition"] },
    { id: "2.2", type: "治理指標", title: "倫理與誠信", titleEn: "Ethics & Integrity", chapter: "第二章：治理", chapterEn: "Chapter 2: Governance", guidanceZh: "揭露反貪腐政策（GRI 205-2）、舉報機制及 2024 年已確認違規事項。", guidanceEn: "Disclose anti-corruption policies (GRI 205-2), whistleblowing channels, and confirmed violations.", requiredData: ["compliance_incidents"] },
    { id: "2.3", type: "治理指標", title: "薪酬與績效連結", titleEn: "Remuneration & Performance", chapter: "第二章：治理", chapterEn: "Chapter 2: Governance", guidanceZh: "說明高階主管薪酬與 ESG 績效指標之連結機制（GRI 2-19 至 2-20）。", guidanceEn: "Explain how senior management remuneration links to ESG KPIs (GRI 2-19 to 2-20).", requiredData: ["executive_compensation"] },
    { id: "3.1", type: "環境指標", title: "氣候變遷政策", titleEn: "Climate Change Policy", chapter: "第三章：環境", chapterEn: "Chapter 3: Environment", guidanceZh: "說明貴公司對氣候變遷之承諾（含淨零目標年份）及減碳路徑。", guidanceEn: "State commitments including net-zero target year and decarbonization roadmap.", requiredData: ["ghg_emissions", "energy_data"] },
    { id: "3.2", type: "環境指標", title: "溫室氣體盤查 (Scope 1/2/3)", titleEn: "GHG Inventory", chapter: "第三章：環境", chapterEn: "Chapter 3: Environment", guidanceZh: "依 GRI 305 揭露 Scope 1、2、3 溫室氣體排放量（以 tCO₂e 計），說明計算邊界與基準年。", guidanceEn: "Disclose Scope 1, 2, and 3 GHG emissions in tCO₂e per GRI 305.", requiredData: ["scope1", "scope2", "scope3"] },
    { id: "3.3", type: "環境指標", title: "能源管理", titleEn: "Energy Management", chapter: "第三章：環境", chapterEn: "Chapter 3: Environment", guidanceZh: "依 GRI 302 揭露能源消耗總量（MWh）、再生能源比例及能源密集度。", guidanceEn: "Disclose total energy consumption (MWh), renewable energy ratio, and energy intensity per GRI 302.", requiredData: ["electricity_kwh", "renewable_ratio"] },
    { id: "3.4", type: "環境指標", title: "用水管理", titleEn: "Water Management", chapter: "第三章：環境", chapterEn: "Chapter 3: Environment", guidanceZh: "依 GRI 303 揭露取水總量、水源來源及缺水地區相關風險評估。", guidanceEn: "Disclose total water withdrawal, sources, and water-stress area risk assessment per GRI 303.", requiredData: ["water_withdrawal"] },
    { id: "3.5", type: "環境指標", title: "廢棄物管理", titleEn: "Waste Management", chapter: "第三章：環境", chapterEn: "Chapter 3: Environment", guidanceZh: "依 GRI 306 揭露廢棄物產生量（噸）、回收率及危險廢棄物處置方式。", guidanceEn: "Disclose waste generation, recycling rate, and hazardous waste disposal per GRI 306.", requiredData: ["waste_kg", "recycling_rate"] },
    { id: "4.1", type: "社會指標", title: "勞工關係與勞動條件", titleEn: "Labor Relations", chapter: "第四章：社會", chapterEn: "Chapter 4: Social", guidanceZh: "依 GRI 401 揭露雇用總數、新進/離職率及重大勞資爭議。", guidanceEn: "Disclose total employees, hire/turnover rates, and significant labor disputes per GRI 401.", requiredData: ["headcount", "turnover_rate"] },
    { id: "4.2", type: "社會指標", title: "員工職業健康安全", titleEn: "Occupational Health & Safety", chapter: "第四章：社會", chapterEn: "Chapter 4: Social", guidanceZh: "依 GRI 403 揭露職業傷害率（LTIR）、危害識別機制及 2024 年重大安全事件。", guidanceEn: "Disclose LTIR, hazard identification process, and significant safety incidents per GRI 403.", requiredData: ["safety_incidents", "ltir"] },
    { id: "4.3", type: "社會指標", title: "多元共融", titleEn: "Diversity & Inclusion", chapter: "第四章：社會", chapterEn: "Chapter 4: Social", guidanceZh: "依 GRI 405 揭露治理機構及員工之性別、年齡、族群多元性比例。", guidanceEn: "Disclose diversity ratios of governance body and workforce by gender, age, ethnicity per GRI 405.", requiredData: ["diversity_data"] },
    { id: "4.4", type: "社會指標", title: "人權盡職調查", titleEn: "Human Rights Due Diligence", chapter: "第四章：社會", chapterEn: "Chapter 4: Social", guidanceZh: "依 GRI 410-414 說明供應鏈人權風險評估機制及 2024 年識別之重大風險。", guidanceEn: "Describe supply chain human rights risk assessment and significant risks identified per GRI 410-414.", requiredData: ["supplier_audit"] },
    { id: "5.1", type: "治理指標", title: "反貪腐措施", titleEn: "Anti-Corruption", chapter: "第五章：影響力", chapterEn: "Chapter 5: Impacts", guidanceZh: "揭露 2024 年度反貪腐培訓覆蓋率（GRI 205-2）及已確認貪腐事件數。", guidanceEn: "Disclose anti-corruption training coverage and confirmed corruption incidents per GRI 205-2.", requiredData: ["training_completion"] },
    { id: "5.2", type: "社會指標", title: "社區影響", titleEn: "Community Impact", chapter: "第五章：影響力", chapterEn: "Chapter 5: Impacts", guidanceZh: "依 GRI 413 揭露本地社區參與評估及重大實際/潛在負面影響。", guidanceEn: "Disclose community engagement, assessments, and actual/potential negative impacts per GRI 413.", requiredData: ["community_investment"] },
];
// Generate remaining GRI sections to reach 32
const GRI_EXTRA: TemplateSection[] = [
    { id: "6.1", type: "治理指標", title: "稅務透明度", titleEn: "Tax Transparency", chapter: "第六章：附錄", chapterEn: "Chapter 6: Appendix", guidanceZh: "依 GRI 207 揭露稅務策略、治理及 2024 年稅務績效。", guidanceEn: "Disclose tax strategy, governance, and 2024 tax performance per GRI 207.", requiredData: ["tax_data"] },
    { id: "6.2", type: "社會指標", title: "供應商社會評估", titleEn: "Supplier Social Assessment", chapter: "第六章：附錄", chapterEn: "Chapter 6: Appendix", guidanceZh: "依 GRI 414 揭露 2024 年供應商社會影響評估比例及已辨識負面影響。", guidanceEn: "Disclose percentage of suppliers assessed for social impacts and negative impacts identified per GRI 414.", requiredData: ["supplier_data"] },
    { id: "6.3", type: "一般揭露", title: "GRI 索引對照表", titleEn: "GRI Content Index", chapter: "第六章：附錄", chapterEn: "Chapter 6: Appendix", guidanceZh: "請列出所有適用 GRI 準則之揭露項目、所在章節及省略說明。", guidanceEn: "List all applicable GRI disclosures, their locations in this report, and any omissions.", requiredData: [] },
    { id: "6.4", type: "一般揭露", title: "驗證聲明", titleEn: "Assurance Statement", chapter: "第六章：附錄", chapterEn: "Chapter 6: Appendix", guidanceZh: "附上外部確信機構出具之有限確信聲明（如適用）。", guidanceEn: "Attach the limited assurance statement issued by the external assurance provider (if applicable).", requiredData: ["assurance_report"] },
    ...Array.from({ length: 20 }, (_, k) => ({
        id: `7.${k + 1}`,
        type: "進階揭露",
        title: `補充與進階揭露 ${k + 1}`,
        titleEn: `Advanced Disclosure ${k + 1}`,
        chapter: "第七章：進階主題",
        chapterEn: "Chapter 7: Advanced Topics",
        guidanceZh: `請依據特定產業或地區性要求，提供第 ${k + 1} 項進階永續主題之具體指標與管理方針。`,
        guidanceEn: `Provide specific metrics and management approach for advanced sustainability topic ${k + 1}.`,
        requiredData: [],
    })),
];

// ─────────────────────────────────────────────────────────────
// TCFD 2025 (15 sections)
// ─────────────────────────────────────────────────────────────
const TCFD_SECTIONS: TemplateSection[] = [
    {
        id: "T1.1",
        type: "guidance",
        title: "治理架構：董事會監督",
        titleEn: "Governance: Board Oversight",
        chapter: "A. 治理",
        chapterEn: "A. Governance",
        guidanceZh: "說明董事會如何監督氣候相關風險與機遇，包含報告頻率與決策授權。",
        guidanceEn: "Describe the board's oversight of climate-related risks and opportunities, reporting frequency, and authority.",
        requiredData: ["board_minutes", "esg_committee"],
        documentIds: [],
        guidanceMeta: {
            what: "說明董事會對氣候相關議題的監督職責，包含監督流程、頻率，以及董事會如何考慮氣候議題於策略、風險管理及預算中。",
            why: "TCFD 非常強調『治理』。讓投資者了解氣候風險是否已進入董事會議事日程，是評估組織長期穩定性的關鍵。",
            soWhat: "撰寫建議：請列舉 2024 年董事會討論氣候議題的次數，以及是否設有專業的永續委員會協助董事會決策。",
            benchmark: "標竿案例：Microsoft 在其 TCFD 報告中明確羅列了董事會各委員會在環境永續方面的具體分工，展現了嚴謹的治理路徑。"
        }
    },
    { id: "T1.2", type: "guidance", title: "治理架構：管理層責任", titleEn: "Governance: Management Role", chapter: "A. 治理", chapterEn: "A. Governance", guidanceZh: "說明管理層在評估及管理氣候相關風險與機遇方面的角色，包含相關職位及匯報機制。", guidanceEn: "Describe management's role in assessing and managing climate-related risks and opportunities.", requiredData: ["management_roles"], documentIds: [] },
    { id: "T2.1", type: "guidance", title: "策略：識別之短中長期風險與機遇", titleEn: "Strategy: Identified Risks & Opportunities", chapter: "B. 策略", chapterEn: "B. Strategy", guidanceZh: "分短期（0-3年）、中期（3-10年）、長期（10年以上）列舉已識別之氣候相關風險（過渡與實體）及機遇。", guidanceEn: "Identify climate-related risks (transition and physical) and opportunities across short, medium, and long-term horizons.", requiredData: ["climate_risk_register"], documentIds: [] },
    { id: "T2.2", type: "guidance", title: "策略：氣候風險對組織之影響", titleEn: "Strategy: Impact on Organization", chapter: "B. 策略", chapterEn: "B. Strategy", guidanceZh: "描述氣候相關風險與機遇對業務模式、策略及財務規劃的實質影響。", guidanceEn: "Describe how climate-related risks and opportunities materially affect business, strategy, and financial planning.", requiredData: ["financial_exposure", "business_model"], documentIds: [] },
    { id: "T2.3", type: "guidance", title: "策略：情境分析（1.5°C / 4°C）", titleEn: "Strategy: Scenario Analysis", chapter: "B. 策略", chapterEn: "B. Strategy", guidanceZh: "說明至少兩種氣候情境（如 1.5°C 對齊情境及 4°C 基準情境）下之韌性評估結果。", guidanceEn: "Describe resilience analysis under at least two scenarios (e.g., 1.5°C aligned and 4°C baseline).", requiredData: ["scenario_results"], documentIds: [] },
    { id: "T3.1", type: "guidance", title: "風險管理：識別流程", titleEn: "Risk Mgmt: Identification Process", chapter: "C. 風險管理", chapterEn: "C. Risk Management", guidanceZh: "說明組織識別及評估氣候相關風險的流程，包含風險類型分類（實體/過渡）。", guidanceEn: "Describe processes for identifying and assessing climate-related risks, including type classification.", requiredData: ["risk_register"], documentIds: [] },
    { id: "T3.2", type: "guidance", title: "風險管理：管理流程", titleEn: "Risk Mgmt: Management Process", chapter: "C. 風險管理", chapterEn: "C. Risk Management", guidanceZh: "說明組織管理氣候相關風險的流程，包含控制措施、責任分工及回應計畫。", guidanceEn: "Describe processes for managing climate-related risks, including controls, ownership, and response plans.", requiredData: ["risk_controls"], documentIds: [] },
    { id: "T3.3", type: "guidance", title: "風險管理：整合至整體風險架構", titleEn: "Risk Mgmt: Integration", chapter: "C. 風險管理", chapterEn: "C. Risk Management", guidanceZh: "說明氣候相關風險識別及管理流程如何整合至組織整體風險管理架構。", guidanceEn: "Describe how climate risk processes are integrated into the overall enterprise risk management framework.", requiredData: ["erm_framework"], documentIds: [] },
    { id: "T4.1", type: "guidance", title: "指標：溫室氣體排放 (Scope 1/2/3)", titleEn: "Metrics: GHG Emissions", chapter: "D. 指標與目標", chapterEn: "D. Metrics & Targets", guidanceZh: "揭露 Scope 1、2、3 溫室氣體排放量（tCO₂e），並說明計算方法。", guidanceEn: "Disclose Scope 1, 2, and 3 GHG emissions in tCO₂e with methodology notes.", requiredData: ["scope1", "scope2", "scope3"], documentIds: [] },
    { id: "T4.2", type: "guidance", title: "指標：氣候相關財務指標", titleEn: "Metrics: Climate Finance Metrics", chapter: "D. 指標與目標", chapterEn: "D. Metrics & Targets", guidanceZh: "揭露管理氣候相關風險與機遇所使用之財務指標（如碳定價、資本支出、研發費用）。", guidanceEn: "Disclose financial metrics used to manage climate risks/opportunities (e.g., internal carbon price, capex, R&D).", requiredData: ["climate_capex", "carbon_price"], documentIds: [] },
    { id: "T4.3", type: "guidance", title: "目標：溫室氣體減量目標", titleEn: "Targets: GHG Reduction Targets", chapter: "D. 指標與目標", chapterEn: "D. Metrics & Targets", guidanceZh: "揭露組織核心氣候目標（如 SBTi 認證之 2030/2050 絕對減量目標），並說明 2024 年實際進度。", guidanceEn: "Disclose climate targets (e.g., SBTi 2030/2050 absolute reduction targets) and 2024 progress.", requiredData: ["ghg_targets", "sbti_status"], documentIds: [] },
    { id: "T4.4", type: "guidance", title: "目標：過渡計劃指標", titleEn: "Targets: Transition Plan KPIs", chapter: "D. 指標與目標", chapterEn: "D. Metrics & Targets", guidanceZh: "揭露支持氣候過渡計劃之關鍵績效指標（如再生能源比例、電動車採購比例）及進度。", guidanceEn: "Disclose KPIs supporting the climate transition plan (e.g., renewable ratio, EV fleet) and progress.", requiredData: ["energy_mix", "fleet_data"], documentIds: [] },
    { id: "T5.1", type: "guidance", title: "TCFD 一致性聲明", titleEn: "TCFD Conformance Statement", chapter: "E. 附錄", chapterEn: "E. Appendix", guidanceZh: "聲明本報告已遵循 TCFD 建議架構，並列示四大支柱各建議項目之對應章節。", guidanceEn: "State conformance with TCFD recommendations and provide a cross-reference table for all four pillars.", requiredData: [], documentIds: [] },
    { id: "T5.2", type: "guidance", title: "資料方法與假設說明", titleEn: "Data Methods & Assumptions", chapter: "E. 附錄", chapterEn: "E. Appendix", guidanceZh: "說明氣候財務計算所使用之方法（如全球增溫潛勢值 GWP）、數據品質及不確定性說明。", guidanceEn: "Document methods (e.g., GWP values), data quality, and uncertainty disclosures for climate calculations.", requiredData: ["calculation_methodology"], documentIds: [] },
    { id: "T5.3", type: "guidance", title: "外部確信聲明", titleEn: "Assurance Statement", chapter: "E. 附錄", chapterEn: "E. Appendix", guidanceZh: "附上第三方機構對 Scope 1/2 排放量之外部查核聲明（如適用）。", guidanceEn: "Attach the third-party verification statement for Scope 1/2 emissions (if applicable).", requiredData: ["assurance_report"], documentIds: [] },
];

// ─────────────────────────────────────────────────────────────
// SASB 2025 — Technology & Software Industry Default (18 sections)
// ─────────────────────────────────────────────────────────────
const SASB_SECTIONS: TemplateSection[] = [
    { id: "S1.1", type: "guidance", title: "組織概況與行業分類", titleEn: "Organization & Industry Classification", chapter: "第一章：概覽", chapterEn: "Chapter 1: Overview", guidanceZh: "說明本報告所適用之 SASB 行業準則（如技術與軟體業），並確認重大性議題矩陣。", guidanceEn: "Identify the applicable SASB industry standard and confirm material topics from the materiality matrix.", requiredData: ["industry_code"], documentIds: [] },
    { id: "S1.2", type: "guidance", title: "活動方式與商業模式", titleEn: "Activity & Business Model", chapter: "第一章：概覽", chapterEn: "Chapter 1: Overview", guidanceZh: "以 SASB 要求格式簡述主要業務活動、收入來源及 2024 年度規模。", guidanceEn: "Describe primary business activities, revenue streams, and 2024 scale per SASB format.", requiredData: ["revenue", "product_lines"], documentIds: [] },
    { id: "S2.1", type: "guidance", title: "環境足跡：能源管理", titleEn: "Environmental: Energy Management", chapter: "第二章：環境", chapterEn: "Chapter 2: Environment", guidanceZh: "揭露 TC-SI-130a.1：總耗電量（MWh）及再生能源比例。", guidanceEn: "Disclose TC-SI-130a.1: Total energy consumed (MWh) and percentage from renewables.", requiredData: ["electricity_kwh", "renewable_ratio"], documentIds: [] },
    { id: "S2.2", type: "guidance", title: "環境足跡：溫室氣體排放", titleEn: "Environmental: GHG Emissions", chapter: "第二章：環境", chapterEn: "Chapter 2: Environment", guidanceZh: "揭露 TC-SI-110a.1：Scope 1 及 Scope 2 溫室氣體排放量（tCO₂e）。", guidanceEn: "Disclose TC-SI-110a.1: Scope 1 and Scope 2 GHG emissions in tCO₂e.", requiredData: ["scope1", "scope2"], documentIds: [] },
    { id: "S3.1", type: "guidance", title: "數據安全", titleEn: "Data Security", chapter: "第三章：社會", chapterEn: "Chapter 3: Social", guidanceZh: "依 TC-SI-230a.1 揭露 2024 年資料外洩事件數及受影響個人數量；說明資安治理架構。", guidanceEn: "Disclose TC-SI-230a.1: data breaches, records exposed, and cybersecurity governance framework.", requiredData: ["security_incidents", "breach_records"], documentIds: [] },
    { id: "S3.2", type: "guidance", title: "隱私保護", titleEn: "Privacy Protection", chapter: "第三章：社會", chapterEn: "Chapter 3: Social", guidanceZh: "說明使用者資料保護政策、同意框架及 2024 年監管機構調查或罰款（如有）。", guidanceEn: "Describe data protection policies, consent frameworks, and regulatory actions or fines in 2024.", requiredData: ["privacy_policy", "gdpr_status"], documentIds: [] },
    { id: "S3.3", type: "guidance", title: "員工多元共融", titleEn: "Workforce Diversity & Inclusion", chapter: "第三章：社會", chapterEn: "Chapter 3: Social", guidanceZh: "依 TC-SI-330a.1 揭露員工性別及種族/族裔構成，含管理層與技術職位細分。", guidanceEn: "Disclose TC-SI-330a.1: employee demographics by gender and race/ethnicity, including management and technical roles.", requiredData: ["diversity_data"], documentIds: [] },
    { id: "S3.4", type: "guidance", title: "員工招募與留才", titleEn: "Recruiting & Talent Retention", chapter: "第三章：社會", chapterEn: "Chapter 3: Social", guidanceZh: "說明人才吸引、發展及留才策略，揭露員工流動率及滿意度指標。", guidanceEn: "Describe talent attraction, development, and retention strategies; disclose turnover and satisfaction metrics.", requiredData: ["turnover_rate", "engagement_score"], documentIds: [] },
    { id: "S4.1", type: "guidance", title: "產品設計與生命週期管理", titleEn: "Product Design & Lifecycle", chapter: "第四章：產品影響", chapterEn: "Chapter 4: Product Impact", guidanceZh: "依 TC-SI-410a.1 說明已開發或採用影響環境或社會之產品設計特性（如可及性設計、安全功能）。", guidanceEn: "Disclose TC-SI-410a.1: product design features addressing environmental or social dimensions.", requiredData: ["product_features", "accessibility"], documentIds: [] },
    { id: "S4.2", type: "guidance", title: "負責任的 AI 使用", titleEn: "Responsible AI Use", chapter: "第四章：產品影響", chapterEn: "Chapter 4: Product Impact", guidanceZh: "說明 AI 倫理政策、演算法偏差測試機制及 2024 年重大 AI 相關事件（如有）。", guidanceEn: "Describe AI ethics policies, algorithmic bias testing, and significant AI incidents in 2024.", requiredData: ["ai_policy", "bias_testing"], documentIds: [] },
    { id: "S5.1", type: "guidance", title: "治理結構", titleEn: "Governance Structure", chapter: "第五章：治理", chapterEn: "Chapter 5: Governance", guidanceZh: "說明董事會組成、技術 / 網路安全專業背景及監督 ESG 事務之機制。", guidanceEn: "Describe board composition, technical/cybersecurity expertise, and ESG oversight mechanisms.", requiredData: ["board_skills"], documentIds: [] },
    { id: "S5.2", type: "guidance", title: "法規合規與法律爭議", titleEn: "Regulatory Compliance & Legal Disputes", chapter: "第五章：治理", chapterEn: "Chapter 5: Governance", guidanceZh: "揭露 2024 年度違規記錄、主要訴訟及監管調查情況。", guidanceEn: "Disclose compliance violations, major litigation, and regulatory investigations in 2024.", requiredData: ["compliance_incidents"], documentIds: [] },
    { id: "S5.3", type: "guidance", title: "供應商管理", titleEn: "Supply Chain Management", chapter: "第五章：治理", chapterEn: "Chapter 5: Governance", guidanceZh: "說明資通訊設備供應鏈風險評估機制，及對高衝突礦產（如 3TG）之盡職調查。", guidanceEn: "Describe ICT supply chain risk assessment and conflict minerals (3TG) due diligence.", requiredData: ["supplier_audit", "conflict_minerals"], documentIds: [] },
    { id: "S6.1", type: "guidance", title: "技術創新與智慧財產", titleEn: "Innovation & IP", chapter: "第六章：附錄", chapterEn: "Chapter 6: Appendix", guidanceZh: "說明研發投入（佔營收比）及重要專利或智慧財產資產。", guidanceEn: "Disclose R&D investment as % of revenue and significant patent or IP assets.", requiredData: ["rd_expense", "patent_count"], documentIds: [] },
    { id: "S6.2", type: "guidance", title: "SASB 技術指標彙總表", titleEn: "SASB Tech Metrics Summary", chapter: "第六章：附錄", chapterEn: "Chapter 6: Appendix", guidanceZh: "列出本行業所有 SASB 量化指標及本報告之揭露頁碼對照。", guidanceEn: "List all SASB quantitative metrics for this industry with cross-reference to this report's disclosure pages.", requiredData: [], documentIds: [] },
    { id: "S6.3", type: "guidance", title: "外部驗證聲明", titleEn: "Assurance Statement", chapter: "第六章：附錄", chapterEn: "Chapter 6: Appendix", guidanceZh: "附上外部查核聲明（如適用）。", guidanceEn: "Attach the external assurance/verification statement (if applicable).", requiredData: ["assurance_report"], documentIds: [] },
    { id: "S6.4", type: "guidance", title: "SASB 一致性聲明", titleEn: "SASB Conformance Statement", chapter: "第六章：附錄", chapterEn: "Chapter 6: Appendix", guidanceZh: "確認本報告已參照 SASB 技術與軟體行業準則撰寫，並聲明任何省略項目及原因。", guidanceEn: "Confirm this report references the SASB Technology & Software standard and state any omissions.", requiredData: [], documentIds: [] },
    { id: "S6.5", type: "guidance", title: "GRI/SASB 雙框架對照", titleEn: "GRI/SASB Cross-Reference", chapter: "第六章：附錄", chapterEn: "Chapter 6: Appendix", guidanceZh: "提供 GRI 通用準則與 SASB 行業準則之指標對照表，供雙重框架使用者參考。", guidanceEn: "Provide cross-reference table between GRI universal standards and SASB industry metrics.", requiredData: [], documentIds: [] },
];

// ─────────────────────────────────────────────────────────────
// ISSA 5000 (28 sections)
// ─────────────────────────────────────────────────────────────
const ISSA_5000_SECTIONS: TemplateSection[] = [
    { id: "I1.1", type: "確信指標", title: "確信委託書說明", titleEn: "Assurance Engagement Description", chapter: "Part A: 確信框架", chapterEn: "Part A: Assurance Framework", guidanceZh: "說明確信委託性質（有限至合理確信）、委託範疇及確信提供方資格。", guidanceEn: "Describe the assurance engagement type (limited to reasonable), scope, and practitioner qualifications.", requiredData: [], documentIds: [] },
    { id: "I1.2", type: "確信指標", title: "負責方聲明", titleEn: "Responsible Party Statement", chapter: "Part A: 確信框架", chapterEn: "Part A: Assurance Framework", guidanceZh: "由管理層或治理機構出具聲明，確認永續資訊之編制符合適用框架及管理層責任。", guidanceEn: "Management or governance body statement confirming responsibility for sustainability information.", requiredData: [], documentIds: [] },
    { id: "I2.1", type: "確信指標", title: "重大性評估", titleEn: "Materiality Assessment", chapter: "Part B: 永續主題", chapterEn: "Part B: Sustainability Topics", guidanceZh: "說明重大性評估方法（如雙重重大性），識別之關鍵永續主題及利害關係人鑑別過程。", guidanceEn: "Describe materiality methodology (e.g., double materiality), key topics identified, and stakeholder process.", requiredData: ["materiality_matrix"], documentIds: [] },
    { id: "I2.2", type: "確信指標", title: "GHG 排放數據（受確信主題）", titleEn: "GHG Data (Subject Matter)", chapter: "Part B: 永續主題", chapterEn: "Part B: Sustainability Topics", guidanceZh: "揭露 Scope 1、2（及適用之 Scope 3）溫室氣體排放量，並標注確信等級。", guidanceEn: "Disclose Scope 1, 2 (and applicable Scope 3) GHG emissions with assurance level annotation.", requiredData: ["scope1", "scope2", "scope3"], documentIds: [] },
    { id: "I2.3", type: "確信指標", title: "用水及廢塑膠數據", titleEn: "Water & Plastic Waste Data", chapter: "Part B: 永續主題", chapterEn: "Part B: Sustainability Topics", guidanceZh: "揭露用水量（m³）及廢塑膠管理量（噸），說明數據品質及影響。", guidanceEn: "Disclose water consumption (m³) and plastic waste (tonnes) with data quality notes.", requiredData: ["water_withdrawal", "plastic_waste"], documentIds: [] },
    { id: "I2.4", type: "確信指標", title: "員工多元數據", titleEn: "Workforce Diversity Data", chapter: "Part B: 永續主題", chapterEn: "Part B: Sustainability Topics", guidanceZh: "揭露性別薪酬差距（%）、管理階層女性比例及其他多元指標。", guidanceEn: "Disclose gender pay gap (%), female management ratio, and other diversity metrics.", requiredData: ["diversity_data", "pay_equity"], documentIds: [] },
    { id: "I3.1", type: "確信指標", title: "確性標準適用方法", titleEn: "Criteria & Standards Applied", chapter: "Part C: 標準對標", chapterEn: "Part C: Standards Mapping", guidanceZh: "說明永續資訊編制時所採用之準則（GRI、TCFD、ESRS、法規要求）及選擇理由。", guidanceEn: "State the criteria/standards used for sustainability information (GRI, TCFD, ESRS, regulations) with rationale.", requiredData: [], documentIds: [] },
    { id: "I3.2", type: "確信指標", title: "ESRS 對標揭露", titleEn: "ESRS Cross-Reference", chapter: "Part C: 標準對標", chapterEn: "Part C: Standards Mapping", guidanceZh: "提供本報告與 ESRS E1（氣候）、E5（循環）、S1（人力）、G1（治理）指標之對照表（如適用）。", guidanceEn: "Cross-reference to ESRS E1, E5, S1, G1 disclosures where applicable.", requiredData: [], documentIds: [] },
    { id: "I4.1", type: "確信指標", title: "內部控制描述", titleEn: "Internal Controls Description", chapter: "Part D: 數據品質", chapterEn: "Part D: Data Quality", guidanceZh: "描述永續數據收集、驗證及管治之內部控制流程，包含審計委員會監督。", guidanceEn: "Describe internal controls for sustainability data collection, validation, and governance.", requiredData: ["ics_framework"], documentIds: [] },
    { id: "I4.2", type: "確信指標", title: "關鍵假設與不確定性", titleEn: "Key Assumptions & Uncertainties", chapter: "Part D: 數據品質", chapterEn: "Part D: Data Quality", guidanceZh: "說明永續資訊編制過程中使用的關鍵估計、假設及固有不確定性。", guidanceEn: "Disclose key estimates, assumptions, and inherent uncertainties in sustainability data preparation.", requiredData: [], documentIds: [] },
    { id: "I4.3", type: "確信指標", title: "5T 誠信存證機制", titleEn: "5T Integrity Protocol", chapter: "Part D: 數據品質", chapterEn: "Part D: Data Quality", guidanceZh: "說明 5T 存證協議（可感知、可溯源、可追蹤、透明、不可篡改）如何增強數據鏈完整性。", guidanceEn: "Explain how the 5T protocol (Tangible, Traceable, Trackable, Transparent, Tamper-proof) enhances data integrity.", requiredData: ["audit_trail", "hash_records"], documentIds: [] },
    { id: "I4.4", type: "確信指標", title: "ZKP 隱私強化揭露", titleEn: "ZKP Privacy-Enhancement Disclosure", chapter: "Part D: 數據品質", chapterEn: "Part D: Data Quality", guidanceZh: "說明零知識證明（ZKP）如何在保護商業敏感數據的同時，實現可驗證的確信結果。", guidanceEn: "Explain how ZKP enables verifiable assurance outcomes while protecting commercially sensitive data.", requiredData: ["zkp_proofs"], documentIds: [] },
    { id: "I5.1", type: "確信指標", title: "確信報告書", titleEn: "Practitioner's Report", chapter: "Part E: 確信結論", chapterEn: "Part E: Assurance Conclusion", guidanceZh: "附上確信提供方出具之獨立確信報告，說明結論、保留意見或限制說明（如有）。", guidanceEn: "Attach the independent assurance report with conclusion, qualifications, or limitations (if any).", requiredData: ["assurance_report"], documentIds: [] },
    ...Array.from({ length: 14 }, (_, k) => ({
        id: `I6.${k + 1}`,
        type: "確信指標",
        title: `補充揭露 ${k + 1}`,
        titleEn: `Supplemental Disclosure ${k + 1}`,
        chapter: "Part F: 補充揭露",
        chapterEn: "Part F: Supplemental",
        guidanceZh: "依確信委託之範疇，提供此項補充永續主題之定量與定性資訊。",
        guidanceEn: "Provide quantitative and qualitative information for this supplemental subject matter per engagement scope.",
        requiredData: [],
        documentIds: [],
    })),
];

// ─────────────────────────────────────────────────────────────
// Taipei Pilot 2025 (12 sections)
// ─────────────────────────────────────────────────────────────
const TAIPEI_PILOT_SECTIONS: TemplateSection[] = [
    { id: "P1.1", type: "台北指標", title: "企業基本資料", titleEn: "Company Information", chapter: "壹、企業概況", chapterEn: "I. Company Overview", guidanceZh: "填寫公司統一編號、代表人、員工數（全職/兼職/派遣）、主要產業別（依中華民國行業標準分類 ISIC）及公司登記地址。", guidanceEn: "Provide registration number, representative, employee count by type, industry code (ISIC), and registered address.", requiredData: ["company_profile", "registration_no"], documentIds: [] },
    { id: "P1.2", type: "台北指標", title: "經營者的話", titleEn: "Message from Leadership", chapter: "壹、企業概況", chapterEn: "I. Company Overview", guidanceZh: "最高負責人（董事長或總經理）就 2024 年重大永續成就、挑戰及 2025 年承諾發表聲明，字數建議 400–800 字。", guidanceEn: "CEO/Chair statement on 2024 key sustainability achievements, challenges and 2025 commitments (400–800 words).", requiredData: ["company_goals"], documentIds: [] },
    { id: "P1.3", type: "台北指標", title: "永續治理架構", titleEn: "Sustainability Governance", chapter: "壹、企業概況", chapterEn: "I. Company Overview", guidanceZh: "說明永續推動委員會（或類似機構）組成、職責、召開頻率及與董事會之匯報關係。", guidanceEn: "Describe the sustainability committee structure, mandate, meeting frequency, and reporting line to the board.", requiredData: ["board_composition"], documentIds: [] },
    { id: "P1.4", type: "台北指標", title: "重大主題鑑別", titleEn: "Materiality Assessment", chapter: "壹、企業概況", chapterEn: "I. Company Overview", guidanceZh: "說明雙重重大性評估流程（衝擊重大性 ＋ 財務重大性），列出 2024 年度前十大重大議題及其邊界。", guidanceEn: "Explain double materiality process (impact + financial) and list top 10 material topics with boundaries.", requiredData: ["materiality_matrix"], documentIds: [] },
    { id: "P1.5", type: "台北指標", title: "利害關係人參與", titleEn: "Stakeholder Engagement", chapter: "壹、企業概況", chapterEn: "I. Company Overview", guidanceZh: "列出主要利害關係人類別（員工、投資人、客戶、供應商、社區、主管機關），說明 2024 年參與方式及回應機制。", guidanceEn: "List stakeholder categories and describe 2024 engagement methods and response mechanisms.", requiredData: ["stakeholder_survey"], documentIds: [] },
    { id: "P2.1", type: "台北指標", title: "氣候政策與淨零路徑", titleEn: "Climate Policy & Net-Zero Roadmap", chapter: "貳、環境績效", chapterEn: "II. Environmental Performance", guidanceZh: "揭露減碳目標年份（如 2050 淨零）、中期里程碑（如 2030 年減 42%）及對應行動方案，並說明 SBTi 提交狀態。", guidanceEn: "Disclose net-zero target year, mid-term milestones (e.g. 42% by 2030), action plans, and SBTi submission status.", requiredData: ["ghg_targets"], documentIds: [] },
    { id: "P2.2", type: "台北指標", title: "溫室氣體盤查 (Scope 1/2/3)", titleEn: "GHG Inventory", chapter: "貳、環境績效", chapterEn: "II. Environmental Performance", guidanceZh: "依金管會要求揭露 Scope 1、Scope 2（市場基礎 & 位置基礎）及主要類別 Scope 3 排放量（tCO₂e），說明計算邊界與基準年比較。", guidanceEn: "Disclose Scope 1, 2 (market & location-based), and key Scope 3 categories (tCO₂e) per FSC/GHG Protocol.", requiredData: ["scope1", "scope2", "scope3"], documentIds: [] },
    { id: "P2.3", type: "台北指標", title: "能源管理", titleEn: "Energy Management", chapter: "貳、環境績效", chapterEn: "II. Environmental Performance", guidanceZh: "揭露總能耗（MWh）、再生能源比例（目標及現況）、能源密集度（MWh/百萬營收）及主要節能措施。", guidanceEn: "Disclose total energy (MWh), renewable share, energy intensity (MWh/M revenue), and key efficiency measures.", requiredData: ["electricity_kwh", "renewable_ratio"], documentIds: [] },
    { id: "P2.4", type: "台北指標", title: "用水管理", titleEn: "Water Management", chapter: "貳、環境績效", chapterEn: "II. Environmental Performance", guidanceZh: "揭露總取水量（m³）、水源組成、缺水地區風險評估，及 2024 年節水成效。", guidanceEn: "Disclose water withdrawal by source (m³), water-stress risk, and 2024 conservation outcomes.", requiredData: ["water_withdrawal"], documentIds: [] },
    { id: "P2.5", type: "台北指標", title: "廢棄物管理", titleEn: "Waste Management", chapter: "貳、環境績效", chapterEn: "II. Environmental Performance", guidanceZh: "揭露廢棄物總量（噸）、分類（一般/有害）、回收率（%）及循環再利用方式。", guidanceEn: "Disclose total waste by category (tonnes), recycling rate (%), and circular reuse methods.", requiredData: ["waste_kg", "recycling_rate"], documentIds: [] },
    { id: "P3.1", type: "台北指標", title: "員工結構與薪酬", titleEn: "Workforce & Compensation", chapter: "參、社會績效", chapterEn: "III. Social Performance", guidanceZh: "揭露員工總數（含性別/年齡/雇用類型細分）、平均薪資與法定最低薪資比值、薪酬差距及福利制度。", guidanceEn: "Disclose headcount by gender/age/type, average wage vs. legal minimum ratio, pay gap, and benefits.", requiredData: ["headcount", "wage_data"], documentIds: [] },
    { id: "P3.2", type: "台北指標", title: "員工發展與培訓", titleEn: "Employee Development", chapter: "參、社會績效", chapterEn: "III. Social Performance", guidanceZh: "揭露年度人均培訓時數、訓練投資金額、技能提升計畫及績效評核覆蓋率。", guidanceEn: "Disclose training hours/FTE, training spend, upskilling programs, and performance review coverage.", requiredData: ["training_hours"], documentIds: [] },
    { id: "P3.3", type: "台北指標", title: "職業安全衛生", titleEn: "Occupational Health & Safety", chapter: "參、社會績效", chapterEn: "III. Social Performance", guidanceZh: "揭露 2024 年職業災害次數、失能傷害率（LTIR）、職業病率、危害識別機制及重大安全改善措施。", guidanceEn: "Disclose 2024 incidents, LTIR, occupational disease rate, hazard ID process, and key safety improvements.", requiredData: ["safety_incidents", "ltir"], documentIds: [] },
    { id: "P3.4", type: "台北指標", title: "多元共融", titleEn: "Diversity & Inclusion", chapter: "參、社會績效", chapterEn: "III. Social Performance", guidanceZh: "揭露董事會及員工性別比例、不同年齡層分布、身心障礙員工比例及相關促進措施。", guidanceEn: "Disclose board and workforce gender ratios, age distribution, disability inclusion ratio and programs.", requiredData: ["diversity_data"], documentIds: [] },
    { id: "P3.5", type: "台北指標", title: "供應鏈管理", titleEn: "Supply Chain Management", chapter: "參、社會績效", chapterEn: "III. Social Performance", guidanceZh: "說明供應商 ESG 評鑑機制、2024 年稽核比例及已發現高風險供應商之改善追蹤。", guidanceEn: "Describe supplier ESG assessment, 2024 audit coverage, and corrective action tracking for high-risk suppliers.", requiredData: ["supplier_audit"], documentIds: [] },
    { id: "P3.6", type: "台北指標", title: "在地社區連結", titleEn: "Local Community", chapter: "參、社會績效", chapterEn: "III. Social Performance", guidanceZh: "說明與臺北市在地社區、公益組織之協作方案，以及社會投資金額與受益人數。", guidanceEn: "Describe community partnerships, social investment amount, and beneficiary count.", requiredData: ["community_investment"], documentIds: [] },
    { id: "P4.1", type: "台北指標", title: "董事會組成與運作", titleEn: "Board Composition & Operation", chapter: "肆、治理績效", chapterEn: "IV. Governance Performance", guidanceZh: "揭露董事會席次、獨立董事比例、多元性（性別/專業背景）、出席率及 2024 年決議之重大 ESG 議題。", guidanceEn: "Disclose board seats, independent ratio, diversity, attendance, and key ESG resolutions in 2024.", requiredData: ["board_composition"], documentIds: [] },
    { id: "P4.2", type: "台北指標", title: "廉潔與反貪腐", titleEn: "Integrity & Anti-Corruption", chapter: "肆、治理績效", chapterEn: "IV. Governance Performance", guidanceZh: "揭露反貪腐政策覆蓋率、員工培訓完成率、2024 年已確認違規件數及案件處理結果。", guidanceEn: "Disclose anti-corruption policy coverage, training completion, and confirmed incidents with outcomes.", requiredData: ["compliance_incidents"], documentIds: [] },
    { id: "P5.1", type: "台北指標", title: "5T 存證技術說明", titleEn: "5T Protocol Technical Summary", chapter: "伍、技術附錄", chapterEn: "V. Technical Appendix", guidanceZh: "摘要說明 5T 誠信協議技術架構（SHA-256 雜湊、ZKP 存證、時間戳記），揭露本報告數據鏈完整性驗證方式。", guidanceEn: "Summarize 5T architecture (SHA-256, ZKP, timestamp) and data chain integrity verification for this report.", requiredData: ["hash_records", "zkp_proofs"], documentIds: [] },
    { id: "P5.2", type: "台北指標", title: "GRI 索引對照", titleEn: "GRI Content Index", chapter: "伍、技術附錄", chapterEn: "V. Technical Appendix", guidanceZh: "列出本報告對應之 GRI 通用準則揭露項目（GRI 2 / GRI 3）頁碼對照表，及任何省略項目之說明。", guidanceEn: "List GRI 2/3 disclosure cross-reference table with page numbers and omission explanations.", requiredData: [], documentIds: [] },
    { id: "P5.3", type: "台北指標", title: "ESG 量化指標彙總", titleEn: "ESG Metrics Summary Table", chapter: "伍、技術附錄", chapterEn: "V. Technical Appendix", guidanceZh: "以表格彙整本報告所有量化指標（E/S/G 三面向），含單位、2023 基準值、2024 年實績及年度變化說明。", guidanceEn: "Tabulate all E/S/G quantitative metrics with units, 2023 baseline, 2024 actuals, and YoY variance.", requiredData: [], documentIds: [] },
    { id: "P5.4", type: "台北指標", title: "外部確信聲明", titleEn: "External Assurance Statement", chapter: "伍、技術附錄", chapterEn: "V. Technical Appendix", guidanceZh: "附上第三方查證機構出具之有限確信/合理確信聲明（ISSA 5000 / AA1000AS），說明確信範疇與結論。", guidanceEn: "Attach limited/reasonable assurance statement (ISSA 5000/AA1000AS) with scope and conclusion.", requiredData: ["assurance_report"], documentIds: [] },
];

// ─────────────────────────────────────────────────────────────
// TWSE 2024 — 臺灣證交所永續報告書參考架構 (20 sections)
// ─────────────────────────────────────────────────────────────
const TWSE_2024_SECTIONS: TemplateSection[] = [
    { id: "W1.1", type: "證交所指標", title: "經營者的話", titleEn: "Message from Leadership", chapter: "1. 關於本報告書", chapterEn: "1. About This Report", guidanceZh: "最高負責人就 2024 年度 ESG 重大成就、所遭遇之挑戰，及對未來永續路徑的承諾，發表正式聲明（建議 500–1000 字）。", guidanceEn: "Leadership statement on 2024 ESG achievements, challenges, and future sustainability commitments (500–1000 words).", requiredData: ["company_goals"], documentIds: [] },
    { id: "W1.2", type: "證交所指標", title: "關於本公司", titleEn: "Company Profile", chapter: "1. 關於本報告書", chapterEn: "1. About This Report", guidanceZh: "揭露公司名稱、統一編號、成立年份、主要業務、組織規模（資本額、員工數）及主要產品/服務。依 GRI 2-1 至 2-6 揭露。", guidanceEn: "Disclose company name, registration, founding year, core business, scale, and products/services per GRI 2-1 to 2-6.", requiredData: ["company_profile", "revenue"], documentIds: [] },
    { id: "W1.3", type: "證交所指標", title: "報告書資訊", titleEn: "Report Information", chapter: "1. 關於本報告書", chapterEn: "1. About This Report", guidanceZh: "說明報告邊界（組織邊界與價值鏈邊界）、報告期間（2024/01/01–2024/12/31）、適用準則（GRI 通用、IFRS S1/S2、TCFD）及重編說明（如有）。", guidanceEn: "State reporting boundary, period (2024/01/01–2024/12/31), applicable standards (GRI, IFRS S1/S2, TCFD), and restatements.", requiredData: ["report_year"], documentIds: [] },
    { id: "W2.1", type: "證交所指標", title: "永續治理架構", titleEn: "Sustainability Governance", chapter: "2. 永續經營", chapterEn: "2. Sustainability Management", guidanceZh: "說明永續委員會（或相應機構）組成、定期向董事會匯報之機制，及高階主管永續相關職責與 KPI。", guidanceEn: "Describe sustainability committee composition, board reporting cadence, and executive ESG KPIs.", requiredData: ["board_composition"], documentIds: [] },
    { id: "W2.2", type: "證交所指標", title: "重大主題鑑別與管理", titleEn: "Materiality & Topic Management", chapter: "2. 永續經營", chapterEn: "2. Sustainability Management", guidanceZh: "說明雙重重大性評估方法（衝擊重大性 ＋ 財務重大性），列出前十大重大主題、邊界及 2024 年管理方式（GRI 3-1 至 3-3）。", guidanceEn: "Explain double materiality process and list top 10 topics with boundary, linkage, and 2024 management approach per GRI 3.", requiredData: ["materiality_matrix"], documentIds: [] },
    { id: "W2.3", type: "證交所指標", title: "利害關係人參與", titleEn: "Stakeholder Engagement", chapter: "2. 永續經營", chapterEn: "2. Sustainability Management", guidanceZh: "辨識投資者、員工、客戶、供應商、政府、社區六大類利害關係人，說明 2024 年議合方式與回應機制（GRI 2-29）。", guidanceEn: "Identify 6 stakeholder groups and describe 2024 engagement methods and responses per GRI 2-29.", requiredData: ["stakeholder_survey"], documentIds: [] },
    {
        id: "W3.1",
        type: "環境指標",
        title: "氣候變遷風險與機遇",
        titleEn: "Climate Risks & Opportunities",
        chapter: "3. 環境永續",
        chapterEn: "3. Environmental Sustainability",
        guidanceZh: "依 TCFD/IFRS S2 揭露短中長期氣候物理風險（如颱風、洪水）與過渡風險（如碳稅、法規）及相應機遇的財務衝擊評估。",
        guidanceEn: "Disclose physical and transition climate risks/opportunities with financial impact per TCFD/IFRS S2.",
        requiredData: ["climate_risk_register", "financial_exposure"],
        guidanceMeta: {
            what: "這部分要求您量化並描述氣候風險對財務的實質影響。這不僅是環境披露，更是財務韌性的展現。",
            why: "根據 IFRS S2 準則，企業必須揭露氣候變遷如何影響其獲利能力與財務預測，這是目前金管會審查的重點。",
            soWhat: "撰寫建議：請務必區分『實體風險』（如營運中斷）與『過渡風險』（如碳排成本增加），並列出應對策略。",
            benchmark: "標竿案例：參考台北富邦銀行的氣候風險評估報告，其將風險與財務影響細分為低、中、高影響等級，非常清晰。"
        }
    },
    { id: "W3.2", type: "環境指標", title: "溫室氣體盤查", titleEn: "GHG Inventory", chapter: "3. 環境永續", chapterEn: "3. Environmental Sustainability", guidanceZh: "揭露 Scope 1（直接排放）、Scope 2（市場/位置基礎）及重大 Scope 3 類別之溫室氣體排放量（tCO₂e），說明計算邊界、方法論及基準年。", guidanceEn: "Disclose Scope 1, 2 (market/location-based), and key Scope 3 GHG emissions (tCO₂e) with methodology and base year.", requiredData: ["scope1", "scope2", "scope3"] },
    { id: "W3.3", type: "環境指標", title: "能源管理", titleEn: "Energy Management", chapter: "3. 環境永續", chapterEn: "3. Environmental Sustainability", guidanceZh: "揭露總能源消耗量（MWh）、能源類型組成（電力、燃料、蒸汽等）、再生能源比例（%）及能源密集度，說明節能措施與成效（GRI 302）。", guidanceEn: "Disclose total energy (MWh) by type, renewable share, intensity, and efficiency measures per GRI 302.", requiredData: ["electricity_kwh", "renewable_ratio"] },
    { id: "W3.4", type: "環境指標", title: "水資源管理", titleEn: "Water Management", chapter: "3. 環境永續", chapterEn: "3. Environmental Sustainability", guidanceZh: "揭露取水總量（m³）、水源類型（自來水/地下水/雨水回收）、缺水地區風險評估及 2024 年節水績效（GRI 303）。", guidanceEn: "Disclose total water withdrawal by source, water-stress risk, and 2024 conservation results per GRI 303.", requiredData: ["water_withdrawal"] },
    { id: "W3.5", type: "環境指標", title: "廢棄物管理", titleEn: "Waste Management", chapter: "3. 環境永續", chapterEn: "3. Environmental Sustainability", guidanceZh: "揭露廢棄物總產生量（噸）、依性質分類（一般/有害）、回收再利用率（%）及主要廢棄物減量措施（GRI 306）。", guidanceEn: "Disclose total waste (tonnes) by category, recycling rate, and key reduction measures per GRI 306.", requiredData: ["waste_kg", "recycling_rate"] },
    { id: "W4.1", type: "社會指標", title: "員工雇用與薪酬", titleEn: "Employment & Compensation", chapter: "4. 社會責任", chapterEn: "4. Social Responsibility", guidanceZh: "揭露員工總人數（性別/類型/地區細分）、平均薪資、與法定最低薪資比較、新增雇用及離職率（GRI 401）。", guidanceEn: "Disclose headcount, average wage vs. legal minimum, new hires, and turnover by gender/type/region per GRI 401.", requiredData: ["headcount", "turnover_rate", "wage_data"] },
    { id: "W4.2", type: "社會指標", title: "職業安全衛生", titleEn: "Occupational Health & Safety", chapter: "4. 社會責任", chapterEn: "4. Social Responsibility", guidanceZh: "揭露可記錄傷害率、失能傷害頻率（LTIR）、職業病率、危害辨識流程及 2024 年重大改善措施（GRI 403）。", guidanceEn: "Disclose recordable injury rate, LTIR, occupational disease rate, hazard processes, and improvements per GRI 403.", requiredData: ["safety_incidents", "ltir"] },
    { id: "W4.3", type: "社會指標", title: "人才培訓與發展", titleEn: "Training & Development", chapter: "4. 社會責任", chapterEn: "4. Social Responsibility", guidanceZh: "揭露人均培訓時數、培訓投資金額、數位技能提升計畫及績效與職涯發展評核機制（GRI 404）。", guidanceEn: "Disclose training hours/FTE, investment, digital upskilling programs, and career development processes per GRI 404.", requiredData: ["training_hours"] },
    { id: "W4.4", type: "社會指標", title: "多元共融與人權", titleEn: "Diversity, Inclusion & Human Rights", chapter: "4. 社會責任", chapterEn: "4. Social Responsibility", guidanceZh: "揭露董事會及員工多元性指標（性別/年齡/族裔），說明人權盡職調查機制及供應鏈人權風險評估（GRI 405, 410–414）。", guidanceEn: "Disclose diversity metrics and describe human rights due diligence and supply chain assessment per GRI 405, 410–414.", requiredData: ["diversity_data", "supplier_audit"] },
    { id: "W5.1", type: "治理指標", title: "公司治理結構", titleEn: "Corporate Governance Structure", chapter: "5. 公司治理", chapterEn: "5. Corporate Governance", guidanceZh: "說明董事會組成（席次、獨立董事占比、性別多元比例）、各委員會設置（審計/薪酬/永續）及 2024 年召開次數（GRI 2-9 至 2-13）。", guidanceEn: "Disclose board composition, committee setup (audit/compensation/sustainability), and 2024 meeting frequency per GRI 2-9 to 2-13.", requiredData: ["board_composition"] },
    { id: "W5.2", type: "治理指標", title: "薪酬與績效連結", titleEn: "Remuneration & ESG Performance", chapter: "5. 公司治理", chapterEn: "5. Corporate Governance", guidanceZh: "說明高階主管薪酬與 ESG 績效指標之連結機制（如碳排減量、安全、多元性），並揭露薪酬政策摘要（GRI 2-19 至 2-20）。", guidanceEn: "Describe executive pay linkage to ESG KPIs (GHG, safety, diversity) and summarize compensation policy per GRI 2-19 to 2-20.", requiredData: ["executive_compensation"] },
    { id: "W5.3", type: "治理指標", title: "法規遵循與風險管理", titleEn: "Compliance & Risk Management", chapter: "5. 公司治理", chapterEn: "5. Corporate Governance", guidanceZh: "說明 ESG 相關法規遵循機制、2024 年重大裁罰或違規及整體企業風險管理架構中之 ESG 風險整合（GRI 205）。", guidanceEn: "Describe ESG compliance, 2024 violations/fines, and ESG risk integration into enterprise risk management per GRI 205.", requiredData: ["compliance_incidents"] },
    { id: "W6.1", type: "證交所指標", title: "GRI 內容索引", titleEn: "GRI Content Index", chapter: "6. 附錄", chapterEn: "6. Appendix", guidanceZh: "依 GRI 通用準則（GRI 1/2/3）編製揭露對照表，列出每項 GRI 揭露之報告頁碼及省略項目說明。", guidanceEn: "Compile GRI disclosure cross-reference table (GRI 1/2/3) with page locations and omission explanations.", requiredData: [] },
    { id: "W6.2", type: "證交所指標", title: "量化績效指標彙總", titleEn: "Quantitative Performance Summary", chapter: "6. 附錄", chapterEn: "6. Appendix", guidanceZh: "彙整環境（E）、社會（S）、治理（G）三面向所有量化指標，含 2022–2024 三年趨勢數據，以利歷年比較。", guidanceEn: "Compile all E/S/G quantitative metrics with 3-year trend (2022–2024) for year-over-year comparison.", requiredData: [] },
];

// ─────────────────────────────────────────────────────────────
// Registry Map
// ─────────────────────────────────────────────────────────────
export const TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
    "gri-2025": {
        id: "gri-2025",
        name: "GRI 國際標準官方範本",
        nameEn: "GRI Official Template",
        standard: "GRI",
        description: "採用 2025 最新修訂版 GRI 通用準則與重大主題披露。",
        descriptionEn: "Latest 2025 GRI standards with material topic disclosures.",
        segments: 42,
        sections: [...GRI_2025_SECTIONS, ...GRI_EXTRA].slice(0, 42),
    },
    "tcfd-2025": {
        id: "tcfd-2025",
        name: "TCFD 氣候風險財務披露",
        nameEn: "TCFD Climate Disclosure",
        standard: "TCFD",
        description: "專注於治理、策略、風險管理及指標與目標四大面向。",
        descriptionEn: "Focusing on governance, strategy, risk management, and metrics.",
        segments: 15,
        sections: TCFD_SECTIONS,
    },
    "sasb-2025": {
        id: "sasb-2025",
        name: "SASB 行業特定披露範本",
        nameEn: "SASB Industry Template",
        standard: "SASB",
        description: "針對不同產業別的永續會計標準，精確對標財務重大性。",
        descriptionEn: "Industry-specific standards mapping to financial materiality.",
        segments: 18,
        sections: SASB_SECTIONS,
    },
    "sasb-technology": {
        id: "sasb-technology",
        name: "SASB 軟體與 IT 服務產業標準",
        nameEn: "SASB Software & IT Services",
        standard: "SASB",
        description: "專注於資安、數據隱私及人才管理等科技業核心議題。",
        descriptionEn: "Focusing on cybersecurity, data privacy, and talent management.",
        segments: 18,
        sections: SASB_SECTIONS, // Reusing but can be specialized later
    },
    "sasb-manufacturing": {
        id: "sasb-manufacturing",
        name: "SASB 半導體與硬體製造標準",
        nameEn: "SASB Semiconductors & Hardware",
        standard: "SASB",
        description: "強調供應鏈資源效率、有害物質管理及水資源利用。",
        descriptionEn: "Highlighting supply chain resource efficiency and hazardous materials.",
        segments: 18,
        sections: SASB_SECTIONS, // Reusing but can be specialized later
    },
    "issa-5000": {
        id: "issa-5000",
        name: "ISSA 5000 確信就緒範本",
        nameEn: "ISSA 5000 Ready Template",
        standard: "ISSA-5000",
        description: "以外部查核為導向的揭露架構，強化數據存證與反欺詐邏輯。",
        descriptionEn: "Assurance-oriented framework enhancing data attestation.",
        segments: 28,
        sections: ISSA_5000_SECTIONS,
    },
    "taipei-pilot-2025": {
        id: "taipei-pilot-2025",
        name: "臺北市中小企業試點專用範本",
        nameEn: "Taipei SME Pilot Template",
        standard: "TAIPEI-PILOT",
        description: "整合 5T 誠信協議與 ZKP 隱私技術，專為臺北市設創基地輔導企業打造，含 22 個章節完整引導文。",
        descriptionEn: "Integrating 5T protocol and ZKP for Taipei-based SMEs with 22 pre-written sections.",
        segments: 22,
        sections: TAIPEI_PILOT_SECTIONS,
    },
    "twse-2024": {
        id: "twse-2024",
        name: "臺灣證交所永續報告書參考架構",
        nameEn: "TWSE Sustainability Report Framework",
        standard: "TWSE-2024",
        description: "依臺灣證券交易所 2024 年發布之永續報告書參考架構，涵蓋關於報告書、永續經營、環境、社會、治理五大章節。",
        descriptionEn: "Based on TWSE 2024 Sustainability Report Reference Framework covering report overview, ESG governance, environment, social, and governance chapters.",
        segments: 20,
        sections: TWSE_2024_SECTIONS,
    },
};

/** Get sections for a templateId, or empty array if not found */
export function getTemplateSections(templateId: string): TemplateSection[] {
    return TEMPLATE_REGISTRY[templateId]?.sections ?? [];
}

/** Get initial sectionContents map from template — pre-written, zero AI */
export function getTemplateInitialContents(templateId: string, lang: "zh" | "en"): Record<string, string> {
    const sections = getTemplateSections(templateId);
    return Object.fromEntries(
        sections.map(s => [s.id, lang === "zh" ? s.guidanceZh : s.guidanceEn])
    );
}
