/**
 * ==========================================
 * ESG 資料分析引擎 - 核心分析模組
 * ==========================================
 */

import {
  ESGDataPoint,
  ESGCategory,
  EnvironmentalMetrics,
  SocialMetrics,
  GovernanceMetrics,
  ESGAnalysisResult,
  ESGScores,
  ScoreBreakdown,
  ESGInsight,
  ESGRecommendation,
  ESGBenchmark,
  ESGTrend,
} from './types';

// ==========================================
// ESG 分析引擎
// ==========================================

export class ESGAnalysisEngine {
  private static instance: ESGAnalysisEngine;
  
  // 業務基準數據
  private benchmarks: Map<string, ESGBenchmark> = new Map();
  
  // 歷史數據
  private historicalData: Map<string, ESGDataPoint[]> = new Map();

  private constructor() {
    this.initializeBenchmarks();
  }

  static getInstance(): ESGAnalysisEngine {
    if (!ESGAnalysisEngine.instance) {
      ESGAnalysisEngine.instance = new ESGAnalysisEngine();
    }
    return ESGAnalysisEngine.instance;
  }

  // ==========================================
  // 初始化基準數據
  // ==========================================

  private initializeBenchmarks(): void {
    // 環境基準
    this.setBenchmark({
      category: 'environmental',
      metric: 'carbonEmissionsIntensity',
      value: 0,
      industryAverage: 2.5,
      industryBest: 0.5,
      unit: 'tCO2e/revenue_million',
    });

    this.setBenchmark({
      category: 'environmental',
      metric: 'renewableEnergyRatio',
      value: 0,
      industryAverage: 35,
      industryBest: 100,
      unit: '%',
    });

    this.setBenchmark({
      category: 'environmental',
      metric: 'recyclingRate',
      value: 0,
      industryAverage: 45,
      industryBest: 95,
      unit: '%',
    });

    // 社會基準
    this.setBenchmark({
      category: 'social',
      metric: 'employeeTurnoverRate',
      value: 0,
      industryAverage: 15,
      industryBest: 5,
      unit: '%',
    });

    this.setBenchmark({
      category: 'social',
      metric: 'genderDiversityIndex',
      value: 0,
      industryAverage: 45,
      industryBest: 60,
      unit: '%',
    });

    this.setBenchmark({
      category: 'social',
      metric: 'safetyIncidentRate',
      value: 0,
      industryAverage: 3.0,
      industryBest: 0.5,
      unit: 'per_200k_hours',
    });

    // 治理基準
    this.setBenchmark({
      category: 'governance',
      metric: 'boardIndependence',
      value: 0,
      industryAverage: 60,
      industryBest: 90,
      unit: '%',
    });

    this.setBenchmark({
      category: 'governance',
      metric: 'disclosureScore',
      value: 0,
      industryAverage: 65,
      industryBest: 95,
      unit: 'score',
    });
  }

  private setBenchmark(benchmark: ESGBenchmark): void {
    const key = `${benchmark.category}:${benchmark.metric}`;
    this.benchmarks.set(key, benchmark);
  }

  // ==========================================
  // 資料收集
  // ==========================================

  addDataPoint(dataPoint: ESGDataPoint): void {
    const key = `${dataPoint.category}:${dataPoint.metric}`;
    const existing = this.historicalData.get(key) || [];
    existing.push(dataPoint);
    this.historicalData.set(key, existing);
  }

  addDataPoints(dataPoints: ESGDataPoint[]): void {
    dataPoints.forEach((dp) => this.addDataPoint(dp));
  }

  // ==========================================
  // 分析方法
  // ==========================================

  /**
   * 執行完整 ESG 分析
   */
  async analyze(
    environmental: EnvironmentalMetrics,
    social: SocialMetrics,
    governance: GovernanceMetrics,
    period: { start: Date; end: Date }
  ): Promise<ESGAnalysisResult> {
    const scores = this.calculateScores(environmental, social, governance);
    const insights = this.generateInsights(environmental, social, governance);
    const recommendations = this.generateRecommendations(scores, insights);
    const benchmarks = this.compareWithBenchmarks(environmental, social, governance);
    const trends = this.analyzeTrends();

    return {
      id: `analysis-${Date.now()}`,
      timestamp: new Date(),
      period,
      scores,
      insights,
      recommendations,
      benchmarks,
      trends,
    };
  }

