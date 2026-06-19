import { Report } from "@/types";

export const INITIAL_REPORTS: Report[] = [
    { id: "11111111-1111-1111-1111-111111111111", title: "2025 年度永續報告書", year: 2025, chapters: 5, sections: 25, completedSections: 18, progress: 72, status: "draft", lastEdited: "2小時前", linkedSourceCount: 5, issaReadiness: 88, trustSeal: "Gold" },
    { id: "22222222-2222-2222-2222-222222222222", title: "2026 ESG 策略白皮書", year: 2026, chapters: 3, sections: 12, completedSections: 0, progress: 0, status: "draft", lastEdited: "剛剛", linkedSourceCount: 0, issaReadiness: 12, trustSeal: "Bronze" },
    { id: "33333333-3333-3333-3333-333333333333", title: "供應鏈減碳專案報告 (2025)", year: 2025, chapters: 4, sections: 12, completedSections: 12, progress: 100, status: "completed", lastEdited: "1天前", linkedSourceCount: 4, issaReadiness: 100, trustSeal: "SECURE_MAX" },
];

export const DEFAULT_COMPANY_ID = "00000000-0000-0000-0000-000000000001";

export const DEFAULT_COMPANY_PROFILE = {
    name: "善向永續開發 (ESG GO)",
    industry: "永續軟體服務與數據治理",
    reportYear: 2025,
    goals: ["導入誠信存證中心", "實現全自動化 ESG 報告生成", "優化範疇三供應鏈追蹤"],
    scope: "2024 年度全公司運營與供應鏈",
    commitments: ["2030 淨零排放", "100% 數據存證率", "ESG 數位轉型標桿"],
    customFields: [
        { key: "核心數據節點", value: "OMNI-NODE-01" },
        { key: "存證引擎版本", value: "v8.1.0-Spirit" }
    ]
};

export const SYSTEM_CONFIG = {
    TRUST_THRESHOLD: 90,
    AUTO_SAVE_INTERVAL: 5000,
    MAX_ACTIVITIES_LOG: 50,
    GCP_REGION: "asia-east1",
};

export const UI_TEXT = {
    zh: {
        dashboard: "儀表板",
        write: "撰寫",
        vault: "證具保險箱",
        integration: "系統串接",
        scanner: "AI 證具掃描",
    },
    en: {
        dashboard: "Dashboard",
        write: "SustainWrite",
        vault: "AuditVault",
        integration: "Integration",
        scanner: "AI Scanner",
    }
};

