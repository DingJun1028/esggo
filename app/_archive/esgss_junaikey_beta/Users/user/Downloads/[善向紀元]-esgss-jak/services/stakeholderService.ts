/**
 * Stakeholder互動服務 (M4: Stakeholder Engagement)
 *
 * 提供完整的利害關係人管理功能：
 * - 供應商ESG管理平台
 * - 投資人關係平台
 * - 員工參與平台
 * - 公眾溝通平台
 */

import { SupplierPlatform } from './supplierPlatform';
import { InvestorPlatform } from './investorPlatform';
import { EmployeePlatform } from './employeePlatform';
import { PublicPlatform } from './publicPlatform';

export interface StakeholderConfig {
  enableSupplierPlatform: boolean;
  enableInvestorPlatform: boolean;
  enableEmployeePlatform: boolean;
  enablePublicPlatform: boolean;
  communicationChannels: string[];
  surveyFrequency: 'monthly' | 'quarterly' | 'annually';
  reportingLanguage: 'zh-TW' | 'en-US' | 'zh-CN';
}

export interface StakeholderMetrics {
  supplier: {
    totalSuppliers: number;
    activeAssessments: number;
    averageScore: number;
    highRiskCount: number;
    improvementRate: number;
  };
  investor: {
    totalInvestors: number;
    activeEngagements: number;
    satisfactionScore: number;
    responseTime: number;
    reportDownloads: number;
  };
  employee: {
    totalEmployees: number;
    participationRate: number;
    satisfactionScore: number;
    suggestionCount: number;
    trainingCompletion: number;
  };
  public: {
    websiteVisitors: number;
    reportViews: number;
    satisfactionScore: number;
    engagementRate: number;
    complaintResolution: number;
  };
}

export interface CommunicationRecord {
  id: string;
  stakeholderType: 'supplier' | 'investor' | 'employee' | 'public';
  stakeholderId: string;
  channel: string;
  subject: string;
  content: string;
  timestamp: string;
  response?: {
    content: string;
    timestamp: string;
    satisfaction?: number;
  };
  status: 'sent' | 'delivered' | 'read' | 'responded';
}

export class StakeholderService {
  private config: StakeholderConfig;
  private supplierPlatform: SupplierPlatform;
  private investorPlatform: InvestorPlatform;
  private employeePlatform: EmployeePlatform;
  private publicPlatform: PublicPlatform;
  private communicationHistory: CommunicationRecord[] = [];

  constructor(config: StakeholderConfig) {
    this.config = config;
    this.supplierPlatform = new SupplierPlatform();
    this.investorPlatform = new InvestorPlatform();
    this.employeePlatform = new EmployeePlatform();
    this.publicPlatform = new PublicPlatform();
  }

  /**
   * 供應商平台管理
   */
  async manageSupplier(supplierId: string, action: string, data?: any): Promise<any> {
    if (!this.config.enableSupplierPlatform) {
      throw new Error('供應商平台未啟用');
    }

    switch (action) {
      case 'assess':
        return await this.supplierPlatform.createAssessment(supplierId, data);
      case 'get_assessment':
        return await this.supplierPlatform.getAssessment(supplierId);
      case 'update_improvement_plan':
        return await this.supplierPlatform.updateImprovementPlan(supplierId, data);
      case 'get_metrics':
        return await this.supplierPlatform.getMetrics();
      default:
        throw new Error(`不支援的供應商操作: ${action}`);
    }
  }

  /**
   * 投資人平台管理
   */
  async manageInvestor(investorId: string, action: string, data?: any): Promise<any> {
    if (!this.config.enableInvestorPlatform) {
      throw new Error('投資人平台未啟用');
    }

    switch (action) {
      case 'get_dashboard':
        return await this.investorPlatform.getDashboard(investorId);
      case 'submit_question':
        return await this.investorPlatform.submitQuestion(investorId, data);
      case 'download_report':
        return await this.investorPlatform.downloadReport(investorId, data);
      case 'get_communication_history':
        return await this.investorPlatform.getCommunicationHistory(investorId);
      default:
        throw new Error(`不支援的投資人操作: ${action}`);
    }
  }

  /**
   * 員工平台管理
   */
  async manageEmployee(employeeId: string, action: string, data?: any): Promise<any> {
    if (!this.config.enableEmployeePlatform) {
      throw new Error('員工平台未啟用');
    }

    switch (action) {
      case 'get_dashboard':
        return await this.employeePlatform.getDashboard(employeeId);
      case 'submit_suggestion':
        return await this.employeePlatform.submitSuggestion(employeeId, data);
      case 'join_volunteer':
        return await this.employeePlatform.joinVolunteerProgram(employeeId, data);
      case 'complete_training':
        return await this.employeePlatform.completeTraining(employeeId, data);
      default:
        throw new Error(`不支援的員工操作: ${action}`);
    }
  }

