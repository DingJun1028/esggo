/**
 * ESG GO — Document Registry
 * Definitions for evidence/documents required for ESG reporting.
 */

export interface ESGDocument {
    id: string;
    name: string;
    nameEn: string;
    category: "Environment" | "Social" | "Governance" | "General";
    description: string;
    action: string; // How to collect
    purpose: string; // What it does
    relatedInfo?: string;
}

export const DOCUMENT_REGISTRY: Record<string, ESGDocument> = {
    "company_profile": {
        id: "company_profile",
        name: "公司基本資料",
        nameEn: "Company Profile",
        category: "General",
        description: "包含公司名稱、統一編號、地址、代表人等基礎登記資訊。",
        purpose: "用於建立報告基礎，確保揭露主體之合法性與邊界。",
        action: "從公司登記證或最新的年報中匯入。"
    },
    "report_year": {
        id: "report_year",
        name: "報導期間聲明",
        nameEn: "Reporting Period Statement",
        category: "General",
        description: "界定報告涵蓋的具體起訖日期（如 2024 年度）。",
        purpose: "確保數據揭露的時間一致性。",
        action: "由經營秘書或永續長確認年度公告日期。"
    },
    "employee_count": {
        id: "employee_count",
        name: "員工清冊與結構",
        nameEn: "Employee Census",
        category: "Social",
        description: "包含全職、兼職、派遣員工的人數、性別及地區分布。",
        purpose: "計算人均績效、薪酬差距及社群影響力。",
        action: "由人資部門提供 12 月底之勞保投保人數清冊。"
    },
    "revenue": {
        id: "revenue",
        name: "年度財務報表 (經審計)",
        nameEn: "Audited Financial Statements",
        category: "Governance",
        description: "包含資產負債表、綜合損益表、現金流量表。",
        purpose: "計算財務重大性、碳排放密集度（tCO2e/營收）。",
        action: "從會計師查核報告或公開資訊觀測站下載。"
    },
    "ghg_emissions": {
        id: "ghg_emissions",
        name: "溫室氣體盤查清冊",
        nameEn: "GHG Inventory Sheet",
        category: "Environment",
        description: "詳細記載 Scope 1 & 2 的排放源（如台電度數、鍋爐燃料）。",
        purpose: "核心環境影響指標，也是確信機構必查項。",
        action: "從內部能源管理系統或 ISO 14064-1 清冊導出。"
    },
    "energy_data": {
        id: "energy_data",
        name: "各類能源繳費單據 (電、水、油)",
        nameEn: "Utility Bills",
        category: "Environment",
        description: "台電、自來水公司、加油站收據等原始憑證。",
        purpose: "作為溫室氣體與能源管理數據的原始佐證。",
        action: "掃描年度內所有原始單據，或從經辦報支系統下載。"
    },
    "waste_kg": {
        id: "waste_kg",
        name: "廢棄物清運簽單 (三聯單)",
        nameEn: "Waste Manifests",
        category: "Environment",
        description: "合法清運業者簽發之廢棄物移運記錄。",
        purpose: "證明廢棄物妥善處置，未造成非法棄置污染。",
        action: "收集各廠區與清運單位勾稽後之存根聯。"
    },
    "safety_incidents": {
        id: "safety_incidents",
        name: "職災紀錄與工傷統計表",
        nameEn: "Occupational Injury Logs",
        category: "Social",
        description: "記載 2024 年發生的所有職業傷害、失能傷害頻率 (LTIR)。",
        purpose: "反映勞動安全管理水平。",
        action: "由環安衛 (EHS) 部門提供申報職安署之統計月報。"
    },
    "stakeholder_survey": {
        id: "stakeholder_survey",
        name: "利害關係人問卷與議合紀錄",
        nameEn: "Stakeholder Engagement Records",
        category: "General",
        description: "包含問卷發放樣本、回收數據及 2024 年議合活動摘要。",
        purpose: "作為重大性分析 (Materiality Analysis) 的原始輸入。",
        action: "整理 Google Forms 導出數據或實體議合會議記錄。"
    },
    "board_composition": {
        id: "board_composition",
        name: "董事會成員名單與履歷",
        nameEn: "Board Resumes",
        category: "Governance",
        description: "董事背景、獨立性、性別及永續專業知識背景。",
        purpose: "揭露治理機構的多元性與專業監管能力。",
        action: "從公司官網「投資人關係」或最新股東會年報中擷取。"
    }
};

/** Get document detail by ID */
export function getDocumentDetail(docId: string): ESGDocument | undefined {
    return DOCUMENT_REGISTRY[docId];
}
