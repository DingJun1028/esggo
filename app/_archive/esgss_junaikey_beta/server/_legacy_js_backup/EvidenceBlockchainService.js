import { ethers } from 'ethers';
import crypto from 'crypto';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const contractAbi = require('../abi/TimestampRegistry.json');
class BlockchainService {
  provider;
  signer;
  contract;
  constructor() {
    const rpcUrl = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
    const privateKey = process.env.BACKEND_WALLET_PRIVATE_KEY;
    const contractAddress = process.env.TIMESTAMP_CONTRACT_ADDRESS;
    // Initialize only if keys are present (Mock mode if trying to run without env)
    if (privateKey && contractAddress) {
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      this.signer = new ethers.Wallet(privateKey, this.provider);
      this.contract = new ethers.Contract(contractAddress, contractAbi, this.signer);
      console.log(`[BlockchainService] Initialized with contract: ${contractAddress}`);
    } else {
      console.warn('[BlockchainService] Missing env vars. Running in MOCK mode.');
    }
  }
  async anchorEvidence(evidence) {
    if (!this.contract) {
      console.log('[BlockchainService] Mock mode: Simulating anchor.');
      return {
        anchorHash: '0x' + crypto.randomBytes(32).toString('hex'),
        txId: '0x' + crypto.randomBytes(32).toString('hex'),
      };
    }
    // 1. Create a stable, sorted JSON string from the evidence object
    // We filter out database specific fields that might change (like updated_at if it changes quickly)
    // But for T4, we should anchor the *approved state*.
    const stableString = JSON.stringify(evidence, Object.keys(evidence).sort());
    // 2. Calculate the SHA-256 hash
    const anchorHash = crypto.createHash('sha256').update(stableString).digest('hex');
    const anchorHashBytes32 = '0x' + anchorHash;
    try {
      console.log(`[Blockchain] Anchoring hash: ${anchorHashBytes32}`);
      // 3. Call the smart contract
      const tx = await this.contract.getFunction('anchor')?.send(anchorHashBytes32);
      if (tx) {
        console.log(`[Blockchain] Tx sent: ${tx.hash}. Waiting for confirmation...`);
        await tx.wait(); // Wait for the transaction to be mined
        console.log(`[Blockchain] Successfully anchored evidence ${evidence.id}. Tx: ${tx.hash}`);
        return {
          anchorHash: anchorHashBytes32,
          txId: tx.hash,
        };
      } else {
        throw new Error('Transaction creation failed.');
      }
    } catch (error) {
      console.error('[Blockchain] Anchor failed:', error);
      throw new Error(`Blockchain anchor failed: ${error.message}`);
    }
  }
}
export default new BlockchainService();
