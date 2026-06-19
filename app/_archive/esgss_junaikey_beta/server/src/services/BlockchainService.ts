import { ethers } from 'ethers';
import { IImpactProject } from '../types/ipms.js';

/**
 * 🔗 區塊鏈服務 (Blockchain Service)
 * --------------------------------------------------
 * [功能] 實現數據上鏈錨定與不可篡改驗證。
 * [加密] 使用 Keccak-256 哈希與系統私鑰簽核。
 */

// 系統錢包 (模擬私有鏈，密鑰應存於安全環境或 .env)
const SYSTEM_WALLET = ethers.Wallet.createRandom();

export class BlockchainService {
  /**
   * 🪙 鑄造影響力資產 (Mint Impact Asset)
   * 將項目的核心數據哈希後簽名，模擬 AVOS 私有帳本的存證過程。
   */
  public static async mintAsset(project: IImpactProject) {
    // 1. 構建數據 Payload
    const payload = JSON.stringify({
      uuid: project.uuid,
      title: project.title,
      impact: project.impact_goals.current_value,
      metric: project.impact_goals.target_metric,
      timestamp: Date.now(),
    });

    // 2. 計算數據哈希 (Keccak-256)
    // 這是資產的唯一「指紋」 (Fingerprint)
    const dataHash = ethers.keccak256(ethers.toUtf8Bytes(payload));

    // 3. 系統帳戶簽名 (Signing)
    // 確保數據來源於系統認證的 AVOS 私有鏈環境
    const signature = await SYSTEM_WALLET.signMessage(ethers.getBytes(dataHash));

    // 4. 返回證書信息
    return {
      tx_hash: dataHash, // 模擬交易哈希，實際為數據哈希
      signature: signature,
      signer_address: SYSTEM_WALLET.address,
      block_timestamp: Date.now(),
      network: 'AVOS_PRIVATE_LEDGER', // 模擬私有帳端
    };
  }

  /**
   * 🔍 數據真實性驗證 (Verify)
   */
  public static verifyAsset(dataHash: string, signature: string): string {
    return ethers.verifyMessage(ethers.getBytes(dataHash), signature);
  }
}
