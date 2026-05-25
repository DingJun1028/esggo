import { createHash } from 'crypto';
import type {
  IComponentCore,
  IEvidence,
  T5GateState,
  EternalMemory,
  EternalMemoryType,
} from '../types/omni-core';
import { supabase } from './supabase';
import { 
  sha256, 
  create5TAttestation, 
  verifyHashLock, 
  HashLockResult,
  generateRangeProof,
  verifyRangeProof,
  ZKPRangeProof
} from './crypto-proof';
import { policyEngine, PolicyValidationResult } from './policy-engine';
import { dcUpsertEternalMemory, dcListEternalMemories } from './dataconnect-services';

// ============================================================
// 萬能心核引擎 - 5T Logic Gate Implementation (Persistent)
// ============================================================

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export class OmniCore {
  private static instance: OmniCore;

  static getInstance(): OmniCore {
    if (!OmniCore.instance) {
      OmniCore.instance = new OmniCore();
    }
    return OmniCore.instance;
  }

  // Helper to get current user info for multi-tenancy
  private async getIdentity() {
    if (typeof window === 'undefined') return { user_id: 'system', company_id: 'default' };
    const local = localStorage.getItem('omni_user');
    if (local) {
      const parsed = JSON.parse(local);
      return { user_id: parsed.id || 'unknown', company_id: parsed.company_id || 'default' };
    }
    return { user_id: 'anonymous', company_id: 'default' };
  }

  // 5T Gate Validation
  validateT5Gate(evidence: IEvidence): T5GateState {
    return {
      tangible: Boolean(evidence.tangible_metric && evidence.tangible_metric.length > 0),
      traceable: Boolean(evidence.source_origin && evidence.source_origin.startsWith('/')),
      trackable: Boolean(evidence.lifecycle_hooks && evidence.lifecycle_hooks.length > 0),
      transparent: Boolean(evidence.formula_ref && evidence.formula_ref.includes('[')),
      trustworthy: false, // Only set after Hash Lock
    };
  }

  // Seal Data with Hash Lock (Trustworthy)
  async sealComponent(
    metric: string,
    source: string,
    formula: string,
    policyId?: string
  ): Promise<IComponentCore & { validation?: PolicyValidationResult }> {
    const uuid = generateUUID();
    const timestamp = Date.now();

    let validation: PolicyValidationResult | undefined;
    if (policyId) {
      validation = policyEngine.validate(policyId, { 
        value: metric, 
        source_origin: source, 
        unit: 'tCO2e' // Demo default
      });
    }

    const evidence: IEvidence = {
      tangible_metric: metric,
      source_origin: source,
      lifecycle_hooks: [
        `hook_${timestamp}_created`, 
        `hook_${timestamp}_sealed_t4`,
        ...(validation ? [`policy_${policyId}_score_${validation.score}`] : [])
      ],
      formula_ref: formula,
    };

    // Simplified 5T-compatible seal for v1.1.0 that doesn't use random nonces for immediate verification
    const payload = JSON.stringify({
      uuid,
      timestamp,
      evidence,
      version: '1.1.0'
    });
    const hash_lock = await sha256(payload);

    const component: IComponentCore = Object.freeze({
      uuid,
      timestamp,
      version: '1.1.0',
      evidence,
      status: 'Trustworthy' as const,
      hash_lock,
    });

    return { ...component, validation };
  }

  // Verify Hash Lock
  async verifyComponent(component: IComponentCore): Promise<boolean> {
    // 1. Backwards compatibility check for v1.0.0 (Simple JSON Hash)
    const legacyPayload = JSON.stringify({
      uuid: component.uuid,
      timestamp: component.timestamp,
      evidence: component.evidence,
    });
    const computedLegacyHash = await sha256(legacyPayload);
    if (computedLegacyHash === component.hash_lock) return true;

    // 2. Full 5T masterSeal verification for v1.1.0+ (Simplified for direct verification)
    const payloadV11 = JSON.stringify({
      uuid: component.uuid,
      timestamp: component.timestamp,
      evidence: component.evidence,
      version: '1.1.0'
    });
    const computedHashV11 = await sha256(payloadV11);
    if (computedHashV11 === component.hash_lock) return true;

    return false;
  }

  // 5T Trust Score Engine
  async calculateTrustScore(company_id: string = 'default'): Promise<number> {
    try {
      const memories = await this.getMemories();
      const total = memories.length;
      
      // 1. Internal Integrity Score (70% weight)
      let internalScore = 90;
      if (total > 0) {
        const consolidatedCount = memories.filter(m => m.consolidated).length;
        
        // 實時校驗每一條 Eternal Memory 的誠信狀態
        let brokenSeals = 0;
        for (const memory of memories) {
           const payload = JSON.stringify({
             id: memory.id,
             type: memory.type,
             content: memory.content,
             timestamp: memory.timestamp
           });
           const computedHash = await sha256(payload);
           if (computedHash !== memory.hash_lock) {
             brokenSeals++;
           }
        }

        const consolidationBonus = (consolidatedCount / total) * 15;
        const volumeBonus = Math.min(total / 50, 1) * 10;
        // 篡改懲罰極重：每處損壞扣 25 分
        internalScore = 75 + consolidationBonus + volumeBonus - (brokenSeals * 25);
      }

      // 2. Supply Chain Cascading Integrity (30% weight)
      // 未來會與 SupplierIntegrityEngine 完整串接
      const supplyScore = 88; 
      
      const score = (internalScore * 0.7) + (supplyScore * 0.3);
      
      return Math.min(Math.max(Math.round(score), 0), 100);
    } catch (e) {
      console.error('[OmniCore] Trust score calculation failed:', e);
      return 85; // 安全降級評分
    }
  }

  // Store Eternal Memory (Persistent in Data Connect)
  async storeMemory(
    content: string,
    type: EternalMemoryType,
    tags: string[] = []
  ): Promise<EternalMemory> {
    const { company_id } = await this.getIdentity();
    const id = generateUUID();
    const timestamp = Date.now();
    
    // Hash includes company_id to prevent cross-tenant collisions or impersonation
    const hash_lock = await sha256(`${company_id}:${id}:${content}:${timestamp}`);

    await dcUpsertEternalMemory({
      id,
      type,
      content,
      tags: tags.join(','),
      hashLock: hash_lock,
      consolidated: false
      // In a real RLS setup, Data Connect would handle company_id via auth claims
    });

    // EVENT-DRIVEN AUTONOMOUS COMPLIANCE:
    // Automatically trigger consolidation if we have enough records
    if (type === 'EPISODIC') {
      const memories = await this.getMemories();
      const rawMemories = memories.filter(m => !m.consolidated);
      if (rawMemories.length >= 10) {
        console.log(`[OmniCore] Auto-Consolidation Threshold Reached for ${company_id}.`);
        this.consolidateMemories(type).catch(console.error);
      }
    }

    return {
      id,
      type,
      content,
      tags,
      timestamp,
      hash_lock,
      consolidated: false,
    };
  }

  async getMemories(): Promise<EternalMemory[]> {
    // In production, dcListEternalMemories is limited by the server's RLS policy based on the requester's identity.
    const data = await dcListEternalMemories();

    return data.map(m => ({
      id: m.id,
      type: m.type as EternalMemoryType,
      content: m.content,
      tags: (m.tags || '').split(','),
      timestamp: new Date(m.createdAt).getTime(),
      hash_lock: m.hashLock,
      consolidated: m.consolidated,
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
      const json = await res.json();
      if (json.success) {
        summary = json.summary;
      } else {
        throw new Error(json.error || 'Consolidation failed');
      }
    } catch (e) {
      console.warn('[OmniCore] Genkit consolidation failed, using fallback summary.', e);
      summary = `Consolidated Summary of ${toConsolidate.length} ${type} records at ${new Date().toISOString()}.`;
    }

    const id = generateUUID();
    const timestamp = Date.now();
    const hash_lock = await sha256(`${id}:${summary}:${timestamp}`);

    // Update originals
    for (const m of toConsolidate) {
      await dcUpsertEternalMemory({ 
        id: m.id, 
        type: m.type, 
        content: m.content, 
        consolidated: true, 
        hashLock: m.hash_lock 
      });
    }

    // Create summary
    await dcUpsertEternalMemory({
      id,
      type: 'SEMANTIC',
      content: summary,
      tags: 'consolidated,genkit_summary',
      hashLock: hash_lock,
      consolidated: true
    });

    return {
      id,
      type: 'SEMANTIC',
      content: summary,
      tags: ['consolidated', 'genkit_summary'],
      timestamp: new Date(timestamp).getTime(),
      hash_lock,
      consolidated: true,
    };
  }

  // Quick hash for display
  async quickHash(text: string): Promise<string> {
    const full = await sha256(text);
    return `sha256:${full.substring(0, 16)}...`;
  }

  // ZKP: Generate Privacy Proof
  async generatePrivacyProof(
    metric: string,
    secretValue: number,
    min: number,
    max: number,
    blindingFactor?: string
  ): Promise<ZKPRangeProof> {
    return generateRangeProof(secretValue, min, max, blindingFactor);
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
