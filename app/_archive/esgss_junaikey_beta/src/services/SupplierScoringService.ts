/**
 * Classified under: ESG Impact Layer & Trust Governance Layer
 * 💡 Omni-Component Core: Supplier Scoring Service
 * --------------------------------------------------
 * [Protocol] Value-Creation ESG - Supply Chain Strategy Optimization
 */

import { trustProtocolService } from './TrustProtocolService.js';

export interface SupplierMetrics {
  dataTrustIndex: number; // D: 4+1 Protocol Achievement Rate (0-1)
  emissionIntensity: number; // I: Carbon emissions per unit of output (Lower score is better)
  reductionCommitment: number; // C: SBTi/RE100 Participation (0-1)
  responseSpeed: number; // R: API Integration Frequency (0-1)
}

export type SupplierGrade = 'S' | 'A' | 'B' | 'C';

export interface SupplierScore {
  supplierId: string;
  supplierName: string;
  totalScore: number;
  grade: SupplierGrade;
  advice: string;
  trustMeta?: {
    hash: string;
    sealedAt: string;
  };
}

export class SupplierScoringService {
  /**
   * Calculate supplier total score and grade
   * Formula: S = (Wd * D) + (Wi * I) + (Wc * C) + (Wr * R)
   * And encrypt/lock through TrustProtocol
   */
  static async calculateScore(
    id: string,
    name: string,
    metrics: SupplierMetrics
  ): Promise<SupplierScore> {
    const Wd = 0.4,
      Wi = 0.3,
      Wc = 0.2,
      Wr = 0.1;

    // Assume I has been normalized, the higher the better the carbon performance
    const total =
      (metrics.dataTrustIndex * Wd +
        metrics.emissionIntensity * Wi +
        metrics.reductionCommitment * Wc +
        metrics.responseSpeed * Wr) *
      100;

    let grade: SupplierGrade = 'C';
    let advice = '';

    if (total >= 90) {
      grade = 'S';
      advice =
        'Core Strategic Partner: Prioritize procurement, suggest starting depth low-carbon product R&D subsidies.';
    } else if (total >= 75) {
      grade = 'A';
      advice =
        'Quality Compliant Supplier: Maintain status quo, encourage transition from cost-based to activity-based accounting.';
    } else if (total >= 60) {
      grade = 'B';
      advice =
        'Observation/Coaching Target: Suggest requesting Traceable evidence chain completion within 1 quarter.';
    } else {
      grade = 'C';
      advice =
        'High Risk Source: Opaque data and low carbon performance, recommend starting supplier replacement evaluation.';
    }

    const rawScore: SupplierScore = {
      supplierId: id,
      supplierName: name,
      totalScore: parseFloat(total.toFixed(2)),
      grade,
      advice,
    };

    // 🔗 TrustProtocol Integration: Immutable Seal
    const sealed = await trustProtocolService.sealGeneric(rawScore);

    return {
      ...sealed.data,
      trustMeta: {
        hash: sealed.hash,
        sealedAt: sealed.sealedAt,
      },
    };
  }
}
