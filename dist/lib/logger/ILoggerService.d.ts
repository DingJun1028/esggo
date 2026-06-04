export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export interface LogContext {
    [key: string]: unknown;
}
export interface ILoggerService {
    debug(message: string, context?: LogContext): void;
    info(message: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    error(message: string, error?: Error | unknown, context?: LogContext): void;
}
//# sourceMappingURL=ILoggerService.d.ts.map