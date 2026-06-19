/**
 * 🗺️ OmniMapper v2.0: 雙向 TypeScript 映射器
 * ==========================================
 * 終始矩陣：雙向 TypeScript 前後端同步
 * "以終為始，始終如一，善向永續"
 *
 * Responsibility:
 * - Bidirectional transformation between frontend UI types and backend IOmniAtom
 * - Type-safe serialization / deserialization for all ESG entities
 * - Bilingual (zh/en) property mapping for the InfoOne platform
 *
 * Design: [可驗算 Transparent] — all mappings are explicit, no hidden logic.
 */

import type {
    IOmniAtom,
    IOmniSeed,
    IForgeIndicator,
    IReportForgeResult,
    IIntelNode,
    IStrategicPosture,
    ICarbonScopeData,
    IEvidenceMap,
    IVirtueFingerprint,
} from './omni-types';

// ─────────────────────────────────────────────────────────────────────────────
// 🔷 Frontend UI Display Types  (→ used by React components)
// ─────────────────────────────────────────────────────────────────────────────

/** UI-friendly representation of an ESG Report for display */
export interface IReportDisplayDTO {
    id: string;
    title: string;
    titleZh: string;
    status: 'draft' | 'sealed' | 'archived';
    complianceScore: number;
    indicatorCount: number;
    createdAt: string; // ISO string for UI
    frameworks: string[];
    summary: string;
}

/** UI-friendly representation of a Carbon Record */
export interface ICarbonDisplayDTO {
    scopeLabel: string;
    scopeLabelZh: string;
    emissions: number;
    unit: string;
    percentage: number; // % of total
}

/** UI-friendly indicator row for tables/charts */
export interface IIndicatorRowDTO {
    code: string;
    name: string;
    nameZh: string;
    value: string; // formatted string with unit
    confidence: string; // e.g. "95%"
    status: 'verified' | 'pending' | 'low-confidence';
}

/** UI-friendly intelligence node for the dashboard */
export interface IIntelDisplayDTO {
    categoryIcon: string;
    categoryLabel: string;
    snippet: string;
    source: string;
    timeAgo: string;
    sentimentLabel: 'positive' | 'neutral' | 'negative';
}

/** UI-friendly virtue fingerprint for radar charts */
export interface IVirtueDisplayDTO {
    labels: string[];
    labelsZh: string[];
    values: Array<number | undefined>;
    overallScore: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔶 Form Input Types  (→ used by forms, sent to API routes)
// ─────────────────────────────────────────────────────────────────────────────

export interface IReportFormInput {
    title: string;
    frameworks: string[];
    indicators: {
        code: string;
        name: string;
        value: number;
        unit: string;
    }[];
    format?: 'PDF' | 'EXCEL' | 'TYPST';
}

export interface ICarbonFormInput {
    scope: 1 | 2 | 3;
    emissionsValue: string; // raw string from input
    unit: 'tCO2e' | 'kgCO2e';
    categories: Record<string, string>; // category → raw string value
}

// ─────────────────────────────────────────────────────────────────────────────
// 🧬 OmniMapper: The Bidirectional TypeScript Transformer
// ─────────────────────────────────────────────────────────────────────────────

export class OmniMapper {

    // ── BASIC UTILITIES ─────────────────────────────────────────────────────

    /** Cast raw JSON data to a target type (→Frontend) */
    public static mapToType<T>(data: unknown): T {
        if (typeof data === 'string') {
            try { return JSON.parse(data) as T; }
            catch { return data as unknown as T; }
        }
        return data as T;
    }

    /** Serialize data for persistence (→Backend) */
    public static mapToJson<T>(data: T): string {
        return JSON.stringify(data, null, 2);
    }

    // ── REPORT MAPPER ────────────────────────────────────────────────────────

    /**
     * 📤 Frontend → Backend
     * Convert a report form input to a 5T-compliant IOmniSeed payload
     */
    public static reportFormToSeed(form: IReportFormInput): IOmniSeed<IReportFormInput> {
        return {
            intent: `Forge_ESG_Report: ${form.title}`,
            type: 'Note',
            payload: form,
            domainRef: 'ESG_REPORT_DOMAIN',
            tags: form.frameworks,
            formula: '$ComplianceScore = \\sum (Indicator_{weight} \\times Confidence)$',
            impactMetric: 'Regulatory_Compliance_Score',
        };
    }

