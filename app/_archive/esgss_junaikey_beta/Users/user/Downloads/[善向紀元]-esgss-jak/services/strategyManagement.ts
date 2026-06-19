/**
 * 目標與策略管理服務 (M5: Strategy & Goal Management)
 *
 * 提供完整的策略規劃和目標管理功能：
 * - SBTi科學基礎減量目標設定
 * - SDGs貢獻評估
 * - 目標追蹤與KPI管理
 * - 情境分析與專案管理
 */

export interface SBTiTarget {
  id: string;
  baselineYear: number;
  baselineValue: number;
  targetYear: number;
  targetValue: number;
  reductionPercentage: number;
  scenario: '1.5°C' | 'well_below_2°C' | '2°C';
  approvedBySBTi: boolean;
  approvalDate?: string;
  progress: {
    currentYear: number;
    currentValue: number;
    achieved: number; // 百分比
    status: 'on_track' | 'behind' | 'ahead';
    nextMilestone: {
      year: number;
      target: number;
    };
  };
}

export interface SDGContribution {
  sdg: number;
  targets: number[];
  contribution: {
    level: 'low' | 'medium' | 'high' | 'very_high';
    description: string;
    metrics: Array<{
      indicator: string;
      value: number;
      unit: string;
      year: number;
    }>;
    initiatives: Array<{
      name: string;
      description: string;
      impact: string;
      status: 'planned' | 'ongoing' | 'completed';
    }>;
  };
  lastUpdated: string;
}

export interface KPITracking {
  id: string;
  name: string;
  category: 'environmental' | 'social' | 'governance';
  currentValue: number;
  targetValue: number;
  baselineValue: number;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  trend: 'increasing' | 'decreasing' | 'stable';
  progress: number; // 百分比
  lastUpdated: string;
  owner: string;
  status: 'on_track' | 'at_risk' | 'off_track';
  alerts: Array<{
    type: 'warning' | 'critical';
    message: string;
    triggeredAt: string;
  }>;
}

export interface ScenarioAnalysis {
  id: string;
  name: string;
  description: string;
  type: 'climate' | 'policy' | 'market' | 'operational';
  assumptions: Record<string, any>;
  impacts: {
    environmental: Array<{
      metric: string;
      baseline: number;
      scenarioImpact: number;
      confidence: number;
    }>;
    financial: Array<{
      metric: string;
      baseline: number;
      scenarioImpact: number;
      confidence: number;
    }>;
    operational: Array<{
      metric: string;
      baseline: number;
      scenarioImpact: number;
      confidence: number;
    }>;
  };
  probability: number;
  timeHorizon: number; // 年
  mitigationStrategies: Array<{
    strategy: string;
    effectiveness: number;
    cost: number;
    timeline: string;
  }>;
  createdAt: string;
}

export interface ESGProject {
  id: string;
  name: string;
  description: string;
  category: 'environmental' | 'social' | 'governance';
  strategicAlignment: string[]; // 相關策略
  objectives: string[];
  scope: {
    startDate: string;
    endDate: string;
    budget: number;
    resources: string[];
    stakeholders: string[];
  };
  milestones: Array<{
    id: string;
    name: string;
    description: string;
    dueDate: string;
    deliverables: string[];
    status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
    progress: number;
    dependencies: string[]; // 其他milestone IDs
  }>;
  risks: Array<{
    risk: string;
    impact: 'low' | 'medium' | 'high';
    probability: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
  kpis: Array<{
    metric: string;
    baseline: number;
    target: number;
    current?: number;
    unit: string;
  }>;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  progress: number;
  budget: {
    allocated: number;
    spent: number;
    remaining: number;
  };
  lastUpdated: string;
  owner: string;
}

export class StrategyManagementService {
  private sbtiTargets: Map<string, SBTiTarget> = new Map();
  private sdgContributions: Map<number, SDGContribution> = new Map();
  private kpis: Map<string, KPITracking> = new Map();
  private scenarios: Map<string, ScenarioAnalysis> = new Map();
  private projects: Map<string, ESGProject> = new Map();

