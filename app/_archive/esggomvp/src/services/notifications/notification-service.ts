/**
 * ESGSonar 統一通知服務
 * 整合多種通知渠道的統一入口
 */

import { BaseNotifier, NotificationPayload, NotificationResult, NotificationType } from './base-notifier';
import { SlackNotifier } from './slack-notifier';
import { TelegramNotifier } from './telegram-notifier';

// 通知類型對應的優先級
const TYPE_PRIORITY_MAP: Record<NotificationType, NotificationPayload['priority']> = {
    regulation_change: 'high',
    company_report: 'medium',
    watchlist_alert: 'high',
    system_alert: 'low',
    daily_digest: 'medium',
    weekly_summary: 'low'
};

// 通知選項
export interface NotificationOptions {
    channels?: ('slack' | 'telegram')[];
    skipDuplicates?: boolean;
    deduplicationKey?: string;
}

// 法規變更通知參數
export interface RegulationAlertParams {
    title: string;
    category: 'G' | 'E' | 'S' | 'Integrated';
    changes: string[];
    url?: string;
    priority?: NotificationPayload['priority'];
    source?: string;
}

// 企業報告書通知參數
export interface CompanyReportParams {
    company: string;
    reportType: string;
    publishDate: string;
    url?: string;
    priority?: NotificationPayload['priority'];
}

// 關注名單提醒參數
export interface WatchlistAlertParams {
    company: string;
    alertType: 'new_report' | 'regulation_change' | 'price_change' | 'news';
    message: string;
    url?: string;
    priority?: NotificationPayload['priority'];
}

/**
 * 通知服務單例
 */
class NotificationService {
    private static instance: NotificationService;
    private notifiers: Map<string, BaseNotifier> = new Map();
    private deduplicationCache: Map<string, Date> = new Map();
    private readonly DEDUPLICATION_TTL = 5 * 60 * 1000; // 5 分鐘
    private cleanupTimer: NodeJS.Timeout | null = null;
    private readonly CLEANUP_INTERVAL = 60 * 1000; // 每分鐘清理一次

    private constructor() {
        this.initializeNotifiers();
        this.startCleanupTimer();
    }

