/**
 * 🎮 善向永續村 - 遊戲與 ESG 系統整合入口
 * Sustainability Village - Game & ESG System Integration Hub
 * 
 * 深貫廣通 無縫接軌
 * Deep Penetration, Broad Connection, Seamless Integration
 */

// ============================================
// 史詩故事系統 - Epic Story System
// 生動刻畫, 大量故事劇情, 史詩英雄類別
// ============================================
export { StoryCampaign } from './StoryCampaign';
export type { HeroArchetype, StoryChapter, StoryScene } from './StoryCampaign';

export { PersonalJourney } from './PersonalJourney';
export type { JourneyMilestone, JourneyEvent } from './PersonalJourney';

export { EpicBossEncounters } from './EpicBossEncounters';
export type { EpicBoss, BattleRecord } from './EpicBossEncounters';

export { EcologicalAlliancePartners } from './EcologicalAlliancePartners';
export type { AlliancePartner, PartnerStoryEvent } from './EcologicalAlliancePartners';

export { EcoPartnersHeroStories } from './EcoPartnersHeroStories';
export type { EcoPartnerHero } from './EcoPartnersHeroStories';

export { LanguageLearningSystem } from './LanguageLearningSystem';

// ============================================
// 遊戲核心組件
// ============================================
export { SustainabilityVillage } from './SustainabilityVillage';
export type { SustainabilityVillageProps } from './SustainabilityVillage';

export { BattleArena } from './BattleArena';
export type { BattleArenaProps, BattleResult } from './BattleArena';

export { DigitalTwin } from './DigitalTwin';
export type { DigitalTwinProps } from './DigitalTwin';

export { KnowledgeLibrary } from './KnowledgeLibrary';
export type { KnowledgeLibraryProps } from './KnowledgeLibrary';

export { SacredContract } from './SacredContract';
export type { SacredContractProps, ContractData } from './SacredContract';

export { EntropyTimer } from './EntropyTimer';
export type { EntropyTimerProps } from './EntropyTimer';

export { CardDisplay, CardGrid } from './CardDisplay';
export type { CardDisplayProps, CardGridProps } from './CardDisplay';

export { GameStore } from './GameStore';
export type { GameStoreProps } from './GameStore';

export { QuestSystem } from './QuestSystem';
export type { QuestSystemProps, Quest } from './QuestSystem';

export { Achievements } from './Achievements';
export type { AchievementsProps } from './Achievements';

export { GameRewardNotification, BatchReward } from './GameRewardNotification';
export type { RewardNotificationProps, BatchRewardProps } from './GameRewardNotification';

// ESG 系統整合
export { GameDashboardWidget } from '@/components/dashboard/GameDashboardWidget';

// 遊戲服務
export { GameStateService } from './GameStateService';
export { BlockchainService } from './BlockchainService';
export { EvidenceVaultService } from './EvidenceVaultService';
export { GameProgressSyncService } from './GameProgressSyncService';

// 遊戲類型
export * from '@/types/game';

/**
 * 🎯 使用範例
 * 
 * // 1. 主遊戲入口
 * import { SustainabilityVillage } from '@/components/game';
 * 
 * <SustainabilityVillage 
 *   userId="user-123"
 *   mode="journey"
 * />
 * 
 * // 2. 史詩劇情
 * import { StoryCampaign } from '@/components/game';
 * 
 * <StoryCampaign 
 *   userId="user-123"
 *   onHeroSelect={(hero) => {}}
 * />
 * 
 * // 3. 個人旅程
 * import { PersonalJourney } from '@/components/game';
 * 
 * <PersonalJourney 
 *   userId="user-123"
 *   currentXP={1500}
 *   currentLevel={15}
 * />
 * 
 * // 4. Boss 戰役
 * import { EpicBossEncounters } from '@/components/game';
 * 
 * <EpicBossEncounters 
 *   userId="user-123"
 *   currentLevel={50}
 *   onBattleStart={(bossId) => {}}
 * />
 * 
 * // 5. 儀表板小組件
 * import { GameDashboardWidget } from '@/components/dashboard/GameDashboardWidget';
 * 
 * <GameDashboardWidget 
 *   userId="user-123"
 *   compact={false}
 * />
 * 
 * // 6. 服務整合
 * import { GameProgressSyncService } from '@/services/game';
 * 
 * const syncService = new GameProgressSyncService();
 * await syncService.syncBattleWin(userId, 'carbon', cards, score);
 * 
 * // 7. 獎勵通知
 * import { GameRewardNotification } from '@/components/game';
 * 
 * <GameRewardNotification
 *   reward={{ type: 'xp', value: 150, title: '任務完成!' }}
 *   onClose={() => {}}
 * />
 */

