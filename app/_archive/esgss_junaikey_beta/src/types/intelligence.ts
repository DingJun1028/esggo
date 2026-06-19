/**
 * 💡 Implementation: ESGss Intel Node Specification
 * --------------------------------------------------
 * [Zero Hallucination Verification] Ensure every piece of intelligence has a 5T evidence chain.
 */
import { IComponentCore, IEvidenceMap } from './esgss_schema';

export type IntelCategory = 'Scandal' | 'Commitment' | 'News' | 'Market' | 'Policy';

export interface IIntelEvidence extends IEvidenceMap {
  // Heritage Aliases kept for backward compatibility if needed
  legacy_hash?: string;
}

export interface IIntelNode extends IComponentCore {
  category: IntelCategory;
  target_enterprise?: string; // Target Enterprise UUID
  confidence_score: number; // Confidence Score (0.0-1.0)
  action_trigger: boolean; // Whether to trigger a decision alert
  data: any;
}

export interface ISourceTaxonomy {
  id: string; // S1-S5
  name: string;
  type: 'Global Governance' | 'Standards' | 'Think Tanks' | 'Finance' | 'Industry';
  sources: string[];
}
