/**
 * Social Economy Service
 *
 * Handles 'Social' and 'Economy' pillars of ESG.
 * Manages Social Impact Bonds (SIB), Community Engagement, and Fair Trade metrics.
 */

import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import {
  AmbassadorProfile,
  Guild,
  DebateState,
  DebateCard,
  UserSubscription,
  SocialUserSubscription,
  SubscriptionTier,
  WorldEvent,
  LeaderboardType,
  LeaderboardEntry,
} from '@/types';
import {
  IVillageCharacter,
  IVillageStats,
  IImpactCard,
  IBuilding,
  CardType,
  CardRarity,
  VillageBuildingType,
  ITokenTransaction
} from '@/types/esg/village';
import {
  ITrinityService,
  IInfoOneTrinity,
  IOmniComponent,
  IOmniKB,
  IOmniTag,
  Protocol5T,
  TrinityComponentState
} from '@/omni/core/types/InfoOne.types';
import { TrinityManager } from '@/omni/infrastructure/synchronization/TrinityManager';
import { OmniComponentState } from '@/omni/core/types/OmniCore.types';

export interface ISocialMetric {
  id: string;
  category: 'LABOR' | 'COMMUNITY' | 'DIVERSITY' | 'HUMAN_RIGHTS';
  score: number; // 0-100
  impact: string;
}

export interface IEconomicMetric {
  id: string;
  category: 'ROI' | 'FAIR_TRADE' | 'LOCAL_PROCUREMENT' | 'TAX_TRANSPARENCY';
  value: number;
  currency: string;
}

export class SocialEconomyService implements ITrinityService {
  private socialMetrics: ISocialMetric[] = [];
  private economicMetrics: IEconomicMetric[] = [];

  // --- Social Actions ---
  public async evaluateSocialImpact(projectId: string): Promise<number> {
    omniLogger.info(LogCategory.ESG, `Evaluating Social Impact for project ${projectId}`);
    // Mock logic
    return 85.5;
  }

  public registerSocialMetric(metric: ISocialMetric) {
    this.socialMetrics.push(metric);
    omniLogger.info(LogCategory.ESG, `Registered Social Metric: ${metric.category}`, metric);
  }

  // --- Economic Actions ---
  public async analyzeEconomicValue(assetId: string): Promise<number> {
    omniLogger.info(LogCategory.ESG, `Analyzing Economic Value for asset ${assetId}`);
    return 10000;
  }

  public registerEconomicMetric(metric: IEconomicMetric) {
    this.economicMetrics.push(metric);
    omniLogger.info(LogCategory.ESG, `Registered Economic Metric: ${metric.category}`, metric);
  }

  public getSummary() {
    return {
      socialScore:
        this.socialMetrics.reduce((acc, m) => acc + m.score, 0) / (this.socialMetrics.length || 1),
      economicVolume: this.economicMetrics.reduce((acc, m) => acc + m.value, 0),
    };
  }

  // --- Ambassador Methods ---
  public async getAmbassadorProfile(userId: string): Promise<AmbassadorProfile> {
    return {
      userId,
      faction: 'TERRA_GUARDIANS' as any,
      rank: 'Initiate',
      totalEarnedGSC: 1200,
      referralCode: 'JAK-888',
      totalReferrals: 3,
    };
  }

  public async joinFaction(userId: string, faction: any): Promise<void> {
    omniLogger.info(LogCategory.ESG, `User ${userId} joined faction ${faction}`);
  }

  public async simulateReferralSuccess(userId: string): Promise<void> {
    omniLogger.info(LogCategory.ESG, `Simulating referral for ${userId}`);
  }

  // --- Guild Methods ---
  public async getGuilds(): Promise<Guild[]> {
    return [
      {
        id: 'g1',
        name: 'Sustainable Pioneers',
        level: 5,
        description: 'First guild of ESG.',
        members: [{ userId: 'partner_1', role: 'LEADER', joinedAt: Date.now() }],
        treasury: { gold: 5000 },
        technologies: ['tech_1'],
      },
    ];
  }

  public async createGuild(userId: string, name: string, description: string): Promise<void> {
    omniLogger.info(LogCategory.ESG, `Creating guild ${name}`);
  }

  // --- Career & Assessment ---
  public async getCareerProfile(userId: string) {
    return {
      path: 'CARBON_AUDITOR' as any,
      title: 'Sustainability Architect',
      level: 5,
      experience: 4500,
      specialties: ['Carbon Auditing', 'Social Impact'],
      passiveBonuses: [{ stat: 'Intelligence', value: 10 }],
    };
  }

