export interface IComponentCore {
  uuid: string;
  version: string;
  timestamp: number;
  evidence?: any;
}

/**
 * 5T Evidence Mapping for Framework Disclosures
 */
export interface IEvidenceMap5T {
  disclosureId: string; // e.g., "GRI-305-1"
  intelNodeId: string;  // ID from intelHub
  verifiedAt: string;
  trustScore: number;   // 0-100 based on consensus
}

export interface IIntelNode5T extends IComponentCore {
  category: "S1" | "S2" | "S3" | "S4" | "S5";
  impact_level: 1 | 2 | 3 | 4 | 5;
  protocol_5T: {
    tangible: boolean;   // 🟣 美 (Tasteful) - Tangible (可感知)
    traceable: string;  // 🟢 真 (Truthful) - Traceable (可溯源)
    trackable: string[]; // 🔵 通 (Transferful) - Trackable (可追蹤)
    transparent: string; // 🟠 善 (Thankful) - Transparent (可透明)
    trustworthy: string; // 🔴 信 (Trustful) - Trustworthy (不可篡改)
  };
  payload: {
    title: string;
    decision_ready_insight: string;
    target_entities: string[];
  };
  evidenceMap?: IEvidenceMap5T;
}
