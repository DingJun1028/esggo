/**
 * ESG GO | Swarm Consensus Engine (Strategic Autonomy)
 * Orchestrates multiple specialized agents to evaluate and vote on ESG strategies.
 */
export type AgentRole = 'COMPLIANCE' | 'HARMONY' | 'SECURITY' | 'INNOVATION';
export interface AgentOpinion {
    agentId: string;
    role: AgentRole;
    vote: 'AGREE' | 'DISAGREE' | 'CONDITIONALLY_AGREE';
    confidence: number;
    critique: string;
}
export interface ConsensusResult {
    id: string;
    proposal: string;
    timestamp: string;
    opinions: AgentOpinion[];
    consensusScore: number;
    status: 'STRONG_CONSENSUS' | 'WEAK_CONSENSUS' | 'DISSONANCE';
    hashLock: string;
}
export declare class SwarmConsensusEngine {
    private static instance;
    private genAI;
    constructor();
    static getInstance(): SwarmConsensusEngine;
    /**
     * Dispatches a proposal to the swarm and collects opinions via multi-agent deliberation.
     */
    evaluateProposal(proposal: string): Promise<ConsensusResult>;
}
export declare const swarmConsensusEngine: SwarmConsensusEngine;
//# sourceMappingURL=swarm-consensus-engine.d.ts.map