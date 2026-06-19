/**
 * Stakeholder Interaction Service (M4: Stakeholder Engagement)
 *
 * Provides complete stakeholder management functions:
 * - Supplier ESG Management Platform
 * - Investor Relations Platform
 * - Employee Engagement Platform
 * - Public Communication Platform
 */

import { SupplierPlatform } from './supplierPlatform.js';
import { InvestorPlatform } from './investorPlatform.js';
import { EmployeePlatform } from './employeePlatform.js';
import { PublicPlatform } from './publicPlatform.js';
import { omniLogger, LogCategory } from './omniLogger.js';

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
   * Supplier Platform Management
   */
  async manageSupplier(supplierId: string, action: string, data?: any): Promise<any> {
    if (!this.config.enableSupplierPlatform) {
      throw new Error('Supplier platform not enabled');
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
        throw new Error(`Unsupported supplier operation: ${action}`);
    }
  }

  /**
   * Investor Platform Management
   */
  async manageInvestor(investorId: string, action: string, data?: any): Promise<any> {
    if (!this.config.enableInvestorPlatform) {
      throw new Error('Investor platform not enabled');
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
        throw new Error(`Unsupported investor operation: ${action}`);
    }
  }

  /**
   * Employee Platform Management
   */
  async manageEmployee(employeeId: string, action: string, data?: any): Promise<any> {
    if (!this.config.enableEmployeePlatform) {
      throw new Error('Employee platform not enabled');
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
        throw new Error(`Unsupported employee operation: ${action}`);
    }
  }

  /**
   * Public Platform Management
   */
  async managePublic(action: string, data?: any): Promise<any> {
    if (!this.config.enablePublicPlatform) {
      throw new Error('Public platform not enabled');
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
        throw new Error(`Unsupported public operation: ${action}`);
    }
  }

  /**
   * Unified Communication Management
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
        // Send messages via channels
        await this.sendViaChannel(channel, stakeholderId, subject, content, options);

        // Record communication history
        const record: CommunicationRecord = {
          id: this.generateCommunicationId(),
          stakeholderType,
          stakeholderId,
          channel,
          subject,
          content,
          timestamp: new Date().toISOString(),
          status: 'sent',
        };

        this.communicationHistory.push(record);
        sentIds.push(stakeholderId);
      } catch (error) {
        omniLogger.error(LogCategory.LEGION, `Failed to send message to ${stakeholderId}`, {
          error,
        });
      }
    }

    return sentIds;
  }

  /**
   * Get communication history
   */
  getCommunicationHistory(filters?: {
    stakeholderType?: string;
    stakeholderId?: string;
    channel?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): CommunicationRecord[] {
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
        const start = filters.startDate;
        filtered = filtered.filter(r => r.timestamp >= start);
      }
      if (filters.endDate) {
        const end = filters.endDate;
        filtered = filtered.filter(r => r.timestamp <= end);
      }
      if (filters.status) {
        filtered = filtered.filter(r => r.status === filters.status);
      }
    }

    return filtered.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Survey Management
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

    // Create survey based on target audience
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
   * Get Stakeholder Metrics Overview
   */
  async getStakeholderMetrics(): Promise<StakeholderMetrics> {
    const metrics: StakeholderMetrics = {
      supplier: {
        totalSuppliers: 0,
        activeAssessments: 0,
        averageScore: 0,
        highRiskCount: 0,
        improvementRate: 0,
      },
      investor: {
        totalInvestors: 0,
        activeEngagements: 0,
        satisfactionScore: 0,
        responseTime: 0,
        reportDownloads: 0,
      },
      employee: {
        totalEmployees: 0,
        participationRate: 0,
        satisfactionScore: 0,
        suggestionCount: 0,
        trainingCompletion: 0,
      },
      public: {
        websiteVisitors: 0,
        reportViews: 0,
        satisfactionScore: 0,
        engagementRate: 0,
        complaintResolution: 0,
      },
    };

    // Get metrics from each platform in parallel
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
   * Crisis Communication Management
   */
  async initiateCrisisCommunication(crisisDetails: {
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    affectedStakeholders: string[];
    recommendedActions: string[];
  }): Promise<{
    communicationPlan: any;
    sentCommunications: string[];
    monitoringPlan: any;
  }> {
    // Create crisis communication plan
    const communicationPlan = this.createCrisisCommunicationPlan(crisisDetails);

    // Send emergency notifications
    const sentCommunications = await this.sendCrisisNotifications(crisisDetails, communicationPlan);

    // Establish monitoring mechanism
    const monitoringPlan = this.createMonitoringPlan(crisisDetails);

    return {
      communicationPlan,
      sentCommunications,
      monitoringPlan,
    };
  }

  /**
   * Configuration Update
   */
  updateConfig(newConfig: Partial<StakeholderConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Health Check
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
      public: await this.publicPlatform.isHealthy(),
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
      lastActivity: new Date().toISOString(),
    };
  }

  private async sendViaChannel(
    channel: string,
    stakeholderId: string,
    subject: string,
    content: string,
    options?: any
  ): Promise<void> {
    // Implement different sending logic based on channels
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
        throw new Error(`Unsupported communication channel: ${channel}`);
    }
  }

  private async sendEmail(
    to: string,
    subject: string,
    content: string,
    options?: any
  ): Promise<void> {
    // Implement email sending logic
    omniLogger.info(LogCategory.LEGION, `Sending email to ${to}: ${subject}`);
  }

  private async sendSMS(to: string, content: string): Promise<void> {
    // Implement SMS sending logic
    omniLogger.info(LogCategory.LEGION, `Sending SMS to ${to}: ${content}`);
  }

  private async sendPlatformNotification(
    to: string,
    title: string,
    content: string
  ): Promise<void> {
    // Implement platform notification sending logic
    omniLogger.info(LogCategory.LEGION, `Sending platform notification to ${to}: ${title}`);
  }

  private async sendLetter(to: string, subject: string, content: string): Promise<void> {
    // Implement letter sending logic
    omniLogger.info(LogCategory.LEGION, `Sending letter to ${to}: ${subject}`);
  }

  private generateCommunicationId(): string {
    return `COMM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSurveyId(): string {
    return `SURVEY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createCrisisCommunicationPlan(crisisDetails: any): any {
    // Implement crisis communication plan creation logic
    return {
      immediate_actions: ['Send emergency notifications', 'Establish crisis hotline'],
      stakeholder_groups: ['Employees', 'Customers', 'Suppliers', 'Investors', 'Government'],
      communication_channels: ['email', 'sms', 'press release', 'website announcement'],
      key_messages: [
        'Fact explanation',
        'Impact assessment',
        'Handling measures',
        'Preventive measures',
      ],
    };
  }

  private async sendCrisisNotifications(crisisDetails: any, plan: any): Promise<string[]> {
    // Implement crisis notification sending logic
    return [];
  }

  private createMonitoringPlan(crisisDetails: any): any {
    // Implement monitoring plan creation logic
    return {
      monitoring_items: ['Media coverage', 'Social media volume', 'Stakeholder reaction'],
      frequency: 'Hourly',
      responsible_team: 'Crisis Management Team',
      reporting_schedule: 'Report to senior management every 4 hours',
    };
  }
}

// Export default instance
export const stakeholderService = new StakeholderService({
  enableSupplierPlatform: true,
  enableInvestorPlatform: true,
  enableEmployeePlatform: true,
  enablePublicPlatform: true,
  communicationChannels: ['email', 'platform_notification', 'sms'],
  surveyFrequency: 'quarterly',
  reportingLanguage: 'zh-TW',
});
