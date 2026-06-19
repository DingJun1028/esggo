/**
 * ReportAdvancementService.ts
 * ---------------------------
 * 永續報告書撰寫中心 - 晉級系統服務
 * 
 * 核心理念：服務即教學，知識即資產
 * 設計哲學：上善若水，如水般清澈、流動、和諧
 */

// ============================================
// 類型定義
// ============================================

export interface UserRank {
    userId: string;
    currentRank: RankLevel;
    experiencePoints: number;
    level: number;
    title: string;
    badges: Badge[];
    achievements: Achievement[];
    progress: RankProgress;
    statistics: UserStatistics;
    rankHistory: RankHistoryItem[];
}

export type RankLevel =
    | 'novice'      // 新手
    | 'apprentice'  // 學徒
    | 'practitioner' // 從業者
    | 'specialist'   // 專家
    | 'master'      // 大師
    | 'grandmaster' // 宗師
    | 'legend';     // 傳說

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: string;
    category: 'tutorial' | 'report' | 'verification' | 'special';
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    completedAt: string;
    reward: {
        points: number;
        badge?: string;
    };
}

export interface RankProgress {
    currentLevelXP: number;
    nextLevelXP: number;
    completionPercentage: number;
    nextMilestone: string;
    recentActivities: Activity[];
}

export interface Activity {
    id: string;
    type: 'tutorial' | 'report' | 'quiz' | 'verification' | 'collaboration';
    description: string;
    xpEarned: number;
    timestamp: string;
    metadata?: Record<string, any>;
}

export interface UserStatistics {
    totalReportsCreated: number;
    totalReportsPublished: number;
    totalTutorialsCompleted: number;
    totalQuizzesTaken: number;
    averageQuizScore: number;
    totalXPEarned: number;
    streakDays: number;
    lastActiveDate: string;
}

export interface RankHistoryItem {
    date: string;
    previousRank?: RankLevel;
    newRank: RankLevel;
    reason: string;
    xpAtRank: number;
}

export interface LevelThreshold {
    level: number;
    rank: RankLevel;
    title: string;
    xpRequired: number;
    privileges: string[];
    requirements: string[];
}

// ============================================
// 等級閾值定義
// ============================================

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
    {
        level: 1,
        rank: 'novice',
        title: '永續見習生',
        xpRequired: 0,
        privileges: ['存取基礎教學', '建立草稿報告書'],
        requirements: ['完成新手教學'],
    },
    {
        level: 2,
        rank: 'novice',
        title: '永續初學者',
        xpRequired: 200,
        privileges: ['存取進階教學', '使用 AI 輔助'],
        requirements: ['完成 2 個教學模組'],
    },
    {
        level: 3,
        rank: 'apprentice',
        title: '永續學徒',
        xpRequired: 500,
        privileges: ['建立完整報告書', '存取 GRI 對照表'],
        requirements: ['完成 4 個教學模組', '建立 1 份報告書'],
    },
    {
        level: 4,
        rank: 'apprentice',
        title: '永續實習生',
        xpRequired: 1000,
        privileges: ['使用 TCFD 模板', '產生完整性報告'],
        requirements: ['完成 GRI 基礎教學'],
    },
    {
        level: 5,
        rank: 'practitioner',
        title: '永續從業者',
        xpRequired: 2000,
        privileges: ['存取所有框架', '下載 PDF 報告'],
        requirements: ['完成 6 個教學模組', '發布 1 份報告書'],
    },
    {
        level: 6,
        rank: 'practitioner',
        title: '永續分析師',
        xpRequired: 3500,
        privileges: ['進階數據分析', '自訂模板'],
        requirements: ['報告書完整性達 70%'],
    },
    {
        level: 7,
        rank: 'specialist',
        title: '永續專家',
        xpRequired: 5000,
        privileges: ['團隊協作功能', '第三方驗證申請'],
        requirements: ['完成所有 Level 1-2 教學', '發布 3 份報告書'],
    },
    {
        level: 8,
        rank: 'specialist',
        title: '資深專家',
        xpRequired: 8000,
        privileges: ['API 存取', '進階分析報告'],
        requirements: ['報告書完整性達 90%'],
    },
    {
        level: 9,
        rank: 'master',
        title: '永續大師',
        xpRequired: 12000,
        privileges: ['客製化框架', '教育者認證'],
        requirements: ['完成所有教學模組', '發布 5 份報告書'],
    },
    {
        level: 10,
        rank: 'master',
        title: '首席大師',
        xpRequired: 20000,
        privileges: ['系統管理', '輔導他人'],
        requirements: ['輔導 3 位用戶晉級'],
    },
    {
        level: 11,
        rank: 'grandmaster',
        title: '永續宗師',
        xpRequired: 35000,
        privileges: ['策略顧問', '系統優化建議'],
        requirements: ['報告書獲第三方驗證'],
    },
    {
        level: 12,
        rank: 'grandmaster',
        title: '大宗師',
        xpRequired: 50000,
        privileges: ['參與產品開發', '優先新功能體驗'],
        requirements: ['社群貢獻者'],
    },
    {
        level: 13,
        rank: 'legend',
        title: '永續傳說',
        xpRequired: 100000,
        privileges: ['終身成就徽章', '專屬顧問'],
        requirements: ['對社群有重大貢獻'],
    },
];

