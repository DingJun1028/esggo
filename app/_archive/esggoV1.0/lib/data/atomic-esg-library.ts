/**
 * Atomic ESG Indicator Data Library
 * 原子組件型 ESG 資料規範庫 — 指標資料集
 *
 * Structure: category (E/S/G/D) → subcategory → indicator atoms
 */

import { AtomicESGIndicator } from "@/lib/types/atomic-esg-types";

export const ATOMIC_ESG_INDICATORS: AtomicESGIndicator[] = [
    // ════════════════════════
    // E — 環境面 (Environment)
    // ════════════════════════

    // 能源
    {
        id: "GRI-302-1",
        framework: "GRI",
        code: "302-1",
        title: "組織內部能源消耗量",
        titleEn: "Energy consumption within the organization",
        category: "E",
        subcategory: "能源",
        unit: "GJ",
        dataType: "number",
        validation: { required: true, min: 0 },
        description: "組織在報告期內消耗的總能源量，包含燃料、電力、蒸汽、熱能及冷卻能源。",
        gri: "GRI 302-1",
        sdg: ["SDG 7", "SDG 13"],
        exampleValue: "12,500 GJ",
        hint: "請填寫本年度組織內部電力及燃料的消耗總量（GJ）",
    },
    {
        id: "GRI-302-3",
        framework: "GRI",
        code: "302-3",
        title: "能源密集度",
        titleEn: "Energy intensity",
        category: "E",
        subcategory: "能源",
        unit: "GJ / 百萬元台幣",
        dataType: "number",
        validation: { required: false, min: 0 },
        description: "每單位產出或活動的能源消耗比率，反映能源使用效率。",
        gri: "GRI 302-3",
        sdg: ["SDG 7"],
        hint: "能源消耗(GJ) ÷ 營業收入(百萬元)",
        relatedIndicators: ["GRI-302-1"],
    },
    {
        id: "GRI-302-4",
        framework: "GRI",
        code: "302-4",
        title: "能源消耗減少量",
        titleEn: "Reduction of energy consumption",
        category: "E",
        subcategory: "能源",
        unit: "GJ",
        dataType: "number",
        validation: { required: false, min: 0 },
        description: "因採取節能措施而減少的能源量，應說明所用的計算方法。",
        gri: "GRI 302-4",
        sdg: ["SDG 7", "SDG 13"],
        hint: "相較基準年之減少量（GJ），如零請填 0",
    },

    // 溫室氣體
    {
        id: "GRI-305-1",
        framework: "GRI",
        code: "305-1",
        title: "直接溫室氣體排放 (Scope 1)",
        titleEn: "Direct GHG emissions (Scope 1)",
        category: "E",
        subcategory: "溫室氣體",
        unit: "公噸 CO₂e",
        dataType: "number",
        validation: { required: true, min: 0 },
        description: "組織擁有或控制的排放源所產生的直接溫室氣體排放量。",
        gri: "GRI 305-1",
        sdg: ["SDG 13"],
        exampleValue: "3,200 公噸 CO₂e",
        hint: "填入 ISO 14064 查證後的直接排放量（公噸 CO₂當量）",
    },
    {
        id: "GRI-305-2",
        framework: "GRI",
        code: "305-2",
        title: "能源間接溫室氣體排放 (Scope 2)",
        titleEn: "Energy indirect GHG emissions (Scope 2)",
        category: "E",
        subcategory: "溫室氣體",
        unit: "公噸 CO₂e",
        dataType: "number",
        validation: { required: true, min: 0 },
        description: "組織購買電力、蒸汽、熱能或冷卻能源所產生的間接溫室氣體排放量。",
        gri: "GRI 305-2",
        sdg: ["SDG 13"],
        exampleValue: "1,850 公噸 CO₂e",
        hint: "外購電力排放量，建議採市場基礎法與位置基礎法分別揭露",
    },
    {
        id: "GRI-305-3",
        framework: "GRI",
        code: "305-3",
        title: "其他間接溫室氣體排放 (Scope 3)",
        titleEn: "Other indirect GHG emissions (Scope 3)",
        category: "E",
        subcategory: "溫室氣體",
        unit: "公噸 CO₂e",
        dataType: "number",
        validation: { required: false, min: 0 },
        description: "組織活動所導致的其他間接排放，包含上下游供應鏈、員工商務旅行等。",
        gri: "GRI 305-3",
        sdg: ["SDG 13"],
        hint: "非必填，但建議逐步盤查。可填寫已知類別的排放量。",
    },
    {
        id: "GRI-305-4",
        framework: "GRI",
        code: "305-4",
        title: "溫室氣體排放密集度",
        titleEn: "GHG emissions intensity",
        category: "E",
        subcategory: "溫室氣體",
        unit: "公噸 CO₂e / 百萬元台幣",
        dataType: "number",
        validation: { required: false, min: 0 },
        description: "每單位產出的溫室氣體排放比率，反映去碳化進展。",
        gri: "GRI 305-4",
        relatedIndicators: ["GRI-305-1", "GRI-305-2"],
    },

    // 水資源
    {
        id: "GRI-303-3",
        framework: "GRI",
        code: "303-3",
        title: "總取水量",
        titleEn: "Water withdrawal",
        category: "E",
        subcategory: "水資源",
        unit: "百萬公升 (ML)",
        dataType: "number",
        validation: { required: false, min: 0 },
        description: "組織從所有水源取水的總量。",
        gri: "GRI 303-3",
        sdg: ["SDG 6"],
        hint: "填入所有水源（地下水、市政供水、地表水、海水）的年度取水總量",
    },
    {
        id: "GRI-303-4",
        framework: "GRI",
        code: "303-4",
        title: "總排水量",
        titleEn: "Water discharge",
        category: "E",
        subcategory: "水資源",
        unit: "百萬公升 (ML)",
        dataType: "number",
        validation: { required: false, min: 0 },
        description: "組織向所有排放目的地排放的水總量。",
        gri: "GRI 303-4",
        sdg: ["SDG 6"],
    },

    // 廢棄物
    {
        id: "GRI-306-3",
        framework: "GRI",
        code: "306-3",
        title: "廢棄物產生量",
        titleEn: "Waste generated",
        category: "E",
        subcategory: "廢棄物",
        unit: "公噸",
        dataType: "number",
        validation: { required: false, min: 0 },
        description: "組織在報告期間產生的廢棄物總量（有害廢棄物及無害廢棄物）。",
        gri: "GRI 306-3",
        sdg: ["SDG 12"],
    },

    // ════════════════════════
    // S — 社會面 (Social)
    // ════════════════════════

    // 員工
    {
        id: "GRI-2-7",
        framework: "GRI",
        code: "2-7",
        title: "員工總數",
        titleEn: "Employees",
        category: "S",
        subcategory: "員工",
        unit: "人",
        dataType: "number",
        validation: { required: true, min: 0 },
        description: "報告期末的組織員工總人數，應按性別、就業類型及地區分類披露。",
        gri: "GRI 2-7",
        sdg: ["SDG 8"],
        exampleValue: "1,250 人",
    },
    {
        id: "GRI-401-1-hire",
        framework: "GRI",
        code: "401-1a",
        title: "新進員工人數及比率",
        titleEn: "New employee hires",
        category: "S",
        subcategory: "員工",
        unit: "人 / %",
        dataType: "text",
        validation: { required: false },
        description: "報告期內新招募的員工總數及占全體員工的比率，按年齡組別和性別分類。",
        gri: "GRI 401-1",
        sdg: ["SDG 8"],
        hint: "格式範例：新進 120 人 / 比率 9.6%",
    },
    {
        id: "GRI-401-1-turnover",
        framework: "GRI",
        code: "401-1b",
        title: "員工離職人數及比率",
        titleEn: "Employee turnover",
        category: "S",
        subcategory: "員工",
        unit: "%",
        dataType: "percentage",
        validation: { required: false, min: 0, max: 100 },
        description: "報告期內離職員工占全體員工的比率。",
        gri: "GRI 401-1",
        sdg: ["SDG 8"],
    },
    {
        id: "GRI-404-1",
        framework: "GRI",
        code: "404-1",
        title: "每位員工平均受訓時數",
        titleEn: "Average hours of training per year per employee",
        category: "S",
        subcategory: "訓練與教育",
        unit: "小時/人/年",
        dataType: "number",
        validation: { required: false, min: 0 },
        description: "組織員工在報告期內接受訓練的平均時數，按性別和員工類別分類。",
        gri: "GRI 404-1",
        sdg: ["SDG 4", "SDG 8"],
    },
    {
        id: "GRI-405-1",
        framework: "GRI",
        code: "405-1",
        title: "治理機構及員工多元化",
        titleEn: "Diversity of governance bodies and employees",
        category: "S",
        subcategory: "多元共融",
        unit: "%",
        dataType: "percentage",
        validation: { required: false, min: 0, max: 100 },
        description: "董事會及員工按性別及年齡組別的比例。",
        gri: "GRI 405-1",
        sdg: ["SDG 5", "SDG 10"],
        hint: "填入女性員工比例（%）",
    },
    {
        id: "GRI-403-9",
        framework: "GRI",
        code: "403-9",
        title: "工作相關傷害",
        titleEn: "Work-related injuries",
        category: "S",
        subcategory: "職業健康安全",
        unit: "件",
        dataType: "number",
        validation: { required: false, min: 0 },
        description: "報告期內員工發生的職業傷害事故件數（含職業病）。",
        gri: "GRI 403-9",
        sdg: ["SDG 3", "SDG 8"],
    },

    // ════════════════════════
    // G — 治理面 (Governance)
    // ════════════════════════
    {
        id: "GRI-2-9",
        framework: "GRI",
        code: "2-9",
        title: "治理架構及組成",
        titleEn: "Governance structure and composition",
        category: "G",
        subcategory: "董事會",
        unit: "人",
        dataType: "number",
        validation: { required: true, min: 0 },
        description: "最高治理機構及其委員會的組成，包含成員人數、性別、任期及獨立性。",
        gri: "GRI 2-9",
        hint: "填入董事會總人數（包含獨立董事）",
    },
    {
        id: "GRI-2-9-ind",
        framework: "GRI",
        code: "2-9b",
        title: "獨立董事比例",
        titleEn: "Independent board members ratio",
        category: "G",
        subcategory: "董事會",
        unit: "%",
        dataType: "percentage",
        validation: { required: true, min: 0, max: 100 },
        description: "最高治理機構成員中，獨立非執行董事的比例。",
        gri: "GRI 2-9",
        hint: "獨立董事人數 ÷ 董事會總人數 × 100%",
        relatedIndicators: ["GRI-2-9"],
    },
    {
        id: "GRI-2-16",
        framework: "GRI",
        code: "2-16",
        title: "重大關切事項溝通",
        titleEn: "Communication of critical concerns",
        category: "G",
        subcategory: "道德誠信",
        unit: "件",
        dataType: "number",
        validation: { required: false, min: 0 },
        description: "報告期內向最高治理機構溝通的重大關切事項件數及性質。",
        gri: "GRI 2-16",
    },
    {
        id: "GRI-205-3",
        framework: "GRI",
        code: "205-3",
        title: "確認腐敗事件及採取的行動",
        titleEn: "Confirmed incidents of corruption and actions taken",
        category: "G",
        subcategory: "反腐敗",
        unit: "件",
        dataType: "number",
        validation: { required: false, min: 0 },
        description: "報告期內經確認的腐敗事件件數及採取的行動。",
        gri: "GRI 205-3",
        sdg: ["SDG 16"],
        hint: "若本年度無腐敗事件，請填 0",
    },

    // ════════════════════════
    // D — 數位面 (Digital)
    // ════════════════════════
    {
        id: "D-DATA-1",
        framework: "TWSE",
        code: "D-1",
        title: "數位化資料治理政策",
        titleEn: "Digital data governance policy",
        category: "D",
        subcategory: "資料治理",
        unit: "是/否",
        dataType: "boolean",
        validation: { required: false },
        description: "組織是否已制定完整的數位化資料治理政策並公開揭露。",
        hint: "請選擇：已制定 / 尚未制定",
    },
    {
        id: "D-CYBER-1",
        framework: "TWSE",
        code: "D-2",
        title: "資安事件件數",
        titleEn: "Cybersecurity incidents",
        category: "D",
        subcategory: "資訊安全",
        unit: "件",
        dataType: "number",
        validation: { required: false, min: 0 },
        description: "報告期內影響業務營運的重大資安事件件數。",
        hint: "若本年度無資安事件，請填 0",
    },
    {
        id: "D-AI-1",
        framework: "TWSE",
        code: "D-3",
        title: "AI 治理政策",
        titleEn: "AI governance policy",
        category: "D",
        subcategory: "AI 治理",
        unit: "是/否",
        dataType: "boolean",
        validation: { required: false },
        description: "組織是否有針對 AI 使用與風險管理制定治理政策。",
    },
];

// ─────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────

export function getIndicatorsByCategory(category: "E" | "S" | "G" | "D") {
    return ATOMIC_ESG_INDICATORS.filter((i) => i.category === category);
}

export function getIndicatorByCode(id: string) {
    return ATOMIC_ESG_INDICATORS.find((i) => i.id === id);
}

export function getIndicatorsBySubcategory(subcategory: string) {
    return ATOMIC_ESG_INDICATORS.filter((i) => i.subcategory === subcategory);
}

export function getRequiredIndicators() {
    return ATOMIC_ESG_INDICATORS.filter((i) => i.validation.required);
}

// Get unique subcategories per category
export function getSubcategories(category: "E" | "S" | "G" | "D"): string[] {
    const cats = ATOMIC_ESG_INDICATORS
        .filter((i) => i.category === category && i.subcategory)
        .map((i) => i.subcategory as string);
    return [...new Set(cats)];
}
