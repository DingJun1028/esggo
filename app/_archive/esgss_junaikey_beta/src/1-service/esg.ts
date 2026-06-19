// ESG專屬服務
export interface CarbonEmission {
  id: string;
  companyId: string;
  year: number;
  scope1: number; // 直接排放
  scope2: number; // 間接排放 (能源)
  scope3: number; // 其他間接排放
  total: number;
  reductionTarget: number;
  reductionAchieved: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  dataSource: string;
  lastUpdated: number;
}

export interface SocialImpact {
  id: string;
  companyId: string;
  category: 'employees' | 'supply_chain' | 'community' | 'diversity';
  metric: string;
  value: number;
  target: number;
  unit: string;
  year: number;
  verified: boolean;
  stakeholders: string[];
}

export interface GovernanceScore {
  id: string;
  companyId: string;
  year: number;
  boardComposition: number; // 董事會組成 (0-100)
  executiveCompensation: number; // 經理人薪酬透明度 (0-100)
  shareholderRights: number; // 股東權益 (0-100)
  auditQuality: number; // 審計品質 (0-100)
  riskManagement: number; // 風險管理 (0-100)
  overallScore: number; // 總體治理評分 (0-100)
  rating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC';
  lastAssessed: number;
}

export interface ESGReport {
  id: string;
  companyId: string;
  title: string;
  type: 'annual' | 'sustainability' | 'integrated' | 'impact';
  year: number;
  environmental: {
    carbonFootprint: number;
    energyConsumption: number;
    waterUsage: number;
    wasteGeneration: number;
    biodiversityImpact: number;
  };
  social: {
    employeeSatisfaction: number;
    diversityIndex: number;
    communityInvestment: number;
    supplyChainEthics: number;
    humanRights: number;
  };
  governance: {
    transparencyScore: number;
    stakeholderEngagement: number;
    ethicalConduct: number;
    regulatoryCompliance: number;
  };
  overallScore: number;
  rating: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D';
  status: 'draft' | 'review' | 'published' | 'archived';
  publishedAt?: number;
  verifiedBy?: string;
}

// ESG計算引擎
export class ESGCalculator {
  // 計算碳排放強度
  static calculateCarbonIntensity(emissions: number, revenue: number): number {
    return revenue > 0 ? (emissions / revenue) * 1000000 : 0; // 噸CO2/百萬美元營收
  }

  // 計算ESG綜合評分
  static calculateOverallScore(
    environmentalScore: number,
    socialScore: number,
    governanceScore: number,
    weights = { environmental: 0.3, social: 0.3, governance: 0.4 }
  ): number {
    return (
      environmentalScore * weights.environmental +
      socialScore * weights.social +
      governanceScore * weights.governance
    );
  }

  // 計算永續發展目標 (SDGs) 貢獻度
  static calculateSDGContribution(
    actions: Array<{
      sdg: number;
      impact: number;
      confidence: number;
    }>
  ): Record<number, number> {
    const contributions: Record<number, number> = {};

    actions.forEach(action => {
      const currentVal = contributions[action.sdg] || 0;
      contributions[action.sdg] = currentVal + action.impact * action.confidence;
    });

    return contributions;
  }

  // 計算多元化指數
  static calculateDiversityIndex(workforce: {
    gender: { male: number; female: number; other: number };
    age: { under30: number; age30to50: number; over50: number };
    ethnicity: Record<string, number>;
  }): number {
    const totalEmployees = Object.values(workforce.gender).reduce((a, b) => a + b, 0);

    if (totalEmployees === 0) return 0;

    // 性別多元化 (0-25分)
    const genderRatio = Math.min(workforce.gender.female / totalEmployees, 0.5) * 2;
    const genderScore = genderRatio * 25;

    // 年齡多元化 (0-25分)
    const ageDistribution = Object.values(workforce.age).map(count => count / totalEmployees);
    const ageEntropy = -ageDistribution.reduce((sum, p) => sum + (p > 0 ? p * Math.log2(p) : 0), 0);
    const maxEntropy = Math.log2(3); // 3個年齡組
    const ageScore = (ageEntropy / maxEntropy) * 25;

    // 種族多元化 (0-50分)
    const ethnicityValues = Object.values(workforce.ethnicity);
    const ethnicityTotal = ethnicityValues.reduce((a, b) => a + b, 0);
    const ethnicityDistribution = ethnicityValues.map(count => count / ethnicityTotal);
    const ethnicityEntropy = -ethnicityDistribution.reduce(
      (sum, p) => sum + (p > 0 ? p * Math.log2(p) : 0),
      0
    );
    const ethnicityMaxEntropy = Math.log2(ethnicityValues.length);
    const ethnicityScore = (ethnicityEntropy / ethnicityMaxEntropy) * 50;

    return Math.min(genderScore + ageScore + ethnicityScore, 100);
  }

