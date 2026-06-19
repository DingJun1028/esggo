/**
 * 📊 Best Practice Planning Service
 * 
 * 最佳實踐規劃平台服務層
 * 
 * Core Functions:
 * 1. Best Practice Repository Management (最佳實踐庫管理)
 * 2. Template Analysis Engine (範本分析引擎)
 * 3. Benchmark Comparison (標竿對照)
 * 4. Gap Analysis (缺口分析)
 * 5. Recommendation Generation (建議生成)
 */

import { BestPractice, BenchmarkData, TemplateAnalysis, GapRecommendation } from '@/types/index.js';

// ============================================
// Types
// ============================================

export interface BestPracticeFilters {
    category?: 'governance' | 'environmental' | 'social' | 'all';
    industry?: string;
    year?: number;
    searchQuery?: string;
    applicability?: 'high' | 'medium' | 'low';
    effectiveness?: number;
}

export interface BenchmarkFilters {
    category?: string;
    metric?: string;
    industry?: string;
}

export interface AnalysisConfig {
    years: number[];
    frameworks: string[];
    comparisonMode: 'industry' | 'best-in-class' | 'custom';
    focusAreas: string[];
}

export interface ActionPlan {
    id: string;
    title: string;
    recommendations: GapRecommendation[];
    timeline: string;
    budget: string;
    status: 'draft' | 'active' | 'completed' | 'paused';
    progress: number;
    createdAt: number;
    updatedAt: number;
}

// ============================================
// Service Class
// ============================================

export class OmniBestPracticePlanningService {

