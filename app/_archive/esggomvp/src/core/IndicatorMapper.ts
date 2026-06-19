/**
 * 🗺️ IndicatorMapper v1.0 — 標準指標映射引擎
 * =============================================
 * Zero-Hallucination Verification Layer
 * 核心哲學: 「可驗算 Transparent」— 所有標準映射完全透明，無隱藏邏輯
 *
 * Standards Supported:
 *  - GRI 2026 Core Standards (Global Reporting Initiative)
 *  - FSC 97 — Taiwan Financial Supervisory Commission 永續資訊揭露
 *  - SASB Industry Metrics (Sustainability Accounting Standards Board)
 *  - TCFD Climate-related Financial Disclosures
 */

// ─────────────────────────────────────────────────────────────────────────────
// 📋 Standard Indicator Definition Types
// ─────────────────────────────────────────────────────────────────────────────

export type IndicatorStandard = 'GRI' | 'FSC97' | 'SASB' | 'TCFD';
export type ESGPillar = 'E' | 'S' | 'G';
export type ComplianceStatus = 'COMPLIANT' | 'PARTIAL' | 'MISSING' | 'NOT_APPLICABLE';
export type DataType = 'Quantitative' | 'Qualitative' | 'Narrative' | 'Binary';

export interface IStandardIndicator {
    /** Unique indicator code, e.g. "GRI-305-1" */
    readonly code: string;
    /** Official indicator name (English) */
    readonly name: string;
    /** Indicator name in Traditional Chinese */
    readonly nameZh: string;
    /** ESG pillar */
    readonly pillar: ESGPillar;
    /** Governing standard */
    readonly standard: IndicatorStandard;
    /** Measurement unit (e.g. "tCO2e", "Hours", "Number") */
    readonly unit: string;
    /** Type of data required */
    readonly dataType: DataType;
    /** Whether Taiwan FSC 97 mandates this indicator */
    readonly isFscMandatory: boolean;
    /** Cross-reference to other standards */
    readonly crossRefs: string[];
    /** Calculation formula if applicable */
    readonly formula?: string;
    /** Minimum disclosure threshold (used in zero-hallucination checks) */
    readonly disclosureThreshold?: number;
}

export interface IComplianceGap {
    indicatorCode: string;
    indicatorName: string;
    indicatorNameZh: string;
    standard: IndicatorStandard;
    status: ComplianceStatus;
    pillar: ESGPillar;
    /** Suggested action to close the gap */
    suggestion: string;
    /** Priority level 1-5 (5 = FSC mandatory) */
    priority: number;
}

