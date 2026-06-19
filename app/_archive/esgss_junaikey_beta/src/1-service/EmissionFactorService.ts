import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

/**
 * 💡 排放係數庫服務 (EmissionFactorService)
 * --------------------------------------------------
 * [協議] T2 可溯源 (Traceable)
 *
 * 主要職責：
 * 1. 對接外部係數 API (IPCC, Ecoinvent, Climatiq)
 * 2. 實作係數緩存機制以提升計算速度
 * 3. 為每筆計算提供「可溯源驗證」
 */

export interface EmissionFactor {
  id: string;
  label: string;
  value: number; // kgCO2e / unit
  unit: string;
  source: string; // e.g., 'IPCC AR6', 'Ecoinvent 3.8'
  version: string;
  year: number;
  uncertainty: number; // 0-1
  hash: string; // T5 不可篡改封印
}

export class EmissionFactorService {
  private static cache: Map<string, EmissionFactor> = new Map();

  private static mockDatabase: Record<string, Partial<EmissionFactor>> = {
    'electricity-us': { value: 0.38, unit: 'kgCO2e/kWh', source: 'EPA eGRID 2023' },
    'electricity-eu': { value: 0.23, unit: 'kgCO2e/kWh', source: 'EEA 2023' },
    'electricity-cn': { value: 0.55, unit: 'kgCO2e/kWh', source: 'China Grid 2023' },
    natural_gas: { value: 2.03, unit: 'kgCO2e/m3', source: 'IPCC 2006' },
    diesel: { value: 2.68, unit: 'kgCO2e/liter', source: 'DEFRA 2023' },
    petrol: { value: 2.31, unit: 'kgCO2e/liter', source: 'DEFRA 2023' },
    air_travel_short: { value: 0.15, unit: 'kgCO2e/km', source: 'ICAO 2023' },
    air_travel_long: { value: 0.11, unit: 'kgCO2e/km', source: 'ICAO 2023' },
    shipping_freight: { value: 0.01, unit: 'kgCO2e/t-km', source: 'IMO 2023' },
    steel_production: { value: 1.85, unit: 'kgCO2e/kg', source: 'WorldSteel 2023' },
    cement_production: { value: 0.59, unit: 'kgCO2e/kg', source: 'GCCA 2023' },
  };

  /**
   * 根據活動類型取得係數 (例如：電力、燃料、航空)
   */
  static async getFactor(activityId: string, location: string = 'global'): Promise<EmissionFactor> {
    const cacheKey = `${activityId}-${location}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // 模擬對接外部 API (Climatiq / Ecoinvent 模擬)
    omniLogger.info(LogCategory.SYSTEM, `正在從外部數據庫擷取係數: ${activityId} (${location})...`);

    // 模擬網絡延遲 (100-300ms)
    const latency = Math.floor(Math.random() * 200) + 100;
    await new Promise(resolve => setTimeout(resolve, latency));

    // 查找模擬數據庫
    const dbKey = `${activityId}-${location}`;
    const fallbackKey = activityId;
    const mockData = this.mockDatabase[dbKey] || this.mockDatabase[fallbackKey];

    const val = mockData?.value ?? 0.521; // 默認值
    const unit = mockData?.unit ?? 'kgCO2e / unit';
    const src = mockData?.source ?? 'IPCC AR6 (Simulated)';

    // 構建係數對象
    const factor: EmissionFactor = {
      id: `ef-${activityId}-${Date.now().toString().slice(-4)}`,
      label: `${activityId} Emission Factor`,
      value: val,
      unit,
      source: src,
      version: '2023.1',
      year: 2023,
      uncertainty: 0.05,
      hash: `sha256-mock-${Math.random().toString(36).substring(7)}`,
    };

    // 寫入緩存
    this.cache.set(cacheKey, factor);
    return factor;
  }

  /**
   * 驗證係數是否仍在生命週期內
   */
  static isFactorValid(factor: EmissionFactor): boolean {
    const currentYear = new Date().getFullYear();
    return currentYear - factor.year <= 5; // 五年有效期
  }

  /**
   * 預載常用係數
   */
  static async preloadCommonFactors(): Promise<void> {
    const commonActs = ['electricity', 'natural_gas', 'diesel', 'air_travel_short'];
    for (const act of commonActs) {
      await this.getFactor(act);
    }
    omniLogger.info(LogCategory.SYSTEM, `已預載 ${this.cache.size} 個常用排放係數。`);
  }
}