  // 計算供應鏈風險評分
  static calculateSupplyChainRisk(
    suppliers: Array<{
      name: string;
      country: string;
      riskFactors: {
        environmental: number; // 0-100
        social: number; // 0-100
        governance: number; // 0-100
        geopolitical: number; // 0-100
      };
      revenue: number; // 供應商收入占比
    }>
  ): number {
    let weightedRisk = 0;
    let totalWeight = 0;

    suppliers.forEach(supplier => {
      const supplierRisk =
        supplier.riskFactors.environmental * 0.25 +
        supplier.riskFactors.social * 0.35 +
        supplier.riskFactors.governance * 0.25 +
        supplier.riskFactors.geopolitical * 0.15;

      weightedRisk += supplierRisk * supplier.revenue;
      totalWeight += supplier.revenue;
    });

    return totalWeight > 0 ? weightedRisk / totalWeight : 0;
  }

  // 計算氣候變遷風險評估
  static assessClimateRisk(exposure: {
    physical: {
      acute: number; // 急性風險 (0-100)
      chronic: number; // 慢性風險 (0-100)
    };
    transition: {
      policy: number; // 政策風險 (0-100)
      technology: number; // 技術風險 (0-100)
      market: number; // 市場風險 (0-100)
    };
    opportunities: {
      resourceEfficiency: number; // 資源效率機會 (0-100)
      energyTransition: number; // 能源轉型機會 (0-100)
      productInnovation: number; // 產品創新機會 (0-100)
    };
  }): {
    overallRisk: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    opportunities: number;
  } {
    const physicalRisk = (exposure.physical.acute + exposure.physical.chronic) / 2;
    const transitionRisk =
      (exposure.transition.policy + exposure.transition.technology + exposure.transition.market) /
      3;
    const opportunities =
      (exposure.opportunities.resourceEfficiency +
        exposure.opportunities.energyTransition +
        exposure.opportunities.productInnovation) /
      3;

    const overallRisk = physicalRisk * 0.4 + transitionRisk * 0.6;

    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (overallRisk < 25) riskLevel = 'low';
    else if (overallRisk < 50) riskLevel = 'medium';
    else if (overallRisk < 75) riskLevel = 'high';
    else riskLevel = 'critical';

    return {
      overallRisk,
      riskLevel,
      opportunities,
    };
  }

  // 計算利益相關者參與度
  static calculateStakeholderEngagement(
    stakeholders: Array<{
      type: 'employees' | 'investors' | 'customers' | 'suppliers' | 'communities' | 'regulators';
      engagementLevel: number; // 0-100
      satisfaction: number; // 0-100
      influence: number; // 0-100
    }>
  ): {
    overallEngagement: number;
    satisfactionIndex: number;
    influenceIndex: number;
  } {
    const totalInfluence = stakeholders.reduce((sum, s) => sum + s.influence, 0);

    const weightedEngagement = stakeholders.reduce((sum, s) => {
      const weight = s.influence / totalInfluence;
      return sum + s.engagementLevel * weight;
    }, 0);

    const weightedSatisfaction = stakeholders.reduce((sum, s) => {
      const weight = s.influence / totalInfluence;
      return sum + s.satisfaction * weight;
    }, 0);

    const averageInfluence = totalInfluence / stakeholders.length;

    return {
      overallEngagement: weightedEngagement,
      satisfactionIndex: weightedSatisfaction,
      influenceIndex: averageInfluence,
    };
  }
}

