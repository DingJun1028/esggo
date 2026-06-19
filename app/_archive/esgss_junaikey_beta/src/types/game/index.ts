/**
 * 🎮 善向永續村遊戲類型定義
 * Sustainability Village Game Type Definitions
 */

// 卡牌稀有度
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// 卡牌類型
export type CardType = 'strategy' | 'event' | 'skill' | 'item';

// ESG 領域類別
export type ESGCategory = 'environment' | 'social' | 'governance' | 'climate' | 'general';

// ESG 卡牌介面
export interface ESGCard {
  id: string;
  name: string;
  type: CardType;
  category: ESGCategory;
  power: number;
  cost: number;
  effect: string;
  description: string;
  rarity: CardRarity;
  isoReference?: string;
  caseStudy?: string;
  weaknessTarget?: string[]; // 針對的敵人類型
  sourceOrigin?: string; // 來源追溯
  metadata?: Record<string, unknown>;
}

// 敵人類型
export interface Enemy {
  id: string;
  name: string;
  title: string;
  type: 'environment' | 'social' | 'governance';
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  description: string;
  weakness: string[];
  avatar: string;
}

// 戰鬥狀態
export interface BattleState {
  id: string;
  turn: number;
  playerHP: number;
  maxPlayerHP: number;
  enemyHP: number;
  maxEnemyHP: number;
  energy: number;
  maxEnergy: number;
  hand: ESGCard[];
  drawPile: ESGCard[];
  discardPile: ESGCard[];
  battleLog: BattleLogEntry[];
  status: 'active' | 'victory' | 'defeat';
}

export interface BattleLogEntry {
  turn: number;
  action: string;
  damage?: number;
  cardUsed?: string;
  timestamp: string;
}

// 玩家狀態
export interface PlayerState {
  id: string;
  level: number;
  xp: number;
  xpToNext: number;
  title: string;
  intimacy: number;
  personalityProfile: PersonalityProfile;
  deck: string[]; // 卡牌 ID 列表
  learnedStrategies: string[];
  battleHistory: BattleHistory;
  soul?: {
    agentId: string;
    name: string;
    resonance: number;
    manifestedAt: string;
  };
  certificates: Certificate[];
}

export interface PersonalityProfile {
  environmental: number; // 0-100
  social: number;
  governance: number;
  innovation: number;
}

export interface BattleHistory {
  wins: number;
  losses: number;
  streak: number;
  totalDamage: number;
  enemiesDefeated: string[];
}

// 旅程節點
export type JourneyStage =
  | 'welcome'
  | 'tutorial'
  | 'collection'
  | 'battle'
  | 'evolution'
  | 'certification';

export interface JourneyNode {
  id: string;
  stage: JourneyStage;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  unlocked: boolean;
  reward?: {
    type: 'card' | 'xp' | 'badge';
    value: string | number;
  };
}

// 知識領域
export interface KnowledgeDomain {
  id: string;
  name: string;
  nameEn: string;
  icon: React.ReactNode;
  color: string;
  cards: number;
  mastered: number;
  masteryProgress: number;
}

// 村莊狀態
export interface VillageState {
  entropy: number;
  level: number;
  reputation: number;
  lastActionTime: number;
  buildings: Building[];
}

export interface Building {
  id: string;
  name: string;
  level: number;
  unlocked: boolean;
  description: string;
}

// 證書/契約
export interface SacredContract {
  id: string;
  playerId: string;
  strategies: string[];
  totalXP: number;
  signature: string;
  timestamp: string;
  hash: string;
  verified: boolean;
  isoReference?: string;
}

export interface Certificate {
  id: string;
  title: string;
  isoReference?: string;
  earnedAt: string;
  hash: string;
  verified: boolean;
}

// AI 數位分身
export interface DigitalTwin {
  id: string;
  playerId: string;
  level: number;
  xp: number;
  personality: PersonalityProfile;
  decisionHistory: DecisionRecord[];
  certificates: Certificate[];
}

export interface DecisionRecord {
  id: string;
  scenario: string;
  decision: string;
  outcome: 'success' | 'partial' | 'failure';
  xpEarned: number;
  timestamp: string;
  hash: string;
}

// 遊戲事件
export interface GameEvent {
  id: string;
  type: 'daily' | 'weekly' | 'special' | 'limited';
  title: string;
  description: string;
  rewards: Reward[];
  requirements: string[];
  startTime: string;
  endTime: string;
}

export interface Reward {
  type: 'card' | 'xp' | 'badge' | 'currency';
  value: string | number;
  rarity?: CardRarity;
}

// 遊戲設定
export interface GameConfig {
  maxEnergy: number;
  energyRechargeRate: number; // 每分鐘回充能量
  baseXPMultiplier: number;
  entropyRate: number;
  entropyThreshold: number;
  cardPackCost: number;
}

// 存檔數據
export interface GameSaveData {
  playerState: PlayerState;
  villageState: VillageState;
  deck: ESGCard[];
  collectedCards: string[];
  certificates: Certificate[];
  contracts: SacredContract[];
  lastPlayed: string;
}

// 等級閾值配置
export const LEVEL_THRESHOLDS = [
  { level: 1, title: '實習生', color: 'from-slate-500 to-slate-600' },
  { level: 10, title: '分析師', color: 'from-brand-primary to-aqua-600' },
  { level: 25, title: '專案經理', color: 'from-t5-tangible to-emerald-600' },
  { level: 50, title: '永續顧問', color: 'from-t5-trackable to-purple-600' },
  { level: 75, title: 'ESG 策略師', color: 'from-t5-transparent to-amber-600' },
  { level: 99, title: '永續大師', color: 'from-t5-trustworthy to-red-600' }
];

// ---------------------------------------------------------------------------
// 🏙️ Village & Knowledge Types
// ---------------------------------------------------------------------------

// 5T 邏輯門狀態
export type LogicGateStatus = 'Tangible' | 'Traceable' | 'Trackable' | 'Transparent' | 'Trustworthy' | 'Pending';

// 🎴 卡牌四大類別 (4 Types of Cards) - Compatible with CardCategory
export type CardCategory = 'E' | 'S' | 'G' | 'Omni';
// E: Environmental (Green)
// S: Social (Pink)
// G: Governance (Blue)
// Omni: Omni/Special (Gold/Prismatic)

// 🌟 卡牌四種稀有度 (4 Rarity Tiers)
export type CardRank = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface IEvidence {
  tangible_def?: string;
  source_origin?: string;
  lifecycle_hooks?: string[];
  formula_ref?: string;
  hash_lock?: string;
}

export interface IKnowledgeCard {
  uuid: string;
  name: string;
  category: CardCategory;
  rank: CardRank;
  description: string;
  status: LogicGateStatus; // Current highest gate passed
  evidence: IEvidence;
  visual_theme: string;
  isSealed: boolean;
}

/** 
 * 🔱 三位一體遊戲回應結構 (Trinity Game Response)
 * 確保遊戲行為（如戰鬥、同步）遵循「概述-細節-延伸」標準
 */
export interface ITrinityGameResponse {
  info_one: {
    transaction_id: string;
    type: 'battle_result' | 'digital_twin_sync' | 'contract_sealed';
    timestamp: number;
    overview: {
      summary: string;
      primary_gain: { type: string; value: number | string };
      resonance_delta: number;
    };
    detail: {
      actions: Array<{ name: string; impact: number }>;
      efficiency_score: number;
      raw_metrics: Record<string, any>;
    };
    extension: {
      evolutionary_gain: string;
      next_steps: string[];
      metadata: Record<string, any>;
    };
  };
}
