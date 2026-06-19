import { z } from 'zod';

/**
 * ESG 報告標準章節結構 (5-Part Structure)
 */
export const ESGReportContentSchema = z.object({
    introduction: z.object({
        content: z.string().default(''),
        completed: z.boolean().default(false),
    }).default({ content: '', completed: false }),
    governance: z.object({
        content: z.string().default(''),
        completed: z.boolean().default(false),
    }).default({ content: '', completed: false }),
    environmental: z.object({
        content: z.string().default(''),
        completed: z.boolean().default(false),
    }).default({ content: '', completed: false }),
    social: z.object({
        content: z.string().default(''),
        completed: z.boolean().default(false),
    }).default({ content: '', completed: false }),
    appendix: z.object({
        content: z.string().default(''),
        completed: z.boolean().default(false),
    }).default({ content: '', completed: false }),
});

export type ESGReportContent = z.infer<typeof ESGReportContentSchema>;

/**
 * Omni ESG 萬能報告基礎 DTO
 */
export const OmniReportSchema = z.object({
    id: z.string().uuid().optional(),
    report_uuid: z.string(),
    name: z.string(),
    name_en: z.string().optional(),
    status: z.enum(['Draft', 'Active', 'Pending', 'Archived']),
    version: z.string(),
    owner_id: z.string().optional(),
    created_at: z.number(),
    updated_at: z.number(),
    content: ESGReportContentSchema.default({
        introduction: { content: '', completed: false },
        governance: { content: '', completed: false },
        environmental: { content: '', completed: false },
        social: { content: '', completed: false },
        appendix: { content: '', completed: false }
    }),
    evidence_uuids: z.array(z.string()).default([]),
});

export type OmniReport = z.infer<typeof OmniReportSchema>;

export type ReportCategory = 'ENV' | 'SOC' | 'GOV' | 'ALL';

export interface ReportDefinition {
    readonly id: string;
    readonly name: string;
    readonly name_en: string;
    readonly icon: string;
    readonly status: 'Active' | 'Draft' | 'Pending' | 'Archived';
    readonly version: string;
    readonly category: ReportCategory;
    readonly completionRate?: number;
    readonly standardRef?: string;
    readonly uuid?: string;
}

// ════════════════════════════════════════════════════════════
// 📦 4 大基準報告 (Phase 1 核心)
// ════════════════════════════════════════════════════════════
export const CORE_REPORTS: ReadonlyArray<ReportDefinition> = [
    {
        id: 'rep-master-2026',
        name: '2026 萬能永續主權大師報告',
        name_en: '2026 Sovereign Sustainability Master Report',
        icon: 'Sparkles',
        status: 'Active',
        version: '1.0.0',
        category: 'ALL',
        completionRate: 100,
        standardRef: 'GRI, SASB, TCFD, 5T Protocol',
        uuid: 'mod-all-master-0001',
    },
    {
        id: 'rep-carbon-001',
        name: 'ISO-14064 碳盤查報告',
        name_en: 'ISO-14064 Carbon Footprint',
        icon: 'Flame',
        status: 'Active',
        version: '1.2.0',
        category: 'ENV',
        completionRate: 78,
        standardRef: 'ISO 14064-1:2018',
        uuid: 'mod-env-carbon-0001',
    },
    {
        id: 'rep-gri-001',
        name: 'GRI 2026 永續準則揭露',
        name_en: 'GRI 2026 Standards Disclosure',
        icon: 'ShieldCheck',
        status: 'Active',
        version: '2.1.0',
        category: 'GOV',
        completionRate: 62,
        standardRef: 'GRI Standards 2021',
        uuid: 'mod-gov-gri-0001',
    },
    {
        id: 'rep-hr-001',
        name: '人力資源與職場多樣性',
        name_en: 'Human Capital & DEI Report',
        icon: 'Users',
        status: 'Draft',
        version: '1.0.5',
        category: 'SOC',
        completionRate: 35,
        standardRef: 'GRI 401, ISO 30414',
        uuid: 'mod-soc-headcount-0001',
    },
    {
        id: 'rep-governance-001',
        name: '董事會效能與治理實踐',
        name_en: 'Board Effectiveness & Governance',
        icon: 'Building2',
        status: 'Pending',
        version: '1.1.0',
        category: 'GOV',
        completionRate: 20,
        standardRef: 'GRI 2, TCFD, FSC',
        uuid: 'mod-gov-board-0001',
    },
] as const;

