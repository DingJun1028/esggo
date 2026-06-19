/**
 * 💡 奧秘元件心核：OS-Climate 科學演算核心
 * --------------------------------------------------------------------------------
 * [來源備註] Integrated from OS-Climate (ITR, PhysRisk) & IPCC AR6
 * [協議] 5T Protocol (5 Can: Tangible, Traceable, Trackable, Transparent, Trustworthy)
 * 
 * 第一層：5T 邏輯門 (The 5T Logic Gate)
 * [1] Tangible 可感知 - 將抽象永續願景轉化為具體指標成果
 * [2] Traceable 可溯源 - 鏈式日誌包含原始資料來源 (source_origin)
 * [3] Trackable 可追蹤 - 生命週期 Hook 記錄數據流轉路徑
 * [4] Transparent 可透明驗算 - 算法公式公開化，零幻覺驗證 (ISO-14064-1)
 * [5] Trustworthy 不可篡改 - Hash Lock + Object.freeze()
 * 
 * 第二層：4可1不可狀態機 (The 4+1 State Machine)
 * 🟢 可感知 | 🟢 可溯源 | 🟢 可追蹤 | 🟢 可透明驗算 | 🔴 不可篡改
 */

import { IComponentCore, SourceTaxonomy, IEvidenceMap, LifecycleHook } from '../../types/esgss_schema';

// --- IPCC AR6 Definitions ---

/**
 * 📊 IPCC AR6 核心枚舉與常數定義
 */
export enum SSP_Scenario {
  SSP1 = 'Sustainability (Low challenges)',
  SSP2 = 'Middle of the Road',
  SSP3 = 'Regional Rivalry',
  SSP4 = 'Inequality',
  SSP5 = 'Fossil-fueled Development',
}

export type RCP_Level = '1.9' | '2.6' | '4.5' | '7.0' | '8.5';

/**
 * 📊 溫室氣體全球升溫潛勢 (GWP) - IPCC AR6 標準 (100-year)
 */
export const IPCC_AR6_GWP100 = {
  CO2: 1,
  CH4_fossil: 29.8,
  CH4_non_fossil: 27.2,
  N2O: 273,
  SF6: 25200,
  HFC_134a: 1530,
} as const;

/**
 * 📑 ISO-14064-1:2018 盤查類別定義
 */
export enum ISO_14064_Category {
  CAT1 = '直接溫室氣體排放與移除',
  CAT2 = '輸入能源的間接溫室氣體排放',
  CAT3 = '運輸產生的間接溫室氣體排放',
  CAT4 = '組織使用產品產生的間接溫室氣體排放',
  CAT5 = '與使用組織產品相關的間接溫室氣體排放',
  CAT6 = '其他來源的間接溫室氣體排放',
}

// --- Component Interfaces ---

export interface ITRResult {
  company_name: string;
  isin: string;
  temperature_score: number;
  alignment_status: 'Aligned' | 'Not Aligned';
  trajectory_data: {
    year: number;
    emissions: number;
    target_path: number;
  }[];
}

export interface PhysicalRiskResult {
  asset_id: string;
  location: { lat: number; lng: number };
  hazards: {
    hazard_type: 'Flood' | 'Heat' | 'Wildfire' | 'Storm';
    risk_score: number;
    impact_value: number;
  }[];
  scenario: 'RCP4.5' | 'RCP8.5';
  year: 2030 | 2050 | 2100;
}

export interface ICarbonFootprintEvidenceCore {
  category: ISO_14064_Category;
  gas_type: keyof typeof IPCC_AR6_GWP100;
  activity_data: number;
  emission_factor: number;
  gwp_value: number;
  co2e_result: number;
  source_origin: string;
}

// Allow extra properties while keeping core typed
export type ICarbonFootprintEvidence = IEvidenceMap & {
  metrics: ICarbonFootprintEvidenceCore;
};

export type ITR_AR6_Evidence = IEvidenceMap & {
  metrics: {
    temperature_score: number;
    alignment_status: string;
  };
  scenario_matrix: {
    ssp: SSP_Scenario;
    rcp: RCP_Level;
  };
} & Record<string, unknown>;

// --- Core Science Components ---

import { OmniAtom } from '../../0-domain/bases/OmniAtom';
import { IOmniKB, IOmniTag, IOmniComponent, Protocol5T, TrinityComponentState, TrinityTagType } from '../../omni/core/types/InfoOne.types';

/**
 * 🌡️ ITR 升溫路徑組件 (AR6 Compatible)
 */
