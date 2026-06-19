import { ERROR_CODES, ErrorCodeKey, getErrorDefinition, ErrorCodeDefinition } from '../constants/errorCodes.js';

/**
 * AppError - 標準化應用程式錯誤
 * 支援 ESG 錯誤碼體系與雙語訊息
 */
export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public code: string;
  public codeKey?: ErrorCodeKey;
  public details?: any;
  public messageTC?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.code = code || 'ESG-SYS-400';

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * 從錯誤碼鍵建立 AppError
   */
  static fromCode(key: ErrorCodeKey, details?: any): AppError {
    const def = getErrorDefinition(key);
    const error = new AppError(def.message, def.httpStatus, def.code);
    error.codeKey = key;
    error.messageTC = def.messageTC;
    error.details = details;
    return error;
  }

  /**
   * 轉換為 JSON 格式 (供 API 回應使用)
   */
  toJSON(): object {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        messageTC: this.messageTC,
        details: this.details,
      },
      meta: {
        statusCode: this.statusCode,
        isOperational: this.isOperational,
        timestamp: new Date().toISOString(),
      },
    };
  }
}

/**
 * ErrorHandler - 單例錯誤處理器
 * 負責錯誤日誌與結構化輸出
 */
export class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() { }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  public handle(error: Error | AppError, context?: any): any {
    const isOperational = error instanceof AppError ? error.isOperational : false;
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const code = error instanceof AppError ? error.code : 'ESG-SYS-400';

    const errorInfo = {
      id: context?.requestId || `err-${Date.now()}`,
      success: false,
      error: {
        code,
        message: error.message,
        messageTC: (error as AppError).messageTC,
        details: (error as any).details,
      },
      context: {
        timestamp: Date.now(),
        isOperational,
        statusCode,
        ...context,
      },
    };

    // 結構化日誌輸出
    this.logStructured(errorInfo);

    return errorInfo;
  }

  /**
   * 結構化日誌輸出 (JSON 格式)
   */
  private logStructured(errorInfo: any): void {
    const logEntry = {
      level: 'ERROR',
      timestamp: new Date(errorInfo.context.timestamp).toISOString(),
      errorId: errorInfo.id,
      code: errorInfo.error.code,
      message: errorInfo.error.message,
      statusCode: errorInfo.context.statusCode,
      isOperational: errorInfo.context.isOperational,
      requestId: errorInfo.context.requestId,
      ip: errorInfo.context.ip,
      method: errorInfo.context.method,
      url: errorInfo.context.url,
    };

    console.error(JSON.stringify(logEntry));
  }
}

// 匯出常用錯誤碼供快速使用
export { ERROR_CODES, getErrorDefinition, type ErrorCodeKey };