  /**
   * SBTi目標管理
   */
  async createSBTiTarget(targetData: {
    baselineYear: number;
    baselineValue: number;
    targetYear: number;
    targetValue: number;
    scenario: '1.5°C' | 'well_below_2°C' | '2°C';
  }): Promise<string> {
    const id = `SBTI_${Date.now()}`;
    const reductionPercentage = ((targetData.baselineValue - targetData.targetValue) / targetData.baselineValue) * 100;

    // 驗證目標合理性
    if (!this.validateSBTiTarget(targetData, reductionPercentage)) {
      throw new Error('SBTi目標不符合科學基礎要求');
    }

    const target: SBTiTarget = {
      id,
      ...targetData,
      reductionPercentage,
      approvedBySBTi: false,
      progress: {
        currentYear: new Date().getFullYear(),
        currentValue: targetData.baselineValue,
        achieved: 0,
        status: 'on_track',
        nextMilestone: {
          year: targetData.targetYear,
          target: targetData.targetValue
        }
      }
    };

    this.sbtiTargets.set(id, target);
    return id;
  }

  async updateSBTiProgress(targetId: string, currentData: {
    currentYear: number;
    currentValue: number;
  }): Promise<void> {
    const target = this.sbtiTargets.get(targetId);
    if (!target) throw new Error('SBTi目標不存在');

    const achieved = ((target.baselineValue - currentData.currentValue) / target.baselineValue) * 100;
    const expectedProgress = ((currentData.currentYear - target.baselineYear) /
                             (target.targetYear - target.baselineYear)) * target.reductionPercentage;

    let status: 'on_track' | 'behind' | 'ahead' = 'on_track';
    if (achieved < expectedProgress * 0.8) status = 'behind';
    else if (achieved > expectedProgress * 1.2) status = 'ahead';

    target.progress = {
      ...target.progress,
      ...currentData,
      achieved,
      status
    };
  }

  getSBTiTargets(): SBTiTarget[] {
    return Array.from(this.sbtiTargets.values());
  }

  /**
   * SDGs貢獻評估
   */
  async assessSDGContribution(sdgNumber: number, assessmentData: {
    targets: number[];
    initiatives: Array<{
      name: string;
      description: string;
      impact: string;
      status: 'planned' | 'ongoing' | 'completed';
    }>;
    metrics: Array<{
      indicator: string;
      value: number;
      unit: string;
    }>;
  }): Promise<void> {
    const contribution: SDGContribution = {
      sdg: sdgNumber,
      targets: assessmentData.targets,
      contribution: {
        level: this.calculateContributionLevel(assessmentData),
        description: this.generateContributionDescription(sdgNumber, assessmentData),
        metrics: assessmentData.metrics.map(m => ({ ...m, year: new Date().getFullYear() })),
        initiatives: assessmentData.initiatives
      },
      lastUpdated: new Date().toISOString()
    };

    this.sdgContributions.set(sdgNumber, contribution);
  }

  getSDGContributions(): SDGContribution[] {
    return Array.from(this.sdgContributions.values());
  }

  /**
   * KPI追蹤管理
   */
  async createKPI(kpiData: {
    name: string;
    category: 'environmental' | 'social' | 'governance';
    currentValue: number;
    targetValue: number;
    baselineValue: number;
    unit: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
    owner: string;
  }): Promise<string> {
    const id = `KPI_${Date.now()}`;
    const progress = ((kpiData.currentValue - kpiData.baselineValue) /
                     (kpiData.targetValue - kpiData.baselineValue)) * 100;

    // 計算趨勢
    const trend = this.calculateTrend(kpiData.baselineValue, kpiData.currentValue, kpiData.targetValue);

    const kpi: KPITracking = {
      id,
      ...kpiData,
      trend,
      progress: Math.max(0, Math.min(100, progress)),
      lastUpdated: new Date().toISOString(),
      status: this.determineKPIStatus(progress, kpiData),
      alerts: []
    };

    this.kpis.set(id, kpi);
    return id;
  }

