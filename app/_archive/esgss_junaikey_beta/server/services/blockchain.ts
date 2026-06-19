import { ethers, JsonRpcProvider, Wallet, TransactionResponse } from 'ethers';
import dotenv from 'dotenv';
import { supabase } from '../db/supabaseClient.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';

dotenv.config();

// Default to Polygon RPC or a free public one
const RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'https://polygon-rpc.com';
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY;

// Type definitions
interface BlockchainMetadata {
  [key: string]: unknown;
}

interface AnchorResult {
  status: string;
  txHash: string;
  explorerUrl: string;
}

interface BlockchainError extends Error {
  code?: string;
}

class BlockchainService {
  provider: JsonRpcProvider | null = null;
  wallet: Wallet | null = null;
  simulated: boolean = true;

  constructor() {
    if (!PRIVATE_KEY) {
      omniLogger.warn(LogCategory.BLOCKCHAIN, '[BLOCKCHAIN] No PRIVATE_KEY found. Anchoring will be simulated.');
      this.provider = null;
      this.wallet = null;
      this.simulated = true;
    } else {
      try {
        this.provider = new JsonRpcProvider(RPC_URL);
        this.wallet = new Wallet(PRIVATE_KEY, this.provider);
        this.simulated = false;
        omniLogger.info(LogCategory.BLOCKCHAIN, `[BLOCKCHAIN] Connected to ${RPC_URL}`);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        omniLogger.error(LogCategory.BLOCKCHAIN, '[BLOCKCHAIN] Failed to initialize provider:', { error });
        this.simulated = true;
      }
    }
  }

  /**
   * Anchor a hash (e.g., Report Hash, Log Merkle Root) to the blockchain.
   * In a real system, this would call a Smart Contract "verify()" or "store()".
   * For MVP, we send a 0-value transaction with the hash in the data field.
   */
  async anchorHash(hash: string, metadata: BlockchainMetadata = {}): Promise<AnchorResult> {
    // [HARDENING] Input Validation
    if (!hash || typeof hash !== 'string') {
      const errorMsg = 'Invalid hash provided for anchoring';
      omniLogger.error(LogCategory.BLOCKCHAIN, `[BLOCKCHAIN] ${errorMsg}`, { hash });
      throw new Error(errorMsg);
    }

    // [HARDENING] Hash Format Check (Basic Hex/SHA-256 pattern)
    if (
      !/^0x[a-fA-F0-9]{64}$/.test(hash) &&
      !/^[a-fA-F0-9]{64}$/.test(hash) &&
      !hash.startsWith('sha256-')
    ) {
      omniLogger.warn(LogCategory.BLOCKCHAIN, `[BLOCKCHAIN] Anchoring non-standard hash format: ${hash}`);
    }

    omniLogger.info(LogCategory.BLOCKCHAIN, `[BLOCKCHAIN] Anchoring Hash request received`, { hash });

    const payload = JSON.stringify({ hash, ...metadata, timestamp: Date.now() });
    const hexData = ethers.hexlify(ethers.toUtf8Bytes(payload));

    if (this.simulated) {
      // Simulate delay
      await new Promise(r => setTimeout(r, 1000));

      const mockTxHash =
        '0x' +
        Array(64)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join('');

      // Log to DB for "proof"
      await this.logToDb(hash, mockTxHash, 'simulated');

      omniLogger.info(LogCategory.BLOCKCHAIN, `[BLOCKCHAIN] Simulated Anchor Success`, { mockTxHash });

      return {
        status: 'anchored (simulated)',
        txHash: mockTxHash,
        explorerUrl: `https://polygonscan.com/tx/${mockTxHash}`,
      };
    }

    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }

    try {
      // Send transaction to self with data
      const tx: TransactionResponse = await this.wallet.sendTransaction({
        to: this.wallet.address,
        value: 0,
        data: hexData,
      });

      omniLogger.info(LogCategory.BLOCKCHAIN, `[BLOCKCHAIN] Transaction sent: ${tx.hash}`);
      await tx.wait(1);
      omniLogger.info(LogCategory.BLOCKCHAIN, `[BLOCKCHAIN] Transaction confirmed: ${tx.hash}`);

      await this.logToDb(hash, tx.hash, 'confirmed');

      return {
        status: 'anchored',
        txHash: tx.hash,
        explorerUrl: `https://polygonscan.com/tx/${tx.hash}`,
      };
    } catch (error: unknown) {
      const err = error as BlockchainError;
      omniLogger.error(LogCategory.BLOCKCHAIN, '[BLOCKCHAIN] Anchoring failed:', { error });
      // [HARDENING] Check for insufficient funds specific error
      if (err.code === 'INSUFFICIENT_FUNDS') {
        throw new Error(`Blockchain Error: Insufficient funds in wallet ${this.wallet?.address}`);
      }
      throw new Error(`Blockchain Error: ${err.message}`);
    }
  }

  async logToDb(dataHash: string, txHash: string, status: string): Promise<void> {
    try {
      // Supabase Insert
      const { error } = await supabase.from('blockchain_anchors').insert({
        data_hash: dataHash,
        transaction_id: txHash,
        status: status,
      });

      if (error) throw error;

    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      // [HARDENING] Safe Fallback - do not crash main process if DB log fails
      omniLogger.error(LogCategory.BLOCKCHAIN, '[BLOCKCHAIN] DB Log failed (Non-critical):', { error });
    }
  }
}

export const blockchainService = new BlockchainService();
export default blockchainService;