  public async submitAssessment(userId: string, answers: any) {
    omniLogger.info(LogCategory.ESG, `Submitted assessment for ${userId}`);
    return {
      score: 85,
      recommendation: 'STRATEGIST',
      path: 'CARBON_AUDITOR' as any,
      level: 1,
      experience: 0,
      title: 'Junior Auditor',
      specialties: ['General ESG'],
      passiveBonuses: [] as any[],
    };
  }

  // --- Debate Arena ---
  public async getInitialDebateState(): Promise<DebateState> {
    return {
      playerHP: 100,
      enemyHP: 100,
      playerAP: 3,
      playerHand: await this.drawCards(3),
      playerDeck: [] as any[],
      discardPile: [] as any[],
      enemyIntent: 'ATTACK',
      round: 1,
      status: 'PLAYING' as any,
      logs: ['Debate started.'],
    };
  }

  public async enemyAction(state: any) {
    return {
      ...state,
      playerHP: state.playerHP - 15,
      enemyIntent: Math.random() > 0.5 ? 'ATTACK' : 'DEFENSE',
      round: state.round + 1,
    };
  }

  public async drawCards(count: number): Promise<DebateCard[]> {
    return Array(count)
      .fill(null)
      .map((_, i) => ({
        id: `card_${Date.now()}_${i}`,
        name: 'Logical Fallacy',
        description: 'Expose enemy logic errors.',
        cost: 1,
        type: 'ATTACK',
        rarity: 'COMMON' as any,
        value: 15,
      }));
  }

  // --- Mentorship ---
  public async getUserMentorships(userId: string) {
    return {
      mentor: undefined,
      apprentices: [] as any[],
    };
  }

  public async createMentorship(mentorId: string, menteeId: string) {
    omniLogger.info(LogCategory.ESG, `Mentorship created: ${mentorId} -> ${menteeId}`);
  }

  public async inheritKnowledge(mentorshipId: string, knowledgeId?: string) {
    omniLogger.info(LogCategory.ESG, `Inherited knowledge ${knowledgeId} via ${mentorshipId}`);
    return { knowledgePoints: 50 };
  }

  // --- Missions ---
  public async getMissions(userId: string) {
    return [
      {
        id: 'm1',
        type: 'DAILY' as any,
        rarity: 'COMMON' as any,
        title: 'Reduce Carbon Footprint',
        description: 'Reduce CO2 emissions by 10kg.',
        status: 'ACTIVE' as any,
        progress: 5,
        target: 10,
        rewards: { gsc: 500 },
      },
      {
        id: 'm2',
        type: 'WEEKLY' as any,
        rarity: 'RARE' as any,
        title: 'Community Outreach',
        description: 'Engage with local communities.',
        status: 'COMPLETED' as any,
        progress: 1,
        target: 1,
        rewards: { exp: 300 },
      },
    ];
  }

  public async claimMission(missionId: string, userId?: string) {
    omniLogger.info(LogCategory.ESG, `Claimed mission ${missionId} for ${userId}`);
    return { success: true, reward: 500 };
  }

  // --- My Cabin / Personalization ---
  public async getUserProfile(userId: string) {
    return {
      nickname: 'JunAi Adventurer',
      badges: [] as string[],
      homeData: {
        themeId: 'default',
        furniture: [] as any[],
        visitors: 128,
      },
    };
  }

  public async getShopFurniture() {
    return [
      {
        id: 'f1',
        name: 'Recycled Desk',
        price: 200,
        type: 'FURNITURE' as any,
        rarity: 'COMMON' as any,
      },
      {
        id: 'f2',
        name: 'Solar Lamp',
        price: 150,
        type: 'DECORATION' as any,
        rarity: 'RARE' as any,
      },
    ];
  }

  public async updateNickname(userId: string, newName: string) {
    omniLogger.info(LogCategory.ESG, `Updated nickname for ${userId} to ${newName}`);
  }

  // --- Partner Evolution ---
  public async getPartnerVisual(userId: string) {
    return {
      stage: 'ADULT' as any,
      visualUrl: '/partners/spirit_wolf.png',
      variant: 'SILVER_WOLF',
      auraColor: '#5EEAD4',
    };
  }

  public async evolvePartner(userId: string) {
    omniLogger.info(LogCategory.ESG, `Partner evolved for ${userId}`);
    return {
      stage: 'ELDER' as any,
      visualUrl: '/partners/spirit_wolf_elder.png',
      variant: 'GOLDEN_WOLF',
      auraColor: '#FBBF24',
    };
  }

