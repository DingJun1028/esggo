import { useESGStore } from '@/store/useESGStore.js';
import { v4 as uuidv4 } from 'uuid';
import { keccak256, toUtf8Bytes } from 'ethers';

import { ITalentAsset } from '@/types/esgss_schema.js';

/**
 * 🏛️ Truth Bundle Service (Audit Integrity Layer)
 * --------------------------------------------------
 * [Responsibility] Aggregates live ESG metrics and anchor history into a signed bundle.
 * [Feature] Immutable proof, self-contained audit data, cryptographically linked.
 */

export interface TruthBundle {
  bundleId: string;
  version: string;
  timestamp: string;
  metrics: {
    totalCO2e: number;
    itEnergyKWh: number;
    anchoredCount: number;
  };
  anchors: any[];
  talentAssets?: ITalentAsset[]; // M10: Talent Assets Inclusion
  signature: string;
  previousBundleHash?: string; // Link to previous bundle for chain continuity
}

export const TruthBundleService = {
  /**
   * Generates a verifiable data bundle from the current store state.
   * @param talentAssets Optional talent assets to include in the bundle (M3/M10)
   */
  generateBundle(talentAssets: ITalentAsset[] = []): TruthBundle {
    const state = useESGStore.getState();
    const bundleId = `UTB-${uuidv4().substring(0, 8).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    // payload to sign
    const payload = {
      bundleId,
      version: '2.0.0-gtx', // Upgraded version for M10
      timestamp,
      metrics: {
        totalCO2e: state.totalCO2e,
        itEnergyKWh: state.itEnergyKWh,
        anchoredCount: state.anchoredCount,
      },
      anchors: state.recentAnchors,
      talentAssets, // Include Talent Assets
    };

    // Canonical JSON stringify using recursive key sorting
    const dataToSign = JSON.stringify(TruthBundleService.sortObject(payload));

    // Real Cryptographic Hash (Keccak256)
    // In a real scenario, this would be signed by a private key (wallet).
    // For now, we hash the content to ensure integrity (Proof of Existence).
    const signature = keccak256(toUtf8Bytes(dataToSign));

    return {
      ...payload,
      signature,
    };
  },

  /**
   * M10: Generates a CSV export for Talent Assets
   */
  generateTalentCSV(assets: ITalentAsset[]): string {
    const headers = [
      'TalentID',
      'Name',
      'Tags',
      'WangDaoScore(TVI)',
      'CarbonReduction(tCO2e)',
      'VerificationStatus',
      'Hash',
    ];
    const rows = assets.map(asset => [
      asset.id,
      asset.name,
      `"${asset.tags.join(', ')}"`, // Escape commas in tags
      asset.tvi.toFixed(2),
      asset.carbonReduction.toFixed(2),
      asset.verificationStatus,
      asset.hash || 'N/A',
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  },

  /**
   * Verifies the integrity of a Truth Bundle.
   * Re-calculates the hash and compares it with the signature.
   */
  verifyBundle(bundle: TruthBundle): boolean {
    const { signature, ...payload } = bundle;

    // Re-construct the data string using the same canonical sort order
    const dataToVerify = JSON.stringify(TruthBundleService.sortObject(payload));
    const calculatedHash = keccak256(toUtf8Bytes(dataToVerify));

    return calculatedHash === signature;
  },

  /**
   * Helper to recursively sort object keys for canonical stringification.
   */
  sortObject(obj: any): any {
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
      // Arrays are not sorted by index, but their elements might need sorting if they are objects?
      // For TruthBundle, anchors is an array of objects. We should map sortObject over it.
      if (Array.isArray(obj)) {
        return obj.map(TruthBundleService.sortObject);
      }
      return obj;
    }
    return Object.keys(obj)
      .sort()
      .reduce((result: any, key) => {
        result[key] = TruthBundleService.sortObject(obj[key]);
        return result;
      }, {});
  },

  /**
   * Triggers a browser download for the generated bundle.
   */
  downloadBundle(bundle: TruthBundle) {
    const fileName = `OmniTruthBundle_${bundle.bundleId}.json`;
    const json = JSON.stringify(bundle, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  },

  /**
   * Anchors the bundle's signature to the blockchain via TrustSystem.
   */
  async anchorBundle(bundle: TruthBundle) {
    if (!this.verifyBundle(bundle)) {
      throw new Error('Invalid bundle signature. Cannot anchor.');
    }

    // Dynamically import to avoid circular dependencies if any, or just standard import at top
    const { TrustSystem } = await import('./TrustSystem');

    return await TrustSystem.anchorHash(bundle.signature, {
      bundleId: bundle.bundleId,
      version: bundle.version,
      timestamp: Date.now(),
    });
  },
};
