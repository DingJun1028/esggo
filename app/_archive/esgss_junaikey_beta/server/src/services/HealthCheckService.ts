/**
 * HealthCheckService.ts
 * ---------------------
 * 企業健康檢查服務：分析 ESG 各維度指標並計算健康評分。
 * 
 * 核心標準：GRI, SASB, TCFD
 */

import { SustainabilityReport, ReportMetric } from './SustainabilityReportService.js';

export interface HealthScore {
    overall: number;
    e_score: number;
    s_score: number;
    g_score: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    criticalIssues: string[];
    strengths: string[];
}

export interface BenchmarkingData {
    industryAverage: number;
    topPercentile: number;
    userPercentile: number;
}

export class HealthCheckService {
    private static instance: HealthCheckService;

    static getInstance(): HealthCheckService {
        if (!HealthCheckService.instance) {
            HealthCheckService.instance = new HealthCheckService();
        }
        return HealthCheckService.instance;
    }

    /**
     * 執行全面健康檢查
     */
    async performHealthCheck(report: SustainabilityReport): Promise<HealthScore> {
        const metrics = report.metrics;

        const e_metrics = metrics.filter(m => m.category === 'E');
        const s_metrics = metrics.filter(m => m.category === 'S');
        const g_metrics = metrics.filter(m => m.category === 'G');

        const e_score = this.calculateCategoryScore(e_metrics);
        const s_score = this.calculateCategoryScore(s_metrics);
        const g_score = this.calculateCategoryScore(g_metrics);

        const overall = Math.round((e_score + s_score + g_score) / 3);

        const criticalIssues: string[] = [];
        const strengths: string[] = [];

        // 簡單邏輯：狀態為 off_track 的視為 critical
        metrics.forEach(m => {
            if (m.status === 'off_track') criticalIssues.push(`[${m.category}] ${m.name} 嚴重偏離目標`);
            if (m.status === 'on_track' && m.yearOverYear && m.yearOverYear < -10) strengths.push(`[${m.category}] ${m.name} 顯著改善 (-${Math.abs(m.yearOverYear)}%)`);
        });

        return {
            overall,
            e_score,
            s_score,
            g_score,
            riskLevel: overall > 80 ? 'Low' : overall > 60 ? 'Medium' : 'High',
            criticalIssues: criticalIssues.slice(0, 3),
            strengths: strengths.slice(0, 3)
        };
    }

    /**
     * 取得行業基準數據 (Mock)
     */
    async getBenchmarking(industry: string): Promise<BenchmarkingData> {
        return {
            industryAverage: 65,
            topPercentile: 90,
            userPercentile: 72
        };
    }

    private calculateCategoryScore(metrics: ReportMetric[]): number {
        if (metrics.length === 0) return 0;

        let scoreSum = 0;
        metrics.forEach(m => {
            if (m.status === 'on_track') scoreSum += 100;
            else if (m.status === 'at_risk') scoreSum += 60;
            else scoreSum += 20;
        });

        return Math.round(scoreSum / metrics.length);
    }
}

export const healthCheckService = HealthCheckService.getInstance();
