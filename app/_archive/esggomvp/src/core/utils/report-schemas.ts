export interface ReportField {
    id: string;
    type: 'string' | 'number' | 'text' | 'date' | 'select';
    label: string;
    required?: boolean;
    placeholder?: string;
    description?: string;
    options?: { label: string; value: any }[];
}

export interface ReportSection {
    id: string;
    title: string;
    fields: ReportField[];
}

export interface ReportSchema {
    reportId: string;
    title: string;
    sections: ReportSection[];
}

/**
 * 報告 Schema 對照表
 * Key 格式：報告 ID (對齊 report-schema.dto.ts 的 id 欄位)
 * 亦兼容舊版短 key (carbon-footprint, gri-standard 等)
 */
export const ReportSchemas: Record<string, ReportSchema> = {
    'rep-master-2026': {
        reportId: 'rep-master-2026',
        title: '2026 萬能永續主權大師報告',
        sections: [
            { id: 'env', title: '環境永續 (Environmental)', fields: [] },
            { id: 'soc', title: '社會責任 (Social)', fields: [] },
            { id: 'gov', title: '公司治理 (Governance)', fields: [] },
            { id: '5t', title: '5T 協議 (5T Protocol)', fields: [] },
        ]
    },
    // ── 碳足跡 ─────────────────────────────────────────────────────────────
    'rep-carbon-001': {
        reportId: 'rep-carbon-001',
        title: 'ISO-14064-1 組織溫室氣體盤查報告',
        sections: [
            {
                id: 'sec-boundary',
                title: '1. 組織邊界設定 (Boundary)',
                fields: [
                    { id: 'company_name', type: 'string', label: '企業申報主體 (Company)', required: true },
                    { id: 'reporting_year', type: 'number', label: '盤查年度 (Year)', required: true },
                    { id: 'boundary_approach', type: 'string', label: '邊界方法 (Boundary Approach)', required: true, placeholder: '例：營運控制法' },
                ],
            },
            {
                id: 'sec-scope1',
                title: '2. 範疇一：直接排放 (Scope 1)',
                fields: [
                    { id: 'scope_1_stationary', type: 'number', label: '固定燃燒排放 (tCO₂e)', required: true },
                    { id: 'scope_1_mobile', type: 'number', label: '移動燃燒排放 (tCO₂e)', required: true },
                    { id: 'scope_1_fugitive', type: 'number', label: '逸散性排放 (tCO₂e)' },
                ],
            },
            {
                id: 'sec-scope2',
                title: '3. 範疇二：外購能源 (Scope 2)',
                fields: [
                    { id: 'scope_2_electricity_kwh', type: 'number', label: '外購電力 (kWh)', required: true },
                    { id: 'scope_2', type: 'number', label: '外購電力碳排 (tCO₂e)', required: true, description: '依台電排放係數換算。' },
                ],
            },
            {
                id: 'sec-scope3',
                title: '4. 範疇三：其他間接排放 (Scope 3)',
                fields: [
                    { id: 'scope_3', type: 'number', label: '範疇三合計 (tCO₂e)', description: '供應鏈上下游排放，選填。' },
                    { id: 'scope_3_business_travel', type: 'number', label: '員工差旅 (tCO₂e)' },
                ],
            },
            {
                id: 'sec-summary',
                title: '5. 總量彙整 (Summary)',
                fields: [
                    { id: 'total_ghg', type: 'number', label: '溫室氣體總排放量 (tCO₂e)', required: true },
                    { id: 'carbon_intensity', type: 'number', label: '碳排放強度 (tCO₂e/百萬元)' },
                    { id: 'verification_body', type: 'string', label: '第三方查證機構', placeholder: 'e.g., Bureau Veritas' },
                ],
            },
        ],
    },
    // 短 key 兼容（舊版 edit page 可能使用）
    'carbon-footprint': {
        reportId: 'carbon-footprint',
        title: 'ISO-14064-1 組織溫室氣體盤查報告',
        sections: [
            {
                id: 'sec-1',
                title: '1. 基礎宣告 (Base Info)',
                fields: [
                    { id: 'company_name', type: 'string', label: '企業申報主體 (Company Hub)', required: true },
                    { id: 'reporting_year', type: 'number', label: '盤查年度 (Reporting Year)', required: true },
                ],
            },
            {
                id: 'sec-2',
                title: '2. 溫室氣體排放量 (Emissions)',
                fields: [
                    { id: 'scope_1', type: 'number', label: '直接排放 Scope 1 (tCO2e)', required: true, description: '包含固定燃燒、製程排放等。' },
                    { id: 'scope_2', type: 'number', label: '間接能源排放 Scope 2 (tCO2e)', required: true, description: '外購電力或蒸汽。' },
                    { id: 'scope_3', type: 'number', label: '其他間接排放 Scope 3 (tCO2e)', description: '供應鏈上下游排放，目前為選填。' },
                ],
            },
        ],
    },

    // ── GRI 2026 ────────────────────────────────────────────────────────────
    'rep-gri-001': {
        reportId: 'rep-gri-001',
        title: 'GRI 2026 永續準則揭露',
        sections: [
            {
                id: 'gri-base',
                title: 'GRI 2: 一般揭露 (General Disclosures)',
                fields: [
                    { id: 'org_details', type: 'text', label: '2-1 組織詳細資訊', required: true, placeholder: '總部位置與營運據點...' },
                    { id: 'gov_structure', type: 'text', label: '2-9 治理架構及組成', required: true, placeholder: '描述董事會及高階管理層架構...' },
                    { id: 'employees_total', type: 'number', label: '2-7 員工總數 (人)', required: true },
                ],
            },
            {
                id: 'gri-materiality',
                title: 'GRI 3: 重大主題 (Material Topics)',
                fields: [
                    { id: 'material_topics', type: 'text', label: '3-2 決定重大主題的過程', required: true },
                    { id: 'material_topics_list', type: 'text', label: '3-2 重大主題列表', placeholder: '例如：碳排放管理、人才培育、資安治理' },
                ],
            },
            {
                id: 'gri-energy',
                title: 'GRI 302: 能源 (Energy)',
                fields: [
                    { id: 'energy_gj', type: 'number', label: '302-1 能源消耗總量 (GJ)', required: true },
                    { id: 'renewable_pct', type: 'number', label: '再生能源使用比例 (%)' },
                ],
            },
            {
                id: 'gri-water',
                title: 'GRI 303: 水與廢水 (Water)',
                fields: [
                    { id: 'water_withdrawal_ml', type: 'number', label: '303-3 總取水量 (ML)' },
                ],
            },
        ],
    },
    'gri-standard': {
        reportId: 'gri-standard',
        title: 'GRI 通用準則永續報告 (GRI Sustainability)',
        sections: [
            {
                id: 'gri-base',
                title: 'GRI 2: 一般揭露 (General Disclosures)',
                fields: [
                    { id: 'org_details', type: 'text', label: '2-1 組織詳細資訊', required: true, placeholder: '總部位置與營運據點...' },
                    { id: 'gov_structure', type: 'text', label: '2-9 治理架構及組成', required: true, placeholder: '描述董事會及高階管理層架構...' },
                ],
            },
            {
                id: 'gri-materiality',
                title: 'GRI 3: 重大主題 (Material Topics)',
                fields: [
                    { id: 'material_topics', type: 'text', label: '3-2 決定重大主題的過程', required: true },
                ],
            },
        ],
    },

    // ── 人力資源 ────────────────────────────────────────────────────────────
    'rep-hr-001': {
        reportId: 'rep-hr-001',
        title: '人力資源與職場多樣性報告',
        sections: [
            {
                id: 'hr-headcount',
                title: '1. 員工人數與結構 (Headcount)',
                fields: [
                    { id: 'total_employees', type: 'number', label: '員工總數 (人)', required: true },
                    { id: 'full_time', type: 'number', label: '正職員工 (人)', required: true },
                    { id: 'female_ratio', type: 'number', label: '女性員工比例 (%)', required: true },
                    { id: 'female_manager_pct', type: 'number', label: '女性管理職佔比 (%)' },
                ],
            },
            {
                id: 'hr-training',
                title: '2. 培訓與發展 (Training)',
                fields: [
                    { id: 'training_hours_total', type: 'number', label: '培訓總時數 (hr)', required: true },
                    { id: 'training_per_capita', type: 'number', label: '人均培訓時數 (hr/人)', required: true },
                ],
            },
            {
                id: 'hr-ohs',
                title: '3. 職業安全衛生 (OHS)',
                fields: [
                    { id: 'injury_rate', type: 'number', label: '職業傷害率 (次/百萬工時)', required: true },
                    { id: 'fatalities', type: 'number', label: '工安死亡事故 (件)', required: true },
                ],
            },
            {
                id: 'hr-turnover',
                title: '4. 人員流動 (Turnover)',
                fields: [
                    { id: 'turnover_rate', type: 'number', label: '年度離職率 (%)', required: true },
                    { id: 'parental_return_rate', type: 'number', label: '育嬰留任率 (%)' },
                ],
            },
        ],
    },
    'workforce': {
        reportId: 'workforce',
        title: '勞動力結構與多元化報告 (Workforce & Diversity)',
        sections: [
            {
                id: 'hr-demographics',
                title: '人力結構分析 (Demographics)',
                fields: [
                    { id: 'total_employees', type: 'number', label: '總員工人數 (Total Employees)', required: true },
                    { id: 'female_ratio', type: 'number', label: '女性員工比例 (%)', required: true },
                    { id: 'turnover_rate', type: 'number', label: '年度離職率 (%)', required: true },
                ],
            },
        ],
    },

    // ── 董事會治理 ──────────────────────────────────────────────────────────
    'rep-governance-001': {
        reportId: 'rep-governance-001',
        title: '董事會效能與治理實踐',
        sections: [
            {
                id: 'gov-board',
                title: '1. 董事會組成 (Board Composition)',
                fields: [
                    { id: 'total_directors', type: 'number', label: '董事總席次', required: true },
                    { id: 'independent_directors', type: 'number', label: '獨立董事席次', required: true },
                    { id: 'female_directors', type: 'number', label: '女性董事席次', required: true },
                    { id: 'board_meetings', type: 'number', label: '年度董事會開會次數', required: true },
                    { id: 'avg_attendance', type: 'number', label: '董事平均出席率 (%)', required: true },
                ],
            },
            {
                id: 'gov-esg',
                title: '2. ESG 治理架構 (ESG Governance)',
                fields: [
                    { id: 'esg_committee', type: 'string', label: 'ESG/永續委員會狀態', placeholder: '已設立 / 規劃中 / 未設立' },
                    { id: 'board_esg_desc', type: 'text', label: '董事會 ESG 監督機制說明', required: true },
                    { id: 'tcfd_alignment', type: 'string', label: 'TCFD 符合程度', placeholder: '完整揭露 / 部分揭露 / 尚未揭露' },
                ],
            },
            {
                id: 'gov-ethics',
                title: '3. 商業倫理 (Business Ethics)',
                fields: [
                    { id: 'code_of_conduct', type: 'string', label: '行為準則/倫理政策狀態' },
                    { id: 'whistleblower', type: 'string', label: '吹哨者保護機制' },
                    { id: 'ethics_coverage', type: 'number', label: '道德培訓涵蓋率 (%)' },
                ],
            },
        ],
    },
    'board-effectiveness': {
        reportId: 'board-effectiveness',
        title: '董事會效能與獨立性評估 (Board Effectiveness)',
        sections: [
            {
                id: 'gov-board',
                title: '董事會組成與獨立性',
                fields: [
                    { id: 'total_directors', type: 'number', label: '董事總席次 (Total Directors)', required: true },
                    { id: 'independent_directors', type: 'number', label: '獨立董事席次 (Independent Directors)', required: true },
                    { id: 'female_directors', type: 'number', label: '女性董事席次 (Female Directors)', required: true },
                    { id: 'board_meetings', type: 'number', label: '年度董事會開會次數', required: true },
                ],
            },
        ],
    },
    // ── 測試與萬能 Alias (Test Aliases) ──────────────────────────────────────
    'test-report': {
        reportId: 'test-report',
        title: 'OMNI 整合測試報告 (Integrity Test)',
        sections: [
            {
                id: 'test-sec-1',
                title: '核心指標測試',
                fields: [
                    { id: 'scope_1', type: 'number', label: '範疇一 (Scope 1)', required: true },
                    { id: 'scope_2', type: 'number', label: '範疇二 (Scope 2)', required: true },
                    { id: 'revenue', type: 'number', label: '年度營收 (Revenue)', required: true },
                ]
            }
        ]
    },
    'carbon-report-2024': {
        reportId: 'carbon-report-2024',
        title: '2024 年度碳盤查專案 (Carbon Scan 2024)',
        sections: [
            {
                id: 'carbon-sec-1',
                title: '基礎碳排數據',
                fields: [
                    { id: 'scope_1', type: 'number', label: '直接排放 Scope 1', required: true },
                    { id: 'scope_2', type: 'number', label: '外購電力 Scope 2', required: true },
                    { id: 'company_name', type: 'string', label: '申報單位名稱', required: true }
                ]
            }
        ]
    }
};