  /**
   * 計算 ESG 分數
   */
  private calculateScores(
    environmental: EnvironmentalMetrics,
    social: SocialMetrics,
    governance: GovernanceMetrics
  ): ESGScores {
    const envScore = this.calculateEnvironmentalScore(environmental);
    const socScore = this.calculateSocialScore(social);
    const govScore = this.calculateGovernanceScore(governance);

    const overall = (envScore.score + socScore.score + govScore.score) / 3;

    return {
      environmental: envScore,
      social: socScore,
      governance: govScore,
      overall: Math.round(overall * 10) / 10,
    };
  }

  /**
   * 計算環境分數
   */
  private calculateEnvironmentalScore(metrics: EnvironmentalMetrics): ScoreBreakdown {
    let score = 0;
    let factors = 0;

    // 碳排放 (30%)
    const carbonScore = this.evaluateCarbonEmissions(metrics.carbonEmissions);
    score += carbonScore * 0.3;
    factors += 0.3;

    // 能源 (25%)
    const energyScore = this.evaluateEnergyConsumption(metrics.energyConsumption);
    score += energyScore * 0.25;
    factors += 0.25;

    // 廢棄物 (20%)
    const wasteScore = this.evaluateWasteManagement(metrics.wasteManagement);
    score += wasteScore * 0.2;
    factors += 0.2;

    // 水資源 (15%)
    const waterScore = this.evaluateWaterUsage(metrics.waterUsage);
    score += waterScore * 0.15;
    factors += 0.15;

    // 生物多樣性 (10%)
    const bioScore = metrics.biodiversityImpact.score;
    score += bioScore * 0.1;
    factors += 0.1;

    const normalizedScore = score / factors;
    return this.createScoreBreakdown(normalizedScore);
  }

  private evaluateCarbonEmissions(emissions: EnvironmentalMetrics['carbonEmissions']): number {
    // 碳排放評估 (越低越好)
    const intensity = emissions.total / 1000; // 假設基準
    if (intensity < 0.5) return 95;
    if (intensity < 1.0) return 85;
    if (intensity < 2.0) return 70;
    if (intensity < 3.0) return 55;
    if (intensity < 5.0) return 40;
    return 25;
  }

  private evaluateEnergyConsumption(energy: EnvironmentalMetrics['energyConsumption']): number {
    // 能源評估 (可再生能源比例越高越好)
    const renewableRatio = energy.renewableRatio;
    if (renewableRatio > 80) return 95;
    if (renewableRatio > 60) return 80;
    if (renewableRatio > 40) return 65;
    if (renewableRatio > 20) return 50;
    return 30;
  }

  private evaluateWasteManagement(waste: EnvironmentalMetrics['wasteManagement']): number {
    // 廢棄物評估 (回收率越高越好)
    const recyclingRate = waste.recyclingRate;
    if (recyclingRate > 80) return 95;
    if (recyclingRate > 60) return 80;
    if (recyclingRate > 40) return 65;
    if (recyclingRate > 20) return 50;
    return 30;
  }

  private evaluateWaterUsage(water: EnvironmentalMetrics['waterUsage']): number {
    // 水資源評估
    let score = 0;
    
    // 效率評分
    if (water.efficiency > 90) score += 50;
    else if (water.efficiency > 70) score += 40;
    else if (water.efficiency > 50) score += 30;
    else score += 20;

    // 水壓力評分
    if (water.waterStress === 'low') score += 50;
    else if (water.waterStress === 'medium') score += 35;
    else score += 20;

    return score;
  }

