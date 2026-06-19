/**
 * ESG異常偵測器
 */

export interface AnomalyDetectionInput {
  data: Record<string, Array<{ date: string; value: number }>>;
  config?: {
    sensitivity: 'low' | 'medium' | 'high';
    timeWindow: number; // 天數
    minDataPoints: number;
  };
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

export class AnomalyDetector {
  private defaultConfig = {
    sensitivity: 'medium' as const,
    timeWindow: 30,
    minDataPoints: 7
  };

  async detect(input: AnomalyDetectionInput): Promise<AnomalyDetectionResult> {
    const config = { ...this.defaultConfig, ...input.config };
    const anomalies: AnomalyDetectionResult['anomalies'] = [];

    for (const [metric, data] of Object.entries(input.data)) {
      if (data.length < config.minDataPoints) {
        console.warn(`數據點不足跳過: ${metric}`);
        continue;
      }

      const metricAnomalies = await this.detectMetricAnomalies(metric, data, config);
      anomalies.push(...metricAnomalies);
    }

    const overallHealth = this.assessOverallHealth(anomalies);
    const riskScore = this.calculateRiskScore(anomalies);

    return {
      anomalies: anomalies.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      overallHealth,
      riskScore,
      lastUpdated: new Date().toISOString()
    };
  }

  private async detectMetricAnomalies(
    metric: string,
    data: Array<{ date: string; value: number }>,
    config: any
  ): Promise<AnomalyDetectionResult['anomalies']> {
    const anomalies: AnomalyDetectionResult['anomalies'] = [];

    // 按時間排序
    const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 統計異常偵測
    const statisticalAnomalies = this.detectStatisticalAnomalies(metric, sortedData, config);
    anomalies.push(...statisticalAnomalies);

    // 趨勢異常偵測
    const trendAnomalies = this.detectTrendAnomalies(metric, sortedData, config);
    anomalies.push(...trendAnomalies);

    // 季節性異常偵測
    const seasonalAnomalies = this.detectSeasonalAnomalies(metric, sortedData, config);
    anomalies.push(...seasonalAnomalies);

    // 業務邏輯異常偵測
    const businessAnomalies = this.detectBusinessAnomalies(metric, sortedData, config);
    anomalies.push(...businessAnomalies);

    return anomalies;
  }

  private detectStatisticalAnomalies(
    metric: string,
    data: Array<{ date: string; value: number }>,
    config: any
  ): AnomalyDetectionResult['anomalies'] {
    const anomalies: AnomalyDetectionResult['anomalies'] = [];

    if (data.length < 7) return anomalies;

    // 使用最近的數據計算基準統計
    const recentData = data.slice(-config.timeWindow);
    const values = recentData.map(d => d.value);

    // 計算統計量
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const std = Math.sqrt(
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    );

    // 設定異常閾值基於敏感度
    const multiplier = { low: 3, medium: 2.5, high: 2 }[config.sensitivity];

    // 檢查每個數據點
    for (const point of data.slice(-config.timeWindow)) {
      const deviation = Math.abs(point.value - mean);
      const zScore = deviation / std;

      if (zScore > multiplier) {
        anomalies.push({
          metric,
          timestamp: point.date,
          value: point.value,
          expectedRange: {
            min: mean - multiplier * std,
            max: mean + multiplier * std
          },
          deviation: zScore,
          severity: this.calculateSeverity(zScore, multiplier),
          cause: this.identifyStatisticalCause(point.value, mean, std),
          recommendation: this.generateStatisticalRecommendation(metric, point.value, mean)
        });
      }
    }

    return anomalies;
  }

  private detectTrendAnomalies(
    metric: string,
    data: Array<{ date: string; value: number }>,
    config: any
  ): AnomalyDetectionResult['anomalies'] {
    const anomalies: AnomalyDetectionResult['anomalies'] = [];

    if (data.length < 10) return anomalies;

    // 計算移動平均趨勢
    const windowSize = Math.min(7, Math.floor(data.length / 3));
    const movingAverages = this.calculateMovingAverages(data, windowSize);

    // 計算趨勢斜率
    const trendSlope = this.calculateTrendSlope(data.slice(-windowSize));

    // 預期範圍基於趨勢
    const recentAvg = movingAverages[movingAverages.length - 1];
    const expectedSlope = trendSlope;

    // 檢查最近幾個點是否偏離趨勢
    const recentPoints = data.slice(-Math.min(5, data.length));

    for (const point of recentPoints) {
      const pointIndex = data.findIndex(d => d.date === point.date);
      const expectedValue = this.predictExpectedValue(pointIndex, data, trendSlope);

      const deviation = Math.abs(point.value - expectedValue);
      const relativeDeviation = Math.abs(deviation / expectedValue);

      // 設定趨勢異常閾值
      const threshold = { low: 0.3, medium: 0.2, high: 0.1 }[config.sensitivity];

      if (relativeDeviation > threshold) {
        anomalies.push({
          metric,
          timestamp: point.date,
          value: point.value,
          expectedRange: {
            min: expectedValue * (1 - threshold),
            max: expectedValue * (1 + threshold)
          },
          deviation: relativeDeviation,
          severity: this.calculateSeverity(relativeDeviation / threshold, 1),
          cause: this.identifyTrendCause(point.value, expectedValue, trendSlope),
          recommendation: this.generateTrendRecommendation(metric, point.value, expectedValue)
        });
      }
    }

    return anomalies;
  }