// ============================================
// 成就定義
// ============================================

export const ACHIEVEMENTS = [
    {
        id: 'first-tutorial',
        name: '第一步',
        description: '完成第一個教學模組',
        xpReward: 50,
        badge: '新手永續人',
        condition: (stats: UserStatistics) => stats.totalTutorialsCompleted >= 1,
    },
    {
        id: 'tutorial-master',
        name: '教學大師',
        description: '完成所有教學模組',
        xpReward: 500,
        badge: '學習冠軍',
        condition: (stats: UserStatistics) => stats.totalTutorialsCompleted >= 6,
    },
    {
        id: 'first-report',
        name: '處女作',
        description: '建立第一份報告書',
        xpReward: 100,
        badge: '報告書新手',
        condition: (stats: UserStatistics) => stats.totalReportsCreated >= 1,
    },
    {
        id: 'report-publisher',
        name: '發布者',
        description: '發布第一份報告書',
        xpReward: 300,
        badge: '永續傳播者',
        condition: (stats: UserStatistics) => stats.totalReportsPublished >= 1,
    },
    {
        id: 'prolific-writer',
        name: '高產作者',
        description: '發布 5 份報告書',
        xpReward: 1000,
        badge: '永續作家',
        condition: (stats: UserStatistics) => stats.totalReportsPublished >= 5,
    },
    {
        id: 'quiz-ace',
        name: '測驗高手',
        description: '測驗平均分數達 90 分以上',
        xpReward: 200,
        badge: '測驗達人',
        condition: (stats: UserStatistics) => stats.averageQuizScore >= 90,
    },
    {
        id: 'streak-week',
        name: '連續一週',
        description: '連續 7 天活躍',
        xpReward: 150,
        badge: '恆毅力者',
        condition: (stats: UserStatistics) => stats.streakDays >= 7,
    },
    {
        id: 'streak-month',
        name: '連續一月',
        description: '連續 30 天活躍',
        xpReward: 500,
        badge: '永續堅持者',
        condition: (stats: UserStatistics) => stats.streakDays >= 30,
    },
    {
        id: 'completeness-master',
        name: '完整性大師',
        description: '報告書完整性達 100%',
        xpReward: 400,
        badge: '完美主義者',
        condition: () => true, // 需要報告書數據
    },
    {
        id: 'tcfd-expert',
        name: 'TCFD 專家',
        description: '完成 TCFD 教學並在報告書中應用',
        xpReward: 300,
        badge: '氣候揭露專家',
        condition: () => true, // 需要報告書數據
    },
    {
        id: 'encyclopedic-author',
        name: '百科全書作者',
        description: '發布一份超過 500 頁的永續報告書',
        xpReward: 1000,
        badge: '知識巨擘',
        condition: (stats: UserStatistics, metadata?: any) => metadata?.pageCount >= 500,
    },
];

// ============================================
// 徽章定義
// ============================================