  /**
   * 計算社會分數
   */
  private calculateSocialScore(metrics: SocialMetrics): ScoreBreakdown {
    let score = 0;
    let factors = 0;

    // 勞動力 (30%)
    const workforceScore = this.evaluateWorkforce(metrics.workforce);
    score += workforceScore * 0.3;
    factors += 0.3;

    // 多元性 (25%)
    const diversityScore = this.evaluateDiversity(metrics.diversity);
    score += diversityScore * 0.25;
    factors += 0.25;

    // 健康安全 (25%)
    const safetyScore = this.evaluateHealthSafety(metrics.healthSafety);
    score += safetyScore * 0.25;
    factors += 0.25;

    // 人權 (10%)
    const humanRightsScore = this.evaluateHumanRights(metrics.humanRights);
    score += humanRightsScore * 0.1;
    factors += 0.1;

    // 社區影響 (10%)
    const communityScore = this.evaluateCommunityImpact(metrics.communityImpact);
    score += communityScore * 0.1;
    factors += 0.1;

    const normalizedScore = score / factors;
    return this.createScoreBreakdown(normalizedScore);
  }

  private evaluateWorkforce(workforce: SocialMetrics['workforce']): number {
    let score = 0;

    // 滿意度
    score += workforce.satisfactionScore * 0.4;

    // 流動率 (越低越好)
    if (workforce.turnoverRate < 10) score += 30;
    else if (workforce.turnoverRate < 15) score += 25;
    else if (workforce.turnoverRate < 20) score += 20;
    else score += 10;

    // 培訓時數
    if (workforce.trainingHours > 40) score += 30;
    else if (workforce.trainingHours > 20) score += 25;
    else if (workforce.trainingHours > 10) score += 20;
    else score += 10;

    return score;
  }

  private evaluateDiversity(diversity: SocialMetrics['diversity']): number {
    // 多元性評估
    const genderScore = diversity.genderDiversity.nonBinary > 0 
      ? Math.min(100, diversity.genderDiversity.female * 2)
      : diversity.genderDiversity.female * 1.8;

    const ethnicScore = diversity.ethnicDiversity;
    const payEquityScore = diversity.payEquityRatio * 100;

    return (genderScore + ethnicScore + payEquityScore) / 3;
  }

