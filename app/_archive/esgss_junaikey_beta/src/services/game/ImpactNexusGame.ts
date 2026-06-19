/**
 * 🎭 善向永續村 AI RPG 卡牌遊戲 - 影響力連結遊戲引擎
 * ============================================================================
 * [來源備註] 源自 DingJun (洪鼎竣) 的善向永續村設計
 * [零幻覺驗證] 透過 Hash Lock 確保 Vibe Coding 過程數據不位移
 * 
 * 包含：
 * - 卡牌抽卡動畫 (整合 QuantumEntanglement)
 * - RS 計算公式
 * - 戰鬥系統 (熵增魔 vs 修補)
 * - 5T 共鳴加成
 * ============================================================================
 */

import { 
  INPCCard, 
  IDrawResult, 
  IBattleAction, 
  IBattleState,
  IVillageQuest,
  ISkill 
} from '@/types/npc.js';
import { NPC_CARDS } from '@/data/npcs.js';
import { 
  ComponentCoreFactory, 
  IComponentCore,
  AlchemyForge,
  createAlchemyForge 
} from '@/services/ceremony.js';

/**
 * 抽卡動畫幀配置
 */
export interface DrawAnimationConfig {
  /** 動畫持續時間 (ms) */
  duration: number;
  /** 量子纏繞強度 */
  entanglementStrength: number;
  /** 光暈擴散速度 */
  haloSpreadSpeed: number;
}

/**
 * RS 計算配置
 */
export interface RSCalculationConfig {
  /** 基礎加成倍率 */
  baseMultiplier: number;
  /** 5T 共鳴加成 */
  t5tBonus: number;
  /** 技能協調加成 */
  skillSynergyBonus: number;
}

/**
 * 戰鬥配置
 */
export interface BattleConfig {
  /** 初始玩家 RS */
  initialPlayerRS: number;
  /** 初始敵方熵值 */
  initialEnemyEntropy: number;
  /** 最大回合數 */
  maxTurns: number;
  /** 勝利閾值 (RS > 此值則勝利) */
  victoryThreshold: number;
  /** 失敗閾值 (RS < 此值則失敗) */
  defeatThreshold: number;
}

/**
 * 預設配置
 */
export const DEFAULT_DRAW_ANIMATION: DrawAnimationConfig = {
  duration: 2000,
  entanglementStrength: 0.8,
  haloSpreadSpeed: 1.2,
};

export const DEFAULT_RS_CALCULATION: RSCalculationConfig = {
  baseMultiplier: 1.0,
  t5tBonus: 0.25, // 25% 5T 共鳴加成
  skillSynergyBonus: 0.15,
};

export const DEFAULT_BATTLE: BattleConfig = {
  initialPlayerRS: 100,
  initialEnemyEntropy: 80,
  maxTurns: 10,
  victoryThreshold: 150,
  defeatThreshold: 30,
};

/**
 * 影響力連結遊戲引擎
 */
export class ImpactNexusGame {
  private core: IComponentCore;
  private alchemyForge: AlchemyForge;
  private drawAnimation: DrawAnimationConfig;
  private rsConfig: RSCalculationConfig;
  private battleConfig: BattleConfig;
  private playerDeck: INPCCard[];
  private playerHand: INPCCard[];
  private battleState: IBattleState;

  constructor() {
    this.core = ComponentCoreFactory.create(
      'services/game/ImpactNexusGame.ts',
      '1.0.0',
      ['Game', 'Card', 'Battle', 'RS', '5T']
    );
    this.alchemyForge = createAlchemyForge();
    this.drawAnimation = DEFAULT_DRAW_ANIMATION;
    this.rsConfig = DEFAULT_RS_CALCULATION;
    this.battleConfig = DEFAULT_BATTLE;
    this.playerDeck = [];
    this.playerHand = [];
    this.battleState = {
      playerRS: this.battleConfig.initialPlayerRS,
      enemyEntropy: this.battleConfig.initialEnemyEntropy,
      turnCount: 1,
      t5tBonus: 0,
      actionHistory: [],
    };
  }

  /**
   * 初始化牌組
   */
  initializeDeck(cards: INPPCard[]): void {
    this.playerDeck = [...cards];
    this.shuffleDeck();
  }

