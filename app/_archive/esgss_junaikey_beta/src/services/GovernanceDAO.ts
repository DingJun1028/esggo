import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
import { Agent } from '../types/agency.js';

export interface StrategicProposal {
  id: string;
  title: string;
  category: 'ENVIRONMENTAL' | 'SOCIAL' | 'GOVERNANCE';
  description: string;
  votesFor: number;
  votesAgainst: number;
  status: 'ACTIVE' | 'PASSED' | 'REJECTED';
}

/**
 * 🏛️ 治理去中心化組織 / Governance Decentralized Autonomous Organization (DAO)
 * --------------------------------------------------
 * [TC] 管理系統級別的戰略提案，提供基於代理人權重的投票機制。
 * [EN] Manages system-level strategic proposals, providing a voting mechanism
 *      based on weighted agent power.
 */
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

  private constructor() { }

  static getInstance(): GovernanceDAO {
    if (!GovernanceDAO.instance) {
      GovernanceDAO.instance = new GovernanceDAO();
    }
    return GovernanceDAO.instance;
  }

  static getProposals(): StrategicProposal[] {
    return this.getInstance().proposals;
  }

  /**
   * ⚖️ 計算投票權重 / Calculate Voting Weight
   * --------------------------------------------------
   * [TC] 基於代理人靈性、性能及其「德行」計算。
   * [EN] Calculates voting weight based on Agent "Sentience", performance, and "Virtue" scores.
   *      Formula: Level * (Intelligence + Resilience + AvgVirtue) / 30.
   */
  private static calculateVotingWeight(agent: Agent): number {
    if (!agent.dna) return agent.level || 1;

    // Average Virtue Score (normalized to 10 scale)
    const virtueAvg = agent.meritProfile
      ? (Object.values(agent.meritProfile).reduce((acc: number, val) => acc + (val as number), 0) / 6)
      : 5;

    const basePower = (agent.dna.intelligence + agent.dna.resilience + (virtueAvg * 2)) / 30;
    return Math.max(1, Math.floor(agent.level * basePower));
  }

  /**
   * 📝 建立戰略提案 / Create Strategic Proposal
   * --------------------------------------------------
   * [TC] 根據蜂群算力初始化新的自動化指令。
   * [EN] Initializes a new autonomous directive based on swarm power.
   */
  static createProposal(agents: Agent[], category: any): void {
    const id = `prop_${Date.now()}`;
    const weight = agents.reduce((acc, a) => acc + this.calculateVotingWeight(a), 0);

    this.getInstance().proposals.push({
      id,
      title: `Swarm Proposal: ${category}`,
      category,
      description: `Autonomous directive backed by swarm power of ${weight}.`,
      votesFor: 0,
      votesAgainst: 0,
      status: 'ACTIVE',
    });
    omniLogger.info(
      LogCategory.GOVERNANCE,
      `New proposal created: ${id} with base power ${weight}`
    );
  }

  /**
   * 🗳️ 執行投票 / Cast Vote
   * --------------------------------------------------
   * [TC] 記錄代理人對戰略提案的表態。
   * [EN] Records an agent's stance on a strategic proposal.
   */
  static castVote(proposalId: string, agent: Agent, support: boolean): void {
    const proposal = this.getInstance().proposals.find(p => p.id === proposalId);
    if (proposal) {
      const weight = this.calculateVotingWeight(agent);
      if (support) proposal.votesFor += weight;
      else proposal.votesAgainst += weight;

      omniLogger.info(
        LogCategory.GOVERNANCE,
        `Agent ${agent.id} (Weight: ${weight}) voted ${support ? 'FOR' : 'AGAINST'} ${proposalId}`
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