    /**
     * 啟動定時清理
     */
    private startCleanupTimer(): void {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
        }
        this.cleanupTimer = setInterval(() => {
            this.cleanupExpiredCache();
        }, this.CLEANUP_INTERVAL);
    }

    /**
     * 清理過期的快取項目
     */
    private cleanupExpiredCache(): void {
        const now = Date.now();
        for (const [k, v] of this.deduplicationCache.entries()) {
            if (now - v.getTime() > this.DEDUPLICATION_TTL) {
                this.deduplicationCache.delete(k);
            }
        }
    }

    /**
     * 停止定時清理（用於服務關閉時）
     */
    public shutdown(): void {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
            this.cleanupTimer = null;
        }
    }

    /**
     * 取得單例實例
     */
    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    /**
     * 初始化所有通知渠道
     */
    private initializeNotifiers(): void {
        // 初始化 Slack
        const slackNotifier = new SlackNotifier();
        this.notifiers.set('slack', slackNotifier);

        // 初始化 Telegram
        const telegramNotifier = new TelegramNotifier();
        this.notifiers.set('telegram', telegramNotifier);

        console.log('[NotificationService] Initialized notifiers:',
            Array.from(this.notifiers.keys()).filter(k => this.notifiers.get(k)?.isEnabled())
        );
    }

    /**
     * 發送通知到所有啟用的渠道
     */
    async send(
        payload: NotificationPayload,
        options: NotificationOptions = {}
    ): Promise<NotificationResult[]> {
        const results: NotificationResult[] = [];
        const channels = options.channels || this.getEnabledChannels();

        // 去重檢查
        if (options.skipDuplicates && options.deduplicationKey) {
            if (this.isDuplicate(options.deduplicationKey)) {
                console.log('[NotificationService] Skipping duplicate notification:', options.deduplicationKey);
                return results;
            }
            this.markAsSent(options.deduplicationKey);
        }

        // 發送到各渠道
        const sendPromises = channels.map(async (channel) => {
            const notifier = this.notifiers.get(channel);
            if (!notifier?.isEnabled()) {
                console.log(`[NotificationService] Channel ${channel} is not enabled, skipping`);
                return null;
            }

            try {
                const result = await notifier.send(payload);
                results.push(result);
                return result;
            } catch (error) {
                const errorResult: NotificationResult = {
                    success: false,
                    channel,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    timestamp: new Date()
                };
                results.push(errorResult);
                return errorResult;
            }
        });

        await Promise.all(sendPromises);

        // 記錄發送結果
        this.logResults(results);

        return results;
    }

    /**
     * 發送法規變更通知
     */
    async sendRegulationAlert(params: RegulationAlertParams): Promise<NotificationResult[]> {
        const categoryNames: Record<string, string> = {
            G: '公司治理 (Governance)',
            E: '環境 (Environment)',
            S: '社會 (Social)',
            Integrated: '整合'
        };

        const payload: NotificationPayload = {
            title: params.title,
            message: `檢測到法規變更，請留意以下變更項目：\n\n${params.changes.map(c => `• ${c}`).join('\n')}`,
            type: 'regulation_change',
            priority: params.priority || 'high',
            url: params.url,
            metadata: {
                category: categoryNames[params.category] || params.category,
                changes: params.changes,
                source: params.source || 'ESGSonar'
            }
        };

        return this.send(payload, {
            deduplicationKey: `regulation:${params.category}:${params.title}`
        });
    }

    /**
     * 發送企業報告書通知
     */
    async sendCompanyReportNotification(params: CompanyReportParams): Promise<NotificationResult[]> {
        const payload: NotificationPayload = {
            title: `${params.company} 發布新報告書`,
            message: `企業「${params.company}」已發布新的${params.reportType}。\n\n發布日期：${params.publishDate}`,
            type: 'company_report',
            priority: params.priority || 'medium',
            url: params.url,
            metadata: {
                company: params.company,
                reportType: params.reportType,
                publishDate: params.publishDate
            }
        };

        return this.send(payload, {
            deduplicationKey: `report:${params.company}:${params.reportType}:${params.publishDate}`
        });
    }

    /**
     * 發送關注名單提醒
     */
    async sendWatchlistAlert(params: WatchlistAlertParams): Promise<NotificationResult[]> {
        const alertTypeLabels: Record<string, string> = {
            new_report: '新報告書',
            regulation_change: '法規變更',
            price_change: '價格變動',
            news: '新聞'
        };

        const payload: NotificationPayload = {
            title: `${params.company} - ${alertTypeLabels[params.alertType]}提醒`,
            message: params.message,
            type: 'watchlist_alert',
            priority: params.priority || 'high',
            url: params.url,
            metadata: {
                company: params.company,
                alertType: params.alertType
            }
        };

        return this.send(payload, {
            deduplicationKey: `watchlist:${params.company}:${params.alertType}`
        });
    }

    /**
     * 發送系統通知
     */
    async sendSystemNotification(
        title: string,
        message: string,
        priority: NotificationPayload['priority'] = 'low'
    ): Promise<NotificationResult[]> {
        const payload: NotificationPayload = {
            title,
            message,
            type: 'system_alert',
            priority,
            metadata: {
                source: 'ESGSonar System'
            }
        };

        return this.send(payload);
    }

    /**
     * 發送每日快報
     */
    async sendDailyDigest(data: {
        regulationChanges: number;
        newReports: number;
        watchlistAlerts: number;
        topChanges?: Array<{ title: string; category: string }>;
    }): Promise<NotificationResult[]> {
        let message = `📊 ESGSonar 每日快報\n\n`;
        message += `今日更新摘要：\n`;
        message += `• 法規變更：${data.regulationChanges} 項\n`;
        message += `• 企業報告書：${data.newReports} 份\n`;
        message += `• 關注名單提醒：${data.watchlistAlerts} 則\n`;

        if (data.topChanges && data.topChanges.length > 0) {
            message += `\n重點變更：\n`;
            data.topChanges.forEach(change => {
                message += `• [${change.category}] ${change.title}\n`;
            });
        }

        const payload: NotificationPayload = {
            title: '📊 ESGSonar 每日快報',
            message,
            type: 'daily_digest',
            priority: 'medium',
            metadata: {
                regulationChanges: data.regulationChanges,
                newReports: data.newReports,
                watchlistAlerts: data.watchlistAlerts
            }
        };

        return this.send(payload, {
            deduplicationKey: `digest:daily:${new Date().toDateString()}`
        });
    }

    /**
     * 取得所有已啟用的渠道
     */
    private getEnabledChannels(): ('slack' | 'telegram')[] {
        const enabled: ('slack' | 'telegram')[] = [];

        this.notifiers.forEach((notifier, name) => {
            if (notifier.isEnabled() && (name === 'slack' || name === 'telegram')) {
                enabled.push(name as 'slack' | 'telegram');
            }
        });

        return enabled;
    }

    /**
     * 檢查是否為重複通知
     */
    private isDuplicate(key: string): boolean {
        const lastSent = this.deduplicationCache.get(key);
        if (!lastSent) return false;

        return Date.now() - lastSent.getTime() < this.DEDUPLICATION_TTL;
    }

    /**
     * 標記為已發送
     */
    private markAsSent(key: string): void {
        this.deduplicationCache.set(key, new Date());
    }

    /**
     * 記錄發送結果
     */
    private logResults(results: NotificationResult[]): void {
        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;

        console.log(`[NotificationService] Sent ${successCount} notifications, ${failCount} failed`);

        results.forEach(result => {
            if (!result.success) {
                console.error(`[NotificationService] Failed to send to ${result.channel}:`, result.error);
            }
        });
    }

    /**
     * 測試所有渠道連接
     */
    async testAllConnections(): Promise<Record<string, boolean>> {
        const results: Record<string, boolean> = {};

        for (const [name, notifier] of this.notifiers.entries()) {
            if (notifier.isEnabled()) {
                results[name] = await notifier.testConnection();
            } else {
                results[name] = false;
            }
        }

        return results;
    }

    /**
     * 取得服務狀態
     */
    getStatus(): Record<string, { enabled: boolean; channel: string }> {
        const status: Record<string, { enabled: boolean; channel: string }> = {};

        for (const [name, notifier] of this.notifiers.entries()) {
            status[name] = {
                enabled: notifier.isEnabled(),
                channel: notifier.getChannelName()
            };
        }

        return status;
    }

    /**
     * 新增自定義通知渠道
     */
    addNotifier(name: string, notifier: BaseNotifier): void {
        this.notifiers.set(name, notifier);
        console.log(`[NotificationService] Added custom notifier: ${name}`);
    }

    /**
     * 移除通知渠道
     */
    removeNotifier(name: string): boolean {
        const result = this.notifiers.delete(name);
        if (result) {
            console.log(`[NotificationService] Removed notifier: ${name}`);
        }
        return result;
    }
}

// 匯出單例
export const NotificationServiceInstance = NotificationService.getInstance();

// 匯出便捷方法
export const sendRegulationAlert = (params: RegulationAlertParams) =>
    NotificationServiceInstance.sendRegulationAlert(params);

export const sendCompanyReportNotification = (params: CompanyReportParams) =>
    NotificationServiceInstance.sendCompanyReportNotification(params);

export const sendWatchlistAlert = (params: WatchlistAlertParams) =>
    NotificationServiceInstance.sendWatchlistAlert(params);

export const sendSystemNotification = (title: string, message: string, priority?: NotificationPayload['priority']) =>
    NotificationServiceInstance.sendSystemNotification(title, message, priority);

export const sendDailyDigest = (data: Parameters<typeof NotificationServiceInstance.sendDailyDigest>[0]) =>
    NotificationServiceInstance.sendDailyDigest(data);

export default NotificationService;
