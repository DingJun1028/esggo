/**
 * UnifiedAdvancementService.ts
 * --------------------------------
 * 奧秘晉級系統 - 統一晉級服務
 * 
 * 核心理念：觸類旁通，舉一反三，融會貫通
 * 設計哲學：上善若水，萬法歸一
 * 
 * 功能：
 * - 統一跨服務經驗值管理
 * - 觸類旁通智能推薦
 * - 舉一反三學習路徑
 * - 上乘下啟傳承系統
 * - 無縫接軌API整合
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// ============================================
// 類型定義
// ============================================

/**
 * 統一用戶進度介面
 */
export interface UnifiedUserProgress {
  userId: string;
  combinedLevel: number;
  combinedXP: number;
  combinedTitle: string;

  // 報告書撰寫中心進度
  reportProgress: {
    level: number;
    xp: number;
    title: string;
    rank: 'novice' | 'apprentice' | 'practitioner' | 'specialist' | 'master' | 'grandmaster' | 'legend';
  };

  // 商情偵測中心進度
  marketProgress: {
    level: number;
    xp: number;
    title: string;
  };

  // 統一徽章
  unifiedBadges: UnifiedBadge[];

  // 統一成就
  unifiedAchievements: UnifiedAchievement[];

  // 統計數據
  statistics: UnifiedStatistics;

  // 最後活動時間
  lastActivity: string;

  // 創建時間
  createdAt: string;

  // 傳承點數 (用於知識傳承)
  legacyPoints: number;
}

/**
 * 統一徽章
 */
export interface UnifiedBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: 'report' | 'market' | 'cross' | 'legacy' | 'special';
  source: 'report' | 'market';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

/**
 * 統一成就
 */
export interface UnifiedAchievement {
  id: string;
  name: string;
  description: string;
  completedAt: string;
  reward: {
    xp: number;
    legacyPoints: number;
    badge?: string;
  };
  category: 'report' | 'market' | 'cross' | 'legacy';
  progress: number;
  requirement: number;
}

/**
 * 統一統計
 */
export interface UnifiedStatistics {
  totalReportsCreated: number;
  totalAnalyses: number;
  totalModulesCompleted: number;
  totalXPEarned: number;
  totalLegacyPoints: number;
  streakDays: number;
  crossServiceActions: number;
  lastActiveDate: string;
}

/**
 * 智能推薦
 */
export interface SmartRecommendation {
  id: string;
  type: 'tutorial' | 'report' | 'analysis' | 'cross' | 'legacy' | 'market';
  title: string;
  description: string;
  reason: string; // 推薦原因
  priority: number;
  xpReward: number;
  modules?: string[];
  estimatedTime: number;
  relevanceScore: number;
}

/**
 * 學習路徑
 */
export interface LearningPath {
  id: string;
  name: string;
  description: string;
  steps: LearningStep[];
  totalXP: number;
  totalTime: number;
  prerequisites: string[];
  crossServiceConnections: CrossServiceConnection[];
}

/**
 * 學習步驟
 */
export interface LearningStep {
  id: string;
  type: 'tutorial' | 'practice' | 'quiz' | 'project';
  title: string;
  description: string;
  moduleId: string;
  xpReward: number;
  estimatedTime: number;
  completed: boolean;
}

/**
 * 跨服務連接
 */
export interface CrossServiceConnection {
  reportModule: string;
  marketModule: string;
  connection: string;
  xpBonus: number;
}

/**
 * 傳承記錄
 */
export interface LegacyRecord {
  id: string;
  fromUserId: string;
  toUserId?: string;
  type: 'grant' | 'request' | 'inherit';
  points: number;
  reason: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'cancelled';
}

/**
 * 活動記錄
 */
