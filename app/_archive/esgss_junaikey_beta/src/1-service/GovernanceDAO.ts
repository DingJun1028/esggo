import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { Agent } from '@/types/agency';

export interface StrategicProposal {
  id: string;
  title: string;
  category: 'ENVIRONMENTAL' | 'SOCIAL' | 'GOVERNANCE';
  description: string;
  votesFor: number;
  votesAgainst: number;
  status: 'ACTIVE' | 'PASSED' | 'REJECTED';
}

export class GovernanceDAO {
  private static instance: GovernanceDAO;
  private proposals: StrategicProposal[] = [
    {
      id: 'prop_1',
      title: 'Increase Sustainability Fund',
      category: 'ENVIRONMENTAL',
      description: 'allocate 5% more revenue to green projects',
      votesFor: 150,
      votesAgainst: 20,
      status: 'ACTIVE',
    },
  ];

  private constructor() {}

  static getInstance(): GovernanceDAO {
    if (!GovernanceDAO.instance) {
      GovernanceDAO.instance = new GovernanceDAO();
    }
    return GovernanceDAO.instance;
  }

  static getProposals(): StrategicProposal[] {
    return this.getInstance().proposals;
  }

  static createProposal(agents: Agent[], category: any): void {
    const id = `prop_${Date.now()}`;
    this.getInstance().proposals.push({
      id,
      title: `Swarm Proposal: ${category}`,
      category,
      description: 'Proposed by autonomous agent collective.',
      votesFor: 0,
      votesAgainst: 0,
      status: 'ACTIVE',
    });
    omniLogger.info(LogCategory.GOVERNANCE, `New proposal created: ${id}`);
  }

  static castVote(proposalId: string, agent: Agent, support: boolean): void {
    const proposal = this.getInstance().proposals.find(p => p.id === proposalId);
    if (proposal) {
      if (support) proposal.votesFor += agent.level;
      else proposal.votesAgainst += agent.level;
      omniLogger.info(
        LogCategory.GOVERNANCE,
        `Agent ${agent.id} voted ${support ? 'FOR' : 'AGAINST'} ${proposalId}`
      );
    }
  }

  async getProposals(): Promise<StrategicProposal[]> {
    return this.proposals;
  }

  async vote(proposalId: string, support: boolean): Promise<void> {
    GovernanceDAO.castVote(proposalId, { id: 'user' } as any, support);
  }
}

export const governanceDAO = GovernanceDAO.getInstance();