  private detectSeasonalAnomalies(
    metric: string,
    data: Array<{ date: string; value: number }>,
    config: any
  ): AnomalyDetectionResult['anomalies'] {
    const anomalies: AnomalyDetectionResult['anomalies'] = [];

    if (data.length < 30) return anomalies; // 需要至少一個月的數據

    // 簡單的季節性檢測（按月）
    const monthlyPatterns = this.extractMonthlyPatterns(data);

    // 檢查最近數據點是否偏離季節模式
    const recentData = data.slice(-7); // 最近一週

    for (const point of recentData) {
      const month = new Date(point.date).getMonth();
      const seasonalAvg = monthlyPatterns[month]?.average || 0;
      const seasonalStd = monthlyPatterns[month]?.std || 1;

      if (seasonalAvg === 0) continue;

      const deviation = Math.abs(point.value - seasonalAvg);
      const zScore = deviation / seasonalStd;

      const threshold = { low: 2.5, medium: 2, high: 1.5 }[config.sensitivity];

      if (zScore > threshold) {
        anomalies.push({
          metric,
          timestamp: point.date,
          value: point.value,
          expectedRange: {
            min: seasonalAvg - threshold * seasonalStd,
            max: seasonalAvg + threshold * seasonalStd
          },
          deviation: zScore,
          severity: this.calculateSeverity(zScore, threshold),
          cause: this.identifySeasonalCause(point.value, seasonalAvg, month),
          recommendation: this.generateSeasonalRecommendation(metric, point.value, seasonalAvg)
        });
      }
    }

    return anomalies;
  }

  private detectBusinessAnomalies(
    metric: string,
    data: Array<{ date: string; value: number }>,
    config: any
  ): AnomalyDetectionResult['anomalies'] {
    const anomalies: AnomalyDetectionResult['anomalies'] = [];

    // ESG業務邏輯規則
    const businessRules = this.getBusinessRules(metric);

    for (const point of data.slice(-config.timeWindow)) {
      for (const rule of businessRules) {
        if (this.checkBusinessRule(point, rule)) {
          anomalies.push({
            metric,
            timestamp: point.date,
            value: point.value,
            expectedRange: rule.expectedRange,
            deviation: this.calculateBusinessDeviation(point.value, rule.expectedRange),
            severity: rule.severity,
            cause: rule.description,
            recommendation: rule.recommendation
          });
        }
      }
    }

    return anomalies;
  }

  private calculateSeverity(deviation: number, threshold: number): 'low' | 'medium' | 'high' {
    const ratio = deviation / threshold;
    if (ratio > 2) return 'high';
    if (ratio > 1.5) return 'medium';
    return 'low';
  }

  private identifyStatisticalCause(value: number, mean: number, std: number): string {
    if (value > mean + 2 * std) return '數值遠高於正常範圍';
    if (value < mean - 2 * std) return '數值遠低於正常範圍';
    if (value > mean + std) return '數值偏高';
    if (value < mean - std) return '數值偏低';
    return '統計異常';
  }

  private identifyTrendCause(value: number, expected: number, slope: number): string {
    const direction = slope > 0 ? '上升' : '下降';
    if (value > expected) return `偏離${direction}趨勢，數值過高`;
    return `偏離${direction}趨勢，數值過低`;
  }

  private identifySeasonalCause(value: number, seasonalAvg: number, month: number): string {
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月',
                       '7月', '8月', '9月', '10月', '11月', '12月'];
    if (value > seasonalAvg) return `${monthNames[month]}數值偏高，不符合季節模式`;
    return `${monthNames[month]}數值偏低，不符合季節模式`;
  }

  private generateStatisticalRecommendation(metric: string, value: number, mean: number): string {
    if (value > mean) {
      return `建議調查${metric}突然增加的原因，可能需要調整預算或資源分配`;
    }
    return `建議檢查${metric}下降原因，評估是否需要補救措施`;
  }

  private generateTrendRecommendation(metric: string, value: number, expected: number): string {
    if (value > expected) {
      return `正向異常可能代表改善成果，建議分析成功因素並複製到其他領域`;
    }
    return `負向異常需要關注，建議進行根本原因分析並制定改善計畫`;
  }

  private generateSeasonalRecommendation(metric: string, value: number, seasonalAvg: number): string {
    if (value > seasonalAvg) {
      return `季節性高峰可能代表正常波動，建議評估是否需要額外資源應對`;
    }
    return `季節性低谷偏離正常，建議檢查是否存在特殊情況或系統性問題`;
  }