// ════════════════════════════════════════════════════════════
// Stub Schema 產生器（Phase 2 P1 — 45 份報告）
// 在 ReportSchemas 物件定義之後動態附加，避免 TS 語法問題
// ════════════════════════════════════════════════════════════
function makeEnvStub(id: string): ReportSchema {
    return {
        reportId: id,
        title: id.replace(/-/g, ' ').toUpperCase() + ' — 草稿填寫區',
        sections: [
            {
                id: 'basic', title: '📋 基本資訊 (Basic Info)', fields: [
                    { id: 'company_name', type: 'string', label: '企業名稱', required: true },
                    { id: 'reporting_year', type: 'number', label: '報告年度', required: true },
                    { id: 'scope_boundary', type: 'string', label: '涵蓋範圍/邊界' },
                ]
            },
            {
                id: 'data', title: '📊 數據揭露 (Data Disclosure)', fields: [
                    { id: 'primary_metric', type: 'number', label: '主要指標數值', required: true },
                    { id: 'unit', type: 'string', label: '單位', required: true },
                    { id: 'calculation_method', type: 'string', label: '計算/量測方法' },
                    { id: 'notes', type: 'text', label: '補充說明' },
                ]
            },
        ],
    };
}

function makeSocStub(id: string): ReportSchema {
    return {
        reportId: id,
        title: id.replace(/-/g, ' ').toUpperCase() + ' — 社會類草稿',
        sections: [
            {
                id: 'basic', title: '👥 基本資訊', fields: [
                    { id: 'company_name', type: 'string', label: '企業名稱', required: true },
                    { id: 'reporting_year', type: 'number', label: '報告年度', required: true },
                    { id: 'employee_count', type: 'number', label: '員工總數' },
                ]
            },
            {
                id: 'data', title: '📊 社會指標', fields: [
                    { id: 'primary_metric', type: 'number', label: '主要指標數值', required: true },
                    { id: 'unit', type: 'string', label: '單位' },
                    { id: 'benchmark', type: 'string', label: '對標標準 (e.g. GRI 401)' },
                    { id: 'notes', type: 'text', label: '補充說明' },
                ]
            },
        ],
    };
}

