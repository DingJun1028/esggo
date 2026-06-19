/**
 * 📈 Multi-Year Template Analyzer
 * 
 * 多年永續報告書範本分析引擎
 * 
 * Features:
 * - Historical data comparison
 * - Template standardization
 * - Gap analysis across years
 * - Trend identification
 * - Best practice extraction
 */

import { v4 as uuidv4 } from 'uuid';

// ============================================
// Types & Interfaces
// ============================================

export interface HistoricalReport {
    id: string;
    year: number;
    title: string;
    framework: string;
    griCoverage: number;
    sections: HistoricalSection[];
    keyMetrics: HistoricalMetric[];
    complianceScore: number;
    fileHash: string;
    uploadedAt: Date;
}

export interface HistoricalSection {
    code: string;
    title: string;
    present: boolean;
    wordCount: number;
    dataQuality: 'high' | 'medium' | 'low';
    completeness: number;
}

export interface HistoricalMetric {
    indicator: string;
    unit: string;
    values: { year: number; value: number; verified: boolean }[];
    trend: 'improving' | 'declining' | 'stable' | 'inconsistent';
    cagr?: number; // Compound Annual Growth Rate
    benchmark?: number;
}

export interface TemplateComparison {
    id: string;
    baseYear: number;
    comparisonYear: number;
    addedSections: string[];
    removedSections: string[];
    modifiedSections: string[];
    newIndicators: string[];
    droppedIndicators: string[];
    frameworkChanges: string[];
    complianceTrend: 'improving' | 'declining' | 'stable';
    overallScore: number;
    recommendations: string[];
}

export interface BestPractice {
    id: string;
    year: number;
    section: string;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    replicable: boolean;
    evidence: string[];
}

export interface YearOverYearAnalysis {
    reportId: string;
    year: number;
    previousYear: number;
    metricsComparison: {
        metric: string;
        previousValue: number;
        currentValue: number;
        change: number;
        changePercent: number;
    }[];
    coverageComparison: {
        section: string;
        previousComplete: boolean;
        currentComplete: boolean;
    }[];
    overallProgress: number;
    highlights: string[];
    concerns: string[];
}

// ============================================
// Multi-Year Template Analyzer Class
// ============================================

export class MultiYearTemplateAnalyzer {
    private historicalReports: HistoricalReport[];
    private templates: Map<string, any>;
    private analysisCache: Map<string, any>;

    constructor() {
        this.historicalReports = [];
        this.templates = new Map();
        this.analysisCache = new Map();
        this.initializeTemplates();
    }

    // ========================================
    // Template Initialization
    // ========================================

    private initializeTemplates(): void {
        this.templates.set('GRI-2021', {
            framework: 'GRI Omni 2021',
            sections: [
                { code: 'GRI 1', title: 'Foundation', required: true },
                { code: 'GRI 2', title: 'General Disclosures', required: true },
                { code: 'GRI 3', title: 'Material Topics', required: true }
            ],
            requiredIndicators: [
                'GRI 302-1', 'GRI 302-2', 'GRI 302-3', 'GRI 302-4', 'GRI 302-5',
                'GRI 305-1', 'GRI 305-2', 'GRI 305-3', 'GRI 305-4', 'GRI 305-5',
                'GRI 401-1', 'GRI 403-1', 'GRI 403-2', 'GRI 403-3', 'GRI 403-9',
                'GRI 404-1', 'GRI 404-2', 'GRI 404-3',
                'GRI 405-1', 'GRI 405-2',
                'GRI 205-1', 'GRI 205-2', 'GRI 205-3'
            ]
        });

        this.templates.set('TCFD', {
            framework: 'TCFD',
            sections: [
                { code: 'Gov', title: 'Governance', required: true },
                { code: 'Strat', title: 'Strategy', required: true },
                { code: 'Risk', title: 'Risk Management', required: true },
                { code: 'Metrics', title: 'Metrics and Targets', required: true }
            ]
        });

        this.templates.set('SASB', {
            framework: 'SASB',
            industrySpecific: true,
            sections: []
        });
    }

    // ========================================
    // Report Management
    // ========================================

    addHistoricalReport(report: Omit<HistoricalReport, 'id'>): string {
        const id = uuidv4();
        this.historicalReports.push({
            id,
            ...report
        });

        // Sort by year
        this.historicalReports.sort((a, b) => a.year - b.year);

        return id;
    }

    getHistoricalReports(): HistoricalReport[] {
        return [...this.historicalReports];
    }

    getReportByYear(year: number): HistoricalReport | undefined {
        return this.historicalReports.find(r => r.year === year);
    }

    // ========================================
    // Comparison Analysis
    // ========================================

