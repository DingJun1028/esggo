export interface NegotiationRound {
    round: number;
    proposals: {
        agent: string;
        proposal: unknown;
    }[];
    consensus?: unknown;
    timestamp: string;
}
export declare class NegotiationEngine {
    negotiate(task: string, agentResults: {
        agent: string;
        result: unknown;
        success: boolean;
    }[], maxRounds?: number): Promise<{
        consensus: unknown;
        rounds: NegotiationRound[];
        finalDecision: string;
    }>;
    private calculateProposalScores;
    private getWinningProposal;
    private refineProposals;
}
export declare const negotiationEngine: NegotiationEngine;
//# sourceMappingURL=engine.d.ts.map