  /**
   * 洗牌
   */
  shuffleDeck(): void {
    for (let i = this.playerDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.playerDeck[i], this.playerDeck[j]] = [this.playerDeck[j], this.playerDeck[i]];
    }
  }

  /**
   * 抽卡 (整合量子纏繞動畫)
   */
  async drawCard(animation?: Partial<DrawAnimationConfig>): Promise<IDrawResult> {
    const config = { ...this.drawAnimation, ...animation };
    
    if (this.playerDeck.length === 0) {
      this.shuffleDeck();
    }

    const card = this.playerDeck.pop()!;
    const animationFrame = Math.floor(config.duration / 16); // 60fps
    const rarityBonus = this.calculateRarityBonus(card);
    const rsChange = this.calculateDrawRS(rarityBonus);

    // 更新手牌
    this.playerHand.push(card);

    // 模擬抽卡動畫延遲
    await this.simulateDrawAnimation(config, card);

    return {
      card,
      animationFrame,
      rarityBonus,
      rsChange,
    };
  }

  /**
   * 模擬抽卡動畫
   */
  private async simulateDrawAnimation(config: DrawAnimationConfig, card: INPCCard): Promise<void> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed < config.duration) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(animate);
    });
  }

  /**
   * 計算稀有度加成
   */
  private calculateRarityBonus(card: INPCCard): number {
    const baseBonus = 1.0;
    const categoryBonus = card.category === 'mentor' ? 0.5 : 
                          card.category === 'guardian' ? 0.3 : 0.2;
    const pillarBonus = card.pillar === 'Truth' ? 0.1 : 
                        card.pillar === 'Trackable' ? 0.1 : 0.05;
    return baseBonus + categoryBonus + pillarBonus;
  }

  /**
   * 計算抽卡 RS 變化
   */
  private calculateDrawRS(rarityBonus: number): number {
    return Math.floor(this.rsConfig.baseMultiplier * rarityBonus * 10);
  }

  /**
   * 計算 RS 共鳴值
   */
  calculateRS(skills: ISkill[], t5tActive: boolean = false): number {
    const baseRS = skills.reduce((sum, skill) => sum + skill.potency, 0);
    const synergyBonus = this.rsConfig.skillSynergyBonus;
    const t5tBonus = t5tActive ? this.rsConfig.t5tBonus : 0;
    
    return Math.floor(
      baseRS * (1 + synergyBonus) * (1 + t5tBonus)
    );
  }

  /**
   * 執行戰鬥行動
   */
  async executeBattleAction(
    actor: INPCCard,
    skill: ISkill,
    targetIds: string[]
  ): Promise<IBattleAction> {
    // 計算行動結果
    const baseAmount = skill.potency;
    const rsModifier = this.battleState.playerRS / 100;
    const t5tModifier = 1 + this.battleState.t5tBonus;
    const finalAmount = Math.floor(baseAmount * rsModifier * t5tModifier);

    // 根據技能類型計算效果
    const actualAmount = finalAmount;
    const statusChanges: string[] = [];

    if (skill.effectType === 'damage') {
      // 對敵方造成傷害 (降低熵值)
      this.battleState.enemyEntropy = Math.max(
        0, 
        this.battleState.enemyEntropy - actualAmount
      );
      statusChanges.push(`敵方熵值降低 ${actualAmount}`);
    } else if (skill.effectType === 'heal') {
      // 恢復玩家 RS
      this.battleState.playerRS = Math.min(
        this.battleConfig.victoryThreshold * 1.5,
        this.battleState.playerRS + actualAmount
      );
      statusChanges.push(`玩家 RS 恢復 ${actualAmount}`);
    } else if (skill.effectType === 'buff') {
      // 增益效果
      this.battleState.t5tBonus = Math.min(0.5, this.battleState.t5tBonus + 0.1);
      statusChanges.push(`5T 共鳴加成提升至 ${(this.battleState.t5tBonus * 100).toFixed(0)}%`);
    }

    // 記錄行動
    const action: IBattleAction = {
      id: `action-${Date.now()}`,
      actorId: actor.uuid,
      skillId: skill.id,
      targetIds,
      result: {
        amount: actualAmount,
        statusChanges,
        rsChange: skill.effectType === 'heal' ? actualAmount : 
                  skill.effectType === 'damage' ? -actualAmount : 0,
      },
    };

    this.battleState.actionHistory.push(action);

    // 回合結束處理
    this.endTurn();

    return action;
  }

  /**
   * 回合結束處理
   */
  private endTurn(): void {
    this.battleState.turnCount++;

    // 熵增魔效果：每回合敵方熵值增加
    this.battleState.enemyEntropy = Math.min(
      this.battleConfig.initialEnemyEntropy * 2,
      this.battleState.enemyEntropy + 10
    );

    // 5T 共鳴加成隨回合衰減
    this.battleState.t5tBonus = Math.max(0, this.battleState.t5tBonus - 0.02);
  }

  /**
   * 檢查戰鬥結果
   */
  checkBattleResult(): 'victory' | 'defeat' | 'ongoing' | 'draw' {
    if (this.battleState.playerRS >= this.battleConfig.victoryThreshold) {
      return 'victory';
    }
    if (this.battleState.playerRS <= this.battleConfig.defeatThreshold) {
      return 'defeat';
    }
    if (this.battleState.turnCount >= this.battleConfig.maxTurns) {
      return this.battleState.playerRS > this.battleState.enemyEntropy ? 'victory' : 'draw';
    }
    return 'ongoing';
  }

  /**
   * 獲取當前戰鬥狀態
   */
  getBattleState(): Readonly<IBattleState> {
    return { ...this.battleState };
  }

  /**
   * 獲取玩家手牌
   */
  getHand(): Readonly<INPCCard[]> {
    return [...this.playerHand];
  }

  /**
   * 獲取剩餘牌數
   */
  getDeckCount(): number {
    return this.playerDeck.length;
  }

  /**
   * 計算 5T 共鳴加成
   */
  calculateT5TResonance(
    tangible: number,
    traceable: number,
    trackable: number,
    transparent: number,
    trustworthy: number
  ): number {
    const avgT5T = (tangible + traceable + trackable + transparent + trustworthy) / 5;
    const t5tBonus = avgT5T * 0.25; // 5T 平均值 * 25%
    this.battleState.t5tBonus = t5tBonus;
    return t5tBonus;
  }

  /**
   * 重置戰鬥
   */
  resetBattle(): void {
    this.battleState = {
      playerRS: this.battleConfig.initialPlayerRS,
      enemyEntropy: this.battleConfig.initialEnemyEntropy,
      turnCount: 1,
      t5tBonus: 0,
      actionHistory: [],
    };
    this.playerHand = [];
  }
}