    compareReports(baseYear: number, comparisonYear: number): TemplateComparison {
        const baseReport = this.getReportByYear(baseYear);
        const comparisonReport = this.getReportByYear(comparisonYear);

        if (!baseReport || !comparisonReport) {
            throw new Error('Report not found for comparison');
        }

        const baseSections = new Set(baseReport.sections.map(s => s.code));
        const comparisonSections = new Set(comparisonReport.sections.map(s => s.code));

        const addedSections = [...comparisonSections].filter(x => !baseSections.has(x));
        const removedSections = [...baseSections].filter(x => !comparisonSections.has(x));
        const modifiedSections = [...baseSections]
            .filter(x => comparisonSections.has(x))
            .filter(code => {
                const baseSec = baseReport.sections.find(s => s.code === code);
                const compSec = comparisonReport.sections.find(s => s.code === code);
                return baseSec?.completeness !== compSec?.completeness;
            });

        const baseIndicators = new Set(baseReport.keyMetrics.map(m => m.indicator));
        const comparisonIndicators = new Set(comparisonReport.keyMetrics.map(m => m.indicator));

        const newIndicators = [...comparisonIndicators].filter(x => !baseIndicators.has(x));
        const droppedIndicators = [...baseIndicators].filter(x => !comparisonIndicators.has(x));

        const complianceTrend = this.calculateComplianceTrend(baseReport, comparisonReport);

        return {
            id: uuidv4(),
            baseYear,
            comparisonYear,
            addedSections,
            removedSections,
            modifiedSections,
            newIndicators,
            droppedIndicators,
            frameworkChanges: this.detectFrameworkChanges(baseReport, comparisonReport),
            complianceTrend,
            overallScore: comparisonReport.complianceScore,
            recommendations: this.generateRecommendations(baseReport, comparisonReport)
        };
    }

    // ========================================
    // Year-over-Year Analysis
    // ========================================

    analyzeYearOverYear(currentYear: number): YearOverYearAnalysis {
        const currentReport = this.getReportByYear(currentYear);
        const previousReport = this.getReportByYear(currentYear - 1);

        if (!currentReport) {
            throw new Error(`Report for ${currentYear} not found`);
        }

        const metricsComparison = currentReport.keyMetrics.map(metric => {
            const previousValue = previousReport?.keyMetrics
                .find(m => m.indicator === metric.indicator)?.values[0]?.value || 0;
            const currentValue = metric.values[0]?.value || 0;
            const change = currentValue - previousValue;
            const changePercent = previousValue !== 0
                ? (change / previousValue) * 100
                : 0;

            return {
                metric: metric.indicator,
                previousValue,
                currentValue,
                change,
                changePercent
            };
        });

        const coverageComparison = currentReport.sections.map(section => ({
            section: section.code,
            previousComplete: previousReport?.sections.find(s => s.code === section.code)?.present || false,
            currentComplete: section.present
        }));

        const overallProgress = this.calculateOverallProgress(currentReport, previousReport);

        return {
            reportId: currentReport.id,
            year: currentYear,
            previousYear: currentYear - 1,
            metricsComparison,
            coverageComparison,
            overallProgress,
            highlights: this.identifyHighlights(metricsComparison, coverageComparison),
            concerns: this.identifyConcerns(metricsComparison, coverageComparison)
        };
    }

    // ========================================
    // Trend Analysis
    // ========================================

    analyzeMetricTrend(indicator: string): HistoricalMetric | null {
        const reports = this.historicalReports.filter(r =>
            r.keyMetrics.some(m => m.indicator === indicator)
        );

        if (reports.length === 0) return null;

        const values = reports.map(r => ({
            year: r.year,
            value: r.keyMetrics.find(m => m.indicator === indicator)?.values[0]?.value || 0,
            verified: r.keyMetrics.find(m => m.indicator === indicator)?.values[0]?.verified || false
        }));

        // Calculate CAGR
        const firstValue = values[0]?.value || 0;
        const lastValue = values[values.length - 1]?.value || 0;
        const years = values.length > 1 ? values[values.length - 1]!.year - values[0]!.year : 1;
        const cagr = years > 0 && firstValue > 0
            ? (Math.pow(lastValue / firstValue, 1 / years) - 1) * 100
            : 0;

        // Determine trend
        let trend: 'improving' | 'declining' | 'stable' | 'inconsistent' = 'stable';
        if (values.length >= 3) {
            const improvements = values.slice(1).filter((v, i) =>
                indicator.toLowerCase().includes('emission')
                    ? v.value < values[i]!.value  // For emissions, lower is better
                    : v.value > values[i]!.value  // For others, higher is better
            ).length;

            if (improvements >= values.length - 1 * 0.7) trend = 'improving';
            else if (improvements <= values.length - 1 * 0.3) trend = 'declining';
            else trend = 'inconsistent';
        }

        return {
            indicator,
            unit: reports[0]!.keyMetrics.find(m => m.indicator === indicator)?.unit || '',
            values,
            trend,
            cagr: Math.round(cagr * 100) / 100
        };
    }

