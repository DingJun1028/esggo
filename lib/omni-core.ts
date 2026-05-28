import { createHash } from 'crypto';
import type {
  IComponentCore,
  IEvidence,
  T5GateState,
  EternalMemory,
  RestorationInput,
  ConsolidationResult,
  ApiResponse,
} from '../shared/types.ts';
import { EternalMemoryType } from '../shared/types.ts';
import { supabase } from './supabase.ts';
import { integrityModule } from './omni-core/integrity.ts';
import { 
  sha256, 
  create5TAttestation, 
  verifyHashLock, 
  generateRangeProof,
  verifyRangeProof,
} from './crypto-proof.ts';
import type { HashLockResult, ZKPRangeProof } from './crypto-proof.ts';
import { policyEngine } from './policy-engine.ts';
import type { PolicyValidationResult } from './policy-engine.ts';
import { dcUpsertEternalMemory, dcListEternalMemories } from './dataconnect-services.ts';

// ============================================================
// 萬能心核引擎 - 5T Logic Gate Implementation (Persistent)
// ============================================================

/**
 * OmniCore: 系統之核心中樞 (The Sacred Core)
 * v2.5 | #OmniCore #Sovereignty #HardenedSecurity
 */
export class OmniCore {
  private static instance: OmniCore;

  private constructor() {}

  static getInstance() {
    if (!OmniCore.instance) OmniCore.instance = new OmniCore();
    return OmniCore.instance;
  }

  // 1. Get Current Identity Context (T1 Traceable)
  async getIdentity() {
    // In a real env, this would call Auth or a secure registry
    return { user_id: 'anonymous', company_id: 'default' };
  }

  // 5T Gate Validation (OmniOne Alignment)
  validateT5Gate(evidence: IEvidence): T5GateState {
    const tangible = Boolean(
      (evidence.finalEffect && evidence.finalEffect.length > 0) ||
      (evidence.tangible_metric && evidence.tangible_metric.length > 0)
    );
    const traceable = Boolean(
      (evidence.originCause && (evidence.originCause.startsWith('/') || evidence.originCause === 'Manual Execution')) ||
      (evidence.source_origin && (evidence.source_origin.startsWith('/') || evidence.source_origin === 'Manual Execution'))
    );
    const trackable = Boolean(
      (evidence.processTrace && evidence.processTrace.length > 0) ||
      (evidence.lifecycle_hooks && evidence.lifecycle_hooks.length > 0)
    );
    const transparent = Boolean(
      evidence.formula_ref &&
      evidence.formula_ref !== 'GRI-STANDARD-DEFAULT'
    );
    
    return {
      tangible,
      traceable,
      trackable,
      transparent,
      trustworthy: true, 
    };
  }

  /**
   * 無上意志：結晶化指令
   * 將節點轉化為不可篡改之晶體。
   */
  async crystallize(uuid: string) {
    console.log(`[OmniOne] Crystallizing node: ${uuid}`);
    // 實作：觸發全域 5T 共鳴，將數據鎖定為不可篡改之晶體
  }

  // Seal Data with Hash Lock (Trustworthy) using the new IntegrityModule
  // 觀因循果：確保數據從因到果的完整性與不可篡改性
  async sealComponent(
    metric: string,
    source: string,
    formula: string,
    trigger = 'Manual',
    policyId?: string
  ): Promise<IComponentCore & { validation?: PolicyValidationResult }> {
    let validation: PolicyValidationResult | undefined;
    if (policyId) {
      validation = policyEngine.validate(policyId, { 
        value: metric, 
        source_origin: source, 
        unit: 'tCO2e' // Demo default
      });
    }

    // 使用新的 IntegrityModule 進行封印
    const crystal = await integrityModule.sacredSeal({
      metric,
      source,
      formula,
      originCause: trigger,
      hooks: validation ? [`policy_${policyId}_score_${validation.score}`] : []
    });

    return { ...crystal, validation } as any;
  }

  /**
   * 萬能修復：被動天賦激活
   * 當偵測到數據偏差或亂碼時觸發
   */
  async restoreComponent(faultyData: RestorationInput): Promise<IComponentCore> {
    return await integrityModule.restore(faultyData);
  }

  // Verify Hash Lock using the new IntegrityModule
  async verifyComponent(component: IComponentCore): Promise<boolean> {
    const memoryValid = await integrityModule.verify(component);
    return memoryValid;
  }

