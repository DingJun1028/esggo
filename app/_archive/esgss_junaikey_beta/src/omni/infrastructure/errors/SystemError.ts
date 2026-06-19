/**
 * SystemError - 統一錯誤處理類別
 * --------------------------------------------------
 * [協議] Phase 28: 自我進化與全域主權
 *
 * 錯誤代碼規範：
 * - 1xxx: System Errors (系統錯誤)
 * - 2xxx: Validation Errors (驗證錯誤)
 * - 3xxx: API Errors (API 錯誤)
 * - 4xxx: Authentication Errors (認證錯誤)
 * - 5xxx: Business Logic Errors (業務邏輯錯誤)
 */

export const ErrorCodes = {
  // System Errors (1xxx)
  SYSTEM_INIT_FAILED: { code: 'SYS_1001', message: '系統初始化失敗' },
  OMNI_CORE_LOCKED: { code: 'SYS_1002', message: 'Omni Core 被鎖定' },
  UNKNOWN_ERROR: { code: 'SYS_1000', message: '未知錯誤' },

  // Validation Errors (2xxx)
  VALIDATION_FAILED: { code: 'VAL_2001', message: '驗證失敗' },
  FIVE_T_GATE_FAILED: { code: 'VAL_2002', message: '5T 門檻未通過' },
  INVALID_INPUT: { code: 'VAL_2003', message: '無效輸入' },
  MISSING_REQUIRED_FIELD: { code: 'VAL_2004', message: '缺少必要欄位' },
  VALIDATION_INVALID_EMAIL: { code: 'VAL_2005', message: '電子郵件格式無效' },

  // API Errors (3xxx)
  API_REQUEST_FAILED: { code: 'API_3001', message: 'API 請求失敗' },
  API_TIMEOUT: { code: 'API_3002', message: 'API 請求超時' },
  API_RESPONSE_INVALID: { code: 'API_3003', message: 'API 回應無效' },
  API_RATE_LIMITED: { code: 'API_3004', message: 'API 請求頻率受限' },

  // Authentication Errors (4xxx)
  AUTH_TOKEN_EXPIRED: { code: 'AUTH_4001', message: '認證令牌已過期' },
  AUTH_INVALID_TOKEN: { code: 'AUTH_4002', message: '無效的認證令牌' },
  AUTH_UNAUTHORIZED: { code: 'AUTH_4003', message: '未經授權的存取' },
  AUTH_FORBIDDEN: { code: 'AUTH_4004', message: '禁止存取' },
  AUTH_LOGIN_FAILED: { code: 'AUTH_4005', message: '登入失敗' },
  AUTH_ACCOUNT_LOCKED: { code: 'AUTH_4006', message: '帳號已被鎖定' },
  AUTH_INVALID_CREDENTIALS: { code: 'AUTH_4007', message: '帳號或密碼錯誤' },
  AUTH_TOO_MANY_REQUESTS: { code: 'AUTH_4008', message: '請求次數過多，請稍後再試' },

  // Business Logic Errors (5xxx)
  BUSINESS_LOGIC_ERROR: { code: 'BUS_5001', message: '業務邏輯錯誤' },
  RESOURCE_NOT_FOUND: { code: 'BUS_5002', message: '資源不存在' },
  RESOURCE_CONFLICT: { code: 'BUS_5003', message: '資源衝突' },
  OPERATION_NOT_ALLOWED: { code: 'BUS_5004', message: '操作不允許' },
  AVATAR_SYNC_FAIL: { code: 'BUS_5005', message: 'Avatar 角色同步失敗' },
} as const;

export type ErrorCodeKey = keyof typeof ErrorCodes;

/**
 * SystemError 類別
 * 提供統一的錯誤處理機制，包含錯誤碼、訊息、上下文資訊
 */
export class SystemError extends Error {
  public readonly code: string;
  public readonly errorCode: string;
  public readonly context?: Record<string, unknown>;
  public readonly timestamp: string;
  public readonly recoverable: boolean;
  public readonly severity: 'low' | 'medium' | 'high' | 'critical';

  constructor(
    errorKey: ErrorCodeKey,
    context?: Record<string, unknown>,
    options?: {
      recoverable?: boolean;
      severity?: 'low' | 'medium' | 'high' | 'critical';
      originalError?: Error;
    }
  ) {
    const errorConfig = ErrorCodes[errorKey] || ErrorCodes.UNKNOWN_ERROR;
    const message = errorConfig.message;

    super(message);

    this.name = 'SystemError';
    this.code = errorConfig.code;
    this.errorCode = errorKey;
    this.context = context;
    this.timestamp = new Date().toISOString();
    this.recoverable = options?.recoverable ?? true;
    this.severity = options?.severity ?? 'medium';

    // 保留原始堆疊追蹤
    if (options?.originalError?.stack) {
      this.stack = options.originalError.stack;
    }
  }