  private evaluateHealthSafety(safety: SocialMetrics['healthSafety']): number {
    // 安全評估 (事故率越低越好)
    let score = 100;

    // 事故率扣分
    if (safety.incidentRate > 5) score -= 40;
    else if (safety.incidentRate > 3) score -= 30;
    else if (safety.incidentRate > 1) score -= 20;
    else score -= 10;

    // 培訓加分
    if (safety.safetyTrainingHours > 20) score += 10;
    else if (safety.safetyTrainingHours > 10) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  private evaluateHumanRights(humanRights: SocialMetrics['humanRights']): number {
    let score = 0;

    if (humanRights.policyInPlace) score += 25;
    if (humanRights.dueDiligenceScore > 80) score += 35;
    else if (humanRights.dueDiligenceScore > 60) score += 25;
    else score += 15;

    if (humanRights.grievanceMechanism) score += 20;
    if (humanRights.supplierAuditRate > 80) score += 20;
    else if (humanRights.supplierAuditRate > 50) score += 15;
    else score += 5;

    return score;
  }

  private evaluateCommunityImpact(community: SocialMetrics['communityImpact']): number {
    let score = 0;

    // 社區投資 (相對評估)
    if (community.investmentInCommunity > 1000000) score += 40;
    else if (community.investmentInCommunity > 500000) score += 30;
    else if (community.investmentInCommunity > 100000) score += 20;
    else score += 10;

    // 志工時數
    if (community.volunteerHours > 1000) score += 30;
    else if (community.volunteerHours > 500) score += 25;
    else if (community.volunteerHours > 100) score += 15;
    else score += 5;

    // 本地僱用率
    score += community.localEmploymentRate * 0.3;

    return Math.min(100, score);
  }

  /**
   * 計算治理分數
   */
  private calculateGovernanceScore(metrics: GovernanceMetrics): ScoreBreakdown {
    let score = 0;
    let factors = 0;

    // 董事會組成 (30%)
    const boardScore = this.evaluateBoardComposition(metrics.boardComposition);
    score += boardScore * 0.3;
    factors += 0.3;

    // 道德規範 (30%)
    const ethicsScore = this.evaluateEthics(metrics.ethics);
    score += ethicsScore * 0.3;
    factors += 0.3;

    // 透明度 (25%)
    const transparencyScore = this.evaluateTransparency(metrics.transparency);
    score += transparencyScore * 0.25;
    factors += 0.25;

    // 風險管理 (15%)
    const riskScore = this.evaluateRiskManagement(metrics.riskManagement);
    score += riskScore * 0.15;
    factors += 0.15;

    const normalizedScore = score / factors;
    return this.createScoreBreakdown(normalizedScore);
  }

  private evaluateBoardComposition(board: GovernanceMetrics['boardComposition']): number {
    let score = 0;

    // 獨立董事比例
    score += board.independentDirectors * 0.4;

    // 性別多元化
    score += board.femaleDirectors * 0.4;

    // 多元性指數
    score += board.diversityIndex * 0.2;

    return Math.min(100, score);
  }

  private evaluateEthics(ethics: GovernanceMetrics['ethics']): number {
    let score = 0;

    if (ethics.codeOfEthics) score += 25;
    if (ethics.antiCorruptionPolicy) score += 25;
    if (ethics.whistleblowerMechanism) score += 25;
    score += ethics.trainingCompletionRate * 0.25;

    return Math.min(100, score);
  }

  private evaluateTransparency(transparency: GovernanceMetrics['transparency']): number {
    let score = 0;

    if (transparency.esgReporting) score += 30;
    if (transparency.thirdPartyVerification) score += 30;
    score += transparency.disclosureScore * 0.4;

    return Math.min(100, score);
  }

  private evaluateRiskManagement(risk: GovernanceMetrics['riskManagement']): number {
    let score = 0;

    if (risk.esgRiskAssessment) score += 25;
    if (risk.climateRiskAssessment) score += 25;
    if (risk.businessContinuityPlan) score += 25;
    score += risk.cyberSecurityScore * 0.25;

    return Math.min(100, score);
  }

  /**
   * 創建分數明細
   */
  private createScoreBreakdown(score: number): ScoreBreakdown {
    const normalizedScore = Math.round(score * 10) / 10;
    
    let rank: ScoreBreakdown['rank'];
    if (normalizedScore >= 90) rank = 'A+';
    else if (normalizedScore >= 80) rank = 'A';
    else if (normalizedScore >= 70) rank = 'B+';
    else if (normalizedScore >= 60) rank = 'B';
    else if (normalizedScore >= 50) rank = 'C+';
    else if (normalizedScore >= 40) rank = 'C';
    else if (normalizedScore >= 30) rank = 'D';
    else rank = 'F';

    return {
      score: normalizedScore,
      rank,
      percentile: normalizedScore, // 簡化：直接使用分數
      change: 0, // 需要歷史數據計算
    };
  }

  // ==========================================
  // 洞察生成
  // ==========================================

  private generateInsights(
    environmental: EnvironmentalMetrics,
    social: SocialMetrics,
    governance: GovernanceMetrics
  ): ESGInsight[] {
    const insights: ESGInsight[] = [];

    // 環境洞察
    if (
      environmental.carbonEmissions.reductionTarget !== undefined &&
      environmental.carbonEmissions.scope1 > environmental.carbonEmissions.reductionTarget
    ) {
      insights.push({
        id: `insight-env-${Date.now()}`,
        category: 'environmental',
        type: 'warning',
        title: '碳排放超過目標',
        description: `Scope 1 排放量 ${environmental.carbonEmissions.scope1} tCO2e 超過目標 ${environmental.carbonEmissions.reductionTarget} tCO2e`,
        impact: 'high',
        dataPoints: ['carbonEmissions.scope1', 'carbonEmissions.reductionTarget'],
      });
    }

    if (environmental.energyConsumption.renewableRatio > 50) {
      insights.push({
        id: `insight-env-${Date.now()}`,
        category: 'environmental',
        type: 'positive',
        title: '可再生能源比例良好',
        description: `可再生能源比例達到 ${environmental.energyConsumption.renewableRatio}%`,
        impact: 'medium',
        dataPoints: ['energyConsumption.renewableRatio'],
      });
    }

    // 社會洞察
    if (social.workforce.turnoverRate > 20) {
      insights.push({
        id: `insight-soc-${Date.now()}`,
        category: 'social',
        type: 'negative',
        title: '員工流動率過高',
        description: `員工流動率 ${social.workforce.turnoverRate}% 超過行業平均`,
        impact: 'high',
        dataPoints: ['workforce.turnoverRate'],
      });
    }

    if (social.diversity.genderDiversity.female > 40) {
      insights.push({
        id: `insight-soc-${Date.now()}`,
        category: 'social',
        type: 'positive',
        title: '性別多元性良好',
        description: `女性員工比例達到 ${social.diversity.genderDiversity.female}%`,
        impact: 'medium',
        dataPoints: ['diversity.genderDiversity.female'],
      });
    }

    // 治理洞察
    if (governance.boardComposition.independentDirectors > 70) {
      insights.push({
        id: `insight-gov-${Date.now()}`,
        category: 'governance',
        type: 'positive',
        title: '董事會獨立性良好',
        description: `獨立董事比例達到 ${governance.boardComposition.independentDirectors}%`,
        impact: 'medium',
        dataPoints: ['boardComposition.independentDirectors'],
      });
    }

    if (!governance.ethics.whistleblowerMechanism) {
      insights.push({
        id: `insight-gov-${Date.now()}`,
        category: 'governance',
        type: 'warning',
        title: '缺少舉報機制',
        description: '公司尚未建立舉報機制',
        impact: 'high',
        dataPoints: ['ethics.whistleblowerMechanism'],
      });
    }

    return insights;
  }

  // ==========================================
  // 建議生成
  // ==========================================

  private generateRecommendations(
    scores: ESGScores,
    insights: ESGInsight[]
  ): ESGRecommendation[] {
    const recommendations: ESGRecommendation[] = [];

    // 基於分數生成建議
    if (scores.environmental.score < 60) {
      recommendations.push({
        id: `rec-env-${Date.now()}`,
        category: 'environmental',
        priority: 'high',
        title: '提升環境表現',
        description: '環境分數低於行業平均，建議制定碳中和路線圖',
        expectedImpact: '提升環境分數 15-20 分',
        implementationCost: 'medium',
        timeframe: 'medium',
      });
    }

    if (scores.social.score < 60) {
      recommendations.push({
        id: `rec-soc-${Date.now()}`,
        category: 'social',
        priority: 'high',
        title: '改善社會表現',
        description: '社會分數低於行業平均，建議加強員工培訓和多元性政策',
        expectedImpact: '提升社會分數 10-15 分',
        implementationCost: 'low',
        timeframe: 'short',
      });
    }

    if (scores.governance.score < 70) {
      recommendations.push({
        id: `rec-gov-${Date.now()}`,
        category: 'governance',
        priority: 'medium',
        title: '強化公司治理',
        description: '治理分數有提升空間，建議增加董事會獨立性和透明度',
        expectedImpact: '提升治理分數 10-15 分',
        implementationCost: 'low',
        timeframe: 'short',
      });
    }

    // 基於洞察生成建議
    insights
      .filter((i) => i.type === 'warning' || i.type === 'negative')
      .forEach((insight) => {
        recommendations.push({
          id: `rec-${insight.category}-${Date.now()}`,
          category: insight.category,
          priority: insight.impact === 'high' ? 'critical' : 'medium',
          title: `改善: ${insight.title}`,
          description: insight.description,
          expectedImpact: '改善相關指標表現',
          implementationCost: 'medium',
          timeframe: 'medium',
        });
      });

    return recommendations;
  }

  // ==========================================
  // 基準比較
  // ==========================================

  private compareWithBenchmarks(
    environmental: EnvironmentalMetrics,
    social: SocialMetrics,
    governance: GovernanceMetrics
  ): ESGBenchmark[] {
    const benchmarks: ESGBenchmark[] = [];

    // 環境基準
    benchmarks.push({
      category: 'environmental',
      metric: 'carbonEmissionsIntensity',
      value: environmental.carbonEmissions.total / 1000,
      industryAverage: 2.5,
      industryBest: 0.5,
      unit: 'tCO2e/revenue_million',
    });

    benchmarks.push({
      category: 'environmental',
      metric: 'renewableEnergyRatio',
      value: environmental.energyConsumption.renewableRatio,
      industryAverage: 35,
      industryBest: 100,
      unit: '%',
    });

    benchmarks.push({
      category: 'environmental',
      metric: 'recyclingRate',
      value: environmental.wasteManagement.recyclingRate,
      industryAverage: 45,
      industryBest: 95,
      unit: '%',
    });

    // 社會基準
    benchmarks.push({
      category: 'social',
      metric: 'employeeTurnoverRate',
      value: social.workforce.turnoverRate,
      industryAverage: 15,
      industryBest: 5,
      unit: '%',
    });

    benchmarks.push({
      category: 'social',
      metric: 'genderDiversityIndex',
      value: social.diversity.genderDiversity.female,
      industryAverage: 45,
      industryBest: 60,
      unit: '%',
    });

    benchmarks.push({
      category: 'social',
      metric: 'safetyIncidentRate',
      value: social.healthSafety.incidentRate,
      industryAverage: 3.0,
      industryBest: 0.5,
      unit: 'per_200k_hours',
    });

    // 治理基準
    benchmarks.push({
      category: 'governance',
      metric: 'boardIndependence',
      value: governance.boardComposition.independentDirectors,
      industryAverage: 60,
      industryBest: 90,
      unit: '%',
    });

    benchmarks.push({
      category: 'governance',
      metric: 'disclosureScore',
      value: governance.transparency.disclosureScore,
      industryAverage: 65,
      industryBest: 95,
      unit: 'score',
    });

    return benchmarks;
  }

  // ==========================================
  // 趨勢分析
  // ==========================================

  private analyzeTrends(): ESGTrend[] {
    // 簡化實現：返回模擬趨勢數據
    return [
      {
        category: 'environmental',
        metric: 'carbonEmissions',
        direction: 'improving',
        changeRate: -5.2,
        period: '2023-2024',
      },
      {
        category: 'environmental',
        metric: 'renewableEnergy',
        direction: 'improving',
        changeRate: 8.5,
        period: '2023-2024',
      },
      {
        category: 'social',
        metric: 'employeeSatisfaction',
        direction: 'stable',
        changeRate: 1.2,
        period: '2023-2024',
      },
      {
        category: 'governance',
        metric: 'disclosureScore',
        direction: 'improving',
        changeRate: 3.8,
        period: '2023-2024',
      },
    ];
  }

  // ==========================================
  // 報告生成
  // ==========================================

  /**
   * 生成 ESG 報告
   */
  generateReport(result: ESGAnalysisResult): string {
    const lines: string[] = [];

    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push('                    ESG 分析報告');
    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push('');
    lines.push(`分析期間: ${result.period.start.toLocaleDateString()} - ${result.period.end.toLocaleDateString()}`);
    lines.push(`生成時間: ${result.timestamp.toLocaleString()}`);
    lines.push('');

    // 總體分數
    lines.push('【總體評分】');
    lines.push(`  整體分數: ${result.scores.overall} / 100`);
    lines.push(`  環境 (E): ${result.scores.environmental.score} (${result.scores.environmental.rank})`);
    lines.push(`  社會 (S): ${result.scores.social.score} (${result.scores.social.rank})`);
    lines.push(`  治理 (G): ${result.scores.governance.score} (${result.scores.governance.rank})`);
    lines.push('');

    // 主要洞察
    lines.push('【主要洞察】');
    result.insights.slice(0, 5).forEach((insight) => {
      const icon = insight.type === 'positive' ? '✓' : insight.type === 'negative' ? '✗' : '⚠';
      lines.push(`  ${icon} ${insight.title}`);
      lines.push(`    ${insight.description}`);
    });
    lines.push('');

    // 建議
    lines.push('【改善建議】');
    result.recommendations.slice(0, 5).forEach((rec) => {
      lines.push(`  [${rec.priority.toUpperCase()}] ${rec.title}`);
      lines.push(`    ${rec.description}`);
      lines.push(`    預期效果: ${rec.expectedImpact}`);
    });
    lines.push('');

    // 基準比較
    lines.push('【基準比較】');
    result.benchmarks.forEach((bm) => {
      const status = bm.value >= bm.industryAverage ? '✓ 高於平均' : '✗ 低於平均';
      lines.push(`  ${bm.metric}: ${bm.value} ${bm.unit} (${status})`);
    });

    lines.push('');
    lines.push('═══════════════════════════════════════════════════════════════');

    return lines.join('\n');
  }
}

// ==========================================
// 匯出單例
// ==========================================

export const esgAnalysisEngine = ESGAnalysisEngine.getInstance();