// ESG數據驗證器
export class ESGDataValidator {
  // 驗證碳排放數據
  static validateCarbonData(data: Partial<CarbonEmission>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.year && (data.year < 2000 || data.year > new Date().getFullYear() + 1)) {
      errors.push('年份必須在2000到明年之間');
    }

    if (data.scope1 !== undefined && data.scope1 < 0) {
      errors.push('Scope 1排放不能為負數');
    }

    if (data.scope2 !== undefined && data.scope2 < 0) {
      errors.push('Scope 2排放不能為負數');
    }

    if (data.scope3 !== undefined && data.scope3 < 0) {
      errors.push('Scope 3排放不能為負數');
    }

    const total = (data.scope1 || 0) + (data.scope2 || 0) + (data.scope3 || 0);
    if (data.total !== undefined && Math.abs(data.total - total) > 0.01) {
      errors.push('總排放量與Scope 1+2+3的總和不匹配');
    }

    if (data.reductionTarget !== undefined && data.reductionTarget < 0) {
      errors.push('減排目標不能為負數');
    }

    if (data.reductionAchieved !== undefined && data.reductionAchieved < 0) {
      errors.push('已實現減排量不能為負數');
    }

    return { isValid: errors.length === 0, errors };
  }

  // 驗證社會影響數據
  static validateSocialData(data: Partial<SocialImpact>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.category) {
      errors.push('必須指定類別');
    }

    if (!data.metric) {
      errors.push('必須指定指標名稱');
    }

    if (data.year && (data.year < 2000 || data.year > new Date().getFullYear() + 1)) {
      errors.push('年份必須在2000到明年之間');
    }

    if (data.target !== undefined && data.target < 0) {
      errors.push('目標值不能為負數');
    }

    return { isValid: errors.length === 0, errors };
  }

  // 驗證治理評分
  static validateGovernanceData(data: Partial<GovernanceScore>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (data.year && (data.year < 2000 || data.year > new Date().getFullYear() + 1)) {
      errors.push('年份必須在2000到明年之間');
    }

    const scoreFields = [
      'boardComposition',
      'executiveCompensation',
      'shareholderRights',
      'auditQuality',
      'riskManagement',
    ];
    scoreFields.forEach(field => {
      const value = (data as any)[field];
      if (value !== undefined && (value < 0 || value > 100)) {
        errors.push(`${field}評分必須在0-100之間`);
      }
    });

    if (data.overallScore !== undefined && (data.overallScore < 0 || data.overallScore > 100)) {
      errors.push('整體評分必須在0-100之間');
    }

    return { isValid: errors.length === 0, errors };
  }

  // 根據評分確定等級
  static getRatingFromScore(score: number): 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' {
    if (score >= 95) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 75) return 'B+';
    if (score >= 65) return 'B';
    if (score >= 55) return 'C+';
    if (score >= 45) return 'C';
    return 'D';
  }

  // 檢查數據一致性
  static checkDataConsistency(reports: ESGReport[]): {
    inconsistencies: Array<{
      reportId: string;
      field: string;
      issue: string;
    }>;
    score: number; // 0-100, 數據一致性評分
  } {
    const inconsistencies: Array<{
      reportId: string;
      field: string;
      issue: string;
    }> = [];

    // 檢查年度趨勢的一致性
    const sortedReports = reports.sort((a, b) => a.year - b.year);

    for (let i = 1; i < sortedReports.length; i++) {
      const current = sortedReports[i];
      const previous = sortedReports[i - 1];

      if (!current || !previous) continue;

      // 環境指標趨勢檢查
      if (current.environmental.carbonFootprint < previous.environmental.carbonFootprint * 0.5) {
        inconsistencies.push({
          reportId: current.id,
          field: 'environmental.carbonFootprint',
          issue: `碳足跡從${previous.year}年的${previous.environmental.carbonFootprint}大幅下降到${current.environmental.carbonFootprint}，請確認數據準確性`,
        });
      }

      // 社會指標連續性檢查
      if (
        Math.abs(current.social.employeeSatisfaction - previous.social.employeeSatisfaction) > 30
      ) {
        inconsistencies.push({
          reportId: current.id,
          field: 'social.employeeSatisfaction',
          issue: `員工滿意度變化過大 (${previous.social.employeeSatisfaction} → ${current.social.employeeSatisfaction})`,
        });
      }
    }

    // 計算一致性評分
    const totalChecks = sortedReports.length * 6; // 每個報告6個主要指標
    const consistencyScore = Math.max(0, 100 - (inconsistencies.length / totalChecks) * 100);

    return {
      inconsistencies,
      score: consistencyScore,
    };
  }
}

