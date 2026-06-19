import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { SystemHealthStatus } from '../types/core';
/**
 * ESG AI智慧分析模組 (M3: AI Intelligence)
 *
 * 提供ESG數據的AI驅動分析功能，包括：
 * - 預測與模擬引擎
 * - 自然語言處理分析
 * - 智能偵測系統
 * - 機會識別引擎
 */

import { ESGPredictor } from './esgPredictor';
import { NLP_Analyzer } from './nlpAnalyzer';
import { AnomalyDetector } from './anomalyDetector';
import { OpportunityIdentifier } from './opportunityIdentifier';

export interface AIIntelligenceConfig {
  enablePrediction: boolean;
  enableNLP: boolean;
  enableAnomalyDetection: boolean;
  enableOpportunityIdentification: boolean;
  predictionHorizon: number; // 預測期數（月）
  confidenceThreshold: number; // 信心門檻
  language: 'zh-TW' | 'en-US';
}

export interface PredictionResult {
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  scenario: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  uncertainty: number;
  dataPoints: Array<{ date: string; value: number; predicted: boolean }>;
}

export interface NLPAnalysisResult {
  sentiment: {
    score: number; // -1 到 1
    label: 'positive' | 'neutral' | 'negative';
    confidence: number;
  };
  topics: Array<{
    topic: string;
    relevance: number;
    keywords: string[];
  }>;
  entities: Array<{
    type: 'company' | 'person' | 'location' | 'regulation' | 'metric';
    name: string;
    confidence: number;
    context: string;
  }>;
  risks: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    evidence: string;
  }>;
  opportunities: Array<{
    type: string;
    potential: 'low' | 'medium' | 'high';
    description: string;
    recommendation: string;
  }>;
}

export interface AnomalyDetectionResult {
  anomalies: Array<{
    metric: string;
    timestamp: string;
    value: number;
    expectedRange: { min: number; max: number };
    deviation: number;
    severity: 'low' | 'medium' | 'high';
    cause: string;
    recommendation: string;
  }>;
  overallHealth: 'healthy' | 'warning' | 'critical';
  riskScore: number;
  lastUpdated: string;
}

export interface OpportunityIdentificationResult {
  opportunities: Array<{
    category: 'environmental' | 'social' | 'governance';
    title: string;
    description: string;
    potentialImpact: {
      financial: number; // 潛在節省/收益
      environmental: string; // 減碳量等
      timeline: string; // 實現時間
    };
    implementationDifficulty: 'easy' | 'medium' | 'hard';
    prerequisites: string[];
    successProbability: number;
    priority: number;
  }>;
  totalPotentialValue: number;
  quickWins: number; // 快速實現機會數
  strategicOpportunities: number; // 戰略性機會數
}

export class AIIntelligenceService {
  private config: AIIntelligenceConfig;
  private predictor: ESGPredictor;
  private nlpAnalyzer: NLP_Analyzer;
  private anomalyDetector: AnomalyDetector;
  private opportunityIdentifier: OpportunityIdentifier;

  constructor(config: AIIntelligenceConfig) {
    this.config = config;
    this.predictor = new ESGPredictor();
    this.nlpAnalyzer = new NLP_Analyzer();
    this.anomalyDetector = AnomalyDetector.getInstance();
    this.opportunityIdentifier = new OpportunityIdentifier();
  }

  /**
   * ESG指標預測分析
   */
  async predictESGMetrics(
    metrics: string[],
    historicalData: Record<string, Array<{ date: string; value: number }>>,
    scenarios: string[] = ['baseline', 'optimistic', 'pessimistic']
  ): Promise<Record<string, PredictionResult[]>> {
    if (!this.config.enablePrediction) {
      throw new Error('預測功能未啟用');
    }

    const results: Record<string, PredictionResult[]> = {};

    for (const metric of metrics) {
      const data = historicalData[metric];
      if (!data || data.length < 12) {
        // 需要至少12個月數據
        omniLogger.warn(LogCategory.SYSTEM, `數據不足，跳過 ${metric} 預測`, {
          source_origin: 'aiIntelligence',
        });
        continue;
      }

      results[metric] = [];

      for (const scenario of scenarios) {
        try {
          const prediction = await this.predictor.predict({
            metric,
            data,
            horizon: this.config.predictionHorizon,
            scenario: scenario as 'baseline' | 'optimistic' | 'pessimistic',
            confidenceThreshold: this.config.confidenceThreshold,
          });

          results[metric].push(prediction);
        } catch (error) {
          omniLogger.error(LogCategory.SYSTEM, 'Log from aiIntelligence', {
            data: [`預測失敗 ${metric} - ${scenario}:`, error],
            source_origin: 'aiIntelligence',
          });
        }
      }
    }

    return results;
  }

  /**
   * 自然語言處理分析
   */
  async analyzeText(
    text: string,
    context: {
      source: 'news' | 'report' | 'social_media' | 'internal';
      language?: string;
      domain?: 'environmental' | 'social' | 'governance';
    }
  ): Promise<NLPAnalysisResult> {
    if (!this.config.enableNLP) {
      throw new Error('NLP分析功能未啟用');
    }

    return await this.nlpAnalyzer.analyze({
      text,
      context: {
        ...context,
        targetLanguage: this.config.language,
      },
    });
  }

