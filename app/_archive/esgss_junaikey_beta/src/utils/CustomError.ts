import { OmniErrorCode } from '../types/errorCodes';

export interface ErrorContext {
    userId?: string;
    requestId?: string;
    component?: string;
    operation?: string;
    originalError?: string; // 原始錯誤名稱
    metadata?: Record<string, any>;
}

/**
 * 基礎自定義錯誤類 (Omni Custom Error)
 */
export class CustomError extends Error {
    public readonly code: OmniErrorCode;
    public readonly statusCode: number;
    public readonly context?: ErrorContext;
    public readonly timestamp: Date;
    public readonly isOperational: boolean;

    constructor(
        message: string,
        code: OmniErrorCode = OmniErrorCode.INTERNAL_ERROR,
        statusCode: number = 500,
        context?: ErrorContext,
        isOperational: boolean = true
    ) {
        super(message);

        this.name = this.constructor.name;
        this.code = code;
        this.statusCode = statusCode;
        this.context = context;
        this.timestamp = new Date();
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            error: {
                name: this.name,
                message: this.message,
                code: this.code,
                statusCode: this.statusCode,
                timestamp: this.timestamp.toISOString(),
                context: this.context
            }
        };
    }
}

/** 驗證錯誤 (400) */
export class ValidationError extends CustomError {
    constructor(message: string, context?: ErrorContext) {
        super(message, OmniErrorCode.VALIDATION_ERROR, 400, context);
    }
}

/** 認證錯誤 (401) */
export class AuthenticationError extends CustomError {
    constructor(message: string = 'Authentication required', context?: ErrorContext) {
        super(message, OmniErrorCode.AUTH_REQUIRED, 401, context);
    }
}

/** 授權錯誤 (403) */
export class AuthorizationError extends CustomError {
    constructor(message: string = 'Access denied', context?: ErrorContext) {
        super(message, OmniErrorCode.PERMISSION_DENIED, 403, context);
    }
}

/** 資源未找到錯誤 (404) */
export class NotFoundError extends CustomError {
    constructor(resource: string, identifier?: string, context?: ErrorContext) {
        const message = identifier
            ? `${resource} with identifier '${identifier}' not found`
            : `${resource} not found`;
        super(message, OmniErrorCode.VALIDATION_ERROR, 404, context); // Map to validation or specific not found if added
    }
}

/** 資料庫錯誤 (500) */
export class DatabaseError extends CustomError {
    constructor(message: string, context?: ErrorContext) {
        super(message, OmniErrorCode.INTERNAL_ERROR, 500, context, false);
    }
}

/** 網絡錯誤 (503) */
export class NetworkError extends CustomError {
    constructor(message: string, context?: ErrorContext) {
        super(message, OmniErrorCode.NETWORK_ERROR, 503, context);
    }
}

/** 速率限制錯誤 (429) */
export class RateLimitError extends CustomError {
    constructor(message: string = 'Too many requests', context?: ErrorContext) {
        super(message, OmniErrorCode.RATE_LIMIT_EXCEEDED, 429, context);
    }
}

/** 超時錯誤 (408) */
export class TimeoutError extends CustomError {
    constructor(operation: string, timeout: number, context?: ErrorContext) {
        super(
            `Operation '${operation}' timed out after ${timeout}ms`,
            OmniErrorCode.TIMEOUT,
            408,
            context
        );
    }
}

export function isOperationalError(error: Error): boolean {
    if (error instanceof CustomError) {
        return error.isOperational;
    }
    return false;
}

export function wrapError(error: unknown, context?: ErrorContext): CustomError {
    if (error instanceof CustomError) {
        return error;
    }

    if (error instanceof Error) {
        return new CustomError(
            error.message,
            OmniErrorCode.UNKNOWN_ERROR,
            500,
            { ...context, originalError: error.name }
        );
    }

    return new CustomError(
        typeof error === 'string' ? error : 'An unknown error occurred',
        OmniErrorCode.UNKNOWN_ERROR,
        500,
        context
    );
}

export { OmniErrorCode as ErrorCode };
