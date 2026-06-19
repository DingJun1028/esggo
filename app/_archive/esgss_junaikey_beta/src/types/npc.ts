/**
 * 🎭 善向永續村 AI RPG 卡牌遊戲 - NPC 角色類型定義
 * ============================================================================
 * [來源備註] 源自 DingJun (洪鼎竣) 的善向永續村設計
 * [零幻覺驗證] 透過 Hash Lock 確保 Vibe Coding 過程數據不位移
 * ============================================================================
 */

import { IComponentCore } from '../services/ceremony/index.js';

/**
 * NPC 角色類別
 */
export type NPCCategory = 'mentor' | 'guide' | 'partner' | 'guardian';

/**
 * 四大支柱類型
 */
export type Pillar = 'Truth' | 'Goodness' | 'Transparent' | 'Trackable';

/**
 * 技能接口
 */
export interface ISkill {
  /** 技能 ID */
  readonly id: string;
  /** 技能名稱 */
  readonly name: string;
  /** 技能名稱（中文） */
  readonly nameZh: string;
  /** 技能描述 */
  readonly description: string;
  /** 技能效果類型 */
  readonly effectType: 'heal' | 'buff' | 'debuff' | 'damage' | 'utility';
  /** 技能效果值 */
  readonly potency: number;
  /** 冷卻時間（回合） */
  readonly cooldown: number;
  /** 消耗 RS */
  readonly rsCost: number;
  /** 目標類型 */
  readonly targetType: 'self' | 'single' | 'all_enemies' | 'all_allies';
}

/**
 * NPC 角色卡接口
 * 遵循 IComponentCore 規範
 */
export interface INPCCard extends IComponentCore {
  /** NPC 類別 */
  readonly category: NPCCategory;
  /** 所屬支柱 */
  readonly pillar: Pillar;
  /** 基礎靈魂共鳴值 */
  readonly rs_base: number;
  /** 技能列表 */
  readonly skills: ISkill[];
  /** 村莊日常功能 */
  readonly village_function: string;
  /** 視覺風格描述 */
  readonly visualStyle: string;
  /** ESG 數據 */
  readonly esgStats: {
    E: number; // 環境影響力
    S: number; // 社會貢獻度
    G: number; // 治理透明度
  };
}

/**
 * 抽卡結果接口
 */
export interface IDrawResult {
  /** 抽到的 NPC 卡片 */
  readonly card: INPCCard;
  /** 抽卡動畫幀數 */
  readonly animationFrame: number;
  /** 是否有稀有度加成 */
  readonly rarityBonus: number;
  /** RS 變化 */
  readonly rsChange: number;
}

/**
 * 戰鬥行動接口
 */
export interface IBattleAction {
  /** 行動 ID */
  readonly id: string;
  /** 發動者 UUID */
  readonly actorId: string;
  /** 技能 ID */
  readonly skillId: string;
  /** 目標 UUID 列表 */
  readonly targetIds: string[];
  /** 行動結果 */
  readonly result: {
    /** 傷害/治療量 */
    amount: number;
    /** 狀態變化 */
    statusChanges: string[];
    /** RS 變化 */
    rsChange: number;
  };
}

/**
 * 戰鬥狀態接口
 */
export interface IBattleState {
  /** 玩家 RS */
  playerRS: number;
  /** 敵方 RS (熵值) */
  enemyEntropy: number;
  /** 回合數 */
  turnCount: number;
  /** 5T 共鳴加成 */
  t5tBonus: number;
  /** 行動歷史 */
  actionHistory: IBattleAction[];
}

/**
 * 村莊任務接口
 */
export interface IVillageQuest {
  /** 任務 ID */
  readonly id: string;
  /** 任務標題 */
  readonly title: string;
  /** 任務描述 */
  readonly description: string;
  /** 所需 RS */
  readonly requiredRS: number;
  /** 獎勵 RS */
  readonly rewardRS: number;
  /** 建議 NPC */
  readonly suggestedNPC?: string;
  /** 任務狀態 */
  readonly status: 'available' | 'in_progress' | 'completed';
}

/**
 * 村莊日常功能接口
 */
export interface IVillageFunction {
  /** 功能 ID */
  readonly id: string;
  /** 功能名稱 */
  readonly name: string;
  /** 功能類型 */
  readonly type: 'mentor_station' | 'alliance_hall' | 'quest_board' | 'card_draw';
  /** 開放時間 */
  readonly openHours: string;
  /** RS 消耗 */
  readonly rsCost: number;
  /** 功能描述 */
  readonly description: string;
}
