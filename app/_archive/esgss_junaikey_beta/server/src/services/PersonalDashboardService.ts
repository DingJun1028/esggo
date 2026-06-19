/**
 * PersonalDashboardService.ts
 * ----------------------------
 * 個人儀表板核心服務：統整用戶資產、進度與使命
 */

export interface ActivityLog {
    id: string;
    type: string;
    description: string;
    timestamp: number;
    points?: number;
}

export interface StatSummary {
    totalTco2eSaved: number;
    skillsMastered: number;
    badgesCount: number;
    learningHours: number;
}

export interface DashboardData {
    userId: string;
    avatarId: string;
    activeMissionIds: string[];
    recentActivities: ActivityLog[];
    stats: StatSummary;
    negentropyScore: number; // 負熵分數 (秩序性度量)
}

export class PersonalDashboardService {
    private static instance: PersonalDashboardService;

    static getInstance(): PersonalDashboardService {
        if (!PersonalDashboardService.instance) {
            PersonalDashboardService.instance = new PersonalDashboardService();
        }
        return PersonalDashboardService.instance;
    }

    /**
     * 獲取儀表板完整數據
     */
    async getDashboardData(userId: string): Promise<DashboardData> {
        // 實際應從數據庫與多個服務 (Carbon, Avatar, Learning) 獲取
        return {
            userId,
            avatarId: 'avatar-user-1',
            activeMissionIds: ['m-001', 'm-004'],
            recentActivities: [
                { id: '1', type: 'REPORT', description: '發布 2024 年度報告', timestamp: Date.now() - 86400000, points: 50 },
                { id: '2', type: 'CARBON', description: '完成範疇二數據核校', timestamp: Date.now() - 3600000, points: 30 }
            ],
            stats: {
                totalTco2eSaved: 124.5,
                skillsMastered: 15,
                badgesCount: 8,
                learningHours: 42
            },
            negentropyScore: 88
        };
    }

    /**
     * 計算負熵積分 (Negentropy Calculation Logic)
     * 基於活動的多樣性、頻率與系統貢獻度
     */
    calculateNegentropy(activities: ActivityLog[]): number {
        // 簡單邏輯：活動越多，系統越有序
        return Math.min(100, Math.floor(activities.length * 5 + 50));
    }
}

export const personalDashboardService = PersonalDashboardService.getInstance();
