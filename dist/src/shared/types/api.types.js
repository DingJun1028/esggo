import { z } from 'zod';
// ============================================
// 錯誤代碼枚舉
// ============================================
export var ErrorCode;
(function (ErrorCode) {
    // 通用錯誤
    ErrorCode["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ErrorCode["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
    // 證據相關錯誤
    ErrorCode["EVIDENCE_NOT_FOUND"] = "EVIDENCE_NOT_FOUND";
    ErrorCode["EVIDENCE_ALREADY_SEALED"] = "EVIDENCE_ALREADY_SEALED";
    ErrorCode["EVIDENCE_CONTENT_TOO_LARGE"] = "EVIDENCE_CONTENT_TOO_LARGE";
    ErrorCode["EVIDENCE_EXPIRED"] = "EVIDENCE_EXPIRED";
    // 完整性錯誤
    ErrorCode["HASH_MISMATCH"] = "HASH_MISMATCH";
    ErrorCode["BLOCKCHAIN_VERIFICATION_FAILED"] = "BLOCKCHAIN_VERIFICATION_FAILED";
    ErrorCode["TAMPER_DETECTED"] = "TAMPER_DETECTED";
    // UCC 相關錯誤
    ErrorCode["UCC_NOT_FOUND"] = "UCC_NOT_FOUND";
    ErrorCode["INVALID_TAG"] = "INVALID_TAG";
    ErrorCode["RELATION_ALREADY_EXISTS"] = "RELATION_ALREADY_EXISTS";
    // 系統錯誤
    ErrorCode["DATABASE_ERROR"] = "DATABASE_ERROR";
    ErrorCode["EXTERNAL_SERVICE_ERROR"] = "EXTERNAL_SERVICE_ERROR";
})(ErrorCode || (ErrorCode = {}));
// ============================================
// 輔助函數：建立回應
// ============================================
export function createSuccessResponse(data, meta) {
    return {
        success: true,
        data,
        meta: {
            timestamp: new Date(),
            request_id: generateRequestId(),
            version: '8.1.0',
            ...meta,
        },
    };
}
export function createErrorResponse(code, message, details) {
    return {
        success: false,
        error: {
            code,
            message,
            details,
        },
        meta: {
            timestamp: new Date(),
            request_id: generateRequestId(),
            version: '8.1.0',
        },
    };
}
function generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
// ============================================
// Zod Schema
// ============================================
export const ApiResponseSchema = (dataSchema) => z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.object({
        code: z.string(),
        message: z.string(),
        details: z.record(z.string(), z.unknown()).optional(),
        field_errors: z.array(z.object({
            field: z.string(),
            message: z.string(),
            code: z.string(),
        })).optional(),
    }).optional(),
    meta: z.object({
        timestamp: z.coerce.date(),
        request_id: z.string(),
        version: z.string(),
        rate_limit: z.object({
            limit: z.number(),
            remaining: z.number(),
            reset_at: z.coerce.date(),
        }).optional(),
    }).optional(),
});
//# sourceMappingURL=api.types.js.map