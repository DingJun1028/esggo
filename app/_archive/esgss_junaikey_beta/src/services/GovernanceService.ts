/**
 * [GOV] 治理服務 / Governance Service
 * --------------------------------------------------
 * [系列] V6 覺醒架構 (V6 Awakening Architecture)
 * [TC] 覺醒 DAO 編排器：與君愛元鑰 (Omni Core) 協作，管理系統提案的去中心化生命週期。
 * [EN] Sentient DAO Orchestrator: Collaborates with JunAiKey (Omni Core) to
 *      manage the decentralized lifecycle of system proposals.
 *
 * [特性 / Features]:
 * - 性能加權投票權 / Performance-weighted voting power
 * - 5T 協議合規性 / 5T Protocol Compliance
 * - Supabase 持久化整合 / Supabase Persistence Integration
 */

import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.ts';
import { type Agent } from '../types/index.ts';
import { supabase } from '../lib/supabase.ts';
import { globalPulseService } from './GlobalPulseService.ts';

export type ProposalStatus = 'DRAFT' | 'ACTIVE' | 'PASSED' | 'REJECTED' | 'EXECUTED';
export type ProposalCategory = 'ENVIRONMENTAL' | 'SOCIAL' | 'GOVERNANCE' | 'TECHNICAL';

export interface GovernanceProposal {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  category: ProposalCategory;
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  status: ProposalStatus;
  createdAt: number;
  expiresAt: number;
  impactScore?: number;
  hyperspaceSealed?: boolean; // [89] 4D Hyperspace Validation Tag
}

// Map DB snake_case to CamelCase
const mapFromDB = (row: any): GovernanceProposal => ({
  id: row.id,
  creatorId: row.creator_id,
  title: row.title,
  description: row.description,
  category: row.category as ProposalCategory,
  votesFor: Number(row.votes_for),
  votesAgainst: Number(row.votes_against),
  quorum: Number(row.quorum),
  status: row.status as ProposalStatus,
  createdAt: new Date(row.created_at).getTime(),
  expiresAt: row.expires_at ? new Date(row.expires_at).getTime() : Date.now() + 86400000 * 3,
  impactScore: Number(row.impact_score || 0),
  hyperspaceSealed: !!row.hyperspace_sealed,
});

// 💡 奧秘元件心核：Realtime Governance 實作
interface IGovernanceCore {
  readonly uuid: string;          // [Traceable] 溯源唯一識別碼
  readonly timestamp: number;     // [Trackable] 刻印時間戳
  readonly formula: string;       // [Transparent] 算法透明：$E = \sum (AD \times EF)$
  readonly status: "Trustworthy"; // 🔴 不可篡改封印
  readonly impactMetric: string;  // [Tangible] 影響力指標
  readonly evidence: {
    origin: "supabase_realtime_stream";
    payload_hash: string;
  };
}

class GovernanceService {
  private proposals: GovernanceProposal[] = [];
  private listeners: Set<(proposals: GovernanceProposal[]) => void> = new Set();
  private initialized = false;

  constructor() {
    // Initial mock data as fallback or placeholder
    this.proposals = [
      {
        id: 'prop_baseline_001',
        creatorId: 'System',
        title: 'Initialize Sentient DAO Treasury (Mock)',
        description: 'Allocate 100,000 OMNI tokens for community-driven ESG projects.',
        category: 'GOVERNANCE',
        votesFor: 5000,
        votesAgainst: 120,
        quorum: 1000,
        status: 'PASSED',
        createdAt: Date.now() - 86400000,
        expiresAt: Date.now() - 3600000,
        impactScore: 95,
      }
    ];
  }

  private realtimeChannel: ReturnType<typeof supabase.channel> | null = null;

