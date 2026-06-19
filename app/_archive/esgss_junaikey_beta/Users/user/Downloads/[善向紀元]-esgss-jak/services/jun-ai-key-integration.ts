/**
 * JunAiKey 集成模組
 * 提供與 JunAiKey AI 系統的接口
 */

export interface TrendAnalysis {
  direction: 'increasing' | 'decreasing' | 'stable';
  slope: number;
  volatility: number;
  forecast: number[];
  confidence: number;
}

export interface JunAiKeyAPI {
  analyzeTrend(dataPoints: { x: number; y: number }[]): Promise<TrendAnalysis>;
  generateInsights(data: any): Promise<any>;
}

class JunAiKeyIntegration implements JunAiKeyAPI {
  async analyzeTrend(dataPoints: { x: number; y: number }[]): Promise<TrendAnalysis> {
    // 簡單的趨勢分析實現
    if (dataPoints.length < 2) {
      return {
        direction: 'stable',
        slope: 0,
        volatility: 0,
        forecast: [dataPoints[0]?.y || 0],
        confidence: 0
      };
    }

    // 計算斜率
    const n = dataPoints.length;
    const sumX = dataPoints.reduce((sum, p) => sum + p.x, 0);
    const sumY = dataPoints.reduce((sum, p) => sum + p.y, 0);
    const sumXY = dataPoints.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumXX = dataPoints.reduce((sum, p) => sum + p.x * p.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // 計算波動性
    const predictions = dataPoints.map(p => slope * p.x + intercept);
    const errors = dataPoints.map((p, i) => Math.abs(p.y - predictions[i]));
    const volatility = errors.reduce((sum, err) => sum + err, 0) / errors.length / Math.abs(sumY / n);

    // 預測下一個點
    const lastX = dataPoints[n - 1].x;
    const nextX = lastX + (dataPoints[1].x - dataPoints[0].x); // 假設等間隔
    const forecast = [slope * nextX + intercept];

    // 確定方向
    let direction: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (Math.abs(slope) > 0.01) {
      direction = slope > 0 ? 'increasing' : 'decreasing';
    }

    return {
      direction,
      slope,
      volatility: Math.min(volatility, 1), // 限制在 0-1
      forecast,
      confidence: Math.max(0.5, 1 - volatility) // 簡單的信心度計算
    };
  }

  async generateInsights(data: any): Promise<any> {
    // 簡單的洞察生成
    return {
      insights: ['數據分析完成'],
      recommendations: ['建議持續監控']
    };
  }
}

export const junAiKeyAPI = new JunAiKeyIntegration();