import * as crypto from 'crypto';

import { IEvidenceVaultService } from '../../0-domain/contracts/IEvidenceVault.ts';

import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';
import { IOmniCrystal } from '../../types/esgss_schema.ts';
import { PersonalSettings } from '../../types/omni/index.ts';



/**
 * 🔐 EvidenceVaultService: Trust Anchor (Level 4)
 * --------------------------------------------------
 * Manages SHA-256 anchoring and Omni-Crystal generation.
 * 貫徹「永恆刻印」原則：確保證據不可篡改
 */
export class EvidenceVaultService {
  /**
   * Anchors the current state into a SHA-256 hash.
   * Simulates blockchain anchoring (e.g., IOTA/Ethereum).
   * 支援 Node.js 與瀏覽器環境
   */
  async anchorEvidence(uuid: string, state: any): Promise<string> {
    omniLogger.debug(LogCategory.VALIDATION, `[EvidenceVault] Anchoring evidence for ${uuid}...`);

    const payload = JSON.stringify(state);

    try {
      // Node.js 環境
      if (typeof crypto !== 'undefined' && crypto.createHash) {
        return crypto.createHash('sha256').update(payload).digest('hex');
      }

      // 瀏覽器環境 (Web Crypto API)
      const msgUint8 = new TextEncoder().encode(payload);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      omniLogger.debug(LogCategory.VALIDATION, `[EvidenceVault] ⚓ Anchored Hash: ${hashHex.substring(0, 16)}...`);
      return hashHex;
    } catch (e) {
      // 嚴格模式下不允許 mock 回退，拋出錯誤
      omniLogger.error(LogCategory.VALIDATION, '[EvidenceVault] Critical: Hash anchoring failed', e);
      throw new Error('[EvidenceVault] SHA-256 anchoring failed: Crypto API unavailable');
    }
  }

  /**
   * Generates the Omni-Crystal asset based on the anchor.
   * 返回不可變物件，確保「永恆刻印」完整性
   */
  generateCrystal(anchorHash: string, settings?: PersonalSettings): Readonly<IOmniCrystal> {
    // Deterministic crystal generation based on hash
    const purity = parseInt(anchorHash.substring(0, 2), 16) / 255;

    const crystal: IOmniCrystal = {
      id: `CRYSTAL-${anchorHash.substring(0, 8).toUpperCase()}`,
      hash: anchorHash,
      purity: parseFloat(purity.toFixed(4)),
      formationTime: Date.now(),
      generation: 1,
      ownerUuid: 'SYSTEM', // This should be updated by Core if needed
      personalSettings: settings
    };

    return Object.freeze(crystal);
  }
}
