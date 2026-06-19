/**
 * Atomic ESG Data Spec Library — Type Definitions
 * Layer 1: AtomicESGIndicator (minimum unit / atom)
 * Layer 2: IndicatorGroup (molecule / chapter)
 * Layer 3: ESGReportTemplate (organism / full report)
 */

export type ESGCategory = "E" | "S" | "G" | "D"; // 環境 / 社會 / 治理 / 數位
export type ESGFramework = "GRI" | "SASB" | "TCFD" | "SDGs" | "ISSB" | "TWSE";
export type DataType = "number" | "text" | "percentage" | "boolean" | "multiline";

export interface AtomicValidation {
    required: boolean;
    min?: number;          // For number/percentage
    max?: number;          // For number/percentage
    maxLength?: number;    // For text/multiline
    unit?: string;         // e.g., "GJ", "tCO2e", "MWh", "%"
}

// ─────────────────────────────────────────────
// Layer 1: ATOM — Single ESG Indicator
// ─────────────────────────────────────────────
export interface AtomicESGIndicator {
    id: string;                    // Unique: "GRI-302-1"
    framework: ESGFramework;
    code: string;                  // "302-1"
    title: string;                 // "組織內部能源消耗量"
    titleEn?: string;              // "Energy consumption within the organization"
    category: ESGCategory;
    subcategory?: string;          // "能源" / "水資源" / "多元共融"
    unit: string;                  // Display unit: "GJ" / "tCO₂e" / "%"
    dataType: DataType;
    validation: AtomicValidation;
    description: string;           // Plain language explanation
    gri?: string;                  // "GRI 302-1"
    sasb?: string;                 // Corresponding SASB metric
    sdg?: string[];                // ["SDG 7", "SDG 13"]
    exampleValue?: string;         // "12,500 GJ"
    hint?: string;                 // User-facing fill-in hint
    relatedIndicators?: string[];  // IDs of related atoms
}

// ─────────────────────────────────────────────
// Layer 2: MOLECULE — Chapter Indicator Group
// ─────────────────────────────────────────────
export interface IndicatorGroup {
    id: string;             // "energy" / "ghg"
    title: string;          // "能源管理"
    category: ESGCategory;
    griChapter?: string;    // "GRI 302"
    indicatorIds: string[]; // Array of AtomicESGIndicator IDs
    description?: string;
}

// ─────────────────────────────────────────────
// Layer 3: ORGANISM — Full Report Structure
// ─────────────────────────────────────────────
export interface ESGReportTemplate {
    id: string;
    name: string;
    frameworks: ESGFramework[];
    groups: IndicatorGroup[];
}

// ─────────────────────────────────────────────
// Runtime data entry (filled by user)
// ─────────────────────────────────────────────
export interface IndicatorValueEntry {
    indicatorId: string;
    value: string | number | boolean;
    unit?: string;
    notes?: string;
    verifiedAt?: string; // ISO date if ZKP verified
    confidence?: number; // 0-100
}

// ─────────────────────────────────────────────
// Shared API response types
// (safe to import from both server and client)
// ─────────────────────────────────────────────
export interface IndicatorLibraryResponse {
    indicators: AtomicESGIndicator[];
    total: number;
    byCategory: Record<ESGCategory, number>;
    subcategories: Record<ESGCategory, string[]>;
}

export interface IndicatorErrorResponse {
    error: string;
    code: number;
}
