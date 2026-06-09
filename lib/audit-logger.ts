import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { generateHashLock } from '@/lib/hash-lock';

export interface AuditLogData {
  userId?: string;
  action: string;
  targetId: string;
  payload?: any;
}

/**
 * 寫入不可篡改的審計日誌 (5T Protocol: Trustworthy, Traceable)
 */
export async function writeAuditLog(data: AuditLogData) {
  if (!supabaseAdmin) {
    console.warn('[AuditLogger] Supabase Admin not configured. Skipping DB write.');
    return;
  }

  const timestamp = new Date().toISOString();
  
  // Prepare evidence for 5T Protocol
  const evidence = {
    userId: data.userId || 'system',
    action: data.action,
    targetId: data.targetId,
    timestamp,
    payload: data.payload || {},
  };

  // Generate Hash Lock (Trustworthy)
  const seal = generateHashLock(evidence);

  try {
    const { error } = await supabaseAdmin
      .from('esg_atoms')
      .insert([
        {
          // if targetId is a valid UUID, we could use it, else let DB default generate it or pass explicitly
          // assuming targetId is generated via crypto.randomUUID() in the route
          uuid: data.targetId, 
          hash_lock: seal.hash,
          status: 'Trustworthy',
          evidence: evidence,
        }
      ]);

    if (error) {
      console.error('[AuditLogger] Failed to write to esg_atoms:', error);
      throw error;
    }

    console.log(`[AuditLogger] Successfully sealed atom: ${data.targetId}`);
  } catch (err) {
    console.error('[AuditLogger] Exception during seal:', err);
  }
}
