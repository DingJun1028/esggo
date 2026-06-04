import { z } from 'zod';
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: ApiError;
    meta?: ResponseMetadata;
}
export type ApiResult<T> = Promise<ApiResponse<T>>;
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    field_errors?: FieldError[];
    stack?: string;
}
export interface FieldError {
    field: string;
    message: string;
    code: string;
}
export interface ResponseMetadata {
    timestamp: Date;
    request_id: string;
    version: string;
    rate_limit?: RateLimitInfo;
    /** T1..T5 誠信標籤 (Integrity Tag) */
    integrity_tag?: string;
    /** 數據真理哈希鎖 (Hash Lock) */
    hash_lock?: string;
    /** 全域追蹤識別碼 (Trace ID / Request ID) */
    trace_id?: string;
    /** 分頁資訊 */
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface RateLimitInfo {
    limit: number;
    remaining: number;
    reset_at: Date;
}
export declare enum ErrorCode {
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    NOT_FOUND = "NOT_FOUND",
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
    EVIDENCE_NOT_FOUND = "EVIDENCE_NOT_FOUND",
    EVIDENCE_ALREADY_SEALED = "EVIDENCE_ALREADY_SEALED",
    EVIDENCE_CONTENT_TOO_LARGE = "EVIDENCE_CONTENT_TOO_LARGE",
    EVIDENCE_EXPIRED = "EVIDENCE_EXPIRED",
    HASH_MISMATCH = "HASH_MISMATCH",
    BLOCKCHAIN_VERIFICATION_FAILED = "BLOCKCHAIN_VERIFICATION_FAILED",
    TAMPER_DETECTED = "TAMPER_DETECTED",
    UCC_NOT_FOUND = "UCC_NOT_FOUND",
    INVALID_TAG = "INVALID_TAG",
    RELATION_ALREADY_EXISTS = "RELATION_ALREADY_EXISTS",
    DATABASE_ERROR = "DATABASE_ERROR",
    EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR"
}
export declare function createSuccessResponse<T>(data: T, meta?: Partial<ResponseMetadata>): ApiResponse<T>;
export declare function createErrorResponse(code: ErrorCode | string, message: string, details?: Record<string, unknown>): ApiResponse;
export declare const ApiResponseSchema: <T extends z.ZodType>(dataSchema: T) => z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        field_errors: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodString;
            message: z.ZodString;
            code: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            code: string;
            message: string;
            field: string;
        }, {
            code: string;
            message: string;
            field: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: Record<string, unknown> | undefined;
        field_errors?: {
            code: string;
            message: string;
            field: string;
        }[] | undefined;
    }, {
        code: string;
        message: string;
        details?: Record<string, unknown> | undefined;
        field_errors?: {
            code: string;
            message: string;
            field: string;
        }[] | undefined;
    }>>;
    meta: z.ZodOptional<z.ZodObject<{
        timestamp: z.ZodDate;
        request_id: z.ZodString;
        version: z.ZodString;
        rate_limit: z.ZodOptional<z.ZodObject<{
            limit: z.ZodNumber;
            remaining: z.ZodNumber;
            reset_at: z.ZodDate;
        }, "strip", z.ZodTypeAny, {
            limit: number;
            remaining: number;
            reset_at: Date;
        }, {
            limit: number;
            remaining: number;
            reset_at: Date;
        }>>;
    }, "strip", z.ZodTypeAny, {
        timestamp: Date;
        version: string;
        request_id: string;
        rate_limit?: {
            limit: number;
            remaining: number;
            reset_at: Date;
        } | undefined;
    }, {
        timestamp: Date;
        version: string;
        request_id: string;
        rate_limit?: {
            limit: number;
            remaining: number;
            reset_at: Date;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        field_errors: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodString;
            message: z.ZodString;
            code: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            code: string;
            message: string;
            field: string;
        }, {
            code: string;
            message: string;
            field: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: Record<string, unknown> | undefined;
        field_errors?: {
            code: string;
            message: string;
            field: string;
        }[] | undefined;
    }, {
        code: string;
        message: string;
        details?: Record<string, unknown> | undefined;
        field_errors?: {
            code: string;
            message: string;
            field: string;
        }[] | undefined;
    }>>;
    meta: z.ZodOptional<z.ZodObject<{
        timestamp: z.ZodDate;
        request_id: z.ZodString;
        version: z.ZodString;
        rate_limit: z.ZodOptional<z.ZodObject<{
            limit: z.ZodNumber;
            remaining: z.ZodNumber;
            reset_at: z.ZodDate;
        }, "strip", z.ZodTypeAny, {
            limit: number;
            remaining: number;
            reset_at: Date;
        }, {
            limit: number;
            remaining: number;
            reset_at: Date;
        }>>;
    }, "strip", z.ZodTypeAny, {
        timestamp: Date;
        version: string;
        request_id: string;
        rate_limit?: {
            limit: number;
            remaining: number;
            reset_at: Date;
        } | undefined;
    }, {
        timestamp: Date;
        version: string;
        request_id: string;
        rate_limit?: {
            limit: number;
            remaining: number;
            reset_at: Date;
        } | undefined;
    }>>;
}>, any> extends infer T_1 ? { [k in keyof T_1]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        field_errors: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodString;
            message: z.ZodString;
            code: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            code: string;
            message: string;
            field: string;
        }, {
            code: string;
            message: string;
            field: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: Record<string, unknown> | undefined;
        field_errors?: {
            code: string;
            message: string;
            field: string;
        }[] | undefined;
    }, {
        code: string;
        message: string;
        details?: Record<string, unknown> | undefined;
        field_errors?: {
            code: string;
            message: string;
            field: string;
        }[] | undefined;
    }>>;
    meta: z.ZodOptional<z.ZodObject<{
        timestamp: z.ZodDate;
        request_id: z.ZodString;
        version: z.ZodString;
        rate_limit: z.ZodOptional<z.ZodObject<{
            limit: z.ZodNumber;
            remaining: z.ZodNumber;
            reset_at: z.ZodDate;
        }, "strip", z.ZodTypeAny, {
            limit: number;
            remaining: number;
            reset_at: Date;
        }, {
            limit: number;
            remaining: number;
            reset_at: Date;
        }>>;
    }, "strip", z.ZodTypeAny, {
        timestamp: Date;
        version: string;
        request_id: string;
        rate_limit?: {
            limit: number;
            remaining: number;
            reset_at: Date;
        } | undefined;
    }, {
        timestamp: Date;
        version: string;
        request_id: string;
        rate_limit?: {
            limit: number;
            remaining: number;
            reset_at: Date;
        } | undefined;
    }>>;
}>, any>[k]; } : never, z.baseObjectInputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        field_errors: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodString;
            message: z.ZodString;
            code: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            code: string;
            message: string;
            field: string;
        }, {
            code: string;
            message: string;
            field: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: Record<string, unknown> | undefined;
        field_errors?: {
            code: string;
            message: string;
            field: string;
        }[] | undefined;
    }, {
        code: string;
        message: string;
        details?: Record<string, unknown> | undefined;
        field_errors?: {
            code: string;
            message: string;
            field: string;
        }[] | undefined;
    }>>;
    meta: z.ZodOptional<z.ZodObject<{
        timestamp: z.ZodDate;
        request_id: z.ZodString;
        version: z.ZodString;
        rate_limit: z.ZodOptional<z.ZodObject<{
            limit: z.ZodNumber;
            remaining: z.ZodNumber;
            reset_at: z.ZodDate;
        }, "strip", z.ZodTypeAny, {
            limit: number;
            remaining: number;
            reset_at: Date;
        }, {
            limit: number;
            remaining: number;
            reset_at: Date;
        }>>;
    }, "strip", z.ZodTypeAny, {
        timestamp: Date;
        version: string;
        request_id: string;
        rate_limit?: {
            limit: number;
            remaining: number;
            reset_at: Date;
        } | undefined;
    }, {
        timestamp: Date;
        version: string;
        request_id: string;
        rate_limit?: {
            limit: number;
            remaining: number;
            reset_at: Date;
        } | undefined;
    }>>;
}> extends infer T_2 ? { [k_1 in keyof T_2]: z.baseObjectInputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        field_errors: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodString;
            message: z.ZodString;
            code: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            code: string;
            message: string;
            field: string;
        }, {
            code: string;
            message: string;
            field: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: Record<string, unknown> | undefined;
        field_errors?: {
            code: string;
            message: string;
            field: string;
        }[] | undefined;
    }, {
        code: string;
        message: string;
        details?: Record<string, unknown> | undefined;
        field_errors?: {
            code: string;
            message: string;
            field: string;
        }[] | undefined;
    }>>;
    meta: z.ZodOptional<z.ZodObject<{
        timestamp: z.ZodDate;
        request_id: z.ZodString;
        version: z.ZodString;
        rate_limit: z.ZodOptional<z.ZodObject<{
            limit: z.ZodNumber;
            remaining: z.ZodNumber;
            reset_at: z.ZodDate;
        }, "strip", z.ZodTypeAny, {
            limit: number;
            remaining: number;
            reset_at: Date;
        }, {
            limit: number;
            remaining: number;
            reset_at: Date;
        }>>;
    }, "strip", z.ZodTypeAny, {
        timestamp: Date;
        version: string;
        request_id: string;
        rate_limit?: {
            limit: number;
            remaining: number;
            reset_at: Date;
        } | undefined;
    }, {
        timestamp: Date;
        version: string;
        request_id: string;
        rate_limit?: {
            limit: number;
            remaining: number;
            reset_at: Date;
        } | undefined;
    }>>;
}>[k_1]; } : never>;
//# sourceMappingURL=api.types.d.ts.map