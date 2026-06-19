/**
 * 治理與合規服務 (M6: Governance & Compliance)
 *
 * 提供完整的法規遵循和治理功能：
 * - 法規管理系統
 * - 稽核與驗證
 * - 風險管理系統
 * - 董事會報告
 */

export interface Regulation {
  id: string;
  name: string;
  category: 'environmental' | 'social' | 'governance';
  jurisdiction: string; // 'Taiwan', 'EU', 'US', 'China', etc.
  type: 'law' | 'regulation' | 'standard' | 'guideline';
  effectiveDate: string;
  description: string;
  requirements: Array<{
    id: string;
    description: string;
    applicability: string; // 適用對象
    deadline?: string;
    penalty?: {
      type: 'fine' | 'warning' | 'suspension' | 'criminal';
      amount?: string;
      description: string;
    };
  }>;
  reportingRequirements?: Array<{
    frequency: 'annual' | 'semi-annual' | 'quarterly' | 'monthly';
    deadline: string;
    format: string;
    authority: string;
  }>;
  status: 'active' | 'pending' | 'superseded';
  lastUpdated: string;
  impact: {
    level: 'low' | 'medium' | 'high' | 'critical';
    affectedAreas: string[];
    estimatedCost: number;
  };
}

export interface ComplianceStatus {
  regulationId: string;
  companyId: string;
  status: 'compliant' | 'non_compliant' | 'partially_compliant' | 'not_applicable';
  assessmentDate: string;
  assessedBy: string;
  findings: Array<{
    requirementId: string;
    status: 'compliant' | 'non_compliant' | 'not_assessed';
    evidence: string;
    notes?: string;
  }>;
  remediationPlan?: {
    actions: Array<{
      description: string;
      owner: string;
      deadline: string;
      status: 'pending' | 'in_progress' | 'completed';
    }>;
    estimatedCost: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
  };
  nextReviewDate: string;
}

export interface AuditRecord {
  id: string;
  type: 'internal' | 'external' | 'regulatory';
  scope: string;
  auditor: string;
  auditFirm?: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  findings: Array<{
    category: 'major' | 'minor' | 'observation';
    description: string;
    requirement: string;
    evidence: string;
    recommendation: string;
  }>;
  overallRating: 'excellent' | 'good' | 'satisfactory' | 'unsatisfactory';
  correctiveActions: Array<{
    findingId: string;
    action: string;
    owner: string;
    deadline: string;
    status: 'open' | 'in_progress' | 'closed';
    verificationDate?: string;
  }>;
  report: {
    executiveSummary: string;
    detailedFindings: string;
    recommendations: string;
    attachments: string[];
  };
}

export interface BoardReport {
  id: string;
  period: string; // 'Q1', 'Q2', 'Q3', 'Q4', 'annual'
  type: 'regular' | 'special' | 'crisis';
  title: string;
  executiveSummary: string;
  sections: Array<{
    title: string;
    content: string;
    metrics?: Array<{
      name: string;
      value: number;
      target: number;
      status: 'green' | 'yellow' | 'red';
    }>;
    charts?: string[]; // 圖表URL或ID
  }>;
  keyDecisions: Array<{
    decision: string;
    rationale: string;
    impact: string;
  }>;
  risksAndOpportunities: {
    risks: Array<{
      risk: string;
      impact: string;
      mitigation: string;
      status: 'managed' | 'monitoring' | 'critical';
    }>;
    opportunities: Array<{
      opportunity: string;
      potential: string;
      actionPlan: string;
    }>;
  };
  nextSteps: string[];
  preparedBy: string;
  reviewedBy: string;
  approvedBy: string;
  presentationDate: string;
  attachments: string[];
  status: 'draft' | 'reviewed' | 'approved' | 'presented';
}

export class ComplianceService {
  private regulations: Map<string, Regulation> = new Map();
  private complianceStatuses: Map<string, ComplianceStatus> = new Map();
  private auditRecords: Map<string, AuditRecord> = new Map();
  private boardReports: Map<string, BoardReport> = new Map();

  constructor() {
    this.initializeRegulations();
  }

  /**
   * 法規管理
   */
  async addRegulation(regulationData: Omit<Regulation, 'id' | 'lastUpdated'>): Promise<string> {
    const id = `REG_${Date.now()}`;

    const regulation: Regulation = {
      id,
      ...regulationData,
      lastUpdated: new Date().toISOString()
    };

    this.regulations.set(id, regulation);
    return id;
  }

