import { createHash } from 'crypto';
import { omniLogger, LogCategory } from './omni/infrastructure/logging/OmniLogger.js';

export interface ImpactAnchor {
    txId: string;
    timestamp: number;
    contentHash: string;
    status: 'PENDING' | 'ANCHORED' | 'VERIFIED';
}

/**
 * Phase 47: 分布式信任 (Distributed Trust)
 * Anchors 5T-validated data packets to an immutable ledger (simulated).
 */
export class ImpactLedgerService {
    private anchors: Map<string, ImpactAnchor> = new Map();

    /**
     * Anchors a piece of data to the ledger.
     */
    public anchorData(data: any): ImpactAnchor {
        const timestamp = Date.now();
        const content = JSON.stringify(data);
        const contentHash = createHash('sha256').update(content).digest('hex');
        const txId = `TX-${createHash('md5').update(contentHash + timestamp).digest('hex').slice(0, 12).toUpperCase()}`;

        const anchor: ImpactAnchor = {
            txId,
            timestamp,
            contentHash,
            status: 'ANCHORED'
        };

        this.anchors.set(txId, anchor);
        omniLogger.info(LogCategory.SYSTEM, `[ImpactLedger] Data anchored: ${txId} | Hash: ${contentHash.slice(0, 8)}...`);

        return anchor;
    }

    public verifyImpact(txId: string): ImpactAnchor | null {
        const anchor = this.anchors.get(txId);
        if (anchor) {
            anchor.status = 'VERIFIED';
            omniLogger.info(LogCategory.SYSTEM, `[ImpactLedger] Impact verified: ${txId}`);
            return anchor;
        }
        return null;
    }

    public getLatestAnchors(limit: number = 5): ImpactAnchor[] {
        return Array.from(this.anchors.values())
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    }
}

export const impactLedgerService = new ImpactLedgerService();