export const BADGES: Omit<Badge, 'earnedAt'>[] = [
    // 教學相關
    { id: 'tutorial-1', name: '新手永續人', description: '完成第一個教學模組', icon: '🌱', category: 'tutorial' },
    { id: 'tutorial-2', name: 'GRI 基礎學徒', description: '完成 GRI 基礎教學', icon: '📚', category: 'tutorial' },
    { id: 'tutorial-3', name: '環境守護者', description: '完成環境章節教學', icon: '🌍', category: 'tutorial' },
    { id: 'tutorial-4', name: '社會關懷者', description: '完成社會章節教學', icon: '🤝', category: 'tutorial' },
    { id: 'tutorial-5', name: '治理專家', description: '完成治理章節教學', icon: '⚖️', category: 'tutorial' },
    { id: 'tutorial-6', name: '氣候揭露專家', description: '完成 TCFD 教學', icon: '🌡️', category: 'tutorial' },

    // 報告書相關
    { id: 'report-1', name: '報告書新手', description: '建立第一份報告書', icon: '📄', category: 'report' },
    { id: 'report-2', name: '永續傳播者', description: '發布第一份報告書', icon: '📢', category: 'report' },
    { id: 'report-3', name: '永續作家', description: '發布 5 份報告書', icon: '✍️', category: 'report' },
    { id: 'report-4', name: '完美主義者', description: '報告書完整性達 100%', icon: '💯', category: 'report' },

    // 驗證相關
    { id: 'verify-1', name: '品質把關者', description: '完成報告書驗證', icon: '✅', category: 'verification' },
    { id: 'verify-2', name: '第三方認證', description: '報告書獲外部驗證', icon: '🏆', category: 'verification' },

    // 特殊
    { id: 'special-1', name: '恆毅力者', description: '連續 7 天活躍', icon: '🔥', category: 'special' },
    { id: 'special-2', name: '永續堅持者', description: '連續 30 天活躍', icon: '⭐', category: 'special' },
    { id: 'special-3', name: '測驗達人', description: '測驗平均分數達 90 分以上', icon: '🎯', category: 'special' },
    { id: 'special-4', name: '學習冠軍', description: '完成所有教學模組', icon: '🏅', category: 'special' },
    { id: 'special-5', name: '知識巨擘', description: '發布超過 500 頁的報告書', icon: '📚', category: 'special' },
];

// ============================================
// 服務類別
// ============================================

export class ReportAdvancementService {
    private static instance: ReportAdvancementService;

    static getInstance(): ReportAdvancementService {
        if (!ReportAdvancementService.instance) {
            ReportAdvancementService.instance = new ReportAdvancementService();
        }
        return ReportAdvancementService.instance;
    }

    // ========================================
    // 等級與經驗值管理
    // ========================================

    /**
     * 計算用戶當前等級
     */
    calculateLevel(xp: number): { level: number; rank: RankLevel; title: string; nextLevelXP: number } {
        let currentLevel = 1;
        let currentRank: RankLevel = 'novice';
        let currentTitle = '永續見習生';
        let nextXP = 200;

        for (const threshold of LEVEL_THRESHOLDS) {
            if (xp >= threshold.xpRequired) {
                currentLevel = threshold.level;
                currentRank = threshold.rank;
                currentTitle = threshold.title;

                // 找到下一級的 XP
                const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === threshold.level + 1);
                nextXP = nextThreshold?.xpRequired || threshold.xpRequired * 2;
            }
        }

