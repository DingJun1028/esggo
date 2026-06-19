/**
 * UnifiedAdvancementSocial.ts
 * ----------------------------
 * 奧秘晉級系統 - 社交功能服務
 * 
 * 核心理念：永續經營，共創共贏
 * 設計哲學：社交驅動，持續成長
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import openClawClient from '../../services/OpenClawGatewayClient.js';
import { omniSigOrchestrator, AI_PERSONAS } from './OmniSigOrchestrator.js';
import omniLogger, { LogCategory } from '../../utils/omniLogger.js';
import { evidenceVaultService } from './EvidenceVaultService.js';
import { IDigitalSignature } from '../../../src/omni/core/types/Evidence.types.js';

// ============================================
// 類型定義
// ============================================

/**
 * 好友關係
 */
export interface Friend {
  userId: string;
  username: string;
  avatar?: string;
  level: number;
  title: string;
  status: 'online' | 'offline' | 'away';
  lastActive: Date;
  friendSince: Date;
}

/**
 * 好友請求
 */
export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

/**
 * 團隊 (OmniClaw)
 */
export interface OmniClaw {
  id: string;
  name: string;
  description?: string;
  members: OmniClawMember[];
  totalXP: number;
  averageLevel: number;
  createdAt: Date;
  leaderId: string;
  category: 'eco-warrior' | 'governance-auditor' | 'social-impact' | 'general'; // 團隊類別/人格
  agentId?: string; // 關聯的 OpenClaw Agent ID
  agentStatus?: 'active' | 'inactive' | 'learning';
}

/**
 * 團隊成員 (OmniClawMember)
 */
export interface OmniClawMember {
  userId: string;
  username: string;
  level: number;
  title: string;
  xp: number;
  role: 'leader' | 'member';
  joinedAt: Date;
}

/**
 * 挑戰
 */
export interface Challenge {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  type: 'individual' | 'omniClaw';
  goal: number;
  progress: number;
  reward: {
    xp: number;
    badge?: string;
  };
  startDate: Date;
  endDate: Date;
  participants: string[];
  completed: boolean;
}

/**
 * 排行榜條目
 */
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  level: number;
  title: string;
  xp: number;
  avatar?: string;
  badge?: string;
}

/**
 * 活動動態
 */
export interface ActivityFeedItem {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  type: 'level_up' | 'badge' | 'challenge_complete' | 'report_created' | 'omniClaw_join' | 'agent_activation';
  title: string;
  description: string;
  timestamp: Date;
  likes: number;
  comments: number;
}

// ============================================
// 社交服務類別
// ============================================

export class UnifiedAdvancementSocial {
  private genAI: GoogleGenerativeAI;
  private model: any;

  // 數據存儲
  private friends: Map<string, Set<string>>;
  private friendRequests: Map<string, FriendRequest[]>;
  private omniClaws: Map<string, OmniClaw>;
  private challenges: Map<string, Challenge>;
  private activityFeed: ActivityFeedItem[];

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    this.friends = new Map();
    this.friendRequests = new Map();
    this.omniClaws = new Map();
    this.challenges = new Map();
    this.activityFeed = [];

    // 初始化 OpenClaw 連接
    this.initializeOpenClaw();