  async updateRegulation(regulationId: string, updates: Partial<Regulation>): Promise<void> {
    const regulation = this.regulations.get(regulationId);
    if (!regulation) throw new Error('法規不存在');

    Object.assign(regulation, updates, { lastUpdated: new Date().toISOString() });
  }

  getRegulations(filters?: {
    category?: string;
    jurisdiction?: string;
    status?: string;
  }): Regulation[] {
    let regulations = Array.from(this.regulations.values());

    if (filters) {
      if (filters.category) {
        regulations = regulations.filter(r => r.category === filters.category);
      }
      if (filters.jurisdiction) {
        regulations = regulations.filter(r => r.jurisdiction === filters.jurisdiction);
      }
      if (filters.status) {
        regulations = regulations.filter(r => r.status === filters.status);
      }
    }

    return regulations.sort((a, b) =>
      new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime()
    );
  }

  getUpcomingDeadlines(days: number = 30): Array<{
    regulation: Regulation;
    requirement: Regulation['requirements'][0];
    daysUntilDeadline: number;
  }> {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const upcoming: Array<{
      regulation: Regulation;
      requirement: Regulation['requirements'][0];
      daysUntilDeadline: number;
    }> = [];

    for (const regulation of this.regulations.values()) {
      if (regulation.status !== 'active') continue;

      for (const requirement of regulation.requirements) {
        if (requirement.deadline) {
          const deadline = new Date(requirement.deadline);
          if (deadline > now && deadline <= futureDate) {
            const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
            upcoming.push({
              regulation,
              requirement,
              daysUntilDeadline: daysUntil
            });
          }
        }
      }
    }

    return upcoming.sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline);
  }

  /**
   * 合規狀態評估
   */
  async assessCompliance(
    regulationId: string,
    companyId: string,
    assessmentData: {
      assessedBy: string;
      findings: ComplianceStatus['findings'];
    }
  ): Promise<string> {
    const regulation = this.regulations.get(regulationId);
    if (!regulation) throw new Error('法規不存在');

    const complianceId = `COMP_${regulationId}_${companyId}_${Date.now()}`;

    // 計算整體合規狀態
    const compliantCount = assessmentData.findings.filter(f => f.status === 'compliant').length;
    const totalCount = assessmentData.findings.length;
    const complianceRate = compliantCount / totalCount;

    let status: ComplianceStatus['status'];
    if (complianceRate === 1) status = 'compliant';
    else if (complianceRate >= 0.8) status = 'partially_compliant';
    else if (complianceRate > 0) status = 'non_compliant';
    else status = 'not_applicable';

    // 生成補救計劃
    const remediationPlan = status !== 'compliant' ?
      this.generateRemediationPlan(assessmentData.findings, regulation) : undefined;

    const complianceStatus: ComplianceStatus = {
      regulationId,
      companyId,
      status,
      assessmentDate: new Date().toISOString(),
      assessedBy: assessmentData.assessedBy,
      findings: assessmentData.findings,
      remediationPlan,
      nextReviewDate: this.calculateNextReviewDate(regulation)
    };

    this.complianceStatuses.set(complianceId, complianceStatus);
    return complianceId;
  }

  getComplianceStatuses(companyId?: string): ComplianceStatus[] {
    const statuses = Array.from(this.complianceStatuses.values());
    if (companyId) {
      return statuses.filter(s => s.companyId === companyId);
    }
    return statuses;
  }

  getComplianceDashboard(companyId: string): {
    overallStatus: 'compliant' | 'partially_compliant' | 'non_compliant';
    complianceRate: number;
    criticalIssues: number;
    upcomingDeadlines: number;
    regulationsByCategory: Record<string, number>;
  } {
    const statuses = this.getComplianceStatuses(companyId);
    const upcoming = this.getUpcomingDeadlines(30);

    const totalRegulations = statuses.length;
    const compliantCount = statuses.filter(s => s.status === 'compliant').length;
    const complianceRate = totalRegulations > 0 ? compliantCount / totalRegulations : 0;

    let overallStatus: 'compliant' | 'partially_compliant' | 'non_compliant';
    if (complianceRate >= 0.9) overallStatus = 'compliant';
    else if (complianceRate >= 0.7) overallStatus = 'partially_compliant';
    else overallStatus = 'non_compliant';

    const criticalIssues = statuses.filter(s =>
      s.status === 'non_compliant' &&
      s.remediationPlan?.priority === 'critical'
    ).length;

    const regulationsByCategory: Record<string, number> = {};
    for (const status of statuses) {
      const regulation = this.regulations.get(status.regulationId);
      if (regulation) {
        regulationsByCategory[regulation.category] =
          (regulationsByCategory[regulation.category] || 0) + 1;
      }
    }

    return {
      overallStatus,
      complianceRate,
      criticalIssues,
      upcomingDeadlines: upcoming.length,
      regulationsByCategory
    };
  }

  /**
   * 稽核管理
   */
  async createAudit(auditData: Omit<AuditRecord, 'id'>): Promise<string> {
    const id = `AUDIT_${Date.now()}`;

    const audit: AuditRecord = {
      id,
      ...auditData
    };

    this.auditRecords.set(id, audit);
    return id;
  }

  async updateAuditFindings(
    auditId: string,
    findings: AuditRecord['findings'],
    correctiveActions: AuditRecord['correctiveActions']
  ): Promise<void> {
    const audit = this.auditRecords.get(auditId);
    if (!audit) throw new Error('稽核記錄不存在');

    audit.findings = findings;
    audit.correctiveActions = correctiveActions;

    // 自動評估整體評分
    audit.overallRating = this.assessAuditRating(findings);
  }

  getAudits(filters?: {
    type?: string;
    status?: string;
    auditor?: string;
  }): AuditRecord[] {
    let audits = Array.from(this.auditRecords.values());

    if (filters) {
      if (filters.type) {
        audits = audits.filter(a => a.type === filters.type);
      }
      if (filters.status) {
        audits = audits.filter(a => a.status === filters.status);
      }
      if (filters.auditor) {
        audits = audits.filter(a => a.auditor === filters.auditor);
      }
    }

    return audits.sort((a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  }

  getAuditEffectiveness(): {
    averageRating: number;
    findingsClosureRate: number;
    correctiveActionCompletionRate: number;
    trends: Array<{ period: string; rating: number }>;
  } {
    const audits = Array.from(this.auditRecords.values())
      .filter(a => a.status === 'completed');

    if (audits.length === 0) {
      return {
        averageRating: 0,
        findingsClosureRate: 0,
        correctiveActionCompletionRate: 0,
        trends: []
      };
    }

    // 計算平均評分
    const ratingScores = { excellent: 5, good: 4, satisfactory: 3, unsatisfactory: 2 };
    const averageRating = audits.reduce((sum, a) => sum + ratingScores[a.overallRating], 0) / audits.length;

    // 計算發現事項結案率
    const totalFindings = audits.reduce((sum, a) => sum + a.findings.length, 0);
    const closedFindings = audits.reduce((sum, a) =>
      sum + a.correctiveActions.filter(ca => ca.status === 'closed').length, 0);
    const findingsClosureRate = totalFindings > 0 ? closedFindings / totalFindings : 0;

    // 計算矯正措施完成率
    const totalActions = audits.reduce((sum, a) => sum + a.correctiveActions.length, 0);
    const completedActions = audits.reduce((sum, a) =>
      sum + a.correctiveActions.filter(ca => ca.status === 'closed').length, 0);
    const correctiveActionCompletionRate = totalActions > 0 ? completedActions / totalActions : 0;

    // 趨勢分析（最近12個月）
    const trends = this.calculateAuditTrends(audits);

    return {
      averageRating,
      findingsClosureRate,
      correctiveActionCompletionRate,
      trends
    };
  }

  /**
   * 董事會報告
   */
  async createBoardReport(reportData: Omit<BoardReport, 'id' | 'status'>): Promise<string> {
    const id = `BOARD_${Date.now()}`;

    const report: BoardReport = {
      id,
      ...reportData,
      status: 'draft'
    };

    this.boardReports.set(id, report);
    return id;
  }

  async updateBoardReportStatus(reportId: string, status: BoardReport['status']): Promise<void> {
    const report = this.boardReports.get(reportId);
    if (!report) throw new Error('董事會報告不存在');

    report.status = status;
  }

  getBoardReports(filters?: {
    period?: string;
    type?: string;
    status?: string;
  }): BoardReport[] {
    let reports = Array.from(this.boardReports.values());

    if (filters) {
      if (filters.period) {
        reports = reports.filter(r => r.period === filters.period);
      }
      if (filters.type) {
        reports = reports.filter(r => r.type === filters.type);
      }
      if (filters.status) {
        reports = reports.filter(r => r.status === filters.status);
      }
    }

    return reports.sort((a, b) =>
      new Date(b.presentationDate).getTime() - new Date(a.presentationDate).getTime()
    );
  }

  generateComplianceReport(period: string): {
    executiveSummary: string;
    complianceOverview: any;
    regulatoryUpdates: any;
    auditResults: any;
    recommendations: string[];
  } {
    const complianceDashboard = this.getComplianceDashboard('current_company');
    const audits = this.getAudits({ status: 'completed' }).slice(0, 5);
    const upcomingDeadlines = this.getUpcomingDeadlines(90);

    return {
      executiveSummary: this.generateExecutiveSummary(complianceDashboard, audits),
      complianceOverview: complianceDashboard,
      regulatoryUpdates: {
        newRegulations: this.getRegulations({ status: 'pending' }),
        upcomingDeadlines
      },
      auditResults: this.getAuditEffectiveness(),
      recommendations: this.generateComplianceRecommendations(complianceDashboard, upcomingDeadlines)
    };
  }

  private initializeRegulations(): void {
    // 初始化台灣主要ESG法規
    const regulations: Omit<Regulation, 'id' | 'lastUpdated'>[] = [
      {
        name: '溫室氣體減量及管理法',
        category: 'environmental',
        jurisdiction: 'Taiwan',
        type: 'law',
        effectiveDate: '2015-07-01',
        description: '規範溫室氣體排放量之管制、減量目標及相關管理措施',
        requirements: [
          {
            id: 'emission_reporting',
            description: '每年申報溫室氣體排放量',
            applicability: '年排放量超過2萬5千公噸二氧化碳當量之排放源',
            deadline: '每年5月31日',
            penalty: {
              type: 'fine',
              amount: '新台幣10萬元以上500萬元以下',
              description: '未申報或申報不實罰鍰'
            }
          }
        ],
        reportingRequirements: [
          {
            frequency: 'annual',
            deadline: '5月31日',
            format: '電子申報系統',
            authority: '環保署'
          }
        ],
        status: 'active',
        impact: {
          level: 'high',
          affectedAreas: ['排放管理', '能源使用', '供應鏈'],
          estimatedCost: 500000
        }
      },
      {
        name: '職業安全衛生法',
        category: 'social',
        jurisdiction: 'Taiwan',
        type: 'law',
        effectiveDate: '1974-04-01',
        description: '保障勞工工作安全與健康',
        requirements: [
          {
            id: 'safety_training',
            description: '提供職業安全衛生教育訓練',
            applicability: '所有勞工',
            penalty: {
              type: 'fine',
              amount: '新台幣3萬元以上15萬元以下',
              description: '未提供訓練罰鍰'
            }
          }
        ],
        status: 'active',
        impact: {
          level: 'medium',
          affectedAreas: ['人力資源', '風險管理'],
          estimatedCost: 200000
        }
      }
    ];

    for (const reg of regulations) {
      this.addRegulation(reg);
    }
  }

  private generateRemediationPlan(
    findings: ComplianceStatus['findings'],
    regulation: Regulation
  ): ComplianceStatus['remediationPlan'] {
    const nonCompliant = findings.filter(f => f.status === 'non_compliant');

    if (nonCompliant.length === 0) return undefined;

    // 計算優先級
    const hasHighPenalty = regulation.requirements.some(req =>
      req.penalty?.type === 'criminal' || req.penalty?.amount?.includes('500萬')
    );

    const priority: 'low' | 'medium' | 'high' | 'critical' =
      hasHighPenalty ? 'critical' : nonCompliant.length > 2 ? 'high' : 'medium';

    // 生成行動項目
    const actions = nonCompliant.map(finding => {
      const requirement = regulation.requirements.find(r => r.id === finding.requirementId);
      return {
        description: `修正${requirement?.description || finding.requirementId}的合規問題`,
        owner: '合規負責人',
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pending' as const
      };
    });

    return {
      actions,
      estimatedCost: nonCompliant.length * 50000, // 估計每項修正5萬元
      priority
    };
  }

  private calculateNextReviewDate(regulation: Regulation): string {
    // 根據法規類型設定複審週期
    const reviewCycles = {
      law: 365, // 每年
      regulation: 180, // 每半年
      standard: 90, // 每季
      guideline: 180 // 每半年
    };

    const cycleDays = reviewCycles[regulation.type] || 365;
    const nextDate = new Date(Date.now() + cycleDays * 24 * 60 * 60 * 1000);
    return nextDate.toISOString().split('T')[0];
  }

  private assessAuditRating(findings: AuditRecord['findings']): AuditRecord['overallRating'] {
    const majorCount = findings.filter(f => f.category === 'major').length;
    const minorCount = findings.filter(f => f.category === 'minor').length;
    const observationCount = findings.filter(f => f.category === 'observation').length;

    if (majorCount > 0) return 'unsatisfactory';
    if (minorCount > 2) return 'satisfactory';
    if (minorCount > 0 || observationCount > 3) return 'good';
    return 'excellent';
  }

  private calculateAuditTrends(audits: AuditRecord[]): Array<{ period: string; rating: number }> {
    const monthlyRatings: Record<string, number[]> = {};

    for (const audit of audits) {
      const month = audit.endDate.substring(0, 7); // YYYY-MM
      const ratingScore = { excellent: 5, good: 4, satisfactory: 3, unsatisfactory: 2 }[audit.overallRating];

      if (!monthlyRatings[month]) monthlyRatings[month] = [];
      monthlyRatings[month].push(ratingScore);
    }

    return Object.entries(monthlyRatings)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12) // 最近12個月
      .map(([period, ratings]) => ({
        period,
        rating: ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      }));
  }

  private generateExecutiveSummary(complianceDashboard: any, audits: AuditRecord[]): string {
    const complianceRate = (complianceDashboard.complianceRate * 100).toFixed(1);
    const recentAudit = audits[0];

    return `合規總覽：整體合規率為${complianceRate}%，共有${complianceDashboard.criticalIssues}項重大問題待解決。最近一次稽核評等為${recentAudit?.overallRating || '無'}。建議重點關注即將到期的法規要求和矯正措施執行。`;
  }

  private generateComplianceRecommendations(
    complianceDashboard: any,
    upcomingDeadlines: any[]
  ): string[] {
    const recommendations: string[] = [];

    if (complianceDashboard.overallStatus !== 'compliant') {
      recommendations.push('加強內部稽核頻率，提升問題發現及時性');
    }

    if (upcomingDeadlines.length > 0) {
      recommendations.push('建立法規到期提醒系統，避免錯過申報期限');
    }

    if (complianceDashboard.criticalIssues > 0) {
      recommendations.push('優先處理高風險合規問題，制定具體矯正時程');
    }

    recommendations.push('定期進行合規訓練，提升全體員工合規意識');
    recommendations.push('建立跨部門合規協調機制，提高應變效率');

    return recommendations;
  }

  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: Record<string, any>;
  }> {
    try {
      const regulations = this.getRegulations();
      const complianceStatuses = this.getComplianceStatuses();
      const audits = this.getAudits();
      const reports = this.getBoardReports();

      const details = {
        regulationsCount: regulations.length,
        activeRegulations: regulations.filter(r => r.status === 'active').length,
        complianceStatusesCount: complianceStatuses.length,
        completedAudits: audits.filter(a => a.status === 'completed').length,
        boardReportsCount: reports.length
      };

      // 簡單的健康度檢查
      const healthScore = Math.min(100,
        (details.activeRegulations * 10) +
        (details.completedAudits * 5) +
        (details.boardReportsCount * 2)
      );

      let status: 'healthy' | 'degraded' | 'unhealthy';
      if (healthScore >= 70) status = 'healthy';
      else if (healthScore >= 40) status = 'degraded';
      else status = 'unhealthy';

      return { status, details };
    } catch (error) {
      console.error('合規服務健康檢查失敗:', error);
      return { status: 'unhealthy', details: { error: error.message } };
    }
  }
}

// 導出預設實例
export const complianceService = new ComplianceService();