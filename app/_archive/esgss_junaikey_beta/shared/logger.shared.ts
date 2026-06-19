/**
 * shared/logger.shared.ts
 * 
 * 5T Protocol Compliant Logger - Abstract Core
 * 
 * [Traceable] Every log has a traceId
 * [Trackable] Logs include source_origin (frontend/backend)
 * [Transparent] Structured log output
 * [Trustworthy] Environment-aware (Prod/Dev)
 * [Tangible] Vivid visual formatting (where supported)
 */

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

export enum LogCategory {
    /**
     * 系統核心
     * System Core
     */
    SYSTEM = 'SYSTEM',

    /**
     * 安全審計
     * Security Audit
     */
    SECURITY = 'SECURITY',

    /**
     * 業務邏輯
     * Business Logic
     */
    BUSINESS = 'BUSINESS',

    /**
     * 用戶行為
     * User Action
     */
    USER = 'USER',

    /**
     * 稽核紀錄
     * Audit Trail
     */
    AUDIT = 'AUDIT',

    /**
     * 效能監控
     * Performance Monitoring
     */
    PERFORMANCE = 'PERFORMANCE',

    /**
     * 系統整合
     * System Integration
     */
    INTEGRATION = 'INTEGRATION',

    /**
     * 資料庫操作
     * Database Operations
     */
    DATABASE = 'DATABASE',

    /**
     * 使用者介面
     * User Interface
     */
    UI = 'UI',

    /**
     * 數據處理
     * Data Processing
     */
    DATA = 'DATA',

    /**
     * 身份驗證
     * Authentication
     */
    AUTH = 'AUTH',

    /**
     * 區塊鏈操作
     * Blockchain Operations
     */
    BLOCKCHAIN = 'BLOCKCHAIN',

    /**
     * 全域系統
     * Omni System
     */
    OMNI = 'OMNI',

    // 5T Specific
    /**
     * 永續環境
     * Environment (ESG)
     */
    ESG = 'ESG',

    /**
     * 公司治理
     * Governance
     */
    GOVERNANCE = 'GOVERNANCE',

    /**
     * 社會責任
     * Social Responsibility
     */
    SOCIAL = 'SOCIAL',

    /**
     * 市場情報
     * Market Intelligence
     */
    MARKET = 'MARKET',

    /**
     * 光學辨識
     * Optical Character Recognition
     */
    OCR = 'OCR',

    /**
     * 人工智慧
     * Artificial Intelligence
     */
    AI = 'AI',

    /**
     * 智能代理
     * Intelligent Agent
     */
    AGENT = 'AGENT',

    /**
     * 應用程式介面
     * Application Programming Interface
     */
    API = 'API',

    /**
     * 主權運作
     * Sovereign Operations
     */
    SOVEREIGN = 'SOVEREIGN',

    /**
     * 知識管理
     * Knowledge Management
     */
    KNOWLEDGE = 'KNOWLEDGE'
}

/**
 * 💡 LogCategory 雙語描述映射
 * Runtime mapping for UI/Display purposes
 */
export const LogCategoryDesc: Record<LogCategory, string> = {
    [LogCategory.SYSTEM]: '系統核心',
    [LogCategory.SECURITY]: '安全審計',
    [LogCategory.BUSINESS]: '業務邏輯',
    [LogCategory.USER]: '用戶行為',
    [LogCategory.AUDIT]: '稽核紀錄',
    [LogCategory.PERFORMANCE]: '效能監控',
    [LogCategory.INTEGRATION]: '系統整合',
    [LogCategory.DATABASE]: '資料庫操作',
    [LogCategory.UI]: '使用者介面',
    [LogCategory.DATA]: '數據處理',
    [LogCategory.AUTH]: '身份驗證',
    [LogCategory.BLOCKCHAIN]: '區塊鏈操作',
    [LogCategory.OMNI]: '全域系統',
    [LogCategory.ESG]: '永續環境',
    [LogCategory.GOVERNANCE]: '公司治理',
    [LogCategory.SOCIAL]: '社會責任',
    [LogCategory.MARKET]: '市場情報',
    [LogCategory.OCR]: '光學辨識',
    [LogCategory.AI]: '人工智慧',
    [LogCategory.AGENT]: '智能代理',
    [LogCategory.API]: '應用程式介面',
    [LogCategory.SOVEREIGN]: '主權運作',
    [LogCategory.KNOWLEDGE]: '知識管理'
};

export interface LogMetadata {
    traceId?: string;
    source_origin?: string;
    version?: string;
    duration?: number;
    [key: string]: any;
}

export interface LogEntry {
    timestamp: string;
    level: string;
    category: LogCategory;
    context: string;
    message: string;
    metadata?: LogMetadata;
    error?: {
        name: string;
        message: string;
        stack?: string;
        code?: string;
    };
}

export abstract class BaseLogger {
    protected abstract minLevel: LogLevel;
    protected abstract sourceOrigin: string;

    constructor(protected context: string, protected category: LogCategory = LogCategory.SYSTEM) { }

    protected abstract output(entry: LogEntry): void;

    public debug(message: string, meta?: LogMetadata, category?: LogCategory): void {
        this.log(LogLevel.DEBUG, message, meta, undefined, category);
    }

    public info(message: string, meta?: LogMetadata, category?: LogCategory): void {
        this.log(LogLevel.INFO, message, meta, undefined, category);
    }

    public warn(message: string, meta?: LogMetadata, category?: LogCategory): void {
        this.log(LogLevel.WARN, message, meta, undefined, category);
    }

    public error(message: string, error?: Error, meta?: LogMetadata, category?: LogCategory): void {
        const errorDetails = error ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: (error as any).code
        } : undefined;

        this.log(LogLevel.ERROR, message, meta, errorDetails, category);
    }

    private log(level: LogLevel, message: string, meta?: LogMetadata, error?: any, category?: LogCategory): void {
        if (level < this.minLevel) return;

        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level: LogLevel[level],
            category: category || this.category,
            context: this.context,
            message,
            metadata: {
                ...meta,
                source_origin: this.sourceOrigin,
            },
            error
        };

        this.output(entry);
    }
}
