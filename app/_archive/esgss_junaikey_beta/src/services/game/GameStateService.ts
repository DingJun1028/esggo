/**
 * 🎮 善向永續村遊戲服務層
 * Sustainability Village Game Service Layer
 * 
 * 核心功能：
 * - 遊戲狀態管理
 * - 數據持久化
 * - 經驗值與等級系統
 * - 成就與徽章系統
 * - 日常/每週任務
 */

import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type {
  PlayerState,
  VillageState,
  ESGCard,
  SacredContract,
  Certificate,
  GameSaveData,
  JourneyStage,
  GameEvent,
  BattleHistory,
  PersonalityProfile
} from '@/types/game.js';
import { BlockchainService } from './BlockchainService.js';
import { EvidenceVaultService } from './EvidenceVaultService.js';

// 🎯 成就定義
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: number | string;
  type: 'battle' | 'collection' | 'evolution' | 'special';
  unlockedAt?: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-victory',
    title: '初試啼聲',
    description: '赢得第一場戰鬥',
    icon: '🎖️',
    rarity: 'common',
    requirement: 1,
    type: 'battle'
  },
  {
    id: 'carbon-slayer',
    title: '碳排放终结者',
    description: '击败 10 只高碳排魔王',
    icon: '🌍',
    rarity: 'rare',
    requirement: 10,
    type: 'battle'
  },
  {
    id: 'card-master',
    title: '卡牌大師',
    description: '收集 50 張 ESG 卡牌',
    icon: '🃏',
    rarity: 'rare',
    requirement: 50,
    type: 'collection'
  },
  {
    id: 'legendary-hunter',
    title: '傳說獵人',
    description: '獲得 5 張傳說卡牌',
    icon: '✨',
    rarity: 'epic',
    requirement: 5,
    type: 'collection'
  },
  {
    id: 'evolution-complete',
    title: '進化完全體',
    description: 'AI 數位分身達到 LV.50',
    icon: '🦋',
    rarity: 'epic',
    requirement: 50,
    type: 'evolution'
  },
  {
    id: 'century-warrior',
    title: '百戰百勝',
    description: '累計勝利 100 場',
    icon: '💯',
    rarity: 'legendary',
    requirement: 100,
    type: 'battle'
  },
  {
    id: 'eternal-master',
    title: '永續大師',
    description: '達到最高等級 LV.99',
    icon: '👑',
    rarity: 'legendary',
    requirement: 99,
    type: 'evolution'
  }
];

// 📅 每日/每週任務
const DAILY_QUESTS = [
  {
    id: 'daily-battle-1',
    title: '每日出擊',
    description: '完成 1 場戰鬥',
    type: 'battle',
    requirement: 1,
    reward: { type: 'xp', value: 100 }
  },
  {
    id: 'daily-collection-1',
    title: '知識收集',
    description: '收集 1 張新卡牌',
    type: 'collection',
    requirement: 1,
    reward: { type: 'card', value: 'random' }
  },
  {
    id: 'daily-entropy',
    title: '淨化行動',
    description: '降低村莊熵值 10%',
    type: 'special',
    requirement: 10,
    reward: { type: 'currency', value: 50 }
  }
];

const WEEKLY_QUESTS = [
  {
    id: 'weekly-battle-10',
    title: '戰士一週',
    description: '完成 10 場戰鬥',
    type: 'battle',
    requirement: 10,
    reward: { type: 'xp', value: 1000 }
  },
  {
    id: 'weekly-evolution',
    title: '進化之路',
    description: '提升 AI 等級 5 級',
    type: 'evolution',
    requirement: 5,
    reward: { type: 'card', value: 'epic' }
  }
];

// 🏪 遊戲商店
interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'card_pack' | 'consumable' | 'cosmetic';
  price: number;
  rarity?: string;
  effect?: string;
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'pack-basic',
    name: '基礎卡包',
    description: '隨機 3 張普通/罕見卡牌',
    type: 'card_pack',
    price: 100,
    rarity: 'common-rare'
  },
  {
    id: 'pack-advanced',
    name: '進階卡包',
    description: '隨機 3 張罕見/史詩卡牌',
    type: 'card_pack',
    price: 300,
    rarity: 'rare-epic'
  },
  {
    id: 'pack-legendary',
    name: '傳說卡包',
    description: '保證 1 張傳說卡牌 + 2 張史詩卡牌',
    type: 'card_pack',
    price: 1000,
    rarity: 'legendary'
  },
  {
    id: 'energy-potion',
    name: '能量藥水',
    description: '恢復 50 點能量',
    type: 'consumable',
    price: 50,
    effect: '+50 energy'
  },
  {
    id: 'xp-potion',
    name: '經驗藥水',
    description: '立即獲得 500 經驗值',
    type: 'consumable',
    price: 150,
    effect: '+500 xp'
  }
];

