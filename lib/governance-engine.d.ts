/**
 * ESG GO | Governance Engine (Stakeholder Resonance)
 * Manages decentralized voting and calculates alignment between
 * internal strategy and external stakeholder expectations.
 */
export interface StakeholderVote {
    id: string;
    stakeholderType: 'INVESTOR' | 'EMPLOYEE' | 'SUPPLIER' | 'COMMUNITY';
    topicId: string;
    priorityScore: number;
    timestamp: string;
    hashLock: string;
}
export interface MaterialityTopic {
    id: string;
    label: string;
    category: 'E' | 'S' | 'G';
    internalWeight: number;
}
export interface ResonanceResult {
    topicId: string;
    label: string;
    internalPriority: number;
    stakeholderPriority: number;
    resonance: number;
}
export declare class GovernanceEngine {
    private static instance;
    static getInstance(): GovernanceEngine;
    /**
     * Casts a cryptographically sealed vote.
     */
    castVote(vote: Omit<StakeholderVote, 'id' | 'timestamp' | 'hashLock'>): Promise<StakeholderVote>;
    /**
     * Calculates resonance between internal weights and external votes.
     */
    calculateResonance(topics: MaterialityTopic[], votes: StakeholderVote[]): ResonanceResult[];
    /**
     * Get overall resonance index.
     */
    getOverallResonanceIndex(results: ResonanceResult[]): number;
}
export declare const governanceEngine: GovernanceEngine;
//# sourceMappingURL=governance-engine.d.ts.map