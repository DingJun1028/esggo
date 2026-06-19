/**
 * 🎯 L1 Health Check - Minimum Viable Data (MVD)
 * Sprint 1: L1 快篩最小資料集定義
 * --------------------------------------------------
 * 設計目標：10 分鐘內完成填寫
 */

/**
 * Company Profile (公司基本資料)
 */
export interface CompanyProfile {
    name: string;
    industry: string;
    employeeCount: number;
    annualRevenue?: number; // Optional, 單位：萬元
    isListed: boolean;
}

/**
 * Governance Quick Check (治理快速檢核)
 */
export interface GovernanceQuickCheck {
    hasBoard: boolean;                      // 是否有董事會
    hasSustainabilityPolicy: boolean;       // 是否有永續政策
    hasEthicsCode: boolean;                 // 是否有道德守則
    conductsRiskAssessment: boolean;        // 是否進行風險評估
    hasBoardESGOversight?: boolean;         // (Server requirement)
    hasEthicsPolicy?: boolean;              // (Server requirement)
}

/**
 * Environmental Quick Check (環境快速檢核)
 */
export interface EnvironmentalQuickCheck {
    tracksEmissions: boolean;               // 是否追蹤碳排放
    hasWasteManagement: boolean;            // 是否有廢棄物管理
    monitorsEnergyUse: boolean;             // 是否監控能源使用
    hasEnvironmentalPolicy: boolean;        // 是否有環境政策
    hasCarbonInventory?: boolean;           // (Server requirement)
    hasEnergyManagement?: boolean;          // (Server requirement)
}

/**
 * Social Quick Check (社會快速檢核)
 */
export interface SocialQuickCheck {
    hasDiversityPolicy: boolean;            // 是否有多元化政策
    tracksEmployeeSatisfaction: boolean;    // 是否追蹤員工滿意度
    providesTraining: boolean;              // 是否提供培訓
    hasOccupationalSafety: boolean;         // 是否有職業安全措施
    hasEmployeeSatisfaction?: boolean;      // (Server requirement alias)
    hasOccupationalHealth?: boolean;        // (Server requirement alias)
}

/**
 * L1 Minimum Viable Data (L1 最小資料集)
 */
export interface L1MinimalData {
    companyProfile: CompanyProfile;
    governance: GovernanceQuickCheck;
    environmental: EnvironmentalQuickCheck;
    social: SocialQuickCheck;
    submittedAt?: Date;
    userId?: string;
}

/**
 * L1 Assessment Result (L1 評估結果)
 */
export interface L1AssessmentResult {
    id: string;
    score: number; // 0-100
    overallScore?: number; // (Alias for score used in routes)
    dimensionScores?: {
        governance: number;
        environmental: number;
        social: number;
    };
    gaps: Gap[];
    estimatedHours: number;
    estimatedWorkload?: number; // (Alias for estimatedHours)
    upgradeRecommendation: boolean;
    recommendations?: string[];
    metadata?: Record<string, any>;
    createdAt: Date;
}

/**
 * Gap (缺失項目)
 */
export interface Gap {
    category: 'governance' | 'environmental' | 'social';
    dimension?: 'governance' | 'environmental' | 'social'; // Alias
    title: string;
    item?: string; // (Server requirement)
    severity: 'critical' | 'high' | 'medium' | 'low';
    priority?: 'high' | 'medium' | 'low'; // (Server requirement)
    description: string;
    currentStatus?: string; // (Server requirement)
    targetStatus?: string;  // (Server requirement)
    estimatedHoursToFix: number;
    estimatedHours?: number; // Alias
    recommendedAction: string;
}

/**
 * L1 Scoring Weights (評分權重)
 */
export const L1_SCORING_WEIGHTS = {
    governance: 0.35,
    environmental: 0.35,
    social: 0.30,
} as const;

/**
 * Helper: Calculate L1 Score
 */
export function calculateL1Score(data: L1MinimalData): number {
    const gScore = calculateCategoryScore(data.governance);
    const eScore = calculateCategoryScore(data.environmental);
    const sScore = calculateCategoryScore(data.social);

    return Math.round(
        gScore * L1_SCORING_WEIGHTS.governance +
        eScore * L1_SCORING_WEIGHTS.environmental +
        sScore * L1_SCORING_WEIGHTS.social
    );
}

function calculateCategoryScore(category: Record<string, any>): number {
    const keys = Object.keys(category).filter(k => typeof category[k] === 'boolean');
    if (keys.length === 0) return 0;
    const positive = keys.filter(k => category[k]).length;
    return (positive / keys.length) * 100;
}
