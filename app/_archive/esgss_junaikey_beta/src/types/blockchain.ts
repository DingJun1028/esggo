export interface IBlockchainAnchorResult {
  status: 'anchored' | 'anchored (simulated)' | 'pending' | 'failed';
  txHash: string;
  explorerUrl: string;
  sourceId?: string;
  metadata?: IAnchorMetadata;
  timestamp?: number;
}

export interface IBlockchainService {
  anchorHash(hash: string, metadata?: Record<string, any>): Promise<IBlockchainAnchorResult>;
  logToDb(dataHash: string, txHash: string, status: string): Promise<void>;
}

export interface IAnchorMetadata {
  contentType: 'carbon_asset' | 'audit_log' | 'system_state';
  sourceId: string;
  operator: string;
}
