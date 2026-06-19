/**
 * 永續夥伴遊戲化系統 - TypeScript 類型定義
 * AI Partner Gamification System - Type Definitions
 */

// ============================================================================
// 核心屬性系統
// ============================================================================

/**
 * AI 夥伴核心屬性 (Combined Schema for v6.0 Mechanics)
 * Incorporates both Virtues (for calculation) and Combat Stats (for gameplay).
 */
export interface PartnerAttributes {
  // --- 戰鬥屬性 (Combat Stats) ---
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  speed: number;

  // --- 核心德行 (Virtues / IMeritProfile10) ---
  intelligence: number; // 智
  benevolence: number;  // 仁
  courage: number;      // 勇
  integrity: number;    // 誠
  temperance: number;   // 節
  harmony: number;      // 和

  // --- 擴展屬性 (Extended) ---
  wisdom: number;
  creativity: number;
  precision: number;
  empathy: number;
  efficiency: number;
  luck: number;
  charisma: number;
}

/**
 * AI 夥伴成長參數
 */
export interface GrowthParameters {
  totalSkillsUsed: number; // 總技能使用次數
  questsCompleted: number; // 完成任務數
  cardsCollected: number; // 收集卡牌數
  epicAbilitiesUnlocked: number; // 史詩奧義數
  legendaryAbilitiesUnlocked: number; // 傳說奧義數
  totalPlayTime: number; // 總遊戲時間 (秒)
}

/**
 * AI 夥伴完整資料
 */
export interface AIPartner {
  id: string;
  userId: string;
  name: string;

  // 等級系統
  level: number; // 當前等級 (1-100)
  experience: number; // 當前經驗值
  experienceToNext: number; // 升級所需經驗

  // 屬性
  attributes: PartnerAttributes;
  meridian?: 'INWARD_REN' | 'OUTWARD_DU'; // For MeridianAwakening

  // 成長參數
  growth: GrowthParameters;

  // 天賦點數
  talentPoints: {
    available: number;
    total: number;
    spent: number;
  };

  // 時間戳
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
}

// ============================================================================
// 技能系統
// ============================================================================

/**
 * 技能類型
 */
export enum PartnerSkillType {
  ACTIVE = 'active', // 主動技能
  PASSIVE = 'passive', // 被動技能
}

/**
 * 稀有度
 */
export enum PartnerRarity {
  COMMON = 'common', // 普通 (白色)
  UNCOMMON = 'uncommon', // 非凡 (綠色)
  RARE = 'rare', // 稀有 (藍色)
  EPIC = 'epic', // 史詩 (紫色)
  LEGENDARY = 'legendary', // 傳說 (橙色)
  MYTHIC = 'mythic', // 神話 (紅色)
}

/**
 * 技能詞條
 */
export interface SkillAffix {
  id: string;
  name: string;
  description: string;
  rarity: PartnerRarity;

  // 增強效果
  bonuses: {
    effectivenessBonus?: number; // 效果加成 (%)
    speedBonus?: number; // 速度加成 (%)
    qualityBonus?: number; // 品質加成 (%)
    criticalChance?: number; // 暴擊機率 (%)
    criticalDamage?: number; // 暴擊傷害 (%)
  };

  // 獲得機率
  dropChance: number;

  // 獲得時間
  obtainedAt: Date;
}

/**
 * 技能效果
 */
export interface SkillEffect {
  type: string;
  value: number;
  duration?: number;
  description: string;
}

/**
 * 技能
 */
export interface Skill {
  id: string;
  name: string;
  description: string;
  type: PartnerSkillType;
  rarity: PartnerRarity;

  // 等級
  level: number; // 技能等級 (1-10)
  experience: number; // 技能經驗值
  experienceToNext: number; // 升級所需經驗

  // 詞條
  affixes: SkillAffix[];

  // 效果
  effects: SkillEffect[];

  // 需求
  requirements: {
    partnerLevel: number;
    talentPoints?: number;
    prerequisiteSkills?: string[];
  };

  // 使用統計
  usageCount: number;
  lastUsedAt?: Date;

  // 解鎖時間
  unlockedAt: Date;
}

// ============================================================================
// 天賦星盤系統
// ============================================================================

/**
 * 天賦節點
 */