/**
 * 創建遊戲引擎工廠函數
 */
export function createImpactNexusGame(): ImpactNexusGame {
  return new ImpactNexusGame();
}

/**
 * 村莊任務管理器
 */
export class VillageQuestManager {
  private quests: IVillageQuest[] = [];
  private completedQuests: Set<string> = new Set();

  constructor() {
    this.initializeQuests();
  }

  /**
   * 初始化任務列表
   */
  private initializeQuests(): void {
    this.quests = [
      {
        id: 'quest-001',
        title: '初入永續村',
        description: '與村莊守衛對話，了解村莊的基本規則',
        requiredRS: 0,
        rewardRS: 20,
        status: 'available',
      },
      {
        id: 'quest-002',
        title: '尋找壽司博士',
        description: '前往永恆記憶庫，尋找壽司博士的指引',
        requiredRS: 10,
        rewardRS: 30,
        suggestedNPC: 'npc-thoth-001',
        status: 'available',
      },
      {
        id: 'quest-003',
        title: '真理脈衝挑戰',
        description: '接受山衛科技的真理脈衝測試',
        requiredRS: 25,
        rewardRS: 50,
        suggestedNPC: 'npc-sunway-001',
        status: 'available',
      },
      {
        id: 'quest-004',
        title: '四大支柱巡禮',
        description: '完成四大支柱的入門試煉',
        requiredRS: 50,
        rewardRS: 100,
        status: 'available',
      },
      {
        id: 'quest-005',
        title: '熵增魔入侵',
        description: '對抗入侵村莊的熵增魔',
        requiredRS: 80,
        rewardRS: 150,
        status: 'available',
      },
    ];
  }

  /**
   * 獲取可用任務
   */
  getAvailableQuests(): IVillageQuest[] {
    return this.quests.filter((q) => 
      q.status === 'available' && 
      !this.completedQuests.has(q.id)
    );
  }

  /**
   * 獲取進行中任務
   */
  getInProgressQuests(): IVillageQuest[] {
    return this.quests.filter((q) => q.status === 'in_progress');
  }

  /**
   * 獲取已完成任務
   */
  getCompletedQuests(): IVillageQuest[] {
    return this.quests.filter((q) => this.completedQuests.has(q.id));
  }

  /**
   * 開始任務
   */
  startQuest(questId: string): boolean {
    const quest = this.quests.find((q) => q.id === questId);
    if (quest && quest.status === 'available') {
      quest.status = 'in_progress';
      return true;
    }
    return false;
  }

  /**
   * 完成任務
   */
  completeQuest(questId: string): number | null {
    const quest = this.quests.find((q) => q.id === questId);
    if (quest && quest.status === 'in_progress') {
      quest.status = 'completed';
      this.completedQuests.add(questId);
      return quest.rewardRS;
    }
    return null;
  }
}

/**
 * 創建任務管理器工廠函數
 */
export function createVillageQuestManager(): VillageQuestManager {
  return new VillageQuestManager();
}
