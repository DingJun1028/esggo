/**
 * @name IAcceptanceArtifact
 * @description 萬有引力協議 - 驗收證據契約
 * 
 * 這是您的 TypeScript 核心接口定義。
 * 它確保了每一筆驗收數據都具備可溯源性 (Truth) 與 不可篡改性 (Trust)。
 */

import crypto from 'crypto';

/**
 * 驗收狀態枚舉
 */
export type AcceptanceStatus = 'PASS' | 'FAIL' | 'PENDING';

/**
 * 步驟記錄接口
 */
export interface IAcceptanceStep {
    action: string;           // 執行動作描述
    expected: any;            // 預期結果
    actual: any;              // 實際結果
    evidence: string;         // 證據 (Base64 或雲端路徑)
    timestamp: number;        // 時間戳
}

/**
 * 環境快照接口
 */
export interface IEnvironmentSnapshot {
    nodeVersion: string;
    os: string;
    seed: number;             // 隨機數種子，確保隨機邏輯可重現
    gitCommitHash: string;   // Git 提交雜湊
    aiModelVersion: string;  // AI 模型版本
}

/**
 * 邏輯快照接口
 */
export interface ILogicSnapshot {
    input: any;              // 測試輸入快照
    expectedOutput: any;     // AI 預期的輸出
    actualOutput: any;       // 實際跑出的結果
    traceLog: string[];      // 執行路徑日誌
}

/**
 * 證據左證接口
 */
export interface IEvidence {
    hashLock: string;        // 對整個 Artifact 進行 Hash 鎖定
    attachments: string[];   // 截圖或 Logs 的 Base64/URI
}

/**
 * 萬有引力協議：驗收產出定義
 * 
 * 這是您的「神聖契約」，確保 AI 驗收不只是口頭通過，
 * 而是有具體可執行的結構化數據。
 */
export interface IAcceptanceArtifact {
    // ========== 核心識別 (繼承自 IComponentCore) ==========
    readonly uuid: string;              // 奧秘永憶主體唯一碼
    readonly version: string;            // 語義化版本
    readonly timestamp: number;          // 刻印時間戳
    readonly componentName: string;      // 組件名稱

    // ========== 驗收元數據 ==========
    readonly status: AcceptanceStatus;
    readonly entropyLevel: number;       // 熵值評估 (0.0 - 1.0)
    readonly testCoverage: number;      // 測試覆蓋率

    // ========== Multi-Dimensional Acceptance Scores (OmniAcceptance) ==========
    readonly dimensions5D?: {            // ⚠️ Legacy: 5D scores (deprecated)
        function: number;                // 功能得分 (0-100)
        performance: number;             // 性能得分 (0-100)
        potential: number;               // 潛能得分 (0-100)
        capacity: number;                // 量能得分 (0-100)
        momentum: number;                // 動能得分 (0-100)
    };
    readonly dimensions9D?: {            // ✅ NEW: 9D scores (recommended)
        function: number;                // 功能得分 (0-100)
        performance: number;             // 性能得分 (0-100)
        efficiency: number;              // 效能得分 (0-100) 🆕
        capacity: number;                // 量能得分 (0-100)
        probability: number;             // 可能得分 (0-100) 🆕
        capability: number;              // 機能得分 (0-100) 🆕
        potential: number;               // 潛能得分 (0-100)
        potentialEnergy: number;         // 勢能得分 (0-100) 🆕
        momentum: number;                // 動能得分 (0-100) - integrated into efficiency
    };
    readonly dimensions?: {              // Alias: defaults to 9D if present, fallback to 5D
        function: number;
        performance: number;
        efficiency?: number;             // Optional for backward compatibility
        potential: number;
        capacity: number;
        probability?: number;            // Optional for backward compatibility
        capability?: number;             // Optional for backward compatibility
        potentialEnergy?: number;        // Optional for backward compatibility
        momentum: number;
    };
    readonly overallScore?: number;      // Overall weighted score (0-100)
    readonly acceptanceGate?: 'PASS' | 'FAIL' | 'CONDITIONAL';  // Final gate status

