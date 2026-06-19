// src/omni/services/OmniScoreCalculator.ts

/**
 * @file OmniScoreCalculator.ts
 * @description Implements the OmniScoreCalculator, responsible for Dimension 11 (Calculable).
 * This service ensures that metrics and scores produced by the system are deterministic,
 * verifiable, and based on transparent algorithms.
 */

import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

/**
 * Represents a named input variable for a calculation.
 */
export interface ICalculationInput {
  name: string;
  value: number;
  weight: number; // The weight of this input in the overall calculation (0.0 to 1.0).
}

/**
 * Represents the result of a calculation, including the inputs used.
 */
export interface ICalculationResult {
  scoreName: string;
  finalScore: number;
  inputs: ICalculationInput[];
  calculationTimestamp: Date;
  formulaId: string; // An identifier for the formula used.
}

/**
 * Provides deterministic and verifiable calculation services.
 */
export class OmniScoreCalculator {
  private static instance: OmniScoreCalculator;

  private constructor() {
    omniLogger.info(LogCategory.SYSTEM, 'OmniScoreCalculator initialized.', {
      service: 'OmniScoreCalculator',
    });
  }

  /**
   * Retrieves the singleton instance of the OmniScoreCalculator.
   * @returns The OmniScoreCalculator instance.
   */
  public static getInstance(): OmniScoreCalculator {
    if (!OmniScoreCalculator.instance) {
      OmniScoreCalculator.instance = new OmniScoreCalculator();
    }
    return OmniScoreCalculator.instance;
  }

  /**
   * Calculates a score using a weighted average formula. This is a deterministic process.
   * @param scoreName - The name of the score being calculated (e.g., 'ESG Score').
   * @param inputs - An array of inputs with values and weights.
   * @returns A detailed result of the calculation.
   */
  public calculateWeightedAverage(
    scoreName: string,
    inputs: ICalculationInput[]
  ): ICalculationResult {
    let totalValue = 0;
    let totalWeight = 0;

    for (const input of inputs) {
      if (input.weight < 0 || input.weight > 1) {
        omniLogger.warn(
          LogCategory.FINANCE,
          `Input '${input.name}' has an invalid weight: ${input.weight}. Clamping to [0, 1].`,
          { service: 'OmniScoreCalculator' }
        );
        input.weight = Math.max(0, Math.min(1, input.weight));
      }
      totalValue += input.value * input.weight;
      totalWeight += input.weight;
    }

    // To prevent division by zero and ensure the result is scaled correctly if weights don't sum to 1.
    const finalScore = totalWeight === 0 ? 0 : totalValue / totalWeight;

    const result: ICalculationResult = {
      scoreName,
      finalScore,
      inputs,
      calculationTimestamp: new Date(),
      formulaId: 'weighted_average_v1',
    };

    omniLogger.info(
      LogCategory.FINANCE,
      `Calculated score '${scoreName}': ${finalScore.toFixed(4)}`,
      { service: 'OmniScoreCalculator', result }
    );
    return result;
  }

  /**
   * Verifies a calculation by re-running it with the same inputs.
   * Since the calculation is deterministic, the result should be identical.
   * @param pastResult - The calculation result to verify.
   * @returns True if the re-calculated score matches the original score, false otherwise.
   */
  public verifyCalculation(pastResult: ICalculationResult): boolean {
    omniLogger.debug(
      LogCategory.FINANCE,
      `Verifying calculation for score '${pastResult.scoreName}' from ${pastResult.calculationTimestamp}.`,
      { service: 'OmniScoreCalculator' }
    );

    // For now, we only have one formula. A real implementation would use formulaId to select the right one.
    if (pastResult.formulaId !== 'weighted_average_v1') {
      omniLogger.error(
        LogCategory.FINANCE,
        `Cannot verify calculation with unknown formulaId: ${pastResult.formulaId}`,
        { service: 'OmniScoreCalculator', error: new Error('Unknown formula') }
      );
      return false;
    }

    const verificationResult = this.calculateWeightedAverage(
      pastResult.scoreName,
      pastResult.inputs
    );

    // Comparing floating point numbers requires a tolerance (epsilon).
    const isVerified = Math.abs(verificationResult.finalScore - pastResult.finalScore) < 1e-9;

    omniLogger.info(
      LogCategory.FINANCE,
      `Verification for '${pastResult.scoreName}' completed. Match: ${isVerified}`,
      { service: 'OmniScoreCalculator' }
    );
    return isVerified;
  }
}

// Export a singleton instance
export const scoreCalculator = OmniScoreCalculator.getInstance();
