/**
 * 🏛️ 證據庫服務 - Evidence Vault Service
 * 
 * 功能：
 * - 遊戲證據存儲
 * - 戰鬥記錄存儲
 * - 成就驗證
 * - 證書管理
 */

import { v4 as uuidv4 } from 'uuid';
import { BlockchainService } from './BlockchainService.js';

interface Evidence {
  id: string;
  type: 'battle' | 'achievement' | 'sacred_contract' | 'card_collection' | 'level_up';
  data: Record<string, unknown>;
  hash: string;
  timestamp: string;
  verified: boolean;
  confirmations: number;
}

interface BattleEvidence {
  battleId: string;
  playerId: string;
  enemyId: string;
  result: 'victory' | 'defeat';
  cardsUsed: string[];
  damageDealt: number;
  turns: number;
  entropyReduced: number;
}

interface AchievementEvidence {
  achievementId: string;
  achievementTitle: string;
  requirement: number | string;
  unlockedAt: string;
}

export class EvidenceVaultService {
  private blockchainService: BlockchainService;
  private evidenceStore: Map<string, Evidence>;

  constructor() {
    this.blockchainService = new BlockchainService();
    this.evidenceStore = new Map();
  }

  // 存儲戰鬥證據
  async storeBattleEvidence(battleData: BattleEvidence): Promise<Evidence> {
    const evidence: Evidence = {
      id: uuidv4(),
      type: 'battle',
      data: battleData,
      hash: await this.blockchainService.generateHash(battleData),
      timestamp: new Date().toISOString(),
      verified: false,
      confirmations: 0
    };

    // 創建區塊鏈交易
    this.blockchainService.createTransaction('evidence', {
      evidenceId: evidence.id,
      type: 'battle',
      data: battleData,
      hash: evidence.hash
    });

    this.evidenceStore.set(evidence.id, evidence);
    return evidence;
  }

  // 存儲成就證據
  async storeAchievementEvidence(achievementData: AchievementEvidence): Promise<Evidence> {
    const evidence: Evidence = {
      id: uuidv4(),
      type: 'achievement',
      data: achievementData,
      hash: await this.blockchainService.generateHash(achievementData),
      timestamp: new Date().toISOString(),
      verified: false,
      confirmations: 0
    };

    this.blockchainService.createTransaction('certification', {
      evidenceId: evidence.id,
      type: 'achievement',
      data: achievementData,
      hash: evidence.hash
    });

    this.evidenceStore.set(evidence.id, evidence);
    return evidence;
  }

  // 存儲神聖契約
  async storeEvidence(contractData: {
    type: string;
    data: Record<string, unknown>;
    hash: string;
  }): Promise<Evidence> {
    const evidence: Evidence = {
      id: uuidv4(),
      type: 'sacred_contract',
      data: contractData.data,
      hash: contractData.hash,
      timestamp: new Date().toISOString(),
      verified: false,
      confirmations: 0
    };

    this.blockchainService.createTransaction('certification', {
      evidenceId: evidence.id,
      type: 'sacred_contract',
      data: contractData.data,
      hash: contractData.hash
    });

    this.evidenceStore.set(evidence.id, evidence);
    return evidence;
  }

  // 驗證證據
  async verifyEvidence(evidenceId: string): Promise<boolean> {
    const evidence = this.evidenceStore.get(evidenceId);
    if (!evidence) return false;

    // 計算當前哈希
    const currentHash = await this.blockchainService.generateHash(evidence.data);
    
    // 驗證哈希一致性
    if (currentHash !== evidence.hash) {
      return false;
    }

    // 更新確認數
    evidence.confirmations = this.blockchainService.getConfirmationCount(evidenceId);
    evidence.verified = true;

    return true;
  }

  // 獲取玩家所有證據
  getPlayerEvidence(playerId: string): Evidence[] {
    const playerEvidence: Evidence[] = [];
    
    this.evidenceStore.forEach(evidence => {
      if (evidence.data && typeof evidence.data === 'object' && 'playerId' in evidence.data) {
        if ((evidence.data as Record<string, unknown>).playerId === playerId) {
          playerEvidence.push(evidence);
        }
      }
    });

    return playerEvidence;
  }

  // 獲取證據統計
  getEvidenceStats(): {
    total: number;
    byType: Record<string, number>;
    verifiedCount: number;
  } {
    const stats = {
      total: this.evidenceStore.size,
      byType: {} as Record<string, number>,
      verifiedCount: 0
    };

    this.evidenceStore.forEach(evidence => {
      stats.byType[evidence.type] = (stats.byType[evidence.type] || 0) + 1;
      if (evidence.verified) stats.verifiedCount++;
    });

    return stats;
  }

  // 導出證據庫
  exportVault(): Evidence[] {
    return Array.from(this.evidenceStore.values());
  }
}

export default EvidenceVaultService;