    // ========================================
    // Best Practice Extraction
    // ========================================

    extractBestPractices(): BestPractice[] {
        const bestPractices: BestPractice[] = [];

        this.historicalReports.forEach(report => {
            // Find high-quality sections
            report.sections
                .filter(s => s.dataQuality === 'high' && s.completeness >= 90)
                .forEach(section => {
                    bestPractices.push({
                        id: uuidv4(),
                        year: report.year,
                        section: section.code,
                        title: `Exemplary ${section.title} Disclosure`,
                        description: `Achieved ${section.completeness}% completeness with high data quality`,
                        impact: 'high',
                        replicable: true,
                        evidence: [`${report.year} Report, Section ${section.code}`]
                    });
                });

            // Find improving metrics
            const trend = this.analyzeMetricTrend(
                report.keyMetrics[0]?.indicator || ''
            );
            if (trend?.trend === 'improving') {
                bestPractices.push({
                    id: uuidv4(),
                    year: report.year,
                    section: 'Metrics',
                    title: 'Consistent Performance Improvement',
                    description: `Demonstrated ${trend.cagr}% annual improvement in key metrics`,
                    impact: 'medium',
                    replicable: true,
                    evidence: [`YoY analysis from ${report.year - 3} to ${report.year}`]
                });
            }
        });

        return bestPractices;
    }

    // ========================================
    // Gap Analysis
    // ========================================

    performGapAnalysis(year: number): {
        frameworkGaps: string[];
        indicatorGaps: string[];
        sectionGaps: string[];
        recommendations: string[];
    } {
        const report = this.getReportByYear(year);
        if (!report) {
            throw new Error(`Report for ${year} not found`);
        }

        const template = this.templates.get(report.framework);
        if (!template) {
            return {
                frameworkGaps: [],
                indicatorGaps: [],
                sectionGaps: [],
                recommendations: []
            };
        }

        const frameworkGaps: string[] = [];
        const indicatorGaps: string[] = [];
        const sectionGaps: string[] = [];

        // Check framework requirements
        template.sections.forEach((section: any) => {
            if (section.required && !report.sections.find(s => s.code === section.code)?.present) {
                sectionGaps.push(section.title);
            }
        });

        // Check indicator coverage
        template.requiredIndicators.forEach((indicator: string) => {
            if (!report.keyMetrics.find(m => m.indicator === indicator)) {
                indicatorGaps.push(indicator);
            }
        });

        // Framework-specific gaps
        if (report.framework.includes('TCFD')) {
            if (!report.sections.find(s => s.code === 'Metrics')?.present) {
                frameworkGaps.push('TCFD: Missing Metrics and Targets section');
            }
        }

        const recommendations = [
            ...indicatorGaps.map(gap => `Collect data for ${gap}`),
            ...sectionGaps.map(gap => `Develop ${gap} disclosure`),
            ...frameworkGaps
        ];

        return {
            frameworkGaps,
            indicatorGaps,
            sectionGaps,
            recommendations
        };
    }

    // ========================================
    // Helper Methods
    // ========================================

    private calculateComplianceTrend(
        base: HistoricalReport,
        comparison: HistoricalReport
    ): 'improving' | 'declining' | 'stable' {
        const baseScore = base.complianceScore;
        const comparisonScore = comparison.complianceScore;
        const diff = comparisonScore - baseScore;

        if (diff >= 5) return 'improving';
        if (diff <= -5) return 'declining';
        return 'stable';
    }

    private detectFrameworkChanges(
        base: HistoricalReport,
        comparison: HistoricalReport
    ): string[] {
        const changes: string[] = [];

        if (base.framework !== comparison.framework) {
            changes.push(`Framework upgraded from ${base.framework} to ${comparison.framework}`);
        }

        const baseCoverage = base.griCoverage;
        const comparisonCoverage = comparison.griCoverage;

        if (comparisonCoverage - baseCoverage >= 10) {
            changes.push(`GRI coverage improved from ${baseCoverage}% to ${comparisonCoverage}%`);
        }

        return changes;
    }

    private calculateOverallProgress(
        current: HistoricalReport,
        previous: HistoricalReport | undefined
    ): number {
        if (!previous) return current.complianceScore;

        const currentScore = current.complianceScore;
        const previousScore = previous.complianceScore;

        return Math.round(((currentScore - previousScore) / previousScore) * 100 * 10) / 10;
    }

    private identifyHighlights(
        metrics: YearOverYearAnalysis['metricsComparison'],
        coverage: YearOverYearAnalysis['coverageComparison']
    ): string[] {
        const highlights: string[] = [];

        // Significant improvements
        metrics
            .filter(m => m.changePercent >= 10)
            .forEach(m => {
                highlights.push(`${m.metric} increased by ${m.changePercent.toFixed(1)}%`);
            });

        // New coverage
        coverage
            .filter(c => c.currentComplete && !c.previousComplete)
            .forEach(c => {
                highlights.push(`New disclosure: ${c.section}`);
            });

        return highlights;
    }

