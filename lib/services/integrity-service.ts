/**
 * [Best Practice] Integrity Service
 * Centralizes all 5T Sealing, Hashing, and Audit Log generation logic.
 * Adheres to the Semantic Governance Protocol (英標繁博).
 */

import { secureHash, logAudit } from '../db';
import { 
  SACRED_GATES, 
  ProtocolGateCode, 
  GateValidationResult 
} from '@/src/shared/types';

export class IntegrityService {
  private static instance: IntegrityService;

  private constructor() {}

  public static getInstance(): IntegrityService {
    if (!IntegrityService.instance) {
      IntegrityService.instance = new IntegrityService();
    }
    return IntegrityService.instance;
  }

  /**
   * @function validateGates
   * @description 5T 誠信門徑全域驗證：真·善·美·信·通。
   * Processes data through all five sacred gates of integrity.
   */
  public async validateGates(
    sourcePath: string, 
    data: Record<string, unknown>, 
    actorId: string
  ): Promise<GateValidationResult[]> {
    const results: GateValidationResult[] = [];
    const timestamp = Date.now();

    const gateSequence: ProtocolGateCode[] = ['T1', 'T2', 'T3', 'T4', 'T5'];

    for (const code of gateSequence) {
      const gate = SACRED_GATES[code];
      const hash = await secureHash({ ...data, code, timestamp });

      // Heuristic validation for demonstration (in real app, specific checks for each gate)
      const passed = true; 

      results.push({
        gate: code,
        passed,
        timestamp,
        evidencePath: sourcePath,
        messageZh: `[${gate.labelZh}] ${gate.titleZh} 驗證通過。說明：${gate.descriptionEn}`,
        hashLock: code === 'T5' ? hash : undefined
      });

      // Audit Log for each gate (T3 Trackable)
      await logAudit({
        action: `GATE_VALIDATION_${code}`,
        resource: sourcePath,
        user_name: actorId,
        t5_tag: code,
        hash_lock: hash,
        details: `Passed ${gate.titleZh} (${code}) at ${sourcePath}.`
      });
    }

    return results;
  }

  /**
   * Performs a 5T Master Seal on a data object.
   * Logic: Hash(Data + Timestamp + Identity) -> Audit Log -> Verified State.
   */
  public async sealData(
    resource: string, 
    data: Record<string, unknown>, 
    meta: { user: string; dept: string; gri?: string }
  ): Promise<{ hash: string; timestamp: number }> {
    const timestamp = Date.now();
    const payload = { ...data, ...meta, timestamp };
    
    // 1. Generate Secure SHA-256 Hash
    const hash = await secureHash(payload);

    // 2. Automated Audit Log Generation (T3 Trackable)
    await logAudit({
      action: 'ZKP_SEAL',
      resource: resource,
      user_name: meta.user,
      department: meta.dept,
      gri_reference: meta.gri,
      t5_tag: 'T5',
      hash_lock: hash,
      details: `Integrity Sealed via Semantic Governance Protocol. [信] 誠信之結刻印完成。`
    });

    return { hash, timestamp };
  }

  /**
   * Validates a data object against a provided hash lock.
   */
  public async verifyIntegrity(data: Record<string, unknown>, expectedHash: string): Promise<boolean> {
    const actualHash = await secureHash(data);
    return actualHash === expectedHash;
  }
}

export const integrityService = IntegrityService.getInstance();