export const INITIAL_INTELLIGENCE_MODULES = [
    {
        id: "M1",
        titleZh: "氣候風險監測",
        titleEn: "Climate Risk Monitoring",
        descriptionZh: "即時追蹤全球氣候變遷數據與極端天氣預警。",
        descriptionEn: "Real-time tracking of global climate change data and extreme weather alerts.",
        iconName: "Thermometer",
        color: "emerald",
        details: ["GRI Standards", "IFRS/ISSA 5000", "FSC 97 Indicators"]
    },
    {
        id: "M2",
        titleZh: "碳市場分析",
        titleEn: "Carbon Market Analysis",
        descriptionZh: "碳權價格、綠電交易趨勢以及主要原物料變動情資。",
        descriptionEn: "Carbon pricing, green power trends, and raw material intelligence.",
        iconName: "Globe",
        color: "blue",
        details: ["Carbon Pricing", "RE100 Forecast", "Resource Scarcity"]
    },
    {
        id: "M3",
        titleZh: "情境壓力測試",
        titleEn: "Scenario Stress Testing",
        descriptionZh: "基於雙重重大性 (Double Materiality) 的氣候情境壓力測試。",
        descriptionEn: "Climate scenario stress testing based on Double Materiality.",
        iconName: "TrendingUp",
        color: "indigo",
        details: ["TCFD Physical Risk", "Transition Scenarios", "Stress Testing"]
    },
    {
        id: "M4",
        titleZh: "供應鏈監測",
        titleEn: "Supply Chain Monitoring",
        descriptionZh: "主動偵測企業供應鏈中潛在的 ESG 負面事件與合規缺口。",
        descriptionEn: "Proactive detection of ESG negative events and compliance gaps.",
        iconName: "Target",
        color: "rose",
        details: ["Supply Chain Alert", "Compliance Gap", "Negative News"]
    },
    {
        id: "M5",
        titleZh: "AI 深度溯源",
        titleEn: "AI Deep Traceability",
        descriptionZh: "運用 AI 深度溯源，解析商情異動的深層地緣政治或技術因素。",
        descriptionEn: "Deep AI traceability analyzing geopolitical or technical drivers.",
        iconName: "Workflow",
        color: "amber",
        details: ["Geopolitics Trace", "Supply Chain Mapping", "Policy Driver"]
    },
    {
        id: "M6",
        titleZh: "綜合風險評核",
        titleEn: "Composite Risk Assessment",
        descriptionZh: "整合商情數據後的綜合風險評核，指導永續策略佈局。",
        descriptionEn: "Comprehensive risk assessment to guide sustainability strategy.",
        iconName: "BarChart3",
        color: "violet",
        details: ["VaR Analysis", "ESG Scoring", "Impact Assessment"]
    },
    {
        id: "M7",
        titleZh: "戰略目標對齊",
        titleEn: "Strategic Alignment",
        descriptionZh: "將外部商情與企業內部目標 (SDGs) 進行自動化戰略對齊。",
        descriptionEn: "Automated alignment of market intelligence with internal SDGs.",
        iconName: "Network",
        color: "sky",
        details: ["SDGs Path", "Strategy Blueprint", "Gap Closure"]
    },
    {
        id: "M8",
        titleZh: "情資導入寫作",
        titleEn: "Intel-Powered Writing",
        descriptionZh: "商情中心與 Sustain_Write 聯動，將情資直接導入報告草稿。",
        descriptionEn: "Linked with Sustain_Write to import intel into report drafts.",
        iconName: "Zap",
        color: "cyan",
        details: ["Auto-Drafting", "Source Citation", "Context Weaving"]
    },
    {
        id: "M9",
        titleZh: "治理足跡存證",
        titleEn: "Governance Trace",
        descriptionZh: "記錄商情驅動的決策過程，形成可核閱的治理足跡。",
        descriptionEn: "Logging intel-driven decisions into auditable governance footprints.",
        iconName: "History",
        color: "slate",
        details: ["Decision Log", "Trust Proof", "Governance Trace"]
    },
    {
        id: "M10",
        titleZh: "生態避險共享",
        titleEn: "Ecosystem Sharing",
        descriptionZh: "與永續治理生態系及其他企業節點共享非競爭性之避險情資。",
        descriptionEn: "Sharing non-competitive risk intel with the ESG ecosystem.",
        iconName: "Activity",
        color: "teal",
        details: ["Collaborative Risk", "Industry Bench", "Pulse Sync"]
    }
];

export const INITIAL_INTELLIGENCE_SOURCES = [
    { category: "policy", name: "UN ESG Policy Hub", type: "Global", status: "Active" },
    { category: "policy", name: "EU CSRD Monitor", type: "EU", status: "Active" },
    { category: "policy", name: "TAIWAN FSC ESG Portal", type: "Taiwan", status: "Active" },
    { category: "price", name: "EU ETS Carbon Price Index", type: "Market", status: "Live" },
    { category: "industry", name: "Gartner Sustainability Insights", type: "Tech", status: "Active" },
    { category: "risk", name: "Climatic Hazard Watch", type: "Natural", status: "Monitoring" },
    { category: "geopolitics", name: "Hormuz Strait Logistics Pulse", type: "Geopolitical", status: "Critical" },
];
