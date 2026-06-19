import { IGovernanceProposal } from './omni-types.ts';
import { omniLogger, LogCategory } from './omniLogger.ts';
import { v4 as uuidv4 } from 'uuid';

/**
 * 🏛️ GovernanceDAO: The Decentralized Consensus Core
 * Manages ESG policy proposals and sovereign domain voting.
 */
export class GovernanceDAO {
    private static proposals: IGovernanceProposal[] = [];

    /**
     * 📜 ForgeProposal: Create a new ESG policy proposal.
     */
    public static forgeProposal(creator: string, intent: string): IGovernanceProposal {
        omniLogger.info(LogCategory.SYSTEM, `Governance: Forging new proposal by [${creator}]...`);

        const proposal: IGovernanceProposal = {
            id: `PROP-${uuidv4().split('-')[0].toUpperCase()}`,
            creator,
            intent,
            status: "Voting",
            votes: { [creator]: "Yield" }, // Creator automatically yields (approves)
            terminalTimestamp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days voting window
        };

        this.proposals.push(proposal);
        omniLogger.info(LogCategory.SYSTEM, `Governance: Proposal ${proposal.id} is now LIVE for voting.`);
        return proposal;
    }

    /**
     * 🗳️ CastVote: Domain masters submit their stance.
     */
    public static castVote(proposalId: string, user: string, stance: "Yield" | "Resist" | "Abstain"): void {
        const proposal = this.proposals.find(p => p.id === proposalId);
        if (!proposal) throw new Error(`Proposal ${proposalId} not found.`);

        proposal.votes[user] = stance;
        omniLogger.info(LogCategory.SYSTEM, `Governance: Vote cast by [${user}] on ${proposalId} -> ${stance}.`);

        // Check for immediate consensus (e.g., if > 2/3 agree)
        this.resolveConsensus(proposal);
    }

    private static resolveConsensus(proposal: IGovernanceProposal): void {
        const votes = Object.values(proposal.votes);
        const yields = votes.filter(v => v === "Yield").length;

        if (yields > 3) { // Simplified consensus for v10.0.0 Alpha
            proposal.status = "Approved";
            omniLogger.info(LogCategory.SYSTEM, `Governance: Proposal ${proposal.id} has reached CONSENSUS! Status: Approved.`);
        }
    }

    public static listProposals(): IGovernanceProposal[] {
        return this.proposals;
    }
}
