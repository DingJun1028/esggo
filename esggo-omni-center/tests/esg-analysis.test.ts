/**
 * ==========================================
 * ESG 資料分析引擎 - 測試
 * ==========================================
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ESGAnalysisEngine } from '../src/lib/esg-analysis/engine';
import { ESGVisualizationEngine } from '../src/lib/esg-analysis/visualization';
import {
  EnvironmentalMetrics,
  SocialMetrics,
  GovernanceMetrics,
} from '../src/lib/esg-analysis/types';

// ==========================================
// 測試數據
// ==========================================

const mockEnvironmental: EnvironmentalMetrics = {
  carbonEmissions: {
    scope1: 500,
    scope2: 300,
    scope3: 200,
    total: 1000,
    unit: 'tCO2e',
    reductionTarget: 800,
    reductionProgress: 60,
  },
  energyConsumption: {
    renewable: 600,
    nonRenewable: 400,
    total: 1000,
    unit: 'MWh',
    efficiency: 75,
    renewableRatio: 60,
  },
  wasteManagement: {
    recycled: 800,
    landfilled: 150,
    incinerated: 50,
    total: 1000,
    unit: 'tonnes',
    recyclingRate: 80,
  },
  waterUsage: {
    freshwater: 5000,
    recycled: 2000,
    total: 7000,
    unit: 'm³',
    efficiency: 85,
    waterStress: 'medium',
  },
  biodiversityImpact: {
    score: 70,
    affectedArea: 50,
    mitigationMeasures: ['Reforestation', 'Habitat restoration'],
    netPositive: true,
  },
};

const mockSocial: SocialMetrics = {
  workforce: {
    totalEmployees: 1000,
    turnoverRate: 12,
    trainingHours: 24,
    satisfactionScore: 75,
    livingWage: true,
  },
  diversity: {
    genderDiversity: {
      female: 45,
      male: 52,
      nonBinary: 3,
    },
    ageDiversity: {
      under30: 30,
      between30and50: 50,
      over50: 20,
    },
    ethnicDiversity: 65,
    payEquityRatio: 0.95,
  },
  healthSafety: {
    incidentRate: 2.5,
    lostTimeInjuryRate: 1.2,
    nearMissReporting: 85,
    safetyTrainingHours: 16,
    fatalityCount: 0,
  },
  humanRights: {
    policyInPlace: true,
    dueDiligenceScore: 80,
    grievanceMechanism: true,
    supplierAuditRate: 75,
  },
  communityImpact: {
    investmentInCommunity: 500000,
    volunteerHours: 800,
    localEmploymentRate: 70,
    socialPrograms: 5,
  },
};

const mockGovernance: GovernanceMetrics = {
  boardComposition: {
    totalMembers: 11,
    independentDirectors: 75,
    femaleDirectors: 40,
    averageTenure: 4.5,
    diversityIndex: 70,
  },
  ethics: {
    codeOfEthics: true,
    antiCorruptionPolicy: true,
    whistleblowerMechanism: true,
    trainingCompletionRate: 95,
    violationsReported: 2,
  },
  transparency: {
    esgReporting: true,
    thirdPartyVerification: true,
    disclosureScore: 85,
    reportingStandards: ['GRI', 'SASB', 'TCFD'],
  },
  riskManagement: {
    esgRiskAssessment: true,
    climateRiskAssessment: true,
    cyberSecurityScore: 80,
    businessContinuityPlan: true,
  },
};

// ==========================================
// ESG 分析引擎測試
// ==========================================

describe('ESGAnalysisEngine', () => {
  let engine: ESGAnalysisEngine;

  beforeEach(() => {
    engine = ESGAnalysisEngine.getInstance();
  });

  it('should be a singleton', () => {
    const engine1 = ESGAnalysisEngine.getInstance();
    const engine2 = ESGAnalysisEngine.getInstance();
    expect(engine1).toBe(engine2);
  });

  it('should analyze ESG data', async () => {
    const result = await engine.analyze(
      mockEnvironmental,
      mockSocial,
      mockGovernance,
      {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
      }
    );

    expect(result).toBeDefined();
    expect(result.id).toContain('analysis-');
    expect(result.scores).toBeDefined();
    expect(result.insights).toBeDefined();
    expect(result.recommendations).toBeDefined();
    expect(result.benchmarks).toBeDefined();
    expect(result.trends).toBeDefined();
  });

  it('should calculate ESG scores correctly', async () => {
    const result = await engine.analyze(
      mockEnvironmental,
      mockSocial,
      mockGovernance,
      {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
      }
    );

    expect(result.scores.overall).toBeGreaterThan(0);
    expect(result.scores.overall).toBeLessThanOrEqual(100);
    expect(result.scores.environmental.score).toBeGreaterThan(0);
    expect(result.scores.social.score).toBeGreaterThan(0);
    expect(result.scores.governance.score).toBeGreaterThan(0);
  });

  it('should generate insights', async () => {
    const result = await engine.analyze(
      mockEnvironmental,
      mockSocial,
      mockGovernance,
      {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
      }
    );

    expect(result.insights.length).toBeGreaterThan(0);
    result.insights.forEach((insight) => {
      expect(insight.id).toBeDefined();
      expect(insight.category).toBeDefined();
      expect(insight.type).toBeDefined();
      expect(insight.title).toBeDefined();
      expect(insight.description).toBeDefined();
    });
  });

  it('should generate recommendations', async () => {
    const result = await engine.analyze(
      mockEnvironmental,
      mockSocial,
      mockGovernance,
      {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
      }
    );

    expect(result.recommendations.length).toBeGreaterThan(0);
    result.recommendations.forEach((rec) => {
      expect(rec.id).toBeDefined();
      expect(rec.category).toBeDefined();
      expect(rec.priority).toBeDefined();
      expect(rec.title).toBeDefined();
      expect(rec.description).toBeDefined();
    });
  });

  it('should compare with benchmarks', async () => {
    const result = await engine.analyze(
      mockEnvironmental,
      mockSocial,
      mockGovernance,
      {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
      }
    );

    expect(result.benchmarks.length).toBeGreaterThan(0);
    result.benchmarks.forEach((bm) => {
      expect(bm.category).toBeDefined();
      expect(bm.metric).toBeDefined();
      expect(bm.value).toBeDefined();
      expect(bm.industryAverage).toBeDefined();
      expect(bm.industryBest).toBeDefined();
    });
  });

  it('should analyze trends', async () => {
    const result = await engine.analyze(
      mockEnvironmental,
      mockSocial,
      mockGovernance,
      {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
      }
    );

    expect(result.trends.length).toBeGreaterThan(0);
    result.trends.forEach((trend) => {
      expect(trend.category).toBeDefined();
      expect(trend.metric).toBeDefined();
      expect(trend.direction).toBeDefined();
      expect(trend.changeRate).toBeDefined();
    });
  });

  it('should generate report', async () => {
    const result = await engine.analyze(
      mockEnvironmental,
      mockSocial,
      mockGovernance,
      {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
      }
    );

    const report = engine.generateReport(result);
    expect(report).toBeDefined();
    expect(report).toContain('ESG 分析報告');
    expect(report).toContain('整體分數');
    expect(report).toContain('環境 (E)');
    expect(report).toContain('社會 (S)');
    expect(report).toContain('治理 (G)');
  });

  it('should add data points', () => {
    const dataPoint = {
      id: 'dp-1',
      timestamp: new Date(),
      category: 'environmental' as const,
      metric: 'carbonEmissions',
      value: 100,
      unit: 'tCO2e',
      source: 'manual',
    };

    engine.addDataPoint(dataPoint);
    // 驗證沒有拋出錯誤
  });

  it('should add multiple data points', () => {
    const dataPoints = [
      {
        id: 'dp-1',
        timestamp: new Date(),
        category: 'environmental' as const,
        metric: 'carbonEmissions',
        value: 100,
        unit: 'tCO2e',
        source: 'manual',
      },
      {
        id: 'dp-2',
        timestamp: new Date(),
        category: 'social' as const,
        metric: 'employeeCount',
        value: 1000,
        unit: 'people',
        source: 'hr-system',
      },
    ];

    engine.addDataPoints(dataPoints);
    // 驗證沒有拋出錯誤
  });
});

// ==========================================
// ESG 視覺化引擎測試
// ==========================================

describe('ESGVisualizationEngine', () => {
  let visualizationEngine: ESGVisualizationEngine;
  let analysisEngine: ESGAnalysisEngine;

  beforeEach(() => {
    visualizationEngine = ESGVisualizationEngine.getInstance();
    analysisEngine = ESGAnalysisEngine.getInstance();
  });

  it('should be a singleton', () => {
    const engine1 = ESGVisualizationEngine.getInstance();
    const engine2 = ESGVisualizationEngine.getInstance();
    expect(engine1).toBe(engine2);
  });

  it('should generate radar chart', async () => {
    const result = await analysisEngine.analyze(
      mockEnvironmental,
      mockSocial,
      mockGovernance,
      {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
      }
    );

    const chart = visualizationEngine.generateRadarChart(result.scores);
    expect(chart).toBeDefined();
    expect(chart.type).toBe('radar');
    expect(chart.data).toBeDefined();
  });

  it('should generate bar chart', async () => {
    const result = await analysisEngine.analyze(
      mockEnvironmental,
      mockSocial,
      mockGovernance,
      {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
      }
    );

    const chart = visualizationEngine.generateBarChart(result.benchmarks);
    expect(chart).toBeDefined();
    expect(chart.type).toBe('bar');
    expect(chart.data).toBeDefined();
  });

  it('should generate pie chart', async () => {
    const result = await analysisEngine.analyze(
      mockEnvironmental,
      mockSocial,
      mockGovernance,
      {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
      }
    );

    const chart = visualizationEngine.generatePieChart(result.scores);
    expect(chart).toBeDefined();
    expect(chart.type).toBe('pie');
    expect(chart.data).toBeDefined();
  });

  it('should generate gauge chart', () => {
    const chart = visualizationEngine.generateGaugeChart(75, '環境');
    expect(chart).toBeDefined();
    expect(chart.type).toBe('gauge');
    expect(chart.data).toBeDefined();
  });

  it('should generate line chart', async () => {
    const result = await analysisEngine.analyze(
      mockEnvironmental,
      mockSocial,
      mockGovernance,
      {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
      }
    );

    const chart = visualizationEngine.generateLineChart(result.trends);
    expect(chart).toBeDefined();
    expect(chart.type).toBe('line');
    expect(chart.data).toBeDefined();
  });

  it('should generate table', async () => {
    const result = await analysisEngine.analyze(
      mockEnvironmental,
      mockSocial,
      mockGovernance,
      {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
      }
    );

    const table = visualizationEngine.generateTable(result.benchmarks);
    expect(table).toBeDefined();
    expect(table.type).toBe('table');
    expect(table.data).toBeDefined();
  });

  it('should generate dashboard', async () => {
    const result = await analysisEngine.analyze(
      mockEnvironmental,
      mockSocial,
      mockGovernance,
      {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
      }
    );

    const dashboard = visualizationEngine.generateDashboard(result);
    expect(dashboard).toBeDefined();
    expect(dashboard.type).toBe('dashboard');
    expect(dashboard.components.length).toBeGreaterThan(0);
  });

  it('should generate HTML report', async () => {
    const result = await analysisEngine.analyze(
      mockEnvironmental,
      mockSocial,
      mockGovernance,
      {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
      }
    );

    const html = visualizationEngine.generateHTMLReport(result);
    expect(html).toBeDefined();
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('ESG 分析報告');
    expect(html).toContain('Chart');
  });
});
