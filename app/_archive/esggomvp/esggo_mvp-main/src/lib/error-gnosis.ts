/**
 * 🛡️ Gnosis Error Matrix: Sentient Error Handling
 * philosophy: 災難圓通 — Graceful Failure & Truthful Feedback
 */

export enum GnosisErrorCode {
    GNOSIS_INFRA_STALL = 'G001',
    GNOSIS_AI_HYPERSPACE_LOST = 'G002',
    GNOSIS_DATA_HATCH_FAILURE = 'G003',
    GNOSIS_5T_INTEGRITY_VIOLATION = 'G004',
    GNOSIS_AUTH_GATE_CLOSED = 'G005',
    GNOSIS_RATE_LIMIT_STORM = 'G006',
}

export interface IGnosisError {
    code: GnosisErrorCode;
    message: string; // [繁體中文] 妙覺引導訊息
    technical: string; // [Ti-Code] 原始錯誤代碼
    intent: 'Warning' | 'Stall' | 'Transcendence_Required';
}

export const GNOSIS_ERROR_MAP: Record<GnosisErrorCode, IGnosisError> = {
    [GnosisErrorCode.GNOSIS_INFRA_STALL]: {
        code: GnosisErrorCode.GNOSIS_INFRA_STALL,
        message: '底層架構發生暫時性停滯，請檢查終始矩陣是否正常運作。',
        technical: 'INFRA_TIMEOUT_ERR',
        intent: 'Stall',
    },
    [GnosisErrorCode.GNOSIS_AI_HYPERSPACE_LOST]: {
        code: GnosisErrorCode.GNOSIS_AI_HYPERSPACE_LOST,
        message: 'AI 智慧空間通訊發生位移，正在嘗試重新定位。',
        technical: 'GEMINI_PRO_DISCONNECT',
        intent: 'Warning',
    },
    [GnosisErrorCode.GNOSIS_DATA_HATCH_FAILURE]: {
        code: GnosisErrorCode.GNOSIS_DATA_HATCH_FAILURE,
        message: '數據孵化失敗，數據可能不符合 5T 誠信協議。',
        technical: 'NCB_DATA_INGEST_FAIL',
        intent: 'Transcendence_Required',
    },
    [GnosisErrorCode.GNOSIS_5T_INTEGRITY_VIOLATION]: {
        code: GnosisErrorCode.GNOSIS_5T_INTEGRITY_VIOLATION,
        message: '偵測到數據篡改企圖，5T 誠信門戶已自動鎖定。',
        technical: 'HASH_LOCK_MISMATCH',
        intent: 'Transcendence_Required',
    },
    [GnosisErrorCode.GNOSIS_AUTH_GATE_CLOSED]: {
        code: GnosisErrorCode.GNOSIS_AUTH_GATE_CLOSED,
        message: '存取門戶未經授權，需具備主權者令牌方可通行。',
        technical: 'UNAUTHORIZED_ACCESS',
        intent: 'Stall',
    },
    [GnosisErrorCode.GNOSIS_RATE_LIMIT_STORM]: {
        code: GnosisErrorCode.GNOSIS_RATE_LIMIT_STORM,
        message: '流量風暴過於強烈，請稍後再行發起共鳴。',
        technical: 'API_RATE_LIMIT_EXCEEDED',
        intent: 'Warning',
    },
};

export class GnosisError extends Error {
    public details: IGnosisError;

    constructor(code: GnosisErrorCode) {
        const details = GNOSIS_ERROR_MAP[code];
        super(details.message);
        this.details = details;
        this.name = 'GnosisError';
    }
}
