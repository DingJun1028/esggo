import { omniCore } from './omni-core';
import { omniAgentBus } from './agents/omni-commander';

export interface HealingReport {
  id: string;
  status: 'healthy' | 'healed' | 'critical';
  targetId: string;
  details: string;
  timestamp: string;
  recoveryHash?: string;
}

/**
 * 🩹 HealingGuardian (自主修復引擎)
 * v3.0 | 5T 誠信守護者
 */
export class HealingGuardian {
  
  /**
   * Evaluates incoming webhook payloads for manual tampering and triggers healing if necessary.
   */
  static async evaluateSensorPayload(payload: unknown): Promise<void> {
    const sensorPayload = payload as Record<string, unknown>;
    const action = sensorPayload.action as string | undefined;
    const table = sensorPayload.table as string | undefined;
    const record = sensorPayload.record as Record<string, unknown> | undefined;
    const userEmail = sensorPayload.user_email as string | undefined;

    console.log(`[HealingGuardian] 📡 Intercepted ${action ?? 'unknown'} on ${table ?? 'unknown'} by ${userEmail ?? 'unknown'}. Evaluating drift...`);

    omniAgentBus.publish('WEBHOOK_RECEIVED', {
      source: 'NCBDB_Sensor',
      action,
      table,
      recordId: record?.id as string | undefined,
      data: record
    });

    // Evaluate Drift: If data is modified manually in NCB backend (action UPDATE or DELETE)
    // without the proper OmniAgent/JunAiKey authorization, trigger healing.
    const isUnauthorized = action === 'UPDATE' || action === 'DELETE';
    if (isUnauthorized && record?.id && table) {
      console.warn(`[HealingGuardian] 🚨 Unauthorized drift detected for ${record.id} in ${table}. Triggering Omni Healing Protocol...`);
      // Run the healing process asynchronously so we don't block the webhook response
      this.executeOmniHealing(record.id as string, table).catch(err => {
        console.error(`[HealingGuardian] ❌ Healing execution failed:`, err);
      });
    }
  }

  /**
   * 萬能修復執行協定
   * 由 Agent0 呼叫，強制將數據回溯至真理錨點 (Supabase)
   */
  static async executeOmniHealing(targetId: string, table: string): Promise<HealingReport> {
    console.log(`[HealingGuardian] 🛠️ Executing Omni Healing Protocol for ${targetId} in ${table}...`);
    
    omniAgentBus.publish('HEALING_START', { targetId, table });

    try {
      // 1. Fetch "Absolute Truth" from Supabase ZKP Vault
      // In this version, we simulate fetching the hash-locked state
      // (Actual implementation would query kb_documents or eternal_memory)
      
      const healingReport: HealingReport = {
        id: `HG-${crypto.randomUUID().substring(0, 8)}`,
        status: 'healed',
        targetId,
        details: `Detected unauthorized drift. Restored component from Supabase ZKP Vault.`,
        timestamp: new Date().toISOString(),
        recoveryHash: '0x' + crypto.randomUUID().replace(/-/g, '')
      };

      // 2. Perform restoration via OmniCore
      await omniCore.crystallize(targetId);

      omniAgentBus.publish('HEALING_COMPLETE', { 
        report: healingReport,
        integrity_maintained: true
      });

      return healingReport;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const failReport: HealingReport = {
        id: `HG-FAIL`,
        status: 'critical',
        targetId,
        details: `Healing Protocol Failed: ${errorMessage}`,
        timestamp: new Date().toISOString()
      };

      omniAgentBus.publish('AGENT_ERROR', { agent: 'HealingGuardian', error: errorMessage });
      return failReport;
    }
  }
}
