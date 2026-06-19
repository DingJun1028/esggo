/**
 * 📝 OmniLogger: The Universal Chronicler (v2.0)
 * Responsibility: Categorized, level-filtered, structured logging with 5T alignment.
 *
 * Log Level Hierarchy: DEBUG < INFO < WARN < ERROR
 * Control via OMNI_LOG_LEVEL env var (default: INFO in dev, WARN in production)
 */

export enum LogCategory {
    SYSTEM = 'SYSTEM',
    AI = 'AI',
    DOMAIN = 'DOMAIN',
    VILLAGE = 'VILLAGE',
    SECURITY = 'SECURITY',
    CACHE = 'CACHE',         // 🆕 Cache hit/miss events
    PERFORMANCE = 'PERFORMANCE', // 🆕 Timing & perf measurements
}

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

function resolveMinLevel(): LogLevel {
    const envLevel = process.env.OMNI_LOG_LEVEL?.toUpperCase();
    if (envLevel === 'DEBUG') return LogLevel.DEBUG;
    if (envLevel === 'INFO') return LogLevel.INFO;
    if (envLevel === 'WARN') return LogLevel.WARN;
    if (envLevel === 'ERROR') return LogLevel.ERROR;
    // Default: INFO in development, WARN in production
    return process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.INFO;
}

export class OmniLogger {
    private static instance: OmniLogger;
    private readonly minLevel: LogLevel;

    private constructor() {
        this.minLevel = resolveMinLevel();
    }

    public static getInstance(): OmniLogger {
        if (!OmniLogger.instance) {
            OmniLogger.instance = new OmniLogger();
        }
        return OmniLogger.instance;
    }

    private shouldLog(level: LogLevel): boolean {
        return level >= this.minLevel;
    }

    public info(category: LogCategory, message: string, ...args: unknown[]): void {
        if (this.shouldLog(LogLevel.INFO)) {
            console.log(`[${category}][INFO] ${message}`, ...args);
        }
    }

    public warn(category: LogCategory, message: string, ...args: unknown[]): void {
        if (this.shouldLog(LogLevel.WARN)) {
            console.warn(`[${category}][WARN] ${message}`, ...args);
        }
    }

    public error(category: LogCategory, message: string, ...args: unknown[]): void {
        if (this.shouldLog(LogLevel.ERROR)) {
            console.error(`[${category}][ERROR] ${message}`, ...args);
        }
    }

    public debug(category: LogCategory, message: string, ...args: unknown[]): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.debug(`[${category}][DEBUG] ${message}`, ...args);
        }
    }

    /**
     * 🆕 Structured log — emits a JSON-serializable event for external tools (APM, Sentry, etc.)
     */
    public structured(
        category: LogCategory,
        level: LogLevel,
        message: string,
        context?: Record<string, unknown>,
    ): void {
        if (!this.shouldLog(level)) return;
        const levelName = LogLevel[level] as keyof typeof LogLevel;
        const entry = {
            ts: new Date().toISOString(),
            category,
            level: levelName,
            message,
            ...context,
        };

        switch (level) {
            case LogLevel.ERROR:
                console.error(JSON.stringify(entry));
                break;
            case LogLevel.WARN:
                console.warn(JSON.stringify(entry));
                break;
            default:
                console.log(JSON.stringify(entry));
        }
    }
}

export const omniLogger = OmniLogger.getInstance();
