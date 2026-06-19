/**
 * 🔄 遊戲進度同步服務
 * Game Progress Sync Service - ESGSS 系統無縫接軌
 * 
 * 功能：
 * - 遊戲進度與 ESG 服務同步
 * - AI 數位分身智能學習
 * - 服務即教學整合
 * - 跨服務數據橋接
 */

import { v4 as uuidv4 } from 'uuid';
import { BlockchainService } from './BlockchainService.js';
import { EvidenceVaultService } from './EvidenceVaultService.js';

// ESG 服務類型
interface ESGServiceAction {
  serviceType: 'climate' | 'governance' | 'social' | 'supply' | 'report';
  action: string;
  result: Record<string, unknown>;
  timestamp: string;
}

// 遊戲進度更新
interface GameProgressUpdate {
  type: 'battle_win' | 'card_collect' | 'level_up' | 'quest_complete' | 'achievement_unlock';
  data: Record<string, unknown>;
  xpEarned: number;
  syncedAt: string;
}

// AI 智能推薦
interface AIRecommendation {
  category: 'environment' | 'social' | 'governance' | 'climate';
  title: string;
  description: string;
  relatedCards: string[];
  relatedServices: string[];
  urgency: 'low' | 'medium' | 'high';
}

// 學習記錄
interface LearningRecord {
  id: string;
  playerId: string;
  category: string;
  concept: string;
  source: 'game' | 'service' | 'battle';
  understanding: number; // 0-100
  xpBonus: number;
  timestamp: string;
}

export class GameProgressSyncService {
  private blockchainService: BlockchainService;
  private evidenceVault: EvidenceVaultService;
  private learningRecords: Map<string, LearningRecord[]>;

  constructor() {
    this.blockchainService = new BlockchainService();
    this.evidenceVault = new EvidenceVaultService();
    this.learningRecords = new Map();
  }

  /**
   * 同步遊戲戰鬥勝利到 ESG 服務
   */
  async syncBattleWin(
    playerId: string,
    enemyType: string,
    cardsUsed: string[],
    score: number
  ): Promise<GameProgressUpdate> {
    // 記錄學習成果
    const learningRecord = await this.recordLearning(
      playerId,
      enemyType,
      'battle',
      cardsUsed,
      score
    );

    // 生成區塊鏈交易
    await this.blockchainService.createTransaction('evidence', {
      type: 'battle_win',
      playerId,
      enemyType,
      cardsUsed,
      score,
      learningRecord,
      timestamp: new Date().toISOString()
    });

    return {
      type: 'battle_win',
      data: {
        enemyType,
        cardsUsed,
        score,
        learningRecord
      },
      xpEarned: Math.floor(score * 1.5),
      syncedAt: new Date().toISOString()
    };
  }

  /**
   * 同步卡牌收集
   */
  async syncCardCollection(
    playerId: string,
    cardId: string,
    category: string,
    isoReference?: string
  ): Promise<GameProgressUpdate> {
    // 檢查是否已學習過類似概念
    const existingRecord = this.findRelatedLearning(
      playerId,
      category
    );

    // 計算學習加成
    const xpBonus = existingRecord 
      ? Math.floor(existingRecord.understanding * 0.1)
      : 50;

    // 記錄新學習
    await this.recordLearning(
      playerId,
      category,
      'card',
      [cardId],
      xpBonus
    );

    return {
      type: 'card_collect',
      data: {
        cardId,
        category,
        isoReference,
        xpBonus
      },
      xpEarned: 100 + xpBonus,
      syncedAt: new Date().toISOString()
    };
  }

  /**
   * 同步等級提升
   */
  async syncLevelUp(
    playerId: string,
    newLevel: number,
    unlockedFeatures: string[]
  ): Promise<GameProgressUpdate> {
    // 生成神聖契約
    const contract = await this.evidenceVault.storeEvidence({
      type: 'level_up',
      data: {
        playerId,
        newLevel,
        unlockedFeatures,
        timestamp: new Date().toISOString()
      },
      hash: await this.blockchainService.generateHash({
        playerId,
        newLevel,
        unlockedFeatures,
        timestamp: new Date().toISOString()
      })
    });

    return {
      type: 'level_up',
      data: {
        newLevel,
        unlockedFeatures,
        contractId: contract.id
      },
      xpEarned: newLevel * 100,
      syncedAt: new Date().toISOString()
    };
  }

  /**
   * 記錄學習成果
   */
  private async recordLearning(
    playerId: string,
    category: string,
    source: 'game' | 'service' | 'battle',
    relatedItems: string[],
    baseScore: number
  ): Promise<LearningRecord> {
    const record: LearningRecord = {
      id: uuidv4(),
      playerId,
      category,
      concept: relatedItems[0] || 'general',
      source,
      understanding: Math.min(100, baseScore + Math.random() * 20),
      xpBonus: Math.floor(baseScore * 0.5),
      timestamp: new Date().toISOString()
    };

    // 存儲學習記錄
    const existing = this.learningRecords.get(playerId) || [];
    existing.push(record);
    this.learningRecords.set(playerId, existing);

    return record;
  }

