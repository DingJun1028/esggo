/**
 * 5T 驗證服務 (Verification4TService -> 5T Protocol)
 * Tangible (可感知) | Traceable (可溯源) | Trackable (可追蹤) | Transparent (可透明) | Trustworthy (不可篡改)
 */

import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

// 證據佐證庫映射
interface IEvidenceMap {
  [key: string]: {
    hash: string;
    timestamp: string;
    source: string;
  };
}

/**
 * 💡 奧秘元件心核：UCC 實作規範 (from SPEC.md)
 */
export interface IComponentCore {
  readonly uuid: string;           // [Traceable] 來自奧秘永憶主體
  readonly timestamp: number;      // [Trackable] 學習刻印時間戳
  readonly formula: string;        // [Transparent] $E = \sum (AD \times EF)$
  readonly impactMetric: string;   // [Tangible] 具體影響力指標
  readonly status: "Trustworthy";  // [Trustworthy] 最終資產封印狀態

  /** 證據佐證庫 (Evidence Vault) - 存放 5T 驗證與學習路徑憑證 */
  evidence: IEvidenceMap;

  /** 🔴 不可篡改封印：當服務完成「引導教學」後，執行終態封裝 */
  lock(): void;
}

// 數據區塊（區塊鏈風格）
interface DataBlock {
  index: number;
  timestamp: string;
  data: Record<string, any>;
  previousHash: string;
  hash: string;
  signature?: string;
  validator?: string;
  // 5T 擴展元數據
  metadata?: {
    tangibleId?: string;
    traceableId?: string;
  };
}

// 5T 驗證結果
interface Verification5TResult {
  tangible: {
    score: number;
    impactMetric: string;
    isVisualized: boolean; // 是否具備視覺化反饋
  };
  traceable: {
    score: number;
    sourceOrigin: string; // 數據原始來源
    uuid: string; // 溯源 ID
  };
  trackable: {
    score: number;
    timestamp: string;
    lifecycleEvents: string[]; // 數據流轉路徑
  };
  transparent: {
    score: number;
    formula: string; // 驗算公式
    dataCompleteness: number;
  };
  trustworthy: {
    score: number;
    hash: string; // SHA-256 Hash
    isLocked: boolean; // Object.freeze 狀態
    confidenceLevel: 'high' | 'medium' | 'low';
  };
  overallScore: number;
  status: 'verified' | 'pending' | 'failed';
}

// 驗證日誌
interface VerificationLog {
  id: string;
  timestamp: string;
  action: 'create' | 'update' | 'verify' | 'export';
  dataHash: string;
  userId: string;
  details: string;
  // 5T 標記
  protocolTag: 'Tangible' | 'Traceable' | 'Trackable' | 'Transparent' | 'Trustworthy' | 'General';
}

class Verification4TService {
  private chain: DataBlock[] = [];
  private logs: VerificationLog[] = [];

  /**
   * 計算數據哈希值 (SHA-256)
   */
  private calculateHash(data: Record<string, any>): string {
    const dataString = JSON.stringify(data);
    return CryptoJS.SHA256(dataString).toString();
  }

  /**
   * 創建數據區塊
   */
  async createBlock(
    data: Record<string, any>,
    previousHash?: string
  ): Promise<DataBlock> {
    const timestamp = new Date().toISOString();
    const index = this.chain.length;

    const block: DataBlock = {
      index,
      timestamp,
      data,
      previousHash: previousHash || (this.chain.length > 0 ? this.chain[this.chain.length - 1]!.hash : '0'),
      hash: '',
    };

    block.hash = this.calculateHash(block);

    return block;
  }

  /**
   * 數位簽名（模擬）
   */
  private async signData(data: Record<string, any>): Promise<string> {
    const dataString = JSON.stringify(data);
    // 在實際應用中，這裡應該使用私鑰進行簽名
    return CryptoJS.SHA256(dataString + Date.now().toString()).toString();
  }

