/**
 * ESG機會識別器
 */

export interface OpportunityIdentificationInput {
  currentState: {
    metrics: Record<string, number>;
    capabilities: string[];
    constraints: string[];
    goals: Record<string, number>;
  };
  analysisScope: ('environmental' | 'social' | 'governance')[];
}

export interface OpportunityIdentificationResult {
  opportunities: Array<{
    category: 'environmental' | 'social' | 'governance';
    title: string;
    description: string;
    potentialImpact: {
      financial: number;
      environmental: string;
      timeline: string;
    };
    implementationDifficulty: 'easy' | 'medium' | 'hard';
    prerequisites: string[];
    successProbability: number;
    priority: number;
  }>;
  totalPotentialValue: number;
  quickWins: number;
  strategicOpportunities: number;
}

export class OpportunityIdentifier {
  private opportunityTemplates: Map<string, any> = new Map();

  constructor() {
    this.initializeOpportunityTemplates();
  }

  async identify(input: OpportunityIdentificationInput): Promise<OpportunityIdentificationResult> {
    const { currentState, analysisScope } = input;
    const opportunities: OpportunityIdentificationResult['opportunities'] = [];

    for (const category of analysisScope) {
      const categoryOpportunities = await this.identifyCategoryOpportunities(
        category,
        currentState
      );
      opportunities.push(...categoryOpportunities);
    }

    // 按優先級排序
    opportunities.sort((a, b) => b.priority - a.priority);

    // 計算總體統計
    const totalPotentialValue = opportunities.reduce((sum, opp) => sum + opp.potentialImpact.financial, 0);
    const quickWins = opportunities.filter(opp => opp.implementationDifficulty === 'easy').length;
    const strategicOpportunities = opportunities.filter(opp => opp.implementationDifficulty === 'hard').length;

    return {
      opportunities,
      totalPotentialValue,
      quickWins,
      strategicOpportunities
    };
  }

  private async identifyCategoryOpportunities(
    category: string,
    currentState: any
  ): Promise<OpportunityIdentificationResult['opportunities']> {
    const opportunities: OpportunityIdentificationResult['opportunities'] = [];

    // 獲取該類別的所有機會模板
    const templates = Array.from(this.opportunityTemplates.values())
      .filter(template => template.category === category);

    for (const template of templates) {
      const relevance = this.calculateRelevance(template, currentState);
      if (relevance > 0.3) { // 相關度門檻
        const opportunity = this.createOpportunity(template, currentState, relevance);
        opportunities.push(opportunity);
      }
    }

    return opportunities;
  }

  private calculateRelevance(template: any, currentState: any): number {
    let relevance = 0;
    let totalWeight = 0;

    // 指標相關性
    if (template.metricConditions) {
      for (const condition of template.metricConditions) {
        const metricValue = currentState.metrics[condition.metric];
        if (metricValue !== undefined) {
          const weight = condition.weight || 1;
          if (this.checkMetricCondition(metricValue, condition)) {
            relevance += weight;
          }
          totalWeight += weight;
        }
      }
    }

    // 能力相關性
    if (template.capabilityRequirements) {
      for (const capability of template.capabilityRequirements) {
        const weight = capability.weight || 1;
        if (currentState.capabilities.includes(capability.name)) {
          relevance += weight;
        }
        totalWeight += weight;
      }
    }

    // 目標一致性
    if (template.goalAlignment) {
      for (const goal of template.goalAlignment) {
        const goalValue = currentState.goals[goal.metric];
        if (goalValue !== undefined) {
          const weight = goal.weight || 1;
          const gap = Math.abs(goal.target - goalValue);
          const alignment = Math.max(0, 1 - gap / goal.tolerance);
          relevance += alignment * weight;
          totalWeight += weight;
        }
      }
    }

    return totalWeight > 0 ? relevance / totalWeight : 0;
  }

