import { MerkleTree } from 'merkletreejs';
import { keccak256, toUtf8Bytes } from 'ethers';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { v4 as uuidv4 } from 'uuid';

export interface Block {
  height: number;
  hash: string;
  previousHash: string;
  merkleRoot: string;
  timestamp: number;
  transactionCount: number;
  transactions: string[]; // List of evidence hashes in this block
}

export interface ChainStatus {
  currentHeight: number;
  latestBlockHash: string;
  pendingTxCount: number;
  lastBlockTime: number;
}

/**
 * BlockchainAnchorService
 * Simulates a Layer-2 Blockchain connection using local cryptographic primitives.
 * It batches evidence hashes into Merkle Trees to provide immutable proofs of "Truth".
 */
export class BlockchainAnchorService {
  private static instance: BlockchainAnchorService;
  private chain: Block[] = [];
  private mempool: string[] = [];

  // Genesis block
  private constructor() {
    this.chain.push({
      height: 0,
      hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      previousHash: '',
      merkleRoot: '',
      timestamp: Date.now(),
      transactionCount: 0,
      transactions: [],
    });

    omniLogger.info(
      LogCategory.SYSTEM,
      'Blockchain Anchor Service initialized. Genesis block created.',
      {
        service: 'BlockchainAnchorService',
      }
    );
  }

  public static getInstance(): BlockchainAnchorService {
    if (!BlockchainAnchorService.instance) {
      BlockchainAnchorService.instance = new BlockchainAnchorService();
    }
    return BlockchainAnchorService.instance;
  }

  /**
   * Adds an evidence hash to the pending transaction pool (mempool).
   */
  public addToMempool(hash: string): void {
    if (this.mempool.includes(hash)) {
      omniLogger.debug(LogCategory.BLOCKCHAIN, `Hash ${hash} already in mempool.`, {
        service: 'BlockchainAnchorService',
      });
      return;
    }

    // Check if already in chain to prevent duplicates (simple check for now)
    for (const block of this.chain) {
      if (block.transactions.includes(hash)) {
        omniLogger.debug(
          LogCategory.BLOCKCHAIN,
          `Hash ${hash} already mined in block ${block.height}.`,
          { service: 'BlockchainAnchorService' }
        );
        return;
      }
    }

    this.mempool.push(hash);
    omniLogger.info(LogCategory.BLOCKCHAIN, `Hash added to mempool: ${hash}`, {
      service: 'BlockchainAnchorService',
      mempoolSize: this.mempool.length,
    });
  }

  /**
   * Mines a new block containing all transactions currently in the mempool.
   * Generates a Merkle Root and links it to the previous block.
   */
  public async mineBlock(): Promise<Block | null> {
    if (this.mempool.length === 0) {
      omniLogger.debug(LogCategory.BLOCKCHAIN, 'Mempool empty. Skipping mining.', {
        service: 'BlockchainAnchorService',
      });
      return null;
    }

    const previousBlock = this.chain[this.chain.length - 1];
    if (!previousBlock) {
      throw new Error('Chain integrity compromised: No genesis block found');
    }
    const transactions = [...this.mempool];

    // Create Merkle Tree
    const leaves = transactions.map(x => keccak256(toUtf8Bytes(x)));
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const merkleRoot = tree.getHexRoot();

    const newBlock: Block = {
      height: previousBlock.height + 1,
      previousHash: previousBlock.hash,
      merkleRoot,
      timestamp: Date.now(),
      transactionCount: transactions.length,
      transactions,
      // Simple block hash: hash(prevHash + merkleRoot + timestamp)
      hash: keccak256(toUtf8Bytes(previousBlock.hash + merkleRoot + Date.now())),
    };

    this.chain.push(newBlock);
    this.mempool = []; // Clear mempool

    omniLogger.info(LogCategory.BLOCKCHAIN, `Block ${newBlock.height} mined successfully.`, {
      service: 'BlockchainAnchorService',
      txCount: newBlock.transactionCount,
      merkleRoot: newBlock.merkleRoot,
      blockHash: newBlock.hash,
    });

    return newBlock;
  }

  /**
   * Verifies if a specific hash exists in the blockchain and returns its Merkle Proof.
   */
  public verifyTransaction(hash: string): {
    verified: boolean;
    blockHeight?: number;
    proof?: string[];
  } {
    for (const block of this.chain) {
      if (block.transactions.includes(hash)) {
        // Reconstruct tree to generate proof
        const leaves = block.transactions.map(x => keccak256(toUtf8Bytes(x)));
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        const leaf = keccak256(toUtf8Bytes(hash));
        const proof = tree.getHexProof(leaf);

        // Verify proof
        const verified = tree.verify(proof, leaf, block.merkleRoot);

        return {
          verified,
          blockHeight: block.height,
          proof,
        };
      }
    }

    return { verified: false };
  }

  public getChainStatus(): ChainStatus {
    const lastBlock = this.chain[this.chain.length - 1];
    if (!lastBlock) {
      return {
        currentHeight: 0,
        latestBlockHash: '',
        pendingTxCount: this.mempool.length,
        lastBlockTime: Date.now(),
      };
    }
    return {
      currentHeight: lastBlock.height,
      latestBlockHash: lastBlock.hash,
      pendingTxCount: this.mempool.length,
      lastBlockTime: lastBlock.timestamp,
    };
  }
}

export const blockchainAnchor = BlockchainAnchorService.getInstance();
