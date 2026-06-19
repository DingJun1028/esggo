/**
 * 📊 Omni Analytics Engine
 * ESG 分析引擎核心
 * 
 * 職責：
 * - 收集與整合多來源數據
 * - 提供分析儀表板數據
 * - 生成趨勢分析與預測
 * - 支持 5T 密封報告生成
 */

import { v4 as uuidv4 } from 'uuid';

export type MetricCategory = 
    | 'carbon' 
    | 'governance' 
    | 'excellence' 
    | 'impact' 
    | 'financial'
    | 'social';

export interface IMetric {
    id: string;
    category: MetricCategory;
    name: string;
    value: number;
    unit: string;
    timestamp: number;
    source: string;
    verified: boolean;
}

export interface ITimeSeriesData {
    metricId: string;
    data: Array<{
        timestamp: number;
        value: number;
    }>;
}

export interface IAnalysisResult {
    id: string;
    type: 'trend' | 'comparison' | 'prediction' | 'benchmark';
    category: MetricCategory;
    summary: string;
    insights: string[];
    score?: number;
    recommendations: string[];
    timestamp: number;
}

export interface IDashboardConfig {
    id: string;
    name: string;
    categories: MetricCategory[];
    metrics: string[];
    refreshInterval?: number; // in milliseconds
}

/**
 * 分析引擎主類別
 */
export class OmniAnalyticsEngine {
    private static instance: OmniAnalyticsEngine;
    private metrics: Map<string, IMetric> = new Map();
    private timeSeries: Map<string, ITimeSeriesData> = new Map();
    private dashboards: Map<string, IDashboardConfig> = new Map();

    private constructor() {}

    static getInstance(): OmniAnalyticsEngine {
        if (!OmniAnalyticsEngine.instance) {
            OmniAnalyticsEngine.instance = new OmniAnalyticsEngine();
        }
        return OmniAnalyticsEngine.instance;
    }

    /**
     * 添加指標數據
     */
    addMetric(metric: Omit<IMetric, 'id'>): IMetric {
        const id = uuidv4();
        const newMetric: IMetric = { ...metric, id };
        this.metrics.set(id, newMetric);

        // 添加到時間序列
        if (!this.timeSeries.has(metric.name)) {
            this.timeSeries.set(metric.name, {
                metricId: metric.name,
                data: []
            });
        }
        
        const series = this.timeSeries.get(metric.name)!;
        series.data.push({
            timestamp: metric.timestamp,
            value: metric.value
        });

        // 保持最近的 1000 個數據點
        if (series.data.length > 1000) {
            series.data = series.data.slice(-1000);
        }

        return newMetric;
    }

    /**
     * 獲取指標
     */
    getMetric(id: string): IMetric | undefined {
        return this.metrics.get(id);
    }

    /**
     * 獲取所有指標
     */
    getAllMetrics(category?: MetricCategory): IMetric[] {
        const allMetrics = Array.from(this.metrics.values());
        if (category) {
            return allMetrics.filter(m => m.category === category);
        }
        return allMetrics;
    }

    /**
     * 獲取時間序列數據
     */
    getTimeSeries(metricName: string, from?: number, to?: number): ITimeSeriesData | undefined {
        const series = this.timeSeries.get(metricName);
        if (!series) return undefined;

        let data = series.data;
        if (from || to) {
            data = data.filter(d => 
                (!from || d.timestamp >= from) && 
                (!to || d.timestamp <= to)
            );
        }

        return { ...series, data };
    }

