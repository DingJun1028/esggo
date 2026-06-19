/**
 * ESGSonar 通知排程服務
 * 管理通知頻率控制、訂閱者管理與通知日誌
 */

import { NotificationPayload, NotificationResult, Subscriber, SubscriberPreferences } from './base-notifier';
import { NotificationServiceInstance } from './notification-service';

// ========== 排程類型定義 ==========

export interface NotificationSchedule {
  id: string;
  type: 'regulation' | 'report' | 'watchlist' | 'digest';
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
  cronExpression?: string;
}

export interface SubscriberNotificationLog {
  id: string;
  subscriberId: string;
  type: string;
  priority: string;
  channel: string;
  success: boolean;
  messageId?: string;
  error?: string;
  sentAt: Date;
  payload?: NotificationPayload;
}

export interface NotificationStats {
  totalSent: number;
  totalFailed: number;
  successRate: number;
  byChannel: Record<string, { sent: number; failed: number }>;
  byType: Record<string, { sent: number; failed: number }>;
  last24Hours: { sent: number; failed: number };
}

// ========== 排程器類別 ==========

class NotificationScheduler {
  private static instance: NotificationScheduler;
  private schedules: Map<string, NotificationSchedule> = new Map();
  private subscribers: Map<string, Subscriber> = new Map();
  private notificationLogs: SubscriberNotificationLog[] = [];
  private readonly MAX_LOGS = 10000;
  private scheduledJobs: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    this.initializeDefaultSchedules();
  }

  /**
   * 取得單例實例
   */
  public static getInstance(): NotificationScheduler {
    if (!NotificationScheduler.instance) {
      NotificationScheduler.instance = new NotificationScheduler();
    }
    return NotificationScheduler.instance;
  }

  /**
   * 初始化預設排程
   */
  private initializeDefaultSchedules(): void {
    // 法規變更即時通知
    this.schedules.set('regulation-realtime', {
      id: 'regulation-realtime',
      type: 'regulation',
      frequency: 'realtime',
      enabled: true,
      nextRun: new Date()
    });

    // 企業報告書每日摘要
    this.schedules.set('report-daily', {
      id: 'report-daily',
      type: 'report',
      frequency: 'daily',
      enabled: true,
      nextRun: this.getNextDailyRun()
    });

    // 關注名單每小時檢查
    this.schedules.set('watchlist-hourly', {
      id: 'watchlist-hourly',
      type: 'watchlist',
      frequency: 'hourly',
      enabled: true,
      nextRun: this.getNextHourlyRun()
    });

    // 每週摘要
    this.schedules.set('digest-weekly', {
      id: 'digest-weekly',
      type: 'digest',
      frequency: 'weekly',
      enabled: true,
      nextRun: this.getNextWeeklyRun()
    });

    console.log('[NotificationScheduler] Initialized default schedules');
  }

  /**
   * 取得下次每日執行時間（早上 9 點）
   */
  private getNextDailyRun(): Date {
    const now = new Date();
    const next = new Date(now);
    next.setHours(9, 0, 0, 0);
    
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }
    
    return next;
  }

  /**
   * 取得下次每小時執行時間
   */
  private getNextHourlyRun(): Date {
    const now = new Date();
    const next = new Date(now);
    next.setMinutes(next.getMinutes() + 1);
    next.setSeconds(0, 0);
    
    return next;
  }

  /**
   * 取得下次每週執行時間（週一早上 9 點）
   */
  private getNextWeeklyRun(): Date {
    const now = new Date();
    const next = new Date(now);
    next.setHours(9, 0, 0, 0);
    
    const dayOfWeek = next.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    
    if (dayOfWeek === 0) {
      // 今天是週日，找到下週一
      next.setDate(next.getDate() + 1);
    } else if (dayOfWeek !== 1 || now.getHours() >= 9) {
      // 已經過了週一 9 點，找到下週一
      next.setDate(next.getDate() + daysUntilMonday);
    }
    
    return next;
  }

  // ========== 排程管理 ==========

  /**
   * 註冊新排程
   */
  registerSchedule(schedule: NotificationSchedule): void {
    this.schedules.set(schedule.id, schedule);
    console.log(`[NotificationScheduler] Registered schedule: ${schedule.id}`);
  }

  /**
   * 取得所有排程
   */
  getSchedules(): NotificationSchedule[] {
    return Array.from(this.schedules.values());
  }

  /**
   * 取得排程
   */
  getSchedule(id: string): NotificationSchedule | undefined {
    return this.schedules.get(id);
  }

  /**
   * 啟用/停用排程
   */
  setScheduleEnabled(id: string, enabled: boolean): boolean {
    const schedule = this.schedules.get(id);
    if (!schedule) return false;
    
    schedule.enabled = enabled;
    console.log(`[NotificationScheduler] Schedule ${id} ${enabled ? 'enabled' : 'disabled'}`);
    
    return true;
  }

  /**
   * 啟動排程
   */
  startSchedule(id: string): boolean {
    const schedule = this.schedules.get(id);
    if (!schedule || !schedule.enabled) return false;
    
    // 如果已經有運行的排程，先停止
    if (this.scheduledJobs.has(id)) {
      this.stopSchedule(id);
    }

    let intervalMs: number;
    
    switch (schedule.frequency) {
      case 'realtime':
        // 即時通知不需要定時器，由其他服務觸發
        return true;
      case 'hourly':
        intervalMs = 60 * 60 * 1000;
        break;
      case 'daily':
        intervalMs = 24 * 60 * 60 * 1000;
        break;
      case 'weekly':
        intervalMs = 7 * 24 * 60 * 60 * 1000;
        break;
      default:
        return false;
    }

    const job = setInterval(() => {
      this.executeSchedule(id);
    }, intervalMs);

    this.scheduledJobs.set(id, job);
    console.log(`[NotificationScheduler] Started schedule: ${id}`);
    
    return true;
  }

  /**
   * 停止排程
   */
  stopSchedule(id: string): boolean {
    const job = this.scheduledJobs.get(id);
    if (!job) return false;
    
    clearInterval(job);
    this.scheduledJobs.delete(id);
    console.log(`[NotificationScheduler] Stopped schedule: ${id}`);
    
    return true;
  }

  /**
   * 執行排程
   */
  private async executeSchedule(id: string): Promise<void> {
    const schedule = this.schedules.get(id);
    if (!schedule || !schedule.enabled) return;

    console.log(`[NotificationScheduler] Executing schedule: ${id}`);
    schedule.lastRun = new Date();

    try {
      switch (schedule.type) {
        case 'regulation':
          // 法規變更由爬蟲服務觸發，這裡不需要執行
          break;
        case 'report':
          await this.processDailyReports();
          break;
        case 'watchlist':
          await this.processWatchlistAlerts();
          break;
        case 'digest':
          await this.processWeeklyDigest();
          break;
      }
    } catch (error) {
      console.error(`[NotificationScheduler] Error executing schedule ${id}:`, error);
    }

    // 更新下次執行時間
    this.updateNextRun(schedule);
  }

  /**
   * 更新下次執行時間
   */
  private updateNextRun(schedule: NotificationSchedule): void {
    const now = new Date();
    
    switch (schedule.frequency) {
      case 'hourly':
        schedule.nextRun = new Date(now.getTime() + 60 * 60 * 1000);
        break;
      case 'daily':
        schedule.nextRun = this.getNextDailyRun();
        break;
      case 'weekly':
        schedule.nextRun = this.getNextWeeklyRun();
        break;
    }
  }

  /**
   * 處理每日報告書摘要
   */
  private async processDailyReports(): Promise<void> {
    // 這裡應該從資料庫取得今日新增的報告書
    // 為了範例，我們發送一個測試通知
    console.log('[NotificationScheduler] Processing daily reports...');
  }

  /**
   * 處理關注名單提醒
   */
  private async processWatchlistAlerts(): Promise<void> {
    // 這裡應該檢查關注名單的變化
    console.log('[NotificationScheduler] Processing watchlist alerts...');
  }

  /**
   * 處理每週摘要
   */
  private async processWeeklyDigest(): Promise<void> {
    // 這裡應該產生每週摘要
    await NotificationServiceInstance.sendDailyDigest({
      regulationChanges: 0,
      newReports: 0,
      watchlistAlerts: 0
    });
  }

  // ========== 訂閱者管理 ==========

  /**
   * 新增訂閱者
   */
  addSubscriber(subscriber: Subscriber): void {
    this.subscribers.set(subscriber.id, subscriber);
    console.log(`[NotificationScheduler] Added subscriber: ${subscriber.name}`);
  }

  /**
   * 移除訂閱者
   */
  removeSubscriber(id: string): boolean {
    const result = this.subscribers.delete(id);
    if (result) {
      console.log(`[NotificationScheduler] Removed subscriber: ${id}`);
    }
    return result;
  }

  /**
   * 取得訂閱者
   */
  getSubscriber(id: string): Subscriber | undefined {
    return this.subscribers.get(id);
  }

  /**
   * 取得所有訂閱者
   */
  getAllSubscribers(): Subscriber[] {
    return Array.from(this.subscribers.values());
  }

  /**
   * 更新訂閱者偏好設定
   */
  updateSubscriberPreferences(
    id: string,
    preferences: Partial<SubscriberPreferences>
  ): boolean {
    const subscriber = this.subscribers.get(id);
    if (!subscriber) return false;
    
    subscriber.preferences = {
      ...subscriber.preferences,
      ...preferences
    };
    subscriber.updatedAt = new Date();
    
    console.log(`[NotificationScheduler] Updated preferences for subscriber: ${id}`);
    return true;
  }

  /**
   * 檢查訂閱者是否應該收到通知
   */
  shouldNotify(subscriber: Subscriber, type: string): boolean {
    const preferences = subscriber.preferences;
    
    switch (type) {
      case 'regulation_change':
        return preferences.regulationAlerts;
      case 'company_report':
        return preferences.companyReports;
      case 'watchlist_alert':
        return preferences.watchlistAlerts;
      default:
        return true;
    }
  }

  // ========== 日誌管理 ==========

  /**
   * 記錄通知發送結果
   */
  logNotification(log: Omit<SubscriberNotificationLog, 'id'>): void {
    const logEntry: SubscriberNotificationLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    this.notificationLogs.push(logEntry);
    
    // 維護日誌數量
    if (this.notificationLogs.length > this.MAX_LOGS) {
      this.notificationLogs = this.notificationLogs.slice(-this.MAX_LOGS);
    }
  }

  /**
   * 取得通知日誌
   */
  getLogs(options?: {
    subscriberId?: string;
    type?: string;
    channel?: string;
    limit?: number;
  }): SubscriberNotificationLog[] {
    let logs = [...this.notificationLogs];
    
    if (options?.subscriberId) {
      logs = logs.filter(l => l.subscriberId === options.subscriberId);
    }
    
    if (options?.type) {
      logs = logs.filter(l => l.type === options.type);
    }
    
    if (options?.channel) {
      logs = logs.filter(l => l.channel === options.channel);
    }
    
    // 按時間倒序
    logs.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
    
    if (options?.limit) {
      logs = logs.slice(0, options.limit);
    }
    
    return logs;
  }

  /**
   * 取得通知統計
   */
  getStats(): NotificationStats {
    const logs = this.notificationLogs;
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const totalSent = logs.filter(l => l.success).length;
    const totalFailed = logs.filter(l => !l.success).length;
    
    const byChannel: Record<string, { sent: number; failed: number }> = {};
    const byType: Record<string, { sent: number; failed: number }> = {};
    
    let last24HoursSent = 0;
    let last24HoursFailed = 0;
    
    logs.forEach(log => {
      // 按渠道統計
      if (!byChannel[log.channel]) {
        byChannel[log.channel] = { sent: 0, failed: 0 };
      }
      if (log.success) {
        byChannel[log.channel].sent++;
      } else {
        byChannel[log.channel].failed++;
      }
      
      // 按類型統計
      if (!byType[log.type]) {
        byType[log.type] = { sent: 0, failed: 0 };
      }
      if (log.success) {
        byType[log.type].sent++;
      } else {
        byType[log.type].failed++;
      }
      
      // 過去 24 小時
      if (log.sentAt >= last24Hours) {
        if (log.success) {
          last24HoursSent++;
        } else {
          last24HoursFailed++;
        }
      }
    });
    
    return {
      totalSent,
      totalFailed,
      successRate: totalSent + totalFailed > 0 
        ? Math.round((totalSent / (totalSent + totalFailed)) * 100) 
        : 0,
      byChannel,
      byType,
      last24Hours: {
        sent: last24HoursSent,
        failed: last24HoursFailed
      }
    };
  }

  /**
   * 清除日誌
   */
  clearLogs(): void {
    this.notificationLogs = [];
    console.log('[NotificationScheduler] Cleared all notification logs');
  }

  // ========== 批次通知 ==========

  /**
   * 向所有訂閱者發送通知
   */
  async broadcastToSubscribers(
    payload: NotificationPayload
  ): Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];
    
    for (const subscriber of this.subscribers.values()) {
      // 檢查是否應該通知
      if (!this.shouldNotify(subscriber, payload.type)) {
        continue;
      }
      
      // 檢查安靜時段
      if (this.isInQuietHours(subscriber.preferences.quietHours)) {
        console.log(`[NotificationScheduler] Skipping ${subscriber.name} (quiet hours)`);
        continue;
      }
      
      // 根據訂閱者偏好選擇渠道（過濾只支援的渠道）
      const channels = subscriber.channels.filter(
        (c): c is 'slack' | 'telegram' => c === 'slack' || c === 'telegram'
      );
      
      for (const channel of channels) {
        const result = await NotificationServiceInstance.send(payload, { channels: [channel] });
        results.push(...result);
        
        // 記錄日誌
        result.forEach(r => {
          this.logNotification({
            subscriberId: subscriber.id,
            type: payload.type,
            priority: payload.priority,
            channel,
            success: r.success,
            messageId: r.messageId,
            error: r.error,
            sentAt: r.timestamp,
            payload
          });
        });
      }
    }
    
    return results;
  }

  /**
   * 檢查是否在安靜時段
   */
  private isInQuietHours(quietHours?: SubscriberPreferences['quietHours']): boolean {
    if (!quietHours) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = quietHours.start.split(':').map(Number);
    const [endHour, endMin] = quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // 跨日時段
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  // ========== 服務控制 ==========

  /**
   * 啟動所有排程
   */
  startAll(): void {
    for (const [id, schedule] of this.schedules.entries()) {
      if (schedule.enabled) {
        this.startSchedule(id);
      }
    }
    console.log('[NotificationScheduler] Started all schedules');
  }

  /**
   * 停止所有排程
   */
  stopAll(): void {
    for (const [id] of this.scheduledJobs.entries()) {
      this.stopSchedule(id);
    }
    console.log('[NotificationScheduler] Stopped all schedules');
  }

  /**
   * 取得服務狀態
   */
  getStatus(): {
    schedules: NotificationSchedule[];
    subscribers: number;
    logs: number;
    runningJobs: number;
  } {
    return {
      schedules: this.getSchedules(),
      subscribers: this.subscribers.size,
      logs: this.notificationLogs.length,
      runningJobs: this.scheduledJobs.size
    };
  }
}

// 匯出單例
export const NotificationSchedulerInstance = NotificationScheduler.getInstance();

export default NotificationScheduler;