  /**
   * 公眾平台管理
   */
  async managePublic(action: string, data?: any): Promise<any> {
    if (!this.config.enablePublicPlatform) {
      throw new Error('公眾平台未啟用');
    }

    switch (action) {
      case 'get_reports':
        return await this.publicPlatform.getPublicReports();
      case 'submit_complaint':
        return await this.publicPlatform.submitComplaint(data);
      case 'get_environmental_data':
        return await this.publicPlatform.getEnvironmentalData();
      case 'get_metrics':
        return await this.publicPlatform.getEngagementMetrics();
      default:
        throw new Error(`不支援的公眾操作: ${action}`);
    }
  }

  /**
   * 統一溝通管理
   */
  async sendCommunication(
    stakeholderType: 'supplier' | 'investor' | 'employee' | 'public',
    stakeholderIds: string[],
    channel: string,
    subject: string,
    content: string,
    options?: {
      priority?: 'low' | 'medium' | 'high';
      scheduledTime?: string;
      template?: string;
    }
  ): Promise<string[]> {
    const sentIds: string[] = [];

    for (const stakeholderId of stakeholderIds) {
      try {
        // 根據渠道發送訊息
        await this.sendViaChannel(channel, stakeholderId, subject, content, options);

        // 記錄溝通歷史
        const record: CommunicationRecord = {
          id: this.generateCommunicationId(),
          stakeholderType,
          stakeholderId,
          channel,
          subject,
          content,
          timestamp: new Date().toISOString(),
          status: 'sent'
        };

        this.communicationHistory.push(record);
        sentIds.push(stakeholderId);
      } catch (error) {
        console.error(`發送訊息失敗 ${stakeholderId}:`, error);
      }
    }

    return sentIds;
  }

  /**
   * 獲取溝通歷史
   */
  getCommunicationHistory(
    filters?: {
      stakeholderType?: string;
      stakeholderId?: string;
      channel?: string;
      startDate?: string;
      endDate?: string;
      status?: string;
    }
  ): CommunicationRecord[] {
    let filtered = [...this.communicationHistory];

    if (filters) {
      if (filters.stakeholderType) {
        filtered = filtered.filter(r => r.stakeholderType === filters.stakeholderType);
      }
      if (filters.stakeholderId) {
        filtered = filtered.filter(r => r.stakeholderId === filters.stakeholderId);
      }
      if (filters.channel) {
        filtered = filtered.filter(r => r.channel === filters.channel);
      }
      if (filters.startDate) {
        filtered = filtered.filter(r => r.timestamp >= filters.startDate);
      }
      if (filters.endDate) {
        filtered = filtered.filter(r => r.timestamp <= filters.endDate);
      }
      if (filters.status) {
        filtered = filtered.filter(r => r.status === filters.status);
      }
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * 問卷調查管理
   */
  async createSurvey(
    targetAudience: 'supplier' | 'investor' | 'employee' | 'public',
    surveyData: {
      title: string;
      description: string;
      questions: Array<{
        id: string;
        type: 'multiple_choice' | 'text' | 'rating' | 'yes_no';
        question: string;
        options?: string[];
        required: boolean;
      }>;
      targetIds?: string[];
      endDate: string;
    }
  ): Promise<string> {
    const surveyId = this.generateSurveyId();

    // 根據目標受眾建立問卷
    switch (targetAudience) {
      case 'supplier':
        if (this.config.enableSupplierPlatform) {
          await this.supplierPlatform.createSurvey(surveyId, surveyData);
        }
        break;
      case 'investor':
        if (this.config.enableInvestorPlatform) {
          await this.investorPlatform.createSurvey(surveyId, surveyData);
        }
        break;
      case 'employee':
        if (this.config.enableEmployeePlatform) {
          await this.employeePlatform.createSurvey(surveyId, surveyData);
        }
        break;
      case 'public':
        if (this.config.enablePublicPlatform) {
          await this.publicPlatform.createSurvey(surveyId, surveyData);
        }
        break;
    }

    return surveyId;
  }

  /**
   * 獲取Stakeholder指標總覽
   */
  async getStakeholderMetrics(): Promise<StakeholderMetrics> {
    const metrics: StakeholderMetrics = {
      supplier: { totalSuppliers: 0, activeAssessments: 0, averageScore: 0, highRiskCount: 0, improvementRate: 0 },
      investor: { totalInvestors: 0, activeEngagements: 0, satisfactionScore: 0, responseTime: 0, reportDownloads: 0 },
      employee: { totalEmployees: 0, participationRate: 0, satisfactionScore: 0, suggestionCount: 0, trainingCompletion: 0 },
      public: { websiteVisitors: 0, reportViews: 0, satisfactionScore: 0, engagementRate: 0, complaintResolution: 0 }
    };

    // 並行獲取各平台指標
    const promises = [];

    if (this.config.enableSupplierPlatform) {
      promises.push(
        this.supplierPlatform.getMetrics().then(data => {
          metrics.supplier = { ...metrics.supplier, ...data };
        })
      );
    }

    if (this.config.enableInvestorPlatform) {
      promises.push(
        this.investorPlatform.getMetrics().then(data => {
          metrics.investor = { ...metrics.investor, ...data };
        })
      );
    }

    if (this.config.enableEmployeePlatform) {
      promises.push(
        this.employeePlatform.getMetrics().then(data => {
          metrics.employee = { ...metrics.employee, ...data };
        })
      );
    }

    if (this.config.enablePublicPlatform) {
      promises.push(
        this.publicPlatform.getMetrics().then(data => {
          metrics.public = { ...metrics.public, ...data };
        })
      );
    }

    await Promise.all(promises);

    return metrics;
  }

  /**
   * 危機溝通管理
   */
  async initiateCrisisCommunication(
    crisisDetails: {
      title: string;
      description: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      affectedStakeholders: string[];
      recommendedActions: string[];
    }
  ): Promise<{
    communicationPlan: any;
    sentCommunications: string[];
    monitoringPlan: any;
  }> {
    // 建立危機溝通計畫
    const communicationPlan = this.createCrisisCommunicationPlan(crisisDetails);

    // 發送緊急通知
    const sentCommunications = await this.sendCrisisNotifications(crisisDetails, communicationPlan);

    // 建立監控機制
    const monitoringPlan = this.createMonitoringPlan(crisisDetails);

    return {
      communicationPlan,
      sentCommunications,
      monitoringPlan
    };
  }

  /**
   * 配置更新
   */
  updateConfig(newConfig: Partial<StakeholderConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * 健康檢查
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    platforms: Record<string, boolean>;
    lastActivity: string;
  }> {
    const platforms = {
      supplier: await this.supplierPlatform.isHealthy(),
      investor: await this.investorPlatform.isHealthy(),
      employee: await this.employeePlatform.isHealthy(),
      public: await this.publicPlatform.isHealthy()
    };

    const healthyCount = Object.values(platforms).filter(Boolean).length;
    const totalCount = Object.keys(platforms).length;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyCount === totalCount) {
      status = 'healthy';
    } else if (healthyCount >= totalCount * 0.5) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      platforms,
      lastActivity: new Date().toISOString()
    };
  }

