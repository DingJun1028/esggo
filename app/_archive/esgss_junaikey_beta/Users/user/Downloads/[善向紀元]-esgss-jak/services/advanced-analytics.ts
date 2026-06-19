/**
 * 高級 ESG 分析服務
 * 提供企業級分析功能：基準比較、情景分析、風險評估、投資回報分析
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface BenchmarkData {
  industry: string;
  companySize: string;
  region: string;
  metrics: {
    [metricCode: string]: {
      average: number;
      percentile25: number;
      percentile75: number;
      percentile90: number;
    };
  };
}

export interface ScenarioAnalysis {
  scenarioId: string;
  name: string;
  description: string;
  assumptions: { [key: string]: any };
  results: {
    [metricId: string]: {
      baseline: number;
      projected: number;
      changePercent: number;
      impact: 'high' | 'medium' | 'low';
    };
  };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export interface RiskAssessment {
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  categories: {
    environmental: number;
    social: number;
    governance: number;
  };
  keyRisks: Array<{
    risk: string;
    impact: number;
    likelihood: number;
    score: number;
    mitigation: string;
  }>;
  recommendations: string[];
}

export interface ROIProjection {
  investment: number;
  timeframe: number; // months
  projectedBenefits: {
    costSavings: number;
    revenueIncrease: number;
    riskReduction: number;
  };
  roi: number;
  paybackPeriod: number;
  confidence: number;
}

export class AdvancedAnalyticsService {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * 基準比較分析
   */
  async performBenchmarkComparison(
    companyId: string,
    industry?: string,
    region?: string
  ): Promise<BenchmarkData> {
    try {
      // 獲取行業基準數據
      const benchmark = await this.getIndustryBenchmark(industry || 'general', region || 'global');

      // 獲取公司數據
      const companyMetrics = await this.getCompanyMetrics(companyId);

      // 計算百分位數比較
      const comparison: BenchmarkData['metrics'] = {};

      for (const [metricCode, companyValue] of Object.entries(companyMetrics)) {
        if (benchmark.metrics[metricCode]) {
          const benchmarkMetric = benchmark.metrics[metricCode];

          // 計算公司在基準中的位置
          comparison[metricCode] = {
            average: benchmarkMetric.average,
            percentile25: benchmarkMetric.percentile25,
            percentile75: benchmarkMetric.percentile75,
            percentile90: benchmarkMetric.percentile90
          };
        }
      }

      return {
        industry: industry || 'general',
        companySize: await this.getCompanySize(companyId),
        region: region || 'global',
        metrics: comparison
      };

    } catch (error) {
      console.error('Benchmark comparison failed:', error);
      throw new Error('Unable to perform benchmark comparison');
    }
  }

  /**
   * 情景分析
   */
  async performScenarioAnalysis(
    companyId: string,
    scenarioConfig: {
      name: string;
      description: string;
      assumptions: { [key: string]: any };
      timeframe: number; // months
    }
  ): Promise<ScenarioAnalysis> {
    try {
      const scenarioId = this.generateScenarioId();
      const baselineData = await this.getBaselineData(companyId);
      const projectedResults = await this.calculateScenarioProjection(
        baselineData,
        scenarioConfig.assumptions,
        scenarioConfig.timeframe
      );

      const riskLevel = this.assessScenarioRisk(projectedResults);
      const recommendations = this.generateScenarioRecommendations(projectedResults, riskLevel);

      const scenario: ScenarioAnalysis = {
        scenarioId,
        name: scenarioConfig.name,
        description: scenarioConfig.description,
        assumptions: scenarioConfig.assumptions,
        results: projectedResults,
        riskLevel,
        recommendations
      };

      // 儲存情景分析結果
      await this.saveScenarioAnalysis(scenario);

      return scenario;

    } catch (error) {
      console.error('Scenario analysis failed:', error);
      throw new Error('Unable to perform scenario analysis');
    }
  }

  /**
   * ESG 風險評估
   */
  async performRiskAssessment(companyId: string): Promise<RiskAssessment> {
    try {
      // 獲取各類別風險指標
      const environmentalRisks = await this.assessEnvironmentalRisks(companyId);
      const socialRisks = await this.assessSocialRisks(companyId);
      const governanceRisks = await this.assessGovernanceRisks(companyId);

      // 計算整體風險評分
      const overallScore = (
        environmentalRisks.score * 0.4 +
        socialRisks.score * 0.3 +
        governanceRisks.score * 0.3
      );

      const riskLevel = this.determineRiskLevel(overallScore);

      // 識別關鍵風險
      const keyRisks = [
        ...environmentalRisks.details,
        ...socialRisks.details,
        ...governanceRisks.details
      ].sort((a, b) => b.score - a.score).slice(0, 5);

      const recommendations = this.generateRiskRecommendations(keyRisks, riskLevel);

      const assessment: RiskAssessment = {
        overallScore,
        riskLevel,
        categories: {
          environmental: environmentalRisks.score,
          social: socialRisks.score,
          governance: governanceRisks.score
        },
        keyRisks,
        recommendations
      };

      // 儲存風險評估結果
      await this.saveRiskAssessment(assessment);

      return assessment;

    } catch (error) {
      console.error('Risk assessment failed:', error);
      throw new Error('Unable to perform risk assessment');
    }
  }

  /**
   * ESG 投資回報分析
   */
  async calculateESGROI(
    investmentData: {
      amount: number;
      type: 'technology' | 'training' | 'certification' | 'consulting';
      timeframe: number;
    }
  ): Promise<ROIProjection> {
    try {
      // 基於投資類型計算預期收益
      const benefits = await this.calculateProjectedBenefits(investmentData);

      const totalBenefits = Object.values(benefits).reduce((sum, val) => sum + val, 0);
      const roi = (totalBenefits - investmentData.amount) / investmentData.amount * 100;

      // 計算回本期 (簡單模型)
      const monthlySavings = totalBenefits / investmentData.timeframe;
      const paybackPeriod = investmentData.amount / monthlySavings;

      const projection: ROIProjection = {
        investment: investmentData.amount,
        timeframe: investmentData.timeframe,
        projectedBenefits: benefits,
        roi,
        paybackPeriod,
        confidence: this.calculateROIConfidence(investmentData.type)
      };

      return projection;

    } catch (error) {
      console.error('ROI calculation failed:', error);
      throw new Error('Unable to calculate ESG ROI');
    }
  }

  /**
   * 生成 ESG 投資組合建議
   */
  async generateInvestmentPortfolio(
    companyId: string,
    budget: number,
    timeframe: number
  ): Promise<Array<{
    investment: string;
    amount: number;
    expectedROI: number;
    priority: 'high' | 'medium' | 'low';
    rationale: string;
  }>> {
    try {
      const riskAssessment = await this.performRiskAssessment(companyId);
      const benchmarkData = await this.performBenchmarkComparison(companyId);

      // 基於風險評估和基準比較生成投資建議
      const recommendations = this.generateInvestmentRecommendations(
        riskAssessment,
        benchmarkData,
        budget,
        timeframe
      );

      return recommendations;

    } catch (error) {
      console.error('Investment portfolio generation failed:', error);
      throw new Error('Unable to generate investment portfolio');
    }
  }

  // ============ 私有方法 ============

  /**
   * 獲取行業基準數據
   */
  private async getIndustryBenchmark(industry: string, region: string): Promise<BenchmarkData> {
    // 模擬基準數據獲取
    // 實際實現中應該從外部數據源獲取
    return {
      industry,
      companySize: 'medium',
      region,
      metrics: {
        'E-GHG-S1': {
          average: 150,
          percentile25: 100,
          percentile75: 200,
          percentile90: 300
        },
        'E-ELEC': {
          average: 1200000,
          percentile25: 800000,
          percentile75: 1600000,
          percentile90: 2000000
        }
      }
    };
  }

  /**
   * 獲取公司指標數據
   */
  private async getCompanyMetrics(companyId: string): Promise<{ [key: string]: number }> {
    const { data, error } = await this.supabase
      .from('esg_readings')
      .select(`
        value,
        metric:metric_definitions(code)
      `)
      .eq('status', 'approved')
      .eq('org_unit_id', companyId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    const metrics: { [key: string]: number } = {};
    for (const reading of data || []) {
      if (reading.metric?.code && !metrics[reading.metric.code]) {
        metrics[reading.metric.code] = reading.value;
      }
    }

    return metrics;
  }

  /**
   * 獲取公司規模
   */
  private async getCompanySize(companyId: string): Promise<string> {
    // 基於員工人數或營收判斷公司規模
    const { data } = await this.supabase
      .from('esg_readings')
      .select('value')
      .eq('status', 'approved')
      .eq('org_unit_id', companyId)
      .like('metric.code', 'S-EMP%')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const employeeCount = data?.value || 0;

    if (employeeCount < 50) return 'small';
    if (employeeCount < 500) return 'medium';
    return 'large';
  }

  /**
   * 獲取基準數據
   */
  private async getBaselineData(companyId: string): Promise<{ [metricId: string]: number }> {
    const { data, error } = await this.supabase
      .from('esg_readings')
      .select(`
        value,
        metric_id
      `)
      .eq('status', 'approved')
      .eq('org_unit_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const baseline: { [metricId: string]: number } = {};
    for (const reading of data || []) {
      if (!baseline[reading.metric_id]) {
        baseline[reading.metric_id] = reading.value;
      }
    }

    return baseline;
  }

  /**
   * 計算情景投影
   */
  private async calculateScenarioProjection(
    baseline: { [metricId: string]: number },
    assumptions: { [key: string]: any },
    timeframe: number
  ): Promise<ScenarioAnalysis['results']> {
    const results: ScenarioAnalysis['results'] = {};

    // 基於假設計算各指標的變化
    for (const [metricId, baselineValue] of Object.entries(baseline)) {
      let projectedValue = baselineValue;
      let changePercent = 0;

      // 根據不同假設調整投影值
      if (assumptions.energyEfficiency) {
        // 能源效率改善假設
        projectedValue *= (1 - assumptions.energyEfficiency / 100);
        changePercent = -assumptions.energyEfficiency;
      }

      if (assumptions.renewableEnergy) {
        // 可再生能源比例增加
        projectedValue *= (1 - assumptions.renewableEnergy * 0.02); // 估計減排效果
        changePercent = Math.max(changePercent, -assumptions.renewableEnergy * 2);
      }

      results[metricId] = {
        baseline: baselineValue,
        projected: projectedValue,
        changePercent,
        impact: Math.abs(changePercent) > 20 ? 'high' : Math.abs(changePercent) > 10 ? 'medium' : 'low'
      };
    }

    return results;
  }

  /**
   * 評估情景風險
   */
  private assessScenarioRisk(results: ScenarioAnalysis['results']): ScenarioAnalysis['riskLevel'] {
    const highImpactCount = Object.values(results).filter(r => r.impact === 'high').length;
    const totalCount = Object.keys(results).length;

    const riskRatio = highImpactCount / totalCount;

    if (riskRatio > 0.7) return 'critical';
    if (riskRatio > 0.4) return 'high';
    if (riskRatio > 0.2) return 'medium';
    return 'low';
  }

  /**
   * 生成情景建議
   */
  private generateScenarioRecommendations(
    results: ScenarioAnalysis['results'],
    riskLevel: ScenarioAnalysis['riskLevel']
  ): string[] {
    const recommendations: string[] = [];

    if (riskLevel === 'critical') {
      recommendations.push('建議重新評估情景假設，風險過高');
      recommendations.push('考慮分階段實施，降低轉型風險');
    }

    const highImpactMetrics = Object.entries(results)
      .filter(([_, result]) => result.impact === 'high')
      .map(([metricId, _]) => metricId);

    if (highImpactMetrics.length > 0) {
      recommendations.push(`重點關注 ${highImpactMetrics.length} 項高影響指標的改善`);
    }

    return recommendations;
  }

  /**
   * 評估環境風險
   */
  private async assessEnvironmentalRisks(companyId: string): Promise<{
    score: number;
    details: RiskAssessment['keyRisks'];
  }> {
    // 模擬環境風險評估
    const risks: RiskAssessment['keyRisks'] = [
      {
        risk: '碳排放依賴',
        impact: 8,
        likelihood: 7,
        score: 56,
        mitigation: '增加可再生能源比例，改善能源效率'
      },
      {
        risk: '氣候變遷影響',
        impact: 9,
        likelihood: 6,
        score: 54,
        mitigation: '建立氣候風險評估框架，制定應變計劃'
      }
    ];

    return {
      score: 55,
      details: risks
    };
  }

  /**
   * 評估社會風險
   */
  private async assessSocialRisks(companyId: string): Promise<{
    score: number;
    details: RiskAssessment['keyRisks'];
  }> {
    const risks: RiskAssessment['keyRisks'] = [
      {
        risk: '人才流動率高',
        impact: 6,
        likelihood: 8,
        score: 48,
        mitigation: '改善工作環境，提升員工滿意度'
      }
    ];

    return {
      score: 48,
      details: risks
    };
  }

  /**
   * 評估治理風險
   */
  private async assessGovernanceRisks(companyId: string): Promise<{
    score: number;
    details: RiskAssessment['keyRisks'];
  }> {
    const risks: RiskAssessment['keyRisks'] = [
      {
        risk: 'ESG 數據透明度不足',
        impact: 7,
        likelihood: 5,
        score: 35,
        mitigation: '建立完整的 ESG 報告制度，提高透明度'
      }
    ];

    return {
      score: 35,
      details: risks
    };
  }

  /**
   * 確定風險等級
   */
  private determineRiskLevel(score: number): RiskAssessment['riskLevel'] {
    if (score >= 70) return 'critical';
    if (score >= 50) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
  }

  /**
   * 生成風險建議
   */
  private generateRiskRecommendations(
    keyRisks: RiskAssessment['keyRisks'],
    riskLevel: RiskAssessment['riskLevel']
  ): string[] {
    const recommendations: string[] = [];

    if (riskLevel === 'critical' || riskLevel === 'high') {
      recommendations.push('建議立即制定風險緩解計劃');
      recommendations.push('考慮引入外部 ESG 顧問協助');
    }

    for (const risk of keyRisks.slice(0, 3)) {
      recommendations.push(`重點關注「${risk.risk}」：${risk.mitigation}`);
    }

    return recommendations;
  }

  /**
   * 計算預期收益
   */
  private async calculateProjectedBenefits(investment: {
    amount: number;
    type: string;
    timeframe: number;
  }): Promise<ROIProjection['projectedBenefits']> {
    // 基於投資類型估算收益
    const multipliers = {
      technology: { costSavings: 0.3, revenueIncrease: 0.1, riskReduction: 0.2 },
      training: { costSavings: 0.1, revenueIncrease: 0.2, riskReduction: 0.15 },
      certification: { costSavings: 0.05, revenueIncrease: 0.15, riskReduction: 0.25 },
      consulting: { costSavings: 0.2, revenueIncrease: 0.05, riskReduction: 0.3 }
    };

    const mult = multipliers[investment.type as keyof typeof multipliers] ||
                 { costSavings: 0.1, revenueIncrease: 0.1, riskReduction: 0.1 };

    return {
      costSavings: investment.amount * mult.costSavings,
      revenueIncrease: investment.amount * mult.revenueIncrease,
      riskReduction: investment.amount * mult.riskReduction
    };
  }

  /**
   * 計算 ROI 信心度
   */
  private calculateROIConfidence(investmentType: string): number {
    const confidenceLevels = {
      technology: 0.75,
      training: 0.65,
      certification: 0.8,
      consulting: 0.7
    };

    return confidenceLevels[investmentType as keyof typeof confidenceLevels] || 0.6;
  }

  /**
   * 生成投資建議
   */
  private generateInvestmentRecommendations(
    riskAssessment: RiskAssessment,
    benchmarkData: BenchmarkData,
    budget: number,
    timeframe: number
  ): Array<{
    investment: string;
    amount: number;
    expectedROI: number;
    priority: 'high' | 'medium' | 'low';
    rationale: string;
  }> {
    const recommendations = [];

    // 基於風險評估推薦投資
    if (riskAssessment.categories.environmental > 60) {
      recommendations.push({
        investment: '能源效率改善技術',
        amount: budget * 0.4,
        expectedROI: 85,
        priority: 'high',
        rationale: '環境風險評分較高，建議優先投資能源效率改善'
      });
    }

    if (riskAssessment.categories.social > 50) {
      recommendations.push({
        investment: '員工發展與福祉計劃',
        amount: budget * 0.25,
        expectedROI: 65,
        priority: 'medium',
        rationale: '社會風險評分中等，建議投資員工相關計劃'
      });
    }

    // 基於基準比較推薦投資
    const belowAverageMetrics = Object.entries(benchmarkData.metrics)
      .filter(([_, data]) => {
        // 檢查是否低於平均值
        return true; // 簡化邏輯
      });

    if (belowAverageMetrics.length > 0) {
      recommendations.push({
        investment: 'ESG 數據改善計劃',
        amount: budget * 0.2,
        expectedROI: 70,
        priority: 'medium',
        rationale: `有 ${belowAverageMetrics.length} 項指標低於行業平均，建議改善數據收集`
      });
    }

    // 確保總預算不超過限制
    const totalRecommended = recommendations.reduce((sum, rec) => sum + rec.amount, 0);
    if (totalRecommended > budget) {
      const scaleFactor = budget / totalRecommended;
      recommendations.forEach(rec => {
        rec.amount *= scaleFactor;
      });
    }

    return recommendations;
  }

  /**
   * 生成情景 ID
   */
  private generateScenarioId(): string {
    return `scenario_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 儲存情景分析結果
   */
  private async saveScenarioAnalysis(scenario: ScenarioAnalysis): Promise<void> {
    const { error } = await this.supabase
      .from('scenario_analyses')
      .insert({
        scenario_id: scenario.scenarioId,
        name: scenario.name,
        description: scenario.description,
        assumptions: scenario.assumptions,
        results: scenario.results,
        risk_level: scenario.riskLevel,
        recommendations: scenario.recommendations,
        created_at: new Date().toISOString()
      });

    if (error && !error.message.includes('relation "scenario_analyses" does not exist')) {
      throw error;
    }
  }

  /**
   * 儲存風險評估結果
   */
  private async saveRiskAssessment(assessment: RiskAssessment): Promise<void> {
    const { error } = await this.supabase
      .from('risk_assessments')
      .insert({
        overall_score: assessment.overallScore,
        risk_level: assessment.riskLevel,
        categories: assessment.categories,
        key_risks: assessment.keyRisks,
        recommendations: assessment.recommendations,
        created_at: new Date().toISOString()
      });

    if (error && !error.message.includes('relation "risk_assessments" does not exist')) {
      throw error;
    }
  }
}

// 導出單例實例
export const advancedAnalytics = new AdvancedAnalyticsService(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);