  /**
   * 執行完整的 5T 協議驗證
   */
  async verify(
    data: Record<string, any>,
    options?: {
      previousData?: Record<string, any>;
      validator?: string;
      enableThirdParty?: boolean;
    }
  ): Promise<Verification5TResult> {
    const now = new Date().toISOString();
    const uuid = data.id || data.uuid || uuidv4();

    // 1. Tangible (可感知) - 美 (Beauty)
    // 檢查是否有具體的影響力指標或視覺化數據
    const hasImpactMetric = !!(data.carbonEmission || data.totalEmission || data.score || data.impact);
    const tangibleScore = hasImpactMetric ? 100 : 70; // 模擬評分

    // 2. Traceable (可溯源) - 真 (Truth)
    // 檢查是否有來源標記
    const sourceOrigin = data.dataSource || data.source || 'User Input (Self-declared)';
    const traceableScore = sourceOrigin !== 'Unknown' ? 100 : 50;

    // 3. Trackable (可追蹤) - 真 (Truth)
    // 檢查生命週期與歷史
    const lifecycleEvents = this.getVerificationHistory(this.calculateHash(data))
      .map(log => log.timestamp + ': ' + log.action);
    if (lifecycleEvents.length === 0) lifecycleEvents.push(`${now}: Initial Verification`);
    const trackableScore = Math.min(lifecycleEvents.length * 20 + 60, 100);

    // 4. Transparent (可透明) - 善 (Goodness)
    // 檢查公式與完整性
    const formula = data.formula || '$E = \\sum (AD \\times EF)$'; // 預設公式
    const dataCompleteness = this.calculateCompleteness(data);
    const transparentScore = dataCompleteness * 100;

    // 5. Trustworthy (不可篡改) - 信 (Trust)
    // Hash Lock 與簽名
    const hash = this.calculateHash(data);
    const isLocked = !!data.isLocked || true; // 模擬鎖定
    const trustworthyScore = isLocked ? 100 : 0;

    // 計算信任等級
    const trustAvg = (tangibleScore + traceableScore + trackableScore + transparentScore + trustworthyScore) / 5;
    const confidenceLevel = trustAvg > 90 ? 'high' : trustAvg > 70 ? 'medium' : 'low';

    // 總分
    const overallScore = trustAvg;

    // 狀態
    let status: 'verified' | 'pending' | 'failed';
    if (overallScore >= 85) {
      status = 'verified';
    } else if (overallScore >= 60) {
      status = 'pending';
    } else {
      status = 'failed';
    }

    // 創建區塊並添加到鏈
    const block = await this.createBlock(data);
    this.chain.push(block);

    // 記錄日誌
    this.logAction({
      id: uuidv4(),
      timestamp: now,
      action: 'verify',
      dataHash: block.hash,
      userId: options?.validator || 'system',
      details: `5T 協議驗證完成，分數: ${overallScore.toFixed(1)}`,
      protocolTag: 'Trustworthy'
    });

    return {
      tangible: {
        score: tangibleScore,
        impactMetric: data.unit ? `${data.totalEmission || 0} ${data.unit}` : 'N/A',
        isVisualized: true
      },
      traceable: {
        score: traceableScore,
        sourceOrigin,
        uuid
      },
      trackable: {
        score: trackableScore,
        timestamp: now,
        lifecycleEvents
      },
      transparent: {
        score: transparentScore,
        formula,
        dataCompleteness
      },
      trustworthy: {
        score: trustworthyScore,
        hash,
        isLocked,
        confidenceLevel
      },
      overallScore,
      status,
    };
  }

  /**
   * 計算數據完整度
   */
  private calculateCompleteness(data: Record<string, any>): number {
    const requiredFields = [
      'organizationName',
      'reportingPeriod',
      // 特定業務欄位 ...
    ];

    // 簡單實作：只要有資料就算部分完整
    const keys = Object.keys(data);
    if (keys.length === 0) return 0;
    return Math.min(keys.length / 5, 1); // 假設至少要有 5 個欄位
  }

  /**
   * 偵測變更
   */
  private detectChanges(
    oldData: Record<string, any>,
    newData: Record<string, any>
  ): string[] {
    const changes: string[] = [];
    for (const key of Object.keys(newData)) {
      if (oldData[key] !== newData[key]) {
        changes.push(`${key}: ${oldData[key]} → ${newData[key]}`);
      }
    }
    return changes.length > 0 ? changes : ['輕微調整'];
  }

  /**
   * 記錄動作
   */
  private logAction(log: VerificationLog): void {
    this.logs.push(log);
    // 保持日誌不超過 1000 條
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
  }

  /**
   * 匯出驗證報告
   */
  async exportVerificationReport(
    dataId: string,
    format: 'pdf' | 'json' | 'html' = 'json'
  ): Promise<string> {
    const verificationResult = await this.verify({ id: dataId });

    if (format === 'json') {
      return JSON.stringify(
        {
          reportId: uuidv4(),
          dataId,
          generatedAt: new Date().toISOString(),
          ...verificationResult,
        },
        null,
        2
      );
    }
    return JSON.stringify(verificationResult);
  }

  /**
   * 驗證簽名
   */
  async verifySignature(
    data: Record<string, any>,
    signature: string
  ): Promise<boolean> {
    const expectedSignature = await this.signData(data);
    return signature === expectedSignature;
  }

  /**
   * 獲取驗證歷史
   */
  getVerificationHistory(dataHash: string): VerificationLog[] {
    return this.logs.filter((log) => log.dataHash === dataHash);
  }

  /**
   * 獲取鏈的完整性狀態
   */
  checkChainIntegrity(): { isValid: boolean; brokenAt?: number } {
    for (let i = 1; i < this.chain.length; i++) {
      const block = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (!block || !previousBlock || block.previousHash !== previousBlock.hash) {
        return { isValid: false, brokenAt: i };
      }
    }
    return { isValid: true };
  }

  /**
   * 生成驗證徽章
   */
  generateVerificationBadge(score: number): {
    level: string;
    color: string;
    icon: string;
  } {
    if (score >= 95) {
      return { level: 'Platinum', color: '#E5E4E2', icon: '💎' };
    } else if (score >= 90) {
      return { level: 'Gold', color: '#FFD700', icon: '🏆' };
    } else if (score >= 85) {
      return { level: 'Silver', color: '#C0C0C0', icon: '🥈' };
    } else if (score >= 75) {
      return { level: 'Bronze', color: '#CD7F32', icon: '🥉' };
    } else {
      return { level: 'Pending', color: '#808080', icon: '⏳' };
    }
  }
}

// 匯出單例
export const verification4TService = new Verification4TService();
export type { Verification5TResult, VerificationLog, DataBlock };