  private async sendViaChannel(
    channel: string,
    stakeholderId: string,
    subject: string,
    content: string,
    options?: any
  ): Promise<void> {
    // 根據渠道實現不同的發送邏輯
    switch (channel) {
      case 'email':
        await this.sendEmail(stakeholderId, subject, content, options);
        break;
      case 'sms':
        await this.sendSMS(stakeholderId, content);
        break;
      case 'platform_notification':
        await this.sendPlatformNotification(stakeholderId, subject, content);
        break;
      case 'letter':
        await this.sendLetter(stakeholderId, subject, content);
        break;
      default:
        throw new Error(`不支援的溝通渠道: ${channel}`);
    }
  }

  private async sendEmail(to: string, subject: string, content: string, options?: any): Promise<void> {
    // 實現email發送邏輯
    console.log(`發送Email到 ${to}: ${subject}`);
  }

  private async sendSMS(to: string, content: string): Promise<void> {
    // 實現SMS發送邏輯
    console.log(`發送SMS到 ${to}: ${content}`);
  }

  private async sendPlatformNotification(to: string, title: string, content: string): Promise<void> {
    // 實現平台通知發送邏輯
    console.log(`發送平台通知到 ${to}: ${title}`);
  }

  private async sendLetter(to: string, subject: string, content: string): Promise<void> {
    // 實現信件發送邏輯
    console.log(`發送信件到 ${to}: ${subject}`);
  }

  private generateCommunicationId(): string {
    return `COMM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSurveyId(): string {
    return `SURVEY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createCrisisCommunicationPlan(crisisDetails: any): any {
    // 實現危機溝通計畫建立邏輯
    return {
      immediate_actions: ['發送緊急通知', '設立危機 hotline'],
      stakeholder_groups: ['員工', '客戶', '供應商', '投資人', '政府'],
      communication_channels: ['email', 'sms', '新聞稿', '網站公告'],
      key_messages: ['事實說明', '影響評估', '處理措施', '預防措施']
    };
  }

  private async sendCrisisNotifications(crisisDetails: any, plan: any): Promise<string[]> {
    // 實現危機通知發送邏輯
    return [];
  }

  private createMonitoringPlan(crisisDetails: any): any {
    // 實現監控計畫建立邏輯
    return {
      monitoring_items: ['媒體報導', '社交媒體聲量', '利害關係人反應'],
      frequency: '每小時',
      responsible_team: '危機管理小組',
      reporting_schedule: '每4小時向高層報告'
    };
  }
}

// 導出預設實例
export const stakeholderService = new StakeholderService({
  enableSupplierPlatform: true,
  enableInvestorPlatform: true,
  enableEmployeePlatform: true,
  enablePublicPlatform: true,
  communicationChannels: ['email', 'platform_notification', 'sms'],
  surveyFrequency: 'quarterly',
  reportingLanguage: 'zh-TW'
});