export interface UnifiedActivity {
  id: string;
  userId: string;
  type: 'tutorial' | 'report' | 'analysis' | 'cross' | 'legacy' | 'market';
  description: string;
  xpEarned: number;
  legacyPointsEarned: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

// ============================================
// 常量定義
// ============================================

/**
 * 統一等級閾值 (13 等級)
 */
export const UNIFIED_LEVELS = [
  { level: 1, title: '見習學徒', xpRequired: 0, privileges: ['基礎學習'] },
  { level: 2, title: '初階顧問', xpRequired: 50, privileges: ['進階學習'] },
  { level: 3, title: '專業顧問', xpRequired: 150, privileges: ['智能推薦'] },
  { level: 4, title: '趨勢分析師', xpRequired: 300, privileges: ['數據洞察'] },
  { level: 5, title: '資深顧問', xpRequired: 500, privileges: ['風險評估工具'] },
  { level: 6, title: '首席分析師', xpRequired: 800, privileges: ['競合分析'] },
  { level: 7, title: '領域大師', xpRequired: 1200, privileges: ['團隊協作'] },
  { level: 8, title: '宗師', xpRequired: 2000, privileges: ['進階 AI 分析'] },
  { level: 9, title: '傳承者', xpRequired: 3500, privileges: ['自訂分析模板', '傳承權限'] },
  { level: 10, title: '導師', xpRequired: 5000, privileges: ['API 存取', '指導權限'] },
  { level: 11, title: '宗師', xpRequired: 8000, privileges: ['策略顧問'] },
  { level: 12, title: '預言家', xpRequired: 12000, privileges: ['優先新功能'] },
  { level: 13, title: '永續之神', xpRequired: 20000, privileges: ['終身成就', '系統顧問'] },
] as const;

/**
 * 報告書等級閾值 (7 等級)
 */
export const REPORT_LEVELS = [
  { level: 1, rank: 'novice' as const, title: '見習撰寫員', xpRequired: 0, privileges: ['基礎撰寫'] },
  { level: 2, rank: 'apprentice' as const, title: '初階作者', xpRequired: 30, privileges: ['進階模板'] },
  { level: 3, rank: 'practitioner' as const, title: '專業作者', xpRequired: 100, privileges: ['AI 輔助'] },
  { level: 4, rank: 'specialist' as const, title: '資深作者', xpRequired: 250, privileges: ['自訂報告'] },
  { level: 5, rank: 'master' as const, title: '報告專家', xpRequired: 500, privileges: ['團隊協作'] },
  { level: 6, rank: 'grandmaster' as const, title: '報告大師', xpRequired: 1000, privileges: ['API 存取'] },
  { level: 7, rank: 'legend' as const, title: '報告書之神', xpRequired: 2000, privileges: ['終身成就'] },
] as const;

/**
 * 跨服務連接配置
 */
export const CROSS_SERVICE_CONNECTIONS = [
  {
    reportModule: 'src-01',
    marketModule: 'mic-01-01',
    connection: 'ESG 報告與企業情報分析相輔相成',
    xpBonus: 50,
  },
  {
    reportModule: 'src-02',
    marketModule: 'mic-02-01',
    connection: '永續趨勢預測需要趨勢分析方法',
    xpBonus: 75,
  },
  {
    reportModule: 'src-03',
    marketModule: 'mic-03-01',
    connection: '環境數據分析支撐環境章節撰寫',
    xpBonus: 75,
  },
  {
    reportModule: 'src-04',
    marketModule: 'mic-01-02',
    connection: '利害關係人分析與社會責任情報結合',
    xpBonus: 50,
  },
  {
    reportModule: 'src-05',
    marketModule: 'mic-04-01',
    connection: '治理揭露與風險評估相互驗證',
    xpBonus: 75,
  },
  {
    reportModule: 'src-06',
    marketModule: 'mic-02-02',
    connection: 'TCFD 氣候財務揭露需要情境分析能力',
    xpBonus: 100,
  },
];

// ============================================
// 奧秘晉級服務類別
// ============================================

export class UnifiedAdvancementService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  // 用戶進度緩存
  private userProgressMap: Map<string, UnifiedUserProgress> = new Map();

