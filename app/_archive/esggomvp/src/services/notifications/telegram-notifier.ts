/**
 * ESGSonar Telegram 通知服務
 * 透過 Telegram Bot API 發送訊息
 */

import BaseNotifier, {
    NotificationPayload,
    NotificationResult
} from './base-notifier';

export interface TelegramConfig {
    botToken: string;
    chatId: string;
    parseMode?: 'Markdown' | 'HTML' | 'MarkdownV2';
}

interface TelegramMessageParams {
    chat_id: string;
    text: string;
    parse_mode?: string;
    disable_web_page_preview?: boolean;
    disable_notification?: boolean;
    reply_markup?: TelegramInlineKeyboardMarkup;
}

interface TelegramInlineKeyboardMarkup {
    inline_keyboard: TelegramInlineKeyboardButton[][];
}

interface TelegramInlineKeyboardButton {
    text: string;
    url?: string;
    callback_data?: string;
}

interface TelegramResponse {
    ok: boolean;
    result?: {
        message_id: number;
        chat: {
            id: number;
        };
    };
    error_code?: number;
    description?: string;
}

export class TelegramNotifier extends BaseNotifier {
    private config: TelegramConfig | null = null;
    private apiBaseUrl: string = 'https://api.telegram.org';

    constructor() {
        super('telegram');
        this.initialize();
    }

    /**
     * 初始化 Telegram 配置
     */
    private initialize(): void {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (botToken && chatId) {
            this.config = {
                botToken,
                chatId,
                parseMode: 'Markdown'
            };
            this.setEnabled(true);
        } else {
            console.warn('[TelegramNotifier] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured');
            this.setEnabled(false);
        }
    }

