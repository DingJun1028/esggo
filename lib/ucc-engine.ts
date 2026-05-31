/**
 * UCC Engine (Universal Carbon Chronicle)
 * InfoOne v8.1.0 核心引擎 - 實作 OmniInfoCrystal 三位一體結晶架構
 */

import { createHash, randomUUID } from 'crypto';
import { createServerClient } from './supabase/server';
import { 
  OmniInfoCrystal, 
  OmniInfoCore, 
  OmniInfoNode, 
  OmniInfoAura,
  SealInput 
} from '../src/shared/types/ucc.types';
import { computeSHA256 } from '../src/shared/utils/hash.utils';

export class UCCEngine {
  /**
   * 封裝數據並寫入 Evidence Vault
   */
  async sealEvidence(input: SealInput): Promise<OmniInfoCrystal> {
    const uuid = randomUUID();
    const timestamp = Date.now();

    // 1. 生成 Core (數據 DNA)
    const hashLock = this.computeHashLock({
      uuid,
      timestamp,
      formula: input.formula,
      impactMetric: input.impactMetric,
    });
    
    const core: OmniInfoCore = {
      uuid,
      source_origin: input.sourceOrigin,
      hash_lock: hashLock,
      timestamp,
      protocol: 'T1'
    };

    // 2. 生成 Node (功能邏輯)
    const node: OmniInfoNode = {
      logic_hash: await computeSHA256(input.formula),
      calculations: input.impactMetric,
      self_healing_status: 'stable',
      protocol: 'T2'
    };

    // 3. 生成 Aura (表現光環)
    const rs = this.calculateResonance(core, node);
    const aura: OmniInfoAura = {
      visual_state: 'liquid_glass',
      entropy: 1 - rs,
      resonance_color: rs >= 0.9 ? '#10b981' : '#fdb515',
      protocol: 'T3'
    };

    const crystal: OmniInfoCrystal = {
      core,
      node,
      aura,
      rs,
      version: '8.1.0'
    };

    // 4. 寫入聖碑 (Vault Omni)
    const supabase = await createServerClient();
    const { error } = await (supabase
      .from('evidence_vault' as any) as any)
      .insert({
        uuid: crystal.core.uuid,
        timestamp: crystal.core.timestamp,
        formula: input.formula, // 存入原始公式
        impact_metric: crystal.node.calculations,
        hash_lock: crystal.core.hash_lock,
        source_origin: crystal.core.source_origin,
        lifecycle_stage: input.lifecycleStage,
        metadata: {
          ...input.metadata,
          rs: crystal.rs,
          aura: crystal.aura.visual_state
        },
      });

    if (error) throw new Error(`結晶寫入失敗：${error.message}`);

    return crystal;
  }

  /**
   * 核心度量：Rs 共鳴算力計算
   */
  private calculateResonance(core: OmniInfoCore, node: OmniInfoNode): number {
    const corePurity = core.hash_lock.startsWith('00') ? 1.0 : 0.95;
    const nodeResilience = node.self_healing_status === 'stable' ? 1.0 : 0.8;
    const auraEntropy = 1.1;
    const rs = (corePurity * nodeResilience) / auraEntropy;
    return Math.min(Math.max(rs, 0), 1.0);
  }

  /**
   * 計算符合確定性的 Hash Lock
   */
  private computeHashLock(data: {
    uuid: string;
    timestamp: number;
    formula: string;
    impactMetric: Record<string, unknown>;
  }): string {
    const sortedData = JSON.stringify(data, Object.keys(data).sort());
    return createHash('sha256').update(sortedData).digest('hex');
  }

  /**
   * 批次封裝多筆數據
   */
  async batchSeal(inputs: SealInput[]): Promise<OmniInfoCrystal[]> {
    const results: OmniInfoCrystal[] = [];
    for (const input of inputs) {
      results.push(await this.sealEvidence(input));
    }
    return results;
  }

  /**
   * 生命週期管理：更新狀態（透過新建記錄實現不可篡改）
   */
  async transitionLifecycle(
    uuid: string,
    newStage: 'draft' | 'verified' | 'published' | 'archived'
  ): Promise<OmniInfoCrystal> {
    const supabase = await createServerClient();
    const { data: rawData, error } = await supabase
      .from('evidence_vault')
      .select('*')
      .eq('uuid', uuid)
      .single();

    if (error || !rawData) throw new Error('證據不存在');

    return this.sealEvidence({
      formula: (rawData as any).formula,
      impactMetric: (rawData as any).impact_metric,
      sourceOrigin: (rawData as any).source_origin,
      lifecycleStage: newStage,
      metadata: {
        ...(rawData as any).metadata,
        previousVersion: uuid,
        transitionedAt: Date.now(),
      },
    });
  }

  /**
   * 驗證證據完整性 (Verify)
   */
  async verifyEvidence(uuid: string): Promise<boolean> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('evidence_vault')
      .select('*')
      .eq('uuid', uuid)
      .single();

    if (error || !data) return false;

    const computedHash = this.computeHashLock({
      uuid: (data as any).uuid,
      timestamp: (data as any).timestamp,
      formula: (data as any).formula,
      impactMetric: (data as any).impact_metric,
    });

    return computedHash === (data as any).hash_lock;
  }

  /**
   * 溯源 (Trace)：查詢結晶的生命週期與任督二脈能量流
   */
  async traceEvidence(uuid: string) {
    const supabase = await createServerClient();
    const { data: evidence, error } = await supabase
      .from('evidence_vault')
      .select('*')
      .eq('uuid', uuid)
      .single();

    if (error || !evidence) throw new Error('Crystal not found');

    const isValid = await this.verifyEvidence(uuid);

    const { data: auditTrail } = await supabase
      .from('audit_trail')
      .select('*')
      .eq('record_id', uuid)
      .order('created_at', { ascending: false });

    return {
      evidence,
      isValid,
      auditTrail: auditTrail || [],
      stream: {
        ren: 'Internal DNA Storage - Yin',
        du: 'Real-time Execution - Yang'
      }
    };
  }
}

export const uccEngine = new UCCEngine();
