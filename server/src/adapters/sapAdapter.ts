// src/adapters/sapAdapter.ts
import { LogicNodeConfig } from '../logics/LogicNode.js';

export interface SAPExportPayload {
  "5T_Export_ID": string;
  ComplianceScore: number;
  LogicNode: string;
  GenerationTime: string;
  TargetSystem: string;
}

export interface AItableExportPayload {
  RecordID: string;
  Score: number;
  LogicName: string;
  Status: string;
  SyncTime: string;
}

// Field mapping from LogicNode to SAP Format
const FIELD_MAP: Record<string, string> = {
  "5T_Export_ID": "5T_Export_ID",
  ComplianceScore: "compliance_score",
  LogicNode: "name",
  GenerationTime: "timestamp",
  TargetSystem: "targetSystem"
};

// Special handling for Type I ANP format
function formatForSAP(nodeConfig: LogicNodeConfig, targetSystem: string): SAPExportPayload {
  return {
    "5T_Export_ID": nodeConfig.name.replace(/[^0-9a-zA-Z-]/g, '~'), // Normalize 5T ID
    ComplianceScore: nodeConfig.compliance_score ?? 0, // Ensure valid score
    LogicNode: nodeConfig.name,
    GenerationTime: new Date().toISOString(),
    TargetSystem: targetSystem
  };
}

export async function exportToSAP(payload: SAPExportPayload): Promise<boolean> {
  console.log(`📤 Exporting to SAP: ${JSON.stringify(payload, null, 2)}`);
  if (payload.ComplianceScore < 0 || payload.ComplianceScore > 1) {
    throw new Error('Compliance score must be between 0 and 1 for Type I ANP');
  }
  return true;
}

// NEW: Generic AItable Export (Supports multiple target tables)
export async function exportToAItable(nodeConfig: LogicNodeConfig): Promise<boolean> {
  console.log(`🚀 Syncing to AItable: ${nodeConfig.name}`);
  
  const payload: AItableExportPayload = {
    RecordID: `AT-${nodeConfig.name.toUpperCase()}`,
    Score: nodeConfig.compliance_score ?? 0,
    LogicName: nodeConfig.name,
    Status: (nodeConfig.compliance_score ?? 0) > 0.8 ? 'Verified' : 'Pending',
    SyncTime: new Date().toISOString()
  };

  console.log(`📤 AItable Payload: ${JSON.stringify(payload, null, 2)}`);
  
  // Simulate AItable REST API call
  // await fetch('https://api.aitable.co/v1/records', { method: 'POST', body: JSON.stringify(payload) });
  
  return true;
}

export const exportAdapter = {
  SAP: exportToSAP,
  AItable: exportToAItable
};

export { formatForSAP, FIELD_MAP };