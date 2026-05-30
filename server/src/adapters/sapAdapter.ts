// src/adapters/sapAdapter.ts
import { LogicNodeConfig } from '../logics/LogicNode.js';

export interface SAPExportPayload {
  "5T_Export_ID": string;
  ComplianceScore: number;
  LogicNode: string;
  GenerationTime: string;
  TargetSystem: string;
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
  // Simulating SAP export - in production, this would call SAP APIs
  console.log(`📤 Exporting to SAP: ${JSON.stringify(payload, null, 2)}`);
  
  // Validate score range (Type I ANP compliance)
  if (payload.ComplianceScore < 0 || payload.ComplianceScore > 1) {
    throw new Error('Compliance score must be between 0 and 1 for Type I ANP');
  }
  
  // Simulate successful export
  return true;
}

export { formatForSAP, FIELD_MAP };