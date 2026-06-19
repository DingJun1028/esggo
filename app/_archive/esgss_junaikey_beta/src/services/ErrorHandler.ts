import { EventEmitter } from '@/utils/EventEmitter.js';
import { omniLogger, LogCategory, LogLevel } from '@/omni/infrastructure/logging/OmniLogger.js';

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  NETWORK = 'network',
  DATABASE = 'database',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  BUSINESS_LOGIC = 'business_logic',
  EXTERNAL_SERVICE = 'external_service',
  SYSTEM = 'system',
  SECURITY = 'security',
}

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  url?: string;
  method?: string;
  timestamp: number;
  stack?: string;
  metadata?: Record<string, any>;
}

export interface ErrorInfo {
  id: string;
  message: string;
  code?: string;
  statusCode?: number;
  severity: ErrorSeverity;
  category: ErrorCategory;
  context: ErrorContext;
  stack?: string;
  cause?: Error;
  handled: boolean;
  retryCount: number;
  maxRetries: number;
}

export interface ErrorStats {
  totalErrors: number;
  errorsBySeverity: Record<ErrorSeverity, number>;
  errorsByCategory: Record<ErrorCategory, number>;
  averageResolutionTime: number;
  errorRate: number; // Error count per unit time
}

/**
 * Custom application error class
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly severity: ErrorSeverity;
  public readonly category: ErrorCategory;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string = 'INTERNAL_ERROR',
    statusCode: number = 500,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    category: ErrorCategory = ErrorCategory.SYSTEM,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.severity = severity;
    this.category = category;
    this.isOperational = isOperational;
  }
}

/**
 * Validation Error
 */
export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 400, ErrorSeverity.LOW, ErrorCategory.VALIDATION);
    this.name = 'ValidationError';
    if (field) {
      this.field = field;
    }
  }

  field?: string;
}

/**
 * Authentication Error
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401, ErrorSeverity.MEDIUM, ErrorCategory.AUTHENTICATION);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization Error
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403, ErrorSeverity.MEDIUM, ErrorCategory.AUTHORIZATION);
    this.name = 'AuthorizationError';
  }
}

/**
 * Database Error
 */
export class DatabaseError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(message, 'DATABASE_ERROR', 500, ErrorSeverity.HIGH, ErrorCategory.DATABASE, false);
    this.name = 'DatabaseError';
    if (originalError) {
      this.cause = originalError;
    }
  }
}

/**
 * External Service Error
 */
export class ExternalServiceError extends AppError {
  constructor(message: string, service: string) {
    super(
      message,
      'EXTERNAL_SERVICE_ERROR',
      502,
      ErrorSeverity.HIGH,
      ErrorCategory.EXTERNAL_SERVICE
    );
    this.name = 'ExternalServiceError';
    this.service = service;
  }

  service: string;
}

/**
 * Error handling service
 */
export class ErrorHandler extends EventEmitter {
  private static instance: ErrorHandler;
  private errors = new Map<string, ErrorInfo>();
  private cleanupInterval: any;
  private stats = {
    totalErrors: 0,
    errorsBySeverity: Object.values(ErrorSeverity).reduce(
      (acc, severity) => {
        acc[severity] = 0;
        return acc;
      },
      {} as Record<ErrorSeverity, number>
    ),
    errorsByCategory: Object.values(ErrorCategory).reduce(
      (acc, category) => {
        acc[category] = 0;
        return acc;
      },
      {} as Record<ErrorCategory, number>
    ),
    errorTimestamps: [] as number[],
    resolutionTimes: [] as number[],
  };

