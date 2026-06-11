/**
 * ESG GO | Carbon Calculator (ISO 14064-1 Compliant)
 * ════════════════════════════════════════════════
 * Core logic for calculating GHG emissions with 5T traceability.
 */

import { v4 as uuidv4 } from 'uuid';
import { EMISSION_FACTORS } from './emission-factors';
import { IComponentCore, IEvidence } from '@/shared/types/core.types';

export interface CalculationInput {
  factorId: string;
  activityAmount: number;
  sourceOrigin: string; // e.g., "Electricity Bill Jan 2024"
  notes?: string;
}

export class CarbonCalculator {
  /**
   * Performs a single emission calculation and generates a 5T-compliant core component.
   */
  public static calculate(input: CalculationInput): IComponentCore {
    const ef = EMISSION_FACTORS[input.factorId];
    if (!ef) {
      throw new Error(`Emission factor not found: ${input.factorId}`);
    }

    const emissionValue = input.activityAmount * ef.factor;
    const formula = `${input.activityAmount} ${ef.unit} * ${ef.factor} (kgCO2e/${ef.unit})`;
    const impactMetric = `${emissionValue.toFixed(4)} kgCO2e`;

    const evidence: IEvidence = {
      originCause: `User Input: ${input.sourceOrigin}`,
      processTrace: [
        `Identified Factor: ${ef.name} (${ef.category})`,
        `Applied Factor: ${ef.factor} kgCO2e/${ef.unit} (Source: ${ef.source})`,
        `Calculation: ${formula}`
      ],
      finalEffect: impactMetric,
      source_origin: input.sourceOrigin,
      formula_ref: ef.id
    };

    // Construct OmniCore Component (P0)
    return {
      uuid: uuidv4(),
      version: '1.0.0',
      timestamp: Date.now(),
      formula,
      impact_metric: impactMetric,
      status: 'Trustworthy',
      hash_lock: this.generateHashLock(formula, impactMetric),
      evidence: [evidence]
    };
  }

  /**
   * Dummy Hash Lock generator (placeholder for ZKP/Cryptographic sealing)
   */
  private static generateHashLock(formula: string, result: string): string {
    // In production, this would be a SHA-256 or a ZKP proof
    return `hash_${Buffer.from(`${formula}|${result}`).toString('base64').slice(0, 16)}`;
  }
}
