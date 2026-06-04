/**
 * ESG GO | Digital Twin Engine (Predictive Governance)
 * Runs "What-If" scenarios based on 5T-certified baseline data.
 */
import { PolicyValidationResult } from './policy-engine';
export interface ScenarioModifier {
    targetField: 'carbonEmissions' | 'energyUsage' | 'waterUsage' | 'wasteGenerated';
    valueChange: number;
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
    overallImpactScore: number;
    agentInsights: string[];
}
export declare class DigitalTwinEngine {
    private static instance;
    static getInstance(): DigitalTwinEngine;
    /**
     * Runs a scenario simulation.
     * @param scenario The scenario to simulate
     * @param baseline Current 5T-certified data
     */
    simulate(scenario: Scenario, baseline: Record<string, number>): Promise<ProjectionResult>;
}
export declare const digitalTwinEngine: DigitalTwinEngine;
//# sourceMappingURL=digital-twin-engine.d.ts.map