  /**
   * 將錯誤轉換為 JSON 格式
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      errorCode: this.errorCode,
      message: this.message,
      context: this.context,
      timestamp: this.timestamp,
      recoverable: this.recoverable,
      severity: this.severity,
      stack: this.stack,
    };
  }

  /**
   * 從 JSON 創建 SystemError 實例
   */
  static fromJSON(json: Record<string, unknown>): SystemError {
    const error = new SystemError(
      (json.errorCode as ErrorCodeKey) || 'UNKNOWN_ERROR',
      json.context as Record<string, unknown>,
      {
        recoverable: json.recoverable as boolean,
        severity: json.severity as 'low' | 'medium' | 'high' | 'critical',
      }
    );
    error.stack = json.stack as string;
    return error;
  }

  /**
   * 創建快速錯誤實例的工廠方法
   */
  static systemInitFailed(context?: Record<string, unknown>): SystemError {
    return new SystemError('SYSTEM_INIT_FAILED', context, { severity: 'critical' });
  }

  static validationFailed(context?: Record<string, unknown>): SystemError {
    return new SystemError('VALIDATION_FAILED', context, { severity: 'medium' });
  }

  static apiRequestFailed(context?: Record<string, unknown>): SystemError {
    return new SystemError('API_REQUEST_FAILED', context, { severity: 'high' });
  }

  static unauthorized(context?: Record<string, unknown>): SystemError {
    return new SystemError('AUTH_UNAUTHORIZED', context, { severity: 'high' });
  }

  static resourceNotFound(context?: Record<string, unknown>): SystemError {
    return new SystemError('RESOURCE_NOT_FOUND', context, { severity: 'low' });
  }

  /**
   * 解析後端 OmniResult 錯誤回應
   * @param backendError 後端回傳的錯誤物件 (response.data.error)
   */
  static fromBackendError(backendError: any): SystemError {
    if (!backendError) return new SystemError('UNKNOWN_ERROR');

    const code = backendError.code || 'UNKNOWN';
    // Mapping Backend OmniError Codes (ESG-XXX) to Frontend SystemError Keys
    let errorKey: ErrorCodeKey = 'UNKNOWN_ERROR';

    if (code.includes('AUTH')) errorKey = 'AUTH_UNAUTHORIZED';
    else if (code.includes('DATA')) errorKey = 'VALIDATION_FAILED';
    else if (code.includes('API')) errorKey = 'API_REQUEST_FAILED';
    else if (code.includes('SYS')) errorKey = 'SYSTEM_INIT_FAILED';
    else if (code.includes('BUS')) errorKey = 'BUSINESS_LOGIC_ERROR';

    return new SystemError(errorKey, {
      backendCode: code,
      details: backendError.details,
      originalMessage: backendError.message
    }, {
      severity: code.includes('SYS') ? 'high' : 'medium'
    });
  }

  /**
   * 解析 Firebase Auth 錯誤
   */
  static fromFirebaseError(error: any): SystemError {
    const code = error.code || 'unknown';
    let key: ErrorCodeKey = 'AUTH_LOGIN_FAILED';
    let message = '登入失敗，請稍後再試。';

    switch (code) {
      case 'auth/invalid-email':
        key = 'VALIDATION_INVALID_EMAIL';
        message = '電子郵件格式不正確。';
        break;
      case 'auth/user-disabled':
        key = 'AUTH_ACCOUNT_LOCKED';
        message = '此帳號已被停用。';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        key = 'AUTH_INVALID_CREDENTIALS';
        message = '帳號或密碼錯誤。';
        break;
      case 'auth/too-many-requests':
        key = 'AUTH_TOO_MANY_REQUESTS';
        message = '登入嘗試次數過多，請稍後再試。';
        break;
      case 'auth/popup-closed-by-user':
        key = 'AUTH_LOGIN_FAILED';
        message = '登入視窗已關閉。';
        break;
      default:
        message = error.message || message;
    }

    return new SystemError(key, { originalError: error }, {
      severity: key === 'AUTH_TOO_MANY_REQUESTS' ? 'medium' : 'low'
    });
  }

  /**
   * 判斷是否為 SystemError 類型
   */
  static isSystemError(error: unknown): error is SystemError {
    return error instanceof SystemError;
  }

  /**
   * 獲取錯誤的可讀性描述
   */
  getFullDescription(): string {
    return `[${this.code}] ${this.message}${this.context ? ` | Context: ${JSON.stringify(this.context)}` : ''
      }`;
  }
}

/**
 * 錯誤處理裝飾器 - 用於自動捕捉和記錄錯誤
 */
export function catchWithSystemError(
  errorKey: ErrorCodeKey,
  options?: {
    severity?: 'low' | 'medium' | 'high' | 'critical';
    context?: Record<string, unknown>;
  }
) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      try {
        return originalMethod.apply(this, args);
      } catch (error) {
        if (error instanceof SystemError) {
          throw error;
        }

        const context = {
          ...options?.context,
          method: propertyKey,
          args,
        };

        throw new SystemError(errorKey, context, {
          severity: options?.severity,
          originalError: error instanceof Error ? error : undefined,
        });
      }
    };

    return descriptor;
  };
}