// ESG報告生成器
export class ESGReportGenerator {
  static generateAnnualReport(
    companyId: string,
    year: number,
    data: {
      carbonData: CarbonEmission[];
      socialData: SocialImpact[];
      governanceData: GovernanceScore;
    }
  ): ESGReport {
    // 計算環境評分
    const latestCarbon = data.carbonData
      .filter(c => c.year === year)
      .sort((a, b) => b.lastUpdated - a.lastUpdated)[0];

    const environmental = {
      carbonFootprint: latestCarbon?.total || 0,
      energyConsumption: 0, // 需要額外數據
      waterUsage: 0,
      wasteGeneration: 0,
      biodiversityImpact: 0,
    };

    // 計算社會評分
    const socialMetrics = data.socialData.filter(s => s.year === year);
    const social = {
      employeeSatisfaction:
        socialMetrics.find(m => m.category === 'employees' && m.metric === 'satisfaction')?.value ||
        0,
      diversityIndex:
        socialMetrics.find(m => m.category === 'diversity' && m.metric === 'index')?.value || 0,
      communityInvestment:
        socialMetrics.find(m => m.category === 'community' && m.metric === 'investment')?.value ||
        0,
      supplyChainEthics:
        socialMetrics.find(m => m.category === 'supply_chain' && m.metric === 'ethics')?.value || 0,
      humanRights:
        socialMetrics.find(m => m.category === 'supply_chain' && m.metric === 'human_rights')
          ?.value || 0,
    };

    // 治理評分
    const governance = {
      transparencyScore:
        data.governanceData.boardComposition * 0.8 + data.governanceData.auditQuality * 0.2,
      stakeholderEngagement:
        data.governanceData.shareholderRights * 0.7 +
        data.governanceData.executiveCompensation * 0.3,
      ethicalConduct: data.governanceData.riskManagement,
      regulatoryCompliance:
        (data.governanceData.auditQuality + data.governanceData.riskManagement) / 2,
    };

    // 計算整體評分
    const environmentalScore = this.calculateEnvironmentalScore(environmental);
    const socialScore = this.calculateSocialScore(social);
    const governanceScore = data.governanceData.overallScore;

    const overallScore = ESGCalculator.calculateOverallScore(
      environmentalScore,
      socialScore,
      governanceScore
    );

    return {
      id: `report_${companyId}_${year}`,
      companyId,
      title: `${year}年度ESG永續報告`,
      type: 'annual',
      year,
      environmental,
      social,
      governance,
      overallScore,
      rating: ESGDataValidator.getRatingFromScore(overallScore),
      status: 'draft',
    };
  }

  private static calculateEnvironmentalScore(data: ESGReport['environmental']): number {
    // 簡化的環境評分計算
    const carbonScore = Math.max(0, 100 - (data.carbonFootprint / 10000) * 100);
    const energyScore = 80; // 假設值，需要實際數據
    const resourceScore = 75; // 假設值，需要實際數據

    return carbonScore * 0.5 + energyScore * 0.3 + resourceScore * 0.2;
  }

  private static calculateSocialScore(data: ESGReport['social']): number {
    return (
      data.employeeSatisfaction * 0.3 +
      data.diversityIndex * 0.2 +
      data.communityInvestment * 0.2 +
      data.supplyChainEthics * 0.15 +
      data.humanRights * 0.15
    );
  }
}

// 全域實例
export const esgCalculator = new ESGCalculator();
export const esgValidator = new ESGDataValidator();
export const esgReportGenerator = new ESGReportGenerator();
