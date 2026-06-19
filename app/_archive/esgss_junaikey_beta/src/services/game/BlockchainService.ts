/**
 * ⛓️ 區塊鏈服務 - Blockchain Service
 * 
 * 功能：
 * - 交易哈希生成
 * - Hash Lock 機制
 * - 數位簽章
 * - 不可篡改驗證
 */

import { CryptoJS } from '@/services/ceremony/core/IComponentCore';

interface BlockData {
  previousHash?: string;
  timestamp: string;
  data: Record<string, unknown>;
  nonce?: number;
}

interface Transaction {
  id: string;
  type: 'evidence' | 'certification' | 'mint' | 'verification';
  data: Record<string, unknown>;
  hash: string;
  previousHash: string;
  timestamp: string;
  signature?: string;
}

export class BlockchainService {
  private chain: Transaction[] = [];
  private difficulty: number = 2;

  constructor() {
    // 初始化創世區塊
    this.createGenesisBlock();
  }

  private createGenesisBlock(): void {
    const genesisBlock: Transaction = {
      id: '0',
      type: 'mint',
      data: { message: 'ESGss JunAiKey Genesis - 善向永續村創世區塊' },
      hash: this.generateHash({
        previousHash: '0',
        timestamp: new Date().toISOString(),
        data: { message: 'Genesis' }
      }),
      previousHash: '0',
      timestamp: new Date().toISOString()
    };
    this.chain.push(genesisBlock);
  }

  // 生成交易 ID
  generateTransactionId(): string {
    return `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // 生成哈希
  generateHash(data: BlockData | Record<string, unknown>): string {
    const blockString = JSON.stringify(data);
    return CryptoJS.SHA256(blockString).toString();
  }

  // 創建新交易
  createTransaction(
    type: Transaction['type'],
    data: Record<string, unknown>
  ): Transaction {
    const previousHash = this.chain.length > 0
      ? this.chain[this.chain.length - 1].hash
      : '0';

    const transaction: Transaction = {
      id: this.generateTransactionId(),
      type,
      data,
      previousHash,
      timestamp: new Date().toISOString(),
      hash: this.generateHash({
        previousHash,
        timestamp: new Date().toISOString(),
        data
      })
    };

    this.chain.push(transaction);
    return transaction;
  }

  // 生成數位簽章
  async generateSignature(data: string | Record<string, unknown>): Promise<string> {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);

    // 模擬簽章（使用 CryptoJS HMAC）
    const signature = CryptoJS.HmacSHA256(
      dataString,
      process.env.BLOCKCHAIN_SECRET || 'ESGSS-JUNAIKEY'
    ).toString();

    return `0x${signature}`;
  }

  // 驗證簽章
  async verifySignature(
    data: string | Record<string, unknown>,
    signature: string
  ): Promise<boolean> {
    const expectedSignature = await this.generateSignature(data);
    return signature === expectedSignature;
  }

  // Hash Lock 鎖定
  async createHashLock(data: Record<string, unknown>): Promise<string> {
    const hash = this.generateHash({
      ...data,
      salt: Math.random().toString(36).substr(2),
      timestamp: Date.now()
    });

    // 創建鎖定交易
    this.createTransaction('evidence', {
      type: 'hash_lock',
      lockedHash: hash,
      lockedData: data,
      lockedAt: new Date().toISOString()
    });

    return hash;
  }

  // 驗證 Hash Lock
  async verifyHashLock(
    originalHash: string,
    submittedData: Record<string, unknown>
  ): Promise<boolean> {
    const computedHash = this.generateHash({
      ...submittedData,
      salt: submittedData.salt || 'unknown'
    });

    return originalHash === computedHash;
  }

  // 獲取交易歷史
  getTransactionHistory(limit: number = 10): Transaction[] {
    return this.chain.slice(-limit).reverse();
  }

  // 獲取交易計數
  getTransactionCount(): number {
    return this.chain.length;
  }

  // 獲取最後一個區塊的哈希
  getLastBlockHash(): string {
    return this.chain.length > 0
      ? this.chain[this.chain.length - 1].hash
      : '0';
  }

  // 計算確認數
  getConfirmationCount(transactionId: string): number {
    const index = this.chain.findIndex(tx => tx.id === transactionId);
    if (index === -1) return 0;
    return this.chain.length - index;
  }

  // 導出區塊鏈數據
  exportBlockchain(): { chain: Transaction[]; count: number } {
    return {
      chain: [...this.chain],
      count: this.chain.length
    };
  }

  // 驗證區塊鏈完整性
  validateChain(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // 驗證區塊哈希
      const computedHash = this.generateHash({
        previousHash: previousBlock.hash,
        timestamp: currentBlock.timestamp,
        data: currentBlock.data
      });

      if (currentBlock.hash !== computedHash) {
        return false;
      }

      // 驗證鏈接
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

export default BlockchainService;