function makeGovStub(id: string): ReportSchema {
    return {
        reportId: id,
        title: id.replace(/-/g, ' ').toUpperCase() + ' — 治理類草稿',
        sections: [
            {
                id: 'basic', title: '🏛 治理基本資訊', fields: [
                    { id: 'company_name', type: 'string', label: '企業名稱', required: true },
                    { id: 'reporting_year', type: 'number', label: '報告年度', required: true },
                    { id: 'framework', type: 'string', label: '適用框架 (e.g. GRI 2, TCFD)' },
                ]
            },
            {
                id: 'data', title: '📊 治理指標揭露', fields: [
                    { id: 'primary_metric', type: 'string', label: '主要揭露事項', required: true },
                    { id: 'compliance_status', type: 'string', label: '合規狀態 (Compliant/Partial/Non-Compliant)' },
                    { id: 'notes', type: 'text', label: '補充說明' },
                ]
            },
        ],
    };
}

// ENV 環境類 20 份
[
    'rep-scope1-001', 'rep-scope2-001', 'rep-scope3-001', 'rep-carbon-intensity-001',
    'rep-energy-001', 'rep-water-001', 'rep-waste-001', 'rep-supplychain-env-001',
    'rep-climate-risk-001', 'rep-biodiversity-001', 'rep-green-procurement-001',
    'rep-circular-001', 'rep-carbon-neutral-001', 'rep-renewable-001',
    'rep-carbon-credit-001', 'rep-climate-scenario-001', 'rep-ghg-verification-001',
    'rep-sbti-001', 'rep-cdp-001', 'rep-air-quality-001',
].forEach(id => { ReportSchemas[id] = makeEnvStub(id); });

