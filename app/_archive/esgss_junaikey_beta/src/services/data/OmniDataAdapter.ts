import { ncb } from '../../lib/ncb/client.js';
import { EsgDataMapper } from './EsgDataMapper.js';
import { IComponentCore } from '../../0-domain/contracts/IComponentCore.js';
import { omniLogger } from '../omniLogger.js';
import { LogCategory } from '../../utils/logger.js';

/**
 * 🚀 OmniDataAdapter: Core Bridge for ESG Data
 * -------------------------------------------
 * Provides high-level data access for the 24 MECE services.
 */
export class OmniDataAdapter {
  /**
   * Fetch ESG readings for a specific metric
   */
  static async getReadingsByMetric(
    metricId: string | number,
    limit: number = 20
  ): Promise<IComponentCore[]> {
    omniLogger.info(LogCategory.DATA, `[OmniDataAdapter] Fetching readings for metric ${metricId}`);

    const { data, error } = await ncb
      .from('esg_readings')
      .select('*')
      .eq('metric_id', metricId)
      .order('period_start', { ascending: false })
      .limit(limit);

    if (error) {
      omniLogger.error(LogCategory.DATA, `[OmniDataAdapter] Failed to fetch readings`, error);
      return [];
    }

    if (!data || !Array.isArray(data)) return [];

    return data.map(row => EsgDataMapper.mapToUCC(row));
  }

  /**
   * Fetch all active metric definitions
   */
  static async getMetricDefinitions() {
    const { data, error } = await ncb.from('metric_definitions').select('*').eq('is_active', true);

    if (error) {
      omniLogger.error(LogCategory.DATA, `[OmniDataAdapter] Failed to fetch metrics`, error);
      return [];
    }

    if (!data || !Array.isArray(data)) return [];

    return data.map(row => EsgDataMapper.mapToMetric(row));
  }

  /**
   * Fetch a specific metric by its code
   */
  static async getMetricByCode(code: string) {
    const { data, error } = await ncb
      .from('metric_definitions')
      .select('*')
      .eq('code', code)
      .single();

    if (error || !data) {
      omniLogger.error(LogCategory.DATA, `[OmniDataAdapter] Metric not found: ${code}`, error);
      return null;
    }

    return EsgDataMapper.mapToMetric(data);
  }

  /**
   * Save a new ESG reading (with 5T validation and cryptographic sealing)
   */
  static async saveReading(reading: Partial<IComponentCore>, userId?: string) {
    omniLogger.info(LogCategory.DATA, `[OmniDataAdapter] Sealing and saving reading ${reading.uuid}`);

    if (!reading.evidence) {
      throw new Error('Cannot save reading without evidence map (5T Violation)');
    }

    const sealedReading = await EsgDataMapper.sealUCC(reading as IComponentCore);

    const formatDate = (dateValue: any) => {
      if (!dateValue) return null;
      const d = new Date(dateValue);
      if (isNaN(d.getTime())) return null;
      // Convert to YYYY-MM-DD HH:MM:SS for SQL compatibility
      return d.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
    };

    const payload: any = {
      uuid: sealedReading.uuid,
      user_id: userId || null,
      metric_id: String(sealedReading.evidence.tangible?.metric || 'ENV_RISK_SCORE'),
      org_unit_id: String((sealedReading.data as any)?.orgUnitId || 'DEFAULT'),
      value: (sealedReading.data as any)?.value || 0,
      calculated_value: (sealedReading.data as any)?.calculatedValue || 0,
      period_type: 'monthly',
      period_start: formatDate(sealedReading.timestamp || Date.now()),
      status: 'draft',
      hash_lock: sealedReading.evidence.trustworthy?.hash_lock,
      data_source: sealedReading.evidence.traceable?.source_origin || 'NCB_SYSTEM',
      evidence_url: sealedReading.evidence.traceable?.verification_links?.[0]
    };

    if (sealedReading.evidence.trustworthy?.locked_at) {
      payload.approved_at = formatDate(sealedReading.evidence.trustworthy.locked_at);
    }

    console.log('[OmniDataAdapter] Sending payload to NCB:', JSON.stringify(payload, null, 2));
    const { error } = await ncb.from('esg_readings').insert(payload);

    if (error) {
      omniLogger.error(LogCategory.DATA, `[OmniDataAdapter] Failed to save reading`, error);
      throw error;
    }

    return sealedReading;
  }
}
