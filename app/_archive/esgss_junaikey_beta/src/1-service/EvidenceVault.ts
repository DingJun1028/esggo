import { TrustworthyLock } from '../utils/TrustworthyLock';
import { EvidenceMetadata } from '@/types/omni-report.types';
import { OmniUUIDGenerator, OmniEntityPrefix } from '../utils/OmniUUIDGenerator';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { blockchainAnchor } from './BlockchainAnchorService';

/**
 * 💡 智能組件心核：證據庫模擬器 (EvidenceVault)
 * --------------------------------------------------
 * [協議] T2 可溯源 (Traceable)
 *
 * 主要職責：
 * 1. 模擬 WORM (Write Once Read Many) 存儲
 * 2. 建立文件與其儲存路徑的映射關係
 */

export class EvidenceVault {
  // 模擬存儲區 (Key: Hash, Value: Metadata)
  private static vault = new Map<string, EvidenceMetadata>();

  /**
   * 存入證據 (Deposit)
   * 模擬文件上傳並鎖定雜湊值
   */
  static async deposit(
    fileContent: any,
    fileName: string,
    mimeType: string
  ): Promise<EvidenceMetadata> {
    const contentStr = typeof fileContent === 'string' ? fileContent : JSON.stringify(fileContent);
    const hash = await TrustworthyLock.generateHash(contentStr);

    // 檢查是否已存在 (去重)
    if (this.vault.has(hash)) {
      omniLogger.info(LogCategory.KNOWLEDGE, `Evidence vault hit for existing hash: ${hash}`);
      return this.vault.get(hash)!;
    }

    const metadata: EvidenceMetadata = {
      id: OmniUUIDGenerator.generate(OmniEntityPrefix.EVIDENCE),
      fileHash: hash,
      vaultPath: `s3://esgss-evidence-vault/${hash}/${fileName}`,
      originalFileName: fileName,
      mimeType,
      uploadedAt: new Date().toISOString(),
      witness: 'System',
    };

    this.vault.set(hash, metadata);

    // [Blockchain Integration] Add to Mempool
    blockchainAnchor.addToMempool(hash);

    omniLogger.info(LogCategory.KNOWLEDGE, `Evidence successfully deposited: ${metadata.id}`, {
      hash,
      blockchain: 'added_to_mempool',
    });

    return metadata;
  }

  /**
   * 取得證據 (Retrieve)
   */

  /**
   * 獲取證據 (Retrieve)
   */
  /**
   * 觸發區塊鏈錨定 (Mine Block)
   * 將 Mempool 中的證據打包成區塊
   */
  static async triggerAnchor(): Promise<number> {
    const block = await blockchainAnchor.mineBlock();
    if (block) {
      // Update metadata for all transactions in this block
      block.transactions.forEach(hash => {
        const evidence = this.vault.get(hash);
        if (evidence) {
          evidence.witness = 'Blockchain';
          evidence.blockchainTxHash = block.hash; // In this sim, we use Block Hash as the "Tx Hash" ref
          evidence.blockHeight = block.height;
          // In a real system we would store the specific Merkle Proof here too
          const verification = blockchainAnchor.verifyTransaction(hash);
          if (verification.verified && verification.proof) {
            evidence.merkleProof = verification.proof;
          }
          this.vault.set(hash, evidence);
        }
      });
      return block.transactions.length;
    }
    return 0;
  }

  /**
   * 獲取證據 (Retrieve)
   */
  static getByHash(hash: string): EvidenceMetadata | undefined {
    return this.vault.get(hash);
  }

  static async validateIntegrity(hash: string, actualContent: any): Promise<boolean> {
    const currentHash = await TrustworthyLock.generateHash(JSON.stringify(actualContent));
    return currentHash === hash;
  }

  /**
   * 查詢所有證據 (Query All Evidence)
   * 用於 UI 顯示「佐證庫」列表
   */
  static getAllEvidence(): EvidenceMetadata[] {
    return Array.from(this.vault.values()).sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  /**
   * 按用戶篩選 (Filter by Witness)
   */
  static getByWitness(witness: string): EvidenceMetadata[] {
    return this.getAllEvidence().filter(e => e.witness === witness);
  }

  /**
   * 按 ID 查詢 (Get by ID)
   */
  static getById(id: string): EvidenceMetadata | undefined {
    return Array.from(this.vault.values()).find(e => e.id === id);
  }

  /**
   * 搜尋 (Search by filename)
   */
  static search(query: string): EvidenceMetadata[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllEvidence().filter(e => e.originalFileName.toLowerCase().includes(lowerQuery));
  }

  /**
   * 與 TruthClaim 關聯 (Link to TruthClaim)
   */
  static linkToTruth(evidenceId: string, truthClaimId: string): void {
    const evidence = this.getById(evidenceId);
    if (evidence) {
      // Add linkedTruthClaims property dynamically
      const mutableEvidence = evidence as EvidenceMetadata & { linkedTruthClaims?: string[] };
      if (!mutableEvidence.linkedTruthClaims) {
        mutableEvidence.linkedTruthClaims = [];
      }
      if (!mutableEvidence.linkedTruthClaims.includes(truthClaimId)) {
        mutableEvidence.linkedTruthClaims.push(truthClaimId);
        omniLogger.info(
          LogCategory.KNOWLEDGE,
          `Evidence ${evidenceId} linked to Truth ${truthClaimId}`
        );
      }
    }
  }

  /**
   * 銷毀 EvidenceVault (Lifecycle)
   */
  static destroy(): void {
    this.vault.clear();
    omniLogger.info(LogCategory.SYSTEM, 'EvidenceVault destroyed (memory cleared)');
  }
}