  private calculateMovingAverages(data: Array<{ date: string; value: number }>, window: number): number[] {
    const averages: number[] = [];
    for (let i = window - 1; i < data.length; i++) {
      const windowData = data.slice(i - window + 1, i + 1);
      const avg = windowData.reduce((sum, d) => sum + d.value, 0) / window;
      averages.push(avg);
    }
    return averages;
  }

  private calculateTrendSlope(data: Array<{ date: string; value: number }>): number {
    if (data.length < 2) return 0;

    const n = data.length;
    const sumX = data.reduce((sum, _, i) => sum + i, 0);
    const sumY = data.reduce((sum, d) => sum + d.value, 0);
    const sumXY = data.reduce((sum, d, i) => sum + i * d.value, 0);
    const sumXX = data.reduce((sum, _, i) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  private predictExpectedValue(index: number, data: Array<{ date: string; value: number }>, slope: number): number {
    // 使用線性回歸預測
    const recentData = data.slice(-10); // 使用最近10點
    const avgY = recentData.reduce((sum, d) => sum + d.value, 0) / recentData.length;
    const avgX = (recentData.length - 1) / 2; // 中心點

    return avgY + slope * (index - avgX - (data.length - recentData.length));
  }

  private extractMonthlyPatterns(data: Array<{ date: string; value: number }>): Record<number, { average: number; std: number }> {
    const monthlyData: Record<number, number[]> = {};

    for (const point of data) {
      const month = new Date(point.date).getMonth();
      if (!monthlyData[month]) monthlyData[month] = [];
      monthlyData[month].push(point.value);
    }

    const patterns: Record<number, { average: number; std: number }> = {};
    for (const [month, values] of Object.entries(monthlyData)) {
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
      const std = Math.sqrt(variance);

      patterns[parseInt(month)] = { average, std };
    }

    return patterns;
  }

  private getBusinessRules(metric: string): Array<{
    condition: (value: number) => boolean;
    expectedRange: { min: number; max: number };
    severity: 'low' | 'medium' | 'high';
    description: string;
    recommendation: string;
  }> {
    const rules = {
      carbon_emission: [
        {
          condition: (value) => value < 0,
          expectedRange: { min: 0, max: Infinity },
          severity: 'high' as const,
          description: '碳排放量不能為負值',
          recommendation: '檢查數據輸入或計算邏輯錯誤'
        },
        {
          condition: (value) => value > 10000,
          expectedRange: { min: 0, max: 10000 },
          severity: 'medium' as const,
          description: '單月碳排放異常偏高',
          recommendation: '檢查是否有突發事件或數據錯誤'
        }
      ],
      employee_satisfaction: [
        {
          condition: (value) => value < 0 || value > 100,
          expectedRange: { min: 0, max: 100 },
          severity: 'high' as const,
          description: '員工滿意度超出合理範圍',
          recommendation: '檢查問卷設計或數據處理流程'
        }
      ],
      waste_generation: [
        {
          condition: (value) => value < 0,
          expectedRange: { min: 0, max: Infinity },
          severity: 'high' as const,
          description: '廢棄物產生量不能為負值',
          recommendation: '檢查數據記錄或計算錯誤'
        }
      ]
    };

    return rules[metric] || [];
  }

  private checkBusinessRule(point: { date: string; value: number }, rule: any): boolean {
    return rule.condition(point.value);
  }

  private calculateBusinessDeviation(value: number, expectedRange: { min: number; max: number }): number {
    if (value < expectedRange.min) return expectedRange.min - value;
    if (value > expectedRange.max) return value - expectedRange.max;
    return 0;
  }

  private assessOverallHealth(anomalies: AnomalyDetectionResult['anomalies']): 'healthy' | 'warning' | 'critical' {
    const highSeverity = anomalies.filter(a => a.severity === 'high').length;
    const mediumSeverity = anomalies.filter(a => a.severity === 'medium').length;

    if (highSeverity > 0 || mediumSeverity > 2) return 'critical';
    if (mediumSeverity > 0 || anomalies.length > 5) return 'warning';
    return 'healthy';
  }

  private calculateRiskScore(anomalies: AnomalyDetectionResult['anomalies']): number {
    const severityWeights = { high: 1.0, medium: 0.6, low: 0.3 };
    const totalWeight = anomalies.reduce((sum, a) => sum + severityWeights[a.severity], 0);

    // 正規化到0-100
    return Math.min(100, totalWeight * 10);
  }

  async isHealthy(): Promise<boolean> {
    try {
      const testData = {
        test_metric: [
          { date: '2024-01-01', value: 100 },
          { date: '2024-01-02', value: 105 },
          { date: '2024-01-03', value: 95 },
          { date: '2024-01-04', value: 200 }, // 異常值
          { date: '2024-01-05', value: 102 }
        ]
      };

      const result = await this.detect({ data: testData });
      return result.anomalies.length > 0; // 應該偵測到異常
    } catch (error) {
      console.error('異常偵測器健康檢查失敗:', error);
      return false;
    }
  }
}