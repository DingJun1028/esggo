/**
 * ESG GO | Digital Twin Engine (Predictive Governance)
 * Runs "What-If" scenarios based on 5T-certified baseline data.
 */

import { policyEngine, PolicyValidationResult } from './policy-engine';

export interface ScenarioModifier {
  targetField: 'carbonEmissions' | 'energyUsage' | 'waterUsage' | 'wasteGenerated';
  valueChange: number; // e.g., -0.2 for 20% reduction
}

export interface Scenario {
  id: string;
  name: string;
  modifiers: ScenarioModifier[];
}

export interface ProjectionResult {
  scenarioId: string;
  timestamp: string;
  originalValues: Record<string, number>;
  projectedValues: Record<string, number>;
  complianceProjections: Record<string, PolicyValidationResult>;
  overallImpactScore: number; // 0-100
}

export class DigitalTwinEngine {
  private static instance: DigitalTwinEngine;

  static getInstance(): DigitalTwinEngine {
    if (!DigitalTwinEngine.instance) {
      DigitalTwinEngine.instance = new DigitalTwinEngine();
    }
    return DigitalTwinEngine.instance;
  }

  /**
   * Runs a scenario simulation.
   * @param scenario The scenario to simulate
   * @param baseline Current 5T-certified data
   */
  async simulate(scenario: Scenario, baseline: Record<string, number>): Promise<ProjectionResult> {
    const projectedValues = { ...baseline };
    const complianceProjections: Record<string, PolicyValidationResult> = {};

    // 1. Apply Modifiers
    for (const mod of scenario.modifiers) {
      if (baseline[mod.targetField] !== undefined) {
        projectedValues[mod.targetField] = baseline[mod.targetField] * (1 + mod.valueChange);
      }
    }

    // 2. Validate Projections against Regulatory Policies
    // Note: We use policy_gri_305_1 for CO2/Energy for this demo
    const co2Policy = 'policy_gri_305_1';
    complianceProjections['carbonEmissions'] = policyEngine.validate(co2Policy, {
      value: projectedValues.carbonEmissions,
      unit: 'tCO2e',
      source_origin: '/simulation/twin'
    });

    // 3. Calculate Overall Impact Score
    // (Weighted average of compliance and reduction success)
    const reductionSuccess = scenario.modifiers.length > 0 ? 80 : 50; 
    const overallImpactScore = Math.round((reductionSuccess + (complianceProjections['carbonEmissions'].score || 0)) / 2);

    return {
      scenarioId: scenario.id,
      timestamp: new Date().toISOString(),
      originalValues: baseline,
      projectedValues,
      complianceProjections,
      overallImpactScore
    };
  }
}

export const digitalTwinEngine = DigitalTwinEngine.getInstance();
