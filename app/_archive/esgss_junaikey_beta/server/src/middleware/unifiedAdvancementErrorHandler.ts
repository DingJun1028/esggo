/**
 * unifiedAdvancementErrorHandler.ts
 * -----------------------------------
 * 奧秘晉級系統 - 錯誤處理中介層
 * 
 * 核心理念：永續經營，穩定可靠
 * 設計哲學：化繁為簡，錯誤不外洩
 */

import { Request, Response, NextFunction } from 'express';
import omniLogger, { LogCategory } from '../../utils/omniLogger.js';

/**
 * 自定義錯誤類別
 */
export class UnifiedAdvancementError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;
  public messageTC?: string;

  constructor(message: string, statusCode: number = 500, code: string = 'ESG-SYS-400', details?: any, messageTC?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.messageTC = messageTC;
    this.name = 'UnifiedAdvancementError';
  }
}

/**
 * 錯誤類型定義
 */
export interface ErrorResponse {
  success: boolean;
  error: {
    message: string;
    messageTC?: string;
    code: string;
    details?: any;
  };
  timestamp: string;
  path?: string;
  meta?: any;
}

/**
 * 404 錯誤處理
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  const error: ErrorResponse = {
    success: false,
    error: {
      message: '請求的資源不存在',
      messageTC: '找不到指定的路徑',
      code: 'ESG-DATA-100',
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  };

  omniLogger.warn(LogCategory.API, `UAS NotFound: ${req.method} ${req.originalUrl}`, { path: req.originalUrl });
  res.status(404).json(error);
};

/**
 * 全局錯誤處理
 */
export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 確定錯誤類型和狀態碼
  let statusCode = error.statusCode || 500;
  let code = error.code || 'ESG-SYS-400';
  let message = error.message || '伺服器內部錯誤';
  let messageTC = error.messageTC || '系統執行中發生未預期錯誤';
  let details: any = error.details || undefined;

  // 處理自定義錯誤
  if (error instanceof UnifiedAdvancementError) {
    statusCode = error.statusCode;
    code = error.code;
    message = error.message;
    details = error.details;
  }

  // 處理驗證錯誤
  if (error.name === 'ValidationError') {
    statusCode = 400;
    code = 'ESG-DATA-101';
    message = '請求驗證失敗';
  }

  // 記錄錯誤日誌 (5T Traceable)
  const logData = {
    path: req.originalUrl,
    method: req.method,
    code,
    statusCode,
    details,
    ip: req.ip
  };

  if (statusCode >= 500) {
    omniLogger.error(LogCategory.DATABASE, `UAS Critical Failure: ${message}`, error, logData);
  } else {
    omniLogger.warn(LogCategory.API, `UAS Client Exception: ${message}`, logData);
  }

  // 構造錯誤響應 (5T Transparent)
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message,
      messageTC,
      code,
      details
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    meta: {
      requestId: (res.getHeader('X-Request-ID') as string) || 'unknown'
    }
  };

  // 發送錯誤響應
  res.status(statusCode).json(errorResponse);
};

/**
 * 異步處理包裝器
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 速率限制錯誤
 */
export class RateLimitError extends UnifiedAdvancementError {
  constructor(message: string = '請求過於頻繁', retryAfter: number = 60) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', { retryAfter });
  }
}

/**
 * 認證錯誤
 */
export class AuthenticationError extends UnifiedAdvancementError {
  constructor(message: string = '認證失敗') {
    super(message, 401, 'AUTHENTICATION_FAILED');
  }
}

/**
 * 授權錯誤
 */
export class AuthorizationError extends UnifiedAdvancementError {
  constructor(message: string = '沒有權限') {
    super(message, 403, 'AUTHORIZATION_FAILED');
  }
}

/**
 * 資源不存在錯誤
 */
export class NotFoundError extends UnifiedAdvancementError {
  constructor(message: string = '資源不存在') {
    super(message, 404, 'NOT_FOUND');
  }
}

/**
 * 驗證錯誤
 */
export class ValidationError extends UnifiedAdvancementError {
  constructor(message: string | string[], details?: any) {
    const errorMessage = Array.isArray(message) ? message.join(', ') : message;
    super(errorMessage, 400, 'VALIDATION_ERROR', details);
  }
}

/**
 * 衝突錯誤
 */
export class ConflictError extends UnifiedAdvancementError {
  constructor(message: string = '資源衝突') {
    super(message, 409, 'CONFLICT');
  }
}

/**
 * 服務不可用錯誤
 */
export class ServiceUnavailableError extends UnifiedAdvancementError {
  constructor(message: string = '服務暫時不可用') {
    super(message, 503, 'SERVICE_UNAVAILABLE');
  }
}

/**
 * 錯誤碼映射
 */
export const ERROR_CODES = {
  INTERNAL_ERROR: { status: 500, message: '伺服器內部錯誤' },
  VALIDATION_ERROR: { status: 400, message: '請求驗證失敗' },
  NOT_FOUND: { status: 404, message: '請求的資源不存在' },
  UNAUTHORIZED: { status: 401, message: '需要登入才能執行此操作' },
  FORBIDDEN: { status: 403, message: '沒有權限執行此操作' },
  CONFLICT: { status: 409, message: '資源衝突' },
  RATE_LIMIT_EXCEEDED: { status: 429, message: '請求過於頻繁' },
  SERVICE_UNAVAILABLE: { status: 503, message: '服務暫時不可用' },
  DUPLICATE_ENTRY: { status: 409, message: '數據已存在' },
  INVALID_INPUT: { status: 400, message: '輸入無效' },
};

/**
 * 獲取錯誤碼對應的 HTTP 狀態
 */
export const getStatusCodeFromCode = (code: string): number => {
  return ERROR_CODES[code as keyof typeof ERROR_CODES]?.status || 500;
};
