/**
 * ESGSonar 通知服務匯出
 * 整合 Email、Slack、Telegram 等通知管道
 */

// 匯出基礎通知類別
export { BaseNotifier, NotifierConfig, NotificationPayload } from "./base-notifier";
export { SlackNotifier } from "./slack-notifier";
export { TelegramNotifier } from "./telegram-notifier";

// 匯出通知服務
export { NotificationService } from "./notification-service";

// 匯出排程器
export { NotificationScheduler } from "./scheduler";

// 匯出範本
export { NotificationTemplate, getTemplate, renderTemplate } from "./templates";