        return { level: currentLevel, rank: currentRank, title: currentTitle, nextLevelXP: nextXP };
    }

    /**
     * 計算升級進度
     */
    calculateProgress(xp: number): RankProgress {
        const { level, nextLevelXP } = this.calculateLevel(xp);

        // 找到當前等級的 XP 門檻
        const currentThreshold = LEVEL_THRESHOLDS.find(t => t.level === level);
        const prevThreshold = LEVEL_THRESHOLDS.find(t => t.level === level - 1);

        const currentLevelXP = prevThreshold ? xp - prevThreshold.xpRequired : xp;
        const requiredXP = currentThreshold ? currentThreshold.xpRequired - (prevThreshold?.xpRequired || 0) : 200;

        const completionPercentage = Math.min(100, Math.round((currentLevelXP / requiredXP) * 100));

        // 找到下一個里程碑
        const nextMilestone = LEVEL_THRESHOLDS.find(t => t.level > level)?.title || '最高等級';

        return {
            currentLevelXP,
            nextLevelXP,
            completionPercentage,
            nextMilestone,
            recentActivities: [],
        };
    }

    /**
     * 計算經驗值獎勵
     */
    calculateXPReward(
        activityType: Activity['type'],
        options?: {
            completeness?: number;
            quizScore?: number;
            isFirstTime?: boolean;
            pageCount?: number;
        }
    ): number {
        const baseXP: Record<Activity['type'], number> = {
            tutorial: 50,
            report: 100,
            quiz: 25,
            verification: 75,
            collaboration: 30,
        };

        let xp = baseXP[activityType];

        // 完整性加成
        if (options?.completeness !== undefined) {
            xp += Math.round(options.completeness * 0.5);
        }

        // 測驗分數加成
        if (options?.quizScore !== undefined) {
            xp += Math.round(options.quizScore * 0.3);
        }

        // 首次完成加成
        if (options?.isFirstTime) {
            xp *= 2;
        }

        // 頁數加成 (500頁以上)
        if (options?.pageCount && options.pageCount >= 500) {
            xp += 500; // 額外獎勵
        }

        return xp;
    }

    // ========================================
    // 用戶狀態管理
    // ========================================

    /**
     * 初始化用戶等級狀態
     */
    initializeUserRank(userId: string): UserRank {
        return {
            userId,
            currentRank: 'novice',
            experiencePoints: 0,
            level: 1,
            title: '永續見習生',
            badges: [],
            achievements: [],
            progress: {
                currentLevelXP: 0,
                nextLevelXP: 200,
                completionPercentage: 0,
                nextMilestone: '永續初學者',
                recentActivities: [],
            },
            statistics: {
                totalReportsCreated: 0,
                totalReportsPublished: 0,
                totalTutorialsCompleted: 0,
                totalQuizzesTaken: 0,
                averageQuizScore: 0,
                totalXPEarned: 0,
                streakDays: 0,
                lastActiveDate: new Date().toISOString(),
            },
            rankHistory: [
                {
                    date: new Date().toISOString(),
                    newRank: 'novice',
                    reason: '開始永續之旅',
                    xpAtRank: 0,
                },
            ],
        };
    }

    /**
     * 更新用戶等級狀態
     */
    async updateUserRank(
        userId: string,
        activity: Omit<Activity, 'id' | 'timestamp'>
    ): Promise<UserRank> {
        // 計算 XP 獎勵
        const xpEarned = this.calculateXPReward(activity.type, {
            completeness: activity.metadata?.completeness,
            quizScore: activity.metadata?.quizScore,
            isFirstTime: activity.metadata?.isFirstTime,
            pageCount: activity.metadata?.pageCount,
        });

        // 構建活動記錄
        const fullActivity: Activity = {
            ...activity,
            id: `activity-${Date.now()}`,
            xpEarned,
            timestamp: new Date().toISOString(),
        };

        // 模擬更新用戶狀態
        const updatedRank: UserRank = {
            userId,
            currentRank: 'novice',
            experiencePoints: xpEarned,
            level: 1,
            title: '永續見習生',
            badges: [],
            achievements: [],
            progress: {
                currentLevelXP: xpEarned,
                nextLevelXP: 200,
                completionPercentage: Math.round((xpEarned / 200) * 100),
                nextMilestone: '永續初學者',
                recentActivities: [fullActivity],
            },
            statistics: {
                totalReportsCreated: activity.type === 'report' ? 1 : 0,
                totalReportsPublished: 0,
                totalTutorialsCompleted: activity.type === 'tutorial' ? 1 : 0,
                totalQuizzesTaken: activity.type === 'quiz' ? 1 : 0,
                averageQuizScore: activity.metadata?.quizScore || 0,
                totalXPEarned: xpEarned,
                streakDays: 1,
                lastActiveDate: new Date().toISOString(),
            },
            rankHistory: [],
            // 臨時存儲 metadata 用於成就檢查
            lastActivityMetadata: activity.metadata,
        } as UserRank & { lastActivityMetadata?: any };

        return updatedRank;
    }

    // ========================================
    // 成就與徽章
    // ========================================

    /**
     * 檢查並授予成就
     */
    checkAndGrantAchievements(
        rank: UserRank
    ): Achievement[] {
        const newAchievements: Achievement[] = [];

        for (const achievement of ACHIEVEMENTS) {
            // 檢查是否已獲得
            const alreadyEarned = rank.achievements.some(a => a.id === achievement.id);
            if (alreadyEarned) continue;

            // 檢查條件
            if (achievement.condition(rank.statistics, (rank as any).lastActivityMetadata)) {
                const newAchievement: Achievement = {
                    id: achievement.id,
                    name: achievement.name,
                    description: achievement.description,
                    completedAt: new Date().toISOString(),
                    reward: {
                        points: achievement.xpReward,
                        badge: achievement.badge,
                    },
                };
                newAchievements.push(newAchievement);
            }
        }

        return newAchievements;
    }

    /**
     * 授予徽章
     */
    grantBadge(
        rank: UserRank,
        badgeId: string
    ): { success: boolean; badge?: Badge; message: string } {
        const badgeTemplate = BADGES.find(b => b.id === badgeId);
        if (!badgeTemplate) {
            return { success: false, message: '徽章不存在' };
        }

        // 檢查是否已獲得
        if (rank.badges.some(b => b.id === badgeId)) {
            return { success: false, message: '已獲得此徽章' };
        }

        const newBadge: Badge = {
            ...badgeTemplate,
            earnedAt: new Date().toISOString(),
        };

        return { success: true, badge: newBadge, message: `成功獲得徽章：${badgeTemplate.name}` };
    }

    /**
     * 獲取所有徽章
     */
    getAllBadges(): Omit<Badge, 'earnedAt'>[] {
        return BADGES;
    }

    /**
     * 獲取所有成就
     */
    getAllAchievements() {
        return ACHIEVEMENTS;
    }

    // ========================================
    // 排行榜
    // ========================================

    /**
     * 獲取排行榜
     */
    async getLeaderboard(
        options?: {
            limit?: number;
            timeframe?: 'weekly' | 'monthly' | 'allTime';
            criteria?: 'xp' | 'reports' | 'tutorials';
        }
    ): Promise<{ rank: number; userId: string; username: string; score: number }[]> {
        // 模擬排行榜數據
        const mockLeaderboard = [
            { rank: 1, userId: 'user-1', username: '永續先驅', score: 50000 },
            { rank: 2, userId: 'user-2', username: '綠色領袖', score: 45000 },
            { rank: 3, userId: 'user-3', username: '環境守護者', score: 40000 },
            { rank: 4, userId: 'user-4', username: '治理專家', score: 35000 },
            { rank: 5, userId: 'user-5', username: '碳中和實踐者', score: 30000 },
        ];

        return mockLeaderboard.slice(0, options?.limit || 10);
    }

    // ========================================
    // 權限檢查
    // ========================================

    /**
     * 檢查用戶是否有特定權限
     */
    checkPrivilege(
        rank: UserRank,
        privilege: string
    ): boolean {
        const levelInfo = LEVEL_THRESHOLDS.find(t => t.level === rank.level);
        return levelInfo?.privileges.includes(privilege) || false;
    }

    /**
     * 獲取用戶當前等級的所有權限
     */
    getUserPrivileges(level: number): string[] {
        const levelInfo = LEVEL_THRESHOLDS.find(t => t.level === level);
        return levelInfo?.privileges || [];
    }

    /**
     * 獲取升級到下一級的要求
     */
    getNextLevelRequirements(level: number): string[] {
        const nextLevel = LEVEL_THRESHOLDS.find(t => t.level === level + 1);
        return nextLevel?.requirements || [];
    }
}

// 導出單例
export const reportAdvancementService = ReportAdvancementService.getInstance();
