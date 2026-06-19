import type { SealedData } from '../utils/TrustworthyLock.ts';

/**
 * 💡 Omni-Core: Sustainable Reporting Path Core Types
 * --------------------------------------------------
 * [Protocol] 5T Sentinel Protocol (Traceable, Trackable, Transparent, Tangible, Trustworthy)
 */

/**
 * 4+1 (5T) Protocol Real-time Status Switches
 */
export type OmniSource =
  | 'LOG'
  | 'NOTE'
  | 'CALENDAR'
  | 'TASK'
  | 'TODO'
  | 'YUANTONG'
  | 'EMOTIONAL'
  | 'STEWARDSHIP'
  | 'NEBULA';

export interface ComplianceProtocolStatus {
  traceable: 'pending' | 'active' | 'success' | 'error'; // 🟢 Traceable (T1)
  trackable: 'pending' | 'active' | 'success' | 'error'; // 🔵 Trackable (T2)
  transparent: 'pending' | 'active' | 'success' | 'error'; // 🟠 Transparent/Calculable (T3)
  tangible: 'pending' | 'active' | 'success' | 'error'; // 🟣 Tangible/Crystallized (T4)
  trustworthy: 'pending' | 'active' | 'success' | 'error'; // 🔴 Trustworthy (T5)
}

/**
 * GRI Machine-Readable Indicator Definition
 */
export interface GRIIndicator {
  id: string;
  code: string; // e.g., "GRI 305-1"
  topic: string; // e.g., "Direct (Scope 1) GHG Emissions"
  standard: 'GRI' | 'SASB' | 'CSRD' | 'TCFD';
  validationRules: {
    requiredFields: string[];
    unitCheck: string[];
    logicDescription: string; // AI/Machine understandable calculation logic
  };
  complianceLogic: {
    formulaRef?: string; // e.g., "IPCC-AR6"
    hasEvidenceHook: boolean;
  };
}

/**
 * Evidence Metadata
 */
export interface EvidenceMetadata {
  id: string; // EV-UUID
  fileHash: string; // SHA-256
  vaultPath: string; // S3/IPFS path
  originalFileName: string;
  mimeType: string;
  uploadedAt: string;
  witness: 'System' | 'Manual' | 'Blockchain';
  linkedTruthClaims?: string[]; // Array of TC-UUIDs
  blockchainTxHash?: string; // e.g., 0x... (Merkle Root or Block Hash)
  blockHeight?: number;
  merkleProof?: string[];
  sovereignOwnerId?: string;
  sovereignSeal?: string;
}

/**
 * 💡 Native Crystal DNA - V2 Schema
 * --------------------------------------------------
 * Data is no longer transported, but "Field Resonance".
 */
export interface ICrystalDNA {
  uuid: string;
  genesis_timestamp: number;
  nature: {
    intent: 'ESSENCE' | 'EVIDENCE' | 'ACTION' | 'INSIGHT'; // Essence: Intent / Evidence / Action / Insight
    domain: 'ENVIRONMENT' | 'SOCIAL' | 'GOVERNANCE' | 'SENTIENCE';
    dnaMarkers: string[]; // e.g., ["SDG13", "G4-EN3"]
  };
  resonance: {
    visibility: 'OMNI';
    integrityLevel: number; // 0-100
    isLocked: boolean;
    resonanceLevel: number; // 0-100 (Quantum sync level)
  };
  payload: {
    narrative: string;
    quantitative: number;
    evidenceVault: string;
    tangibleLabel?: string; // [T4] Tangible Label for UI presentation
  };
  hashLock?: string;
}

/**
 * Core Fact DataPoint
 */
export interface ESGDataPoint {
  uuid: string;
  indicatorId: string;
  value: number;
  unit: string;
  version: string;
  sourceOrigin: string;
  omniSource?: OmniSource; // Deep tool mapping
  crystalRefId?: string; // Reference to Omni-Crystal
  dna?: ICrystalDNA; // V2 Native DNA
  currentStatus: ComplianceProtocolStatus;
  evidenceLinks: string[];
  hashLock?: string; // SHA-256 for Trustworthy seal
}

/**
 * Chained Ledger Entry (Encapsulated)
 */
export interface ChainedDataBlock extends SealedData<ESGDataPoint> {
  parentHash: string | null; // [Trackable] Pointing to previous data hash
}

/**
 * Report Automation Pipeline Task Status
 */
export interface ReportPipelineTask {
  taskId: string; // RP-UUID
  year: number;
  progress: number; // 0 - 100
  currentNode: 'ingest' | 'audit' | 'narrative' | 'render' | 'seal';
  protocolSummary: ComplianceProtocolStatus;
  auditLogs: {
    timestamp: string;
    level: 'info' | 'success' | 'warning' | 'error';
    message: string;
  }[];
}
