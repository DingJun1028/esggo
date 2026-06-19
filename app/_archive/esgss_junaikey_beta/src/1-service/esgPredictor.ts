import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { PredictionResult } from './aiIntelligence';

export class ESGPredictor {
  private models: Map<string, any>;

  constructor() {
    this.models = new Map();
    this.initializeModels();
  }

  async predict(params: {
    metric: string;
    data: any[];
    horizon: number;
    scenario: 'baseline' | 'optimistic' | 'pessimistic';
    confidenceThreshold: number;
  }): Promise<PredictionResult> {
    const { metric, data, scenario, horizon, confidenceThreshold } = params;

    if (data.length < 6) {
      throw new Error('數據點不足，至少需要6個月數據');
    }

    // 選擇預測模型
    const model = this.selectModel(metric);

    // 準備數據
    const processedData = this.preprocessData(data);

    // 生成預測
    const prediction = await this.generatePrediction(processedData, scenario, horizon, model);

    // 計算信心度
    const confidence = this.calculateConfidence(prediction, processedData);

    if (confidence < confidenceThreshold) {
      omniLogger.warn(
        LogCategory.AI,
        `預測信心度不足: ${confidence.toFixed(2)} < ${confidenceThreshold}`
      );
    }

    const lastValue = processedData.length > 0 ? (processedData[processedData.length - 1] ?? 0) : 0;

    return {
      metric: params.metric,
      currentValue: lastValue,
      predictedValue: prediction.value,
      confidence,
      scenario: params.scenario,
      trend: this.determineTrend(processedData),
      uncertainty: prediction.uncertainty,
      dataPoints: this.generateDataPoints(processedData, prediction, horizon),
    };
  }

  private initializeModels(): void {
    // 初始化不同指標的預測模型
    this.models.set('carbon_emission', {
      type: 'time_series',
      algorithm: 'exponential_smoothing',
      parameters: { alpha: 0.3 },
    });

    this.models.set('energy_consumption', {
      type: 'regression',
      algorithm: 'linear_regression',
      parameters: { include_seasonality: true },
    });

    this.models.set('waste_generation', {
      type: 'time_series',
      algorithm: 'arima',
      parameters: { p: 1, d: 1, q: 1 },
    });

    this.models.set('employee_satisfaction', {
      type: 'classification',
      algorithm: 'random_forest',
      parameters: { n_estimators: 100 },
    });

    // 預設模型
    this.models.set('default', {
      type: 'time_series',
      algorithm: 'moving_average',
      parameters: { window: 3 },
    });
  }

  private selectModel(metric: string): any {
    // 根據指標類型選擇模型
    const m = metric.toLowerCase();
    if (m.includes('carbon') || m.includes('emission')) {
      return this.models.get('carbon_emission');
    }
    if (m.includes('energy')) {
      return this.models.get('energy_consumption');
    }
    if (m.includes('waste')) {
      return this.models.get('waste_generation');
    }
    if (m.includes('satisfaction') || m.includes('engagement')) {
      return this.models.get('employee_satisfaction');
    }

    return this.models.get('default');
  }

  private preprocessData(data: Array<{ date: string; value: number }>): number[] {
    // 數據預處理：排序、去重、異常值處理
    const sorted = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // 簡單的異常值檢測（IQR方法）
    const values = sorted.map(d => d.value);
    const q1 = this.quantile(values, 0.25);
    const q3 = this.quantile(values, 0.75);
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    // 去除異常值
    const filteredValues = values.filter(v => v >= lowerBound && v <= upperBound);

    return filteredValues.length > 0 ? filteredValues : values;
  }

  private async generatePrediction(
    data: number[],
    scenario: string,
    horizon: number,
    model: any
  ): Promise<{ value: number; uncertainty: number; details: any }> {
    switch (model.algorithm) {
      case 'exponential_smoothing':
        return this.exponentialSmoothing(data, scenario, horizon, model.parameters);

      case 'moving_average':
        return this.movingAverage(data, horizon);

      case 'linear_regression':
        return this.linearRegression(data, horizon, model.parameters);

      default:
        return this.simpleExtrapolation(data, scenario, horizon);
    }
  }

  private exponentialSmoothing(
    data: number[],
    scenario: string,
    horizon: number,
    params: any
  ): { value: number; uncertainty: number; details: any } {
    const alpha = params.alpha || 0.3;
    let smoothed = data.length > 0 ? (data[0] ?? 0) : 0;

    // 計算平滑值
    for (let i = 1; i < data.length; i++) {
      smoothed = alpha * (data[i] ?? 0) + (1 - alpha) * smoothed;
    }

    // 根據情境調整
    let adjustment = 1.0;
    switch (scenario) {
      case 'optimistic':
        adjustment = 0.95; // 5%改善
        break;
      case 'pessimistic':
        adjustment = 1.05; // 5%惡化
        break;
      case 'baseline':
      default:
        adjustment = 1.0;
        break;
    }

    const predictedValue = smoothed * adjustment;

    // 計算不確定性（基於歷史變異性）
    const variance = this.calculateVariance(data);
    const uncertainty = Math.sqrt(variance / data.length) * horizon;

    return {
      value: predictedValue,
      uncertainty,
      details: { method: 'exponential_smoothing', alpha, adjustment },
    };
  }