  /**
   * 查找相關學習記錄
   */
  private findRelatedLearning(
    playerId: string,
    category: string
  ): LearningRecord | null {
    const records = this.learningRecords.get(playerId) || [];
    return records.find(r => r.category === category) || null;
  }

  /**
   * 獲取 AI 智能推薦
   */
  async getAIRecommendations(
    playerId: string,
    currentLevel: number,
    personalityProfile: Record<string, number>
  ): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];

    // 根據性格分析推薦
    if (personalityProfile.environmental < 50) {
      recommendations.push({
        category: 'environment',
        title: '環境領域強化',
        description: '你的環境知識還有很大的進步空間，建議從基礎概念開始學習。',
        relatedCards: ['env-001', 'env-002', 'env-003'],
        relatedServices: ['OSClimateService', 'CarbonFootprintService'],
        urgency: 'high'
      });
    }

    if (personalityProfile.governance < 60) {
      recommendations.push({
        category: 'governance',
        title: '治理策略深化',
        description: '提升治理能力可以幫助你做出更好的策略決策。',
        relatedCards: ['gov-001', 'gov-002', 'gov-003'],
        relatedServices: ['GovernanceManager', 'ComplianceService'],
        urgency: 'medium'
      });
    }

    // 根據等級推薦
    if (currentLevel >= 30) {
      recommendations.push({
        category: 'climate',
        title: 'TCFD 氣候風險分析',
        description: '解鎖進階氣候風險分析，深入了解企業面臨的氣候相關財務揭露要求。',
        relatedCards: ['cli-001', 'cli-002'],
        relatedServices: ['ClimateRiskDashboard', 'TCFDReportService'],
        urgency: 'medium'
      });
    }

    return recommendations;
  }

  /**
   * 執行 ESG 服務並同步遊戲進度
   */
  async executeESGServiceWithGameSync(
    playerId: string,
    serviceAction: ESGServiceAction
  ): Promise<{
    serviceResult: Record<string, unknown>;
    gameProgress: GameProgressUpdate;
    learningBonus: number;
  }> {
    // 根據服務類型計算學習加成
    let learningBonus = 0;
    
    switch (serviceAction.serviceType) {
      case 'climate':
        learningBonus = 25;
        break;
      case 'governance':
        learningBonus = 30;
        break;
      case 'social':
        learningBonus = 20;
        break;
      case 'supply':
        learningBonus = 15;
        break;
      case 'report':
        learningBonus = 35;
        break;
    }

    // 記錄學習
    await this.recordLearning(
      playerId,
      serviceAction.serviceType,
      'service',
      [serviceAction.action],
      learningBonus
    );

    // 同步遊戲進度
    const gameProgress = await this.syncCardCollection(
      playerId,
      `service-${serviceAction.serviceType}`,
      serviceAction.serviceType
    );

    return {
      serviceResult: serviceAction.result,
      gameProgress: {
        ...gameProgress,
        xpEarned: gameProgress.xpEarned + learningBonus
      },
      learningBonus
    };
  }

  /**
   * 生成學習報告
   */
  async generateLearningReport(
    playerId: string
  ): Promise<{
    totalXP: number;
    categories: Record<string, { xp: number; understanding: number }>;
    recommendations: AIRecommendation[];
    blockchainHash: string;
  }> {
    const records = this.learningRecords.get(playerId) || [];
    
    const categories: Record<string, { xp: number; understanding: number }> = {};
    let totalXP = 0;

    for (const record of records) {
      if (!categories[record.category]) {
        categories[record.category] = { xp: 0, understanding: 0 };
      }
      categories[record.category].xp += record.xpBonus;
      categories[record.category].understanding = Math.max(
        categories[record.category].understanding,
        record.understanding
      );
      totalXP += record.xpBonus;
    }

    // 生成區塊鏈哈希
    const blockchainHash = await this.blockchainService.generateHash({
      playerId,
      totalXP,
      categories,
      timestamp: new Date().toISOString()
    });

    return {
      totalXP,
      categories,
      recommendations: await this.getAIRecommendations(playerId, 42, {
        environmental: 85,
        social: 72,
        governance: 90,
        innovation: 68
      }),
      blockchainHash
    };
  }

  /**
   * 導出遊戲數據
   */
  exportGameData(playerId: string): {
    learningRecords: LearningRecord[];
    blockchainData: ReturnType<typeof this.blockchainService.exportBlockchain>;
  } {
    return {
      learningRecords: this.learningRecords.get(playerId) || [],
      blockchainData: this.blockchainService.exportBlockchain()
    };
  }
}

export default GameProgressSyncService;
