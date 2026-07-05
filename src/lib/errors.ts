// ═══════════════════════════════════════════════════════════════
// src/lib/errors.ts — 向下相容橋接層
// 所有實際定義已遷移至 @esggo/errors （單一事實來源）
// ═══════════════════════════════════════════════════════════════

export {
  ERROR_CODES,
  HTTP_STATUS,
  createError,
  createSuccessBody,
  createErrorBody,
  getError,
  getErrorCodeMap,
} from '@esggo/errors';

export type {
  ErrorCodeDef,
  ErrorCodeKey,
  ErrorCodeString,
  ErrorResponse,
  SuccessResponse,
  HttpStatusCode,
} from '@esggo/errors';