import { TrustworthyLock } from '../utils/TrustworthyLock.js';
import { EvidenceMetadata } from '../types/omni-report.types.js';
import { OmniUUIDGenerator, OmniEntityPrefix } from '../utils/OmniUUIDGenerator.js';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
import { blockchainAnchor } from '@/omni/services/BlockchainAnchorService.js';

/**
 * 🛡️ Omni Component Core: Evidence Vault Simulator (EvidenceVault)
 * --------------------------------------------------
 * [Protocol] 🛡️ Traceable
 *
 * Core Responsibilities:
 * 1. Simulate WORM (Write Once Read Many) storage
 * 2. Establish file hash storage path and verification mechanisms
 */

export class EvidenceVault {
  // Simulated storage vault (Key: Hash, Value: Metadata)
  private static vault = new Map<string, EvidenceMetadata>();

  /**
   * Deposit evidence (Deposit)
   * Simulates file upload and anchoring
   */
  static async deposit(
    fileContent: any,
    fileName: string,
    mimeType: string,
    sovereignOwnerId?: string,
    sovereignSeal?: string
  ): Promise<EvidenceMetadata> {
    const contentStr = typeof fileContent === 'string' ? fileContent : JSON.stringify(fileContent);
    const hash = await TrustworthyLock.generateHash(contentStr);

    // Check if already exists (Deduplication)
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
      sovereignOwnerId,
      sovereignSeal,
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
   * Retrieve Evidence (Retrieve)
   */
  /**
   * Trigger blockchain anchoring (Mine Block)
   * Pack evidence from Mempool into blocks
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
   * Retrieve Evidence (Retrieve)
   */
  static getByHash(hash: string): EvidenceMetadata | undefined {
    return this.vault.get(hash);
  }

  static async validateIntegrity(hash: string, actualContent: any): Promise<boolean> {
    const currentHash = await TrustworthyLock.generateHash(JSON.stringify(actualContent));
    return currentHash === hash;
  }

  /**
   * Query all evidence (Query All Evidence)
   * Used for UI display of "Evidence Library" list
   */
  static getAllEvidence(): EvidenceMetadata[] {
    return Array.from(this.vault.values()).sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  /**
   * Filter by Witness
   */
  static getByWitness(witness: string): EvidenceMetadata[] {
    return this.getAllEvidence().filter(e => e.witness === witness);
  }

  /**
   * Get by ID
   */
  static getById(id: string): EvidenceMetadata | undefined {
    return Array.from(this.vault.values()).find(e => e.id === id);
  }

  /**
   * Search by filename
   */
  static search(query: string): EvidenceMetadata[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllEvidence().filter(e => e.originalFileName.toLowerCase().includes(lowerQuery));
  }

  /**
   * Link to TruthClaim
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
   * Destroy EvidenceVault (Lifecycle)
   */
  static destroy(): void {
    this.vault.clear();
    omniLogger.info(LogCategory.SYSTEM, 'EvidenceVault destroyed (memory cleared)');
  }
}
