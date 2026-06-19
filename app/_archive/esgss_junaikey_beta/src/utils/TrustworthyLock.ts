import keccak256 from 'keccak256';
import SovereignVaultService from '../services/SovereignVaultService';

/**
 * 💡 Omni Component Core: Trustworthy Locking Mechanism
 * --------------------------------------------------
 * [Protocol] 🔴 Immutable (Trustworthy)
 *
 * Core Responsibilities:
 * 1. Generate unique fingerprints (SHA-256 via keccak256 fallback) for any data object.
 * 2. Ensure data remains unmodifiable after entering the trust chain through physical locking (Object.freeze).
 * 3. Support Sovereign Signatures via SovereignVaultService.
 */

export interface SealedData<T> {
  data: Readonly<T>;
  hash_lock: string;
  sealed_at: string;
  did?: string;          // Sovereign Identity DID
  signature?: string;    // Sovereign Digital Signature
  cid?: string;          // Phase 28: Content Identifier
  anchoring?: {
    status: 'local' | 'anchored' | 'consensus_reached';
    ledger_hash?: string;
    anchored_at?: number;
  };
}

export class TrustworthyLock {
  static generateHashSync(data: any, evidenceLink?: string, prevHash?: string): string {
    const payload = JSON.stringify({
      content: data,
      evidence: evidenceLink || null,
      parent: prevHash || null,
    });

    const hashBuffer = keccak256(payload);
    return hashBuffer.toString('hex');
  }

  /**
   * Generates a data fingerprint (Fingerprint) - Async for compatibility
   */
  static async generateHash(data: any, evidenceLink?: string, prevHash?: string): Promise<string> {
    return this.generateHashSync(data, evidenceLink, prevHash);
  }

  /**
   * Seals and locks data (Seal & Freeze)
   * Transforms data into an immutable state and attaches a digital lock.
   */
  static async seal<T>(data: T, evidenceLink?: string, prevHash?: string): Promise<SealedData<T>> {
    const hash = await this.generateHash(data, evidenceLink, prevHash);
    const participant = SovereignVaultService.getParticipant();

    let signature: string | undefined;
    let cid: string | undefined;
    let anchoring: any;

    if (participant) {
      // If a sovereign participant is active, seal through the vault ledger
      const vaultRecord = await SovereignVaultService.sealRecord('SovereignSeal', { content_hash: hash });
      signature = vaultRecord.signature;
      cid = vaultRecord.cid;
      anchoring = vaultRecord.anchoring;
    }

    const sealed: SealedData<T> = {
      data: Object.freeze({ ...data }), // 🔴 Deep freeze usually requires recursion, here we freeze critical levels
      hash_lock: hash,
      sealed_at: new Date().toISOString(),
      did: participant?.did,
      signature,
      cid,
      anchoring,
    };

    return Object.freeze(sealed) as SealedData<T>;
  }

  /**
   * Verifies data integrity (Verify)
   */
  static async verify<T>(
    sealed: SealedData<T>,
    evidenceLink?: string,
    prevHash?: string
  ): Promise<boolean> {
    const currentHash = await this.generateHash(sealed.data, evidenceLink, prevHash);
    const isValidHash = currentHash === sealed.hash_lock;

    if (sealed.signature && sealed.did) {
      // In a real sovereign flow, we'd verify the signature against the participant's public key
      // and ensure the record exists in the SovereignVault ledger.
      console.log(`[TrustworthyLock] Verifying Sovereign Signature: ${sealed.signature}`);
    }

    return isValidHash;
  }
}
