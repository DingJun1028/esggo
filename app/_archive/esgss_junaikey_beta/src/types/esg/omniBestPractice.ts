export interface BestPractice {
    id: string;
    category: 'governance' | 'environmental' | 'social' | 'all';
    title: string;
    description: string;
    source: string;
    industry: string;
    year: number;
    effectiveness: number;
    applicability: 'high' | 'medium' | 'low';
    metrics: string[];
    implementation: {
        difficulty: 'easy' | 'medium' | 'hard';
        timeline: string;
        cost: 'low' | 'medium' | 'high';
    };
}

export interface BenchmarkData {
    category: string;
    metric: string;
    myCompany: number;
    industryAvg: number;
    topQuartile: number;
    bestInClass: number;
    trend: 'up' | 'down' | 'stable';
}

export interface TemplateAnalysis {
    year: number;
    framework: string;
    completeness: number;
    strengths: string[];
    weaknesses: string[];
    bestPractices: string[];
    innovations: string[];
    gaps: string[];
}

export interface GapRecommendation {
    id: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    category: string;
    current: string;
    target: string;
    action: string;
    timeline: string;
    bestPracticeId?: string;
}