export interface TalentNode {
  id: string;
  name: string;
  description: string;
  constellation:
  | 'knowledge'
  | 'action'
  | 'harmony'
  | 'perception'
  | 'memory'
  | 'reasoning'
  | 'communication'
  | 'safety'
  | 'learning';
  tier: number; // 層級 (1-5)
  position: {
    x: number;
    y: number;
  };

  // 需求
  requires: string[]; // 前置天賦 ID
  cost: number; // 點數消耗

  // 效果
  bonuses: AttributeBonus[];
  unlockedSkills?: string[];

  // 狀態
  unlocked: boolean;
  unlockedAt?: Date;
}

/**
 * 屬性加成
 */
export interface AttributeBonus {
  attribute: keyof PartnerAttributes | 'all';
  value: number;
  type: 'flat' | 'percentage';
}

/**
 * 星盤
 */
export interface StarChart {
  partnerId: string;

  // 天賦節點
  nodes: Record<string, TalentNode>;

  // 天賦點數
  talentPoints: {
    available: number;
    total: number;
    spent: number;
  };

  // 統計
  stats: {
    knowledgeNodesUnlocked: number;
    actionNodesUnlocked: number;
    harmonyNodesUnlocked: number;
  };
}

// ============================================================================
// 奧義系統
// ============================================================================

/**
 * 奧義層級
 */
export enum UltimateTier {
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

/**
 * 奧義效果
 */
export interface UltimateEffect {
  type: string;
  power: number;
  duration?: number;
  description: string;
}

/**
 * 奧義
 */
export interface UltimateAbility {
  id: string;
  name: string;
  description: string;
  tier: UltimateTier;

  // 解鎖條件
  unlockConditions: {
    questId?: string;
    level?: number;
    skillsRequired?: string[];
    cardsRequired?: string[];
  };

  // 效果
  effects: UltimateEffect[];

  // 冷卻
  cooldown: number; // 冷卻時間 (秒)
  lastUsedAt?: Date;

  // 狀態
  unlocked: boolean;
  unlockedAt?: Date;
  usageCount: number;
}

// ============================================================================
// 卡牌系統
// ============================================================================

/**
 * 卡牌類型
 */
export enum CardType {
  SKILL = 'skill', // 技能卡
  ABILITY = 'ability', // 奧義卡
  EQUIPMENT = 'equipment', // 裝備卡
  ITEM = 'item', // 道具卡
  ARTIFACT = 'artifact', // 神器卡
  ESG = 'esg', // ESG 卡
  SERVICE = 'service', // 服務解鎖卡
}

/**
 * 卡牌效果
 */
export interface CardEffect {
  type: string;
  value: number;
  description: string;
}

/**
 * 奧秘卡牌
 */
export interface OmniCard {
  id: string;
  name: string;
  type: CardType;
  rarity: PartnerRarity;

  // 卡面資訊
  artwork: string; // 圖片 URL
  description: string;
  flavorText: string; // 風味文字

  // 效果
  effects: CardEffect[];

  // 稀有度統計
  serialNumber?: number; // 序號
  totalPrinted?: number; // 總發行量

  // 收藏資訊
  collectedAt?: Date;
  isEquipped: boolean;
}

/**
 * ESG 卡牌
 */
export interface ESGCard extends OmniCard {
  type: CardType.ESG;

  // ESG 特定屬性
  esgCategory: 'environmental' | 'social' | 'governance';
  framework: 'GRI' | 'TCFD' | 'SASB' | 'SDGs';

  // 卡牌效果
  bonuses: {
    knowledgeBonus?: number;
    reportQuality?: number;
    complianceBonus?: number;
  };
}

/**
 * 卡牌套組
 */
export interface CardSet {
  id: string;
  name: string;
  description: string;
  cards: string[]; // 卡牌 ID

  // 套組獎勵
  setBonus: {
    cardsRequired: number;
    bonus: AttributeBonus[];
  };

  // 進度
  collected: number;
  total: number;
  completed: boolean;
}

/**
 * 卡牌收藏
 */
export interface CardCollection {
  partnerId: string;

  // 卡牌列表
  cards: OmniCard[];

  // 統計
  totalCards: number;
  collectedCards: number;
  completionRate: number;

  // 分類統計
  byType: Record<CardType, number>;
  byRarity: Record<PartnerRarity, number>;

