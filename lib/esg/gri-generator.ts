/**
 * ESG GO | GRI Report Generator
 * ═════════════════════════════
 * Orchestrates the conversion of 5T components into GRI disclosures.
 */

import { GRI_TEMPLATES } from './templates/report-templates';
import { IComponentCore } from '@/shared/types/core.types';

export class GRIGenerator {
  /**
   * Generates a draft section based on component core data.
   */
  public static generateSection(griCode: keyof typeof GRI_TEMPLATES, components: IComponentCore[]): string {
    const template = GRI_TEMPLATES[griCode];
    if (!template) {
      throw new Error(`GRI Template not found: ${griCode}`);
    }

    // Aggregate metrics
    const metricsSummary = components.map(c => c.impact_metric).join(', ');
    
    // Consolidate process traces into a 5T audit string
    const fullTrace = components.flatMap(c => 
      c.evidence.flatMap(e => [
        `- **[T]** ${e.originCause} (UUID: \`${c.uuid.slice(0, 8)}\`)`,
        ...e.processTrace.map(t => `  - ${t}`)
      ])
    ).join('\n');

    return template.content(metricsSummary, fullTrace);
  }
}
