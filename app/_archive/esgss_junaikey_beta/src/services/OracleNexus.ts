export interface ESGSignal {
  id: string;
  name: string;
  type: 'E' | 'S' | 'G';
  value: number; // 0-100
  trend: 'UP' | 'DOWN' | 'STABLE';
  projectedRisk: number; // 0-1.0
}

export const ORACLE_SIGNALS: ESGSignal[] = [
  {
    id: 'CARBON_INTENSITY',
    name: 'Global Carbon Emission Intensity (Carbon Intensity)',
    type: 'E',
    value: 72,
    trend: 'UP',
    projectedRisk: 0.65,
  },
  {
    id: 'SOCIAL_SENTIMENT',
    name: 'Social Sentiment Resonance (Social Sentiment)',
    type: 'S',
    value: 45,
    trend: 'DOWN',
    projectedRisk: 0.4,
  },
  {
    id: 'GOV_COMPLIANCE',
    name: 'Governance Compliance Risk (Governance Risk)',
    type: 'G',
    value: 88,
    trend: 'STABLE',
    projectedRisk: 0.2,
  },
  {
    id: 'METHANE_LEAK',
    name: 'Methane Leak Detection (Methane Detection)',
    type: 'E',
    value: 12,
    trend: 'UP',
    projectedRisk: 0.85,
  },
];

export class OracleNexus {
  /**
   * Calculate Predictive Flux (Predictive Flux)
   * Adjusts prediction accuracy and risk assessment based on Agent's Governance attributes
   */
  public static calculatePredictiveFlux(
    signalId: string,
    govAttribute: number
  ): { projection: number; variance: number } {
    const signal = ORACLE_SIGNALS.find(s => s.id === signalId);
    if (!signal) return { projection: 0, variance: 1.0 };

    // Gov score reduces uncertainty (variance)
    const variance = Math.max(0.05, 1.0 - govAttribute / 150);
    const projection = signal.value * (1 + (Math.random() - 0.5) * variance);

    return { projection, variance };
  }

  /**
   * Get Recommended Action
   */
  public static getRecommendedAction(signal: ESGSignal): string | null {
    if (signal.projectedRisk > 0.7) {
      if (signal.type === 'E') return 'CARBON_ADJ';
      if (signal.type === 'S') return 'SEC_AUDIT';
      return 'ANOMALY_ALERT';
    }
    if (signal.projectedRisk > 0.4 && signal.trend === 'UP') {
      return 'ANOMALY_ALERT';
    }
    return null;
  }
}
