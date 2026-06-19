/**
 * 每個章節必須繳交的必要單據清單 (Required Documents per Chapter)
 * key: chapter ID (e.g., "1-01")
 */

export interface RequiredDoc {
    id: string;
    label: string;        // 文件名稱
    gri?: string;         // 對應 GRI 準則
    required: boolean;    // 是否為強制必交
}

export const CHAPTER_REQUIRED_DOCS: Record<string, RequiredDoc[]> = {
    "1-01": [
        { id: "d-ceo-letter", label: "經營者簽署聲明書", gri: "GRI 2-22", required: true },
        { id: "d-board-resolution", label: "董事會決議正本", gri: "GRI 2-9", required: true },
        { id: "d-prev-report", label: "前期永續報告書 (參考用)", required: false },
    ],
    "1-02": [
        { id: "d-company-profile", label: "公司章程 / 組織架構圖", gri: "GRI 2-1", required: true },
        { id: "d-business-license", label: "最新商業登記執照", required: true },
        { id: "d-subsidiary-list", label: "子公司及關聯企業清單", gri: "GRI 2-2", required: false },
    ],
    "1-03": [
        { id: "d-report-scope", label: "報告書邊界聲明書", gri: "GRI 2-3", required: true },
        { id: "d-restatement", label: "重述資訊說明 (如有)", gri: "GRI 2-4", required: false },
    ],
    "2-01": [
        { id: "d-strategy-doc", label: "永續發展策略文件", gri: "GRI 2-7", required: true },
        { id: "d-sdg-mapping", label: "SDGs 對標分析表", required: true },
        { id: "d-esg-targets", label: "ESG 量化目標設定表", required: false },
    ],
    "2-02": [
        { id: "d-esg-committee", label: "永續委員會組織架構", gri: "GRI 2-13", required: true },
        { id: "d-esg-policy", label: "公司永續政策文件", required: true },
    ],
    "2-03": [
        { id: "d-board-composition", label: "董事會成員資料表", gri: "GRI 2-9", required: true },
        { id: "d-committee-charter", label: "各功能委員會章程", gri: "GRI 2-10", required: true },
        { id: "d-meeting-minutes", label: "委員會年度會議記錄", gri: "GRI 2-14", required: false },
    ],
    "3-01": [
        { id: "d-stakeholder-list", label: "利害關係人分類與清單", gri: "GRI 2-29", required: true },
        { id: "d-engagement-records", label: "議合活動記錄 (問卷/訪談)", gri: "GRI 2-29", required: true },
        { id: "d-response-log", label: "利害關係人回應紀錄表", required: false },
    ],
    "3-02": [
        { id: "d-materiality-process", label: "重大性評估流程說明書", gri: "GRI 3-1", required: true },
        { id: "d-impact-assessment", label: "影響範圍評估矩陣", gri: "GRI 3-1", required: true },
    ],
    "3-03": [
        { id: "d-materiality-matrix", label: "重大議題矩陣圖", gri: "GRI 3-2", required: true },
        { id: "d-topic-list", label: "重大主題判定清單", required: true },
    ],
    "3-04": [
        { id: "d-mgmt-approach", label: "重大議題管理方針 (GRI 3-3)", gri: "GRI 3-3", required: true },
        { id: "d-kpi-tracking", label: "議題 KPI 追蹤報表", required: false },
    ],
    "4-01": [
        { id: "d-financial-statements", label: "財務報表 (年度)", gri: "GRI 201-1", required: true },
        { id: "d-value-distribution", label: "直接經濟價值分配表", gri: "GRI 201-1", required: true },
    ],
    "4-02": [
        { id: "d-tax-report", label: "稅務申報摘要文件", gri: "GRI 207-4", required: true },
        { id: "d-tax-policy", label: "租稅政策與治理框架說明", gri: "GRI 207-1", required: false },
    ],
    "4-03": [
        { id: "d-ethics-code", label: "誠信經營行為準則", gri: "GRI 205-2", required: true },
        { id: "d-anti-corruption-training", label: "反貪腐教育訓練記錄", gri: "GRI 205-2", required: true },
        { id: "d-ethics-incidents", label: "違規事件統計表", gri: "GRI 205-3", required: false },
    ],
    "4-04": [
        { id: "d-grievance-mechanism", label: "申訴機制說明文件", gri: "GRI 2-26", required: true },
        { id: "d-grievance-stats", label: "申訴案件統計 (年度)", required: false },
    ],
    "4-05": [
        { id: "d-risk-framework", label: "風險管理框架文件", gri: "GRI 2-12", required: true },
        { id: "d-risk-register", label: "企業風險清冊 (Risk Register)", required: true },
        { id: "d-bcp", label: "業務持續計畫 (BCP)", required: false },
    ],
    "4-06": [
        { id: "d-infosec-policy", label: "資訊安全政策文件", gri: "GRI 418-1", required: true },
        { id: "d-certifications", label: "資安認證書 (如 ISO 27001)", required: false },
        { id: "d-incident-log", label: "年度資安事件統計", gri: "GRI 418-1", required: false },
    ],
    "4-07": [
        { id: "d-memberships", label: "社團與組織參與清單", gri: "GRI 2-28", required: true },
    ],
    "4-08": [
        { id: "d-product-quality", label: "產品品質規範 & 認證", gri: "GRI 416-1", required: true },
        { id: "d-customer-satisfaction", label: "客戶滿意度調查報告", required: false },
        { id: "d-recall-log", label: "產品召回/抱怨統計 (如有)", gri: "GRI 417-2", required: false },
    ],
    "4-09": [
        { id: "d-supplier-criteria", label: "供應商篩選與評估標準", gri: "GRI 308-1", required: true },
        { id: "d-supplier-audit", label: "供應商稽核記錄", gri: "GRI 308-2", required: true },
        { id: "d-supplier-coc", label: "供應商行為準則 (Supplier CoC)", required: false },
    ],
    "5-01": [
        { id: "d-headcount", label: "員工人數統計表 (依性別/區域)", gri: "GRI 2-7", required: true },
        { id: "d-training-hours", label: "教育訓練時數統計", gri: "GRI 404-1", required: true },
        { id: "d-performance-review", label: "績效考核制度說明", gri: "GRI 404-3", required: false },
        { id: "d-turnover", label: "員工異動率報表", gri: "GRI 401-1", required: false },
    ],
    "5-02": [
        { id: "d-ohs-policy", label: "職業安全衛生政策", gri: "GRI 403-1", required: true },
        { id: "d-injury-stats", label: "職災統計表 (TRIR/LTIFR)", gri: "GRI 403-9", required: true },
        { id: "d-ohs-committee", label: "職安委員會會議記錄", gri: "GRI 403-1", required: false },
    ],
    "5-03": [
        { id: "d-community-investment", label: "社區投入/社會責任投資明細", gri: "GRI 413-1", required: true },
        { id: "d-impact-assessment-social", label: "社區影響評估報告", gri: "GRI 413-1", required: false },
    ],
    "6-01": [
        { id: "d-tcfd-report", label: "TCFD 氣候相關報告", gri: "GRI 201-2", required: true },
        { id: "d-physical-risk", label: "實體風險評估報告", gri: "TCFD", required: true },
        { id: "d-transition-plan", label: "低碳轉型計畫書", gri: "TCFD", required: false },
    ],
    "6-02": [
        { id: "d-ghg-inventory", label: "溫室氣體盤查清冊 (Scope 1/2/3)", gri: "GRI 305-1~3", required: true },
        { id: "d-ghg-verification", label: "第三方查證聲明書", gri: "GRI 305-1", required: true },
        { id: "d-reduction-targets", label: "減碳目標及基準年說明", gri: "GRI 305-5", required: false },
    ],
    "6-03": [
        { id: "d-energy-consumption", label: "能源消耗統計表 (電/油/氣)", gri: "GRI 302-1", required: true },
        { id: "d-renewable-usage", label: "再生能源使用記錄", gri: "GRI 302-1", required: false },
        { id: "d-energy-intensity", label: "能源密集度計算說明", gri: "GRI 302-3", required: false },
    ],
    "6-04": [
        { id: "d-water-stats", label: "用水量統計 (總取水量/類別)", gri: "GRI 303-5", required: true },
        { id: "d-water-stress", label: "水資源壓力地圖 (如有)", gri: "GRI 303-1", required: false },
    ],
    "6-05": [
        { id: "d-waste-stats", label: "廢棄物統計報表 (危/非危)", gri: "GRI 306-3", required: true },
        { id: "d-waste-disposal", label: "廢棄物處置方式說明", gri: "GRI 306-4", required: true },
        { id: "d-waste-reduction-plan", label: "廢棄物減量目標", required: false },
    ],
    "7-01": [
        { id: "d-gri-index-table", label: "GRI 內容索引完整表格", gri: "GRI 2-3", required: true },
    ],
    "7-02": [
        { id: "d-tcfd-index", label: "TCFD 指標對應表", required: true },
        { id: "d-climate-data-tables", label: "氣候相關財務量化數據", required: false },
    ],
    "7-03": [
        { id: "d-sasb-industry", label: "SASB 產業別永續指標表", required: true },
    ],
    "7-04": [
        { id: "d-other-frameworks", label: "其他準則 (SASB/CDP) 對照索引", required: false },
    ],
    "7-05": [
        { id: "d-assurance-statement", label: "第三方確信機構意見書 (原件)", gri: "GRI 2-5", required: true },
    ],
    "7-06": [
        { id: "d-appendix-other", label: "其他補充附件", required: false },
    ],
};

/** 取得某章節必要單據 */
export function getRequiredDocs(chapterId: string): RequiredDoc[] {
    return CHAPTER_REQUIRED_DOCS[chapterId] || [];
}
