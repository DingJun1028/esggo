import { EventEmitter } from 'events';
import crypto from 'crypto';
import { omniLogger, LogCategory } from './omni/infrastructure/logging/OmniLogger.js';
import { type IComponentCore, OmniComponentCoreFactory } from './OmniComponentCore.js';

/**
 * 🗳️ Consensus Protocol v11.1 (Quantum Secured)
 * -------------------------------------------
 * Agents cast votes on proposals. A proposal is finalized only when 
 * the consensus threshold (quorum) is reached.
 */

export enum ProposalStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    EXECUTED = 'EXECUTED'
}

export interface AgentVote {
    agentId: string;
    approve: boolean;
    signature: string; // Hash of (proposalId + agentId + decision)
    timestamp: number;
}

export interface AgentProposal {
    id: string;
    type: 'SHIELD_RESET' | 'ASSET_ALLOCATION' | 'GOVERNANCE_ADJUSTMENT';
    description: string;
    initiator: string;
    targetValue?: any;
    status: ProposalStatus;
    votes: AgentVote[];
    quorum: number; // Minimum number of approvals required
    expiresAt: number;
    core?: IComponentCore; // 5T v11.1 core object
}

export class ConsensusGovernanceService extends EventEmitter {
    private proposals: Map<string, AgentProposal> = new Map();

    constructor() {
        super();
        omniLogger.info(LogCategory.SYSTEM, '🗳️ Consensus Governance Service Initialized (Quantum-Secured Protocol v11.1)');
    }

    /**
     * 提交治理提案 / Submit Governance Proposal
     */
    public async submitProposal(proposal: Omit<AgentProposal, 'id' | 'status' | 'votes' | 'core'>): Promise<string> {
        const id = `PROP-${crypto.randomUUID()}`;

        // Generate 5T v11.1 Core for the proposal (Quantum Secured via Factory)
        const core = OmniComponentCoreFactory.create({
            sourceOrigin: `ConsensusGovernanceService:${proposal.initiator}`,
            rawDataPath: `governance/proposals/${id}.json`,
            verificationMethod: 'Governance Proposal Quorum',
            version: '11.1.0-alpha'
        });

        const newProposal: AgentProposal = {
            ...proposal,
            id,
            status: ProposalStatus.PENDING,
            votes: [],
            core: {
                ...core,
                uuid: id, // Sync core UUID with proposal ID
                status: 'Proposed'
            }
        };

        this.proposals.set(id, newProposal);
        omniLogger.info(LogCategory.AGENT, `📋 New Proposal Submitted: ${id} [${proposal.type}] by ${proposal.initiator}`);

        this.emit('proposalAdded', newProposal);
        return id;
    }

    /**
     * 投下一票 / Cast a Vote
     */
    public async castVote(proposalId: string, agentId: string, approve: boolean): Promise<boolean> {
        const proposal = this.proposals.get(proposalId);
        if (!proposal) {
            omniLogger.error(LogCategory.SYSTEM, `Vote failed: Proposal ${proposalId} not found.`);
            return false;
        }

        if (proposal.status !== ProposalStatus.PENDING) {
            omniLogger.warn(LogCategory.SYSTEM, `Vote ignored: Proposal ${proposalId} is ${proposal.status}.`);
            return false;
        }

        // Check if agent already voted
        if (proposal.votes.some(v => v.agentId === agentId)) {
            omniLogger.warn(LogCategory.SYSTEM, `Vote ignored: Agent ${agentId} has already voted on ${proposalId}.`);
            return false;
        }

        const signature = crypto.createHash('sha256').update(proposalId + agentId + approve).digest('hex');
        const vote: AgentVote = {
            agentId,
            approve,
            signature,
            timestamp: Date.now()
        };

        proposal.votes.push(vote);
        omniLogger.info(LogCategory.AGENT, `🗳️ Agent ${agentId} voted ${approve ? 'YES' : 'NO'} on ${proposalId}`);

        // Update 5T Core transparency with voter info
        if (proposal.core && proposal.core.evidence.transparent && proposal.core.evidence.transparent.reasoning_path) {
            proposal.core.evidence.transparent.reasoning_path.push(`Agent ${agentId} signature: ${signature.substring(0, 8)}...`);
        }

        this.emit('voteAdded', { proposalId, vote });

        // Check for consensus
        await this.evaluateConsensus(proposalId);
        return true;
    }

    private async evaluateConsensus(proposalId: string) {
        const proposal = this.proposals.get(proposalId);
        if (!proposal) return;

        const approvals = proposal.votes.filter(v => v.approve).length;
        const rejections = proposal.votes.filter(v => !v.approve).length;

        if (approvals >= proposal.quorum) {
            proposal.status = ProposalStatus.APPROVED;
            if (proposal.core) {
                proposal.core.status = 'Approved';
                if (proposal.core.evidence.trustworthy) {
                    (proposal.core.evidence.trustworthy as any).hash_lock = this.calculateFinalConsensusHash(proposal);
                    (proposal.core.evidence.trustworthy as any).is_frozen = true;
                }
            }
            omniLogger.info(LogCategory.AGENT, `✅ Proposal ${proposalId} APPROVED by consensus (${approvals}/${proposal.quorum})`);
            this.emit('proposalApproved', proposal);
        } else if (rejections > (proposal.votes.length - proposal.quorum)) {
            proposal.status = ProposalStatus.REJECTED;
            if (proposal.core) proposal.core.status = 'Violated'; // Map Rejected to Violated in 5T Core
            omniLogger.info(LogCategory.AGENT, `❌ Proposal ${proposalId} REJECTED by consensus`);
            this.emit('proposalRejected', proposal);
        }
    }

    public getProposal(id: string): AgentProposal | undefined {
        return this.proposals.get(id);
    }

    private calculateFinalConsensusHash(p: AgentProposal): string {
        const voterSigs = p.votes.map(v => v.signature).join('|');
        return crypto.createHash('sha256').update(p.id + voterSigs).digest('hex');
    }
}

export const consensusGovernanceService = new ConsensusGovernanceService();