    /**
     * 趨勢分析
     */
    analyzeTrend(metricName: string, periodDays: number = 30): IAnalysisResult {
        const series = this.timeSeries.get(metricName);
        
        if (!series || series.data.length < 2) {
            return {
                id: uuidv4(),
                type: 'trend',
                category: 'excellence',
                summary: '數據不足，無法進行趨勢分析',
                insights: [],
                recommendations: ['收集更多數據以進行準確分析'],
                timestamp: Date.now()
            };
        }

        const now = Date.now();
        const periodMs = periodDays * 24 * 60 * 60 * 1000;
        const cutoff = now - periodMs;
        
        const periodData = series.data.filter(d => d.timestamp >= cutoff);
        
        if (periodData.length < 2) {
            return {
                id: uuidv4(),
                type: 'trend',
                category: 'excellence',
                summary: '近期數據不足',
                insights: [],
                recommendations: ['等待更多數據點'],
                timestamp: Date.now()
            };
        }

        // 計算趨勢
        const values = periodData.map(d => d.value);
        const firstValue = values[0];
        const lastValue = values[values.length - 1];
        const change = ((lastValue - firstValue) / firstValue) * 100;
        
        // 計算平均變化率
        const avgChange = values.reduce((acc, v, i) => {
            if (i === 0) return acc;
            return acc + (v - values[i-1]);
        }, 0) / (values.length - 1);

        const trend = change > 5 ? '上升' : change < -5 ? '下降' : '持平';
        
        const insights: string[] = [];
        if (change > 0) insights.push(`指標上升了 ${change.toFixed(1)}%`);
        if (change < 0) insights.push(`指標下降了 ${Math.abs(change).toFixed(1)}%`);
        
        // 計算季節性 (簡單)
        if (periodData.length >= 7) {
            const weekData = periodData.slice(-7);
            const weekAvg = weekData.reduce((a, b) => a + b.value, 0) / weekData.length;
            const overallAvg = values.reduce((a, b) => a + b, 0) / values.length;
            if (weekAvg > overallAvg * 1.1) {
                insights.push('近期表現低於平均');
            } else if (weekAvg < overallAvg * 0.9) {
                insights.push('近期表現優於平均');
            }
        }

        return {
            id: uuidv4(),
            type: 'trend',
            category: 'excellence',
            summary: `過去 ${periodDays} 天趨勢：${trend} (${change >= 0 ? '+' : ''}${change.toFixed(1)}%)`,
            insights,
            score: Math.min(100, Math.max(0, 50 + change)),
            recommendations: this.generateTrendRecommendations(change, metricName),
            timestamp: Date.now()
        };
    }

    /**
     * 生成趨勢建議
     */
    private generateTrendRecommendations(change: number, metricName: string): string[] {
        const recommendations: string[] = [];
        
        if (change > 10) {
            recommendations.push('關注快速增長趨勢，評估是否可持續');
            recommendations.push('考慮設置預警機制');
        } else if (change < -10) {
            recommendations.push('分析下降原因，制定改進計劃');
            recommendations.push('與相關團隊召開檢討會議');
        } else {
            recommendations.push('維持當前趨勢，持續監控');
        }

        // 根據指標名稱添加特定建議
        if (metricName.toLowerCase().includes('carbon')) {
            recommendations.push('檢查碳減排措施的執行情況');
        } else if (metricName.toLowerCase().includes('esg')) {
            recommendations.push('關注 ESG 評級變化');
        }

        return recommendations;
    }

    /**
     * 比較分析
     */
    compareMetrics(metricNames: string[]): IAnalysisResult {
        const values = metricNames.map(name => {
            const series = this.timeSeries.get(name);
            if (!series || series.data.length === 0) return null;
            return {
                name,
                latest: series.data[series.data.length - 1].value,
                avg: series.data.reduce((a, b) => a + b.value, 0) / series.data.length
            };
        }).filter(Boolean) as Array<{name: string, latest: number, avg: number}>;

        if (values.length < 2) {
            return {
                id: uuidv4(),
                type: 'comparison',
                category: 'excellence',
                summary: '需要至少2個指標進行比較',
                insights: [],
                recommendations: ['添加更多指標數據'],
                timestamp: Date.now()
            };
        }

        const insights = values.map(v => `${v.name}: 最新值=${v.latest.toFixed(2)}, 平均=${v.avg.toFixed(2)}`);
        
        // 找出最佳和最差
        const sorted = [...values].sort((a, b) => b.latest - a.latest);
        const best = sorted[0];
        const worst = sorted[sorted.length - 1];

        insights.push(`最佳表現：${best.name} (${best.latest.toFixed(2)})`);
        insights.push(`需要改進：${worst.name} (${worst.latest.toFixed(2)})`);

        return {
            id: uuidv4(),
            type: 'comparison',
            category: 'excellence',
            summary: `比較了 ${values.length} 個指標`,
            insights,
            recommendations: [
                `借鑒 ${best.name} 的成功經驗`,
                `針對 ${worst.name} 制定改進計劃`
            ],
            timestamp: Date.now()
        };
    }