  private movingAverage(
    data: number[],
    horizon: number
  ): { value: number; uncertainty: number; details: any } {
    const windowSize = Math.min(data.length, 3);
    const recent = data.slice(-windowSize);
    const average = recent.reduce((sum, val) => sum + val, 0) / recent.length;

    const variance = this.calculateVariance(recent);
    const uncertainty = Math.sqrt(variance) * Math.sqrt(horizon);

    return {
      value: average,
      uncertainty,
      details: { method: 'moving_average', window: windowSize },
    };
  }

  private linearRegression(
    data: number[],
    horizon: number,
    params: any
  ): { value: number; uncertainty: number; details: any } {
    const n = data.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = data;

    // 簡單線性回歸
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * (y[i] ?? 0), 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // 預測未來值
    const futureX = n + horizon - 1;
    const predictedValue = slope * futureX + intercept;

    // 計算R平方和不確定性
    const yMean = sumY / n;
    const ssRes = y.reduce((sum, yi, i) => {
      const predicted = slope * (x[i] ?? 0) + intercept;
      return sum + Math.pow((yi ?? 0) - predicted, 2);
    }, 0);
    const ssTot = y.reduce((sum, yi) => sum + Math.pow((yi ?? 0) - yMean, 2), 0);
    const rSquared = 1 - ssRes / ssTot;

    const uncertainty = Math.sqrt(ssRes / (n - 2)) * Math.sqrt(horizon);

    return {
      value: Math.max(0, predictedValue), // 確保非負
      uncertainty,
      details: { method: 'linear_regression', slope, intercept, rSquared },
    };
  }

  private simpleExtrapolation(
    data: number[],
    scenario: string,
    horizon: number
  ): { value: number; uncertainty: number; details: any } {
    // 簡單外推：使用最近趨勢
    const recent = data.slice(-6); // 最近6個月
    const trend =
      recent.length > 1
        ? ((recent[recent.length - 1] ?? 0) - (recent[0] ?? 0)) / Math.max(1, recent.length - 1)
        : 0;

    let adjustment = 1.0;
    switch (scenario) {
      case 'optimistic':
        adjustment = trend > 0 ? 0.9 : 1.1;
        break;
      case 'pessimistic':
        adjustment = trend > 0 ? 1.1 : 0.9;
        break;
    }

    const extrapolatedValue = (recent[recent.length - 1] ?? 0) + trend * horizon;
    const predictedValue = extrapolatedValue * adjustment;

    const variance = this.calculateVariance(recent);
    const uncertainty = Math.sqrt(variance) * horizon;

    return {
      value: Math.max(0, predictedValue),
      uncertainty,
      details: { method: 'simple_extrapolation', trend, adjustment },
    };
  }

  private calculateConfidence(prediction: any, data: number[]): number {
    // 基於預測不確定性和數據品質計算信心度
    const uncertaintyRatio = prediction.uncertainty / Math.max(1, Math.abs(prediction.value));
    const dataConsistency = this.calculateDataConsistency(data);

    // 簡化的信心度計算
    let confidence = Math.max(0, 1 - uncertaintyRatio - (1 - dataConsistency));

    // 情境調整
    if (prediction.details.adjustment && prediction.details.adjustment !== 1.0) {
      confidence *= 0.9; // 情境預測信心度略低
    }

    return Math.min(1, Math.max(0, confidence));
  }

  private determineTrend(data: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (data.length < 3) return 'stable';

    const recent = data.slice(-3);
    const first = recent[0] ?? 0;
    const last = recent[recent.length - 1] ?? 0;

    const change = first === 0 ? 0 : (last - first) / first;

    if (Math.abs(change) < 0.05) return 'stable'; // 5%以內視為穩定
    return change > 0 ? 'increasing' : 'decreasing';
  }

  private generateDataPoints(
    historical: number[],
    prediction: any,
    horizon: number
  ): Array<{ date: string; value: number; predicted: boolean }> {
    const points: Array<{ date: string; value: number; predicted: boolean }> = [];

    // 歷史數據點
    historical.forEach((value, index) => {
      points.push({
        date:
          new Date(Date.now() - (historical.length - index) * 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0] || '',
        value,
        predicted: false,
      });
    });

    // 預測數據點
    for (let i = 1; i <= horizon; i++) {
      const predictedDate = new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      const predictedValue = prediction.value * (1 + (Math.random() - 0.5) * 0.1); // 添加一些變異

      points.push({
        date: predictedDate || '',
        value: predictedValue,
        predicted: true,
      });
    }

    return points;
  }

  private quantile(arr: number[], q: number): number {
    const sorted = [...arr].sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
      return (sorted[base] ?? 0) + rest * ((sorted[base + 1] ?? 0) - (sorted[base] ?? 0));
    } else {
      return sorted[base] ?? 0;
    }
  }

  private calculateVariance(data: number[]): number {
    if (data.length === 0) return 0;
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / data.length;
  }

  private calculateDataConsistency(data: number[]): number {
    if (data.length < 2) return 0.5;

    // 計算變異係數
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    if (mean === 0) return 0.5;
    const variance = this.calculateVariance(data);
    const cv = Math.sqrt(variance) / Math.abs(mean);

    // 轉換為一致性分數 (0-1)
    return Math.max(0, 1 - cv);
  }

  async isHealthy(): Promise<boolean> {
    return true;
  }
}