  // --- Resource Game ---
  public async playResourceGame(action: string, target?: string) {
    return {
      success: true,
      reward: 25,
      outcome: 'SUCCESS',
      resourcesCheck: { energy: 10, water: 5 },
    };
  }

  // --- Subscription / VIP ---
  public async getUserSubscription(userId: string): Promise<SocialUserSubscription> {
    return {
      tier: SubscriptionTier.FREE,
      expires_at: Date.now() + 30 * 24 * 60 * 60 * 1000,
      features_unlocked: [],
      exclusive_perks: [],
      currentEnergy: 5,
      limits: {
        dailyEnergyMax: 5,
        storageLimit: 50,
      },
      wallet: {
        balance: 1000,
      },
    };
  }

  public async upgradeSubscription(userId: string, plan: SubscriptionTier) {
    omniLogger.info(LogCategory.ESG, `Upgrading ${userId} to ${plan}`);
    return { success: true };
  }

  // --- World Events ---
  public async getWorldEvents(): Promise<WorldEvent[]> {
    return [
      {
        id: 'evt1',
        title: 'Global Reforestation',
        description: 'Plant 1 million trees worldwide.',
        status: 'ACTIVE',
        totalProgress: 750000,
        targetProgress: 1000000,
        participants: 5432,
        unit: 'Trees',
        rewards: { buff: 'Oxygen Boost (+5% EXP)' },
      },
    ];
  }

  public async getLeaderboard(type: LeaderboardType = 'EXP'): Promise<LeaderboardEntry[]> {
    return [
      { userId: 'u1', rank: 1, nickname: 'GreenCorp', guildName: 'EcoWarriors', score: 9999 },
      { userId: 'u2', rank: 2, nickname: 'EcoSolutions', score: 8888 },
    ];
  }

  public async contributeToWorldEvent(eventId: string, amount: number) {
    omniLogger.info(LogCategory.ESG, `Contributed ${amount} to event ${eventId}`);
    return { success: true };
  }

  // --- Impact Nexus Village (RPG System) ---

  /**
   * 🌳 獲取村莊角色資料 (RPG Stats)
   * 5T Protocol: [Traceable] 歷程記錄 [Tangible] 數值呈現
   */
  public async getVillageCharacter(userId: string): Promise<IVillageCharacter> {
    return {
      id: userId,
      name: 'JunAi 永續使者',
      avatar: '/avatars/avatar_1.png',
      title: '初級永續建築師',
      level: 5,
      tokens: 2500,
      stats: {
        int: 45, // 智
        str: 32, // 勇
        chr: 28, // 仁
        wis: 40, // 誠
        luk: 15, // 節
        xp: 1250, //XP
        mana: 100,
        resonance: 0.5
      },
      cards: ['card_1', 'card_2'],
      buildings: ['b1', 'b2'],
      potentialAwakened: false,
      lastActive: Date.now()
    };
  }

  /**
   * 🃏 抽卡系統：Impact Nexus Card System
   * 5T Protocol: [Transparent] 機率公開
   */
  public async drawImpactCard(userId: string): Promise<IImpactCard> {
    const luckyRoll = Math.random();
    let rarity = CardRarity.COMMON;
    if (luckyRoll > 0.95) rarity = CardRarity.LEGENDARY;
    else if (luckyRoll > 0.8) rarity = CardRarity.EPIC;
    else if (luckyRoll > 0.5) rarity = CardRarity.RARE;

    return {
      id: `card_${Date.now()}`,
      name: rarity === CardRarity.LEGENDARY ? '碳中和聖晶' : '節能種子',
      description: '這張卡牌代表了一項永續行動的知識資產。',
      type: CardType.KNOWLEDGE,
      rarity,
      ability: '提升 5% 的碳盤查效率',
      imageUrl: '/cards/card_template.png',
      isLocked: false,
      marketValue: rarity === CardRarity.LEGENDARY ? 5000 : 100
    };
  }

