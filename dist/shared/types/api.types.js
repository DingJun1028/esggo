"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseSchema = exports.ErrorCode = void 0;
exports.createSuccessResponse = createSuccessResponse;
exports.createErrorResponse = createErrorResponse;
const zod_1 = require("zod");
// ============================================
// 錯誤代碼枚舉
// ============================================
var ErrorCode;
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
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
// ============================================
// 輔助函數：建立回應
// ============================================
function createSuccessResponse(data, meta) {
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
function createErrorResponse(code, message, details) {
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
const ApiResponseSchema = (dataSchema) => zod_1.z.object({
    success: zod_1.z.boolean(),
    data: dataSchema.optional(),
    error: zod_1.z.object({
        code: zod_1.z.string(),
        message: zod_1.z.string(),
        details: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
        field_errors: zod_1.z.array(zod_1.z.object({
            field: zod_1.z.string(),
            message: zod_1.z.string(),
            code: zod_1.z.string(),
        })).optional(),
    }).optional(),
    meta: zod_1.z.object({
        timestamp: zod_1.z.coerce.date(),
        request_id: zod_1.z.string(),
        version: zod_1.z.string(),
        rate_limit: zod_1.z.object({
            limit: zod_1.z.number(),
            remaining: zod_1.z.number(),
            reset_at: zod_1.z.coerce.date(),
        }).optional(),
    }).optional(),
});
exports.ApiResponseSchema = ApiResponseSchema;
//# sourceMappingURL=api.types.js.map