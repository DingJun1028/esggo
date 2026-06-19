/**
 * 🐝 SwarmConsensusService: 蜂群共識服務
 * 
 * 核心功能:
 * 1. 跨組織數據共鳴 (Cross-Org Resonance): 建立多個組織間的數據對齊與驗證機制。
 * 2. 蜂群協議 (Swarm Protocol): 透過分布式代理群體達成數據真實性的共識。
 * 3. 5T 共鳴驗證: Truth, Trust, Traceability, Transparency, Tangible 的集體背書。
 * 
 * "無始無終，以終為始" —— 透過蜂群共識實現數據永恆性。
 */

import { v4 as uuidv4 } from 'uuid';
import SovereignVaultService, { VaultRecord } from './SovereignVaultService';
import { SwarmResonance } from '../types/core';

export interface ConsensusVote {
  organizationId: string;
  voterDid: string;
  vote: 'Approve' | 'Reject';
  timestamp: number;
  signature: string;
  reputation_weight: number; // Phase 28: Reputation weight
}

export interface SwarmConsensus {
  id: string;
  recordId: string;        // 被驗證的 VaultRecord ID
  consensusHash: string;   // 原始記錄的 Hash
  cid: string;             // Phase 28: Content Identifier
  votes: ConsensusVote[];
  status: 'Pending' | 'Reached' | 'Failed';
  resonance_score: number; // 0-100 集體共鳴分數
  achievedAt?: number;
}

class SwarmConsensusService {
  private static instance: SwarmConsensusService;
  private consensusStore: Map<string, SwarmConsensus> = new Map();

  private constructor() { }

  public static getInstance(): SwarmConsensusService {
    if (!SwarmConsensusService.instance) {
      SwarmConsensusService.instance = new SwarmConsensusService();
    }
    return SwarmConsensusService.instance;
  }

  /**
   * 發起蜂群共識請求 (Initiate Swarm Consensus)
   */
  public initiateConsensus(record: VaultRecord): SwarmConsensus {
    const consensus: SwarmConsensus = {
      id: uuidv4(),
      recordId: record.id,
      consensusHash: record.hash,
      cid: record.cid || '',
      votes: [],
      status: 'Pending',
      resonance_score: 0
    };
    this.consensusStore.set(consensus.id, consensus);
    console.log(`[SwarmConsensus] Consensus Initiated for Record: ${record.id} (CID: ${consensus.cid.substring(0, 12)}...)`);
    return consensus;
  }

  /**
   * 投下共鳴票 (Cast Resonance Vote)
   * Phase 28: 透過權重與 CID 驗證執行 Proof of Resonance
   */
  public async castVote(consensusId: string, organizationId: string, vote: 'Approve' | 'Reject', voterReputation?: number): Promise<SwarmConsensus> {
    const consensus = this.consensusStore.get(consensusId);
    if (!consensus) throw new Error('Consensus not found');
    if (consensus.status !== 'Pending') throw new Error('Consensus already finalized');

    const participant = SovereignVaultService.getParticipant();
    if (!participant) throw new Error('No sovereign participant found for voting');

    const weight = voterReputation || participant.level || 1;

    const newVote: ConsensusVote = {
      organizationId,
      voterDid: participant.did,
      vote,
      timestamp: Date.now(),
      signature: `sig:swarm:${participant.did}:${vote}:${consensus.cid.substring(0, 8)}`,
      reputation_weight: weight
    };

    consensus.votes.push(newVote);
    this.recalculateResonance(consensus);

    console.log(`[SwarmConsensus] Vote Cast by ${organizationId}: ${vote} (Weight: ${weight})`);

    return consensus;
  }

  /**
   * 重新計算共鳴分數與狀態 (Recalculate Resonance Score)
   */
  private recalculateResonance(consensus: SwarmConsensus) {
    const approveVotes = consensus.votes.filter(v => v.vote === 'Approve');
    const totalWeight = consensus.votes.reduce((acc, v) => acc + v.reputation_weight, 0);
    const approveWeight = approveVotes.reduce((acc, v) => acc + v.reputation_weight, 0);

    // 分數計算: (贊成權重 / 總權重) * 100, 並考慮足夠的參與者
    const involvementFactor = Math.min(consensus.votes.length / 5, 1); // 至少 5 位參與者達到滿分
    consensus.resonance_score = totalWeight > 0
      ? Math.round((approveWeight / totalWeight) * 100 * involvementFactor)
      : 0;

    // 共識門檻: 分數 > 80 且至少 3 人贊成
    if (consensus.resonance_score >= 80 && approveVotes.length >= 3) {
      consensus.status = 'Reached';
      consensus.achievedAt = Date.now();
      console.log(`[SwarmConsensus] RESONANCE REACHED: ${consensus.resonance_score}% for record ${consensus.recordId}`);
    } else if (consensus.votes.length >= 10 && consensus.resonance_score < 50) {
      consensus.status = 'Failed';
      console.log(`[SwarmConsensus] RESONANCE FAILED for record ${consensus.recordId}`);
    }
  }

  /**
   * 結算共鳴結果 (Resolve Resonance Result)
   */
  public resolveResonance(consensusId: string): SwarmResonance {
    const consensus = this.consensusStore.get(consensusId);
    if (!consensus) throw new Error('Consensus not found');

    return {
      consensusId: consensus.id,
      resonance_score: consensus.resonance_score,
      witness_count: consensus.votes.length,
      is_sovereign: consensus.status === 'Reached'
    };
  }

  /**
   * 獲取共識狀態 (Get Consensus Status)
   */
  public getConsensus(consensusId: string): SwarmConsensus | undefined {
    return this.consensusStore.get(consensusId);
  }
}

export default SwarmConsensusService.getInstance();
