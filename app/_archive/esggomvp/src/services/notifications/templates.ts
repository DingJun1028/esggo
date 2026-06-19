/**
 * ESGSonar 通知範本
 * 定義各類型通知的範本與格式化函數
 */

import { NotificationPayload, NotificationType } from './base-notifier';

// ========== 範本類型定義 ==========

export interface RegulationChangeTemplate {
    title: string;
    category: string;
    source: string;
    changes: string[];
    effectiveDate?: string;
    url?: string;
}

export interface CompanyReportTemplate {
    company: string;
    companyId?: string;
    reportType: string;
    publishDate: string;
    summary?: string;
    url?: string;
    tags?: string[];
}

export interface WatchlistAlertTemplate {
    company: string;
    companyId?: string;
    alertType: string;
    message: string;
    previousValue?: string;
    currentValue?: string;
    url?: string;
    timestamp?: string;
}

export interface DailyDigestTemplate {
    date: string;
    regulationChanges: RegulationChangeTemplate[];
    newReports: CompanyReportTemplate[];
    watchlistAlerts: WatchlistAlertTemplate[];
    summary: {
        totalChanges: number;
        totalReports: number;
        totalAlerts: number;
    };
}

// ========== 範本工廠 ==========

/**
 * 法規變更通知範本工廠
 */
export function createRegulationChangeTemplate(data: RegulationChangeTemplate): NotificationPayload {
    const categoryEmoji = getCategoryEmoji(data.category);

    return {
        title: `${categoryEmoji} ${data.title}`,
        message: formatRegulationChanges(data.changes, data.source, data.effectiveDate),
        type: 'regulation_change',
        priority: 'high',
        url: data.url,
        metadata: {
            category: data.category,
            changes: data.changes,
            source: data.source,
            effectiveDate: data.effectiveDate
        }
    };
}

/**
 * 企業報告書通知範本工廠
 */
export function createCompanyReportTemplate(data: CompanyReportTemplate): NotificationPayload {
    const reportTypeEmoji = getReportTypeEmoji(data.reportType);

    let message = `${reportTypeEmoji} *${data.company}* 發布了新報告書\n\n`;
    message += `📄 報告類型：${data.reportType}\n`;
    message += `📅 發布日期：${data.publishDate}\n`;

    if (data.summary) {
        message += `\n📝 摘要：\n${data.summary}\n`;
    }

    if (data.tags && data.tags.length > 0) {
        message += `\n🏷️ 相關標籤：${data.tags.join(', ')}`;
    }

    return {
        title: `新報告書發布 - ${data.company}`,
        message,
        type: 'company_report',
        priority: 'medium',
        url: data.url,
        metadata: {
            company: data.company,
            companyId: data.companyId,
            reportType: data.reportType,
            publishDate: data.publishDate,
            tags: data.tags
        }
    };
}

/**
 * 關注名單提醒範本工廠
 */
export function createWatchlistAlertTemplate(data: WatchlistAlertTemplate): NotificationPayload {
    const alertTypeEmoji = getAlertTypeEmoji(data.alertType);

    let message = `${alertTypeEmoji} *${data.company}* 有新動態\n\n`;
    message += `${data.message}\n`;

    if (data.previousValue && data.currentValue) {
        message += `\n📊 變更詳情：\n`;
        message += `  前值：${data.previousValue}\n`;
        message += `  新值：${data.currentValue}\n`;
    }

    return {
        title: `關注提醒 - ${data.company}`,
        message,
        type: 'watchlist_alert',
        priority: 'high',
        url: data.url,
        metadata: {
            company: data.company,
            companyId: data.companyId,
            alertType: data.alertType,
            previousValue: data.previousValue,
            currentValue: data.currentValue,
            timestamp: data.timestamp || new Date().toISOString()
        }
    };
}

//**
 * 每日快報範本工廠
    */
export function createDailyDigestTemplate(data: DailyDigestTemplate): NotificationPayload {
    let message = `📊 *ESGSonar 每日快報* - ${data.date}\n\n`;

    // 摘要統計
    message += `今日摘要：\n`;
    message += `  📚 法規變更：${data.summary.totalChanges} 項\n`;
    message += `  📄 企業報告書：${data.summary.totalReports} 份\n`;
    message += `  🔔 關注提醒：${data.summary.totalAlerts} 則\ n`;

    // 重點法規變更
    if (data.regulationChanges.length > 0) {
        message += `\n🔔 *重點法規變更*：\n`;
        data.regulationChanges.slice(0, 3).forEach(change => {
            const emoji = getCategoryEmoji(change.category);
            message += `  ${emoji} ${change.title}\n`;
        });
    }

    // 最新報告書
    if (data.newReports.length > 0) {
        message += `\n📄 *最新報告書*：\n`;
        data.newReports.slice(0, 3).forEach(report => {
            message += `  • ${report.company} - ${report.reportType}\n`;
        });
    }

    // 關注提醒
    if (data.watchlistAlerts.length > 0) {
        message += `\n🔔 *關注提醒*：\n`;
        data.watchlistAlerts.slice(0, 3).forEach(alert => {
            message += `  • ${alert.company}: ${alert.message}\n`;
        });
    }

    message += `\n_查看完整報告請訪問 ESGSonar 儀表板_`;

    return {
        title: `📊 每日快報 - ${data.date}`,
        message,
        type: 'daily_digest',
        priority: 'medium',
        metadata: {
            date: data.date,
            summary: data.summary,
            regulationChangesCount: data.regulationChanges.length,
            newReportsCount: data.newReports.length,
            watchlistAlertsCount: data.watchlistAlerts.length
        }
    };
}

