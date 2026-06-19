import { IComponentCore } from "../../src/types";
import { IOmniHeart } from "../omni-heart";

export type MaterialityCategory = 'E' | 'S' | 'G' | 'D' | 'T';

export interface MaterialityIssue {
    id: string;
    topic: string;
    category: MaterialityCategory;
    description: string;
    gri_mapping: string[];
    sasb_mapping?: string;
    omniHeart?: IOmniHeart;
    // --- Phase 22: Prophetic Materiality ---
    currentImpact?: number; // 1-10 (Importance to Business)
    stakeholderImpact?: number; // 1-10 (Importance to Stakeholders)
    futureImpact?: number;  // 1-10 (AI Predicted Future Significance)
    trend?: 'up' | 'down' | 'stable';
    confidence?: number;    // ZKP Evidence Confidence (0-1)
}

export interface EvidenceItem {
    id: string;
    name: string;
    status: "pending" | "scanning" | "uploaded" | "verified";
    file?: string;
    explanation?: string;
    category: "D" | "E" | "S" | "T" | "G";
    omniHeart?: IOmniHeart;
}

export interface BenchmarkData {
    category: string;
    yourScore: number;
    industryAvg: number;
    topPerformer: number;
    benchmarkEntity: string; // e.g., "Apple", "TSMC", "Industry Best"
}

export type PrivacyLevel = 'L1' | 'L2' | 'L3' | 'Open';

export interface ReportContent {
    chapterId: string;
    content: string;
    evidenceIds: string[];
    privacyLevel?: PrivacyLevel;
    zkProof?: string;
    isMasked?: boolean;
    omniHeart?: IOmniHeart;
    // --- Phase 11: AI Synthesis ---
    versions?: {
        id: string;
        content: string;
        description: string;
        source: 'AI-Focus' | 'AI-Creative' | 'AI-Standard';
    }[];
    selectedVersionId?: string;
}

export interface INcbReport {
    id: string;
    userId?: string;
    title: string;
    date: string;
    standard?: string;
    status: 'draft' | 'completed' | 'Sealed' | 'Verified' | 'In Progress';
    lastUpdated?: number;
    industry?: string;
    selectedIssues?: string[];
    chapters?: Record<string, ReportContent>;
    // --- Phase 11: Persistent Data Structure ---
    report_data?: any; // Stores complete report JSON structure
    metadata?: {
        hash: string;
        timestamp: number;
        protocol?: string;
        zkpVerified?: boolean;
        pillars: {
            traceable: number;
            transparent: number;
            trustworthy: number;
            tangible: number;
            trackable: number;
        };
    };
}

export type IReportComponent = IComponentCore<INcbReport>;

// --- Phase 13: Group Consolidation Types ---

export interface EntityEvidence {
    entityId: string;
    entityName: string;
    value: number;
    zkProof: string;
    timestamp: number;
    privacyLevel: PrivacyLevel;
}

export interface IGroupConsolidation {
    id: string;
    indicatorName: string; // e.g., "Total Carbon Emission"
    entities: EntityEvidence[];
    aggregatedValue: number;
    aggregationProof: string; // ZK-Aggregation Proof
    status: 'pending' | 'aggregated' | 'verified';
    mpcNodes: string[]; // List of nodes participated
}
// --- Phase 20: 5T + ZKP Audit Types ---

export interface ESGMetricComponent {
    name: string;
    weight: string;
    status: string;
}

export interface ESGMetricDetail {
    formula: string;
    calculationLogic?: string;
    auditor: string;
    approver?: string;
    components: ESGMetricComponent[];
    basis: string;
    evidenceLinks?: { label: string; url: string }[];
}

// --- Phase 23: Score Transparency & Deep Evidence ---

export interface IScoreBreakdown {
    metricId: string;
    score: number;
    maxScore: number;
    weightedFormula: string;
    subMetrics: {
        name: string;
        value: number;
        weight: number;
        source: string;
    }[];
    approverPath: {
        role: string;
        name: string;
        timestamp: number;
        zkpLevel: PrivacyLevel;
    }[];
}

export interface FeedItem {
    id: string;
    title: string;
    time: string;
    source: string;
    content?: string;
    confidence: number;
    tag?: string;
    type: 'alert' | 'update' | 'insight';
    zkpLevel?: 1 | 2 | 3;
}

export interface IntelResult {
    id: string;
    title: string;
    category: 'Competitor' | 'Regulation' | 'Market' | 'Innovation';
    impact_level: 'High' | 'Medium' | 'Low';
    summary: string;
    actionable_insight: string;
}

// --- Phase 32: Global Wizard Reinforcement ---

export type ChapterStatus = "pending" | "drafting" | "reviewing" | "completed";

export interface ChapterDraft {
    content: string;
    lastEditedAt: string;
    status: ChapterStatus;
    wordCount: number;
    omniVerified?: boolean;
}

export interface WizardSessionState {
    userId: string;
    isLoading: boolean;
    currentStep: string;
    activeChapter: string;
    totalWordCount: number;
    lastEditedAt: string | null;
    chapterProgress: Record<string, ChapterDraft>;
    selectedIssues: string[];
    evidenceList?: EvidenceItem[];
    sessionHistory: Array<{
        chapterId: string;
        duration: number;
        wordCount: number;
        timestamp: string;
    }>;
}

export interface ImpactItem {
    id: string;
    chapterId: string;
    chapterTitle: string;
    description: string;
    severity: "high" | "medium" | "low";
    suggestedAction: string;
    status: "pending" | "confirmed";
}
