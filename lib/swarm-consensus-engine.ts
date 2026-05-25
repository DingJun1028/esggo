/**
 * ESG GO | Swarm Consensus Engine (Strategic Autonomy)
 * Orchestrates multiple specialized agents to evaluate and vote on ESG strategies.
 */

import { sha256 } from './crypto-proof';

export type AgentRole = 'COMPLIANCE' | 'HARMONY' | 'SECURITY' | 'INNOVATION';

export interface AgentOpinion {
  agentId: string;
  role: AgentRole;
  vote: 'AGREE' | 'DISAGREE' | 'CONDITIONALLY_AGREE';
  confidence: number; // 0-1
  critique: string;
}

export interface ConsensusResult {
  id: string;
  proposal: string;
  timestamp: string;
  opinions: AgentOpinion[];
  consensusScore: number; // 0-100
  status: 'STRONG_CONSENSUS' | 'WEAK_CONSENSUS' | 'DISSONANCE';
  hashLock: string;
}

const SWARM_AGENTS: { id: string; role: AgentRole; name: string }[] = [
  { id: 'agt-z0', role: 'COMPLIANCE', name: 'Z0-Auditor' },
  { id: 'agt-h1', role: 'HARMONY', name: 'H1-Diplomat' },
  { id: 'agt-v4', role: 'SECURITY', name: 'V4-Sentinel' },
  { id: 'agt-x9', role: 'INNOVATION', name: 'X9-Visionary' },
];

export class SwarmConsensusEngine {
  private static instance: SwarmConsensusEngine;

  static getInstance(): SwarmConsensusEngine {
    if (!SwarmConsensusEngine.instance) {
      SwarmConsensusEngine.instance = new SwarmConsensusEngine();
    }
    return SwarmConsensusEngine.instance;
  }

  /**
   * Dispatches a proposal to the swarm and collects opinions.
   */
  async evaluateProposal(proposal: string): Promise<ConsensusResult> {
    const timestamp = new Date().toISOString();
    const id = `CONSENSUS-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Simulate Agent Debate
    const opinions: AgentOpinion[] = SWARM_AGENTS.map(agent => {
      // Deterministic mock logic based on proposal content
      const lower = proposal.toLowerCase();
      let vote: AgentOpinion['vote'] = 'AGREE';
      let confidence = 0.85 + Math.random() * 0.1;
      let critique = '該提案符合當前治理標準與 5T 誠信規範。';

      if (agent.role === 'COMPLIANCE' && lower.includes('快速') && lower.includes('擴張')) {
        vote = 'CONDITIONALLY_AGREE';
        critique = '快速擴張可能導致證據鏈 (T1) 斷裂，建議分階段實施。';
      }
      
      if (agent.role === 'HARMONY' && (lower.includes('裁員') || lower.includes('成本優化'))) {
        vote = 'DISAGREE';
        critique = '此提案將嚴重衝擊「社會共鳴指數」，違反利害關係人利益平衡。';
      }

      if (agent.role === 'SECURITY' && lower.includes('開放數據')) {
        vote = 'CONDITIONALLY_AGREE';
        critique = '開放數據需搭配 ZKP 隱私保護協議，確保敏感數據不外洩。';
      }

      return { agentId: agent.id, role: agent.role, vote, confidence, critique };
    });

    // Calculate Consensus Score
    const agreeCount = opinions.filter(o => o.vote === 'AGREE').length;
    const conditionalCount = opinions.filter(o => o.vote === 'CONDITIONALLY_AGREE').length;
    const consensusScore = Math.round(((agreeCount * 1.0 + conditionalCount * 0.6) / opinions.length) * 100);

    let status: ConsensusResult['status'] = 'DISSONANCE';
    if (consensusScore >= 80) status = 'STRONG_CONSENSUS';
    else if (consensusScore >= 50) status = 'WEAK_CONSENSUS';

    const hashLock = await sha256(`${id}:${proposal}:${consensusScore}:${timestamp}`);

    return { id, proposal, timestamp, opinions, consensusScore, status, hashLock };
  }
}

export const swarmConsensusEngine = SwarmConsensusEngine.getInstance();
