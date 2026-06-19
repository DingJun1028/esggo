/**
 * 報告 Schema 統一匯出 (Schema Registry)
 * 支援 Schema-Driven UI 動態渲染
 */

export { CARBON_FOOTPRINT_SCHEMA } from './carbon-footprint.schema';
export type { CarbonFootprintSchema } from './carbon-footprint.schema';

export { GRI_2026_SCHEMA } from './gri-2026.schema';
export type { GRI2026Schema } from './gri-2026.schema';

export { HUMAN_CAPITAL_SCHEMA } from './human-capital.schema';
export type { HumanCapitalSchema } from './human-capital.schema';

export { BOARD_GOVERNANCE_SCHEMA } from './board-governance.schema';
export type { BoardGovernanceSchema } from './board-governance.schema';

import { CARBON_FOOTPRINT_SCHEMA } from './carbon-footprint.schema';
import { GRI_2026_SCHEMA } from './gri-2026.schema';
import { HUMAN_CAPITAL_SCHEMA } from './human-capital.schema';
import { BOARD_GOVERNANCE_SCHEMA } from './board-governance.schema';
import { MASTER_SOVEREIGN_SCHEMA } from './master-sovereign.schema';

/**
 * 報告 ID → Schema 的映射表
 * 用於動態根據 reportId 載入對應 Schema
 */
export const SCHEMA_REGISTRY: Record<string, any> = {
    'rep-carbon-001': CARBON_FOOTPRINT_SCHEMA,
    'rep-gri-001': GRI_2026_SCHEMA,
    'rep-hr-001': HUMAN_CAPITAL_SCHEMA,
    'rep-governance-001': BOARD_GOVERNANCE_SCHEMA,
    'rep-master-2026': MASTER_SOVEREIGN_SCHEMA,
};

/**
 * 報告 Schema 的欄位類型定義
 */
export type SchemaFieldType = 'text' | 'textarea' | 'number' | 'date' | 'select' | 'file';

export interface SchemaField {
    id: string;
    label: string;
    label_en: string;
    type: SchemaFieldType;
    required: boolean;
    unit?: string;
    options?: string[];
    placeholder?: string;
    accept?: string;
    computed?: boolean;
}

export interface SchemaSection {
    id: string;
    title: string;
    title_en: string;
    fields: SchemaField[];
}

export interface ReportSchemaBase {
    id: string;
    version: string;
    title: string;
    title_en: string;
    standard: string;
    sections: SchemaSection[];
    framework_mapping: {
        gri: string[];
        tcfd: string[];
        sdg: string[];
        sasb: string[];
        fsc?: string[];
    };
}
