/**
 * 🗺️ 客戶旅程型別定義 (Customer Journey Type Definitions)
 * 
 * 本檔案定義 InfoOne 平台所有服務的客戶旅程結構
 * 遵循「服務即教學，知識即資產」哲學
 * 整合 5T 協議驗證機制
 */

/**
 * 已註冊服務 ID 清單
 * 對應 24 項 MECE 服務
 */
export type RegisteredServiceId =
    // ===== 環境永續服務 (E1-E8) =====
    | 'personal-eco-compass'           // E1: 個人生態羅盤
    | 'carbon-calculator'              // E2: 碳足跡計算器
    | 'impact-repair-lab'              // E3: 影響修復實驗室
    | 'green-finance-hub'              // E4: 綠色金融中心
    | 'market-intelligence'            // E5: 市場情報中心
    | 'planetary-mesh'                 // E6: 行星網格系統
    | 'environmental-forecaster'       // E7: 環境預測引擎
    | 'nature-based-solutions'         // E8: 自然解決方案

    // ===== 社會責任服務 (S1-S8) =====
    | 'diversity-inclusion-tracker'    // S1: 多元包容追蹤器
    | 'labor-rights-monitor'           // S2: 勞工權益監控
    | 'community-impact-hub'           // S3: 社區影響中心
    | 'social-innovation-lab'          // S4: 社會創新實驗室
    | 'human-capital-analytics'        // S5: 人力資本分析
    | 'stakeholder-engagement'         // S6: 利害關係人參與
    | 'supply-chain-ethics'            // S7: 供應鏈道德追蹤
    | 'wellbeing-index'                // S8: 幸福指數儀表板

    // ===== 公司治理服務 (G1-G8) =====
    | 'board-copilot'                  // G1: 董事會副駕駛
    | 'evidence-vault'                 // G2: 證據保險庫
    | 'integrity-passport'             // G3: 誠信護照
    | 'compliance-radar'               // G4: 合規雷達
    | 'risk-intelligence'              // G5: 風險情報系統
    | 'transparency-engine'            // G6: 透明度引擎
    | 'automated-reporting'            // G7: 自動化報告生成
    | 'stakeholder-voting';            // G8: 利害關係人投票

/**
 * 5T 協議檢查點
 * 每個接觸點都必須驗證是否符合 5T 原則
 */
export interface FiveTCheckpoint {
    tangible: boolean;      // 可感知：用戶能否直觀看到/感受到影響
    traceable: boolean;     // 可溯源：數據來源是否可追溯
    trackable: boolean;     // 可追蹤：生命週期是否被記錄
    transparent: boolean;   // 可驗算：計算邏輯是否公開透明
    trustworthy: boolean;   // 不可篡改：數據是否加密鎖定
}

/**
 * 接觸點類型
 */
export type TouchpointType =
    | 'ui'           // UI 介面互動
    | 'api'          // API 呼叫
    | 'notification' // 系統通知
    | 'evidence';    // 證據產生

/**
 * 旅程階段名稱
 */
export type JourneyStageName =
    | 'discovery'           // 發現：用戶發現服務
    | 'onboarding'          // 引導：用戶開始使用
    | 'engagement'          // 參與：用戶深度互動
    | 'value-realization'   // 價值實現：用戶獲得成果
    | 'advocacy';           // 倡導：用戶分享推薦

/**
 * 接觸點定義
 * 描述用戶在旅程中的每個互動點
 */
export interface Touchpoint {
    type: TouchpointType;
    path: string;                    // URL 路徑或 API 端點
    action: string;                  // 用戶行為描述
    expectedResponse: string;        // 預期系統回應
    fiveTCompliance: FiveTCheckpoint; // 5T 協議合規狀態
    learningOutcome?: string;        // 學習成果（服務即教學）
}

/**
 * 驗收標準
 * 定義該階段完成的成功條件
 */
export interface AcceptanceCriteria {
    id: string;
    description: string;             // 標準描述
    validationMethod: 'automated' | 'manual' | 'hybrid'; // 驗證方式
    expected: string;                // 預期結果
    actualQuery?: string;            // 實際查詢方式（給測試用）
}

/**
 * 旅程階段
 * 客戶旅程的一個完整階段
 */
export interface JourneyStage {
    id: string;
    name: JourneyStageName;
    displayName: string;             // 顯示名稱（繁體中文）
    description: string;             // 階段描述
    touchpoints: Touchpoint[];       // 該階段的所有接觸點
    expectedOutcome: string;         // 預期成果
    estimatedDuration: string;       // 預估完成時間
    fiveTValidation: FiveTCheckpoint; // 整體 5T 驗證要求
    knowledgeAssets?: string[];      // 獲得的知識資產
}

/**
 * 客戶旅程定義
 * 描述一個完整的服務體驗流程
 */
export interface CustomerJourney {
    serviceId: RegisteredServiceId;
    serviceName: string;             // 服務名稱（繁體中文）
    serviceNameEn: string;           // 服務英文名稱
    category: 'environmental' | 'social' | 'governance'; // 服務分類
    stages: JourneyStage[];          // 旅程階段列表
    totalDuration: string;           // 總預估時間
    successCriteria: AcceptanceCriteria[]; // 整體驗收標準

    // 服務即教學：知識點
    learningObjectives?: string[];   // 學習目標
    knowledgeAssets?: {              // 可獲得的知識資產
        id: string;
        name: string;
        type: 'certificate' | 'badge' | 'report' | 'evidence';
    }[];
}

/**
 * 旅程分析指標
 * 用於監控旅程健康度
 */
export interface JourneyAnalytics {
    serviceId: RegisteredServiceId;
    metrics: {
        totalStarts: number;           // 總開始次數
        totalCompletions: number;      // 總完成次數
        completionRate: number;        // 完成率 (%)
        averageDuration: number;       // 平均完成時間（分鐘）
        dropOffPoints: {               // 流失點
            stageId: string;
            dropOffRate: number;
        }[];
        fiveTComplianceScore: number;  // 5T 合規分數 (0-100)
    };
    lastUpdated: string;             // 最後更新時間
}

/**
 * 測試結果
 * E2E 測試執行結果
 */
export interface JourneyTestResult {
    journeyId: string;
    serviceName: string;
    executedAt: string;
    status: 'passed' | 'failed' | 'skipped';
    duration: number;                // 執行時間（毫秒）
    stages: {
        stageId: string;
        status: 'passed' | 'failed' | 'skipped';
        errors?: string[];
        fiveTValidation: {
            tangible: boolean;
            traceable: boolean;
            trackable: boolean;
            transparent: boolean;
            trustworthy: boolean;
        };
    }[];
    screenshots?: string[];          // 截圖路徑
    videoPath?: string;              // 錄影路徑
}