  // 活動記錄
  private activityLog: UnifiedActivity[] = [];

  // 傳承記錄
  private legacyRecords: LegacyRecord[] = [];

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // 初始化示例數據
    this.initializeSampleData();
  }

  /**
   * 初始化示例數據
   */
  private initializeSampleData(): void {
    // 創建示例用戶進度
    const sampleUser: UnifiedUserProgress = {
      userId: 'user-1',
      combinedLevel: 5,
      combinedXP: 650,
      combinedTitle: '資深顧問',
      reportProgress: {
        level: 3,
        xp: 180,
        title: '專業作者',
        rank: 'practitioner',
      },
      marketProgress: {
        level: 4,
        xp: 470,
        title: '趨勢分析師',
      },
      unifiedBadges: [
        {
          id: 'badge-1',
          name: 'ESG 初學者',
          description: '完成第一個 ESG 學習模組',
          icon: '🌱',
          earnedAt: new Date().toISOString(),
          category: 'report',
          source: 'report',
          rarity: 'common',
        },
        {
          id: 'badge-2',
          name: '情報獵人',
          description: '完成第一個商情分析',
          icon: '🔍',
          earnedAt: new Date().toISOString(),
          category: 'market',
          source: 'market',
          rarity: 'common',
        },
        {
          id: 'badge-3',
          name: '觸類旁通',
          description: '完成第一個跨服務學習連接',
          icon: '🔗',
          earnedAt: new Date().toISOString(),
          category: 'cross',
          source: 'report',
          rarity: 'rare',
        },
      ],
      unifiedAchievements: [
        {
          id: 'ach-1',
          name: '起步者',
          description: '完成第一個教程',
          completedAt: new Date().toISOString(),
          reward: { xp: 50, legacyPoints: 10 },
          category: 'report',
          progress: 1,
          requirement: 1,
        },
      ],
      statistics: {
        totalReportsCreated: 5,
        totalAnalyses: 8,
        totalModulesCompleted: 12,
        totalXPEarned: 650,
        totalLegacyPoints: 150,
        streakDays: 5,
        crossServiceActions: 3,
        lastActiveDate: new Date().toISOString(),
      },
      lastActivity: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      legacyPoints: 150,
    };

    this.userProgressMap.set('user-1', sampleUser);
  }

  // ============================================
  // 核心功能
  // ============================================

  /**
   * 獲取用戶統一進度
   */
  async getUserProgress(userId: string): Promise<UnifiedUserProgress> {
    let progress = this.userProgressMap.get(userId);

    if (!progress) {
      // 創建新用戶進度
      progress = this.createNewUserProgress(userId);
      this.userProgressMap.set(userId, progress);
    }

    return progress;
  }

  /**
   * 創建新用戶進度
   */
  private createNewUserProgress(userId: string): UnifiedUserProgress {
    return {
      userId,
      combinedLevel: 1,
      combinedXP: 0,
      combinedTitle: '見習學徒',
      reportProgress: {
        level: 1,
        xp: 0,
        title: '見習撰寫員',
        rank: 'novice',
      },
      marketProgress: {
        level: 1,
        xp: 0,
        title: '見習情報員',
      },
      unifiedBadges: [],
      unifiedAchievements: [],
      statistics: {
        totalReportsCreated: 0,
        totalAnalyses: 0,
        totalModulesCompleted: 0,
        totalXPEarned: 0,
        totalLegacyPoints: 0,
        streakDays: 0,
        crossServiceActions: 0,
        lastActiveDate: new Date().toISOString(),
      },
      lastActivity: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      legacyPoints: 0,
    };
  }

  /**
   * 添加經驗值
   */
  async addExperience(
    userId: string,
    xp: number,
    type: 'report' | 'market' | 'cross',
    metadata?: Record<string, any>
  ): Promise<UnifiedUserProgress> {
    const progress = await this.getUserProgress(userId);

    // 計算加成
    let bonusXP = xp;
    if (type === 'cross') {
      bonusXP = Math.floor(xp * 1.5); // 跨服務加成 50%
    }

    // 更新對應模組的經驗值
    if (type === 'report') {
      progress.reportProgress.xp += bonusXP;
      progress.reportProgress.level = this.calculateReportLevel(progress.reportProgress.xp);
      progress.reportProgress.title = this.getReportTitle(progress.reportProgress.level);
      progress.reportProgress.rank = this.getReportRank(progress.reportProgress.level);
    } else if (type === 'market') {
      progress.marketProgress.xp += bonusXP;
      progress.marketProgress.level = this.calculateMarketLevel(progress.marketProgress.xp);
      progress.marketProgress.title = this.getMarketTitle(progress.marketProgress.level);
    }

    // 更新統一經驗值
    progress.combinedXP += bonusXP;
    progress.combinedLevel = this.calculateUnifiedLevel(progress.combinedXP);
    progress.combinedTitle = this.getUnifiedTitle(progress.combinedLevel);

    // 更新統計
    progress.statistics.totalXPEarned += bonusXP;
    if (type === 'cross') {
      progress.statistics.crossServiceActions += 1;
    }

    progress.lastActivity = new Date().toISOString();

    // 記錄活動
    this.logActivity(userId, type, `獲得 ${bonusXP} 經驗值`, bonusXP, 0, metadata);

    // 檢查成就
    await this.checkAchievements(userId);

    // 檢查徽章
    await this.checkBadges(userId);

    return progress;
  }

  /**
   * 添加傳承點數
   */
  async addLegacyPoints(userId: string, points: number, reason: string): Promise<UnifiedUserProgress> {
    const progress = await this.getUserProgress(userId);
    progress.legacyPoints += points;
    progress.statistics.totalLegacyPoints += points;

    // 記錄傳承
    this.legacyRecords.push({
      id: `legacy-${Date.now()}`,
      fromUserId: userId,
      type: 'grant',
      points,
      reason,
      timestamp: new Date().toISOString(),
      status: 'completed',
    });

    return progress;
  }

  /**
   * 轉移傳承點數
   */
  async transferLegacyPoints(
    fromUserId: string,
    toUserId: string,
    points: number,
    reason: string
  ): Promise<{ success: boolean; message: string }> {
    const fromProgress = await this.getUserProgress(fromUserId);

    if (fromProgress.legacyPoints < points) {
      return { success: false, message: '傳承點數不足' };
    }

    // 檢查等級要求
    if (fromProgress.combinedLevel < 9) {
      return { success: false, message: '需要等級 9 以上才能進行傳承' };
    }

    fromProgress.legacyPoints -= points;

    const toProgress = await this.getUserProgress(toUserId);
    toProgress.legacyPoints += points;

    // 記錄傳承
    this.legacyRecords.push({
      id: `legacy-transfer-${Date.now()}`,
      fromUserId,
      toUserId,
      type: 'inherit',
      points,
      reason,
      timestamp: new Date().toISOString(),
      status: 'completed',
    });

    return { success: true, message: '傳承成功' };
  }

  // ============================================
  // 智能推薦功能
  // ============================================

  /**
   * 獲取智能推薦
   */
  async getSmartRecommendations(userId: string): Promise<SmartRecommendation[]> {
    const progress = await this.getUserProgress(userId);
    const recommendations: SmartRecommendation[] = [];

    // 基於當前進度推薦
    if (progress.reportProgress.level < 3) {
      recommendations.push({
        id: `rec-${Date.now()}-1`,
        type: 'tutorial',
        title: 'GRI 基礎教程',
        description: '學習 GRI  Standards 基礎知識',
        reason: '建議先完成 GRI 基礎教程，再進行報告書撰寫',
        priority: 1,
        xpReward: 100,
        modules: ['src-01', 'src-02'],
        estimatedTime: 30,
        relevanceScore: 0.9,
      });
    }

    if (progress.marketProgress.level < 3) {
      recommendations.push({
        id: `rec-${Date.now()}-2`,
        type: 'analysis',
        title: 'ESG 情資分析',
        description: '學習如何分析 ESG 相關情報',
        reason: '建議先完成 ESG 情資分析基礎',
        priority: 1,
        xpReward: 150,
        modules: ['mic-01-01', 'mic-01-02'],
        estimatedTime: 45,
        relevanceScore: 0.85,
      });
    }

    // 跨服務推薦
    const crossConnection = this.findCrossConnection(progress);
    if (crossConnection) {
      recommendations.push({
        id: `rec-${Date.now()}-3`,
        type: 'cross',
        title: '觸類旁通',
        description: `${crossConnection.connection}`,
        reason: `完成此跨服務學習可獲得額外 ${crossConnection.xpBonus} 經驗值`,
        priority: 2,
        xpReward: crossConnection.xpBonus,
        modules: [crossConnection.reportModule, crossConnection.marketModule],
        estimatedTime: 60,
        relevanceScore: 0.95,
      });
    }

    // 傳承推薦
    if (progress.legacyPoints >= 50 && progress.combinedLevel >= 5) {
      recommendations.push({
        id: `rec-${Date.now()}-4`,
        type: 'legacy',
        title: '知識傳承',
        description: '分享知識給新用戶，獲得傳承點數獎勵',
        reason: '您的知識可以幫助新用戶成長',
        priority: 3,
        xpReward: 50,
        estimatedTime: 15,
        relevanceScore: 0.7,
      });
    }

    // 按相關性排序
    recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return recommendations.slice(0, 5);
  }

  /**
   * 獲取學習路徑
   */
  async getLearningPath(userId: string): Promise<LearningPath[]> {
    const progress = await this.getUserProgress(userId);
    const paths: LearningPath[] = [];

    // 基礎報告書路徑
    if (progress.reportProgress.level < 5) {
      paths.push({
        id: 'path-report-basic',
        name: '永續報告書撰寫專家',
        description: '從零開始成為永續報告書撰寫專家',
        steps: [
          { id: 'step-1', type: 'tutorial', title: '認識永續報告書', description: '了解永續報告書的基本概念', moduleId: 'src-01', xpReward: 50, estimatedTime: 20, completed: false },
          { id: 'step-2', type: 'tutorial', title: 'GRI Standards 基礎', description: '學習 GRI  Standards', moduleId: 'src-02', xpReward: 75, estimatedTime: 30, completed: false },
          { id: 'step-3', type: 'practice', title: '環境章節撰寫', description: '實作環境章節', moduleId: 'src-03', xpReward: 100, estimatedTime: 45, completed: false },
          { id: 'step-4', type: 'practice', title: '社會章節撰寫', description: '實作社會章節', moduleId: 'src-04', xpReward: 100, estimatedTime: 45, completed: false },
          { id: 'step-5', type: 'project', title: '完整報告書', description: '完成一份完整報告書', moduleId: 'src-06', xpReward: 200, estimatedTime: 90, completed: false },
        ],
        totalXP: 525,
        totalTime: 230,
        prerequisites: [],
        crossServiceConnections: [
          { reportModule: 'src-03', marketModule: 'mic-03-01', connection: '環境數據分析', xpBonus: 50 },
        ],
      });
    }

    // 基礎商情分析路徑
    if (progress.marketProgress.level < 5) {
      paths.push({
        id: 'path-market-basic',
        name: '商情分析專家',
        description: '從零開始成為商情分析專家',
        steps: [
          { id: 'step-1', type: 'tutorial', title: '商情偵測基礎', description: '學習商情偵測基本概念', moduleId: 'mic-01-01', xpReward: 50, estimatedTime: 20, completed: false },
          { id: 'step-2', type: 'tutorial', title: 'ESG 情資分析', description: '學習 ESG 情資分析', moduleId: 'mic-01-02', xpReward: 75, estimatedTime: 30, completed: false },
          { id: 'step-3', type: 'tutorial', title: '趨勢預測方法', description: '學習趨勢預測', moduleId: 'mic-02-01', xpReward: 100, estimatedTime: 45, completed: false },
          { id: 'step-4', type: 'practice', title: '風險評估實務', description: '實作風險評估', moduleId: 'mic-03-01', xpReward: 100, estimatedTime: 45, completed: false },
          { id: 'step-5', type: 'project', title: '競合情報分析', description: '完成競合情報分析', moduleId: 'mic-04-02', xpReward: 200, estimatedTime: 90, completed: false },
        ],
        totalXP: 525,
        totalTime: 230,
        prerequisites: [],
        crossServiceConnections: [
          { reportModule: 'src-02', marketModule: 'mic-02-01', connection: '永續趨勢預測', xpBonus: 50 },
        ],
      });
    }

    // 跨服務整合路徑
    if (progress.reportProgress.level >= 3 && progress.marketProgress.level >= 3) {
      paths.push({
        id: 'path-cross',
        name: '觸類旁通大師',
        description: '整合報告書與商情分析能力',
        steps: [
          { id: 'step-1', type: 'tutorial', title: 'ESG 報告與情報整合', description: '學習整合方法', moduleId: 'cross-01', xpReward: 150, estimatedTime: 60, completed: false },
          { id: 'step-2', type: 'practice', title: '實際案例分析', description: '分析真實企業案例', moduleId: 'cross-02', xpReward: 200, estimatedTime: 90, completed: false },
          { id: 'step-3', type: 'project', title: '整合式報告書', description: '完成整合式報告書', moduleId: 'cross-03', xpReward: 300, estimatedTime: 120, completed: false },
        ],
        totalXP: 650,
        totalTime: 270,
        prerequisites: ['path-report-basic', 'path-market-basic'],
        crossServiceConnections: [],
      });
    }

    return paths;
  }

  // ============================================
  // 等級計算
  // ============================================

  /**
   * 計算報告書等級
   */
  private calculateReportLevel(xp: number): number {
    for (let i = REPORT_LEVELS.length - 1; i >= 0; i--) {
      if (xp >= REPORT_LEVELS[i].xpRequired) {
        return REPORT_LEVELS[i].level;
      }
    }
    return 1;
  }

  /**
   * 計算商情等級
   */
  private calculateMarketLevel(xp: number): number {
    for (let i = UNIFIED_LEVELS.length - 1; i >= 0; i--) {
      if (xp >= UNIFIED_LEVELS[i].xpRequired) {
        return UNIFIED_LEVELS[i].level;
      }
    }
    return 1;
  }

  /**
   * 計算統一等級
   */
  private calculateUnifiedLevel(xp: number): number {
    for (let i = UNIFIED_LEVELS.length - 1; i >= 0; i--) {
      if (xp >= UNIFIED_LEVELS[i].xpRequired) {
        return UNIFIED_LEVELS[i].level;
      }
    }
    return 1;
  }

  /**
   * 獲取報告書稱號
   */
  private getReportTitle(level: number): string {
    const levelData = REPORT_LEVELS.find(l => l.level === level);
    return levelData?.title || '見習撰寫員';
  }

  /**
   * 獲取報告書Rank
   */
  private getReportRank(level: number): 'novice' | 'apprentice' | 'practitioner' | 'specialist' | 'master' | 'grandmaster' | 'legend' {
    const levelData = REPORT_LEVELS.find(l => l.level === level);
    return levelData?.rank || 'novice';
  }

  /**
   * 獲取商情稱號
   */
  private getMarketTitle(level: number): string {
    const levelData = UNIFIED_LEVELS.find(l => l.level === level);
    return levelData?.title || '見習情報員';
  }

  /**
   * 獲取統一稱號
   */
  private getUnifiedTitle(level: number): string {
    const levelData = UNIFIED_LEVELS.find(l => l.level === level);
    return levelData?.title || '見習學徒';
  }

  // ============================================
  // 跨服務功能
  // ============================================

  /**
   * 查找跨服務連接
   */
  private findCrossConnection(progress: UnifiedUserProgress): CrossServiceConnection | null {
    // 檢查是否有可完成的跨服務連接
    for (const connection of CROSS_SERVICE_CONNECTIONS) {
      // 根據用戶進度返回適當的連接
      if (progress.reportProgress.level >= 2 && progress.marketProgress.level >= 2) {
        return connection;
      }
    }
    return null;
  }

  /**
   * 完成跨服務學習
   */
  async completeCrossServiceLearning(
    userId: string,
    reportModuleId: string,
    marketModuleId: string
  ): Promise<UnifiedUserProgress> {
    const progress = await this.getUserProgress(userId);

    // 查找對應的跨服務連接
    const connection = CROSS_SERVICE_CONNECTIONS.find(
      c => c.reportModule === reportModuleId && c.marketModule === marketModuleId
    );

    if (connection) {
      // 添加額外經驗值
      await this.addExperience(userId, connection.xpBonus, 'cross', {
        connection: `${reportModuleId} <-> ${marketModuleId}`,
      });

      // 授予跨服務徽章
      const badge: UnifiedBadge = {
        id: `badge-cross-${Date.now()}`,
        name: '觸類旁通',
        description: `完成 ${connection.reportModule} 與 ${connection.marketModule} 的跨服務學習`,
        icon: '🔗',
        earnedAt: new Date().toISOString(),
        category: 'cross',
        source: 'report',
        rarity: 'rare',
      };

      progress.unifiedBadges.push(badge);
    }

    return progress;
  }

  // ============================================
  // 成就與徽章檢查
  // ============================================

  /**
   * 檢查成就
   */
  private async checkAchievements(userId: string): Promise<void> {
    const progress = await this.getUserProgress(userId);

    // 檢查各種成就條件
    if (progress.statistics.totalModulesCompleted >= 1 &&
      !progress.unifiedAchievements.some(a => a.id === 'ach-first-module')) {
      progress.unifiedAchievements.push({
        id: 'ach-first-module',
        name: '起步者',
        description: '完成第一個教程',
        completedAt: new Date().toISOString(),
        reward: { xp: 50, legacyPoints: 10 },
        category: 'report',
        progress: 1,
        requirement: 1,
      });
    }

    if (progress.statistics.crossServiceActions >= 1 &&
      !progress.unifiedAchievements.some(a => a.id === 'ach-cross-service')) {
      progress.unifiedAchievements.push({
        id: 'ach-cross-service',
        name: '觸類旁通',
        description: '完成第一次跨服務學習',
        completedAt: new Date().toISOString(),
        reward: { xp: 100, legacyPoints: 25 },
        category: 'cross',
        progress: 1,
        requirement: 1,
      });
    }
  }

  /**
   * 檢查徽章
   */
  private async checkBadges(userId: string): Promise<void> {
    const progress = await this.getUserProgress(userId);

    // 檢查報告書徽章
    if (progress.reportProgress.level >= 3 &&
      !progress.unifiedBadges.some(b => b.id === 'badge-report-specialist')) {
      progress.unifiedBadges.push({
        id: 'badge-report-specialist',
        name: '報告書專家',
        description: '報告書等級達到專業作者',
        icon: '📊',
        earnedAt: new Date().toISOString(),
        category: 'report',
        source: 'report',
        rarity: 'rare',
      });
    }

    // 檢查商情徽章
    if (progress.marketProgress.level >= 4 &&
      !progress.unifiedBadges.some(b => b.id === 'badge-market-analyst')) {
      progress.unifiedBadges.push({
        id: 'badge-market-analyst',
        name: '趨勢分析師',
        description: '商情等級達到趨勢分析師',
        icon: '📈',
        earnedAt: new Date().toISOString(),
        category: 'market',
        source: 'market',
        rarity: 'rare',
      });
    }
  }

  // ============================================
  // 活動記錄
  // ============================================

  /**
   * 記錄活動
   */
  private logActivity(
    userId: string,
    type: UnifiedActivity['type'],
    description: string,
    xpEarned: number,
    legacyPointsEarned: number,
    metadata?: Record<string, any>
  ): void {
    const activity: UnifiedActivity = {
      id: `activity-${Date.now()}`,
      userId,
      type,
      description,
      xpEarned,
      legacyPointsEarned,
      timestamp: new Date().toISOString(),
      metadata,
    };

    this.activityLog.push(activity);

    // 保持活動記錄不超過 1000 條
    if (this.activityLog.length > 1000) {
      this.activityLog = this.activityLog.slice(-1000);
    }
  }

  /**
   * 獲取用戶活動
   */
  async getUserActivities(userId: string, limit: number = 20): Promise<UnifiedActivity[]> {
    return this.activityLog
      .filter(a => a.userId === userId)
      .slice(-limit)
      .reverse();
  }

  // ============================================
  // 排行榜
  // ============================================

  /**
   * 獲取排行榜
   */
  async getLeaderboard(limit: number = 10): Promise<any[]> {
    const leaderboard = Array.from(this.userProgressMap.values())
      .sort((a, b) => b.combinedXP - a.combinedXP)
      .slice(0, limit)
      .map((progress, index) => ({
        rank: index + 1,
        userId: progress.userId,
        username: `用戶${progress.userId.slice(-4)}`,
        level: progress.combinedLevel,
        title: progress.combinedTitle,
        xp: progress.combinedXP,
        reports: progress.statistics.totalReportsCreated,
        analyses: progress.statistics.totalAnalyses,
      }));

    return leaderboard;
  }

  // ============================================
  // AI 智能分析
  // ============================================

  /**
   * AI 智能分析用戶進度
   */
  async analyzeProgressWithAI(userId: string): Promise<string> {
    const progress = await this.getUserProgress(userId);

    const prompt = `分析以下用戶的學習進度並提供建議：

用戶 ID: ${userId}
統一等級: ${progress.combinedLevel} - ${progress.combinedTitle}
統一經驗值: ${progress.combinedXP}

報告書進度:
- 等級: ${progress.reportProgress.level} - ${progress.reportProgress.title}
- Rank: ${progress.reportProgress.rank}
- 經驗值: ${progress.reportProgress.xp}

商情進度:
- 等級: ${progress.marketProgress.level} - ${progress.marketProgress.title}
- 經驗值: ${progress.marketProgress.xp}

統計數據:
- 完成報告書: ${progress.statistics.totalReportsCreated}
- 完成分析: ${progress.statistics.totalAnalyses}
- 完成模組: ${progress.statistics.totalModulesCompleted}
- 跨服務動作: ${progress.statistics.crossServiceActions}
- 連續天數: ${progress.statistics.streakDays}
- 傳承點數: ${progress.legacyPoints}

徽章數量: ${progress.unifiedBadges.length}
成就數量: ${progress.unifiedAchievements.length}

請提供:
1. 進度分析
2. 建議的下一步學習方向
3. 可以嘗試的跨服務整合機會`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('AI analysis error:', error);
      return 'AI 分析暫時不可用，請稍後再試。';
    }
  }

  /**
   * AI 智能生成學習建議
   */
  async generateLearningAdvice(userId: string, context: string): Promise<string> {
    const progress = await this.getUserProgress(userId);

    const prompt = `基於用戶當前進度和以下上下文，提供個性化學習建議：

當前進度:
- 統一等級: ${progress.combinedLevel} - ${progress.combinedTitle}
- 報告書等級: ${progress.reportProgress.level}
- 商情等級: ${progress.marketProgress.level}

上下文: ${context}

請提供簡潔實用的學習建議，重點關注如何觸類旁通、舉一反三。`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('AI advice error:', error);
      return 'AI 建議暫時不可用，請稍後再試。';
    }
  }
}

// 導出實例
export const unifiedAdvancementService = new UnifiedAdvancementService();