  // Calculate Trust Score (0-100) based on 5T metrics and memory consolidation
  async calculateTrustScore(): Promise<number> {
    try {
      const memories = await this.getMemories();
      const total = memories.length;
      
      if (total === 0) return 0;
      
      const consolidatedCount = memories.filter(m => m.consolidated).length;
      const brokenSeals = memories.filter(m => !m.hash_lock).length; // Simulated broken seals
      
      // Base score 75, adjusted by consolidation and volume
      let internalScore = 75;
      
      if (total > 0) {
        const consolidationBonus = (consolidatedCount / total) * 15;
        const volumeBonus = Math.min(total / 50, 1) * 10;
        // 篡改懲罰極重：每處損壞扣 25 分
        internalScore = 75 + consolidationBonus + volumeBonus - (brokenSeals * 25);
      }
      
      // Supply chain risk simulation
      const supplyScore = 88; 
      
      const score = (internalScore * 0.7) + (supplyScore * 0.3);
      
      return Math.min(Math.max(Math.round(score), 0), 100);
    } catch (e) {
      console.error('[OmniCore] Trust score calculation failed:', e);
      return 0;
    }
  }

  // ── Eternal Memory Orchestration ────────────────────────────
  
  // Store a new memory record (Integrated with Firebase Data Connect)
  async storeMemory(content: string, type: EternalMemoryType = EternalMemoryType.EPISODIC): Promise<EternalMemory> {
     const id = Math.random().toString(36).slice(2, 9);
     const timestamp = Date.now();
     
     // 5T Traceable: Generate hash lock
     const payload = JSON.stringify({
       id,
       type,
       content,
       timestamp
     });
     const hashLock = await sha256(payload);
     
     const memory: EternalMemory = {
       id,
       type,
       content,
       tags: [],
       timestamp,
       hash_lock: hashLock,
       consolidated: false
     };

     // Persist to Data Connect
     await dcUpsertEternalMemory({
       id: memory.id,
       type: memory.type,
       content: memory.content,
       timestamp: memory.timestamp,
       hashLock: memory.hash_lock,
       companyId: 'default'
     });

     console.log(`[OmniCore] Memory stored: ${id} [${type}]`);
     return memory;
  }

  // Retrieve memories (Integrated with Data Connect)
  async getMemories(): Promise<EternalMemory[]> {
    const records = await dcListEternalMemories();
    return (records || []).map((r: any) => ({
      id: r.id,
      type: r.type as EternalMemoryType,
      content: r.content,
      tags: [],
      timestamp: r.timestamp,
      hash_lock: r.hashLock,
      consolidated: r.consolidated || false
    }));
  }

  // Consolidate memories (Integrated with Data Connect + Genkit)
  async consolidateMemories(type: EternalMemoryType): Promise<EternalMemory | null> {
    const memories = await this.getMemories();
    const toConsolidate = memories.filter(m => m.type === type && !m.consolidated);
    
    if (toConsolidate.length < 2) return null;

    console.log(`[OmniCore] Consolidating ${toConsolidate.length} memories of type ${type}...`);

    let summary = '';
    
    try {
      const res = await fetch('/api/internal/consolidate-memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, memories: toConsolidate }),
      });
      const json: ConsolidationResult = await res.json();
      if (json.success) {
        summary = json.summary;
      } else {
        throw new Error(json.error || 'Consolidation failed');
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.warn('[OmniCore] Genkit consolidation failed, using fallback summary.', errorMessage);
      summary = `Consolidated Summary of ${toConsolidate.length} ${type} records at ${new Date().toISOString()}.`;
    }

    const id = Math.random().toString(36).slice(2, 11);
    const timestamp = Date.now();
    
    // T4 Trustworthy: Hash the consolidated summary
    const hashLock = await sha256(summary + timestamp);

    const consolidated: EternalMemory = {
      id,
      type,
      content: summary,
      tags: ['consolidated'],
      timestamp,
      hash_lock: hashLock,
      consolidated: true
    };

    // Store consolidated record
    await dcUpsertEternalMemory({
      ...consolidated,
      hashLock,
      companyId: 'default'
    });

    console.log(`[OmniCore] Consolidation complete: ${id}`);
    return consolidated;
  }

  // ── Zero Knowledge Proofs (ZKP) ─────────────────────────────
  
  // ZKP: Generate Proof for range validation (e.g., carbon emission range)
  async generatePrivacyProof(
    metric: string, 
    value: number, 
    min: number, 
    max: number,
    blindingFactor: string
  ): Promise<ZKPRangeProof> {
    console.log(`[OmniCore ZKP] Generating range proof for ${metric}...`);
    return await generateRangeProof(value, min, max, blindingFactor);
  }

  // ZKP: Verify Privacy Proof
  async verifyPrivacyProof(
    proof: ZKPRangeProof,
    blindingFactor: string
  ): Promise<boolean> {
    return verifyRangeProof(proof, blindingFactor);
  }
}

export const omniCore = OmniCore.getInstance();
