import { ncb } from '@/lib/ncb/client.js';
import { logKernelEvent } from '@/omni/infrastructure/logging/OmniLogger.js';

export interface ActivityRecord {
  date: string;
  amount: number;
  factor_id?: number;
  source: string;
  memo?: string;
}

/**
 * BackendService: Standard interface for core backend operations.
 * Now refactored to use the unified NCB client (5T compliant).
 */
export const BackendService = {
  /**
   * Log an activity record to the activity_data table.
   */
  async logActivity(record: ActivityRecord) {
    logKernelEvent('BACKEND', 'LOG_ACTIVITY', 'INFO', { record });

    try {
      const { data, error } = await ncb
        .from('activity_data')
        .insert([record])
        .select()
        .single();

      if (error) {
        logKernelEvent('BACKEND', 'LOG_ACTIVITY', 'ERROR', { error: error.message });
        throw new Error(`NCB Error: ${error.message}`);
      }

      logKernelEvent('BACKEND', 'LOG_ACTIVITY', 'SUCCESS', { id: data?.id });
      return data;
    } catch (error: any) {
      logKernelEvent('BACKEND', 'LOG_ACTIVITY', 'ERROR', { error: error.message });
      throw error;
    }
  },

  /**
   * Fetch carbon factors from the carbon_factors table.
   */
  async fetchFactors() {
    logKernelEvent('BACKEND', 'FETCH_FACTORS', 'INFO');
    try {
      const { data, error } = await ncb
        .from('metric_definitions')
        .select('*');

      if (error) {
        logKernelEvent('BACKEND', 'FETCH_FACTORS', 'WARNING', { error: error.message });
        return [];
      }

      return data || [];
    } catch (error) {
      logKernelEvent('BACKEND', 'FETCH_FACTORS', 'ERROR', { error: 'Failed to fetch factors' });
      return [];
    }
  },
};
