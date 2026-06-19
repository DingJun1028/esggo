/**
 * report.ts
 * [協議] 🔴 Sustainability Report Center - Domain Types
 */

export type ESGScope = 'SCOPE_1' | 'SCOPE_2' | 'SCOPE_3';

// --- Reporting Core Enums ---

export enum ReportStageLevel {
    LV1_INTRODUCTION = 1,
    LV2_INVENTORY = 2,
    LV3_GOALS = 3,
    LV4_DATA = 4,
    LV5_DRAFTING = 5,
    LV6_OPTIMIZATION = 6,
    LV7_VISUALIZATION = 7,
    LV8_RELEASE = 8,
}

export enum SubscriptionTier {
    BRONZE = 'BRONZE',
    GOLD = 'GOLD',
    DIAMOND = 'DIAMOND',
}

// --- Reporting Core Interfaces ---

export interface IESGMetric {
    id: string;
    category: string; // e.g., "Electricity", "Mobile Combustion"
    scope: ESGScope;
    value: number;
    unit: string;
    factor: number; // Emission factor
    carbonEquivalent: number; // Calculated CO2e
    timestamp: number;
    source: string; // "Manual", "Excel", "API"
    evidence_cid?: string; // Link to SovereignVault
}

export interface IAIInsight {
    type: 'RISK' | 'OPPORTUNITY' | 'SUGGESTION';
    title: string;
    description: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    impact_score: number;
}

export interface IComplianceCheck {
    standard: string;
    score: number;
    passed: boolean;
    recommendations: string[];
}

export interface IReportMetadata {
    id: string;
    title: string;
    currentLevel: ReportStageLevel;
    subscriptionTier: SubscriptionTier;
    completionPercentage: number;
    complianceChecks: IComplianceCheck[];
    lastUpdated: string;
}

export interface IReportStage {
    level: ReportStageLevel;
    title: string;
    description: string;
    status: 'pending' | 'active' | 'completed' | 'locked';
    isCompleted: boolean;
    xpReward: number;
    unlockedFeatures: string[];
}

export interface IReportDraft {
    uid: string;
    title: string;
    companyName: string;
    reportingYear: number;
    status: 'draft' | 'review' | 'published' | 'archived';
    metrics: IESGMetric[];
    insights: IAIInsight[];
    standards: ('GRI' | 'TCFD' | 'SASB' | 'IFRS_S1' | 'IFRS_S2' | 'UN_SDGs')[];
    progress: number; // 0-100
    version: number;
    published_at?: number;
    created_at: number;
    updated_at: number;
    created_by?: string;
    hash?: string; // 4T Trustworthy Hash Lock
}

export interface IBenchmarkingData {
    industry: string;
    average_emissions: number;
    percentile: number;
    top_performers: string[];
}