  /**
   * 🏗️ 建築系統：村莊成長
   */
  public async getVillageBuildings(): Promise<IBuilding[]> {
    return [
      {
        id: 'b1',
        type: VillageBuildingType.ENERGY,
        name: '綠能發電廠',
        level: 2,
        description: '為村莊提供潔淨能源，增加資源產出。',
        bonus: 'Resource Flow +10%',
        unlockRequirements: { level: 1, stats: { str: 10 }, tokens: 500 },
        isActive: true
      },
      {
        id: 'b2',
        type: VillageBuildingType.KNOWLEDGE,
        name: '知識圖書館',
        level: 1,
        description: '儲存 ESG 知識點，提升智慧屬性。',
        bonus: 'INT Boost +5',
        unlockRequirements: { level: 3, stats: { int: 20 }, tokens: 1000 },
        isActive: true
      }
    ];
  }

  /**
   * 💰 代幣經濟 (Token Economy)
   */
  public async earnTokens(userId: string, amount: number, reason: string): Promise<ITokenTransaction> {
    omniLogger.info(LogCategory.ESG, `User ${userId} earned ${amount} tokens for: ${reason}`);
    return {
      id: `tx_${Date.now()}`,
      userId,
      amount,
      type: 'EARN',
      reason,
      timestamp: Date.now(),
      status: 'COMPLETED'
    };
  }

  /**
   * 🏛️ ITrinityService Implementation
   * [TC] 為村莊角色或影響力卡牌提供三位一體視角。
   */
  public async getTrinity(id: string): Promise<IInfoOneTrinity> {
    const trinityManager = TrinityManager.getInstance();

    // 邏輯分支：根據 ID 前綴決定是 Character 還是 Card
    if (id.startsWith('card_')) {
      return this.getCardTrinity(id);
    } else {
      return this.getCharacterTrinity(id);
    }
  }

  /**
   * 🎲 獲取卡牌的三位一體視角
   */
  private async getCardTrinity(cardId: string): Promise<IInfoOneTrinity> {
    const trinityManager = TrinityManager.getInstance();
    // 模擬獲取卡牌數據 (實際應從狀態或資料庫讀取)
    const card = await this.drawImpactCard('system_query');

    const component: IOmniComponent = {
      id: `COMP-${card.id}`,
      name: `Impact Card: ${card.name}`,
      state: TrinityComponentState.READY,
      impactMetric: card.ability,
      lifecyclePath: ['MINT', 'ASSIGN', 'ACTIVATE'],
      execute: async () => ({ value: card.marketValue }),
      cleanup: async () => { }
    };

    const knowledge: IOmniKB = {
      id: `KB-${card.id}`,
      content: card.description,
      sourceOrigin: 'ESGss_Impact_Nexus_Pool',
      formula: 'MARKET_VALUE_CALC_V1',
      tags: [Protocol5T.TANGIBLE, Protocol5T.TRACEABLE],
      hashLock: `LOK-${card.id}-${card.marketValue}`
    };

    const identity: IOmniTag = {
      id: `TAG-${card.id}`,
      name: card.name,
      type: 'ASSET' as any,
      value: card.rarity,
      protocol: [Protocol5T.TRUSTWORTHY],
      signature: `SIG-${card.id}`,
      createdAt: new Date()
    };

    return trinityManager.forge(component, knowledge, identity);
  }

  /**
   * 👤 獲取角色的三位一體視角
   */
  private async getCharacterTrinity(userId: string): Promise<IInfoOneTrinity> {
    const trinityManager = TrinityManager.getInstance();
    const character = await this.getVillageCharacter(userId);

    const component: IOmniComponent = {
      id: `COMP-CHAR-${character.id}`,
      name: `Avatar: ${character.name}`,
      state: TrinityComponentState.READY,
      impactMetric: `Level ${character.level} Architect`,
      lifecyclePath: ['CREATE', 'EVOLVE', 'TRANSCEND'],
      execute: async () => character.stats,
      cleanup: async () => { }
    };

    const knowledge: IOmniKB = {
      id: `KB-CHAR-${character.id}`,
      content: `User RPG Profile: ${character.title}`,
      sourceOrigin: 'InfoOne_Sovereign_Network',
      tags: [Protocol5T.TRACKABLE, Protocol5T.TANGIBLE],
      hashLock: `CHAR-LOCK-${character.id}-${character.level}`
    };

    const identity: IOmniTag = {
      id: `TAG-CHAR-${character.id}`,
      name: character.name,
      type: 'IDENTITY' as any,
      value: character.title,
      protocol: [Protocol5T.TRACEABLE, Protocol5T.TRUSTWORTHY],
      signature: `SIG-USER-${character.id}`,
      createdAt: new Date(character.lastActive)
    };

    return trinityManager.forge(component, knowledge, identity);
  }
}

export const socialEconomyService = new SocialEconomyService();
