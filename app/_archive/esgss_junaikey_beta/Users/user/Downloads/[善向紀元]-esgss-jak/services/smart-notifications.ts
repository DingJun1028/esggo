/**
 * 智慧通知系統
 * 負責 ESG 相關的智能通知、提醒和溝通
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { EventEmitter } from 'events';

// 條件性 import Node.js 特定的模組
let nodemailer: any = null;
let webpush: any = null;

if (typeof window === 'undefined') {
  // 僅在服務端環境中加載
  try {
    nodemailer = require('nodemailer');
    webpush = require('web-push');
  } catch (error) {
    console.warn('Node.js specific modules not available in browser environment');
  }
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'push' | 'sms' | 'in_app';
  subject?: string;
  template: string;
  variables: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface NotificationRule {
  id: string;
  name: string;
  trigger: {
    type: 'schedule' | 'event' | 'condition';
    config: any;
  };
  targets: {
    roles?: string[];
    users?: string[];
    departments?: string[];
  };
  channels: ('email' | 'push' | 'sms' | 'in_app')[];
  template: string;
  enabled: boolean;
}

export interface UserNotificationPreferences {
  userId: string;
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
  quietHours: {
    start: string; // HH:mm
    end: string; // HH:mm
  };
  frequency: 'immediate' | 'daily' | 'weekly';
  categories: {
    approvals: boolean;
    anomalies: boolean;
    deadlines: boolean;
    reports: boolean;
    milestones: boolean;
  };
}

export interface NotificationLog {
  id: string;
  userId: string;
  type: string;
  channel: 'email' | 'push' | 'sms' | 'in_app';
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  template: string;
  data: any;
  sentAt?: Date;
  deliveredAt?: Date;
  error?: string;
}

export class SmartNotificationService extends EventEmitter {
  private supabase: SupabaseClient;
  private emailTransporter: any;
  private rules: Map<string, NotificationRule> = new Map();
  private templates: Map<string, NotificationTemplate> = new Map();

  constructor(supabaseUrl: string, supabaseKey: string) {
    super();
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.initializeEmailTransporter();
    this.initializeWebPush();
    this.loadRulesAndTemplates();
  }

  /**
   * 初始化郵件發送器
   */
  private initializeEmailTransporter(): void {
    if (nodemailer) {
      this.emailTransporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      console.warn('Email transporter not initialized - running in browser environment');
    }
  }

  /**
   * 初始化 Web Push
   */
  private initializeWebPush(): void {
    if (webpush) {
      webpush.setVapidDetails(
        'mailto:' + process.env.VAPID_EMAIL,
        process.env.VAPID_PUBLIC_KEY!,
        process.env.VAPID_PRIVATE_KEY!
      );
    } else {
      console.warn('Web Push not initialized - running in browser environment');
    }
  }

  /**
   * 載入通知規則和模板
   */
  private async loadRulesAndTemplates(): Promise<void> {
    try {
      // 載入預設規則
      await this.initializeDefaultRules();
      await this.initializeDefaultTemplates();
    } catch (error) {
      console.error('Failed to load notification rules and templates:', error);
    }
  }

  /**
   * 初始化預設通知規則
   */
  private async initializeDefaultRules(): Promise<void> {
    const defaultRules: NotificationRule[] = [
      {
        id: 'approval-reminders',
        name: '審核提醒',
        trigger: {
          type: 'schedule',
          config: { cron: '0 9 * * 1-5' } // 每週一到五早上9點
        },
        targets: { roles: ['editor'] },
        channels: ['email', 'push'],
        template: 'approval-reminder',
        enabled: true
      },
      {
        id: 'anomaly-alerts',
        name: '異常告警',
        trigger: {
          type: 'event',
          config: { event: 'anomaly-detected' }
        },
        targets: { roles: ['admin'] },
        channels: ['email', 'push', 'sms'],
        template: 'anomaly-alert',
        enabled: true
      },
      {
        id: 'deadline-warnings',
        name: '截止日期提醒',
        trigger: {
          type: 'schedule',
          config: { cron: '0 8 * * *' } // 每天早上8點
        },
        targets: { roles: ['editor', 'admin'] },
        channels: ['email'],
        template: 'deadline-warning',
        enabled: true
      },
      {
        id: 'milestone-celebrations',
        name: '里程碑慶祝',
        trigger: {
          type: 'event',
          config: { event: 'milestone-achieved' }
        },
        targets: { roles: ['editor', 'admin'] },
        channels: ['email', 'push', 'in_app'],
        template: 'milestone-celebration',
        enabled: true
      },
      {
        id: 'weekly-reports',
        name: '週報提醒',
        trigger: {
          type: 'schedule',
          config: { cron: '0 9 * * 1' } // 每週一早上9點
        },
        targets: { roles: ['admin'] },
        channels: ['email'],
        template: 'weekly-report',
        enabled: true
      }
    ];

    for (const rule of defaultRules) {
      this.rules.set(rule.id, rule);
    }
  }

  /**
   * 初始化預設模板
   */
  private async initializeDefaultTemplates(): Promise<void> {
    const defaultTemplates: NotificationTemplate[] = [
      {
        id: 'approval-reminder',
        name: '審核提醒',
        type: 'email',
        subject: 'ESG 數據審核提醒',
        template: `
          親愛的 {{userName}}，

          您有 {{pendingCount}} 項 ESG 數據正在等待審核：

          {{#each pendingItems}}
          - {{metricName}}: {{value}} {{unit}} (提交時間: {{submittedAt}})
          {{/each}}

          請盡快登入系統進行審核。

          此致
          善向永續 ESG 系統
        `,
        variables: ['userName', 'pendingCount', 'pendingItems'],
        priority: 'medium'
      },
      {
        id: 'anomaly-alert',
        name: '異常告警',
        type: 'email',
        subject: '⚠️ ESG 數據異常警告',
        template: `
          緊急通知！

          檢測到 ESG 數據異常：

          指標: {{metricName}}
          數值: {{value}} {{unit}}
          異常程度: {{severity}}
          說明: {{explanation}}

          請立即檢查數據來源和計算邏輯。

          系統自動檢測時間: {{detectedAt}}
        `,
        variables: ['metricName', 'value', 'unit', 'severity', 'explanation', 'detectedAt'],
        priority: 'high'
      },
      {
        id: 'deadline-warning',
        name: '截止日期提醒',
        type: 'email',
        subject: 'ESG 報告截止日期提醒',
        template: `
          提醒：ESG 數據提交截止日期即將到期

          距離截止日期還有 {{daysLeft}} 天。

          待提交指標：
          {{#each pendingMetrics}}
          - {{name}} (目標: {{target}})
          {{/each}}

          請儘快完成數據填報。

          截止日期: {{deadline}}
        `,
        variables: ['daysLeft', 'pendingMetrics', 'deadline'],
        priority: 'medium'
      },
      {
        id: 'milestone-celebration',
        name: '里程碑慶祝',
        type: 'email',
        subject: '🎉 ESG 里程碑達成慶祝',
        template: `
          恭喜！

          您的 ESG 表現取得了重大進步：

          🎯 達成里程碑: {{milestoneName}}
          📊 改善幅度: {{improvement}}%
          🏆 表現評級: {{rating}}

          繼續保持優秀表現！

          達成時間: {{achievedAt}}
        `,
        variables: ['milestoneName', 'improvement', 'rating', 'achievedAt'],
        priority: 'low'
      },
      {
        id: 'weekly-report',
        name: '週報',
        type: 'email',
        subject: 'ESG 系統週報',
        template: `
          善向永續 ESG 系統週報

          📈 本週數據提交: {{submissionsCount}} 項
          ✅ 審核完成: {{approvalsCount}} 項
          ⚠️ 異常檢測: {{anomaliesCount}} 項
          🎯 里程碑達成: {{milestonesCount}} 項

          詳細報告請登入系統查看。

          系統生成時間: {{generatedAt}}
        `,
        variables: ['submissionsCount', 'approvalsCount', 'anomaliesCount', 'milestonesCount', 'generatedAt'],
        priority: 'low'
      }
    ];

    for (const template of defaultTemplates) {
      this.templates.set(template.id, template);
    }
  }

  /**
   * 觸發通知
   */
  async triggerNotification(
    eventType: string,
    eventData: any,
    targets?: { users?: string[]; roles?: string[]; departments?: string[] }
  ): Promise<void> {
    try {
      // 查找匹配的規則
      const matchingRules = Array.from(this.rules.values())
        .filter(rule => rule.enabled && this.ruleMatchesEvent(rule, eventType, eventData));

      for (const rule of matchingRules) {
        await this.processRule(rule, eventData, targets);
      }
    } catch (error) {
      console.error('Notification trigger failed:', error);
      this.emit('notification-error', { eventType, eventData, error });
    }
  }

  /**
   * 排程通知
   */
  async scheduleNotifications(): Promise<void> {
    try {
      // 處理審核提醒
      await this.scheduleApprovalReminders();

      // 處理截止日期提醒
      await this.scheduleDeadlineWarnings();

      // 處理週報
      await this.scheduleWeeklyReports();

      this.emit('schedule-completed', { timestamp: new Date() });
    } catch (error) {
      console.error('Schedule notifications failed:', error);
      this.emit('schedule-error', { error });
    }
  }

  /**
   * 發送個性化通知
   */
  async sendPersonalizedNotification(
    userId: string,
    templateId: string,
    data: any,
    channels: ('email' | 'push' | 'sms' | 'in_app')[] = ['email']
  ): Promise<void> {
    try {
      const template = this.templates.get(templateId);
      const userPrefs = await this.getUserPreferences(userId);

      if (!template) {
        throw new Error(`Template ${templateId} not found`);
      }

      // 檢查用戶偏好和靜音時段
      const allowedChannels = this.filterAllowedChannels(channels, userPrefs);

      if (allowedChannels.length === 0) {
        return; // 用戶不希望接收此類通知
      }

      // 生成通知內容
      const content = this.renderTemplate(template, data);

      // 並發發送到所有允許的渠道
      const sendPromises = allowedChannels.map(channel =>
        this.sendToChannel(userId, channel, template, content, data)
      );

      await Promise.allSettled(sendPromises);

      this.emit('notification-sent', {
        userId,
        templateId,
        channels: allowedChannels,
        data
      });

    } catch (error) {
      console.error('Personalized notification failed:', error);
      this.emit('notification-error', {
        userId,
        templateId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * 批次發送通知
   */
  async sendBulkNotification(
    userIds: string[],
    templateId: string,
    data: any,
    channels: ('email' | 'push' | 'sms' | 'in_app')[] = ['email']
  ): Promise<void> {
    const promises = userIds.map(userId =>
      this.sendPersonalizedNotification(userId, templateId, data, channels)
    );

    await Promise.allSettled(promises);
  }

  // ============ 私有方法 ============

  /**
   * 檢查規則是否匹配事件
   */
  private ruleMatchesEvent(rule: NotificationRule, eventType: string, eventData: any): boolean {
    if (rule.trigger.type === 'event') {
      return rule.trigger.config.event === eventType;
    }

    // 對於排程類型的規則，由排程器負責觸發
    return false;
  }

  /**
   * 處理通知規則
   */
  private async processRule(
    rule: NotificationRule,
    eventData: any,
    customTargets?: { users?: string[]; roles?: string[]; departments?: string[] }
  ): Promise<void> {
    const targets = customTargets || rule.targets;
    const template = this.templates.get(rule.template);

    if (!template) return;

    // 查找目標用戶
    const targetUsers = await this.findTargetUsers(targets);

    // 準備通知數據
    const notificationData = await this.prepareNotificationData(rule, eventData);

    // 批量發送
    await this.sendBulkNotification(targetUsers, rule.template, notificationData, rule.channels);
  }

  /**
   * 查找目標用戶
   */
  private async findTargetUsers(targets: {
    users?: string[];
    roles?: string[];
    departments?: string[];
  }): Promise<string[]> {
    const userIds: string[] = [];

    // 直接指定的用戶
    if (targets.users) {
      userIds.push(...targets.users);
    }

    // 按角色查找
    if (targets.roles) {
      for (const role of targets.roles) {
        const { data, error } = await this.supabase
          .from('user_profiles')
          .select('id')
          .eq('role', role);

        if (!error && data) {
          userIds.push(...data.map(u => u.id));
        }
      }
    }

    // 按部門查找 (需要擴展組織架構)
    if (targets.departments) {
      // 實現部門查找邏輯
    }

    // 去重
    return [...new Set(userIds)];
  }

  /**
   * 準備通知數據
   */
  private async prepareNotificationData(rule: NotificationRule, eventData: any): Promise<any> {
    const data: any = { ...eventData };

    // 根據規則類型準備特定數據
    switch (rule.id) {
      case 'approval-reminders':
        data.pendingItems = await this.getPendingApprovals();
        data.pendingCount = data.pendingItems?.length || 0;
        break;

      case 'anomaly-alerts':
        // eventData 已經包含異常信息
        data.detectedAt = new Date().toISOString();
        break;

      case 'deadline-warnings':
        data.pendingMetrics = await this.getPendingMetrics();
        data.daysLeft = await this.calculateDaysToDeadline();
        data.deadline = await this.getNextDeadline();
        break;

      case 'milestone-celebrations':
        // eventData 已經包含里程碑信息
        data.achievedAt = new Date().toISOString();
        break;

      case 'weekly-reports':
        const stats = await this.getWeeklyStats();
        Object.assign(data, stats);
        data.generatedAt = new Date().toISOString();
        break;
    }

    return data;
  }

  /**
   * 發送到指定渠道
   */
  private async sendToChannel(
    userId: string,
    channel: 'email' | 'push' | 'sms' | 'in_app',
    template: NotificationTemplate,
    content: string,
    data: any
  ): Promise<void> {
    try {
      const logEntry: Partial<NotificationLog> = {
        userId,
        type: template.id,
        channel,
        status: 'pending',
        template: template.id,
        data,
        sentAt: new Date()
      };

      switch (channel) {
        case 'email':
          await this.sendEmail(userId, template, content, data);
          break;
        case 'push':
          await this.sendPushNotification(userId, template, content, data);
          break;
        case 'sms':
          await this.sendSMS(userId, content);
          break;
        case 'in_app':
          await this.sendInAppNotification(userId, template, data);
          break;
      }

      logEntry.status = 'sent';
      await this.logNotification(logEntry as NotificationLog);

    } catch (error) {
      await this.logNotification({
        ...logEntry,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      } as NotificationLog);
      throw error;
    }
  }

  /**
   * 發送郵件
   */
  private async sendEmail(
    userId: string,
    template: NotificationTemplate,
    content: string,
    data: any
  ): Promise<void> {
    if (!this.emailTransporter) {
      console.warn('Email transporter not available - skipping email send');
      return;
    }

    const user = await this.getUserInfo(userId);
    if (!user.email) return;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: template.subject || 'ESG 系統通知',
      html: content
    };

    await this.emailTransporter.sendMail(mailOptions);
  }

  /**
   * 發送推播通知
   */
  private async sendPushNotification(
    userId: string,
    template: NotificationTemplate,
    content: string,
    data: any
  ): Promise<void> {
    if (!webpush) {
      console.warn('Web Push not available - skipping push notification');
      return;
    }

    const subscription = await this.getUserPushSubscription(userId);
    if (!subscription) return;

    const payload = JSON.stringify({
      title: template.subject || 'ESG 通知',
      body: this.extractTextFromHtml(content),
      icon: '/icon-192x192.png',
      data
    });

    await webpush.sendNotification(subscription, payload);
  }

  /**
   * 發送簡訊
   */
  private async sendSMS(userId: string, content: string): Promise<void> {
    const user = await this.getUserInfo(userId);
    if (!user.phone) return;

    // 整合簡訊服務提供商 (如 Twilio)
    // await twilio.messages.create({ body: content, to: user.phone });
  }

  /**
   * 發送應用內通知
   */
  private async sendInAppNotification(
    userId: string,
    template: NotificationTemplate,
    data: any
  ): Promise<void> {
    // 儲存到應用內通知表
    await this.supabase
      .from('in_app_notifications')
      .insert({
        user_id: userId,
        type: template.id,
        title: template.subject,
        content: data,
        read: false,
        created_at: new Date().toISOString()
      });
  }

  /**
   * 獲取用戶偏好
   */
  private async getUserPreferences(userId: string): Promise<UserNotificationPreferences> {
    // 預設偏好設置
    return {
      userId,
      email: true,
      push: true,
      sms: false,
      inApp: true,
      quietHours: { start: '22:00', end: '08:00' },
      frequency: 'immediate',
      categories: {
        approvals: true,
        anomalies: true,
        deadlines: true,
        reports: true,
        milestones: true
      }
    };
  }

  /**
   * 篩選允許的渠道
   */
  private filterAllowedChannels(
    requestedChannels: ('email' | 'push' | 'sms' | 'in_app')[],
    preferences: UserNotificationPreferences
  ): ('email' | 'push' | 'sms' | 'in_app')[] {
    const allowed: ('email' | 'push' | 'sms' | 'in_app')[] = [];

    if (requestedChannels.includes('email') && preferences.email) allowed.push('email');
    if (requestedChannels.includes('push') && preferences.push) allowed.push('push');
    if (requestedChannels.includes('sms') && preferences.sms) allowed.push('sms');
    if (requestedChannels.includes('in_app') && preferences.inApp) allowed.push('in_app');

    // 檢查靜音時段
    if (this.isQuietHours(preferences.quietHours)) {
      return allowed.filter(channel => channel === 'in_app'); // 只允許應用內通知
    }

    return allowed;
  }

  /**
   * 檢查是否為靜音時段
   */
  private isQuietHours(quietHours: { start: string; end: string }): boolean {
    const now = new Date();
    const current = now.getHours() * 100 + now.getMinutes();

    const start = this.parseTime(quietHours.start);
    const end = this.parseTime(quietHours.end);

    if (start < end) {
      return current >= start && current <= end;
    } else {
      // 跨天靜音時段
      return current >= start || current <= end;
    }
  }

  /**
   * 解析時間字符串
   */
  private parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 100 + minutes;
  }

  /**
   * 渲染模板
   */
  private renderTemplate(template: NotificationTemplate, data: any): string {
    let content = template.template;

    // 簡單的變數替換
    for (const variable of template.variables) {
      const regex = new RegExp(`{{${variable}}}`, 'g');
      content = content.replace(regex, data[variable] || '');
    }

    // 處理條件渲染 (簡化版)
    content = content.replace(/{{#each (\w+)}}([\s\S]*?){{\/each}}/g, (match, arrayName, template) => {
      const array = data[arrayName] || [];
      return array.map((item: any) => {
        let itemContent = template;
        Object.keys(item).forEach(key => {
          itemContent = itemContent.replace(new RegExp(`{{${key}}}`, 'g'), item[key] || '');
        });
        return itemContent;
      }).join('');
    });

    return content;
  }

  /**
   * 提取 HTML 中的純文字
   */
  private extractTextFromHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  }

  /**
   * 記錄通知日誌
   */
  private async logNotification(log: NotificationLog): Promise<void> {
    try {
      await this.supabase
        .from('notification_logs')
        .insert(log);
    } catch (error) {
      // 日誌記錄失敗不應該影響主要功能
      console.warn('Failed to log notification:', error);
    }
  }

  // ============ 排程任務 ============

  /**
   * 排程審核提醒
   */
  private async scheduleApprovalReminders(): Promise<void> {
    const pendingApprovals = await this.getPendingApprovalsByUser();

    for (const [userId, approvals] of Object.entries(pendingApprovals)) {
      if (approvals.length > 0) {
        await this.sendPersonalizedNotification(userId, 'approval-reminder', {
          userName: await this.getUserName(userId),
          pendingCount: approvals.length,
          pendingItems: approvals
        }, ['email', 'push']);
      }
    }
  }

  /**
   * 排程截止日期提醒
   */
  private async scheduleDeadlineWarnings(): Promise<void> {
    const usersWithDeadlines = await this.getUsersWithUpcomingDeadlines();

    for (const user of usersWithDeadlines) {
      await this.sendPersonalizedNotification(user.id, 'deadline-warning', {
        daysLeft: user.daysLeft,
        pendingMetrics: user.pendingMetrics,
        deadline: user.deadline
      }, ['email']);
    }
  }

  /**
   * 排程週報
   */
  private async scheduleWeeklyReports(): Promise<void> {
    const adminUsers = await this.getAdminUsers();
    const weeklyStats = await this.getWeeklyStats();

    for (const admin of adminUsers) {
      await this.sendPersonalizedNotification(admin.id, 'weekly-report', {
        ...weeklyStats,
        generatedAt: new Date().toISOString()
      }, ['email']);
    }
  }

  // ============ 資料查詢方法 ============

  private async getPendingApprovals(): Promise<any[]> {
    // 實現查詢待審核項目的邏輯
    return [];
  }

  private async getPendingApprovalsByUser(): Promise<{ [userId: string]: any[] }> {
    // 實現按用戶查詢待審核項目的邏輯
    return {};
  }

  private async getPendingMetrics(): Promise<any[]> {
    // 實現查詢待提交指標的邏輯
    return [];
  }

  private async calculateDaysToDeadline(): Promise<number> {
    // 實現計算距離截止日期天數的邏輯
    return 7;
  }

  private async getNextDeadline(): Promise<string> {
    // 實現獲取下一個截止日期的邏輯
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  }

  private async getWeeklyStats(): Promise<any> {
    // 實現獲取週統計數據的邏輯
    return {
      submissionsCount: 0,
      approvalsCount: 0,
      anomaliesCount: 0,
      milestonesCount: 0
    };
  }

  private async getUsersWithUpcomingDeadlines(): Promise<any[]> {
    // 實現查找有臨近截止日期的用戶
    return [];
  }

  private async getAdminUsers(): Promise<any[]> {
    // 實現獲取管理員用戶列表
    return [];
  }

  private async getUserInfo(userId: string): Promise<any> {
    // 實現獲取用戶信息
    return { email: '', phone: '' };
  }

  private async getUserName(userId: string): Promise<string> {
    // 實現獲取用戶名稱
    return '用戶';
  }

  private async getUserPushSubscription(userId: string): Promise<any> {
    // 實現獲取用戶推播訂閱信息
    return null;
  }
}

// 導出單例實例
export const smartNotifications = new SmartNotificationService(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);