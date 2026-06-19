/**
 * 🌿 ESG Sunshine: Business Intelligence Types
 * --------------------------------------------------
 * 5T Protocol: Traceable, Trackable, Tangible, Transparent, Trustworthy
 */

export enum IntelligenceType {
    NEWS = 'NEWS',
    SUBSIDY = 'SUBSIDY',
    OPPORTUNITY = 'OPPORTUNITY',
    RISK = 'RISK',
    POLICY = 'POLICY',
    BENCHMARK = 'BENCHMARK',
}

export enum RiskSeverity {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}

export interface IIntelligenceFeed {
    id: string;
    type: IntelligenceType;
    title: string;
    content: string;
    source: string;
    confidence: number;
    impactScore: number; // 0-100
    timestamp: number;
    tags: string[];
    metadata?: Record<string, any>;
}

export interface IRiskAlert {
    id: string;
    category: 'Environment' | 'Social' | 'Governance' | 'Financial' | 'Regulatory';
    severity: RiskSeverity;
    title: string;
    description: string;
    probability: number; // 0-1
    impact: number; // 0-1
    detectedAt: number;
    mitigationStrategy?: string;
    evidenceLinks: string[];
}

export interface IOpportunityMatch {
    id: string;
    title: string;
    type: 'Subsidy' | 'Partnership' | 'Investment' | 'MarketExpansion';
    description: string;
    value?: string;
    deadline?: number;
    relevanceScore: number; // 0-100
    requirements: string[];
    sourceUrl?: string;
}

export interface ICompetitorComparison {
    competitorId: string;
    competitorName: string;
    metrics: {
        carbonIntensity: number;
        socialImpact: number;
        governanceGrade: string;
        marketResonance: number;
    };
    gapAnalysis: string;
    recentStratergy: string;
}

export interface IIntelligenceState {
    feeds: IIntelligenceFeed[];
    activeAlerts: IRiskAlert[];
    matches: IOpportunityMatch[];
    isMonitoring: boolean;
    radarRadius: number; // For visualization
}