    private identifyConcerns(
        metrics: YearOverYearAnalysis['metricsComparison'],
        coverage: YearOverYearAnalysis['coverageComparison']
    ): string[] {
        const concerns: string[] = [];

        // Significant declines
        metrics
            .filter(m => m.changePercent <= -10)
            .forEach(m => {
                concerns.push(`${m.metric} decreased by ${Math.abs(m.changePercent).toFixed(1)}%`);
            });

        // Lost coverage
        coverage
            .filter(c => !c.currentComplete && c.previousComplete)
            .forEach(c => {
                concerns.push(`Lost coverage: ${c.section}`);
            });

        return concerns;
    }

    private generateRecommendations(
        base: HistoricalReport,
        comparison: HistoricalReport
    ): string[] {
        const recommendations: string[] = [];

        // Coverage recommendations
        if (comparison.griCoverage < 90) {
            recommendations.push('Increase GRI indicator coverage to at least 90%');
        }

        // Data quality recommendations
        const lowQualitySections = comparison.sections.filter(s => s.dataQuality === 'low');
        if (lowQualitySections.length > 0) {
            recommendations.push('Improve data quality in: ' +
                lowQualitySections.map(s => s.title).join(', '));
        }

        // Trend recommendations
        const decliningMetrics = comparison.keyMetrics.filter(m => {
            const analyzer = this.analyzeMetricTrend(m.indicator);
            return analyzer?.trend === 'declining';
        });

        if (decliningMetrics.length > 0) {
            recommendations.push('Address declining trends in: ' +
                decliningMetrics.map(m => m.indicator).join(', '));
        }

        return recommendations;
    }

    // ========================================
    // Export Analysis
    // ========================================

    generateComprehensiveReport(): {
        summary: {
            totalReports: number;
            yearRange: { start: number; end: number };
            averageCompliance: number;
            overallTrend: string;
        };
        comparisons: TemplateComparison[];
        trends: HistoricalMetric[];
        bestPractices: BestPractice[];
        recommendations: string[];
    } {
        const reports = this.getHistoricalReports();

        return {
            summary: {
                totalReports: reports.length,
                yearRange: {
                    start: reports[0]?.year || 0,
                    end: reports[reports.length - 1]?.year || 0
                },
                averageCompliance: reports.reduce((sum, r) => sum + r.complianceScore, 0) / reports.length,
                overallTrend: this.calculateOverallTrend()
            },
            comparisons: this.generateAllComparisons(),
            trends: this.generateAllTrends(),
            bestPractices: this.extractBestPractices(),
            recommendations: this.generateAllRecommendations()
        };
    }

    private calculateOverallTrend(): string {
        if (this.historicalReports.length < 2) return 'Insufficient data';

        const first = this.historicalReports[0];
        const last = this.historicalReports[this.historicalReports.length - 1];

        if (!first || !last) return 'Insufficient data';

        if (last.complianceScore - first.complianceScore >= 10) {
            return 'Significantly Improving';
        } else if (last.complianceScore - first.complianceScore >= 5) {
            return 'Gradually Improving';
        } else if (last.complianceScore - first.complianceScore <= -10) {
            return 'Declining';
        }
        return 'Stable';
    }

    private generateAllComparisons(): TemplateComparison[] {
        const comparisons: TemplateComparison[] = [];

        for (let i = 1; i < this.historicalReports.length; i++) {
            comparisons.push(
                this.compareReports(
                    this.historicalReports[i - 1].year,
                    this.historicalReports[i]!.year
                )
            );
        }

        return comparisons;
    }

    private generateAllTrends(): HistoricalMetric[] {
        const allIndicators = new Set<string>();
        this.historicalReports.forEach(r => {
            r.keyMetrics.forEach(m => allIndicators.add(m.indicator));
        });

        return [...allIndicators]
            .map(indicator => this.analyzeMetricTrend(indicator))
            .filter((t): t is HistoricalMetric => t !== null);
    }

    private generateAllRecommendations(): string[] {
        const recommendations = new Set<string>();
        const latestReport = this.historicalReports[this.historicalReports.length - 1];

        if (latestReport) {
            const analysis = this.performGapAnalysis(latestReport.year);
            analysis.recommendations.forEach(r => recommendations.add(r));
        }

        return [...recommendations];
    }
}

// ============================================
// Factory & Export
// ============================================

export const MultiYearAnalyzerFactory = {
    create(): MultiYearTemplateAnalyzer {
        return new MultiYearTemplateAnalyzer();
    }
};

export default MultiYearTemplateAnalyzer;