  /**
   * 批量文本分析
   */
  async analyzeMultipleTexts(
    texts: Array<{ id: string; content: string; context: any }>
  ): Promise<Record<string, NLPAnalysisResult>> {
    const results: Record<string, NLPAnalysisResult> = {};

    for (const item of texts) {
      try {
        results[item.id] = await this.analyzeText(item.content, item.context);
      } catch (error) {
        omniLogger.error(LogCategory.SYSTEM, 'Log from aiIntelligence', {
          data: [`分析失敗 ${item.id}:`, error],
          source_origin: 'aiIntelligence',
        });
        results[item.id] = this.getEmptyAnalysisResult();
      }
    }

    return results;
  }

  /**
   * 異常偵測
   */
  async detectAnomalies(
    data: Record<string, Array<{ date: string; value: number }>>,
    detectionConfig?: {
      sensitivity: 'low' | 'medium' | 'high';
      timeWindow: number; // 天數
    }
  ): Promise<AnomalyDetectionResult> {
    if (!this.config.enableAnomalyDetection) {
      throw new Error('異常偵測功能未啟用');
    }

    return await this.anomalyDetector.detect({
      data,
      config: {
        sensitivity: detectionConfig?.sensitivity || 'medium',
        timeWindow: detectionConfig?.timeWindow || 30,
        minDataPoints: 7,
      },
    });
  }

  /**
   * 機會識別
   */
  async identifyOpportunities(
    currentState: {
      metrics: Record<string, number>;
      capabilities: string[];
      constraints: string[];
      goals: Record<string, number>;
    },
    analysisScope: ('environmental' | 'social' | 'governance')[] = [
      'environmental',
      'social',
      'governance',
    ]
  ): Promise<OpportunityIdentificationResult> {
    if (!this.config.enableOpportunityIdentification) {
      throw new Error('機會識別功能未啟用');
    }

    return await this.opportunityIdentifier.identify({ currentState, analysisScope });
  }

  /**
   * 綜合AI洞察生成
   */
  async generateInsights(
    data: {
      predictions?: Record<string, PredictionResult[]>;
      nlpAnalysis?: NLPAnalysisResult;
      anomalies?: AnomalyDetectionResult;
      opportunities?: OpportunityIdentificationResult;
    },
    context: {
      companySize: 'small' | 'medium' | 'large';
      industry: string;
      region: string;
    }
  ): Promise<{
    keyFindings: string[];
    recommendations: Array<{
      priority: 'high' | 'medium' | 'low';
      category: string;
      action: string;
      rationale: string;
      expectedImpact: string;
    }>;
    risks: Array<{
      level: 'high' | 'medium' | 'low';
      description: string;
      mitigation: string;
    }>;
    opportunities: Array<{
      timeline: string;
      description: string;
      roi: string;
    }>;
    nextSteps: string[];
  }> {
    // 整合所有AI分析結果
    const insights = await this.synthesizeInsights(data, context);

    return {
      keyFindings: insights.findings,
      recommendations: insights.recommendations,
      risks: insights.risks,
      opportunities: insights.opportunities,
      nextSteps: insights.nextSteps,
    };
  }

  /**
   * 配置更新
   */
  updateConfig(newConfig: Partial<AIIntelligenceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    // 重新初始化組件
    this.initializeComponents();
  }

  /**
   * 健康檢查
   */
  async healthCheck(): Promise<{
    status: SystemHealthStatus;
    components: Record<string, boolean>;
    lastAnalysisTime?: string;
  }> {
    const components = {
      predictor: await this.predictor.isHealthy(),
      nlpAnalyzer: await this.nlpAnalyzer.isHealthy(),
      anomalyDetector: await this.anomalyDetector.isHealthy(),
      opportunityIdentifier: await this.opportunityIdentifier.isHealthy(),
    };

    const healthyCount = Object.values(components).filter(Boolean).length;
    const totalCount = Object.keys(components).length;

    let status: SystemHealthStatus;
    if (healthyCount === totalCount) {
      status = 'healthy';
    } else if (healthyCount >= totalCount * 0.5) {
      status = 'warning'; // 降級狀態映射為警告
    } else {
      status = 'critical'; // 不健康狀態映射為危急
    }

    return {
      status,
      components,
      lastAnalysisTime: new Date().toISOString(),
    };
  }

  private initializeComponents(): void {
    this.predictor = new ESGPredictor();
    this.nlpAnalyzer = new NLP_Analyzer();
    this.anomalyDetector = AnomalyDetector.getInstance();
    this.opportunityIdentifier = new OpportunityIdentifier();
  }

  private getEmptyAnalysisResult(): NLPAnalysisResult {
    return {
      sentiment: { score: 0, label: 'neutral', confidence: 0 },
      topics: [],
      entities: [],
      risks: [],
      opportunities: [],
    };
  }

  private async synthesizeInsights(data: any, context: any): Promise<any> {
    // 實現洞察合成邏輯
    return {
      findings: [],
      recommendations: [],
      risks: [],
      opportunities: [],
      nextSteps: [],
    };
  }
}

// 導出預設實例
export const aiIntelligence = new AIIntelligenceService({
  enablePrediction: true,
  enableNLP: true,
  enableAnomalyDetection: true,
  enableOpportunityIdentification: true,
  predictionHorizon: 12,
  confidenceThreshold: 0.8,
  language: 'zh-TW',
});