export class AR6_ITR_Component extends OmniAtom {
  constructor(data: Partial<ITR_AR6_Evidence>) {
    const component: IOmniComponent = {
      id: 'ITR-CORE',
      name: 'ITR Calculation',
      impactMetric: data.metrics?.alignment_status || 'Pending',
      lifecyclePath: ['created'],
      state: TrinityComponentState.READY,
      execute: async (input: any) => input, // Default stub
      cleanup: async () => { }
    };

    const knowledge: IOmniKB = {
      id: 'KB-ITR-AR6',
      content: 'IPCC AR6 Temperature Score Calculation',
      sourceOrigin: 'IPCC_AR6_WG1_Data_Commons',
      formula: 'ITR = Delta_T / Cumulative_Emissions',
      tags: [Protocol5T.TANGIBLE, Protocol5T.TRACEABLE, Protocol5T.TRACKABLE, Protocol5T.TRANSPARENT],
      hashLock: '' // Will be calculated by OmniAtom logic if expanded
    };

    const identity: IOmniTag = {
      id: 'TAG-ITR',
      name: 'ITR-Science',
      type: TrinityTagType.IDENTITY,
      value: data.metrics?.temperature_score || 0,
      createdAt: new Date(),
      protocol: [Protocol5T.TRUSTWORTHY],
      signature: 'TRINITY-SEAL-V1'
    };

    super(component, knowledge, identity, 'AR6-v1.0-2026', 'IPCC_AR6_WG1_Data_Commons');
  }

  public async sync(): Promise<void> {
    // Heart-to-Heart Sync placeholder
    console.log(`[Heart-to-Heart] Syncing ITR component ${this.uuid}`);
  }
}

/**
 * 🌊 PhysRisk 實體風險組件
 */
export class PhysRiskComponent extends OmniAtom {
  constructor() {
    const component: IOmniComponent = {
      id: 'PHYSRISK-CORE',
      name: 'Physical Risk Assessment',
      impactMetric: 'Risk Score calculation',
      lifecyclePath: [],
      state: TrinityComponentState.READY,
      execute: async (input: any) => input,
      cleanup: async () => { }
    };

    const knowledge: IOmniKB = {
      id: 'KB-PHYSRISK',
      content: 'Physical risk assessment based on OS-Climate PhysRisk API',
      sourceOrigin: 'OS-Climate PhysRisk API',
      formula: 'Risk = Hazard * Exposure * Vulnerability',
      tags: [Protocol5T.TANGIBLE, Protocol5T.TRACEABLE, Protocol5T.TRACKABLE, Protocol5T.TRANSPARENT],
      hashLock: ''
    };

    const identity: IOmniTag = {
      id: 'TAG-PHYSRISK',
      name: 'PhysRisk-Science',
      type: TrinityTagType.IDENTITY,
      value: null,
      createdAt: new Date(),
      protocol: [Protocol5T.TRUSTWORTHY],
      signature: 'TRINITY-SEAL-V1'
    };

    super(component, knowledge, identity, '1.0.0', 'OS-Climate PhysRisk API');
  }

  async mapRisk(data: PhysicalRiskResult): Promise<void> {
    const totalImpact = data.hazards.reduce((sum, h) => sum + h.impact_value, 0);
    // Update Trinity members instead of direct evidence manipulation
    this.component = {
      ...this.component,
      impactMetric: `Total Impact: ${totalImpact}`,
      lifecyclePath: [...this.component.lifecyclePath, 'validated']
    };
    this.identity = {
      ...this.identity,
      value: data.hazards
    };
    this.addLifecycleHook('validated', 'PhysRiskEngine');
  }

  public async sync(): Promise<void> {
    console.log(`[Heart-to-Heart] Syncing PhysRisk component ${this.uuid}`);
  }
}

/**
 * 💡 ISO-14064-1 碳足跡轉換引擎
 */
export class CarbonFootprintComponent extends OmniAtom {
  constructor(
    uuid: string,
    data: Omit<ICarbonFootprintEvidenceCore, 'co2e_result' | 'gwp_value'>,
    label: string = 'Carbon Footprint'
  ) {
    const gwp = IPCC_AR6_GWP100[data.gas_type];
    const result = data.activity_data * data.emission_factor * gwp;

    const component: IOmniComponent = {
      id: `CF-${uuid}`,
      name: label,
      impactMetric: `CO2e: ${result}`,
      lifecyclePath: ['created'],
      state: TrinityComponentState.READY,
      execute: async (input: any) => input,
      cleanup: async () => { }
    };

    const knowledge: IOmniKB = {
      id: `KB-CF-${uuid}`,
      content: `Carbon footprint calculation for ${data.gas_type}`,
      sourceOrigin: data.source_origin,
      formula: '[ISO-14064-1:2018] CO2e = AD * EF * GWP(AR6)',
      tags: [Protocol5T.TANGIBLE, Protocol5T.TRACEABLE, Protocol5T.TRACKABLE, Protocol5T.TRANSPARENT],
      hashLock: `CF-${uuid}-${result}`
    };

    const identity: IOmniTag = {
      id: `TAG-CF-${uuid}`,
      name: 'Carbon-Science',
      type: TrinityTagType.IDENTITY,
      value: result,
      createdAt: new Date(),
      protocol: [Protocol5T.TRUSTWORTHY],
      signature: 'TRINITY-SEAL-V1'
    };

    super(component, knowledge, identity, 'ISO14064-AR6-v1.2', data.source_origin);
  }

  public async sync(): Promise<void> {
    console.log(`[Heart-to-Heart] Syncing Carbon component ${this.uuid}`);
  }
}
