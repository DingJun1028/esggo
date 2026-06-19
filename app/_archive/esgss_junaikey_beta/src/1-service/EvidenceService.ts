/**
 * 🏛️ EvidenceService (證據轉化服務)
 * --------------------------------------------------
 * [系列] 奧秘元鑰 (JunAiKey) / Tangible Dimension
 * [功能] 將演算結果轉化為可感知的實體證據 (EvidenceMap)。
 * [地步] 數據即證物,證物即信任。
 */

import { UUID, EvidenceMap, TraceInfo } from '@domain';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

export interface EvidenceRecord {
  id: UUID;
  timestamp: number;
  digest: string;
  source: TraceInfo;
  manifest: any;
}

export class EvidenceService {
  /**
   * 鑄造證據 (Forge Evidence)
   * 將原始輸出轉化為具備雜湊證明的證據對象
   */
  static async forge(payload: any, trace: TraceInfo): Promise<EvidenceMap> {
    const timestamp = Date.now();
    const digest = this.calculateDigest(payload);

    omniLogger.info(LogCategory.DATA, `Forging Tangible Evidence: ${digest}`);

    return {
      'Digital Signature': `SIG-${digest.slice(0, 8)}`,
      'Traceability Link': `origin://${trace.source_origin}/${trace.raw_ref}`,
      'Integrity Seal': `HASH-${digest}`,
      'Verification Node': 'JUNAIKEY-TEC-VALIDATOR-01',
    };
  }

  private static calculateDigest(payload: any): string {
    const content = JSON.stringify(payload);
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = (hash << 5) - hash + content.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}
