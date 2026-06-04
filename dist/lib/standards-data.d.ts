/**
 * ESG GO | 永續規範書資料庫
 * GRI · SASB · TCFD · ISSB · ISO · 金管會
 */
export interface Standard {
    id: string;
    code: string;
    name: string;
    nameZh: string;
    category: 'GRI' | 'SASB' | 'TCFD' | 'ISSB' | 'ISO' | 'TW_REG' | 'EU_REG';
    version: string;
    effectiveDate: string;
    status: 'active' | 'draft' | 'superseded';
    summary: string;
    keyRequirements: string[];
    disclosureItems: DisclosureItem[];
    relatedStandards: string[];
    officialUrl: string;
    mandatory: boolean;
    applicableTo: string[];
}
export interface DisclosureItem {
    code: string;
    title: string;
    titleZh: string;
    type: 'quantitative' | 'qualitative' | 'both';
    required: boolean;
    guidance: string;
    dataPoints: string[];
    evidenceRequired: string[];
    formula?: string;
    unit?: string;
}
export interface ComplianceChecklist {
    standardId: string;
    sections: ChecklistSection[];
}
export interface ChecklistSection {
    id: string;
    title: string;
    items: ChecklistItem[];
}
export interface ChecklistItem {
    id: string;
    requirement: string;
    guidance: string;
    status: 'pending' | 'in_progress' | 'completed' | 'na';
    evidence?: string;
    dueDate?: string;
}
export declare const STANDARDS: Standard[];
export declare const STANDARD_CATEGORIES: {
    id: string;
    label: string;
    count: number;
}[];
export declare const CATEGORY_COLORS: Record<string, {
    bg: string;
    text: string;
    border: string;
}>;
export declare const COMPLIANCE_TIMELINE: {
    year: number;
    event: string;
    category: string;
    urgent: boolean;
}[];
//# sourceMappingURL=standards-data.d.ts.map