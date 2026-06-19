/**
 * 🛠️ OmniError: 全域標準化錯誤類別
 * ---------------------------------------
 * [協議] 階段 103: 交付準備與文件標準化
 * 
 * 核心職責：
 * 1. 提供統一的錯誤結構。
 * 2. 支援 HTTP 狀態碼與自定義錯誤代碼。
 * 3. 確保錯誤訊息在前後端傳遞的一致性。
 */

export enum ErrorCode {
    BAD_REQUEST = 'ESG-API-301',
    UNAUTHORIZED = 'ESG-AUTH-001',
    FORBIDDEN = 'ESG-AUTH-004',
    NOT_FOUND = 'ESG-DATA-100',
    VALIDATION_ERROR = 'ESG-DATA-101',
    CONFLICT = 'ESG-DATA-102',
    RATE_LIMIT_EXCEEDED = 'ESG-API-300',
    INTERNAL_ERROR = 'ESG-SYS-400',
    CACHE_ERROR = 'ESG-SYS-403',
    DB_ERROR = 'ESG-SYS-401',
    AI_ERROR = 'ESG-SYS-400', // AI errors default to sys for now
    CSRF_ERROR = 'EBADCSRFTOKEN',

    // Domain Specific: UAS (Unified Advancement System)
    UAS_PROCESS_ID_MISSING = 'ESG-UAS-001',
    UAS_INVALID_PROGRESS_DATA = 'ESG-UAS-002',
    UAS_BADGE_GRANT_FAILED = 'ESG-UAS-003',

    // Domain Specific: Behavior analytics
    BEHAVIOR_TRACKING_FAILED = 'ESG-BEH-001',
    BEHAVIOR_ANALYSIS_FAILED = 'ESG-BEH-002',

    // Domain Specific: Intelligent Asset / Market
    INTEL_CRAWL_FAILED = 'ESG-INT-001',
    REPORT_GEN_FAILED = 'ESG-REP-001',
}

export class OmniError extends Error {
    public statusCode: number;
    public errorCode: string;
    public details?: any;
    public timestamp: string;
    public messageTC?: string;

    constructor(
        message: string,
        statusCode: number = 500,
        errorCode: string = ErrorCode.INTERNAL_ERROR,
        details?: any,
        messageTC?: string
    ) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;
        this.messageTC = messageTC;
        this.timestamp = new Date().toISOString();

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    public toJSON() {
        return {
            success: false,
            error: {
                message: this.message,
                messageTC: this.messageTC || '', // Ensure it's never undefined
                code: this.errorCode,
                details: this.details,
                statusCode: this.statusCode,
                timestamp: this.timestamp,
            },
        };
    }
}

export class ValidationError extends OmniError {
    constructor(message: string, details?: any) {
        super(message, 400, ErrorCode.VALIDATION_ERROR, details);
    }
}

export class NotFoundError extends OmniError {
    constructor(message: string = 'Resource not found') {
        super(message, 404, ErrorCode.NOT_FOUND);
    }
}

export class UnauthorizedError extends OmniError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401, ErrorCode.UNAUTHORIZED);
    }
}

export class ForbiddenError extends OmniError {
    constructor(message: string = 'Forbidden') {
        super(message, 403, ErrorCode.FORBIDDEN);
    }
}

export class ConflictError extends OmniError {
    constructor(message: string) {
        super(message, 409, ErrorCode.CONFLICT);
    }
}
