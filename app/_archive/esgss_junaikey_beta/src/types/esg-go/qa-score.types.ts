/**
 * 📊 Report QA Score - Quality Assurance Types
 * Sprint 1: QA Score v0 規則定義
 * --------------------------------------------------
 * 評分維度：完整性 / 準確性 / 一致性 / 可比性 / 可信度
 */

import { FiveTComplianceStatus } from './5t.types.js';

/**
 * QA Score Dimensions (評分維度)
 */
export interface QAScoreDimensions {
    completeness: number;    // 完整性 (0-100)
    accuracy: number;        // 準確性 (0-100)
    consistency: number;     // 一致性 (0-100)
    comparability: number;   // 可比性 (0-100)
    trustworthy: number;     // 可信度 (0-100) - Unified naming
}

/**
 * QA Score Weights (評分權重)
 */
export const QA_SCORE_WEIGHTS = {
    completeness: 0.25,
    accuracy: 0.25,
    consistency: 0.20,
    comparability: 0.15,
    trustworthy: 0.15,
} as const;

/**
 * Report Indicator (報告指標)
 */
export interface ReportIndicator {
    code: string;               // e.g., "GRI 305-1"
    name: string;
    isCoreIndicator: boolean;
    value?: string | number;
}

/**
 * Report Data (報告數據) - Consolidated Interface
 */
export interface ReportData {
    griIndicators?: ReportIndicator[];
    hasBoardESGPolicy?: boolean;
    hasEmissionsData?: boolean;
    hasEmployeeWelfareData?: boolean;
    hasMaterialityAssessment?: boolean;
    hasStakeholderEngagement?: boolean;
    ghgProtocolCompliance?: 'full' | 'partial' | 'none';
    hasThirdPartyVerification?: boolean;
    dataQualityScore?: number;
    hasYearOverYearData?: boolean;
    hasRestatementDisclosure?: boolean;
    usesConsistentMethodology?: boolean;
    reportingFrameworks?: string[];
    includesIndustryBenchmarks?: boolean;
    // legacy props
    dataPoints?: any[];
    totalIndicators?: number;
    filledIndicators?: number;
}

/**
 * QA Score Result (QA 評分結果)
 */
export interface QAScoreResult {
    overallScore: number; // 0-100
    grade: string;        // e.g., "A+", "B"
    dimensions: QAScoreDimensions;
    gaps: QAGap[];
    recommendations: string[];
    isCertifiable: boolean; // 是否可申請第三方確信
    certificationRequirements: string[];
    timestamp: Date;
    fiveTCompliance?: FiveTComplianceStatus;
}

/**
 * QA Gap (品質缺失)
 */
export interface QAGap {
    dimension: keyof QAScoreDimensions;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    affectedIndicators?: string[];
    recommendation: string;
    impactOnScore: number; // 對總分的影響
}

/**
 * Helper constants for weights (Legacy compatibility)
 */
export const LEGACY_QA_SCORE_WEIGHTS = {
    completeness: 0.30,
    accuracy: 0.25,
    consistency: 0.20,
    comparability: 0.15,
    trustworthiness: 0.10,
} as const;
