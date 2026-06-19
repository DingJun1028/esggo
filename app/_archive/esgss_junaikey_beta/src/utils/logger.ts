import { omniLogger, LogCategory as OmniCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { BaseLogger, LogLevel, LogCategory, LogEntry, LogMetadata } from '../../shared/logger.shared';

/**
 * logger.ts
 * 統一日誌管理工具 - 前端版本 (5T Protocol Compliant)
 */

export { LogLevel, LogCategory };
export type { LogEntry, LogMetadata };

export interface LoggerOptions {
    context: string;
    category?: LogCategory;
    minLevel?: LogLevel;
    enableEmoji?: boolean;
}

/**
 * 統一日誌器
 * 環境感知、結構化、可配置
 */
export class Logger extends BaseLogger {
    protected minLevel: LogLevel;
    protected sourceOrigin: string = 'frontend-orbital-shell';
    private enableEmoji: boolean;
    private timers: Map<string, number>;

    constructor(options: LoggerOptions) {
        super(options.context, options.category || LogCategory.UI);
        this.minLevel = options.minLevel ?? this.getEnvLogLevel();
        this.enableEmoji = options.enableEmoji ?? true;
        this.timers = new Map();
    }

    protected output(entry: LogEntry): void {
        const { level, category, context, message, metadata, error } = entry;

        // Liquid Glass Console Aesthetics
        const styles = {
            DEBUG: 'color: #00FFFF; font-weight: normal;',
            INFO: 'color: #00FFFF; font-weight: bold; border-left: 3px solid #00FFFF; padding-left: 5px;',
            WARN: 'color: #FFD700; font-weight: bold;',
            ERROR: 'color: #FF4D4F; font-weight: bold; background: rgba(255, 77, 79, 0.1); padding: 2px 5px;',
        };

        const emoji = this.enableEmoji ? this.getEmoji(level) : '';
        const timestamp = new Date().toLocaleTimeString();

        const badgeStyle = 'background: #00FFFF; color: black; border-radius: 3px; padding: 1px 5px; font-weight: bold;';
        const contextStyle = 'color: #888; font-style: italic;';

        console.log(
            `%c${level}%c %c${category}%c %c[${context}]%c ${emoji} ${message} %c@ ${timestamp}`,
            styles[level as keyof typeof styles] || '',
            '',
            badgeStyle,
            '',
            contextStyle,
            '',
            'color: #ccc; font-size: 0.8em;'
        );

        if (metadata && Object.keys(metadata).length > 0) {
            console.log('%c Metadata:', 'color: #00FFFF; font-weight: bold;', metadata);
        }

        // Forward to OmniLogger for persistence and 5T tracking
        const omniLevel = this.mapToOmniLevel(level);
        const omniCategory = this.mapToOmniCategory(category);

        omniLogger.logPayload({
            message,
            level: omniLevel,
            category: omniCategory,
            source_origin: `${this.sourceOrigin}:${context}`,
            trace_id: metadata?.traceId || `trace_${Date.now()}`,
            timestamp: Date.now(),
            metadata: { ...metadata, error }
        });
    }

    private getEmoji(level: string): string {
        switch (level) {
            case 'DEBUG': return '🔍';
            case 'INFO': return '✨';
            case 'WARN': return '⚠️';
            case 'ERROR': return '🚨';
            default: return '📝';
        }
    }

    private mapToOmniLevel(level: string): any {
        // Mapping BaseLogger levels to OmniLogger enum
        return level; // They match in names usually
    }

    private mapToOmniCategory(category: LogCategory): OmniCategory {
        // Most categories match, fallback to SYSTEM
        return (OmniCategory as any)[category] || OmniCategory.SYSTEM;
    }

    /**
     * 開始計時
     */
    time(label: string): void {
        this.timers.set(label, performance.now());
    }

    /**
     * 結束計時並記錄
     */
    timeEnd(label: string): void {
        const startTime = this.timers.get(label);
        if (startTime === undefined) {
            this.warn(`Timer "${label}" does not exist`);
            return;
        }

        const duration = performance.now() - startTime;
        this.timers.delete(label);
        this.info(`⏱️ ${label}`, { duration, duration_ms: `${duration.toFixed(2)}ms` });
    }

    /**
     * 開始日誌分組
     */
    group(label: string): void {
        console.group(`%c${label}`, 'color: #00FFFF; font-weight: bold;');
    }

    /**
     * 結束日誌分組
     */
    groupEnd(): void {
        console.groupEnd();
    }

    /**
     * 創建子日誌器
     */
    child(subContext: string): Logger {
        return new Logger({
            context: `${this.context}:${subContext}`,
            category: this.category,
            minLevel: this.minLevel,
            enableEmoji: this.enableEmoji,
        });
    }

    private getEnvLogLevel(): LogLevel {
        if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_LOG_LEVEL) {
            const envLevel = (import.meta as any).env.VITE_LOG_LEVEL;
            return (LogLevel as any)[envLevel] ?? LogLevel.INFO;
        }
        return LogLevel.DEBUG;
    }
}

/**
 * 創建日誌器工廠函數
 */
export function createLogger(
    context: string,
    category?: LogCategory,
    options?: Partial<LoggerOptions>
): Logger {
    return new Logger({
        context,
        category: category || LogCategory.UI,
        ...options,
    });
}

/**
 * 預設日誌器
 */
export const logger = createLogger('App', LogCategory.SYSTEM);

/**
 * 便捷工廠函數
 */
export const createServiceLogger = (context: string) =>
    createLogger(context, LogCategory.SYSTEM);

export const createAPILogger = (context: string) =>
    createLogger(context, LogCategory.API);

export const createDatabaseLogger = (context: string) =>
    createLogger(context, LogCategory.DATABASE);

export const createUILogger = (context: string) =>
    createLogger(context, LogCategory.UI);

export const createAgentLogger = (context: string) =>
    createLogger(context, LogCategory.AGENT);

export const createReportLogger = (context: string) =>
    createLogger(context, LogCategory.AUDIT);

export const createOmniLogger = (context: string) =>
    createLogger(context, LogCategory.OMNI);

export const createESGLogger = (context: string) =>
    createLogger(context, LogCategory.ESG);