// 🎮 遊戲服務類
export class GameStateService {
  private blockchainService: BlockchainService;
  private evidenceVault: EvidenceVaultService;

  constructor() {
    this.blockchainService = new BlockchainService();
    this.evidenceVault = new EvidenceVaultService();
  }

  // 計算升級所需經驗值
  calculateXPToNext(level: number): number {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  // 計算戰鬥經驗值獎勵
  calculateBattleXP(enemyLevel: number, playerLevel: number, isBoss: boolean = false): number {
    const baseXP = 50;
    const levelBonus = Math.max(0, enemyLevel - playerLevel) * 10;
    const bossBonus = isBoss ? 2 : 1;
    return (baseXP + levelBonus) * bossBonus;
  }

  // 計算屬性加成
  calculateAttributeBonus(profile: PersonalityProfile): Record<string, number> {
    return {
      attackBonus: Math.floor((profile.environmental + profile.governance) / 40),
      defenseBonus: Math.floor((profile.social + profile.governance) / 40),
      magicBonus: Math.floor((profile.environmental + profile.innovation) / 40),
      speedBonus: Math.floor((profile.social + profile.innovation) / 40)
    };
  }

  // 生成戰鬥日誌哈希
  async generateBattleHash(battleId: string, result: BattleHistory): Promise<string> {
    return this.blockchainService.generateHash({
      battleId,
      result,
      timestamp: new Date().toISOString()
    });
  }

  // 創建神聖契約
  async createSacredContract(
    playerId: string,
    strategies: string[],
    totalXP: number
  ): Promise<SacredContract> {
    const contract: SacredContract = {
      id: uuidv4(),
      playerId,
      strategies,
      totalXP,
      signature: await this.blockchainService.generateSignature(playerId),
      timestamp: new Date().toISOString(),
      hash: await this.blockchainService.generateHash({
        playerId,
        strategies,
        totalXP,
        timestamp: new Date().toISOString()
      }),
      verified: false,
      isoReference: 'ISO-14064-1'
    };

    // 存入證據庫
    await this.evidenceVault.storeEvidence({
      type: 'sacred_contract',
      data: contract,
      hash: contract.hash
    });

    return contract;
  }

  // 檢查並解鎖成就
  checkAchievements(
    currentState: GameSaveData,
    achievements: Achievement[]
  ): Achievement[] {
    const unlocked: Achievement[] = [];

    for (const achievement of achievements) {
      if (achievement.unlockedAt) continue;

      let unlockedFlag = false;

      switch (achievement.type) {
        case 'battle':
          if (achievement.type === 'battle' && typeof achievement.requirement === 'number') {
            if (achievement.id === 'first-victory' && currentState.playerState.battleHistory.wins >= 1) {
              unlockedFlag = true;
            }
            if (achievement.id === 'carbon-slayer' && currentState.playerState.battleHistory.wins >= 10) {
              unlockedFlag = true;
            }
            if (achievement.id === 'century-warrior' && currentState.playerState.battleHistory.wins >= 100) {
              unlockedFlag = true;
            }
          }
          break;
        case 'collection':
          if (currentState.collectedCards.length >= achievement.requirement) {
            unlockedFlag = true;
          }
          break;
        case 'evolution':
          if (currentState.playerState.level >= achievement.requirement) {
            unlockedFlag = true;
          }
          break;
      }

      if (unlockedFlag) {
        achievement.unlockedAt = new Date().toISOString();
        unlocked.push(achievement);
      }
    }

    return unlocked;
  }

  // 生成每日任務
  generateDailyQuests(): GameEvent[] {
    const shuffled = [...DAILY_QUESTS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3).map((quest, index) => ({
      id: `daily-${Date.now()}-${index}`,
      type: 'daily' as const,
      title: quest.title,
      description: quest.description,
      rewards: [quest.reward],
      requirements: [String(quest.requirement)],
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }));
  }

  // 生成每週任務
  generateWeeklyQuests(): GameEvent[] {
    return WEEKLY_QUESTS.map((quest, index) => ({
      id: `weekly-${Date.now()}-${index}`,
      type: 'weekly' as const,
      title: quest.title,
      description: quest.description,
      rewards: [quest.reward],
      requirements: [String(quest.requirement)],
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }));
  }
}