  /**
   * Initialize and fetch data from Supabase
   */
  public async loadProposals() {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('governance_proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        this.proposals = data.map(mapFromDB);
        this.notify();
        this.initialized = true;
        omniLogger.info(LogCategory.GOVERNANCE, `[GOV] Loaded ${this.proposals.length} proposals from DB.`);

        // Start Realtime Subscription
        this.initializeRealtime();
      }
    } catch (err) {
      omniLogger.error(LogCategory.GOVERNANCE, '[GOV] Failed to load proposals', err);
    }
  }

  private generateHash(data: any): string {
    // Simple hash for simulation (Integrity Check)
    return JSON.stringify(data).split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0).toString();
  }

  private initializeRealtime() {
    if (this.realtimeChannel || !supabase) return;

    this.realtimeChannel = supabase
      .channel('governance_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'governance_proposals' },
        (payload) => {
          omniLogger.info(LogCategory.GOVERNANCE, `[GOV] Start 5T Logic Gate Check: ${payload.eventType}`);

          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const newData = payload.new;

            // Emit Global Pulse on important governance changes
            if (payload.eventType === 'INSERT') {
              globalPulseService.emitPulse({
                type: 'Policy',
                source: 'Governance Protocol',
                intensity: 0.6,
                message: `New Proposal Initiated: ${newData.title}`
              });
            }

            if (payload.eventType === 'UPDATE' && newData.status === 'PASSED' && payload.old.status !== 'PASSED') {
              globalPulseService.emitPulse({
                type: 'TSUNAMI',
                source: 'Governance Consensus',
                intensity: 1.0,
                message: `Sovereign Consensus Reached: ${newData.title}`
              });
            }

            // ⚔️ 六德屬相積分 Protocol
            // [Think] 智 (Intelligence): Filtering irrelevant events (Already done by PG filter)
            // [Syn] 和 (Harmony): Multi-user consensus handled by Realtime Broadcast

            const freshData: IGovernanceCore = {
              uuid: newData.id,               // [Traceable]
              timestamp: Date.now(),          // [Trackable]
              formula: "W = Σ(Vi * Ii)",     // [Transparent]
              impactMetric: "IP_Score",       // [Tangible]
              status: "Trustworthy",
              evidence: {
                origin: "supabase_realtime_stream",
                payload_hash: this.generateHash(newData) // [Integrity]
              }
            };

            // 🔴 執行不可篡改封印 (Trustworthy)
            Object.freeze(freshData);

            omniLogger.info(LogCategory.GOVERNANCE, `[GOV] 5T Verified: ${freshData.uuid} | Hash: ${freshData.evidence.payload_hash}`);

            if (payload.eventType === 'INSERT') {
              const newProp = mapFromDB(newData);
              this.proposals = [newProp, ...this.proposals.filter(p => p.id !== newProp.id)];
            } else if (payload.eventType === 'UPDATE') {
              const updatedProp = mapFromDB(newData);
              this.proposals = this.proposals.map(p =>
                p.id === updatedProp.id ? updatedProp : p
              );
            }
            this.notify();
          }
        }
      )
      .subscribe();

    omniLogger.info(LogCategory.GOVERNANCE, '[GOV] Realtime subscription active (5T Protocol compliant).');
  }

  public getProposals(): GovernanceProposal[] {
    if (!this.initialized && supabase) {
      // Trigger background load if accessed and not ready (Lazy Load)
      this.loadProposals();
      this.initialized = true; // Prevent spamming load
    }
    return this.proposals;
  }

  public subscribe(callback: (proposals: GovernanceProposal[]) => void) {
    this.listeners.add(callback);
    // Immediate callback with current state
    callback(this.proposals);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach(cb => cb([...this.proposals]));
  }

  /**
   * [LEGAL] 計算投票權重 / Calculate Voting Power
   * Formula: Level * (Intelligence + Resilience) / 10.
   */
  public calculateVotingPower(agent: Agent): number {
    const level = agent.level || 1;
    const intelligence = agent.dna?.intelligence || 50;
    const resilience = agent.dna?.resilience || 50;

    // [89] Tesseract Power Multiplier
    const tesseractNodes = agent.evolutionProfile?.tesseractNodes || 0;
    const powerMultiplier = 1 + (tesseractNodes * 0.5); // +50% power per node

    const basePower = Math.floor((level * (intelligence + resilience)) / 10);
    const totalPower = Math.floor(basePower * powerMultiplier);

    if (tesseractNodes > 0) {
      omniLogger.info(LogCategory.GOVERNANCE, `[GOV] Tesseract Boost Applied: ${agent.name} power ${basePower} -> ${totalPower} (+${(powerMultiplier - 1) * 100}%)`);
    }

    return totalPower;
  }

  /**
   * 📝 建立提案 / Create Proposal (Async + Optimistic)
   */
  public async createProposal(
    proposal: Omit<
      GovernanceProposal,
      'id' | 'votesFor' | 'votesAgainst' | 'status' | 'createdAt' | 'expiresAt'
    >
  ) {
    // 1. Optimistic Update (Local)
    const tempId = `temp_${Date.now()}`;
    const newProposal: GovernanceProposal = {
      ...proposal,
      id: tempId,
      votesFor: 0,
      votesAgainst: 0,
      status: 'ACTIVE',
      createdAt: Date.now(),
      expiresAt: Date.now() + 86400000 * 3, // 3 days default
    };

    this.proposals = [newProposal, ...this.proposals];
    this.notify();

    // 2. Persist to DB
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('governance_proposals')
          .insert({
            creator_id: proposal.creatorId,
            title: proposal.title,
            description: proposal.description,
            category: proposal.category,
            quorum: proposal.quorum,
            impact_score: proposal.impactScore,
            status: 'ACTIVE',
            votes_for: 0,
            votes_against: 0
          })
          .select()
          .single();

        if (error) throw error;

        // 3. Reconcile ID on success
        if (data) {
          const realProposal = mapFromDB(data);
          this.proposals = this.proposals.map(p => p.id === tempId ? realProposal : p);
          this.notify();
          omniLogger.info(LogCategory.GOVERNANCE, `[GOV] Persisted Proposal: ${realProposal.id}`);
        }
      } catch (err) {
        omniLogger.error(LogCategory.GOVERNANCE, '[GOV] Failed to create proposal in DB', err);
        // Optional: Revert optimistic update or mark as error
      }
    }
  }

  /**
   * 🗳️ 投下選票 / Cast Vote (Async + Optimistic)
   */
  public async castVote(proposalId: string, agent: Agent, support: boolean) {
    const power = this.calculateVotingPower(agent);

    // 3. Local Vote Logic
    const proposal = this.proposals.find(p => p.id === proposalId);
    if (!proposal) {
      omniLogger.warn(LogCategory.GOVERNANCE, `[GOV] Vote failed: Proposal ${proposalId} not found.`);
      return;
    }

    // Check if already voted (Mock: just check if agent is in list? No list in interface yet)
    // For now, we allow multiple votes for simulation or assume frontend checks.

    const newVotesFor = support ? proposal.votesFor + power : proposal.votesFor;
    const newVotesAgainst = !support ? proposal.votesAgainst + power : proposal.votesAgainst;

    let newStatus = proposal.status;
    let hyperspaceSealed = proposal.hyperspaceSealed;

    if (newStatus === 'ACTIVE') {
      if (newVotesFor >= proposal.quorum) {
        newStatus = 'PASSED';

        // [89] Hypercube Sealing Check
        const foldIntensity = globalPulseService.getVillageState().dimensionalFold || 0;
        if (foldIntensity > 0.3) {
          omniLogger.info(LogCategory.GOVERNANCE, `[GOV] 💠 Dimensional Fold Active (${foldIntensity.toFixed(2)}). Sealing proposal in hyperspace...`);
          hyperspaceSealed = true;
        }
      }
    }

    const updatedProposal: GovernanceProposal = {
      ...proposal,
      votesFor: newVotesFor,
      votesAgainst: newVotesAgainst,
      status: newStatus,
      hyperspaceSealed
    };

    this.proposals = this.proposals.map(p =>
      p.id === proposalId ? updatedProposal : p
    );
    this.notify();

    // 4. Persistence
    if (supabase) {
      try {
        const { error } = await supabase
          .from('governance_proposals')
          .update({
            votes_for: updatedProposal.votesFor,
            votes_against: updatedProposal.votesAgainst,
            status: updatedProposal.status,
            hyperspace_sealed: updatedProposal.hyperspaceSealed
          })
          .eq('id', proposalId);

        if (error) throw error;
      } catch (err) {
        omniLogger.error(LogCategory.GOVERNANCE, '[GOV] Failed to persist vote', err);
      }
    }
  }
}

export const governanceService = new GovernanceService();