  async updateKPIValue(kpiId: string, newValue: number): Promise<void> {
    const kpi = this.kpis.get(kpiId);
    if (!kpi) throw new Error('KPI不存在');

    const oldValue = kpi.currentValue;
    kpi.currentValue = newValue;
    kpi.progress = ((newValue - kpi.baselineValue) / (kpi.targetValue - kpi.baselineValue)) * 100;
    kpi.lastUpdated = new Date().toISOString();

    // 更新趨勢
    kpi.trend = this.calculateTrend(kpi.baselineValue, newValue, kpi.targetValue);
    kpi.status = this.determineKPIStatus(kpi.progress, kpi);

    // 檢查是否需要發出警報
    this.checkKPIAlerts(kpi, oldValue);
  }

  getKPIs(category?: string): KPITracking[] {
    const allKPIs = Array.from(this.kpis.values());
    if (category) {
      return allKPIs.filter(kpi => kpi.category === category);
    }
    return allKPIs;
  }

  /**
   * 情境分析
   */
  async createScenarioAnalysis(scenarioData: {
    name: string;
    description: string;
    type: 'climate' | 'policy' | 'market' | 'operational';
    assumptions: Record<string, any>;
    timeHorizon: number;
  }): Promise<string> {
    const id = `SCENARIO_${Date.now()}`;

    // 模擬情境分析計算
    const impacts = await this.calculateScenarioImpacts(scenarioData);

    const scenario: ScenarioAnalysis = {
      id,
      ...scenarioData,
      impacts,
      probability: this.estimateScenarioProbability(scenarioData),
      mitigationStrategies: this.generateMitigationStrategies(scenarioData.type),
      createdAt: new Date().toISOString()
    };

    this.scenarios.set(id, scenario);
    return id;
  }

  getScenarios(type?: string): ScenarioAnalysis[] {
    const allScenarios = Array.from(this.scenarios.values());
    if (type) {
      return allScenarios.filter(s => s.type === type);
    }
    return allScenarios;
  }

  /**
   * ESG專案管理
   */
  async createProject(projectData: {
    name: string;
    description: string;
    category: 'environmental' | 'social' | 'governance';
    objectives: string[];
    scope: ESGProject['scope'];
    risks: ESGProject['risks'];
    kpis: ESGProject['kpis'];
    owner: string;
  }): Promise<string> {
    const id = `PROJECT_${Date.now()}`;

    const project: ESGProject = {
      id,
      ...projectData,
      strategicAlignment: [], // 稍後設定
      milestones: this.generateDefaultMilestones(projectData.scope),
      status: 'planning',
      progress: 0,
      budget: {
        allocated: projectData.scope.budget,
        spent: 0,
        remaining: projectData.scope.budget
      },
      lastUpdated: new Date().toISOString()
    };

    this.projects.set(id, project);
    return id;
  }

  async updateProjectProgress(projectId: string, updates: {
    milestoneUpdates?: Array<{
      milestoneId: string;
      status: ESGProject['milestones'][0]['status'];
      progress: number;
    }>;
    budgetUpdate?: {
      spent: number;
    };
    status?: ESGProject['status'];
  }): Promise<void> {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('專案不存在');

    // 更新milestones
    if (updates.milestoneUpdates) {
      for (const update of updates.milestoneUpdates) {
        const milestone = project.milestones.find(m => m.id === update.milestoneId);
        if (milestone) {
          milestone.status = update.status;
          milestone.progress = update.progress;
        }
      }
    }

    // 更新預算
    if (updates.budgetUpdate) {
      project.budget.spent = updates.budgetUpdate.spent;
      project.budget.remaining = project.budget.allocated - updates.budgetUpdate.spent;
    }

    // 更新狀態
    if (updates.status) {
      project.status = updates.status;
    }

    // 重新計算整體進度
    project.progress = this.calculateProjectProgress(project);
    project.lastUpdated = new Date().toISOString();
  }

  getProjects(category?: string): ESGProject[] {
    const allProjects = Array.from(this.projects.values());
    if (category) {
      return allProjects.filter(p => p.category === category);
    }
    return allProjects;
  }

