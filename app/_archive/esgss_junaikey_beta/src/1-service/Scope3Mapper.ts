/**
 * 💡 奧秘組件心核：範疇三數據自動化映射器 (Scope3Mapper)
 * --------------------------------------------------
 * [協議] 🟢 可溯源 & 🟠 可驗算 - Value Chain
 */

export interface ActivityData {
  source: string;
  category: string; // 採購商品、運輸等
  value: number;
  unit: string;
}

export interface Scope3EmissionFactor {
  material: string;
  factor: number;
  unit: string;
  source: string; // IPCC, CLCD etc.
}

export class Scope3Mapper {
  /**
   * 模擬排放係數庫 (Emission Factor DB)
   */
  private static efDB: Record<string, Scope3EmissionFactor> = {
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
   * 自動映射並計算排放量
   */
  static mapAndCalculate(activity: ActivityData): any {
    const factorData = this.efDB[activity.category];

    if (!factorData) {
      return {
        success: false,
        message: `未能匹配到 ${activity.category} 的排放係數，建議啟動 AI 係數匹配 Agent。`,
      };
    }

    const totalEmissions = activity.value * factorData.factor;

    return {
      success: true,
      data: {
        topic: `範疇三 - ${activity.category}`,
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