// ════════════════════════════════════════════════════════════
// 🌿 ENV 環境類 — Phase 2 P1 (20 個)
// ════════════════════════════════════════════════════════════
export const ENV_REPORTS: ReadonlyArray<ReportDefinition> = [
    { id: 'rep-scope1-001', name: 'Scope 1 直接排放報告', name_en: 'Scope 1 Direct Emissions', icon: 'Factory', status: 'Pending', version: '1.0.0', category: 'ENV', standardRef: 'GHG Protocol Scope 1', uuid: 'mod-env-scope1-0001' },
    { id: 'rep-scope2-001', name: 'Scope 2 外購電力報告', name_en: 'Scope 2 Energy Emissions', icon: 'Zap', status: 'Pending', version: '1.0.0', category: 'ENV', standardRef: 'GHG Protocol Scope 2', uuid: 'mod-env-scope2-0001' },
    { id: 'rep-scope3-001', name: 'Scope 3 供應鏈排放報告', name_en: 'Scope 3 Value Chain Emissions', icon: 'Network', status: 'Draft', version: '1.0.0', category: 'ENV', standardRef: 'GHG Protocol Scope 3', uuid: 'mod-env-scope3-0001' },
    { id: 'rep-carbon-intensity-001', name: '碳排放強度報告', name_en: 'Carbon Intensity Report', icon: 'BarChart2', status: 'Draft', version: '1.0.0', category: 'ENV', standardRef: 'GRI 305-4', uuid: 'mod-env-carbon-intensity-0001' },
    { id: 'rep-energy-001', name: '能源管理儀表板', name_en: 'Energy Management Dashboard', icon: 'BatteryCharging', status: 'Draft', version: '1.0.0', category: 'ENV', standardRef: 'GRI 302', uuid: 'mod-env-energy-0001' },
    { id: 'rep-water-001', name: '水資源追蹤系統', name_en: 'Water Resource Tracking', icon: 'Droplets', status: 'Draft', version: '1.0.0', category: 'ENV', standardRef: 'GRI 303', uuid: 'mod-env-water-0001' },
    { id: 'rep-waste-001', name: '廢棄物管理報告', name_en: 'Waste Management Report', icon: 'Recycle', status: 'Draft', version: '1.0.0', category: 'ENV', standardRef: 'GRI 306', uuid: 'mod-env-waste-0001' },
    { id: 'rep-supplychain-env-001', name: '供應鏈環境評估', name_en: 'Supply Chain Environmental Assessment', icon: 'Boxes', status: 'Pending', version: '1.0.0', category: 'ENV', standardRef: 'GRI 308', uuid: 'mod-env-supplychain-0001' },
    { id: 'rep-climate-risk-001', name: '氣候變遷風險評估', name_en: 'Climate Risk Assessment', icon: 'CloudLightning', status: 'Pending', version: '1.0.0', category: 'ENV', standardRef: 'TCFD', uuid: 'mod-env-climate-risk-0001' },
    { id: 'rep-biodiversity-001', name: '生物多樣性影響評估', name_en: 'Biodiversity Impact Assessment', icon: 'TreePine', status: 'Pending', version: '1.0.0', category: 'ENV', standardRef: 'GRI 304', uuid: 'mod-env-biodiversity-0001' },
    { id: 'rep-green-procurement-001', name: '綠色採購管理報告', name_en: 'Green Procurement Report', icon: 'ShoppingCart', status: 'Draft', version: '1.0.0', category: 'ENV', standardRef: 'ISO 20400', uuid: 'mod-env-green-procurement-0001' },
    { id: 'rep-circular-001', name: '循環經濟指標報告', name_en: 'Circular Economy Metrics', icon: 'RefreshCw', status: 'Draft', version: '1.0.0', category: 'ENV', standardRef: 'Ellen MacArthur Foundation', uuid: 'mod-env-circular-0001' },
    { id: 'rep-carbon-neutral-001', name: '碳中和路徑規劃', name_en: 'Carbon Neutrality Pathway', icon: 'Target', status: 'Pending', version: '1.0.0', category: 'ENV', standardRef: 'SBTi, ISO 14068', uuid: 'mod-env-carbon-neutral-0001' },
    { id: 'rep-renewable-001', name: '再生能源使用追蹤', name_en: 'Renewable Energy Tracking', icon: 'Sun', status: 'Pending', version: '1.0.0', category: 'ENV', standardRef: 'GRI 302-1, RE100', uuid: 'mod-env-renewable-0001' },
    { id: 'rep-carbon-credit-001', name: '碳權交易記錄', name_en: 'Carbon Credit Trading', icon: 'Landmark', status: 'Draft', version: '1.0.0', category: 'ENV', standardRef: 'Verra VCS, Gold Standard', uuid: 'mod-env-carbon-credit-0001' },
    { id: 'rep-climate-scenario-001', name: '氣候情境分析報告', name_en: 'Climate Scenario Analysis', icon: 'TrendingDown', status: 'Draft', version: '1.0.0', category: 'ENV', standardRef: 'TCFD, NGFS', uuid: 'mod-env-climate-scenario-0001' },
    { id: 'rep-ghg-verification-001', name: '溫室氣體盤查查證', name_en: 'GHG Inventory Verification', icon: 'BadgeCheck', status: 'Pending', version: '1.0.0', category: 'ENV', standardRef: 'ISO 14064-3', uuid: 'mod-env-verification-0001' },
    { id: 'rep-sbti-001', name: 'SBTi 科學基礎減碳目標', name_en: 'Science Based Targets', icon: 'Microscope', status: 'Pending', version: '1.0.0', category: 'ENV', standardRef: 'SBTi V2.0', uuid: 'mod-env-sbti-0001' },
    { id: 'rep-cdp-001', name: 'CDP 碳揭露回應管理', name_en: 'CDP Carbon Disclosure', icon: 'FileSearch', status: 'Draft', version: '1.0.0', category: 'ENV', standardRef: 'CDP 2026 Questionnaire', uuid: 'mod-env-cdp-0001' },
    { id: 'rep-air-quality-001', name: '空氣品質影響評估', name_en: 'Air Quality Impact', icon: 'Wind', status: 'Draft', version: '1.0.0', category: 'ENV', standardRef: 'GRI 305-7', uuid: 'mod-env-air-0001' },
] as const;

