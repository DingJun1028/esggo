import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';
/**
 * ESG AI Insight Engine
 * Integrates JunAiKey AI capabilities to provide intelligent ESG analysis.
 */

import { ncb } from '@/lib/ncb/client';
import { junAiKeyAPI } from './jun-ai-key-integration.js';

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
  private junAiKey: typeof junAiKeyAPI;

  constructor() {
    this.junAiKey = junAiKeyAPI;
  }

  /**
   * Trend Analysis
   */
  async analyzeTrends(metricId: string, periodMonths: number = 12): Promise<TrendAnalysis> {
    try {
      // Fetch historical data
      const { data: readings, error } = await ncb
        .from('esg_readings')
        .select('value, period_start, calculated_value')
        .eq('metric_id', metricId)
        .eq('status', 'approved')
        .order('period_start', { ascending: true })
        .limit(periodMonths);

      if (error || !readings || (Array.isArray(readings) && readings.length < 3)) {
        throw new Error('Insufficient data for trend analysis');
      }

      const readingsArray = Array.isArray(readings) ? readings : [readings];

      // Prepare data for AI analysis
      const dataPoints = readingsArray.map((r: any) => ({
        x: new Date(r.period_start).getTime(),
        y: r.calculated_value || r.value,
      }));

      // Call JunAiKey's trend analysis
      const trendResult = await this.junAiKey.analyzeTrend(dataPoints);

      return {
        metricId,
        period: `${periodMonths} months`,
        trend: trendResult.direction,
        slope: trendResult.slope,
        volatility: trendResult.volatility,
        forecast: trendResult.forecast,
        confidence: trendResult.confidence,
      };
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'Log from esg-insight-engine', {
        data: ['Trend analysis failed:', error],
        source_origin: 'esg-insight-engine',
      });
      throw error;
    }
  }

  /**
   * Anomaly Detection
   */
  async detectAnomalies(readingId: string): Promise<AnomalyDetection | null> {
    try {
      // Fetch current reading
      // Note: ncb doesn't support nested select (metric:metric_definitions) in one go easily yet unless backend supports it.
      // We will fetch reading first.
      const { data: readingData, error: readingError } = await ncb
        .from('esg_readings')
        .select('id, value, calculated_value, metric_id, period_start')
        .eq('id', readingId)
        .single();

      if (readingError || !readingData) {
        throw new Error('Reading not found');
      }

      const reading = readingData as any;

      // Fetch historical data for comparison
      const { data: history, error: historyError } = await ncb
        .from('esg_readings')
        .select('value, calculated_value')
        .eq('metric_id', reading.metric_id)
        .eq('status', 'approved')
        .order('period_start', { ascending: false })
        .limit(12); // Past 12 months of data

      if (historyError || !history || (Array.isArray(history) && history.length < 6)) {
        return null; // Insufficient data to detect anomalies
      }

      const historyArray = Array.isArray(history) ? history : [history];
      const values = historyArray.map((h: any) => h.calculated_value || h.value);
      const currentValue = reading.calculated_value || reading.value;

      // Use statistical methods to detect anomalies
      const anomaly = await this.detectStatisticalAnomaly(currentValue, values);

      if (!anomaly) return null;

      return {
        readingId,
        metricId: reading.metric_id,
        value: currentValue,
        expectedRange: anomaly.expectedRange,
        deviation: anomaly.deviation,
        severity: anomaly.severity,
        explanation: anomaly.explanation,
      };
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'Log from esg-insight-engine', {
        data: ['Anomaly detection failed:', error],
        source_origin: 'esg-insight-engine',
      });
      return null;
    }
  }

  /**
   * Batch Anomaly Detection
   */
  async detectBatchAnomalies(days: number = 7): Promise<AnomalyDetection[]> {
    try {
      // Fetch recent readings
      const since = new Date();
      since.setDate(since.getDate() - days);

      const { data: recentReadings, error } = await ncb
        .from('esg_readings')
        .select('id')
        .eq('status', 'approved')
        .gte('created_at', since.toISOString());

      if (error || !recentReadings) return [];

      const readingsArray = Array.isArray(recentReadings) ? recentReadings : [recentReadings];

      // Concurrent anomaly detection
      const anomalyPromises = readingsArray.map((reading: any) => this.detectAnomalies(reading.id));

      const results = await Promise.all(anomalyPromises);
      return results.filter((anomaly): anomaly is AnomalyDetection => anomaly !== null);
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'Log from esg-insight-engine', {
        data: ['Batch anomaly detection failed:', error],
        source_origin: 'esg-insight-engine',
      });
      return [];
    }
  }

  /**
   * Generate ESG Insight Report
   */
  async generateInsightsReport(orgUnitId?: string): Promise<ESGInsight[]> {
    const insights: ESGInsight[] = [];

    try {
      // Fetch active metrics
      const { data: metrics, error } = await ncb
        .from('metric_definitions')
        .select('id, name, category')
        .eq('is_active', true);

      if (error || !metrics) return [];

      const metricsArray = Array.isArray(metrics) ? metrics : [metrics];

      // Generate insights for each metric
      for (const metric of metricsArray as any[]) {
        // Trend analysis
        try {
          const trend = await this.analyzeTrends(metric.id, 6);
          if (trend.confidence > 0.7) {
            insights.push({
              type: 'trend',
              title: `${metric.name} Trend Analysis`,
              description: this.generateTrendDescription(trend, metric.name),
              confidence: trend.confidence,
              impact: this.calculateImpact(trend),
              data: trend,
              timestamp: new Date(),
            });
          }
        } catch (error) {
          // Ignore individual metric errors
          omniLogger.warn(LogCategory.SYSTEM, 'Log from esg-insight-engine', {
            data: [`Trend analysis failed for metric ${metric.id}:`, error],
            source_origin: 'esg-insight-engine',
          });
        }

        // Prediction analysis
        try {
          const prediction = await this.generatePrediction(metric.id);
          if (prediction) {
            insights.push({
              type: 'prediction',
              title: `${metric.name} Prediction`,
              description: prediction.description,
              confidence: prediction.confidence,
              impact: 'medium',
              data: prediction,
              timestamp: new Date(),
            });
          }
        } catch (error) {
          omniLogger.warn(LogCategory.SYSTEM, 'Log from esg-insight-engine', {
            data: [`Prediction failed for metric ${metric.id}:`, error],
            source_origin: 'esg-insight-engine',
          });
        }
      }

      // Anomaly detection
      const anomalies = await this.detectBatchAnomalies(30);
      for (const anomaly of anomalies) {
        insights.push({
          type: 'anomaly',
          title: 'Data Anomaly Detection',
          description: `Anomaly detected for ${anomaly.metricId}, deviation ${anomaly.deviation.toFixed(1)}%`,
          confidence: 0.9,
          impact: anomaly.severity === 'critical' ? 'high' : 'medium',
          data: anomaly,
          timestamp: new Date(),
        });
      }

      // Generate improvement recommendations
      const recommendations = await this.generateRecommendations(insights);
      insights.push(...recommendations);

      return insights.sort((a, b) => b.confidence - a.confidence);
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'Log from esg-insight-engine', {
        data: ['Insight generation failed:', error],
        source_origin: 'esg-insight-engine',
      });
      return [];
    }
  }

  /**
   * Private methods: Statistical anomaly detection
   */
  private async detectStatisticalAnomaly(
    currentValue: number,
    historicalValues: number[]
  ): Promise<any | null> {
    const mean = historicalValues.reduce((sum, val) => sum + val, 0) / historicalValues.length;
    const variance =
      historicalValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      historicalValues.length;
    const stdDev = Math.sqrt(variance);

    const deviation = (Math.abs(currentValue - mean) / mean) * 100;
    const zScore = Math.abs(currentValue - mean) / stdDev;

    // Set anomaly thresholds
    if (zScore > 3 || deviation > 50) {
      // 3 standard deviations or deviation over 50%
      const severity = zScore > 4 ? 'critical' : zScore > 3 ? 'high' : 'medium';
      const expectedRange: [number, number] = [mean - 2 * stdDev, mean + 2 * stdDev];

      return {
        expectedRange,
        deviation,
        severity,
        explanation: `Value deviates from historical average by ${deviation.toFixed(1)}%, exceeding normal range`,
      };
    }

    return null;
  }

  /**
   * Generate trend description
   */
  private generateTrendDescription(trend: TrendAnalysis, metricName: string): string {
    const direction =
      trend.trend === 'increasing'
        ? 'Increasing'
        : trend.trend === 'decreasing'
          ? 'Decreasing'
          : 'Stable';
    const slopeText = Math.abs(trend.slope) > 0.1 ? 'Significant' : 'Slow';

    return `${metricName} has shown a ${slopeText} ${direction} trend over the past ${trend.period}, with a volatility of ${trend.volatility.toFixed(2)}`;
  }

  /**
   * Calculate impact level
   */
  private calculateImpact(trend: TrendAnalysis): 'high' | 'medium' | 'low' {
    if (Math.abs(trend.slope) > 0.2 && trend.volatility > 0.3) return 'high';
    if (Math.abs(trend.slope) > 0.1 || trend.volatility > 0.2) return 'medium';
    return 'low';
  }

  /**
   * Generate prediction
   */
  private async generatePrediction(metricId: string): Promise<any | null> {
    try {
      const trend = await this.analyzeTrends(metricId, 12);
      if (trend.confidence < 0.6 || !trend.forecast || trend.forecast.length < 2) return null;

      const nextValue = trend.forecast[0];
      const prevValue = trend.forecast[1];

      if (typeof nextValue !== 'number' || typeof prevValue !== 'number') return null;

      const change = prevValue === 0 ? 0 : ((nextValue - prevValue) / prevValue) * 100;

      return {
        nextValue,
        changePercent: change,
        description: `Predicted value for next period is ${nextValue.toFixed(2)}, a ${change > 0 ? 'increase' : 'decrease'} of ${Math.abs(change).toFixed(1)}% compared to this period`,
        confidence: trend.confidence,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate improvement recommendations
   */
  private async generateRecommendations(insights: ESGInsight[]): Promise<ESGInsight[]> {
    const recommendations: ESGInsight[] = [];

    // Recommendations based on trend analysis
    const negativeTrends = insights.filter(
      i => i.type === 'trend' && i.data.trend === 'decreasing'
    );
    if (negativeTrends.length > 0) {
      recommendations.push({
        type: 'recommendation',
        title: 'Improvement Recommendation',
        description: `Found ${negativeTrends.length} metrics with a decreasing trend; recommend reviewing related business processes and developing improvement plans`,
        confidence: 0.8,
        impact: 'high',
        data: { trends: negativeTrends.map(t => t.data) },
        timestamp: new Date(),
      });
    }

    // Recommendations based on anomalies
    const anomalies = insights.filter(i => i.type === 'anomaly');
    if (anomalies.length > 0) {
      recommendations.push({
        type: 'recommendation',
        title: 'Data Verification Recommendation',
        description: `Found ${anomalies.length} data anomalies; recommend re-checking data sources and calculation logic`,
        confidence: 0.9,
        impact: 'high',
        data: { anomalies: anomalies.map(a => a.data) },
        timestamp: new Date(),
      });
    }

    return recommendations;
  }
}

// Export singleton instance
export const esgInsightEngine = new ESGInsightEngine();
