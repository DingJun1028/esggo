import { z } from 'zod';

// ============================================
// 統一 API 回應格式
// ============================================

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
  stack?: string; // 僅開發環境
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
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset_at: Date;
}

// ============================================
// 錯誤代碼枚舉
// ============================================

export enum ErrorCode {
  // 通用錯誤
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // 證據相關錯誤
  EVIDENCE_NOT_FOUND = 'EVIDENCE_NOT_FOUND',
  EVIDENCE_ALREADY_SEALED = 'EVIDENCE_ALREADY_SEALED',
  EVIDENCE_CONTENT_TOO_LARGE = 'EVIDENCE_CONTENT_TOO_LARGE',
  EVIDENCE_EXPIRED = 'EVIDENCE_EXPIRED',
  
  // 完整性錯誤
  HASH_MISMATCH = 'HASH_MISMATCH',
  BLOCKCHAIN_VERIFICATION_FAILED = 'BLOCKCHAIN_VERIFICATION_FAILED',
  TAMPER_DETECTED = 'TAMPER_DETECTED',
  
  // UCC 相關錯誤
  UCC_NOT_FOUND = 'UCC_NOT_FOUND',
  INVALID_TAG = 'INVALID_TAG',
  RELATION_ALREADY_EXISTS = 'RELATION_ALREADY_EXISTS',
  
  // 系統錯誤
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}

// ============================================
// 輔助函數：建立回應
// ============================================

export function createSuccessResponse<T>(
  data: T,
  meta?: Partial<ResponseMetadata>
): ApiResponse<T> {
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

export function createErrorResponse(
  code: ErrorCode | string,
  message: string,
  details?: Record<string, unknown>
): ApiResponse {
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

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// Zod Schema
// ============================================

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
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
