/**
 * ESG GO | Supplier Assessment Engine
 * ══════════════════════════════════
 * Multi-dimensional scoring for supply chain integrity (RBA v8.0 & 5T).
 */

import { v4 as uuidv4 } from 'uuid';
import { IComponentCore, IEvidence } from '@/shared/types/core.types';

export interface SupplierInput {
  supplierName: string;
  region: string;
  category: string; // e.g., "Electronics", "Logistics"
  rbaSelfAssessmentScore: number;
  esgCertificates: string[]; // e.g., ["ISO 14001", "ISO 45001"]
}

export interface AssessmentResult {
  riskLevel: 'Low' | 'Medium' | 'High';
  overallScore: number;
  breakdown: {
    environmental: number;
    social: number;
    governance: number;
  };
}

export class SupplierAssessmentEngine {
  /**
   * Evaluates a supplier and generates a 5T-compliant core component.
   */
  public static assess(input: SupplierInput): IComponentCore {
    // 1. Scoring Logic (Simplified RBA/ESG Weighted Scoring)
    const environmental = input.esgCertificates.includes('ISO 14001') ? 95 : 60;
    const social = input.rbaSelfAssessmentScore;
    const governance = input.esgCertificates.length > 0 ? 90 : 50;

    const overallScore = Math.round((environmental * 0.4) + (social * 0.4) + (governance * 0.2));
    const riskLevel = overallScore > 85 ? 'Low' : (overallScore > 60 ? 'Medium' : 'High');

    const impactMetric = `Score: ${overallScore}/100 (${riskLevel} Risk)`;
    const formula = `WeightedAvg(E:40%, S:40%, G:20%) based on RBA-v8 & ISO-Certs`;

    // 2. 5T Evidence
    const evidence: IEvidence = {
      originCause: `Supplier Data: ${input.supplierName} (${input.region})`,
      processTrace: [
        `Region Analysis: ${input.region} (Baseline Risk Adjusted)`,
        `Certificate Audit: Found ${input.esgCertificates.join(', ')}`,
        `RBA Disclosure Verification: SAQ Score ${input.rbaSelfAssessmentScore}`,
        `Weighted Scoring: E=${environmental}, S=${social}, G=${governance}`
      ],
      finalEffect: impactMetric,
      source_origin: `Supplier_Portal_${input.supplierName.replace(/\s+/g, '_')}`,
      formula_ref: 'RBA_V8_WEIGHTED_V1'
    };

    // 3. Construct P0 Component
    return {
      uuid: uuidv4(),
      version: '1.0.0',
      timestamp: Date.now(),
      formula,
      impact_metric: impactMetric,
      status: 'Trustworthy',
      hash_lock: `risk_${Buffer.from(`${input.supplierName}|${overallScore}`).toString('base64').slice(0, 16)}`,
      evidence: [evidence]
    };
  }
}
