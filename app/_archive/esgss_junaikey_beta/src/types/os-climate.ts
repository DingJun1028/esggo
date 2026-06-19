/**
 * OS-Climate Open Source Data Protocol Integration
 * --------------------------------------------------
 * Mapping standard OS-Climate entities to the "4+1 Protocol" (3-Ke-1-Bu-Ke).
 */

import { IntegrityStatus, UUID } from '../omni/infrastructure/types/Omni-component-core.types';

// 🏛️ 1. Data Commons (Data Mesh)
export interface IDataCommonsRecord {
  id?: UUID; // Optional, auto-generated if missing
  entityName: string; // Company Name or Asset ID
  sector?: string;
  region?: string;
  reportingYear?: number;
  // Data Commons uses standard logical models
  data: {
    scope1: number; // Changed from scope1_emissions to scope1 to match user example
    scope2: number;
    scope3: number;
  };
  meta: {
    source_url: string; // Traceable: Path to PDF/Web
    page_number: number;
    extraction_method?: 'NLP_AUTOMATED' | 'MANUAL_VERIFIED';
  };
}

// 🏛️ 2. Portfolio Alignment (ITR)
// Implied Temperature Rise
export interface IITRResult {
  companyId: UUID;
  temperatureScore: number; // e.g., 1.8°C
  targetYear: number;
  pathway: '1.5C_Aligned' | '2.0C_Aligned' | 'Misaligned';
  methodology: 'SBTi' | 'TPI' | 'OS-C_ITR';
}

// 🏛️ 3. Physical Risk (PhysRisk)
export interface IPhysRiskAssessment {
  assetId: UUID;
  hazardType: 'FLOOD' | 'DROUGHT' | 'HEATWAVE' | 'WILDFIRE';
  riskScore: number; // 0-100
  timeline: '2030' | '2050';
  scenario: 'RCP2.6' | 'RCP8.5';
}

// 🏛️ 4. Transition Analysis (WITNESS)
export interface IWitnessScenario {
  scenarioId: UUID;
  name: string; // e.g. "NGFS Net Zero 2050"
  parameters: {
    carbonPrice: number; // USD/ton
    techAdoptionRate: number;
  };
  impactOnRevenue: number; // % change
  competitivenessScore: number; // 0-100
}

/**
 * 4+1 Protocol Wrapper for OS-Climate Data
 */
export interface IOSClimatePacket<T> {
  core: {
    uuid: UUID;
    timestamp: number;
  };
  payload: T;
  protocol: {
    traceable: {
      origin: string; // Data Commons Source
      metadata_pointer: string;
    };
    trackable: {
      process_log: string[]; // WITNESS Hooks
    };
    calculable: {
      formula_ref: string; // ITR/ISO-14064 reference
      is_verified: boolean;
    };
    immutable: {
      hash_lock: string;
      is_frozen: boolean;
    };
  };
}