// SOC 社會類 15 份
[
    'rep-ohs-001', 'rep-training-001', 'rep-supplier-csr-001', 'rep-community-001',
    'rep-customer-sat-001', 'rep-dei-001', 'rep-pay-equity-001', 'rep-conflict-mineral-001',
    'rep-human-rights-001', 'rep-labor-001', 'rep-engagement-001', 'rep-supplier-enable-001',
    'rep-sroi-001', 'rep-philanthropy-001', 'rep-gender-equality-001',
].forEach(id => { ReportSchemas[id] = makeSocStub(id); });

// GOV 治理類 10 份
[
    'rep-risk-001', 'rep-compliance-001', 'rep-ethics-001', 'rep-ind-director-001',
    'rep-comp-committee-001', 'rep-audit-001', 'rep-internal-control-001',
    'rep-infosec-001', 'rep-privacy-001', 'rep-tax-transparency-001',
].forEach(id => { ReportSchemas[id] = makeGovStub(id); });

// ════════════════════════════════════════════════════════════
// 公開 API
// ════════════════════════════════════════════════════════════
/**
 * 依 Report ID 取得 Schema
 * 支援新版 ID (rep-carbon-001) 和舊版短 key (carbon-footprint)
 */
export function getReportSchema(reportId: string): ReportSchema | null {
    return ReportSchemas[reportId] || null;
}
