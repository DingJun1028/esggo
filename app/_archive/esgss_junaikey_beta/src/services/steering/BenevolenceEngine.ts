import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
// import { omniIntelligence } from '@/omni/services/OmniEvolutionEngine.js';

/**
 * 💡 Omni-Swarm Protocol (Swarm Protocol)
 * --------------------------------------------------
 * [Core] King's Way Decision Bias
 * [Function] Weights MAS decisions based on "King's Way" principles (Sharing, Stability, Growth, Harmony)
 */

export enum BenevolencePrinciple {
  SHARING = 'SHARING',
  STABILITY = 'STABILITY',
  GROWTH = 'GROWTH',
  HARMONY = 'HARMONY',
}

export interface DecisionPayload {
  impact: 'positive' | 'neutral' | 'negative';
  scope: 'local' | 'global' | 'ecosystem';
  principleAlignment: BenevolencePrinciple[];
  [key: string]: unknown;
}

export class BenevolenceEngine {
  private static instance: BenevolenceEngine;

  // King's Way Weight Matrix
  private weightingMatrix: Record<BenevolencePrinciple, number> = {
    [BenevolencePrinciple.SHARING]: 0.25,
    [BenevolencePrinciple.STABILITY]: 0.25,
    [BenevolencePrinciple.GROWTH]: 0.25,
    [BenevolencePrinciple.HARMONY]: 0.25,
  };

  /**
   * 🧬 Update King's Way Principles Weights (Principle Evolution)
   * --------------------------------------------------
   * Dynamically adjusts principle weights based on system operational status to achieve self-evolution.
   *
   * @param resonance Principle resonance matrix
   */
  public updatePrinciples(resonance: Record<BenevolencePrinciple, number>): void {
    let totalResonance = 0;
    for (const principle of Object.values(BenevolencePrinciple)) {
      totalResonance += resonance[principle] || 0;
    }

    if (totalResonance > 0) {
      for (const principle of Object.values(BenevolencePrinciple)) {
        this.weightingMatrix[principle] = (resonance[principle] || 0) / totalResonance;
      }
    } else {
      // If no resonance, reset to default or log a warning
      omniLogger.warn(
        LogCategory.AI,
        'No resonance provided for principle update, maintaining current weights.'
      );
      // Optionally, reset to default equal weights:
      // for (const principle of Object.values(BenevolencePrinciple)) {
      //     this.weightingMatrix[principle] = 1 / Object.values(BenevolencePrinciple).length;
      // }
    }
    omniLogger.info(
      LogCategory.AI,
      "King's Way Principles Weights Updated (Benevolence Principles Updated)",
      {
        newWeights: this.weightingMatrix,
      }
    );
  }

  private constructor() {
    omniLogger.info(LogCategory.AI, 'Benevolence Engine Online');
  }

  public static getInstance(): BenevolenceEngine {
    if (!BenevolenceEngine.instance) {
      BenevolenceEngine.instance = new BenevolenceEngine();
    }
    return BenevolenceEngine.instance;
  }

  /**
   * Evaluate decision proposals with benevolence score
   */
  /**
   * ⚖️ Benevolence Scoring
   * --------------------------------------------------
   * Evaluates the impact and alignment of decisions based on King's Way principles.
   * [Adherence Standard] 3 Traceable, 1 Immutable (Traceable, Trackable, Calculable, Immutable)
   *
   * @param proposal Decision proposal payload
   * @returns Benevolence Index (0.0 - 1.0)
   */
  public scoreDecision(proposal: DecisionPayload): number {
    // const vitals = omniIntelligence.vitals$.value;
    // const hyperSync = vitals.hypercube?.tesseractSync || 0;
    const hyperSync = 50; // Default value

    // Base Bias: Higher high-dimensional resonance equals stronger benevolence
    let score = (hyperSync / 100) * 0.5;

    // Score based on proposal content and alignment with King's Way principles
    if (
      proposal.impact === 'positive' &&
      (proposal.scope === 'global' || proposal.scope === 'ecosystem')
    ) {
      score += 0.3;
    }

    if (proposal.principleAlignment && proposal.principleAlignment.length > 0) {
      score += 0.2;
    }

    return Math.min(1, score);
  }

  /**
   * Execute benevolence steering
   */
  public applySteering(
    decisions: DecisionPayload[]
  ): (DecisionPayload & { benevolenceScore: number; isKingWayAligned: boolean })[] {
    return decisions
      .map(d => ({
        ...d,
        benevolenceScore: this.scoreDecision(d),
        isKingWayAligned: this.scoreDecision(d) > 0.8,
      }))
      .sort((a, b) => b.benevolenceScore - a.benevolenceScore);
  }
}

export const benevolenceEngine = BenevolenceEngine.getInstance();
