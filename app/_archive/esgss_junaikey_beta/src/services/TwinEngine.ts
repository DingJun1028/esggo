export interface TwinState {
  id: string;
  originalId: string;
  type: 'AGENT' | 'LEGION';
  clonedData: any;
  simulatedInsights: number;
  stabilityRating: number;
}

export interface StressScenario {
  id: string;
  name: string;
  description: string;
  impactSeverity: number;
  targetDrift: 'E' | 'S' | 'G';
}

export class TwinEngine {
  /**
   * State Cloning
   * Create a deep copy mirror that does not affect the original object
   */
  public static createTwin(original: any, type: 'AGENT' | 'LEGION'): TwinState {
    return {
      id: `TWIN-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      originalId: original.id,
      type,
      clonedData: JSON.parse(JSON.stringify(original)),
      simulatedInsights: 0,
      stabilityRating: 100,
    };
  }

  /**
   * Stress Test Simulation
   * Simulate extreme events on the cloned state impact
   */
  public static runScenario(twin: TwinState, scenario: StressScenario): TwinState {
    const severity = scenario.impactSeverity;
    const resilience = (twin.clonedData.level || 5) * 2;

    // Simulate impact
    const damage = Math.max(0, severity * 10 - resilience);
    const newStability = Math.max(0, twin.stabilityRating - damage);

    // If survived, gain insights
    const insightGain = newStability > 0 ? severity * 5 : 0;

    return {
      ...twin,
      stabilityRating: newStability,
      simulatedInsights: twin.simulatedInsights + insightGain,
    };
  }
}