  private constructor() {
    super();
    this.setupCleanupTimer();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle Error
   */
  handle(error: Error | AppError, context: Partial<ErrorContext> = {}): ErrorInfo {
    const errorInfo = this.createErrorInfo(error, context);
    this.errors.set(errorInfo.id, errorInfo);

    // Update statistics
    this.updateStats(errorInfo);

    // Emit event
    this.emit('error', errorInfo);

    // Log error and decide whether to record
    this.logError(errorInfo);

    // Handle retry logic (Decide whether it's a retryable error)
    if (this.isRetryable(errorInfo) && errorInfo.retryCount < errorInfo.maxRetries) {
      this.scheduleRetry(errorInfo);
    }

    // Alert logic
    if (
      errorInfo.severity === ErrorSeverity.CRITICAL ||
      errorInfo.severity === ErrorSeverity.HIGH
    ) {
      this.sendAlert(errorInfo);
    }

    return errorInfo;
  }

  /**
   * Handle asynchronous error
   */
  async handleAsync(
    error: Error | AppError,
    context: Partial<ErrorContext> = {}
  ): Promise<ErrorInfo> {
    return this.handle(error, context);
  }

  /**
   * Wrap an asynchronous function for error handling
   */
  wrapAsync<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    context?: Partial<ErrorContext>
  ): (...args: T) => Promise<R> {
    return async (...args: T): Promise<R> => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handle(error as Error, context);
        throw error;
      }
    };
  }

  /**
   * Wrap a synchronous function for error handling
   */
  wrapSync<T extends any[], R>(
    fn: (...args: T) => R,
    context?: Partial<ErrorContext>
  ): (...args: T) => R {
    return (...args: T): R => {
      try {
        return fn(...args);
      } catch (error) {
        this.handle(error as Error, context);
        throw error;
      }
    };
  }

  /**
   * Mark error as handled
   */
  markAsHandled(errorId: string): void {
    const errorInfo = this.errors.get(errorId);
    if (errorInfo) {
      errorInfo.handled = true;
      this.emit('error-handled', errorInfo);
    }
  }

  /**
   * Retry error operation
   */
  async retry(errorId: string): Promise<boolean> {
    const errorInfo = this.errors.get(errorId);
    if (!errorInfo || !this.isRetryable(errorInfo)) {
      return false;
    }

    errorInfo.retryCount++;
    this.emit('error-retry', errorInfo);

    // Actual retry logic implementation can go here
    // For example: re-calling original function

    return true;
  }

  /**
   * Get error stats info
   */
  getStats(timeWindowMinutes: number = 60): ErrorStats {
    const now = Date.now();
    const timeWindow = timeWindowMinutes * 60 * 1000;
    const windowStart = now - timeWindow;

    // Filter errors within time window
    const windowErrors = this.stats.errorTimestamps.filter(timestamp => timestamp >= windowStart);
    const errorRate = windowErrors.length / timeWindowMinutes;

    const averageResolutionTime =
      this.stats.resolutionTimes.length > 0
        ? this.stats.resolutionTimes.reduce((a, b) => a + b, 0) / this.stats.resolutionTimes.length
        : 0;

    return {
      totalErrors: this.stats.totalErrors,
      errorsBySeverity: { ...this.stats.errorsBySeverity },
      errorsByCategory: { ...this.stats.errorsByCategory },
      averageResolutionTime,
      errorRate,
    };
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit: number = 10): ErrorInfo[] {
    return Array.from(this.errors.values())
      .sort((a, b) => b.context.timestamp - a.context.timestamp)
      .slice(0, limit);
  }

  /**
   * Clear error history
   */
  clearHistory(olderThanMinutes: number = 1440): void {
    // Default 24 hours
    const cutoffTime = Date.now() - olderThanMinutes * 60 * 1000;

    for (const [id, error] of this.errors) {
      if (error.context.timestamp < cutoffTime) {
        this.errors.delete(id);
      }
    }

    // Clear statistics timestamps
    this.stats.errorTimestamps = this.stats.errorTimestamps.filter(
      timestamp => timestamp >= cutoffTime
    );
  }

  // Private Methods

  private createErrorInfo(error: Error | AppError, context: Partial<ErrorContext>): ErrorInfo {
    const isAppError = error instanceof AppError;

    return {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: error.message,
      code: isAppError ? error.code : 'UNKNOWN_ERROR',
      statusCode: isAppError ? error.statusCode : 500,
      severity: isAppError ? error.severity : ErrorSeverity.MEDIUM,
      category: isAppError ? error.category : ErrorCategory.SYSTEM,
      context: {
        timestamp: Date.now(),
        stack: error.stack,
        ...context,
      },
      stack: error.stack,
      cause: error.cause as Error,
      handled: false,
      retryCount: 0,
      maxRetries: this.getMaxRetries(isAppError ? error.category : ErrorCategory.SYSTEM),
    };
  }

  private updateStats(errorInfo: ErrorInfo): void {
    this.stats.totalErrors++;
    this.stats.errorsBySeverity[errorInfo.severity]++;
    this.stats.errorsByCategory[errorInfo.category]++;
    this.stats.errorTimestamps.push(errorInfo.context.timestamp);
  }

  private logError(errorInfo: ErrorInfo): void {
    const logLevel = this.getLogLevel(errorInfo.severity);
    const logCategory =
      errorInfo.category === ErrorCategory.SECURITY ? LogCategory.SECURITY : LogCategory.SYSTEM;

    omniLogger.log(
      logLevel === 'error'
        ? errorInfo.severity === ErrorSeverity.CRITICAL
          ? LogLevel.CRITICAL
          : LogLevel.ERROR
        : logLevel === 'warn'
          ? LogLevel.WARN
          : LogLevel.INFO,
      logCategory,
      errorInfo.message,
      {
        errorId: errorInfo.id,
        code: errorInfo.code,
        context: errorInfo.context,
        stack: errorInfo.stack?.split('\n').slice(0, 5).join('\n'),
      },
      errorInfo.stack
    );
  }

  private getLogLevel(severity: ErrorSeverity): 'error' | 'warn' | 'info' {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        return 'error';
      case ErrorSeverity.MEDIUM:
        return 'warn';
      case ErrorSeverity.LOW:
      default:
        return 'info';
    }
  }

  private isRetryable(errorInfo: ErrorInfo): boolean {
    // Network and external service errors are usually retryable
    return (
      [ErrorCategory.NETWORK, ErrorCategory.EXTERNAL_SERVICE, ErrorCategory.DATABASE].includes(
        errorInfo.category
      ) && errorInfo.retryCount < errorInfo.maxRetries
    );
  }

  private getMaxRetries(category: ErrorCategory): number {
    switch (category) {
      case ErrorCategory.NETWORK:
        return 3;
      case ErrorCategory.EXTERNAL_SERVICE:
        return 2;
      case ErrorCategory.DATABASE:
        return 1;
      default:
        return 0;
    }
  }

  private scheduleRetry(errorInfo: ErrorInfo): void {
    const delay = Math.pow(2, errorInfo.retryCount) * 1000; // Exponential backoff

    setTimeout(() => {
      this.retry(errorInfo.id);
    }, delay);
  }

  private sendAlert(errorInfo: ErrorInfo): void {
    // In real implementation, this sends alerts to monitoring system
    omniLogger.critical(LogCategory.SYSTEM, `ALERT: Critical Error Alert: ${errorInfo.message}`, {
      errorId: errorInfo.id,
      severity: errorInfo.severity,
      category: errorInfo.category,
      context: errorInfo.context,
    });

    // Can be extended here:
    // - Slack/Discord notification
    // - Email alert
    // - SMS alert
    // - Dashboard update
  }

  private setupCleanupTimer(): void {
    // Clean up error history periodically
    this.cleanupInterval = setInterval(
      () => {
        this.clearHistory(60); // Clear errors older than 1 hour
      },
      60 * 60 * 1000
    );
  }

  /**
   * Destroy error handler service
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = undefined;
    }
    this.errors.clear();
    this.removeAllListeners();
    omniLogger.info(LogCategory.SYSTEM, 'ErrorHandler service destroyed');
  }
}

// Express error handling middleware
export function errorHandlerMiddleware(err: any, req: any, res: any, next: any) {
  const errorHandler = ErrorHandler.getInstance();

  const context: Partial<ErrorContext> = {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    url: req.url,
    method: req.method,
    sessionId: req.session?.id,
    requestId: req.headers['x-request-id'],
    userId: req.user?.id,
  };

  const errorInfo = errorHandler.handle(err, context);

  // Return appropriate response based on error type
  const statusCode = errorInfo.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';

  const response = {
    success: false,
    error: {
      message: errorInfo.message,
      code: errorInfo.code,
      ...(isDevelopment && { stack: errorInfo.stack }),
    },
    timestamp: new Date().toISOString(),
    requestId: errorInfo.context.requestId,
  };

  res.status(statusCode).json(response);
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Error handling decorator
export function HandleErrors(context?: Partial<ErrorContext>) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        errorHandler.handle(error as Error, {
          ...context,
          metadata: {
            className: target.constructor.name,
            methodName: propertyKey,
            args: args.length,
          },
        });
        throw error;
      }
    };

    return descriptor;
  };
}