  private checkMetricCondition(metricValue: number, condition: any): boolean {
    switch (condition.operator) {
      case '>':
        return metricValue > condition.value;
      case '<':
        return metricValue < condition.value;
      case '>=':
        return metricValue >= condition.value;
      case '<=':
        return metricValue <= condition.value;
      case 'between':
        return metricValue >= condition.min && metricValue <= condition.max;
      case 'not_between':
        return metricValue < condition.min || metricValue > condition.max;
      default:
        return false;
    }
  }

  private createOpportunity(template: any, currentState: any, relevance: number): OpportunityIdentificationResult['opportunities'][0] {
    // 計算潛在影響
    const potentialImpact = this.calculatePotentialImpact(template, currentState, relevance);

    // 評估實施難度
    const implementationDifficulty = this.assessDifficulty(template, currentState);

    // 計算成功機率
    const successProbability = this.calculateSuccessProbability(template, currentState, relevance);

    // 計算優先級 (0-100)
    const priority = Math.round(
      (relevance * 40) +
      (potentialImpact.financial / 1000000 * 30) + // 正規化財務影響
      ((4 - ['easy', 'medium', 'hard'].indexOf(implementationDifficulty)) / 3 * 20) +
      (successProbability * 10)
    );

    return {
      category: template.category,
      title: template.title,
      description: template.description,
      potentialImpact,
      implementationDifficulty,
      prerequisites: template.prerequisites || [],
      successProbability: Math.round(successProbability * 100),
      priority: Math.min(100, Math.max(0, priority))
    };
  }

  private calculatePotentialImpact(template: any, currentState: any, relevance: number): any {
    const baseImpact = template.potentialImpact || {};

    // 根據相關度和現狀調整影響
    const adjustedFinancial = (baseImpact.financial || 0) * relevance;
    const environmental = baseImpact.environmental || '中度環境改善';
    const timeline = baseImpact.timeline || '6-12個月';

    return {
      financial: Math.round(adjustedFinancial),
      environmental,
      timeline
    };
  }

  private assessDifficulty(template: any, currentState: any): 'easy' | 'medium' | 'hard' {
    let difficultyScore = 0;

    // 資源需求評估
    if (template.resourceRequirements) {
      const availableResources = template.resourceRequirements.filter(
        (req: any) => currentState.capabilities.includes(req) ||
                     currentState.metrics[req] > 0
      ).length;
      const resourceRatio = availableResources / template.resourceRequirements.length;
      difficultyScore += (1 - resourceRatio) * 40;
    }

    // 技術複雜度
    difficultyScore += (template.technicalComplexity || 2) * 20;

    // 組織變革需求
    difficultyScore += (template.organizationalChange || 2) * 20;

    // 外部依賴
    if (template.externalDependencies) {
      difficultyScore += template.externalDependencies.length * 10;
    }

    // 時間壓力
    if (template.timePressure) {
      difficultyScore += 10;
    }

    if (difficultyScore < 30) return 'easy';
    if (difficultyScore < 60) return 'medium';
    return 'hard';
  }

  private calculateSuccessProbability(template: any, currentState: any, relevance: number): number {
    let probability = relevance * 0.4; // 基礎相關度

    // 能力匹配度
    if (template.capabilityRequirements) {
      const matchCount = template.capabilityRequirements.filter(
        (req: any) => currentState.capabilities.includes(req.name)
      ).length;
      probability += (matchCount / template.capabilityRequirements.length) * 0.3;
    }

    // 資源可用性
    if (template.resourceRequirements) {
      const availableCount = template.resourceRequirements.filter(
        (req: any) => currentState.capabilities.includes(req) ||
                     currentState.metrics[req] > 0
      ).length;
      probability += (availableCount / template.resourceRequirements.length) * 0.2;
    }

    // 歷史成功率
    probability += (template.historicalSuccessRate || 0.7) * 0.1;

    return Math.min(1, Math.max(0, probability));
  }