    // ========== 重現關鍵數據 ==========
    readonly environment: IEnvironmentSnapshot;
    readonly logicSnapshot: ILogicSnapshot;

    // ========== 步驟記錄 ==========
    readonly steps: IAcceptanceStep[];

    // ========== 證據左證庫 ==========
    readonly evidence: IEvidence;

    // ========== 元數據 ==========
    readonly description: string;        // 驗收描述
    readonly requirements: string[];     // 關聯需求
}

/**
 * 創建驗收Artifact的工廠函數
 */
export function createAcceptanceArtifact(
    uuid: string,
    componentName: string,
    status: AcceptanceStatus,
    description: string,
    requirements: string[] = []
): IAcceptanceArtifact {
    return {
        uuid,
        version: '1.0.0',
        timestamp: Date.now(),
        componentName,
        status,
        entropyLevel: 0.0,  // 初始熵值
        testCoverage: 0,
        environment: {
            nodeVersion: process.version,
            os: process.platform,
            seed: Math.floor(Math.random() * 1000000),
            gitCommitHash: '',  // 可從 git 注入
            aiModelVersion: 'gemini-1.5-flash'
        },
        logicSnapshot: {
            input: {},
            expectedOutput: {},
            actualOutput: {},
            traceLog: []
        },
        steps: [],
        evidence: {
            hashLock: '',
            attachments: []
        },
        description,
        requirements
    };
}

/**
 * 執行「永恆刻印」與「數據鎖定」
 * 
 * @param data - 驗收數據
 * @returns 不可篡改的封印版本
 */
export const sealArtifact = (data: IAcceptanceArtifact): Readonly<IAcceptanceArtifact> => {
    // 執行 Hash Lock
    const secret = "JunAiKey_Eternal_Core";
    const hash = crypto.createHmac('sha256', secret)
        .update(JSON.stringify(data.logicSnapshot))
        .update(JSON.stringify(data.steps))
        .digest('hex');

    const sealed = {
        ...data,
        evidence: { ...data.evidence, hashLock: hash }
    };

    // 執行 Object.freeze() 確保不可篡改 (Trust)
    return Object.freeze(sealed);
};

/**
 * 驗證 Artifact 完整性
 */
export const verifyArtifact = (artifact: IAcceptanceArtifact): boolean => {
    const secret = "JunAiKey_Eternal_Core";
    const expectedHash = crypto.createHmac('sha256', secret)
        .update(JSON.stringify(artifact.logicSnapshot))
        .update(JSON.stringify(artifact.steps))
        .digest('hex');

    return artifact.evidence.hashLock === expectedHash;
};

/**
 * 格式化 Artifact 為可讀字符串
 */
export const formatArtifact = (artifact: IAcceptanceArtifact): string => {
    return `
╔══════════════════════════════════════════════════════════════╗
║           JUNAIKEY 驗收契約 (ACCEPTANCE ARTIFACT)            ║
╠══════════════════════════════════════════════════════════════╣
║ UUID:          ${artifact.uuid}
║ Component:     ${artifact.componentName}
║ Status:        ${artifact.status}
║ Timestamp:     ${new Date(artifact.timestamp).toISOString()}
║ Entropy:       ${artifact.entropyLevel.toFixed(2)}
║ Test Coverage: ${(artifact.testCoverage * 100).toFixed(1)}%
╠══════════════════════════════════════════════════════════════╣
║ Environment:
║   Node:  ${artifact.environment.nodeVersion}
║   OS:    ${artifact.environment.os}
║   Seed:  ${artifact.environment.seed}
╠══════════════════════════════════════════════════════════════╣
║ Evidence Hash: ${artifact.evidence.hashLock.substring(0, 16)}...
╚══════════════════════════════════════════════════════════════╝
${artifact.description}
  `.trim();
};
