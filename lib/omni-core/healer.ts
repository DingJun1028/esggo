/**
 * 🩹 HealingGuardian (自主修復與數據鏈路守護者)
 * v1.0 | #AutonomousGovernance #5TIntegrity #SelfHealing
 * 
 * 負責自動偵測數據誠信缺角，並主動從實證金庫 (Evidence Vault) 
 * 尋找合適實證進行鏈路修復與「信」的重塑。
 */

import { supabaseAdmin } from '../supabaseAdmin.ts';
import { integrityModule } from './integrity.ts';
import { omniAgentBus } from '../agents/omni-agent-bus.ts';
import { createClient } from '@supabase/supabase-js';

export interface HealingLogEntry {
  id: string;
  target_gri: string;
  action_taken: string;
  status: string;
  details: Record<string, unknown>;
  created_at: string;
}

export interface HealingResult {
  healedCount: number;
  logs: HealingLogEntry[];
  timestamp: string;
}

export class HealingGuardian {
  /**
   * 啟動全域自主修復循環
   * 呼叫資料庫層級之 RPC 進行大規模鏈路修復
   */
  public async triggerGlobalHealing(companyId: string = 'default'): Promise<HealingResult> {
    console.log(`[HealingGuardian] 🩺 啟動全域自主修復循環 (Company: ${companyId})`);
    
    try {
      if (!supabaseAdmin!) {
        throw new Error('Supabase client offline');
      }

      // 呼叫預先定義之 SQL RPC
      const { data, error } = await supabaseAdmin!.rpc('execute_autonomous_healing', {
        p_company_id: companyId 
      });

      if (error) throw error;

      const healedCount = (data as { healed_count: number })?.healed_count || 0;
      console.log(`[HealingGuardian] ✨ 修復完成。成功修復 ${healedCount} 個誠信缺角。`);

      // 獲取最新的修復日誌
      const { data: logs } = await supabaseAdmin!
        .from('healing_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(healedCount);

      return {
        healedCount,
        logs: (logs || []) as HealingLogEntry[],
        timestamp: new Date().toISOString()
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`[HealingGuardian] ❌ 自主修復失敗:`, errorMessage);
      throw err;
    }
  }

  /**
   * 精準修復 (Targeted Healing)
   * 針對特定的 GRI 指標與實證進行鏈路建立
   */
  public async targetHealing(griTag: string, evidenceId: string, companyId: string = 'default'): Promise<boolean> {
    console.log(`[HealingGuardian] 🎯 執行精準修復: ${griTag} <-> ${evidenceId}`);
    
    if (!supabaseAdmin) {
      console.error(`[HealingGuardian] Supabase client offline`);
      return false;
    }

    // 1. 校驗實證是否存在且已驗證
    const { data: evidence, error: evError } = await supabaseAdmin!
      .from('evidence_vault')
      .select('*')
      .eq('id', evidenceId)
      .single();

    if (evError || !evidence) {
      console.error(`[HealingGuardian] 找不到指定的實證文件: ${evidenceId}`);
      return false;
    }

    // 2. 執行聖典共鳴與淨化 (利用 integrityModule)
    const crystal = await integrityModule.sacredSeal({
      metric: `Targeted_Heal_${griTag}`,
      source: evidence.file_name,
      formula: 'Autonomous Linkage',
      hooks: ['target_healing', `ev_${evidenceId}`]
    });

    // 3. 寫入環境數據庫
    const { error: insertError } = await supabaseAdmin!
      .from('environmental_data')
      .insert([{
        company_id: companyId,
        category: 'HEALED',
        metric_name: `精準修復：${griTag}`,
        metric_value: 0, // 標記為鏈路資料
        unit: 'LINK',
        year: 2024,
        gri_standard: griTag,
        hash_lock: crystal.hash_lock
      }]);

    if (insertError) {
      console.error(`[HealingGuardian] 寫入修復數據失敗:`, insertError.message);
      return false;
    }

    // 4. 記錄修復日誌
    await supabaseAdmin!.from('healing_log').insert([{
      target_gri: griTag,
      action_taken: 'TARGETED_HEALING',
      status: 'success',
      details: { evidence_id: evidenceId, hash_lock: crystal.hash_lock }
    }]);

    console.log(`[HealingGuardian] ✅ 精準修復完成: ${griTag}`);
    return true;
  }
}

export const healingGuardian = new HealingGuardian();
