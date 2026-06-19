/** 💎 奧秘晶體資產 (Omni-Crystal Asset) */
export interface IOmniCrystal {
  crystalId: string;
  purity: number; // 0.0 - 1.0 (Based on evidence quality)
  dimensionalAnchor: string; // 錨定維度 (e.g., ESG, RPG, AI)
  timestamp: number;
}

/** 🏛️ 證據金庫服務介面 */
export interface IEvidenceVaultService {
  anchorEvidence(componentId: string, evidenceData: any): Promise<string>; // Returns hash_lock
  generateCrystal(evidenceHash: string): IOmniCrystal;
}
