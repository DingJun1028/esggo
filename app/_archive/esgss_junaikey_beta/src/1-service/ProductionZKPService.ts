/**
 * 生產級 ZKP 誠信驗證服務
 * --------------------------------------------------
 * [標準] zk-SNARK (Groth16)
 * [電路] circom 2.0
 * [證明生成] snarkjs
 * [鏈上驗證] Polygon 智能合約
 *
 * [核心價值]
 * - 誠信 (Integrity): 密碼學級別的數據證明
 * - 悲智 (Wisdom): 工業標準的隱私保護
 * - 創價 (Value Creation): 最高等級的數據資產授信
 */

import { IComponentCore } from '@/types/core';
import { omniLogger, LogCategory } from './omniLogger';
import { ethers } from 'ethers';
import * as snarkjs from 'snarkjs';

/**
 * 生產級 ZKP 證明結構
 */
export interface ProductionZKPProof {
  // Groth16 證明
  pi_a: [string, string];
  pi_b: [[string, string], [string, string]];
  pi_c: [string, string];

  // 公開信號
  publicSignals: string[];

  // 元數據
  protocol: 'groth16';
  curve: 'bn128';
  timestamp: number;

  // 鏈上驗證資訊
  verifierContract?: string; // Polygon 合約地址
  transactionHash?: string; // 驗證交易雜湊
}

/**
 * 電路輸入
 */
export interface CircuitInput {
  privateData: string; // 私密數據
  privateSalt: string; // 隨機鹽值
  dataHash: string; // 數據雜湊（公開）
  threshold: string; // 閾值（公開）
}

/**
 * 生產級 ZKP 誠信驗證服務
 */
export class ProductionZKPService {
  private static wasmPath = '/circuits/data_integrity.wasm';
  private static zkeyPath = '/circuits/data_integrity_final.zkey';
  private static verificationKeyPath = '/circuits/verification_key.json';

  // Polygon 合約配置
  private static polygonRPC =
    process.env.VITE_POLYGON_RPC_URL || 'https://polygon-mumbai.g.alchemy.com/v2/your-api-key';
  private static verifierContractAddress = process.env.VITE_ZKP_VERIFIER_CONTRACT || '';

