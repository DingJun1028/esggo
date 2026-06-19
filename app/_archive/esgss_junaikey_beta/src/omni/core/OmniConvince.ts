import { OmniCore } from './OmniCore.ts';
import { OmniRequest, IVerifiedResponse } from './types/OmniCore.types.ts';

/**
 * ?? OmniConvince: The Sovereign Conviction/Consensus
 * 
 * Concept: "?¬èƒ½èªªæ?" (Universal Conviction) / "ä¸»æ??±è?" (Sovereign Consensus)
 * 5T Alignment: Trustworthy (Consensus), Transparent (Rationale)
 * Role: Manages consensus reached within the system or by stakeholders.
 *       It "convinces" the system that a state or decision is valid.
 */
export class OmniConvince {
    private static instance: OmniConvince;
    private core: OmniCore;

    private constructor() {
        this.core = OmniCore.getInstance();
    }

    public static getInstance(): OmniConvince {
        if (!OmniConvince.instance) {
            OmniConvince.instance = new OmniConvince();
        }
        return OmniConvince.instance;
    }

    /**
     * ?–ï? Propose Decision
     * @param proposal The decision/state being proposed
     * @param rationale The reasoning behind it
     */
    public async propose(proposal: string, rationale: string): Promise<IVerifiedResponse> {
        const proposalId = `PROP-${Date.now()}`;
        const record = { proposalId, proposal, rationale, status: 'pending', votes: 0 };

        const validRequest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'COMMAND',
            content: `OmniConvince Proposal: ${proposal}`,
            timestamp: Date.now(),
            source: 'OmniConvince',
            tags: ['consensus', 'decision', 'governance'],
            payload: { proposalId, proposal }
        };

        return {
            core: validRequest,
            message: 'Decision Proposal Submitted to Resonance Chamber',
            verified: true,
            data: record,
            source_origin: 'OmniConvince',
            five_t_ref: proposalId
        };
    }

    /**
     * ??Finalize Consensus
     * @param proposalId The ID to finalize
     * @param consensusScore The final "conviction" score (0-100)
     */
    public async finalize(proposalId: string, consensusScore: number): Promise<IVerifiedResponse> {
        const validRequest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'COMMAND',
            content: `OmniConvince Finalize: ${proposalId}`,
            timestamp: Date.now(),
            source: 'OmniConvince',
            tags: ['consensus', 'finalization'],
            payload: { proposalId, score: consensusScore }
        };

        return {
            core: validRequest,
            message: consensusScore > 75 ? 'Consensus Reached: High Conviction' : 'Consensus Failed: Low Conviction',
            verified: consensusScore > 75,
            data: { proposalId, consensusScore, status: consensusScore > 75 ? 'reached' : 'rejected' },
            source_origin: 'OmniConvince',
            five_t_ref: proposalId
        };
    }
}
