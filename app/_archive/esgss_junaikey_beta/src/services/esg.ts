// ESG Proprietary Services
export interface CarbonEmission {
  id: string;
  companyId: string;
  year: number;
  scope1: number; // Direct emissions
  scope2: number; // Indirect emissions (Energy)
  scope3: number; // Other indirect emissions
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
  boardComposition: number; // Board composition (0-100)
  executiveCompensation: number; // Executive compensation transparency (0-100)
  shareholderRights: number; // Shareholder rights (0-100)
  auditQuality: number; // Audit quality (0-100)
  riskManagement: number; // Risk management (0-100)
  overallScore: number; // Overall governance score (0-100)
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

// ESG Calculation Engine
export class ESGCalculator {
  // Calculate carbon intensity
  static calculateCarbonIntensity(emissions: number, revenue: number): number {
    return revenue > 0 ? (emissions / revenue) * 1000000 : 0; // tons CO2/million USD revenue
  }

  // Calculate overall ESG score
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

  // Calculate SDG contribution
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

  // Calculate diversity index
  static calculateDiversityIndex(workforce: {
    gender: { male: number; female: number; other: number };
    age: { under30: number; age30to50: number; over50: number };
    ethnicity: Record<string, number>;
  }): number {
    const totalEmployees = Object.values(workforce.gender).reduce((a, b) => a + b, 0);

    if (totalEmployees === 0) return 0;

    // Gender diversity (0-25 points)
    const genderRatio = Math.min(workforce.gender.female / totalEmployees, 0.5) * 2;
    const genderScore = genderRatio * 25;

    // Age diversity (0-25 points)
    const ageDistribution = Object.values(workforce.age).map(count => count / totalEmployees);
    const ageEntropy = -ageDistribution.reduce((sum, p) => sum + (p > 0 ? p * Math.log2(p) : 0), 0);
    const maxEntropy = Math.log2(3); // 3 age groups
    const ageScore = (ageEntropy / maxEntropy) * 25;

    // Ethnicity diversity (0-50 points)
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

  // Calculate supply chain risk score
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
      revenue: number; // Supplier revenue share
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

  // Calculate climate change risk assessment
  static assessClimateRisk(exposure: {
    physical: {
      acute: number; // Acute risk (0-100)
      chronic: number; // Chronic risk (0-100)
    };
    transition: {
      policy: number; // Policy risk (0-100)
      technology: number; // Technology risk (0-100)
      market: number; // Market risk (0-100)
    };
    opportunities: {
      resourceEfficiency: number; // Resource efficiency opportunity (0-100)
      energyTransition: number; // Energy transition opportunity (0-100)
      productInnovation: number; // Product innovation opportunity (0-100)
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

  // Calculate stakeholder engagement
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

// ESG Data Validator
export class ESGDataValidator {
  // Validate carbon emission data
  static validateCarbonData(data: Partial<CarbonEmission>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.year && (data.year < 2000 || data.year > new Date().getFullYear() + 1)) {
      errors.push('Year must be between 2000 and next year');
    }

    if (data.scope1 !== undefined && data.scope1 < 0) {
      errors.push('Scope 1 emissions cannot be negative');
    }

    if (data.scope2 !== undefined && data.scope2 < 0) {
      errors.push('Scope 2 emissions cannot be negative');
    }

    if (data.scope3 !== undefined && data.scope3 < 0) {
      errors.push('Scope 3 emissions cannot be negative');
    }

    const total = (data.scope1 || 0) + (data.scope2 || 0) + (data.scope3 || 0);
    if (data.total !== undefined && Math.abs(data.total - total) > 0.01) {
      errors.push('Total emissions do not match the sum of Scope 1+2+ 3');
    }

    if (data.reductionTarget !== undefined && data.reductionTarget < 0) {
      errors.push('Reduction target cannot be negative');
    }

    if (data.reductionAchieved !== undefined && data.reductionAchieved < 0) {
      errors.push('Reduction achieved cannot be negative');
    }

    return { isValid: errors.length === 0, errors };
  }

  // Validate social impact data
  static validateSocialData(data: Partial<SocialImpact>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.category) {
      errors.push('Category must be specified');
    }

    if (!data.metric) {
      errors.push('Metric name must be specified');
    }

    if (data.year && (data.year < 2000 || data.year > new Date().getFullYear() + 1)) {
      errors.push('Year must be between 2000 and next year');
    }

    if (data.target !== undefined && data.target < 0) {
      errors.push('Target value cannot be negative');
    }

    return { isValid: errors.length === 0, errors };
  }

  // Validate governance scores
  static validateGovernanceData(data: Partial<GovernanceScore>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (data.year && (data.year < 2000 || data.year > new Date().getFullYear() + 1)) {
      errors.push('Year must be between 2000 and next year');
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
        errors.push(`${field} score must be between 0-100`);
      }
    });

    if (data.overallScore !== undefined && (data.overallScore < 0 || data.overallScore > 100)) {
      errors.push('Overall score must be between 0-100');
    }

    return { isValid: errors.length === 0, errors };
  }

  // Determine rating based on score
  static getRatingFromScore(score: number): 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' {
    if (score >= 95) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 75) return 'B+';
    if (score >= 65) return 'B';
    if (score >= 55) return 'C+';
    if (score >= 45) return 'C';
    return 'D';
  }