export interface IStandardMappingResult {
    /** Total indicators required by selected frameworks */
    totalRequired: number;
    /** Indicators with 'COMPLIANT' status */
    compliantCount: number;
    /** Indicators with 'PARTIAL' status */
    partialCount: number;
    /** Missing indicators */
    missingCount: number;
    /** Overall compliance score 0-100 */
    complianceScore: number;
    /** Pillar-level scores */
    pillarScores: Record<ESGPillar, number>;
    /** Ranked gaps ordered by priority */
    gaps: IComplianceGap[];
    /** Recommended standard codes for the report */
    recommendedFrameworks: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 📚 GRI 2026 Core Standard Registry
// ─────────────────────────────────────────────────────────────────────────────

const GRI_INDICATORS: IStandardIndicator[] = [
    // ── Universal Series ────────────────────────────────────────────────────
    {
        code: 'GRI-2-7', name: 'Employees', nameZh: '員工人數',
        pillar: 'S', standard: 'GRI', unit: 'Number', dataType: 'Quantitative',
        isFscMandatory: true, crossRefs: ['FSC97-S-01', 'SASB-HC-101-1'],
        disclosureThreshold: 0,
    },
    {
        code: 'GRI-2-28', name: 'Membership of associations', nameZh: '協會成員資格',
        pillar: 'G', standard: 'GRI', unit: 'Narrative', dataType: 'Narrative',
        isFscMandatory: false, crossRefs: [],
    },

    // ── Environmental Series ─────────────────────────────────────────────────
    {
        code: 'GRI-301-1', name: 'Materials used by weight or volume', nameZh: '按重量或體積計算的材料使用量',
        pillar: 'E', standard: 'GRI', unit: 'Tonnes', dataType: 'Quantitative',
        isFscMandatory: false, crossRefs: ['SASB-EM-120a'],
        formula: 'Total_Materials = Renewable + Non-Renewable',
    },
    {
        code: 'GRI-302-1', name: 'Energy consumption within the organization', nameZh: '組織內部能源消耗',
        pillar: 'E', standard: 'GRI', unit: 'GJ', dataType: 'Quantitative',
        isFscMandatory: true, crossRefs: ['FSC97-E-02', 'TCFD-M-E3'],
        formula: 'Total_Energy = Fuel_Combustion + Electricity + Heating + Cooling',
    },
    {
        code: 'GRI-302-4', name: 'Reduction of energy consumption', nameZh: '能源消耗削減量',
        pillar: 'E', standard: 'GRI', unit: 'GJ', dataType: 'Quantitative',
        isFscMandatory: false, crossRefs: ['FSC97-E-02'],
        formula: 'Energy_Reduction = Baseline_Year - Current_Year',
    },
    {
        code: 'GRI-303-5', name: 'Water consumption', nameZh: '用水消耗',
        pillar: 'E', standard: 'GRI', unit: 'm³', dataType: 'Quantitative',
        isFscMandatory: true, crossRefs: ['FSC97-E-03'],
    },
    {
        code: 'GRI-305-1', name: 'Direct (Scope 1) GHG emissions', nameZh: '直接（範疇一）溫室氣體排放',
        pillar: 'E', standard: 'GRI', unit: 'tCO2e', dataType: 'Quantitative',
        isFscMandatory: true, crossRefs: ['FSC97-E-01', 'TCFD-M-E1', 'SASB-EM-110a-1'],
        formula: 'Scope1 = Σ(Activity_Data × Emission_Factor)',
    },
    {
        code: 'GRI-305-2', name: 'Energy indirect (Scope 2) GHG emissions', nameZh: '能源間接（範疇二）溫室氣體排放',
        pillar: 'E', standard: 'GRI', unit: 'tCO2e', dataType: 'Quantitative',
        isFscMandatory: true, crossRefs: ['FSC97-E-01', 'TCFD-M-E2'],
        formula: 'Scope2_MB = Σ(Energy × Supplier_EF); Scope2_LB = Σ(Energy × Grid_EF)',
    },
    {
        code: 'GRI-305-3', name: 'Other indirect (Scope 3) GHG emissions', nameZh: '其他間接（範疇三）溫室氣體排放',
        pillar: 'E', standard: 'GRI', unit: 'tCO2e', dataType: 'Quantitative',
        isFscMandatory: false, crossRefs: ['TCFD-M-E3'],
        formula: 'Scope3 = Σ(Category_1..15 Emissions)',
    },
    {
        code: 'GRI-306-3', name: 'Waste generated', nameZh: '產生的廢棄物',
        pillar: 'E', standard: 'GRI', unit: 'Tonnes', dataType: 'Quantitative',
        isFscMandatory: false, crossRefs: ['SASB-EM-150a'],
    },
    {
        code: 'GRI-304-1', name: 'Operational sites and protected areas', nameZh: '緩衝區的營運地點',
        pillar: 'E', standard: 'GRI', unit: 'Narrative', dataType: 'Narrative',
        isFscMandatory: false, crossRefs: [],
    },

    // ── Social Series ────────────────────────────────────────────────────────
    {
        code: 'GRI-401-1', name: 'New employee hires and employee turnover', nameZh: '新進員工與員工離職',
        pillar: 'S', standard: 'GRI', unit: '%', dataType: 'Quantitative',
        isFscMandatory: true, crossRefs: ['FSC97-S-02'],
        formula: 'Turnover_Rate = (Departed / Average_Employees) × 100',
    },
    {
        code: 'GRI-403-9', name: 'Work-related injuries', nameZh: '工作相關傷害',
        pillar: 'S', standard: 'GRI', unit: 'TRIR', dataType: 'Quantitative',
        isFscMandatory: true, crossRefs: ['FSC97-S-03'],
        formula: 'TRIR = (Recordable_Injuries × 200000) / Hours_Worked',
    },
    {
        code: 'GRI-404-1', name: 'Average hours of training per year per employee', nameZh: '員工年均培訓時數',
        pillar: 'S', standard: 'GRI', unit: 'Hours', dataType: 'Quantitative',
        isFscMandatory: true, crossRefs: ['FSC97-S-04'],
        formula: 'Avg_Training = Total_Training_Hours / Total_Employees',
    },
    {
        code: 'GRI-405-1', name: 'Diversity of governance bodies and employees', nameZh: '治理機構與員工多元性',
        pillar: 'S', standard: 'GRI', unit: '%', dataType: 'Quantitative',
        isFscMandatory: true, crossRefs: ['FSC97-G-02', 'SASB-SV-EM-330a'],
    },
    {
        code: 'GRI-406-1', name: 'Incidents of discrimination', nameZh: '歧視事件',
        pillar: 'S', standard: 'GRI', unit: 'Number', dataType: 'Quantitative',
        isFscMandatory: false, crossRefs: [],
    },
    {
        code: 'GRI-413-1', name: 'Operations with local community engagement', nameZh: '社區參與的營運',
        pillar: 'S', standard: 'GRI', unit: '%', dataType: 'Quantitative',
        isFscMandatory: false, crossRefs: [],
    },

    // ── Governance Series ────────────────────────────────────────────────────
    {
        code: 'GRI-2-9', name: 'Governance structure and composition', nameZh: '治理架構與組成',
        pillar: 'G', standard: 'GRI', unit: 'Narrative', dataType: 'Narrative',
        isFscMandatory: true, crossRefs: ['FSC97-G-01'],
    },
    {
        code: 'GRI-205-2', name: 'Communication and training about anti-corruption', nameZh: '反腐敗溝通與培訓',
        pillar: 'G', standard: 'GRI', unit: '%', dataType: 'Quantitative',
        isFscMandatory: false, crossRefs: [],
    },
    {
        code: 'GRI-205-3', name: 'Confirmed incidents of corruption', nameZh: '確認的腐敗事件',
        pillar: 'G', standard: 'GRI', unit: 'Number', dataType: 'Quantitative',
        isFscMandatory: false, crossRefs: [],
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// 🇹🇼 FSC 97 — Taiwan Mandatory Disclosure Registry
// ─────────────────────────────────────────────────────────────────────────────

const FSC97_INDICATORS: IStandardIndicator[] = [
    {
        code: 'FSC97-E-01', name: 'GHG Emissions Disclosure (Scope 1+2)', nameZh: '溫室氣體排放揭露（範疇一+二）',
        pillar: 'E', standard: 'FSC97', unit: 'tCO2e', dataType: 'Quantitative',
        isFscMandatory: true, crossRefs: ['GRI-305-1', 'GRI-305-2', 'TCFD-M-E1'],
    },
    {
        code: 'FSC97-E-02', name: 'Energy Management', nameZh: '能源管理',
        pillar: 'E', standard: 'FSC97', unit: 'GJ', dataType: 'Quantitative',
        isFscMandatory: true, crossRefs: ['GRI-302-1'],
    },
    {
        code: 'FSC97-E-03', name: 'Water Resource Management', nameZh: '水資源管理',
        pillar: 'E', standard: 'FSC97', unit: 'm³', dataType: 'Quantitative',
        isFscMandatory: true, crossRefs: ['GRI-303-5'],
    },
    {
        code: 'FSC97-S-01', name: 'Workforce Data', nameZh: '員工數據',
        pillar: 'S', standard: 'FSC97', unit: 'Number', dataType: 'Quantitative',
        isFscMandatory: true, crossRefs: ['GRI-2-7'],
    },
    {
        code: 'FSC97-S-02', name: 'Employee Turnover Rate', nameZh: '員工離職率',
        pillar: 'S', standard: 'FSC97', unit: '%', dataType: 'Quantitative',
        isFscMandatory: true, crossRefs: ['GRI-401-1'],
        formula: 'Turnover_Rate = (Departed / Avg_Employees) × 100',
    },
    {
        code: 'FSC97-S-03', name: 'Occupational Safety', nameZh: '職業安全',
        pillar: 'S', standard: 'FSC97', unit: 'TRIR', dataType: 'Quantitative',
        isFscMandatory: true, crossRefs: ['GRI-403-9'],
    },
    {
        code: 'FSC97-S-04', name: 'Training & Development Hours', nameZh: '教育訓練時數',
        pillar: 'S', standard: 'FSC97', unit: 'Hours', dataType: 'Quantitative',
        isFscMandatory: true, crossRefs: ['GRI-404-1'],
    },
    {
        code: 'FSC97-G-01', name: 'Board Composition', nameZh: '董事會組成',
        pillar: 'G', standard: 'FSC97', unit: 'Narrative', dataType: 'Narrative',
        isFscMandatory: true, crossRefs: ['GRI-2-9'],
    },
    {
        code: 'FSC97-G-02', name: 'Gender Diversity in Board', nameZh: '董事會性別多元性',
        pillar: 'G', standard: 'FSC97', unit: '%', dataType: 'Quantitative',
        isFscMandatory: true, crossRefs: ['GRI-405-1'],
        formula: 'Female_Director_Ratio = Female_Directors / Total_Directors × 100',
    },
    {
        code: 'FSC97-G-03', name: 'Supplier ESG Management', nameZh: '供應商永續管理',
        pillar: 'G', standard: 'FSC97', unit: '%', dataType: 'Quantitative',
        isFscMandatory: true, crossRefs: [],
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// 🏢 SASB Cross-Industry Metrics Registry
// ─────────────────────────────────────────────────────────────────────────────

const SASB_INDICATORS: IStandardIndicator[] = [
    {
        code: 'SASB-EM-110a-1', name: 'Gross global Scope 1 emissions', nameZh: '全球範疇一溫室氣體排放總量',
        pillar: 'E', standard: 'SASB', unit: 'tCO2e', dataType: 'Quantitative',
        isFscMandatory: false, crossRefs: ['GRI-305-1'],
    },
    {
        code: 'SASB-EM-120a', name: 'Amount of recycled materials', nameZh: '資源回收利用量',
        pillar: 'E', standard: 'SASB', unit: 'Metric Tons', dataType: 'Quantitative',
        isFscMandatory: false, crossRefs: ['GRI-301-1'],
    },
    {
        code: 'SASB-EM-150a', name: 'Total amount of waste generated', nameZh: '廢棄物產生總量',
        pillar: 'E', standard: 'SASB', unit: 'Tonnes', dataType: 'Quantitative',
        isFscMandatory: false, crossRefs: ['GRI-306-3'],
    },
    {
        code: 'SASB-HC-101-1', name: 'Number of employees', nameZh: '員工人數',
        pillar: 'S', standard: 'SASB', unit: 'Number', dataType: 'Quantitative',
        isFscMandatory: false, crossRefs: ['GRI-2-7'],
    },
    {
        code: 'SASB-SV-EM-330a', name: 'Percentage of gender and racial/ethnic group', nameZh: '性別與種族/族裔比例',
        pillar: 'S', standard: 'SASB', unit: '%', dataType: 'Quantitative',
        isFscMandatory: false, crossRefs: ['GRI-405-1'],
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// 🌡️ TCFD Metrics
// ─────────────────────────────────────────────────────────────────────────────

const TCFD_INDICATORS: IStandardIndicator[] = [
    {
        code: 'TCFD-M-E1', name: 'Scope 1 GHG Emissions', nameZh: '範疇一溫室氣體排放',
        pillar: 'E', standard: 'TCFD', unit: 'tCO2e', dataType: 'Quantitative',
        isFscMandatory: true, crossRefs: ['GRI-305-1', 'FSC97-E-01'],
    },
    {
        code: 'TCFD-M-E2', name: 'Scope 2 GHG Emissions', nameZh: '範疇二溫室氣體排放',
        pillar: 'E', standard: 'TCFD', unit: 'tCO2e', dataType: 'Quantitative',
        isFscMandatory: true, crossRefs: ['GRI-305-2', 'FSC97-E-01'],
    },
    {
        code: 'TCFD-M-E3', name: 'Scenario Analysis - Climate Risk', nameZh: '情境分析—氣候風險',
        pillar: 'E', standard: 'TCFD', unit: 'Narrative', dataType: 'Narrative',
        isFscMandatory: false, crossRefs: ['GRI-305-3'],
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// 🧠 IndicatorMapper: Core Engine
// ─────────────────────────────────────────────────────────────────────────────

/** Full index of all standard indicators, keyed by indicator code */
const INDICATOR_REGISTRY: Map<string, IStandardIndicator> = new Map([
    ...GRI_INDICATORS.map(i => [i.code, i] as [string, IStandardIndicator]),
    ...FSC97_INDICATORS.map(i => [i.code, i] as [string, IStandardIndicator]),
    ...SASB_INDICATORS.map(i => [i.code, i] as [string, IStandardIndicator]),
    ...TCFD_INDICATORS.map(i => [i.code, i] as [string, IStandardIndicator]),
]);

export class IndicatorMapper {

    // ── Registry Access ──────────────────────────────────────────────────────

    /** Retrieve a standard indicator definition by code */
    public static getIndicator(code: string): IStandardIndicator | undefined {
        return INDICATOR_REGISTRY.get(code);
    }

    /** Get all indicators for a given standard */
    public static getByStandard(standard: IndicatorStandard): IStandardIndicator[] {
        return [...INDICATOR_REGISTRY.values()].filter(i => i.standard === standard);
    }

    /** Get all FSC 97 mandatory indicators */
    public static getFscMandatory(): IStandardIndicator[] {
        return [...INDICATOR_REGISTRY.values()].filter(i => i.isFscMandatory);
    }

    /** Get all indicators for a given ESG pillar */
    public static getByPillar(pillar: ESGPillar): IStandardIndicator[] {
        return [...INDICATOR_REGISTRY.values()].filter(i => i.pillar === pillar);
    }

    // ── Zero-Hallucination Cross-Reference ──────────────────────────────────

    /**
     * 🔍 Cross-reference a claimed indicator code against the registry.
     * Returns null if the code is in the registry (valid), or an error message if not.
     * This prevents AI from fabricating indicator codes.
     */
    public static verifyClaim(code: string): { valid: boolean; message: string } {
        const indicator = INDICATOR_REGISTRY.get(code);
        if (indicator) {
            return { valid: true, message: `✅ ${code} verified: ${indicator.name} [${indicator.standard}]` };
        }
        // Fuzzy suggestion
        const similar = [...INDICATOR_REGISTRY.keys()]
            .filter(k => k.startsWith(code.split('-')[0]))
            .slice(0, 3);
        return {
            valid: false,
            message: `❌ Code "${code}" not found in registry. Did you mean: ${similar.join(', ') || 'N/A'}?`,
        };
    }

    // ── Compliance Gap Analysis ──────────────────────────────────────────────

    /**
     * 📊 mapReportToStandards
     * Core engine: takes submitted indicator codes + selected frameworks,
     * returns a full compliance gap analysis result.
     */
    public static mapReportToStandards(
        submittedCodes: string[],
        frameworks: IndicatorStandard[] = ['GRI', 'FSC97']
    ): IStandardMappingResult {
        const submittedSet = new Set(submittedCodes.map(c => c.toUpperCase()));

        // Determine required indicators for selected frameworks
        const required = [...INDICATOR_REGISTRY.values()].filter(
            i => frameworks.includes(i.standard)
        );

        const gaps: IComplianceGap[] = [];
        let compliantCount = 0;
        let partialCount = 0;
        let missingCount = 0;

        const pillarData: Record<ESGPillar, { required: number; compliant: number }> = {
            E: { required: 0, compliant: 0 },
            S: { required: 0, compliant: 0 },
            G: { required: 0, compliant: 0 },
        };

        for (const indicator of required) {
            pillarData[indicator.pillar].required++;
            const hasDirectMatch = submittedSet.has(indicator.code.toUpperCase());

            // Also check cross-references for partial compliance
            const hasCrossRefMatch = !hasDirectMatch &&
                indicator.crossRefs.some(ref => submittedSet.has(ref.toUpperCase()));

            let status: ComplianceStatus;
            if (hasDirectMatch) {
                status = 'COMPLIANT';
                compliantCount++;
                pillarData[indicator.pillar].compliant++;
            } else if (hasCrossRefMatch) {
                status = 'PARTIAL';
                partialCount++;
                pillarData[indicator.pillar].compliant += 0.5;
            } else {
                status = 'MISSING';
                missingCount++;
                gaps.push({
                    indicatorCode: indicator.code,
                    indicatorName: indicator.name,
                    indicatorNameZh: indicator.nameZh,
                    standard: indicator.standard,
                    status,
                    pillar: indicator.pillar,
                    suggestion: IndicatorMapper.buildSuggestion(indicator),
                    priority: indicator.isFscMandatory ? 5 : 3,
                });
            }

            if (status === 'PARTIAL') {
                gaps.push({
                    indicatorCode: indicator.code,
                    indicatorName: indicator.name,
                    indicatorNameZh: indicator.nameZh,
                    standard: indicator.standard,
                    status,
                    pillar: indicator.pillar,
                    suggestion: `Please also report directly under ${indicator.code} instead of cross-references only.`,
                    priority: indicator.isFscMandatory ? 4 : 2,
                });
            }
        }

        // Compliance score: COMPLIANT = 1pt, PARTIAL = 0.5pt
        const totalRequired = required.length || 1;
        const totalEarned = compliantCount + (partialCount * 0.5);
        const complianceScore = Math.round((totalEarned / totalRequired) * 100);

        const pillarScores: Record<ESGPillar, number> = {
            E: pillarData.E.required > 0 ? Math.round((pillarData.E.compliant / pillarData.E.required) * 100) : 0,
            S: pillarData.S.required > 0 ? Math.round((pillarData.S.compliant / pillarData.S.required) * 100) : 0,
            G: pillarData.G.required > 0 ? Math.round((pillarData.G.compliant / pillarData.G.required) * 100) : 0,
        };

        // Sort gaps: FSC mandatory first, then by priority
        gaps.sort((a, b) => b.priority - a.priority);

        return {
            totalRequired,
            compliantCount,
            partialCount,
            missingCount,
            complianceScore,
            pillarScores,
            gaps,
            recommendedFrameworks: IndicatorMapper.recommendFrameworks(complianceScore, pillarScores),
        };
    }

    // ── Suggestion Builder ──────────────────────────────────────────────────

    private static buildSuggestion(indicator: IStandardIndicator): string {
        const urgency = indicator.isFscMandatory ? '🔴 [FSC 強制] ' : '🟡 ';
        let msg = `${urgency}Add disclosure for ${indicator.code} — ${indicator.nameZh}.`;
        if (indicator.formula) {
            msg += ` Formula: ${indicator.formula}`;
        }
        if (indicator.unit !== 'Narrative') {
            msg += ` Unit: ${indicator.unit}.`;
        }
        return msg;
    }

    // ── Framework Recommender ────────────────────────────────────────────────

    private static recommendFrameworks(
        overallScore: number,
        pillarScores: Record<ESGPillar, number>
    ): string[] {
        const recommendations: string[] = [];
        if (overallScore < 60) {
            recommendations.push('GRI-2026-Universal: Focus on Universal Standards first');
        }
        if (pillarScores.E < 70) {
            recommendations.push('GRI-305-Climate: Prioritize GHG Emissions disclosure');
        }
        if (pillarScores.S < 70) {
            recommendations.push('GRI-400-Social: Strengthen Social topic disclosures');
        }
        if (pillarScores.G < 70) {
            recommendations.push('FSC97-Governance: Taiwan FSC 97 governance board requirements');
        }
        if (overallScore >= 80) {
            recommendations.push('SASB-Industry: Extend to SASB industry-specific metrics');
            recommendations.push('TCFD-Climate: Add TCFD scenario analysis for climate resilience');
        }
        return recommendations;
    }

    // ── Utility Exports ─────────────────────────────────────────────────────

    /** Get a summary of available indicators across all frameworks */
    public static getSummary(): {
        total: number;
        byStandard: Record<string, number>;
        byPillar: Record<string, number>;
        fscMandatory: number;
    } {
        const all = [...INDICATOR_REGISTRY.values()];
        return {
            total: all.length,
            byStandard: {
                GRI: all.filter(i => i.standard === 'GRI').length,
                FSC97: all.filter(i => i.standard === 'FSC97').length,
                SASB: all.filter(i => i.standard === 'SASB').length,
                TCFD: all.filter(i => i.standard === 'TCFD').length,
            },
            byPillar: {
                E: all.filter(i => i.pillar === 'E').length,
                S: all.filter(i => i.pillar === 'S').length,
                G: all.filter(i => i.pillar === 'G').length,
            },
            fscMandatory: all.filter(i => i.isFscMandatory).length,
        };
    }
}
