/**
 * report-hub.ts
 * [協議] 🏭 Sustainability Report Production Hub - Assembly Types
 */

import { IESGMetric, IAIInsight } from './report.js';

export type ReportAssemblyStatus = 'IDLE' | 'INDEXING' | 'GENERATING' | 'REFINING' | 'COMPLETED' | 'FAILED';

export interface IReportChapter {
    id: string;
    title: string;
    index: string; // e.g., "1.1", "2.1.3"
    content: string;
    status: 'EMPTY' | 'DRAFT' | 'AI_GENERATED' | 'VERIFIED';
    metrics_context: string[]; // UUIDs of IESGMetric used in this chapter
    insights_context: string[]; // AI Insight references
    hash_lock?: string; // 5T Hash Lock for this specific chapter
}

export interface IReportIndex {
    standard: 'GRI' | 'TCFD' | 'SASB' | '97_KPI_TAIWAN';
    chapters: IReportChapter[];
    completeness: number; // 0-100
}

export interface ISustainabilityReportHub {
    report_id: string;
    assembly_status: ReportAssemblyStatus;
    indices: IReportIndex[];
    factory_log: IAssemblyLog[];
    last_assembled_at?: number;
}

export interface IAssemblyLog {
    timestamp: number;
    level: 'INFO' | 'WARN' | 'ERROR';
    message: string;
    target_chapter_id?: string;
}

export interface IComplianceResult {
    standard: string;
    score: number; // 0-100
    gaps: IComplianceGap[];
    suggestions: string[];
    verified_at: number;
}

export interface IComplianceGap {
    indicator_id: string; // e.g., "GRI 305-1"
    description: string;
    missing_data: string[];
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}