// ========== 輔助函數 ==========

function formatRegulationChanges(changes: string[], source: string, effectiveDate?: string): string {
    let message = `偵測到 *${changes.length} 項*法規變更\n\n`;
    message += `*變更項目*：\n`;
    changes.forEach((change, index) => {
        message += `${index + 1}. ${change}\n`;
    });

    message += `\n📢 資訊來源：${source}`;

    if (effectiveDate) {
        message += `\n📅 生效日期：${effectiveDate}`;
    }

    return message;
}

function getCategoryEmoji(category: string): string {
    const categoryMap: Record<string, string> = {
        'G': '🏛️',
        'E': '🌿',
        'S': '👥',
        'Governance': '🏛️',
        'Environment': '🌿',
        'Social': '👥',
        'Integrated': '🌍'
    };
    return categoryMap[category] || '📋';
}

function getReportTypeEmoji(reportType: string): string {
    const typeMap: Record<string, string> = {
        '永續報告': '🌱',
        'ESG Report': '🌱',
        '年報': '📈',
        'Annual Report': '📈',
        '社會責任報告': '🤝',
        'CSR Report': '🤝',
        '環境報告': '🍃',
        'Environmental Report': '🍃'
    };
    return typeMap[reportType] || '📄';
}

function getAlertTypeEmoji(alertType: string): string {
    const typeMap: Record<string, string> = {
        'new_report': '📄',
        'regulation_change': '📋',
        'price_change': '📈',
        'news': '📰',
        'rating_change': '⭐',
        'compliance': '✅'
    };
    return typeMap[alertType] || '🔔';
}

// ========== Slack 專用範本 ==========

export interface SlackBlockTemplate {
    blocks: SlackBlock[];
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
    }>;
    accessory?: {
        type: string;
        text: {
            type: string;
            text: string;
            emoji: boolean;
        };
        url: string;
    };
}

/**
 * 建立 Slack 法規變更區塊範本
 */
export function createSlackRegulationBlocks(data: RegulationChangeTemplate): SlackBlockTemplate {
    const categoryEmoji = getCategoryEmoji(data.category);

    return {
        blocks: [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: `${categoryEmoji} ${data.title}`,
                    emoji: true
                }
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: formatRegulationChangesForSlack(data.changes, data.source, data.effectiveDate)
                }
            },
            {
                type: 'context',
                elements: [
                    {
                        type: 'mrkdwn',
                        text: `📢 來源：${data.source}${data.effectiveDate ? ` | 📅 生效：${data.effectiveDate}` : ''}`
                    }
                ]
            },
            ...(data.url ? [{
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: ''
                },
                accessory: {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: '查看詳情',
                        emoji: true
                    },
                    url: data.url
                }
            }] : []),
            { type: 'divider' }
        ]
    };
}

/**
 * 建立 Slack 企業報告書區塊範本
 */
export function createSlackReportBlocks(data: CompanyReportTemplate): SlackBlockTemplate {
    const reportTypeEmoji = getReportTypeEmoji(data.reportType);

    return {
        blocks: [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: `${reportTypeEmoji} 新報告書發布`,
                    emoji: true
                }
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*${data.company}* 發布了新的 *${data.reportType}*`
                }
            },
            {
                type: 'context',
                elements: [
                    {
                        type: 'mrkdwn',
                        text: `📄 類型：${data.reportType} | 📅 日期：${data.publishDate}`
                    }
                ]
            },
            ...(data.url ? [{
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: ''
                },
                accessory: {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: '查看報告書',
                        emoji: true
                    },
                    url: data.url
                }
            }] : []),
            { type: 'divider' }
        ]
    };
}

function formatRegulationChangesForSlack(changes: string[], source: string, effectiveDate?: string): string {
    let text = `偵測到 *${changes.length} 項*法規變更\n\n`;
    text += `*變更項目*：\n`;
    changes.forEach((change, index) => {
        text += `${index + 1}. ${change}\n`;
    });

    text += `\n📢 資訊來源：${source}`;

    if (effectiveDate) {
        text += `\n📅 生效日期：${effectiveDate}`;
    }

    return text;
}

// ========== 匯出預設範本 ==========

export const DEFAULT_TEMPLATES = {
    regulationChange: createRegulationChangeTemplate,
    companyReport: createCompanyReportTemplate,
    watchlistAlert: createWatchlistAlertTemplate,
    dailyDigest: createDailyDigestTemplate
};

export default DEFAULT_TEMPLATES;