    /**
     * 📥 Backend → Frontend
     * Convert a IReportForgeResult atom payload to a UI display DTO
     */
    public static reportResultToDTO(
        result: IReportForgeResult,
        atom?: Partial<IOmniAtom<unknown>>
    ): IReportDisplayDTO {
        const statusMap: Record<string, IReportDisplayDTO['status']> = {
            'Active': 'draft',
            'Trustworthy': 'sealed',
            'Archived': 'archived',
            'Potential': 'draft',
        };
        return {
            id: result.uuid,
            title: result.title,
            titleZh: `ESG 永續報告：${result.title}`,
            status: statusMap[result.status] ?? 'draft',
            complianceScore: Math.round(result.complianceScore),
            indicatorCount: result.indicators.length,
            createdAt: atom?.timestamp
                ? new Date(atom.timestamp).toISOString()
                : new Date().toISOString(),
            frameworks: result.indicators.map((i) => i.code.split('-')[0]).filter(Boolean),
            summary: `5T Verified | ${result.indicators.length} indicators | Score: ${result.complianceScore.toFixed(1)}`,
        };
    }

    // ── INDICATOR MAPPER ─────────────────────────────────────────────────────

    /**
     * 📥 Backend → Frontend
     * Convert IForgeIndicator[] to UI-friendly table rows
     */
    public static indicatorsToRows(indicators: IForgeIndicator[]): IIndicatorRowDTO[] {
        const ZH_NAMES: Record<string, string> = {
            'GRI-305-1': '直接溫室氣體排放',
            'GRI-305-2': '能源間接溫室氣體排放',
            'GRI-401-1': '新進員工與離職員工',
            'GRI-403-9': '工作相關傷害',
            'SASB-EM': '環境材料採購',
        };

        return indicators.map((ind) => ({
            code: ind.code,
            name: ind.name,
            nameZh: ZH_NAMES[ind.code] ?? ind.name,
            value: `${ind.value.toLocaleString()} ${ind.unit}`,
            confidence: `${Math.round(ind.confidence * 100)}%`,
            status: ind.confidence >= 0.9
                ? 'verified'
                : ind.confidence >= 0.7
                    ? 'pending'
                    : 'low-confidence',
        }));
    }

    /**
     * 📤 Frontend → Backend
     * Convert raw form indicator rows to IForgeIndicator with validation
     */
    public static formToForgeIndicators(
        rows: IReportFormInput['indicators']
    ): IForgeIndicator[] {
        return rows
            .filter((r) => r.code && r.name && !Number.isNaN(Number(r.value)))
            .map((r) => ({
                code: r.code.trim().toUpperCase(),
                name: r.name.trim(),
                value: Number(r.value),
                unit: r.unit.trim() || 'units',
                confidence: 1.0, // Default to full confidence for user-entered data
            }));
    }

    // ── CARBON MAPPER ────────────────────────────────────────────────────────

    /**
     * 📤 Frontend → Backend
     * Parse carbon form input strings into validated ICarbonScopeData
     */
    public static carbonFormToScope(form: ICarbonFormInput): ICarbonScopeData {
        const emissions = parseFloat(form.emissionsValue) || 0;
        const breakdown: Record<string, number> = {};
        for (const [key, val] of Object.entries(form.categories)) {
            const num = parseFloat(val);
            if (!Number.isNaN(num)) breakdown[key] = num;
        }
        return {
            scope: form.scope,
            emissions,
            unit: form.unit,
            breakdown,
        };
    }

    /**
     * 📥 Backend → Frontend
     * Format carbon scope data into display DTOs with % breakdown
     */
    public static carbonScopesToDTOs(scopes: ICarbonScopeData[]): ICarbonDisplayDTO[] {
        const total = scopes.reduce((sum, s) => sum + s.emissions, 0) || 1;
        const SCOPE_LABELS: Record<number, [string, string]> = {
            1: ['Scope 1 (Direct)', '範疇一（直接排放）'],
            2: ['Scope 2 (Indirect Energy)', '範疇二（能源間接排放）'],
            3: ['Scope 3 (Value Chain)', '範疇三（價值鏈排放）'],
        };
        return scopes.map((s) => {
            const [en, zh] = SCOPE_LABELS[s.scope] ?? [`Scope ${s.scope}`, `範疇${s.scope}`];
            return {
                scopeLabel: en,
                scopeLabelZh: zh,
                emissions: s.emissions,
                unit: s.unit,
                percentage: Math.round((s.emissions / total) * 100),
            };
        });
    }

