export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  targetActionId: string;
  status: 'ACTIVE' | 'PASSED' | 'FAILED' | 'EXECUTED';
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  expiresAt: number;
  consensusHistory: { agentId: string; influence: number; vote: 'FOR' | 'AGAINST' }[];
}

export class GovernanceCore {
  /**
   * 計算代理人的影響力 (Influence)
   * 基於 Level, Type Resonance, 與 Bio-Digital 資歷
   */
  public static calculateInfluence(agent: any, resonance: number): number {
    const baseInfluence = agent.level || 1;
    const resonanceBonus = resonance * 5;
    const driftBonus = ((agent.driftE || 0) + (agent.driftS || 0) + (agent.driftG || 0)) / 10;

    return Math.floor(baseInfluence + resonanceBonus + driftBonus);
  }

  /**
   * 檢查提案是否達成共識
   */
  public static checkConsensus(proposal: GovernanceProposal): 'PASSED' | 'FAILED' | 'ACTIVE' {
    const totalVotes = proposal.votesFor + proposal.votesAgainst;
    if (Date.now() > proposal.expiresAt) {
      return proposal.votesFor > proposal.votesAgainst && totalVotes >= proposal.quorum
        ? 'PASSED'
        : 'FAILED';
    }
    if (proposal.votesFor >= proposal.quorum) return 'PASSED';
    return 'ACTIVE';
  }
}
