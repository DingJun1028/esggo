import { STANDARDS, Standard, DisclosureItem } from '../standards-data';
import { supabase } from '../supabase';

/**
 * GRI Compliance Matrix Engine
 * Bridge between static GRI standards and dynamic system state (Evidence, Tasks, Seals).
 */

export interface GRIComplianceNode {
  code: string;
  title: string;
  titleZh: string;
  category: string;
  completeness: number; // 0-100
  status: 'completed' | 'in_progress' | 'pending' | 'na';
  hasEvidence: boolean;
  isSealed: boolean; // T5 verified
  tasksCount: number;
  gapAnalysis?: string;
}

export class ComplianceEngine {
  /**
   * Calculates the full GRI Compliance Matrix by cross-referencing Standards with Evidence Vault and Task Center.
   */
  static async calculateGRIMatrix(companyId: string): Promise<GRIComplianceNode[]> {
    // 1. Fetch real-time data from Supabase
    const [evidenceRes, tasksRes] = await Promise.all([
      supabase.from('vault_omni_core').select('uuid, formula, hash_lock').eq('company_id', companyId),
      supabase.from('tasks').select('id, gri_reference, status').eq('company_id', companyId)
    ]);

    const evidence = evidenceRes.data || [];
    const tasks = tasksRes.data || [];

    // 2. Flatten all disclosure items from GRI standards
    const griStandards = STANDARDS.filter(s => s.category === 'GRI');
    const allItems: DisclosureItem[] = [];
    griStandards.forEach(s => allItems.push(...s.disclosureItems));

    // 3. Map items to dynamic state
    return allItems.map(item => {
      const linkedEvidence = evidence.filter(e => e.formula?.includes(item.code));
      const linkedTasks = tasks.filter(t => t.gri_reference?.includes(item.code));
      
      const hasEvidence = linkedEvidence.length > 0;
      const isSealed = linkedEvidence.some(e => e.hash_lock);
      const completedTasks = linkedTasks.filter(t => t.status === 'done').length;
      
      // Heuristic for completeness
      let completeness = 0;
      if (hasEvidence) completeness += 60;
      if (isSealed) completeness += 20;
      if (linkedTasks.length > 0) {
        completeness += (completedTasks / linkedTasks.length) * 20;
      }
      
      let status: GRIComplianceNode['status'] = 'pending';
      if (completeness >= 100) status = 'completed';
      else if (completeness > 0) status = 'in_progress';

      return {
        code: item.code,
        title: item.title,
        titleZh: item.titleZh,
        category: this.mapCategory(item.code),
        completeness: Math.min(Math.round(completeness), 100),
        status,
        hasEvidence,
        isSealed,
        tasksCount: linkedTasks.length,
      };
    });
  }

  private static mapCategory(code: string): string {
    if (code.startsWith('GRI 2-') || code.startsWith('GRI 3-')) return 'universal';
    if (code.startsWith('GRI 30')) return 'environmental';
    if (code.startsWith('GRI 40')) return 'social';
    if (code.startsWith('GRI 20')) return 'governance';
    return 'universal';
  }
}
