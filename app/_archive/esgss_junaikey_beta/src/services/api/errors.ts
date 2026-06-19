import { OmniErrorCode } from '../../types/errorCodes';

/**
 * API Error Class
 */
export class APIError extends Error {
  public readonly timestamp: string;

  constructor(
    public readonly code: OmniErrorCode,
    message: string,
    public readonly statusCode: number,
    public readonly details?: unknown,
    public readonly isRetryable: boolean = false,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'APIError';
    this.timestamp = new Date().toISOString();

    if (originalError && originalError.stack) {
      this.stack = `${this.stack}\n\nCaused by: ${originalError.stack}`;
    }
    Object.setPrototypeOf(this, APIError.prototype);
  }

  toJSON(): Record<string, unknown> {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      isRetryable: this.isRetryable,
      timestamp: this.timestamp,
    };
  }

  toUserMessage(): string {
    const userMessages: Record<string, string> = {
      [OmniErrorCode.NETWORK_ERROR]: '網路連線異常，請檢查網路設定 (OMNI_ERR_300)',
      [OmniErrorCode.SERVER_UNAVAILABLE]: '伺服器暫時無法連線，請稍後再試 (OMNI_ERR_303)',
      [OmniErrorCode.AUTH_REQUIRED]: '請先登入以繼續操作 (OMNI_ERR_200)',
      [OmniErrorCode.PERMISSION_DENIED]: '您沒有權限執行此操作 (OMNI_ERR_202)',
      [OmniErrorCode.VALIDATION_ERROR]: '輸入資料格式不正確 (OMNI_ERR_100)',
      [OmniErrorCode.RATE_LIMIT_EXCEEDED]: '請求過於頻繁，請稍後再試 (OMNI_ERR_302)',
      [OmniErrorCode.TIMEOUT]: '請求超時，請檢查網路連線 (OMNI_ERR_003)',
      [OmniErrorCode.UNKNOWN_ERROR]: '發生不明錯誤，請聯繫支援團隊 (OMNI_ERR_000)',
    };

    return userMessages[this.code] || `${this.message} (${this.code})`;
  }
}

export { OmniErrorCode as APIErrorCode };

export class ErrorFactory {
  static invalidRequest(message: string, details?: unknown): APIError {
    return new APIError(OmniErrorCode.VALIDATION_ERROR, message, 400, details, false);
  }

  static invalidParameters(message: string, details?: unknown): APIError {
    return new APIError(OmniErrorCode.VALIDATION_ERROR, message, 400, details, false);
  }

  static unauthorized(message: string = 'Unauthorized. Invalid API key.'): APIError {
    return new APIError(OmniErrorCode.AUTH_REQUIRED, message, 401, undefined, false);
  }

  static rateLimitExceeded(retryAfter: number = 60): APIError {
    return new APIError(
      OmniErrorCode.RATE_LIMIT_EXCEEDED,
      'Rate limit exceeded. Please try again later.',
      429,
      { retryAfter },
      true
    );
  }

  static internalError(originalError: Error, context?: string): APIError {
    const message = context
      ? `Internal error in ${context}: ${originalError.message}`
      : `Internal error: ${originalError.message}`;
    return new APIError(OmniErrorCode.INTERNAL_ERROR, message, 500, undefined, false, originalError);
  }

  static externalAPIError(service: string, error: Error, isRetryable: boolean = true): APIError {
    return new APIError(
      OmniErrorCode.API_FAILURE,
      `External API error from ${service}: ${error.message}`,
      502,
      { service },
      isRetryable,
      error
    );
  }

  static networkError(error: Error): APIError {
    return new APIError(
      OmniErrorCode.NETWORK_ERROR,
      `Network error: ${error.message}`,
      503,
      undefined,
      true,
      error
    );
  }

  static timeout(operation: string, timeoutMs: number): APIError {
    return new APIError(
      OmniErrorCode.TIMEOUT,
      `Operation '${operation}' timed out after ${timeoutMs}ms`,
      504,
      { operation, timeoutMs },
      true
    );
  }

  static parseError(message: string, originalError?: Error): APIError {
    return new APIError(OmniErrorCode.DATA_CORRUPTION, message, 500, undefined, false, originalError);
  }

  static validationError(message: string, details?: unknown): APIError {
    return new APIError(OmniErrorCode.VALIDATION_ERROR, message, 400, details, false);
  }

  static serviceUnavailable(service: string): APIError {
    return new APIError(
      OmniErrorCode.SERVER_UNAVAILABLE,
      `Service '${service}' is currently unavailable`,
      503,
      { service },
      true
    );
  }

  static fromError(error: unknown, context?: string): APIError {
    if (error instanceof APIError) return error;
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED') || error.message.includes('ETIMEDOUT')) {
        return ErrorFactory.networkError(error);
      }
      return ErrorFactory.internalError(error, context);
    }
    return new APIError(OmniErrorCode.INTERNAL_ERROR, `Unknown error: ${String(error)}`, 500);
  }
}

export class ErrorHandler {
  static isRetryable(error: unknown): boolean {
    if (error instanceof APIError) return error.isRetryable;
    return false;
  }
  static getStatusCode(error: unknown): number {
    if (error instanceof APIError) return error.statusCode;
    return 500;
  }
  static getErrorCode(error: unknown): OmniErrorCode {
    if (error instanceof APIError) return error.code;
    return OmniErrorCode.INTERNAL_ERROR;
  }
}
