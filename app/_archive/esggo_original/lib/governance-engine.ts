/**
 * ESG GO | Governance Engine (Stakeholder Resonance)
 * Manages decentralized voting and calculates alignment between
 * internal strategy and external stakeholder expectations.
 */

import { sha256 } from './crypto-proof';

export interface StakeholderVote {
  id: string;
  stakeholderType: 'INVESTOR' | 'EMPLOYEE' | 'SUPPLIER' | 'COMMUNITY';
  topicId: string;
  priorityScore: number; // 1-5
  timestamp: string;
  hashLock: string;
}

export interface MaterialityTopic {
  id: string;
  label: string;
  category: 'E' | 'S' | 'G';
  internalWeight: number; // 1-5, from management/Digital Twin
}

export interface ResonanceResult {
  topicId: string;
  label: string;
  internalPriority: number;
  stakeholderPriority: number;
  resonance: number; // 0-100, where 100 is perfect alignment
}

export class GovernanceEngine {
  private static instance: GovernanceEngine;

  static getInstance(): GovernanceEngine {
    if (!GovernanceEngine.instance) {
      GovernanceEngine.instance = new GovernanceEngine();
    }
    return GovernanceEngine.instance;
  }

  /**
   * Casts a cryptographically sealed vote.
   */
  async castVote(vote: Omit<StakeholderVote, 'id' | 'timestamp' | 'hashLock'>): Promise<StakeholderVote> {
    const id = `VOTE-${Math.random().toString(36).substring(7).toUpperCase()}`;
    const timestamp = new Date().toISOString();
    const hashLock = await sha256(`${id}:${vote.topicId}:${vote.priorityScore}:${timestamp}`);

    return {
      ...vote,
      id,
      timestamp,
      hashLock
    };
  }

  /**
   * Calculates resonance between internal weights and external votes.
   */
  calculateResonance(topics: MaterialityTopic[], votes: StakeholderVote[]): ResonanceResult[] {
    return topics.map(topic => {
      const topicVotes = votes.filter(v => v.topicId === topic.id);
      const avgStakeholderPriority = topicVotes.length > 0 
        ? topicVotes.reduce((acc, v) => acc + v.priorityScore, 0) / topicVotes.length
        : 3; // Neutral default

      // Resonance = 100 - (abs(diff) / max_diff * 100)
      const diff = Math.abs(topic.internalWeight - avgStakeholderPriority);
      const resonance = Math.round(100 - (diff / 4) * 100);

      return {
        topicId: topic.id,
        label: topic.label,
        internalPriority: topic.internalWeight,
        stakeholderPriority: avgStakeholderPriority,
        resonance
      };
    });
  }

  /**
   * Get overall resonance index.
   */
  getOverallResonanceIndex(results: ResonanceResult[]): number {
    if (results.length === 0) return 0;
    return Math.round(results.reduce((acc, r) => acc + r.resonance, 0) / results.length);
  }
}

export const governanceEngine = GovernanceEngine.getInstance();