    /**
     * 基準對比
     */
    benchmark(metricName: string, benchmarkValue: number): IAnalysisResult {
        const series = this.timeSeries.get(metricName);
        
        if (!series || series.data.length === 0) {
            return {
                id: uuidv4(),
                type: 'benchmark',
                category: 'excellence',
                summary: '無可用數據',
                insights: [],
                recommendations: ['收集基準數據'],
                timestamp: Date.now()
            };
        }

        const latest = series.data[series.data.length - 1].value;
        const avg = series.data.reduce((a, b) => a + b.value, 0) / series.data.length;
        
        const diff = latest - benchmarkValue;
        const percentDiff = (diff / benchmarkValue) * 100;
        
        const status = percentDiff > 10 ? '領先' : percentDiff < -10 ? '落後' : '接近';

        return {
            id: uuidv4(),
            type: 'benchmark',
            category: 'excellence',
            summary: `相對於基準：${status} (${percentDiff >= 0 ? '+' : ''}${percentDiff.toFixed(1)}%)`,
            insights: [
                `最新值: ${latest.toFixed(2)}`,
                `平均值: ${avg.toFixed(2)}`,
                `基準值: ${benchmarkValue.toFixed(2)}`,
                `差距: ${diff >= 0 ? '+' : ''}${diff.toFixed(2)}`
            ],
            score: Math.min(100, Math.max(0, 50 + percentDiff)),
            recommendations: this.generateBenchmarkRecommendations(percentDiff),
            timestamp: Date.now()
        };
    }

    /**
     * 生成基準建議
     */
    private generateBenchmarkRecommendations(percentDiff: number): string[] {
        if (percentDiff > 20) {
            return ['表現優異，可作為行業標竿', '分享最佳實踐'];
        } else if (percentDiff > 0) {
            return ['略微領先，保持當前策略'];
        } else if (percentDiff > -20) {
            return ['接近基準，持續改進'];
        } else {
            return ['落後於基準，需要立即關注', '進行根本原因分析'];
        }
    }

    /**
     * 創建儀表板配置
     */
    createDashboard(config: Omit<IDashboardConfig, 'id'>): IDashboardConfig {
        const id = uuidv4();
        const dashboard: IDashboardConfig = { ...config, id };
        this.dashboards.set(id, dashboard);
        return dashboard;
    }

    /**
     * 獲取儀表板
     */
    getDashboard(id: string): IDashboardConfig | undefined {
        return this.dashboards.get(id);
    }

    /**
     * 獲取儀表板數據
     */
    getDashboardData(dashboardId: string): Record<string, IMetric[]> {
        const dashboard = this.dashboards.get(dashboardId);
        if (!dashboard) return {};

        const data: Record<string, IMetric[]> = {};
        
        dashboard.categories.forEach(category => {
            data[category] = this.getAllMetrics(category);
        });

        return data;
    }

    /**
     * 生成摘要報告
     */
    generateSummary(category?: MetricCategory): {
        totalMetrics: number;
        categories: Record<MetricCategory, number>;
        verifiedCount: number;
        latestMetrics: IMetric[];
    } {
        const metrics = category ? this.getAllMetrics(category) : Array.from(this.metrics.values());
        
        const categories = {} as Record<MetricCategory, number>;
        let verifiedCount = 0;

        metrics.forEach(m => {
            categories[m.category] = (categories[m.category] || 0) + 1;
            if (m.verified) verifiedCount++;
        });

        return {
            totalMetrics: metrics.length,
            categories,
            verifiedCount,
            latestMetrics: metrics.slice(-10)
        };
    }
}

export default OmniAnalyticsEngine;
