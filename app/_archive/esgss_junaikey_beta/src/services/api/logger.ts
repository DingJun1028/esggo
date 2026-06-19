import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

/**
 * logger.ts
 * Structured Logging System
 *
 * Provides unified logging interface, supporting different levels and structured output
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  requestId?: string;
  duration?: number;
  metadata?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
}

/**
 * APILogger
 * Structured Logger
 */
export class APILogger {
  private context: string;
  private minLevel: LogLevel;

  constructor(context: string, minLevel: LogLevel = LogLevel.INFO) {
    this.context = context;
    this.minLevel = minLevel;
  }

  /**
   * Debug Log
   */
  debug(message: string, meta?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  /**
   * Info Log
   */
  info(message: string, meta?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, meta);
  }

  /**
   * Warn Log
   */
  warn(message: string, meta?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, meta);
  }

  /**
   * Error Log
   */
  error(message: string, error?: Error, meta?: Record<string, unknown>): void {
    const errorMeta = error
      ? {
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: (error as any).code,
          },
        }
      : {};

    this.log(LogLevel.ERROR, message, { ...meta, ...errorMeta });
  }

  /**
   * Log request start
   */
  logRequestStart(requestId: string, endpoint: string, params: Record<string, unknown>): void {
    this.info('Request started', {
      requestId,
      endpoint,
      params: this.sanitizeParams(params),
    });
  }

  /**
   * Log request end
   */
  logRequestEnd(requestId: string, endpoint: string, duration: number, success: boolean): void {
    const level = success ? LogLevel.INFO : LogLevel.ERROR;
    this.log(level, 'Request completed', {
      requestId,
      endpoint,
      duration,
      success,
    });
  }

  /**
   * Log cache event
   */
  logCacheEvent(
    event: 'hit' | 'miss' | 'set' | 'invalidate',
    key: string,
    meta?: Record<string, unknown>
  ): void {
    this.debug(`Cache ${event}`, { key, ...meta });
  }

  /**
   * Log retry event
   */
  logRetryEvent(attempt: number, maxAttempts: number, error: Error, delay: number): void {
    this.warn('Retrying operation', {
      attempt,
      maxAttempts,
      delay,
      error: error.message,
    });
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      ...metadata,
    };

    const formatted = this.formatLog(entry);

    // Output to console
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formatted);
        break;
      case LogLevel.INFO:
        omniLogger.info(LogCategory.SYSTEM, '[logger] Info', { data: formatted });
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      case LogLevel.ERROR:
        omniLogger.error(LogCategory.SYSTEM, '[logger] Error', { error: formatted });
        break;
    }
  }

  /**
   * Format log (Browser Compatible)
   */
  private formatLog(entry: LogEntry): string {
    // Production environment uses JSON
    const isProd =
      (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') ||
      /* @ts-ignore: import.meta is available in ESM/Vite environments */
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.PROD);

    if (isProd) {
      return JSON.stringify(entry);
    }

    // Development environment uses readable format
    const { timestamp, level, context, message, ...rest } = entry;
    const levelColor = this.getLevelColor(level);
    const prefix = `[${timestamp}] ${levelColor}${level.toUpperCase()}\x1b[0m [${context}]`;
    const meta = Object.keys(rest).length > 0 ? `\n${JSON.stringify(rest, null, 2)}` : '';
    return `${prefix} ${message}${meta}`;
  }

  /**
   * Get log level color
   */
  private getLevelColor(level: LogLevel): string {
    const colors = {
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m', // Green
      [LogLevel.WARN]: '\x1b[33m', // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
    };
    return colors[level] || '';
  }

  /**
   * Check if logging is required
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const currentIndex = levels.indexOf(level);
    const minIndex = levels.indexOf(this.minLevel);
    return currentIndex >= minIndex;
  }

  /**
   * Sanitize sensitive parameters
   */
  private sanitizeParams(params: Record<string, unknown>): Record<string, unknown> {
    const sensitiveKeys = ['apiKey', 'password', 'token', 'secret'];
    const sanitized = { ...params };

    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        sanitized[key] = '***REDACTED***';
      }
    }

    return sanitized;
  }

  /**
   * Create child logger
   */
  child(subContext: string): APILogger {
    return new APILogger(`${this.context}:${subContext}`, this.minLevel);
  }
}

/**
 * Create logger factory (Browser Compatible)
 */
export function createLogger(context: string, minLevel?: LogLevel): APILogger {
  let envLevel: LogLevel | undefined;

  // Safe environment check
  if (typeof process !== 'undefined' && process.env && process.env.LOG_LEVEL) {
    envLevel = process.env.LOG_LEVEL as LogLevel;
  } else if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_LOG_LEVEL) {
    /* @ts-ignore: import.meta check for Vite */
    envLevel = (import.meta as any).env.VITE_LOG_LEVEL as LogLevel;
  }

  const level = minLevel || envLevel || LogLevel.INFO;
  return new APILogger(context, level);
}

// Default logger
export const logger = createLogger('JunAiKey.API');