    // ── INTELLIGENCE MAPPER ──────────────────────────────────────────────────

    /**
     * 📥 Backend → Frontend
     * Convert IIntelNode to a UI display DTO with icons and labels
     */
    public static intelToDisplayDTO(node: IIntelNode): IIntelDisplayDTO {
        const CATEGORY_ICONS: Record<string, string> = {
            Market: '📈', Policy: '🏛️', Innovation: '💡', Risk: '⚠️',
        };
        const CATEGORY_LABELS_ZH: Record<string, string> = {
            Market: '市場動態', Policy: '政策法規', Innovation: '技術創新', Risk: '風險警示',
        };

        const now = Date.now();
        const diff = now - (node.timestamp ?? 0);
        const timeAgo = diff < 3600000
            ? `${Math.round(diff / 60000)} 分鐘前`
            : diff < 86400000
                ? `${Math.round(diff / 3600000)} 小時前`
                : `${Math.round(diff / 86400000)} 天前`;

        const sentiment = (node.sentiment ?? 0) > 0.3
            ? 'positive'
            : (node.sentiment ?? 0) < -0.3
                ? 'negative'
                : 'neutral';

        return {
            categoryIcon: CATEGORY_ICONS[(node.category ?? "")] ?? '📊',
            categoryLabel: `${CATEGORY_ICONS[(node.category ?? "")] ?? '📊'} ${CATEGORY_LABELS_ZH[(node.category ?? "")] ?? (node.category ?? "")}`,
            snippet: (node.content ?? "").slice(0, 120) + ((node.content ?? "").length > 120 ? '…' : ''),
            source: (node.source ?? ""),
            timeAgo,
            sentimentLabel: sentiment,
        };
    }

    // ── VIRTUE MAPPER ────────────────────────────────────────────────────────

    /**
     * 📥 Backend → Frontend
     * Convert IVirtueFingerprint to radar chart display DTO
     */
    public static virtueToDisplayDTO(v: IVirtueFingerprint): IVirtueDisplayDTO {
        const keys: (keyof IVirtueFingerprint)[] = [
            'wisdom', 'benevolence', 'integrity', 'courage', 'efficiency', 'harmony',
        ];
        const ZH: Record<string, string> = {
            wisdom: '智', benevolence: '仁', integrity: '誠',
            courage: '勇', efficiency: '節', harmony: '和',
        };
        const values = keys.map((k) => v[k]);
        const overallScore = Math.round(values.reduce((a: number, b: number | undefined) => a + (b ?? 0), 0) as number / values.length * 10);
        return {
            labels: keys.map((k) => k.charAt(0).toUpperCase() + k.slice(1)),
            labelsZh: keys.map((k) => ZH[k] ?? k),
            values,
            overallScore,
        };
    }

    // ── EVIDENCE MAP BUILDER ─────────────────────────────────────────────────

    /**
     * 📤 Helper — Build a 5T IEvidenceMap from structured inputs
     * Used when frontend seals data into the Evidence Vault
     */
    public static buildEvidenceMap(params: {
        metricName: string;
        metricValue: unknown;
        sourceOrigin: string;
        authorSignature: string;
        formula: string;
        standardRef: string;
    }): IEvidenceMap {
        return {
            tangible: {
                metricName: params.metricName,
                metricValue: params.metricValue as number,
            },
            traceable: {
                sourceOrigin: params.sourceOrigin,
                authorSignature: params.authorSignature,
            },
            trackable: {
                currentHookId: `SEAL-${Date.now()}`,
                pathLog: [{ timestamp: Date.now(), nodeId: 'Frontend', action: 'Sealed' }],
            },
            transparent: {
                standardRef: params.standardRef,
                formula: params.formula,
                isVerified: true,
            },
        };
    }
}
