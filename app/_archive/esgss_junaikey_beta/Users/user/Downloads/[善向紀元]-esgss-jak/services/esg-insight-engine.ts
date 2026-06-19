/**
 * ESG AI 洞察引擎
 * 整合 JunAiKey AI 能力，提供智慧 ESG 分析
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { junAiKeyAPI } from './jun-ai-key-integration';

export interface ESGInsight {
  type: 'trend' | 'anomaly' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  data: any;
  timestamp: Date;
}

export interface TrendAnalysis {
  metricId: string;
  period: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  slope: number;
  volatility: number;
  forecast: number[];
  confidence: number;
}

export interface AnomalyDetection {
  readingId: string;
  metricId: string;
  value: number;
  expectedRange: [number, number];
  deviation: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  explanation: string;
}

export class ESGInsightEngine {
  private supabase: SupabaseClient;
  private junAiKey: typeof junAiKeyAPI;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.junAiKey = junAiKeyAPI;
  }

  /**
   * 趨勢分析
   */
  async analyzeTrends(metricId: string, periodMonths: number = 12): Promise<TrendAnalysis> {
    try {
      // 獲取歷史數據
      const { data: readings, error } = await this.supabase
        .from('esg_readings')
        .select('value, period_start, calculated_value')
        .eq('metric_id', metricId)
        .eq('status', 'approved')
        .order('period_start', { ascending: true })
        .limit(periodMonths);

      if (error || !readings || readings.length < 3) {
        throw new Error('Insufficient data for trend analysis');
      }

      // 準備數據給 AI 分析
      const dataPoints = readings.map(r => ({
        x: new Date(r.period_start).getTime(),
        y: r.calculated_value || r.value
      }));

      // 調用 JunAiKey 的趨勢分析
      const trendResult = await this.junAiKey.analyzeTrend(dataPoints);

      return {
        metricId,
        period: `${periodMonths} months`,
        trend: trendResult.direction,
        slope: trendResult.slope,
        volatility: trendResult.volatility,
        forecast: trendResult.forecast,
        confidence: trendResult.confidence
      };
    } catch (error) {
      console.error('Trend analysis failed:', error);
      throw error;
    }
  }

  /**
   * 異常檢測
   */
  async detectAnomalies(readingId: string): Promise<AnomalyDetection | null> {
    try {
      // 獲取當前讀數
      const { data: reading, error: readingError } = await this.supabase
        .from('esg_readings')
        .select(`
          id, value, calculated_value, metric_id, period_start,
          metric:metric_definitions(code, name)
        `)
        .eq('id', readingId)
        .single();

      if (readingError || !reading) {
        throw new Error('Reading not found');
      }

      // 獲取歷史數據用於比較
      const { data: history, error: historyError } = await this.supabase
        .from('esg_readings')
        .select('value, calculated_value')
        .eq('metric_id', reading.metric_id)
        .eq('status', 'approved')
        .order('period_start', { ascending: false })
        .limit(12); // 過去一年數據

      if (historyError || !history || history.length < 6) {
        return null; // 數據不足，無法檢測異常
      }

      const values = history.map(h => h.calculated_value || h.value);
      const currentValue = reading.calculated_value || reading.value;

      // 使用統計方法檢測異常
      const anomaly = await this.detectStatisticalAnomaly(currentValue, values);

      if (!anomaly) return null;

      return {
        readingId,
        metricId: reading.metric_id,
        value: currentValue,
        expectedRange: anomaly.expectedRange,
        deviation: anomaly.deviation,
        severity: anomaly.severity,
        explanation: anomaly.explanation
      };
    } catch (error) {
      console.error('Anomaly detection failed:', error);
      return null;
    }
  }

  /**
   * 批次異常檢測
   */
  async detectBatchAnomalies(days: number = 7): Promise<AnomalyDetection[]> {
    const anomalies: AnomalyDetection[] = [];

    try {
      // 獲取最近的讀數
      const since = new Date();
      since.setDate(since.getDate() - days);

      const { data: recentReadings, error } = await this.supabase
        .from('esg_readings')
        .select('id')
        .eq('status', 'approved')
        .gte('created_at', since.toISOString());

      if (error || !recentReadings) return [];

      // 並發檢測異常
      const anomalyPromises = recentReadings.map(reading =>
        this.detectAnomalies(reading.id)
      );

      const results = await Promise.all(anomalyPromises);
      return results.filter((anomaly): anomaly is AnomalyDetection => anomaly !== null);

    } catch (error) {
      console.error('Batch anomaly detection failed:', error);
      return [];
    }
  }

  /**
   * 生成 ESG 洞察報告
   */
  async generateInsightsReport(orgUnitId?: string): Promise<ESGInsight[]> {
    const insights: ESGInsight[] = [];

    try {
      // 獲取活躍指標
      const { data: metrics, error } = await this.supabase
        .from('metric_definitions')
        .select('id, name, category')
        .eq('is_active', true);

      if (error || !metrics) return [];

      // 為每個指標生成洞察
      for (const metric of metrics) {
        // 趨勢分析
        try {
          const trend = await this.analyzeTrends(metric.id, 6);
          if (trend.confidence > 0.7) {
            insights.push({
              type: 'trend',
              title: `${metric.name} 趨勢分析`,
              description: this.generateTrendDescription(trend, metric.name),
              confidence: trend.confidence,
              impact: this.calculateImpact(trend),
              data: trend,
              timestamp: new Date()
            });
          }
        } catch (error) {
          // 忽略單個指標的錯誤
          console.warn(`Trend analysis failed for metric ${metric.id}:`, error);
        }

        // 預測分析
        try {
          const prediction = await this.generatePrediction(metric.id);
          if (prediction) {
            insights.push({
              type: 'prediction',
              title: `${metric.name} 預測`,
              description: prediction.description,
              confidence: prediction.confidence,
              impact: 'medium',
              data: prediction,
              timestamp: new Date()
            });
          }
        } catch (error) {
          console.warn(`Prediction failed for metric ${metric.id}:`, error);
        }
      }

      // 異常檢測
      const anomalies = await this.detectBatchAnomalies(30);
      for (const anomaly of anomalies) {
        insights.push({
          type: 'anomaly',
          title: '數據異常檢測',
          description: `發現 ${anomaly.metricId} 的異常數據，偏離度 ${anomaly.deviation.toFixed(1)}%`,
          confidence: 0.9,
          impact: anomaly.severity === 'critical' ? 'high' : 'medium',
          data: anomaly,
          timestamp: new Date()
        });
      }

      // 生成改善建議
      const recommendations = await this.generateRecommendations(insights);
      insights.push(...recommendations);

      return insights.sort((a, b) => b.confidence - a.confidence);

    } catch (error) {
      console.error('Insight generation failed:', error);
      return [];
    }
  }

  /**
   * 私有方法：統計異常檢測
   */
  private async detectStatisticalAnomaly(currentValue: number, historicalValues: number[]): Promise<any | null> {
    const mean = historicalValues.reduce((sum, val) => sum + val, 0) / historicalValues.length;
    const variance = historicalValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / historicalValues.length;
    const stdDev = Math.sqrt(variance);

    const deviation = Math.abs(currentValue - mean) / mean * 100;
    const zScore = Math.abs(currentValue - mean) / stdDev;

    // 設定異常閾值
    if (zScore > 3 || deviation > 50) { // 3個標準差或偏離50%以上
      const severity = zScore > 4 ? 'critical' : zScore > 3 ? 'high' : 'medium';
      const expectedRange: [number, number] = [mean - 2 * stdDev, mean + 2 * stdDev];

      return {
        expectedRange,
        deviation,
        severity,
        explanation: `數值偏離歷史平均 ${deviation.toFixed(1)}%，超出正常範圍`
      };
    }

    return null;
  }

  /**
   * 生成趨勢描述
   */
  private generateTrendDescription(trend: TrendAnalysis, metricName: string): string {
    const direction = trend.trend === 'increasing' ? '上升' : trend.trend === 'decreasing' ? '下降' : '穩定';
    const slopeText = Math.abs(trend.slope) > 0.1 ? '明顯' : '緩慢';

    return `${metricName} 在過去 ${trend.period} 呈現 ${slopeText}${direction} 趨勢，波動度為 ${trend.volatility.toFixed(2)}`;
  }

  /**
   * 計算影響程度
   */
  private calculateImpact(trend: TrendAnalysis): 'high' | 'medium' | 'low' {
    if (Math.abs(trend.slope) > 0.2 && trend.volatility > 0.3) return 'high';
    if (Math.abs(trend.slope) > 0.1 || trend.volatility > 0.2) return 'medium';
    return 'low';
  }

  /**
   * 生成預測
   */
  private async generatePrediction(metricId: string): Promise<any | null> {
    try {
      const trend = await this.analyzeTrends(metricId, 12);
      if (trend.confidence < 0.6) return null;

      const nextValue = trend.forecast[0];
      const change = ((nextValue - trend.forecast[1]) / trend.forecast[1] * 100);

      return {
        nextValue,
        changePercent: change,
        description: `預測下期數值為 ${nextValue.toFixed(2)}，較本期 ${change > 0 ? '增加' : '減少'} ${Math.abs(change).toFixed(1)}%`,
        confidence: trend.confidence
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * 生成改善建議
   */
  private async generateRecommendations(insights: ESGInsight[]): Promise<ESGInsight[]> {
    const recommendations: ESGInsight[] = [];

    // 基於趨勢分析的建議
    const negativeTrends = insights.filter(i => i.type === 'trend' && i.data.trend === 'decreasing');
    if (negativeTrends.length > 0) {
      recommendations.push({
        type: 'recommendation',
        title: '改善建議',
        description: `發現 ${negativeTrends.length} 項指標呈下降趨勢，建議檢視相關業務流程並制定改善計劃`,
        confidence: 0.8,
        impact: 'high',
        data: { trends: negativeTrends.map(t => t.data) },
        timestamp: new Date()
      });
    }

    // 基於異常的建議
    const anomalies = insights.filter(i => i.type === 'anomaly');
    if (anomalies.length > 0) {
      recommendations.push({
        type: 'recommendation',
        title: '數據驗證建議',
        description: `發現 ${anomalies.length} 項數據異常，建議重新檢查數據來源和計算邏輯`,
        confidence: 0.9,
        impact: 'high',
        data: { anomalies: anomalies.map(a => a.data) },
        timestamp: new Date()
      });
    }

    return recommendations;
  }
}

// 導出單例實例
export const esgInsightEngine = new ESGInsightEngine(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);