  // 套組
  sets: CardSet[];
}

// ============================================================================
// 裝備系統
// ============================================================================

/**
 * 裝備槽位
 */
export enum EquipmentSlot {
  WEAPON = 'weapon', // 武器
  ARMOR = 'armor', // 護甲
  ACCESSORY_1 = 'accessory_1', // 飾品 1
  ACCESSORY_2 = 'accessory_2', // 飾品 2
  ARTIFACT = 'artifact', // 神器
}

/**
 * 裝備效果
 */
export interface EquipmentEffect {
  type: string;
  value: number;
  description: string;
}

/**
 * 升級材料
 */
export interface Material {
  id: string;
  name: string;
  quantity: number;
}

/**
 * 裝備
 */
export interface Equipment {
  id: string;
  name: string;
  description: string;
  slot: EquipmentSlot;
  rarity: PartnerRarity;

  // 等級
  level: number;
  maxLevel: number;

  // 屬性加成
  stats: AttributeBonus[];

  // 特殊效果
  specialEffects: EquipmentEffect[];

  // 升級
  upgradeMaterials?: Material[];

  // 狀態
  equipped: boolean;
  equippedAt?: Date;
  obtainedAt: Date;
}

// ============================================================================
// 任務系統
// ============================================================================

/**
 * 任務類型
 */
export enum QuestType {
  DAILY = 'daily', // 每日任務
  WEEKLY = 'weekly', // 每週任務
  EPIC = 'epic', // 史詩任務
  LEGENDARY = 'legendary', // 傳說任務
  STORY = 'story', // 劇情任務
}

/**
 * 任務目標
 */
export interface QuestObjective {
  id: string;
  description: string;
  type: string;
  target: number;
  current: number;
  completed: boolean;
}

/**
 * 任務獎勵
 */
export interface QuestReward {
  experience: number;
  talentPoints?: number;
  cards?: string[];
  equipment?: string[];
  gold?: number;
}

/**
 * 任務
 */
export interface Quest {
  id: string;
  name: string;
  description: string;
  type: QuestType;

  // 目標
  objectives: QuestObjective[];

  // 獎勵
  rewards: QuestReward;

  // 進度
  progress: number;
  completed: boolean;
  completedAt?: Date;

  // 時間限制
  expiresAt?: Date;
}

// ============================================================================
// 經驗值計算
// ============================================================================

/**
 * 計算升級所需經驗
 */
export function calculateExperienceToNextLevel(level: number): number {
  // 指數成長公式
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * 計算總經驗值
 */
export function calculateTotalExperience(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += calculateExperienceToNextLevel(i);
  }
  return total;
}

/**
 * 獲得經驗值
 */
export interface ExperienceGain {
  amount: number;
  source: string;
  timestamp: Date;
}

// ============================================================================
// ESG 益智問答 (卡片解鎖)
// ============================================================================

/**
 * 問答難度
 */
export enum TriviaDifficulty {
  EASY = 'easy', // 簡單 (解鎖 Common/Uncommon)
  MEDIUM = 'medium', // 中等 (解鎖 Rare/Epic)
  HARD = 'hard', // 困難 (解鎖 Legendary)
  MASTER = 'master', // 大師 (解鎖 Mythic)
}

/**
 * 問答題目
 */
export interface TriviaQuestion {
  id: string;
  category: 'environmental' | 'social' | 'governance' | 'sdgs' | 'framework';
  difficulty: TriviaDifficulty;
  question: string;
  options: string[];
  correctAnswer: number; // 0-3
  explanation: string;
  relatedCardId?: string; // 關聯卡片 ID
}

/**
 * 問答挑戰
 */
export interface QuizChallenge {
  id: string;
  partnerId: string;
  targetCardId: string; // 目標解鎖卡片
  difficulty: TriviaDifficulty;

  // 題目列表
  questions: TriviaQuestion[];
  currentQuestionIndex: number;

  // 答題記錄
  answers: number[]; // 用戶選擇的答案索引
  score: number; // 當前分數

  // 狀態
  startedAt: Date;
  completedAt?: Date;
  passed: boolean;
}

// ============================================================================
// 夥伴親密度
// ============================================================================

export interface AffinityHistoryEntry {
  date: string;
  action: string;
  change: number;
}

export interface PartnerAffinity {
  partnerId: string;
  level: number;
  currentExp: number;
  maxExp: number;
  history: AffinityHistoryEntry[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: any;
}
