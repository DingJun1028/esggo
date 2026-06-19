/**
 * 🔗 Blockchain Anchor Service
 * --------------------------------------------------
 * [Function] Hash ESG data and anchor to blockchain (Immutable Protocol)
 * [Role] Ensure data immutability and audit evidence
 */

import { v4 as uuidv4 } from 'uuid';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
import { IBlockchainService, IBlockchainAnchorResult, IAnchorMetadata } from '@/types/blockchain.js';

export class BlockchainAnchorService implements IBlockchainService {
  private static instance: BlockchainAnchorService;

  private constructor() {}

  public static getInstance(): BlockchainAnchorService {
    if (!BlockchainAnchorService.instance) {
      BlockchainAnchorService.instance = new BlockchainAnchorService();
    }
    return BlockchainAnchorService.instance;
  }

  /**
   * Calculate data hash (SHA-256 simulation)
   */
  private async calculateHash(data: any): Promise<string> {
    const msgUint8 = new TextEncoder().encode(JSON.stringify(data));
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `0x${hashHex}`;
  }

  /**
   * Anchor data to blockchain (Simulated mode)
   */
  async anchorAsset(data: any, metadata: IAnchorMetadata): Promise<IBlockchainAnchorResult> {
    const trace_id = uuidv4();
    const dataHash = await this.calculateHash(data);

    omniLogger.info(LogCategory.SEC, `Starting blockchain anchoring: ${metadata.contentType}`, {
      trace_id,
      source_id: metadata.sourceId,
      data_hash: dataHash,
      source_origin: 'BlockchainAnchorService.anchorAsset',
    });

    // Simulate blockchain transaction delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result: IBlockchainAnchorResult = {
      status: 'anchored (simulated)',
      txHash: `0x${uuidv4().replace(/-/g, '')}${uuidv4().replace(/-/g, '')}`,
      explorerUrl: `https://etherscan.io/tx/simulated-${uuidv4()}`,
      timestamp: Date.now(),
    };

    omniLogger.info(LogCategory.SEC, `Blockchain anchoring complete`, {
      trace_id,
      tx_hash: result.txHash,
      status: result.status,
      source_origin: 'BlockchainAnchorService.anchorAsset',
    });

    // Log to local DB (Simulated)
    await this.logToDb(dataHash, result.txHash, result.status);

    return result;
  }

  /**
   * anchorHash method required by interface
   */
  async anchorHash(hash: string, metadata?: Record<string, any>): Promise<IBlockchainAnchorResult> {
    return this.anchorAsset(
      { hash },
      {
        contentType: 'audit_log',
        sourceId: metadata?.sourceId || 'manual',
        operator: metadata?.operator || 'system',
      }
    );
  }

  /**
   * Log transaction to audit log
   */
  async logToDb(dataHash: string, txHash: string, status: string): Promise<void> {
    // In 4+1 Protocol, this step usually writes to Immutable Store
    omniLogger.info(LogCategory.SEC, 'Anchoring record synced to audit library', {
      data_hash: dataHash,
      tx_hash: txHash,
      status,
      source_origin: 'BlockchainAnchorService.logToDb',
    });
  }
}

export const blockchainAnchorService = BlockchainAnchorService.getInstance();
