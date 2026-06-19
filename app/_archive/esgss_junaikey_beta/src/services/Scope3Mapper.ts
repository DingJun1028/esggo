/**
 * 💡 Omni Component Core: Scope 3 Data Automation Mapper (Scope3Mapper)
 * --------------------------------------------------
 * [Protocol] 🟢 Traceable & 🟠 Calculable - Value Chain
 */

export interface ActivityData {
  source: string;
  category: string; // Purchased goods, transportation, etc.
  value: number;
  unit: string;
}

export interface EmissionFactor {
  material: string;
  factor: number;
  unit: string;
  source: string; // IPCC, CLCD etc.
}

export class Scope3Mapper {
  /**
   * Simulated Emission Factor DB
   */
  private static efDB: Record<string, EmissionFactor> = {
    Steel: { material: 'Steel', factor: 1.85, unit: 'kgCO2e/kg', source: 'Ecoinvent 3.9' },
    Aluminum: { material: 'Aluminum', factor: 12.5, unit: 'kgCO2e/kg', source: 'Ecoinvent 3.9' },
    Electricity_TW: {
      material: 'Electricity',
      factor: 0.495,
      unit: 'kgCO2e/kWh',
      source: 'MOE 2023',
    },
  };

  /**
   * Auto-map and calculate emissions
   */
  static mapAndCalculate(activity: ActivityData): any {
    const factorData = this.efDB[activity.category];

    if (!factorData) {
      return {
        success: false,
        message: `Failed to match emission factor for ${activity.category}, suggest activating AI factor matching Agent.`,
      };
    }

    const totalEmissions = activity.value * factorData.factor;

    return {
      success: true,
      data: {
        topic: `Scope 3 - ${activity.category}`,
        activity_value: activity.value,
        activity_unit: activity.unit,
        emission_total: totalEmissions,
        emission_unit: 'kgCO2e',
        factor_used: factorData.factor,
        factor_origin: factorData.source,
        protocol: '🟢 Traceable to LCA DB',
      },
    };
  }
}
