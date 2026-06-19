/**
 * 🏛️ ESG GO Platform - Core Journey Flow Types
 * Sprint 1: Journey Definitions
 * --------------------------------------------------
 * 定義 3 條核心用戶旅程：SME老闆 / ESG專員 / CFO
 */

/**
 * Journey Stage (旅程階段)
 */
export type JourneyStage =
    | 'discovery'      // 發現階段
    | 'onboarding'     // 入門階段
    | 'engagement'     // 參與階段
    | 'value'          // 價值實現
    | 'advocacy';      // 倡導推薦

/**
 * Touchpoint Type (接觸點類型)
 */
export type TouchpointType =
    | 'landing'        // 著陸頁
    | 'form'           // 表單填寫
    | 'assessment'     // 評估
    | 'report'         // 報告查看
    | 'upgrade'        // 升級決策
    | 'collaboration'  // 協作
    | 'validation';    // 驗證

/**
 * User Action (用戶行動)
 */
export interface UserAction {
    type: 'click' | 'fill' | 'upload' | 'review' | 'approve';
    target: string;
    expectedDuration: string; // e.g., "2 minutes"
}

/**
 * Expected Response (預期系統回應)
 */
export interface ExpectedResponse {
    type: 'instant' | 'async' | 'email';
    content: string;
    successCriteria: string;
}

/**
 * Touchpoint (接觸點)
 */
export interface Touchpoint {
    id: string;
    name: string;
    type: TouchpointType;
    description: string;
    userAction: UserAction;
    expectedResponse: ExpectedResponse;
    fiveTValidation?: {
        tangible: boolean;
        traceable: boolean;
        trackable: boolean;
        transparent: boolean;
        trustworthy: boolean;
    };
}

/**
 * Journey Flow (旅程流程)
 */
export interface JourneyFlow {
    id: string;
    personaName: string;
    personaTitle: string;
    primaryPainPoint: string;
    successCriteria: string[];
    stages: {
        stage: JourneyStage;
        displayName: string;
        description: string;
        duration: string;
        touchpoints: Touchpoint[];
        keyOutcome: string;
    }[];
    conversionGoal: string;
}

/**
 * Journey Metrics (旅程指標)
 */
export interface JourneyMetrics {
    journeyId: string;
    totalUsers: number;
    stageCompletionRates: Record<JourneyStage, number>;
    averageCompletionTime: number; // minutes
    conversionRate: number; // percentage
    dropOffPoints: string[];
}