    /**
     * Search and filter best practices
     */
    public async searchBestPractices(filters: BestPracticeFilters): Promise<BestPractice[]> {
        // Simulate API call with mock data
        await this.delay(300);

        let results = this.getMockBestPractices();

        if (filters.category && filters.category !== 'all') {
            results = results.filter(p => p.category === filters.category);
        }

        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            results = results.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.industry.toLowerCase().includes(query)
            );
        }

        if (filters.effectiveness) {
            results = results.filter(p => p.effectiveness >= filters.effectiveness!);
        }

        if (filters.applicability) {
            results = results.filter(p => p.applicability === filters.applicability);
        }

        return results;
    }

    /**
     * Get best practice details by ID
     */
    public async getBestPracticeById(id: string): Promise<BestPractice | null> {
        await this.delay(200);
        const practices = this.getMockBestPractices();
        return practices.find(p => p.id === id) || null;
    }

    /**
     * Analyze templates across multiple years
     */
    public async analyzeTemplates(config: AnalysisConfig): Promise<TemplateAnalysis[]> {
        await this.delay(500);

        const analyses: TemplateAnalysis[] = [];

        for (const year of config.years) {
            const analysis = this.generateTemplateAnalysis(year, config.frameworks);
            analyses.push(analysis);
        }

        return analyses;
    }

    /**
     * Generate gap recommendations based on benchmark data
     */
    public async generateGapRecommendations(
        currentData: BenchmarkData[],
        targetData: Partial<BenchmarkData>[]
    ): Promise<GapRecommendation[]> {
        await this.delay(400);

        const recommendations: GapRecommendation[] = [];

        for (const current of currentData) {
            const target = targetData.find(t => t.metric === current.metric);
            const gap = current.myCompany - (target?.topQuartile || current.topQuartile);

            if (gap > 0) {
                const priority = this.determinePriority(gap, current.myCompany);
                const category = this.mapMetricToCategory(current.category);

                recommendations.push({
                    id: `gr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    priority,
                    category,
                    current: `${current.myCompany}${this.getMetricUnit(current.metric)}`,
                    target: `${target?.topQuartile || current.topQuartile}${this.getMetricUnit(current.metric)}`,
                    action: this.generateRecommendationAction(current.metric, priority),
                    timeline: this.estimateTimeline(priority),
                    bestPracticeId: this.findBestPracticeForMetric(current.metric)
                });
            }
        }

        return recommendations.sort((a, b) => this.priorityOrder(a.priority) - this.priorityOrder(b.priority));
    }

    /**
     * Create action plan from recommendations
     */
    public async createActionPlan(
        name: string,
        recommendations: GapRecommendation[],
        timeline: string,
        budget: string
    ): Promise<ActionPlan> {
        await this.delay(300);

        return {
            id: `ap-${Date.now()}`,
            title: name,
            recommendations,
            timeline,
            budget,
            status: 'draft',
            progress: 0,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
    }

    /**
     * Get benchmark data for comparison
     */
    public async getBenchmarkData(filters: BenchmarkFilters): Promise<BenchmarkData[]> {
        await this.delay(300);

        let data = this.getMockBenchmarkData();

        if (filters.category) {
            data = data.filter(d => d.category === filters.category);
        }

        if (filters.metric) {
            data = data.filter(d => d.metric.toLowerCase().includes(filters.metric!.toLowerCase()));
        }

        return data;
    }

    /**
     * Calculate improvement potential
     */
    public async calculateImprovementPotential(benchmarkData: BenchmarkData[]): Promise<{
        totalGaps: number;
        criticalGaps: number;
        estimatedCost: string;
        estimatedTimeline: string;
        potentialImprovement: number;
    }> {
        await this.delay(200);

        const criticalGaps = benchmarkData.filter(d => d.myCompany > d.topQuartile).length;
        const totalGaps = benchmarkData.filter(d => d.myCompany > d.industryAvg).length;

        // Estimate based on gap magnitude
        const avgGap = benchmarkData
            .filter(d => d.myCompany > d.industryAvg)
            .reduce((sum, d) => sum + (d.myCompany - d.industryAvg), 0) / (totalGaps || 1);

        return {
            totalGaps,
            criticalGaps,
            estimatedCost: this.estimateCost(criticalGaps),
            estimatedTimeline: this.estimateTimelineForAllGaps(totalGaps),
            potentialImprovement: Math.round(avgGap * 0.7)
        };
    }

    // ============================================
    // Private Helper Methods
    // ============================================

    private getMockBestPractices(): BestPractice[] {
        return [
            {
                id: 'bp-001',
                category: 'environmental',
                title: 'ISO 14064-1 碳盤查系統化流程',
                description: '建立完整的溫室氣體盤查程序，涵蓋範疇一、二、三排放源',
                source: '台積電 2023 永續報告書',
                industry: '半導體',
                year: 2023,
                effectiveness: 95,
                applicability: 'high',
                metrics: ['碳排放量', '減排目標', '再生能源比例'],
                implementation: { difficulty: 'medium', timeline: '6-12個月', cost: 'medium' }
            },
            {
                id: 'bp-002',
                category: 'social',
                title: 'DEI 多元共融管理系統',
                description: '建立員工多元性數據追蹤與目標設定機制',
                source: '微軟 2023 Sustainability Report',
                industry: '科技業',
                year: 2023,
                effectiveness: 88,
                applicability: 'high',
                metrics: ['女性主管比例', '薪資公平比率', '員工滿意度'],
                implementation: { difficulty: 'easy', timeline: '3-6個月', cost: 'low' }
            },
            {
                id: 'bp-003',
                category: 'governance',
                title: '氣候相關財務揭露 (TCFD) 整合框架',
                description: '將 TCFD 四大核心要素整合至企業風險管理流程',
                source: '金融監督管理委員會',
                industry: '金融服務',
                year: 2023,
                effectiveness: 92,
                applicability: 'high',
                metrics: ['氣候風險評估', '情境分析', '財務影響量化'],
                implementation: { difficulty: 'hard', timeline: '12-18個月', cost: 'high' }
            },
            {
                id: 'bp-004',
                category: 'environmental',
                title: '科學基礎減碳目標 (SBTi) 設定方法論',
                description: '依據 SBTi 標準設定符合 1.5°C 溫控路徑的減排目標',
                source: 'Apple 2023 Environmental Progress Report',
                industry: '科技業',
                year: 2023,
                effectiveness: 97,
                applicability: 'high',
                metrics: ['減排幅度', '目標年份', '再生能源占比'],
                implementation: { difficulty: 'hard', timeline: '6-12個月', cost: 'medium' }
            },
            {
                id: 'bp-005',
                category: 'social',
                title: '供應商永續評估與輔導機制',
                description: '建立供應商 ESG 評估標準與分級輔導制度',
                source: 'Walmart 2023 ESG Report',
                industry: '零售',
                year: 2023,
                effectiveness: 85,
                applicability: 'medium',
                metrics: ['供應商合規率', '輔導覆蓋率', '稽核發現數'],
                implementation: { difficulty: 'medium', timeline: '12-24個月', cost: 'medium' }
            },
            {
                id: 'bp-006',
                category: 'governance',
                title: '永續資訊安全管理體系',
                description: '整合 ESG 數據管理與資訊安全管理，確保揭露可信度',
                source: '資誠永續發展服務',
                industry: '專業服務',
                year: 2023,
                effectiveness: 90,
                applicability: 'medium',
                metrics: ['資安事件數', '數據正確性', '稽核覆蓋率'],
                implementation: { difficulty: 'medium', timeline: '6-12個月', cost: 'medium' }
            }
        ];
    }

    private getMockBenchmarkData(): BenchmarkData[] {
        return [
            { category: '環境', metric: '碳排放密度 (tCO2e/百萬營收)', myCompany: 52, industryAvg: 68, topQuartile: 45, bestInClass: 32, trend: 'down' },
            { category: '環境', metric: '再生能源使用率 (%)', myCompany: 35, industryAvg: 42, topQuartile: 65, bestInClass: 85, trend: 'up' },
            { category: '環境', metric: '水資源回收率 (%)', myCompany: 28, industryAvg: 35, topQuartile: 50, bestInClass: 72, trend: 'stable' },
            { category: '社會', metric: '女性主管比例 (%)', myCompany: 32, industryAvg: 28, topQuartile: 38, bestInClass: 45, trend: 'up' },
            { category: '社會', metric: '員工訓練時數 (小時/人)', myCompany: 42, industryAvg: 38, topQuartile: 52, bestInClass: 68, trend: 'stable' },
            { category: '社會', metric: '工安事故率 (件/百萬工時)', myCompany: 0.8, industryAvg: 1.2, topQuartile: 0.5, bestInClass: 0.2, trend: 'down' },
            { category: '治理', metric: '獨立董事比例 (%)', myCompany: 45, industryAvg: 40, topQuartile: 50, bestInClass: 60, trend: 'stable' },
            { category: '治理', metric: 'ESG 稽核覆蓋率 (%)', myCompany: 78, industryAvg: 72, topQuartile: 95, bestInClass: 100, trend: 'up' },
            { category: '治理', metric: '永續資訊揭露完整性 (%)', myCompany: 82, industryAvg: 75, topQuartile: 92, bestInClass: 98, trend: 'up' }
        ];
    }

    private generateTemplateAnalysis(year: number, frameworks: string[]): TemplateAnalysis {
        const baseCompleteness = 60 + (year - 2021) * 15;

        return {
            year,
            framework: frameworks[0] || 'GRI Standards',
            completeness: Math.min(baseCompleteness, 95),
            strengths: this.getStrengths(year),
            weaknesses: this.getWeaknesses(year),
            bestPractices: this.getBestPractices(year),
            innovations: this.getInnovations(year),
            gaps: this.getGaps(year)
        };
    }

    private getStrengths(year: number): string[] {
        const strengths: Record<number, string[]> = {
            2023: ['重大性議題鑑別流程完善', '碳排放揭露符合 TCFD', '供應商管理機制健全'],
            2022: ['公司治理揭露完整', '環境管理系統 ISO 14001 認證', '員工福利措施多元'],
            2021: ['公司基本資料揭露', '環境政策制訂', '社会责任活動執行']
        };
        return strengths[year] || strengths[2023] || [];
    }

    private getWeaknesses(year: number): string[] {
        const weaknesses: Record<number, string[]> = {
            2023: ['生物多樣性揭露不足', '範疇三排放盤查不完整', '人權盡職調查待加強'],
            2022: ['碳排放資訊不夠透明', '缺乏明確減排目標', '供應商 ESG 評估待建立'],
            2021: ['缺乏系統性永續規劃', '量化目標設定不足', '數據收集機制不完善']
        };
        return weaknesses[year] || weaknesses[2023] || [];
    }

    private getBestPractices(year: number): string[] {
        const practices: Record<number, string[]> = {
            2023: ['導入科學基礎減碳目標', '建立內部碳定價機制', '推動供應商減碳倡議'],
            2022: ['首次完成範疇一、二盤查', '導入綠色採購政策', '建立廢棄物減量目標'],
            2021: ['首次發布永續報告書', '啟動溫室氣體盤查', '建立環境管理組織']
        };
        return practices[year] || practices[2023] || [];
    }

    private getInnovations(year: number): string[] {
        const innovations: Record<number, string[]> = {
            2023: ['AI 輔助重大性議題分析', '即時碳排放監控系統', '員工 ESG 參與平台'],
            2022: ['發行首本整合報告書', '成立永續發展委員會', '員工志工假制度'],
            2021: ['導入 ISO 14064-1', '成立 ESG 工作小組', '員工環保意識培訓']
        };
        return innovations[year] || innovations[2023] || [];
    }

    private getGaps(year: number): string[] {
        const gaps: Record<number, string[]> = {
            2023: ['自然相關財務揭露 (TNFD)', '氣候情境分析深化', '生物多樣性指標建置'],
            2022: ['範疇三排放盤查', 'SBTi 目標設定', 'TCFD 氣候風險揭露'],
            2021: ['系統性重大性分析', '減排目標設定', '供應商永續管理']
        };
        return gaps[year] || gaps[2023] || [];
    }

    private determinePriority(gap: number, current: number): 'critical' | 'high' | 'medium' | 'low' {
        const gapPercentage = (gap / current) * 100;
        if (gapPercentage > 50) return 'critical';
        if (gapPercentage > 30) return 'high';
        if (gapPercentage > 15) return 'medium';
        return 'low';
    }

    private mapMetricToCategory(category: string): string {
        return category;
    }

    private generateRecommendationAction(metric: string, priority: string): string {
        const actions: Record<string, string> = {
            '再生能源': '參考 RE100 最佳實踐，制定再生能源採購策略',
            '碳排放': '導入 SBTi 科學基礎減碳目標',
            '女性': '制定多元共融目標與培育計畫',
            '工安': '強化工安管理系統與稽核機制',
            '稽核': '擴大 ESG 稽核範圍與深度'
        };

        for (const [key, action] of Object.entries(actions)) {
            if (metric.includes(key)) return action;
        }

        return `參考產業最佳實踐，制定改善計畫`;
    }

    private estimateTimeline(priority: string): string {
        const timelines: Record<string, string> = {
            critical: '3-6 個月',
            high: '6-12 個月',
            medium: '12-18 個月',
            low: '18-24 個月'
        };
        return timelines[priority] || '12 個月';
    }

    private findBestPracticeForMetric(metric: string): string {
        const mapping: Record<string, string> = {
            '再生能源': 'bp-004',
            '碳排放': 'bp-001',
            '女性': 'bp-002',
            '氣候': 'bp-003'
        };

        for (const [key, id] of Object.entries(mapping)) {
            if (metric.includes(key)) return id;
        }

        return 'bp-001';
    }

    private getMetricUnit(metric: string): string {
        if (metric.includes('%')) return '%';
        if (metric.includes('噸')) return ' tCO2e';
        if (metric.includes('小時')) return ' 小時';
        return '';
    }

    private priorityOrder(priority: string): number {
        const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
        return order[priority] || 3;
    }

    private estimateCost(criticalCount: number): string {
        if (criticalCount >= 3) return 'NT$ 500萬-1000萬';
        if (criticalCount >= 2) return 'NT$ 300萬-500萬';
        return 'NT$ 100萬-300萬';
    }

    private estimateTimelineForAllGaps(gapCount: number): string {
        if (gapCount >= 5) return '24-36 個月';
        if (gapCount >= 3) return '18-24 個月';
        return '12-18 個月';
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ============================================
// Singleton Export
// ============================================

export const omniBestPracticePlanningService = new OmniBestPracticePlanningService();
