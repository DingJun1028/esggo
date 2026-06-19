/**
 * ESGSonar 通知服務基底類別
 * 提供所有通知渠道的通用介面與方法
 */

export interface NotificationPayload {
    title: string;
    message: string;
    type: NotificationType;
    priority: 'low' | 'medium' | 'high' | 'critical';
    metadata?: Record<string, unknown>;
    url?: string;
}

export type NotificationType =
    | 'regulation_change'
    | 'company_report'
    | 'watchlist_alert'
    | 'system_alert'
    | 'daily_digest'
    | 'weekly_summary';

export interface NotificationResult {
    success: boolean;
    channel: string;
    messageId?: string;
    error?: string;
    timestamp: Date;
}

export interface Subscriber {
    id: string;
    name: string;
    channels: ('slack' | 'telegram' | 'email')[];
    preferences: SubscriberPreferences;
    createdAt: Date;
    updatedAt: Date;
}

export interface SubscriberPreferences {
    regulationAlerts: boolean;
    companyReports: boolean;
    watchlistAlerts: boolean;
    frequency: 'realtime' | 'daily' | 'weekly';
    quietHours?: {
        start: string;
        end: string;
    };
}

/**
 * 抽象通知類別
 * 所有通知渠道需實作此介面
 */
export abstract class BaseNotifier {
    protected channelName: string;
    protected enabled: boolean = false;

    constructor(channelName: string) {
        this.channelName = channelName;
    }

    /**
     * 發送通知
     */
    abstract send(payload: NotificationPayload): Promise<NotificationResult>;

    /**
     * 驗證配置是否正確
     */
    abstract validateConfig(): Promise<boolean>;

    /**
     * 測試連接
     */
    abstract testConnection(): Promise<boolean>;

    /**
     * 啟用/停用通知渠道
     */
    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    /**
     * 檢查渠道是否啟用
     */
    isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * 取得渠道名稱
     */
    getChannelName(): string {
        return this.channelName;
    }

    /**
     * 格式化通知內容
     */
    protected formatMessage(payload: NotificationPayload): string {
        const priorityEmoji = this.getPriorityEmoji(payload.priority);
        const typeLabel = this.getTypeLabel(payload.type);

        return `${priorityEmoji} *${typeLabel}*\n\n*${payload.title}*\n\n${payload.message}`;
    }

    /**
     * 取得優先級對應的表情符號
     */
    protected getPriorityEmoji(priority: NotificationPayload['priority']): string {
        const emojis = {
            low: 'ℹ️',
            medium: '⚠️',
            high: '🔔',
            critical: '🚨'
        };
        return emojis[priority] || 'ℹ️';
    }

    /**
     * 取得通知類型標籤
     */
    protected getTypeLabel(type: NotificationType): string {
        const labels: Record<NotificationType, string> = {
            regulation_change: '法規變更',
            company_report: '企業報告書',
            watchlist_alert: '關注名單提醒',
            system_alert: '系統通知',
            daily_digest: '每日快報',
            weekly_summary: '每週摘要'
        };
        return labels[type] || '通知';
    }

    /**
     * 記錄通知日誌
     */
    protected logNotification(
        payload: NotificationPayload,
        result: NotificationResult
    ): void {
        const logEntry = {
            timestamp: new Date().toISOString(),
            channel: this.channelName,
            type: payload.type,
            priority: payload.priority,
            success: result.success,
            messageId: result.messageId,
            error: result.error
        };

        console.log('[Notification]', JSON.stringify(logEntry));
    }
}

export default BaseNotifier;