    /**
     * 驗證 Telegram 配置
     */
    async validateConfig(): Promise<boolean> {
        if (!this.config?.botToken || !this.config?.chatId) {
            return false;
        }

        try {
            const response = await this.apiCall('/getMe', {});
            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * 測試 Telegram 連接
     */
    async testConnection(): Promise<boolean> {
        if (!this.config?.botToken || !this.config?.chatId) {
            return false;
        }

        try {
            const testPayload: NotificationPayload = {
                title: 'ESGSonar 連接測試',
                message: 'Telegram 通知服務已成功連接！',
                type: 'system_alert',
                priority: 'low'
            };

            const result = await this.send(testPayload);
            return result.success;
        } catch (error) {
            console.error('[TelegramNotifier] Connection test failed:', error);
            return false;
        }
    }

    /**
     * 發送訊息到 Telegram
     */
    async send(payload: NotificationPayload): Promise<NotificationResult> {
        const startTime = Date.now();

        if (!this.isEnabled() || !this.config) {
            return {
                success: false,
                channel: this.channelName,
                error: 'Telegram notification is not enabled or not configured',
                timestamp: new Date()
            };
        }

        try {
            const message = this.buildTelegramMessage(payload);

            const response = await this.apiCall('/sendMessage', message);

            if (!response.ok) {
                throw new Error(`Telegram API error: ${response.error_code} - ${response.description}`);
            }

            const result: NotificationResult = {
                success: true,
                channel: this.channelName,
                messageId: response.result?.message_id?.toString(),
                timestamp: new Date()
            };

            this.logNotification(payload, result);

            const duration = Date.now() - startTime;
            console.log(`[TelegramNotifier] Message sent successfully in ${duration}ms`);

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
     * 發送訊息到指定聊天室
     */
    async sendToChat(
        chatId: string,
        payload: NotificationPayload
    ): Promise<NotificationResult> {
        if (!this.config) {
            return {
                success: false,
                channel: this.channelName,
                error: 'Telegram not configured',
                timestamp: new Date()
            };
        }

        const originalChatId = this.config.chatId;
        this.config.chatId = chatId;

        const result = await this.send(payload);

        this.config.chatId = originalChatId;

        return result;
    }

    /**
     * 發送圖文訊息
     */
    async sendPhotoWithCaption(
        photoUrl: string,
        caption: string,
        payload: NotificationPayload
    ): Promise<NotificationResult> {
        if (!this.isEnabled() || !this.config) {
            return {
                success: false,
                channel: this.channelName,
                error: 'Telegram notification is not enabled or not configured',
                timestamp: new Date()
            };
        }

        try {
            const response = await this.apiCall('/sendPhoto', {
                chat_id: this.config.chatId,
                photo: photoUrl,
                caption: this.formatTelegramContent(payload),
                parse_mode: this.config.parseMode,
                reply_markup: payload.url ? this.buildReplyMarkup(payload.url) : undefined
            });

            if (!response.ok) {
                throw new Error(`Telegram API error: ${response.error_code} - ${response.description}`);
            }

            const result: NotificationResult = {
                success: true,
                channel: this.channelName,
                messageId: response.result?.message_id?.toString(),
                timestamp: new Date()
            };

            this.logNotification(payload, result);

            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            return {
                success: false,
                channel: this.channelName,
                error: errorMessage,
                timestamp: new Date()
            };
        }
    }

    /**
     * 建立 Telegram 訊息內容
     */
    private buildTelegramMessage(payload: NotificationPayload): TelegramMessageParams {
        const text = this.formatTelegramContent(payload);

        return {
            chat_id: this.config!.chatId,
            text,
            parse_mode: this.config!.parseMode,
            disable_web_page_preview: false,
            reply_markup: payload.url ? this.buildReplyMarkup(payload.url) : undefined
        };
    }

    /**
     * 格式化 Telegram 訊息內容
     */
    private formatTelegramContent(payload: NotificationPayload): string {
        const priorityIcon = this.getPriorityIcon(payload.priority);
        const typeLabel = this.getTypeLabel(payload.type);

        let content = `${priorityIcon} *${typeLabel}*\\n\\n`;
        content += `*${payload.title}*\\n\\n`;
        content += `${payload.message}`;

        // 加入元數據資訊
        if (payload.metadata) {
            const metadataLines: string[] = [];

            if (payload.metadata.category) {
                metadataLines.push(`\\n📋 *分類*: \`${payload.metadata.category}\``);
            }

            if (payload.metadata.changes && Array.isArray(payload.metadata.changes)) {
                metadataLines.push('\\n📝 *變更項目*:');
                (payload.metadata.changes as string[]).forEach((change: string) => {
                    metadataLines.push(`  • ${change}`);
                });
            }

            if (payload.metadata.company) {
                metadataLines.push(`\\n🏢 *企業*: ${payload.metadata.company}`);
            }

            if (payload.metadata.reportType) {
                metadataLines.push(`\\n📄 *報告類型*: ${payload.metadata.reportType}`);
            }

            if (payload.metadata.publishDate) {
                metadataLines.push(`\\n📅 *發布日期*: ${payload.metadata.publishDate}`);
            }

            if (metadataLines.length > 0) {
                content += metadataLines.join('');
            }
        }

        content += `\\n\\n⏰ ${new Date().toLocaleString('zh-TW')}`;

        return content;
    }

    /**
     * 取得優先級對應的圖示
     */
    private getPriorityIcon(priority: NotificationPayload['priority']): string {
        const icons = {
            low: 'ℹ️',
            medium: '⚠️',
            high: '🔔',
            critical: '🚨'
        };
        return icons[priority] || 'ℹ️';
    }

    /**
     * 建立回覆鍵盤標記
     */
    private buildReplyMarkup(url: string): TelegramInlineKeyboardMarkup {
        return {
            inline_keyboard: [
                [
                    {
                        text: '🔗 查看詳情',
                        url
                    }
                ]
            ]
        };
    }

    /**
     * Telegram API 調用
     */
    private async apiCall(
        method: string,
        params: Record<string, unknown>
    ): Promise<TelegramResponse> {
        if (!this.config?.botToken) {
            throw new Error('Telegram bot token not configured');
        }

        const url = `${this.apiBaseUrl}/bot${this.config.botToken}${method}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });

        return response.json() as Promise<TelegramResponse>;
    }

    /**
     * 設定 API 基礎 URL（用於自定義代理）
     */
    setApiBaseUrl(baseUrl: string): void {
        this.apiBaseUrl = baseUrl;
    }

    /**
     * 取得機器人資訊
     */
    async getBotInfo(): Promise<Record<string, unknown> | null> {
        try {
            const response = await this.apiCall('/getMe', {});
            return response.ok ? response.result : null;
        } catch {
            return null;
        }
    }

    /**
     * 取得聊天室資訊
     */
    async getChatInfo(chatId?: string): Promise<Record<string, unknown> | null> {
        try {
            const targetChatId = chatId || this.config?.chatId;
            if (!targetChatId) return null;

            const response = await this.apiCall('/getChat', { chat_id: targetChatId });
            return response.ok ? response.result : null;
        } catch {
            return null;
        }
    }
}

export default TelegramNotifier;

