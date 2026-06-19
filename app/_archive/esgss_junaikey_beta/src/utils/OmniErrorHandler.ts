import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

/**
 * 🛡️ 奧秘全域錯誤處理器 (Omni Error Handler)
 * --------------------------------------------------
 * [協議] 🔴 Phase 29: 系統強化與效能演進
 * 
 * 核心職責：
 * 1. 統一全系統的錯誤碼與回應格式。
 * 2. 整合 5T 協議狀態，識別誠信中斷點。
 * 3. 提供開發者友好的錯誤追蹤與日誌記錄。
 */

export enum OmniErrorCode {
    // 5T 相關錯誤
    OMNI_5T_INTEGRITY_FAIL = 'OMNI_5T_INTEGRITY_FAIL',
    OMNI_5T_TRACE_LOST = 'OMNI_5T_TRACE_LOST',

    // 身份與安全
    OMNI_AUTH_SIGN_MISMATCH = 'OMNI_AUTH_SIGN_MISMATCH',
    OMNI_IDENTITY_NOT_FOUND = 'OMNI_IDENTITY_NOT_FOUND',

    // 數據與快取
    OMNI_CACHE_STALE = 'OMNI_CACHE_STALE',
    OMNI_VAULT_DECRYPTION_FAIL = 'OMNI_VAULT_DECRYPTION_FAIL',

    // 系統通用
    OMNI_INTERNAL_NIRVANA_ERROR = 'OMNI_INTERNAL_NIRVANA_ERROR',
    OMNI_VALIDATION_FAILED = 'OMNI_VALIDATION_FAILED'
}

export interface OmniErrorPayload {
    code: OmniErrorCode;
    message: string;
    details?: any;
    protocol_status: 'COMPROMISED' | 'STABLE';
    timestamp: string;
    trace_id: string;
}

export class OmniError extends Error {
    public payload: OmniErrorPayload;

    constructor(code: OmniErrorCode, message: string, details?: any) {
        super(message);
        this.name = 'OmniError';
        this.payload = {
            code,
            message,
            details,
            protocol_status: this.resolveProtocolStatus(code),
            timestamp: new Date().toISOString(),
            trace_id: `trace-${Math.random().toString(36).substring(2, 10)}`
        };

        // 自動記錄日誌
        this.logError();
    }

    private resolveProtocolStatus(code: OmniErrorCode): 'COMPROMISED' | 'STABLE' {
        // 凡是涉及 5T 完整性的錯誤，皆標記為 COMPROMISED
        if (code.startsWith('OMNI_5T_') || code === OmniErrorCode.OMNI_AUTH_SIGN_MISMATCH) {
            return 'COMPROMISED';
        }
        return 'STABLE';
    }

    private logError() {
        omniLogger.error(LogCategory.SYSTEM, `[OmniError] ${this.payload.code}: ${this.message}`, {
            payload: this.payload
        });
    }

    /**
     * 轉換為 JSON 回應格式
     */
    public toResponse() {
        return {
            success: false,
            error: this.payload
        };
    }
}

/**
 * 靜態工具方法
 */
export const handleOmniError = (error: any): OmniError => {
    if (error instanceof OmniError) return error;

    // 將未知錯誤封裝為 OMNI_INTERNAL_NIRVANA_ERROR
    return new OmniError(
        OmniErrorCode.OMNI_INTERNAL_NIRVANA_ERROR,
        error.message || 'An unexpected error occurred in the state of Nirvana.',
        error
    );
};