// ════════════════════════════════════════════════════════════
// 👥 SOC 社會類 — Phase 2 P1 (15 個)
// ════════════════════════════════════════════════════════════
export const SOC_REPORTS: ReadonlyArray<ReportDefinition> = [
    { id: 'rep-ohs-001', name: '職業安全健康報告', name_en: 'Occupational Health & Safety', icon: 'HeartPulse', status: 'Draft', version: '1.0.0', category: 'SOC', standardRef: 'GRI 403, ISO 45001', uuid: 'mod-soc-ohs-0001' },
    { id: 'rep-training-001', name: '人才培訓與發展報告', name_en: 'Training & Development', icon: 'GraduationCap', status: 'Draft', version: '1.0.0', category: 'SOC', standardRef: 'GRI 404', uuid: 'mod-soc-training-0001' },
    { id: 'rep-supplier-csr-001', name: '供應商社會責任評估', name_en: 'Supplier CSR Assessment', icon: 'PackageSearch', status: 'Pending', version: '1.0.0', category: 'SOC', standardRef: 'GRI 308, GRI 414', uuid: 'mod-soc-supplier-csr-0001' },
    { id: 'rep-community-001', name: '社區投資影響分析', name_en: 'Community Investment Impact', icon: 'Home', status: 'Pending', version: '1.0.0', category: 'SOC', standardRef: 'GRI 413', uuid: 'mod-soc-community-0001' },
    { id: 'rep-customer-sat-001', name: '客戶滿意度報告', name_en: 'Customer Satisfaction Report', icon: 'Star', status: 'Draft', version: '1.0.0', category: 'SOC', standardRef: 'GRI 418', uuid: 'mod-soc-customer-sat-0001' },
    { id: 'rep-dei-001', name: '多元化與包容性報告', name_en: 'Diversity, Equity & Inclusion', icon: 'Globe', status: 'Pending', version: '1.0.0', category: 'SOC', standardRef: 'GRI 405', uuid: 'mod-soc-dei-0001' },
    { id: 'rep-pay-equity-001', name: '薪酬公平性分析', name_en: 'Pay Equity Analysis', icon: 'Scale', status: 'Draft', version: '1.0.0', category: 'SOC', standardRef: 'GRI 405-2', uuid: 'mod-soc-pay-equity-0001' },
    { id: 'rep-conflict-mineral-001', name: '衝突礦產盡職調查', name_en: 'Conflict Minerals Due Diligence', icon: 'AlertOctagon', status: 'Pending', version: '1.0.0', category: 'SOC', standardRef: 'OECD Guidance, SEC Rule', uuid: 'mod-soc-conflict-mineral-0001' },
    { id: 'rep-human-rights-001', name: '人權盡職調查報告', name_en: 'Human Rights Due Diligence', icon: 'HandHeart', status: 'Pending', version: '1.0.0', category: 'SOC', standardRef: 'UN Guiding Principles, GRI 408-410', uuid: 'mod-soc-human-rights-0001' },
    { id: 'rep-labor-001', name: '勞動條件監控報告', name_en: 'Labor Conditions Monitoring', icon: 'HardHat', status: 'Draft', version: '1.0.0', category: 'SOC', standardRef: 'GRI 401, ILO', uuid: 'mod-soc-labor-0001' },
    { id: 'rep-engagement-001', name: '員工敬業度調查', name_en: 'Employee Engagement Survey', icon: 'TrendingUp', status: 'Draft', version: '1.0.0', category: 'SOC', standardRef: 'GRI 401-3', uuid: 'mod-soc-engagement-0001' },
    { id: 'rep-supplier-enable-001', name: '供應商賦能輔導報告', name_en: 'Supplier Enablement Report', icon: 'Lightbulb', status: 'Pending', version: '1.0.0', category: 'SOC', standardRef: 'GRI 204', uuid: 'mod-soc-supplier-enable-0001' },
    { id: 'rep-sroi-001', name: 'SROI 社會投資報酬率', name_en: 'Social Return on Investment', icon: 'PieChart', status: 'Pending', version: '1.0.0', category: 'SOC', standardRef: 'SROI Network Guide V2', uuid: 'mod-soc-sroi-0001' },
    { id: 'rep-philanthropy-001', name: '公益慈善影響報告', name_en: 'Philanthropy Impact Report', icon: 'Heart', status: 'Draft', version: '1.0.0', category: 'SOC', standardRef: 'GRI 203', uuid: 'mod-soc-philanthropy-0001' },
    { id: 'rep-gender-equality-001', name: '性別平等報告', name_en: 'Gender Equality Report', icon: 'UserCheck', status: 'Draft', version: '1.0.0', category: 'SOC', standardRef: 'GRI 405, UN SDG 5', uuid: 'mod-soc-gender-0001' },
] as const;