  // Check data consistency
  static checkDataConsistency(reports: ESGReport[]): {
    inconsistencies: Array<{
      reportId: string;
      field: string;
      issue: string;
    }>;
    score: number; // 0-100, Data consistency score
  } {
    const inconsistencies: Array<{
      reportId: string;
      field: string;
      issue: string;
    }> = [];

    // Check consistency of annual trends
    const sortedReports = reports.sort((a, b) => a.year - b.year);

    for (let i = 1; i < sortedReports.length; i++) {
      const current = sortedReports[i];
      const previous = sortedReports[i - 1];

      if (!current || !previous) continue;

      // Environmental metric trend check
      if (current.environmental.carbonFootprint < previous.environmental.carbonFootprint * 0.5) {
        inconsistencies.push({
          reportId: current.id,
          field: 'environmental.carbonFootprint',
          issue: `Carbon footprint significantly dropped from ${previous.environmental.carbonFootprint} in ${previous.year} to ${current.environmental.carbonFootprint}, please verify data accuracy`,
        });
      }

      // Social metric continuity check
      if (
        Math.abs(current.social.employeeSatisfaction - previous.social.employeeSatisfaction) > 30
      ) {
        inconsistencies.push({
          reportId: current.id,
          field: 'social.employeeSatisfaction',
          issue: `Employee satisfaction changed significantly (${previous.social.employeeSatisfaction} → ${current.social.employeeSatisfaction})`,
        });
      }
    }

    // Calculate consistency score
    const totalChecks = sortedReports.length * 6; // 6 major metrics per report
    const consistencyScore = Math.max(0, 100 - (inconsistencies.length / totalChecks) * 100);

    return {
      inconsistencies,
      score: consistencyScore,
    };
  }
}

// ESG Report Generator
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
    // Calculate environmental score
    const latestCarbon = data.carbonData
      .filter(c => c.year === year)
      .sort((a, b) => b.lastUpdated - a.lastUpdated)[0];

    const environmental = {
      carbonFootprint: latestCarbon?.total || 0,
      energyConsumption: 0, // Requires additional data
      waterUsage: 0,
      wasteGeneration: 0,
      biodiversityImpact: 0,
    };

    // Calculate social score
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

    // Governance score
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

    // Calculate overall score
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
      title: `${year} Annual ESG Sustainability Report`,
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
    // Simplified environmental score calculation
    const carbonScore = Math.max(0, 100 - (data.carbonFootprint / 10000) * 100);
    const energyScore = 80; // Assumed value, requires actual data
    const resourceScore = 75; // Assumed value, requires actual data

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

// Global Instances
export const esgCalculator = new ESGCalculator();
export const esgValidator = new ESGDataValidator();
export const esgReportGenerator = new ESGReportGenerator();
