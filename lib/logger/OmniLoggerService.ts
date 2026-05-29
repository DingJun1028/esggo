import { ILoggerService, LogContext, LogLevel } from './ILoggerService';

export class OmniLoggerService implements ILoggerService {
    private remoteEndpoint: string;

    constructor() {
        // 預留拋送至 Datadog, ELK 或您自建遙測 API 的端點
        this.remoteEndpoint = process.env.NEXT_PUBLIC_TELEMETRY_LOG_URL || '/api/telemetry/logs';
    }

    private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
        const timestamp = new Date().toISOString();
        const ctxString = context ? ` | Context: ${JSON.stringify(context)}` : '';
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${ctxString}`;
    }

    private async sendToRemote(level: LogLevel, message: string, error?: any, context?: LogContext) {
        // 僅在生產環境或特定層級 (如 warn, error) 時發送至遠端，視業務需求調整
        // 採用 Fire-and-forget 模式，不阻擋主執行緒
        try {
            fetch(this.remoteEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    level,
                    message,
                    error: error instanceof Error ? error.message : error,
                    context,
                    timestamp: new Date().toISOString()
                })
            }).catch(() => { /* 忽略遠端傳輸失敗，避免造成無窮迴圈 */ });
        } catch (e) {
            // 安全防護
        }
    }

    debug(message: string, context?: LogContext): void {
        // Debug 級別僅在開發環境輸出
        if (process.env.NODE_ENV !== 'production') {
            console.debug(this.formatMessage('debug', message, context));
        }
    }

    info(message: string, context?: LogContext): void {
        console.info(this.formatMessage('info', message, context));
    }

    warn(message: string, context?: LogContext): void {
        console.warn(this.formatMessage('warn', message, context));
        this.sendToRemote('warn', message, undefined, context);
    }

    error(message: string, error?: Error | unknown, context?: LogContext): void {
        console.error(this.formatMessage('error', message, context), error);
        this.sendToRemote('error', message, error, context);
    }
}