  /**
   * 策略儀表板
   */
  getStrategyDashboard(): {
    sbti: { targets: SBTiTarget[]; overallProgress: number };
    sdgs: { contributions: SDGContribution[]; averageLevel: string };
    kpis: { summary: any; alerts: any[] };
    scenarios: { highImpact: ScenarioAnalysis[] };
    projects: { active: ESGProject[]; completionRate: number };
  } {
    return {
      sbti: {
        targets: this.getSBTiTargets(),
        overallProgress: this.calculateOverallSBTiProgress()
      },
      sdgs: {
        contributions: this.getSDGContributions(),
        averageLevel: this.calculateAverageSDGLevel()
      },
      kpis: {
        summary: this.getKPISummary(),
        alerts: this.getKPIAlerts()
      },
      scenarios: {
        highImpact: this.getHighImpactScenarios()
      },
      projects: {
        active: this.getActiveProjects(),
        completionRate: this.calculateProjectCompletionRate()
      }
    };
  }

  private validateSBTiTarget(targetData: any, reductionPercentage: number): boolean {
    // SBTi基本驗證邏輯
    const requiredReduction = {
      '1.5°C': 0.65, // 65%
      'well_below_2°C': 0.50, // 50%
      '2°C': 0.30 // 30%
    };

    const timeSpan = targetData.targetYear - targetData.baselineYear;
    if (timeSpan < 5 || timeSpan > 20) return false;

    const required = requiredReduction[targetData.scenario];
    return reductionPercentage >= required;
  }

  private calculateContributionLevel(assessmentData: any): 'low' | 'medium' | 'high' | 'very_high' {
    const initiativeCount = assessmentData.initiatives.length;
    const metricCount = assessmentData.metrics.length;
    const completedInitiatives = assessmentData.initiatives.filter(
      (i: any) => i.status === 'completed'
    ).length;

    const score = (initiativeCount * 0.4) + (metricCount * 0.3) + (completedInitiatives * 0.3);

    if (score >= 8) return 'very_high';
    if (score >= 6) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  }

  private generateContributionDescription(sdgNumber: number, assessmentData: any): string {
    // 生成SDG貢獻描述
    const level = this.calculateContributionLevel(assessmentData);
    const descriptions = {
      low: '基本認識SDG目標，需加強具體行動',
      medium: '有一定貢獻，但可進一步深化參與',
      high: '積極貢獻SDG實現，具有顯著影響',
      very_high: '領導性貢獻，對SDG目標有重大推動作用'
    };

    return `SDG ${sdgNumber} 貢獻評估：${descriptions[level]}`;
  }

  private calculateTrend(baseline: number, current: number, target: number): 'increasing' | 'decreasing' | 'stable' {
    const progress = (current - baseline) / (target - baseline);
    if (progress > 0.05) return 'increasing';
    if (progress < -0.05) return 'decreasing';
    return 'stable';
  }

  private determineKPIStatus(progress: number, kpi: any): 'on_track' | 'at_risk' | 'off_track' {
    const expectedProgress = this.calculateExpectedProgress(kpi);
    const deviation = Math.abs(progress - expectedProgress);

    if (deviation < 10) return 'on_track';
    if (deviation < 25) return 'at_risk';
    return 'off_track';
  }

  private calculateExpectedProgress(kpi: any): number {
    // 簡化的預期進度計算
    const age = (new Date().getTime() - new Date(kpi.lastUpdated).getTime()) / (1000 * 60 * 60 * 24);
    const totalDays = 365; // 年度目標
    return (age / totalDays) * 100;
  }

  private checkKPIAlerts(kpi: KPITracking, oldValue: number): void {
    const alerts: KPITracking['alerts'] = [];

    // 進度落後警報
    if (kpi.status === 'off_track') {
      alerts.push({
        type: 'critical',
        message: `${kpi.name} 進度嚴重落後目標`,
        triggeredAt: new Date().toISOString()
      });
    }

    // 價值異常警報
    const change = Math.abs(kpi.currentValue - oldValue) / oldValue;
    if (change > 0.5) { // 50%變化
      alerts.push({
        type: 'warning',
        message: `${kpi.name} 數值發生重大變化`,
        triggeredAt: new Date().toISOString()
      });
    }

    kpi.alerts.push(...alerts);
  }

