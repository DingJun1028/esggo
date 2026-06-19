/**
 * ESGSonar Slack 通知服務
 * 透過 Webhook 發送通知到 Slack 頻道
 */

import BaseNotifier, {
    NotificationPayload,
    NotificationResult
} from './base-notifier';

export interface SlackConfig {
    webhookUrl: string;
    defaultChannel?: string;
    username?: string;
    iconEmoji?: string;
}

interface SlackBlock {
    type: string;
    text?: {
        type: string;
        text: string;
        emoji?: boolean;
    };
    elements?: Array<{
        type: string;
        text?: {
            type: string;
            text: string;
            emoji?: boolean;
        };
        url?: string;
        action_id?: string;
    }>;
    accessory?: {
        type: string;
        text?: {
            type: string;
            text: string;
            emoji?: boolean;
        };
        url?: string;
        action_id?: string;
    };
}

export class SlackNotifier extends BaseNotifier {
    private config: SlackConfig | null = null;

    constructor() {
        super('slack');
        this.initialize();
    }

    /**
     * 初始化 Slack 配置
     */
    private initialize(): void {
        const webhookUrl = process.env.SLACK_WEBHOOK_URL;

        if (webhookUrl) {
            this.config = {
                webhookUrl,
                username: process.env.SLACK_USERNAME || 'ESGSonar Bot',
                iconEmoji: process.env.SLACK_ICON_EMOJI || ':earth_asia:',
                defaultChannel: process.env.SLACK_DEFAULT_CHANNEL
            };
            this.setEnabled(true);
        } else {
            console.warn('[SlackNotifier] SLACK_WEBHOOK_URL not configured');
            this.setEnabled(false);
        }
    }

    /**
     * 驗證 Slack 配置
     */
    async validateConfig(): Promise<boolean> {
        if (!this.config?.webhookUrl) {
            return false;
        }

        try {
            new URL(this.config.webhookUrl);
            return this.config.webhookUrl.includes('hooks.slack.com');
        } catch {
            return false;
        }
    }

    /**
     * 測試 Slack 連接
     */
    async testConnection(): Promise<boolean> {
        if (!this.config?.webhookUrl) {
            return false;
        }

        try {
            const testPayload: NotificationPayload = {
                title: 'ESGSonar 連接測試',
                message: 'Slack 通知服務已成功連接！',
                type: 'system_alert',
                priority: 'low'
            };

            const result = await this.send(testPayload);
            return result.success;
        } catch (error) {
            console.error('[SlackNotifier] Connection test failed:', error);
            return false;
        }
    }

    /**
     * 發送通知到 Slack
     */
    async send(payload: NotificationPayload): Promise<NotificationResult> {
        const startTime = Date.now();

        if (!this.isEnabled() || !this.config) {
            return {
                success: false,
                channel: this.channelName,
                error: 'Slack notification is not enabled or not configured',
                timestamp: new Date()
            };
        }

        try {
            const message = this.buildSlackMessage(payload);

            const response = await fetch(this.config.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Slack API error: ${response.status} - ${errorText}`);
            }

            const result: NotificationResult = {
                success: true,
                channel: this.channelName,
                messageId: `slack-${Date.now()}`,
                timestamp: new Date()
            };

            this.logNotification(payload, result);

            const duration = Date.now() - startTime;
            console.log(`[SlackNotifier] Message sent successfully in ${duration}ms`);

            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            const result: NotificationResult = {
                success: false,
                channel: this.channelName,
                error: errorMessage,
                timestamp: new Date()
            };

            this.logNotification(payload, result);

            return result;
        }
    }

    /**
     * 建立 Slack 訊息格式
     */
    private buildSlackMessage(payload: NotificationPayload): Record<string, unknown> {
        const blocks: SlackBlock[] = [];

        // 標題區塊
        blocks.push({
            type: 'header',
            text: {
                type: 'plain_text',
                text: this.getBlockTitle(payload),
                emoji: true
            }
        });

        // 內容區塊
        const contentBlock: SlackBlock = {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: this.formatSlackContent(payload)
            }
        };

        // 如果有 URL，加入按鈕
        if (payload.url) {
            contentBlock.accessory = {
                type: 'button',
                text: {
                    type: 'plain_text',
                    text: '查看詳情',
                    emoji: true
                },
                url: payload.url,
                action_id: 'view_details'
            };
        }

        blocks.push(contentBlock);

        // 資訊區塊（分類、優先級）
        blocks.push(this.buildContextBlock(payload));

        // 分隔線
        blocks.push({
            type: 'divider'
        });

        return {
            username: this.config?.username || 'ESGSonar',
            icon_emoji: this.config?.iconEmoji || ':earth_asia:',
            blocks,
            unfurl_links: false
        };
    }

    /**
     * 取得區塊標題
     */
    private getBlockTitle(payload: NotificationPayload): string {
        const priorityPrefix = {
            low: '',
            medium: '⚠️ ',
            high: '🔔 ',
            critical: '🚨 '
        };

        return `${priorityPrefix[payload.priority]}${payload.title}`;
    }

    /**
     * 格式化 Slack 內容
     */
    private formatSlackContent(payload: NotificationPayload): string {
        let content = payload.message;

        // 加入元數據資訊
        if (payload.metadata) {
            const metadataLines: string[] = [];

            if (payload.metadata.category) {
                metadataLines.push(`• *分類*: ${payload.metadata.category}`);
            }

            if (payload.metadata.changes && Array.isArray(payload.metadata.changes)) {
                metadataLines.push('\n*變更項目*:');
                (payload.metadata.changes as string[]).forEach((change: string) => {
                    metadataLines.push(`  • ${change}`);
                });
            }

            if (payload.metadata.company) {
                metadataLines.push(`• *企業*: ${payload.metadata.company}`);
            }

            if (payload.metadata.reportType) {
                metadataLines.push(`• *報告類型*: ${payload.metadata.reportType}`);
            }

            if (payload.metadata.publishDate) {
                metadataLines.push(`• *發布日期*: ${payload.metadata.publishDate}`);
            }

            if (metadataLines.length > 0) {
                content += '\n\n' + metadataLines.join('\n');
            }
        }

        return content;
    }

    /**
     * 建立上下文區塊
     */
    private buildContextBlock(payload: NotificationPayload): SlackBlock {
        const priorityLabels = {
            low: '一般',
            medium: '中等',
            high: '高',
            critical: '緊急'
        };

        const typeLabels = {
            regulation_change: '法規變更',
            company_report: '企業報告書',
            watchlist_alert: '關注名單',
            system_alert: '系統通知',
            daily_digest: '每日快報',
            weekly_summary: '每週摘要'
        };

        const contextText = `*類型*: ${typeLabels[payload.type]} | *優先級*: ${priorityLabels[payload.priority]} | *時間*: ${new Date().toLocaleString('zh-TW')}`;

        return {
            type: 'context',
            elements: [
                {
                    type: 'mrkdwn',
                    text: { type: 'mrkdwn', text: contextText }
                }
            ]
        };
    }

    /**
     * 發送私密訊息（使用 chat.postMessage API）
     */
    async sendDirectMessage(
        userId: string,
        payload: NotificationPayload
    ): Promise<NotificationResult> {
        // 注意：這需要額外的 Slack Bot Token 權限
        console.warn('[SlackNotifier] Direct message requires additional permissions');
        return this.send(payload);
    }
}

export default SlackNotifier;