/**
 * 🔗 系統整合架構
 * 
 * 善向永續村
 *     │
 *     ├── 🎮 遊戲核心
 *     │   ├── 戰鬥系統 (BattleArena)
 *     │   ├── 卡牌系統 (CardDisplay, KnowledgeLibrary)
 *     │   └── AI 數位分身 (DigitalTwin)
 *     │
 *     ├── 📖 史詩故事系統 (Story System)
 *     │   ├── 史詩劇情 (StoryCampaign)
 *     │   ├── 個人旅程 (PersonalJourney)
 *     │   └── Boss 戰役 (EpicBossEncounters)
 *     │
 *     ├── 📊 進度系統
 *     │   ├── 等級經驗 (GameStateService)
 *     │   ├── 任務系統 (QuestSystem)
 *     │   ├── 成就系統 (Achievements)
 *     │   └── 獎勵通知 (GameRewardNotification)
 *     │
 *     ├── ⛓️ 區塊鏈系統
 *     │   ├── 神聖契約 (SacredContract)
 *     │   └── 區塊鏈服務 (BlockchainService)
 *     │
 *     └── 🔄 ESGSS 現有服務無縫接軌
 *         ├── ClimateRiskDashboard (氣候風險分析)
 *         ├── GovernanceManager (治理策略)
 *         ├── SmartRecommendationService (智能推薦)
 *         ├── BlockchainTransparency (決策透明度)
 *         └── KnowledgeSanctuaryService (知識聖殿)
 */

/**
 * 🌟 史詩英雄類別
 * 
 * 1. 綠色守護者 (Guardian)
 *    - 使命：讓世界重新呼吸
 *    - 故事：從小能與植物溝通的少年，在被熵增吞噬的世界中尋找希望
 *    - 技能：森林之心、生命湧泉、生態共鳴
 * 
 * 2. 正義使者 (Champion)
 *    - 使命：為無聲者發聲
 *    - 故事：從貧民窟出生的鬥士，為弱勢群體挺身而出
 *    - 技能：正義審判、公平之盾、團結之力
 * 
 * 3. 治理大師 (Master)
 *    - 使命：讓腐敗無所遁形
 *    - 故事：傳奇治理顧問，用透明與規則重建秩序
 *    - 技能：透視之眼、規則枷鎖、信任光環
 * 
 * 4. 氣候先驅 (Pioneer)
 *    - 使命：為地球而戰
 *    - 故事：預言了災難的科學家，帶領倖存者對抗氣候崩潰
 *    - 技能：氣候操控、碳中和爆發、科學洞察
 */

/**
 * 👹 傳說 Boss
 * 
 * 1. 熵增之王 (LV.10+)
 *    - 環境類 Boss，由過度消費和環境破壞誕生
 * 
 * 2. 血汗魔王 (LV.25+)
 *    - 社會類 Boss，代表對勞工的殘酷剝削
 * 
 * 3. 黑箱巨龍 (LV.40+)
 *    - 治理類 Boss，用謊言和隱瞞維護王國
 * 
 * 4. 溫室帝王 (LV.60+)
 *    - 氣候類 Boss，由數十億噸二氧化碳凝聚而成
 * 
 * 5. 混沌原初 (LV.90+)
 *    - 終極 Boss，集結了所有力量的存在
 */

/**
 * 📜 個人史詩旅程亮點
 * 
 * - 情感共鳴系統 (希望、勇氣、智慧、同理、決心)
 * - 里程碑敘事 (初戰告捷、綠色覺醒、正義之鳴...)
 * - 故事反思彈窗
 * - 每日/隨機事件選擇
 * - LV.99 永續大師終極目標
 */