  private initializeOpportunityTemplates(): void {
    // 環境機會
    this.opportunityTemplates.set('renewable_energy_investment', {
      id: 'renewable_energy_investment',
      category: 'environmental',
      title: '再生能源投資機會',
      description: '投資太陽能、風能等再生能源，降低碳排放並創造長期價值',
      metricConditions: [
        { metric: 'carbon_emission', operator: '>', value: 1000, weight: 1 },
        { metric: 'energy_cost_ratio', operator: '>', value: 0.05, weight: 0.8 }
      ],
      capabilityRequirements: [
        { name: 'roof_space_available', weight: 0.6 },
        { name: 'capital_available', weight: 0.8 }
      ],
      goalAlignment: [
        { metric: 'carbon_reduction_target', target: 1000, tolerance: 500, weight: 1 }
      ],
      potentialImpact: {
        financial: 2000000,
        environmental: '每年減碳500噸',
        timeline: '12-18個月'
      },
      resourceRequirements: ['engineering_team', 'capital_budget'],
      technicalComplexity: 2,
      organizationalChange: 1,
      externalDependencies: ['government_subsidies'],
      historicalSuccessRate: 0.8,
      prerequisites: ['能源使用分析完成', '廠房屋頂評估', '投資回報分析']
    });

    this.opportunityTemplates.set('energy_efficiency_upgrade', {
      id: 'energy_efficiency_upgrade',
      category: 'environmental',
      title: '能源效率提升專案',
      description: '更換高效設備，優化製程，降低能源消耗',
      metricConditions: [
        { metric: 'energy_intensity', operator: '>', value: 5, weight: 1 },
        { metric: 'equipment_age', operator: '>', value: 10, weight: 0.7 }
      ],
      capabilityRequirements: [
        { name: 'maintenance_team', weight: 0.8 },
        { name: 'budget_available', weight: 0.6 }
      ],
      potentialImpact: {
        financial: 1500000,
        environmental: '每年節能15%',
        timeline: '6-12個月'
      },
      resourceRequirements: ['technical_expertise', 'maintenance_budget'],
      technicalComplexity: 1,
      organizationalChange: 1,
      historicalSuccessRate: 0.9,
      prerequisites: ['能源審計完成', '設備清單建立']
    });

    this.opportunityTemplates.set('circular_economy_implementation', {
      id: 'circular_economy_implementation',
      category: 'environmental',
      title: '循環經濟轉型',
      description: '建立產品回收再利用系統，減少廢棄物產生',
      metricConditions: [
        { metric: 'waste_generation', operator: '>', value: 100, weight: 1 },
        { metric: 'waste_recycling_rate', operator: '<', value: 0.5, weight: 0.8 }
      ],
      capabilityRequirements: [
        { name: 'supply_chain_partners', weight: 0.7 },
        { name: 'logistics_network', weight: 0.6 }
      ],
      potentialImpact: {
        financial: 3000000,
        environmental: '廢棄物減量60%',
        timeline: '18-24個月'
      },
      resourceRequirements: ['supply_chain_expertise', 'logistics_setup'],
      technicalComplexity: 3,
      organizationalChange: 3,
      externalDependencies: ['recycling_partners', 'regulatory_approval'],
      historicalSuccessRate: 0.6,
      prerequisites: ['廢棄物分析完成', '供應鏈評估', '回收市場研究']
    });

    // 社會機會
    this.opportunityTemplates.set('diversity_inclusion_program', {
      id: 'diversity_inclusion_program',
      category: 'social',
      title: '多元包容發展計畫',
      description: '建立包容性文化，提升員工滿意度和創新能力',
      metricConditions: [
        { metric: 'diversity_index', operator: '<', value: 0.6, weight: 1 },
        { metric: 'employee_satisfaction', operator: '<', value: 75, weight: 0.8 }
      ],
      capabilityRequirements: [
        { name: 'hr_department', weight: 0.9 },
        { name: 'training_budget', weight: 0.7 }
      ],
      potentialImpact: {
        financial: 1000000,
        environmental: '提升組織創新力',
        timeline: '12-18個月'
      },
      resourceRequirements: ['hr_expertise', 'training_resources'],
      technicalComplexity: 1,
      organizationalChange: 2,
      historicalSuccessRate: 0.85,
      prerequisites: ['員工調查完成', '多元政策評估', '訓練需求分析']
    });

    this.opportunityTemplates.set('supply_chain_labor_program', {
      id: 'supply_chain_labor_program',
      category: 'social',
      title: '供應鏈勞工權益提升',
      description: '改善供應商勞工條件，建立永續供應鏈',
      metricConditions: [
        { metric: 'supplier_esg_score_avg', operator: '<', value: 60, weight: 1 },
        { metric: 'supply_chain_risk', operator: '>', value: 0.7, weight: 0.8 }
      ],
      capabilityRequirements: [
        { name: 'supplier_audit_capability', weight: 0.8 },
        { name: 'sustainability_team', weight: 0.9 }
      ],
      potentialImpact: {
        financial: 2500000,
        environmental: '供應鏈穩定性提升',
        timeline: '12-24個月'
      },
      resourceRequirements: ['audit_team', 'supplier_management_system'],
      technicalComplexity: 2,
      organizationalChange: 2,
      externalDependencies: ['supplier_cooperation'],
      historicalSuccessRate: 0.7,
      prerequisites: ['供應商評估完成', '稽核能力建立', '改善計畫制定']
    });

    // 治理機會
    this.opportunityTemplates.set('digital_governance_system', {
      id: 'digital_governance_system',
      category: 'governance',
      title: '數位治理系統建置',
      description: '導入數位工具提升治理效率和透明度',
      metricConditions: [
        { metric: 'manual_process_ratio', operator: '>', value: 0.6, weight: 1 },
        { metric: 'compliance_violations', operator: '>', value: 2, weight: 0.8 }
      ],
      capabilityRequirements: [
        { name: 'it_infrastructure', weight: 0.8 },
        { name: 'digital_transformation_budget', weight: 0.9 }
      ],
      potentialImpact: {
        financial: 1800000,
        environmental: '降低紙張使用50%',
        timeline: '9-15個月'
      },
      resourceRequirements: ['it_team', 'digital_tools'],
      technicalComplexity: 2,
      organizationalChange: 2,
      historicalSuccessRate: 0.8,
      prerequisites: ['流程分析完成', '系統需求定義', '變革管理計畫']
    });

    this.opportunityTemplates.set('stakeholder_engagement_platform', {
      id: 'stakeholder_engagement_platform',
      category: 'governance',
      title: '利害關係人參與平台',
      description: '建立與利害關係人的溝通平台，提升信任和透明度',
      metricConditions: [
        { metric: 'stakeholder_satisfaction', operator: '<', value: 70, weight: 1 },
        { metric: 'communication_frequency', operator: '<', value: 4, weight: 0.7 }
      ],
      capabilityRequirements: [
        { name: 'communication_team', weight: 0.8 },
        { name: 'digital_platform', weight: 0.6 }
      ],
      potentialImpact: {
        financial: 800000,
        environmental: '提升利害關係人滿意度',
        timeline: '6-12個月'
      },
      resourceRequirements: ['communication_expertise', 'platform_development'],
      technicalComplexity: 2,
      organizationalChange: 1,
      historicalSuccessRate: 0.75,
      prerequisites: ['利害關係人分析', '溝通需求評估', '平台設計']
    });
  }

  async isHealthy(): Promise<boolean> {
    try {
      const testState = {
        metrics: {
          carbon_emission: 2000,
          energy_intensity: 8,
          employee_satisfaction: 70
        },
        capabilities: ['capital_available', 'engineering_team'],
        constraints: [],
        goals: {
          carbon_reduction_target: 1500
        }
      };

      const result = await this.identify({
        currentState: testState,
        analysisScope: ['environmental']
      });

      return result.opportunities.length > 0;
    } catch (error) {
      console.error('機會識別器健康檢查失敗:', error);
      return false;
    }
  }
}