// ════════════════════════════════════════════════════════════
// 🏛 GOV 治理類 — Phase 2 P1 (10 個)
// ════════════════════════════════════════════════════════════
export const GOV_REPORTS: ReadonlyArray<ReportDefinition> = [
    { id: 'rep-risk-001', name: '風險管理框架報告', name_en: 'Risk Management Framework', icon: 'ShieldAlert', status: 'Draft', version: '1.0.0', category: 'GOV', standardRef: 'TCFD, COSO ERM', uuid: 'mod-gov-risk-0001' },
    { id: 'rep-compliance-001', name: '合規監控儀表板', name_en: 'Compliance Monitoring Dashboard', icon: 'CheckSquare', status: 'Pending', version: '1.0.0', category: 'GOV', standardRef: 'GRI 2-27, ISO 37301', uuid: 'mod-gov-compliance-0001' },
    { id: 'rep-ethics-001', name: '道德與反貪腐培訓報告', name_en: 'Ethics & Anti-Corruption', icon: 'Award', status: 'Draft', version: '1.0.0', category: 'GOV', standardRef: 'GRI 205, UN UNCAC', uuid: 'mod-gov-ethics-0001' },
    { id: 'rep-ind-director-001', name: '獨立董事效能評估', name_en: 'Independent Director Effectiveness', icon: 'UserCog', status: 'Pending', version: '1.0.0', category: 'GOV', standardRef: 'FSC 1.1.4, TCFD', uuid: 'mod-gov-ind-director-0001' },
    { id: 'rep-comp-committee-001', name: '薪酬委員會運作報告', name_en: 'Compensation Committee Report', icon: 'Wallet', status: 'Draft', version: '1.0.0', category: 'GOV', standardRef: 'GRI 2-19', uuid: 'mod-gov-comp-committee-0001' },
    { id: 'rep-audit-001', name: '審計委員會效能評估', name_en: 'Audit Committee Effectiveness', icon: 'ClipboardCheck', status: 'Draft', version: '1.0.0', category: 'GOV', standardRef: 'GRI 2-17', uuid: 'mod-gov-audit-0001' },
    { id: 'rep-internal-control-001', name: '內部控制系統評估', name_en: 'Internal Control Assessment', icon: 'Shield', status: 'Draft', version: '1.0.0', category: 'GOV', standardRef: 'COSO IC-IF, ICOFR', uuid: 'mod-gov-internal-control-0001' },
    { id: 'rep-infosec-001', name: '資訊安全治理報告', name_en: 'Information Security Governance', icon: 'Lock', status: 'Draft', version: '1.0.0', category: 'GOV', standardRef: 'ISO 27001, NIST CSF', uuid: 'mod-gov-infosec-0001' },
    { id: 'rep-privacy-001', name: '資料隱私保護合規', name_en: 'Data Privacy Compliance', icon: 'Database', status: 'Pending', version: '1.0.0', category: 'GOV', standardRef: 'GDPR, PDPA, ISO 27701', uuid: 'mod-gov-privacy-0001' },
    { id: 'rep-tax-transparency-001', name: '稅務透明報告', name_en: 'Tax Transparency Report', icon: 'Receipt', status: 'Draft', version: '1.0.0', category: 'GOV', standardRef: 'GRI 207, OECD BEPS', uuid: 'mod-gov-tax-0001' },
] as const;

