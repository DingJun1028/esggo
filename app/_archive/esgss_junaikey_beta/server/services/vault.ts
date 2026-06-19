import { supabase } from '../db/supabaseClient.js';
import { PostgrestError } from '@supabase/supabase-js';

class VaultService {
  /**
   * Log Evidence into the Vault
   * @param {string} entityType - e.g., 'AGENT', 'USER', 'SYSTEM'
   * @param {string} entityId - ID of the entity
   * @param {string} evidenceType - e.g., 'ZKP_COMMITMENT', 'BLOCKCHAIN_ANCHOR', 'SWARM_RESULT'
   * @param {object} data - The evidence payload
   * @param {string} proof - Digital signature or hash link
   */
  async logEvidence(entityType: string, entityId: string, evidenceType: string, data: any, proof: string = '') {
    try {
      console.log(`[VAULT] 🔒 Logging Evidence: ${evidenceType} for ${entityId}`);

      const { data: inserted, error } = await supabase
        .from('omni_audit_log')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          event_type: evidenceType,
          payload: data,
          proof: proof
        })
        .select()
        .single();

      if (error) throw error;

      return {
        receiptId: inserted.id,
        timestamp: inserted.timestamp,
        status: 'secured',
      };
    } catch (error) {
      console.error('[VAULT] ❌ Failed to log evidence:', error);
      throw error;
    }
  }

  /**
   * Retrieve Audit Trail
   * @param {string} entityId
   * @returns {Promise<Array>}
   */
  async retrieveAuditTrail(entityId: string) {
    console.log(`[VAULT] 🔍 Retrieving Audit Trail for: ${entityId}`);

    const { data, error } = await supabase
      .from('omni_audit_log')
      .select('*')
      .eq('entity_id', entityId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('[VAULT] Failed to retrieve audit trail:', error);
      return [];
    }

    return data;
  }
}

export default new VaultService();

