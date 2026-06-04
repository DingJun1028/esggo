/**
 * Blockchain Provider
 * 實作 T5 (Trustworthy) 核心存證邏輯
 */
import { BlockchainTxHash, ContentHash } from '../../shared/types/evidence.types';
export interface BlockchainAnchorResult {
    tx_hash: BlockchainTxHash;
    timestamp: Date;
    network: string;
}
export declare class BlockchainProvider {
    /**
     * 將雜湊錨定至區塊鏈 (T5)
     * 這裡為虛擬實作，可介接 Ethereum, Polygon 或專屬私有鏈
     */
    anchorHash(hash: ContentHash): Promise<BlockchainAnchorResult>;
    /**
     * 驗證區塊鏈上的交易
     */
    verifyAnchor(txHash: BlockchainTxHash, expectedHash: ContentHash): Promise<boolean>;
}
export declare const blockchainProvider: BlockchainProvider;
//# sourceMappingURL=blockchain.d.ts.map