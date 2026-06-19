import { IComponentCore, IEvidenceMap } from '../../0-domain/contracts/IComponentCore.js';
import { omniLogger } from '../omniLogger.js';
import { LogCategory } from '../../utils/logger.js';
import { TrustworthyLock } from '../../utils/TrustworthyLock.js';

/**
 * 📊 EsgDataMapper: Translates raw NCB/Supabase rows into UCC (IComponentCore)
 * --------------------------------------------------------------------------
 * Follows the 5T Protocol: Tangible, Traceable, Trackable, Transparent, Trustworthy
 */
export class EsgDataMapper {
  /**
   * Map a raw reading row (from esg_readings table) to IComponentCore (UCC)
   */
  static mapToUCC(row: any): IComponentCore {
    // 1. Initial Evidence Map
    const evidence: IEvidenceMap = {
      tangible: {
        metric: row.metric_code || String(row.metric_id),
        description: row.description || `Reading for ${row.metric_code || row.metric_id}`,
        impact_metric: row.unit || 'Score',
        is_crystallized: row.status === 'approved',
        trinity_status: row.status === 'approved' ? 'Active' : 'Dormant',
        timestamp: new Date(row.period_start).getTime(),
      },
      traceable: {
        source_origin: row.data_source || 'NCB_DATABASE',
        verification_links: row.evidence_url ? [row.evidence_url] : [],
      },
      trackable: {
        lifecycle_hooks: [
          { event: 'Collection', timestamp: new Date(row.created_at).getTime(), actor: 'System' },
          ...(row.updated_at
            ? [
              {
                event: 'Sync',
                timestamp: new Date(row.updated_at).getTime(),
                actor: 'OmniDataAdapter',
              },
            ]
            : []),
        ],
      },
      transparent: {
        formula: row.calculation_logic || '[Direct_Measurement]',
        validation_standard: row.standard || 'CSRD_ESRS',
      },
      trustworthy: {
        hash_lock: row.hash_lock || 'pending',
        is_frozen: row.status === 'approved',
        locked_at: row.approved_at ? new Date(row.approved_at).getTime() : undefined,
      },
      verified_at: row.verified_at ? new Date(row.verified_at).getTime() : undefined,
    };

    // 2. Map to UCC
    return {
      uuid: row.id || row.uuid,
      version: '1.0.0',
      timestamp: new Date(row.period_start).getTime(),
      status: this.mapStatus(row.status),
      evidence,
      data: {
        value: row.value,
        calculatedValue: row.calculated_value,
        periodStart: row.period_start,
        periodEnd: row.period_end,
        orgUnitId: row.org_unit_id,
      },
      esg: {
        environmental: row.category === 'environmental' ? 10 : 0,
        social: row.category === 'social' ? 10 : 0,
        governance: row.category === 'governance' ? 10 : 0,
      },
      resonance_rs: row.calculated_value ? Math.min(row.calculated_value / 100, 1) : 0,
    };
  }

  /**
   * Seal a UCC component using the 5T Trustworthy Protocol.
   * This generates a cryptographic hash_lock for the component's evidence.
   */
  static async sealUCC(component: IComponentCore): Promise<IComponentCore> {
    const { hash_lock } = await TrustworthyLock.seal(
      component.evidence,
      component.evidence.traceable?.source_origin
    );

    return {
      ...component,
      evidence: {
        ...component.evidence,
        trustworthy: {
          ...component.evidence.trustworthy,
          hash_lock,
          is_frozen: true,
          locked_at: Date.now()
        }
      }
    };
  }

  /**
   * Map DB status to IComponentCore status
   */
  private static mapStatus(status: string): IComponentCore['status'] {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Proposed';
      case 'draft':
        return 'Draft';
      case 'rejected':
        return 'Violated';
      default:
        return 'Proposed';
    }
  }

  /**
   * Map a metric definition row to application model
   */
  static mapToMetric(row: any) {
    return {
      id: row.id,
      code: row.code,
      name: row.name,
      category: row.category,
      description: row.description,
      unit: row.unit,
      isActive: row.is_active,
      targetValue: row.target_value,
    };
  }
}