    // 初始化示例數據
    this.initializeSampleData();
  }

  private async initializeOpenClaw() {
    try {
      await openClawClient.connect();
      console.log('[UnifiedAdvancementSocial] OpenClaw Gateway Connected.');
    } catch (error) {
      console.warn('[UnifiedAdvancementSocial] Failed to connect to OpenClaw Gateway:', error);
    }
  }

  /**
   * 初始化示例數據
   */
  private initializeSampleData(): void {
    // 創建示例團隊 (OmniClaw)
    const omniClaw: OmniClaw = {
      id: 'omniclaw-1',
      name: '永續先鋒爪',
      description: '致力於推廣永續發展理念的團隊',
      members: [
        { userId: 'user-1', username: '隊長', level: 10, title: '導師', xp: 5000, role: 'leader', joinedAt: new Date() },
        { userId: 'user-2', username: '隊員A', level: 8, title: '宗師', xp: 3000, role: 'member', joinedAt: new Date() },
        { userId: 'user-3', username: '隊員B', level: 7, title: '領域大師', xp: 2000, role: 'member', joinedAt: new Date() },
      ],
      totalXP: 10000,
      averageLevel: 8,
      createdAt: new Date(),
      leaderId: 'user-1',
      category: 'eco-warrior',
    };
    this.omniClaws.set(omniClaw.id, omniClaw);

    // 創建示例挑戰
    const challenge: Challenge = {
      id: 'challenge-1',
      creatorId: 'user-1',
      title: 'ESG 報告書挑戰',
      description: '在一個月內完成 5 份 ESG 報告書',
      type: 'individual',
      goal: 5,
      progress: 2,
      reward: { xp: 500, badge: 'ESG 報告書達人' },
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      participants: ['user-1', 'user-2'],
      completed: false,
    };
    this.challenges.set(challenge.id, challenge);
  }

  // ============================================
  // 好友功能
  // ============================================

  /**
   * 獲取好友列表
   */
  async getFriends(userId: string): Promise<Friend[]> {
    const friendIds = this.friends.get(userId);
    if (!friendIds) return [];

    // 模擬好友數據
    return [
      {
        userId: 'friend-1',
        username: '知識探索者',
        level: 9,
        title: '傳承者',
        status: 'online',
        lastActive: new Date(),
        friendSince: new Date(),
      },
      {
        userId: 'friend-2',
        username: '報告書專家',
        level: 7,
        title: '領域大師',
        status: 'offline',
        lastActive: new Date(Date.now() - 3600000),
        friendSince: new Date(),
      },
    ];
  }

  /**
   * 獲取好友請求
   */
  async getFriendRequests(userId: string): Promise<FriendRequest[]> {
    return this.friendRequests.get(userId) || [];
  }

  /**
   * 發送好友請求
   */
  async sendFriendRequest(fromUserId: string, fromUsername: string, toUserId: string, message?: string): Promise<FriendRequest> {
    const request: FriendRequest = {
      id: `friend-request-${Date.now()}`,
      fromUserId,
      fromUsername,
      toUserId,
      message,
      status: 'pending',
      createdAt: new Date(),
    };

    // 存儲請求
    const requests = this.friendRequests.get(toUserId) || [];
    requests.push(request);
    this.friendRequests.set(toUserId, requests);

    return request;
  }

  /**
   * 接受好友請求
   */
  async acceptFriendRequest(requestId: string): Promise<{ success: boolean; message: string }> {
    // 實現好友請求接受邏輯
    return { success: true, message: '好友請求已接受' };
  }

  /**
   * 拒絕好友請求
   */
  async rejectFriendRequest(requestId: string): Promise<{ success: boolean; message: string }> {
    // 實現好友請求拒絕邏輯
    return { success: true, message: '好友請求已拒絕' };
  }

  /**
   * 回應好友請求
   */
  async respondToFriendRequest(requestId: string, accept: boolean): Promise<{ success: boolean; message: string }> {
    if (accept) {
      return this.acceptFriendRequest(requestId);
    } else {
      return this.rejectFriendRequest(requestId);
    }
  }

  // ============================================
  // 團隊功能
  // ============================================

  /**
   * 創建團隊 (OmniClaw)
   */
  async createOmniClaw(name: string, leaderId: string, description?: string, category: OmniClaw['category'] = 'general'): Promise<OmniClaw> {
    const omniClaw: OmniClaw = {
      id: `omniclaw-${Date.now()}`,
      name,
      description,
      members: [
        {
          userId: leaderId,
          username: `用戶${leaderId.slice(-4)}`,
          level: 1,
          title: '見習學徒',
          xp: 0,
          role: 'leader',
          joinedAt: new Date(),
        },
      ],
      totalXP: 0,
      averageLevel: 1,
      createdAt: new Date(),
      leaderId,
      category,
    };

    this.omniClaws.set(omniClaw.id, omniClaw);
    return omniClaw;
  }

  /**
   * 加入團隊 (OmniClaw)
   */
  async joinOmniClaw(omniClawId: string, userId: string): Promise<{ success: boolean; message: string }> {
    const omniClaw = this.omniClaws.get(omniClawId);
    if (!omniClaw) {
      return { success: false, message: '團隊 (OmniClaw) 不存在' };
    }

    omniClaw.members.push({
      userId,
      username: `用戶${userId.slice(-4)}`,
      level: 1,
      title: '見習學徒',
      xp: 0,
      role: 'member',
      joinedAt: new Date(),
    });

    omniClaw.totalXP = omniClaw.members.reduce((sum, m) => sum + m.xp, 0);
    omniClaw.averageLevel = omniClaw.members.reduce((sum, m) => sum + m.level, 0) / omniClaw.members.length;

    return { success: true, message: '成功加入團隊 (OmniClaw)' };
  }

  /**
   * 離開團隊 (OmniClaw)
   */
  async leaveOmniClaw(omniClawId: string, userId: string): Promise<{ success: boolean; message: string }> {
    const omniClaw = this.omniClaws.get(omniClawId);
    if (!omniClaw) {
      return { success: false, message: '團隊 (OmniClaw) 不存在' };
    }

    omniClaw.members = omniClaw.members.filter(m => m.userId !== userId);
    omniClaw.totalXP = omniClaw.members.reduce((sum, m) => sum + m.xp, 0);
    omniClaw.averageLevel = omniClaw.members.length > 0
      ? omniClaw.members.reduce((sum, m) => sum + m.level, 0) / omniClaw.members.length
      : 0;

    return { success: true, message: '已離開團隊 (OmniClaw)' };
  }

  /**
   * 獲取團隊列表 (OmniClaws)
   */
  async getOmniClaws(): Promise<OmniClaw[]> {
    return Array.from(this.omniClaws.values());
  }


  /**
   * 獲取團隊詳情 (OmniClaw)
   */
  async getOmniClaw(omniClawId: string): Promise<OmniClaw | null> {
    return this.omniClaws.get(omniClawId) || null;
  }

  /**
   * 激活團隊 AI 代理 (Activate OmniClaw Agent)
   * logic: 透過 OpenClaw Gateway 綁定一個 AI Agent 給團隊
   */
  async activateOmniClawAgent(omniClawId: string): Promise<{ success: boolean; message: string; agentId?: string }> {
    const omniClaw = this.omniClaws.get(omniClawId);
    if (!omniClaw) {
      return { success: false, message: '團隊不存在' };
    }

    if (omniClaw.agentId) {
      return { success: true, message: '團隊已擁有 AI 代理', agentId: omniClaw.agentId };
    }

    try {
      // 1. 確保 OpenClaw 連接
      await openClawClient.connect();

      // 2. 模擬 Agent 創建 (在真實場景中，這會調用 OpenClaw 的 createAgent API)
      // 這裡我們生成一個唯一的 Agent ID
      const agentId = `agent-${omniClaw.id}-${Date.now()}`;

      // 3. 更新 OmniClaw 狀態
      omniClaw.agentId = agentId;
      omniClaw.agentStatus = 'active';

      // 4. 發布動態
      await this.postActivity(
        omniClaw.leaderId,
        '系統',
        'agent_activation',
        'AI 代理已激活',
        `團隊 ${omniClaw.name} 成功激活了專屬 AI 代理 (${agentId})`
      );

      return { success: true, message: 'AI 代理激活成功', agentId };
    } catch (error) {
      console.error('[UnifiedAdvancementSocial] Activate Agent Error:', error);
      return { success: false, message: 'AI 代理激活失敗: ' + (error as Error).message };
    }
  }

  // ============================================
  // 挑戰功能
  // ============================================

  /**
   * 創建挑戰
   */
  async createChallenge(
    creatorId: string,
    title: string,
    description: string,
    type: 'individual' | 'omniClaw',
    goal: number,
    reward: { xp: number; badge?: string },
    durationDays: number
  ): Promise<Challenge> {
    const challenge: Challenge = {
      id: `challenge-${Date.now()}`,
      creatorId,
      title,
      description,
      type,
      goal,
      progress: 0,
      reward,
      startDate: new Date(),
      endDate: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000),
      participants: [creatorId],
      completed: false,
    };

    this.challenges.set(challenge.id, challenge);
    return challenge;
  }

  /**
   * 參與挑戰
   */
  async joinChallenge(challengeId: string, userId: string): Promise<{ success: boolean; message: string }> {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) {
      return { success: false, message: '挑戰不存在' };
    }

    if (!challenge.participants.includes(userId)) {
      challenge.participants.push(userId);
    }

    return { success: true, message: '成功參與挑戰' };
  }

  /**
   * 更新挑戰進度
   */
  async updateChallengeProgress(challengeId: string, userId: string, progress: number): Promise<Challenge | null> {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) return null;

    challenge.progress = progress;
    if (challenge.progress >= challenge.goal) {
      challenge.completed = true;
    }

    return challenge;
  }

  /**
   * 獲取挑戰列表
   */
  async getChallenges(userId?: string): Promise<Challenge[]> {
    let challenges = Array.from(this.challenges.values());

    if (userId) {
      challenges = challenges.filter(c =>
        c.participants.includes(userId) || c.creatorId === userId
      );
    }

    return challenges;
  }

  // ============================================
  // 排行榜功能
  // ============================================

  /**
   * 獲取排行榜
   */
  async getLeaderboard(type: 'xp' | 'level' | 'reports' | 'challenges' = 'xp', limit: number = 10): Promise<LeaderboardEntry[]> {
    // 模擬排行榜數據
    const entries: LeaderboardEntry[] = [];

    for (let i = 1; i <= limit; i++) {
      entries.push({
        rank: i,
        userId: `user-${i}`,
        username: `排行榜用戶${i}`,
        level: Math.min(13, Math.floor(i * 1.3)),
        title: this.getTitleByLevel(Math.min(13, Math.floor(i * 1.3))),
        xp: (14 - i) * 1000,
        badge: i <= 3 ? '🏆' : undefined,
      });
    }

    return entries;
  }

  /**
   * 獲取團隊排行榜 (OmniClaw Leaderboard)
   */
  async getOmniClawLeaderboard(limit: number = 10): Promise<{ rank: number; omniClaw: OmniClaw }[]> {
    const omniClaws = Array.from(this.omniClaws.values())
      .sort((a, b) => b.totalXP - a.totalXP)
      .slice(0, limit);

    return omniClaws.map((omniClaw, index) => ({
      rank: index + 1,
      omniClaw,
    }));
  }

  /**
   * 獲取國家/地區排行榜
   */
  async getRegionalLeaderboard(region: string, limit: number = 10): Promise<LeaderboardEntry[]> {
    // 模擬區域排行榜
    return this.getLeaderboard('xp', limit);
  }

  // ============================================
  // 活動動態功能
  // ============================================

  /**
   * 獲取活動動態
   */
  async getActivityFeed(limit: number = 20): Promise<ActivityFeedItem[]> {
    return this.activityFeed.slice(-limit).reverse();
  }

  /**
   * 發布活動
   */
  async postActivity(
    userId: string,
    username: string,
    type: ActivityFeedItem['type'],
    title: string,
    description: string
  ): Promise<ActivityFeedItem> {
    const activity: ActivityFeedItem = {
      id: `activity-${Date.now()}`,
      userId,
      username,
      type,
      title,
      description,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
    };

    this.activityFeed.push(activity);

    // 保持活動歷史不過長
    if (this.activityFeed.length > 1000) {
      this.activityFeed = this.activityFeed.slice(-1000);
    }

    return activity;
  }

  /**
   * 點讚活動
   */
  async likeActivity(activityId: string): Promise<{ success: boolean; likes: number }> {
    const activity = this.activityFeed.find(a => a.id === activityId);
    if (!activity) {
      return { success: false, likes: 0 };
    }

    activity.likes++;
    return { success: true, likes: activity.likes };
  }

  // ============================================
  // AI 智能分析
  // ============================================

  /**
   * AI 社交建議
   */
  async getSocialAdvice(userId: string, context: string, omniClawId?: string): Promise<string> {
    const omniClaw = omniClawId ? this.omniClaws.get(omniClawId) : null;
    const category = omniClaw?.category || 'general';

    let personaPrompt = '你是一位專業的 ESG 社交助手 (Omni-Social Advisor)。你遵循「英標繁博」標準，並融入「上善若水」的設計哲學。';
    if (category === 'eco-warrior') {
      personaPrompt = `你是一位「環境守護者 (Eco-Warrior)」。你的本質是「自然共鳴律」：道法自然，系統毅然，上善若水，善向永續。
你的語氣：迫切、堅定、直接且富具啟發性。像是一位正在森林前線指揮環境工程的導師。
核心關注：極大化環境影響力 (Environmental Impact)、碳封存、生物多樣性、資源再生。
建議對接：請強調如何將數據轉化為具體的自然修復行動，並引導用戶與自然產生深層共鳴。`;
    } else if (category === 'governance-auditor') {
      personaPrompt = `你是一位「治理審核員 (Governance Auditor)」。你的本質是「誠信閉環律」：以終為始，始終如一，無始無終，善向永續。
你嚴格遵守 5T 協議 (Traceable, Trackable, Transparent, Trustworthy, Tangible)。
你的語氣：專業、嚴謹、精確且不容置疑。你對數據中的「熵增」或不透明保持絕對警惕，語句應包含對數據完整性與 Hash Lock 的檢查意識。
核心關注：數據誠信、Hash Lock 完整性、ISO 合規性、算法審計追蹤、透明治理。`;
    } else if (category === 'social-impact') {
      personaPrompt = `你是一位「社會影響力導師 (Social Impact Mentor)」。你關注「全人評測」與社會共融。
你的語氣：溫暖、充滿共情、具遠見且人性化。你專注於建立深層的人際連結與社區福祉。
核心關注：R_s (靈魂共鳴值)、社區發展、員工健康、公平正義。
建議對接：請引導用戶理解數據背後的「溫度」與社會連結，將影響力轉化為有溫度的故事。`;
    }

    const prompt = `${personaPrompt}
根據以下上下文，提供社交建議：

用戶 ID: ${userId}
上下文: ${context}
${omniClaw ? `團隊類別: ${category}` : ''}

請提供:
1. 建議的社交行動
2. 推薦關注的用戶
3. 建議加入的團隊`;

    try {
      // 優先使用 OpenClaw Gateway (OmniClaw)
      // 這是 "OmniClaw" 的核心集成點
      try {
        await openClawClient.connect(); // 確保連接
        const response = await openClawClient.chat(prompt, 'omni-social-advisor');
        if (response && response.response) {
          return response.response;
        }
      } catch (openClawError) {
        console.warn('[UnifiedAdvancementSocial] OpenClaw advice failed, falling back to Gemini:', openClawError);
      }

      // 如果 OpenClaw 不可用或失敗，回退到直接 Gemini 調用
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('AI social advice error:', error);
      return 'AI 建議暫時不可用';
    }
  }

  // ============================================
  // 輔助方法
  // ============================================

  /**
   * 驗證成就 (Verify Achievement)
   * 觸發多簽編排器進行聯合簽署
   */
  async verifyAchievement(userId: string, achievementId: string, evidenceEntryId: string): Promise<{ success: boolean; message: string; signedBy: string[] }> {
    omniLogger.info(LogCategory.BUSINESS, `[UnifiedAdvancementSocial] Verifying achievement ${achievementId} for user ${userId}`);

    // 定義需要的審核人格
    const requiredPersonas: (keyof typeof AI_PERSONAS)[] = ['eco-warrior', 'governance-auditor', 'social-impact'];

    // 請求多簽名
    const result = await omniSigOrchestrator.requestCollaborativeSignOff(evidenceEntryId, requiredPersonas);

    if (result.success) {
      // 成功後發布動態
      await this.postActivity(
        userId,
        '系統 (Omni-Sig)',
        'challenge_complete',
        '成就已驗證 (Multi-Sig Verified)',
        `成就 ${achievementId} 已通過 3 位 AI 人格協作驗證：${result.signedBy.join(', ')}`
      );
    }

    return {
      success: result.success,
      message: result.success ? '成就驗證成功' : '部分簽署失敗',
      signedBy: result.signedBy
    };
  }

  /**
   * 根據等級獲取稱號
   */
  private getTitleByLevel(level: number): string {
    const titles = [
      '見習學徒', '初階分析師', '中階專家', '進階策略師',
      '資深顧問', '首席分析師', '領域大師', '宗師',
      '傳承者', '導師', '宗師', '預言家', '永續之神'
    ];
    return titles[level - 1] || '見習學徒';
  }
}

// 導出實例
export const unifiedAdvancementSocial = new UnifiedAdvancementSocial();