// ════════════════════════════════════════════════════════════
// 📊 ALL 彙整
// ════════════════════════════════════════════════════════════
export const ALL_REPORTS: ReadonlyArray<ReportDefinition> = [
    ...CORE_REPORTS,
    ...ENV_REPORTS,
    ...SOC_REPORTS,
    ...GOV_REPORTS,
];

/** 按分類取得報告 */
export function getReportsByCategory(category: ReportCategory): ReadonlyArray<ReportDefinition> {
    if (category === 'ALL') return ALL_REPORTS;
    return ALL_REPORTS.filter(r => r.category === category);
}

/** 按 ID 取得報告 */
export function getReportById(id: string): ReportDefinition | undefined {
    return ALL_REPORTS.find(r => r.id === id);
}

/** 報告統計摘要 */
export function getReportStats() {
    const total = ALL_REPORTS.length;
    const active = ALL_REPORTS.filter(r => r.status === 'Active').length;
    const draft = ALL_REPORTS.filter(r => r.status === 'Draft').length;
    const pending = ALL_REPORTS.filter(r => r.status === 'Pending').length;
    const env = ALL_REPORTS.filter(r => r.category === 'ENV').length;
    const soc = ALL_REPORTS.filter(r => r.category === 'SOC').length;
    const gov = ALL_REPORTS.filter(r => r.category === 'GOV').length;
    return { total, active, draft, pending, env, soc, gov };
}