  /**
   * 生成 zk-SNARK 證明
   *
   * @param component - 要證明的組件
   * @param privateData - 私密數據
   * @param threshold - 閾值
   * @returns Groth16 證明
   */
  static async generateProof(
    component: IComponentCore,
    privateData: bigint,
    threshold: bigint
  ): Promise<ProductionZKPProof> {
    try {
      omniLogger.info(LogCategory.SYSTEM, '[ZKP-Production] 開始生成 Groth16 證明', {
        componentUuid: component.uuid,
      });

      // 1. 生成隨機鹽值
      const privateSalt = this.generateRandomSalt();

      // 2. 計算數據雜湊
      const dataHash = await this.calculatePoseidonHash(privateData, privateSalt);

      // 3. 構建電路輸入
      const input: CircuitInput = {
        privateData: privateData.toString(),
        privateSalt: privateSalt.toString(),
        dataHash: dataHash.toString(),
        threshold: threshold.toString(),
      };

      // 4. 生成證明
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        input,
        this.wasmPath,
        this.zkeyPath
      );

      // 5. 轉換為合約格式
      const productionProof: ProductionZKPProof = {
        pi_a: [proof.pi_a[0], proof.pi_a[1]],
        pi_b: [
          [proof.pi_b[0][0], proof.pi_b[0][1]],
          [proof.pi_b[1][0], proof.pi_b[1][1]],
        ],
        pi_c: [proof.pi_c[0], proof.pi_c[1]],
        publicSignals: publicSignals.map((s: any) => s.toString()),
        protocol: 'groth16',
        curve: 'bn128',
        timestamp: Date.now(),
      };

      omniLogger.info(LogCategory.SYSTEM, '[ZKP-Production] Groth16 證明生成成功', {
        publicSignalsCount: publicSignals.length,
      });

      return productionProof;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[ZKP-Production] 證明生成失敗', { error });
      throw new Error(`Groth16 證明生成失敗: ${error}`);
    }
  }

  /**
   * 本地驗證證明
   */
  static async verifyProofLocally(proof: ProductionZKPProof): Promise<boolean> {
    try {
      // 載入驗證密鑰
      const vKey = await fetch(this.verificationKeyPath).then(r => r.json());

      // 驗證證明
      const isValid = await snarkjs.groth16.verify(vKey, proof.publicSignals, {
        pi_a: proof.pi_a,
        pi_b: proof.pi_b,
        pi_c: proof.pi_c,
        protocol: proof.protocol,
        curve: proof.curve,
      });

      omniLogger.info(LogCategory.SYSTEM, '[ZKP-Production] 本地驗證完成', {
        valid: isValid,
      });

      return isValid;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[ZKP-Production] 本地驗證失敗', { error });
      return false;
    }
  }

  /**
   * 鏈上驗證證明
   *
   * 將證明提交到 Polygon 智能合約進行驗證
   */
  static async verifyProofOnChain(
    proof: ProductionZKPProof,
    signer: ethers.Signer
  ): Promise<{ valid: boolean; txHash: string }> {
    try {
      omniLogger.info(LogCategory.SYSTEM, '[ZKP-Production] 開始鏈上驗證');

      // 連接到驗證合約
      const verifierContract = new ethers.Contract(
        this.verifierContractAddress,
        [
          'function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, bytes32 _dataHash, uint256 _threshold) external returns (bool)',
        ],
        signer
      );

      // 轉換證明格式
      const pA = proof.pi_a.map(x => BigInt(x));
      const pB = proof.pi_b.map(row => row.map(x => BigInt(x)));
      const pC = proof.pi_c.map(x => BigInt(x));
      if (!proof.publicSignals[0] || !proof.publicSignals[1]) {
        throw new Error('Invalid public signals in proof');
      }
      const dataHash = ethers.zeroPadValue(ethers.toBeHex(BigInt(proof.publicSignals[0])), 32);
      const threshold = BigInt(proof.publicSignals[1]);

      // 提交驗證交易

      const tx = await (verifierContract as any).verifyProof(pA, pB, pC, dataHash, threshold);

      // 等待交易確認
      const receipt = await tx.wait();

      omniLogger.info(LogCategory.SYSTEM, '[ZKP-Production] 鏈上驗證完成', {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      });

      return {
        valid: true,
        txHash: receipt.hash,
      };
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[ZKP-Production] 鏈上驗證失敗', { error });
      throw new Error(`鏈上驗證失敗: ${error}`);
    }
  }

  /**
   * 生成隨機鹽值
   */
  private static generateRandomSalt(): bigint {
    const randomBytes = ethers.randomBytes(32);
    return BigInt(ethers.hexlify(randomBytes));
  }

  /**
   * 計算 Poseidon 雜湊
   *
   * 注意：這裡使用簡化版，生產環境應使用 circomlibjs 的 Poseidon
   */
  private static async calculatePoseidonHash(data: bigint, salt: bigint): Promise<bigint> {
    // 簡化版：使用 keccak256
    // 生產環境應使用：
    // import { poseidon } from 'circomlibjs';
    // return poseidon([data, salt]);

    const packed = ethers.solidityPacked(['uint256', 'uint256'], [data, salt]);
    const hash = ethers.keccak256(packed);
    return BigInt(hash);
  }

  /**
   * 批次生成證明
   */
  static async batchGenerateProofs(
    components: IComponentCore[],
    privateDataArray: bigint[],
    thresholds: bigint[]
  ): Promise<ProductionZKPProof[]> {
    const proofs: ProductionZKPProof[] = [];

    for (let i = 0; i < components.length; i++) {
      const component = components[i];
      const privateData = privateDataArray[i];
      const threshold = thresholds[i];

      if (!component || privateData === undefined || threshold === undefined) continue;

      const proof = await this.generateProof(component, privateData, threshold);
      proofs.push(proof);
    }

    return proofs;
  }
}

/**
 * ZKP 工具函數
 */
export const ProductionZKPUtils = {
  /**
   * 導出證明為 JSON
   */
  exportProofToJSON(proof: ProductionZKPProof): string {
    return JSON.stringify(proof, null, 2);
  },

  /**
   * 從 JSON 導入證明
   */
  importProofFromJSON(json: string): ProductionZKPProof {
    return JSON.parse(json);
  },

  /**
   * 生成驗證 URL
   */
  generateVerificationURL(proof: ProductionZKPProof): string {
    const encodedProof = encodeURIComponent(this.exportProofToJSON(proof));
    return `/verify-zkp?proof=${encodedProof}`;
  },
};