  private async calculateScenarioImpacts(scenarioData: any): Promise<ScenarioAnalysis['impacts']> {
    // 模擬情境影響計算
    return {
      environmental: [],
      financial: [],
      operational: []
    };
  }

  private estimateScenarioProbability(scenarioData: any): number {
    // 估計情境發生機率
    const probabilities = {
      climate: 0.7,
      policy: 0.6,
      market: 0.5,
      operational: 0.3
    };
    return probabilities[scenarioData.type] || 0.5;
  }

  private generateMitigationStrategies(type: string): ScenarioAnalysis['mitigationStrategies'] {
    // 生成緩解策略
    return [];
  }

  private generateDefaultMilestones(scope: ESGProject['scope']): ESGProject['milestones'] {
    // 生成預設milestones
    return [
      {
        id: 'planning',
        name: '規劃階段',
        description: '專案規劃與準備',
        dueDate: scope.startDate,
        deliverables: ['專案計劃書', '預算核准'],
        status: 'completed',
        progress: 100,
        dependencies: []
      },
      {
        id: 'execution',
        name: '執行階段',
        description: '主要工作執行',
        dueDate: scope.endDate,
        deliverables: ['中期報告', '階段成果'],
        status: 'in_progress',
        progress: 0,
        dependencies: ['planning']
      },
      {
        id: 'closure',
        name: '結案階段',
        description: '專案結案與驗證',
        dueDate: scope.endDate,
        deliverables: ['最終報告', '影響評估'],
        status: 'not_started',
        progress: 0,
        dependencies: ['execution']
      }
    ];
  }

  private calculateProjectProgress(project: ESGProject): number {
    const totalMilestones = project.milestones.length;
    const completedMilestones = project.milestones.filter(m => m.status === 'completed').length;
    return (completedMilestones / totalMilestones) * 100;
  }

  private calculateOverallSBTiProgress(): number {
    const targets = this.getSBTiTargets();
    if (targets.length === 0) return 0;

    const totalProgress = targets.reduce((sum, target) => sum + target.progress.achieved, 0);
    return totalProgress / targets.length;
  }

  private calculateAverageSDGLevel(): string {
    const contributions = this.getSDGContributions();
    if (contributions.length === 0) return 'N/A';

    const levels = contributions.map(c => c.contribution.level);
    const levelScores = { low: 1, medium: 2, high: 3, very_high: 4 };
    const averageScore = levels.reduce((sum, level) => sum + levelScores[level], 0) / levels.length;

    const scoreToLevel = { 1: 'low', 2: 'medium', 3: 'high', 4: 'very_high' };
    return scoreToLevel[Math.round(averageScore) as keyof typeof scoreToLevel] || 'medium';
  }

  private getKPISummary(): any {
    const kpis = this.getKPIs();
    return {
      total: kpis.length,
      onTrack: kpis.filter(k => k.status === 'on_track').length,
      atRisk: kpis.filter(k => k.status === 'at_risk').length,
      offTrack: kpis.filter(k => k.status === 'off_track').length,
      averageProgress: kpis.reduce((sum, k) => sum + k.progress, 0) / kpis.length || 0
    };
  }

  private getKPIAlerts(): any[] {
    const alerts: any[] = [];
    for (const kpi of this.kpis.values()) {
      alerts.push(...kpi.alerts.slice(-5)); // 最近5個警報
    }
    return alerts.sort((a, b) => new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime());
  }

  private getHighImpactScenarios(): ScenarioAnalysis[] {
    return Array.from(this.scenarios.values())
      .filter(s => s.probability > 0.6)
      .sort((a, b) => b.probability - a.probability);
  }

  private getActiveProjects(): ESGProject[] {
    return Array.from(this.projects.values())
      .filter(p => p.status === 'active' || p.status === 'planning');
  }

  private calculateProjectCompletionRate(): number {
    const projects = Array.from(this.projects.values());
    if (projects.length === 0) return 0;

    const totalProgress = projects.reduce((sum, p) => sum + p.progress, 0);
    return totalProgress / projects.length;
  }
}

// 導出預設實例
export const strategyManagement = new StrategyManagementService();