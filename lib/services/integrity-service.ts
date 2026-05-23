/**
 * [Best Practice] Integrity Service
 * Centralizes all 5T Sealing, Hashing, and Audit Log generation logic.
 * This ensures that business logic is decoupled from UI and API routes.
 */

import { secureHash, logAudit, AuditRecord } from '../db';

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
   * Performs a 5T Master Seal on a data object.
   * Logic: Hash(Data + Timestamp + Identity) -> Audit Log -> Verified State.
   */
  public async sealData(
    resource: string, 
    data: any, 
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
      t5_tag: 'T4+T5',
      hash_lock: hash,
      details: `Integrity Sealed at node: ${typeof window !== 'undefined' ? 'browser' : 'server-edge'}`
    });

    return { hash, timestamp };
  }

  /**
   * Validates a data object against a provided hash lock.
   */
  public async verifyIntegrity(data: any, expectedHash: string): Promise<boolean> {
    const actualHash = await secureHash(data);
    return actualHash === expectedHash;
  }
}

export const integrityService = IntegrityService.getInstance();
