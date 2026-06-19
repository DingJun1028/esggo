/**
 * UnifiedAdvancementMetrics.ts
 * -----------------------------
 * 奧秘晉級系統 - 監控指標服務
 * 
 * 核心理念：永續經營，監控先行
 * 設計哲學：數據驅動，持續優化
 */

/**
 * 系統指標接口
 */
export interface SystemMetrics {
  uptime: number;
  memoryUsage: NodeJS.MemoryUsage;
  activeUsers: number;
  totalUsers: number;
  requestsPerSecond: number;
  averageResponseTime: number;
  errorRate: number;
  cacheHitRate: number;
}

/**
 * 用戶活動指標
 */
export interface UserActivityMetrics {
  totalUsers: number;
  activeToday: number;
  activeThisWeek: number;
  activeThisMonth: number;
  newUsersToday: number;
  newUsersThisWeek: number;
}

/**
 * 學習指標
 */
export interface LearningMetrics {
  totalModulesCompleted: number;
  totalReportsGenerated: number;
  totalAnalysesCompleted: number;
  totalCrossServiceActions: number;
  averageSessionDuration: number;
  completionRate: number;
}

/**
 * 等級分佈
 */
export interface LevelDistribution {
  level1: number;
  level2: number;
  level3: number;
  level4: number;
  level5: number;
  level6: number;
  level7: number;
  level8: number;
  level9: number;
  level10: number;
  level11: number;
  level12: number;
  level13: number;
}

/**
 * 徽章統計
 */
export interface BadgeStatistics {
  totalBadges: number;
  badgesEarnedToday: number;
  mostCommonBadge: string;
  rareBadges: number;
  legendaryBadges: number;
}

/**
 * 傳承統計
 */
export interface LegacyStatistics {
  totalLegacyPoints: number;
  totalTransfers: number;
  transfersToday: number;
  averageTransferAmount: number;
}

/**
 * 監控指標服務類別
 */
export class UnifiedAdvancementMetrics {
  private startTime: Date;
  private requestCount: number;
  private errorCount: number;
  private cacheHitCount: number;
  private cacheMissCount: number;
  
  constructor() {
    this.startTime = new Date();
    this.requestCount = 0;
    this.errorCount = 0;
    this.cacheHitCount = 0;
    this.cacheMissCount = 0;
  }

  /**
   * 記錄請求
   */
  recordRequest(): void {
    this.requestCount++;
  }

  /**
   * 記錄錯誤
   */
  recordError(): void {
    this.errorCount++;
  }

  /**
   * 記錄快取命中
   */
  recordCacheHit(): void {
    this.cacheHitCount++;
  }

  /**
   * 記錄快取未命中
   */
  recordCacheMiss(): void {
    this.cacheMissCount++;
  }

  /**
   * 獲取系統指標
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    const uptime = Date.now() - this.startTime.getTime();
    const memoryUsage = process.memoryUsage();
    const activeUsers = await this.getActiveUsers();
    const totalUsers = await this.getTotalUsers();
    const requestsPerSecond = this.requestCount / (uptime / 1000);
    const errorRate = this.requestCount > 0 ? this.errorCount / this.requestCount : 0;
    const cacheHitRate = (this.cacheHitCount + this.cacheMissCount) > 0 
      ? this.cacheHitCount / (this.cacheHitCount + this.cacheMissCount) 
      : 0;

    return {
      uptime,
      memoryUsage,
      activeUsers,
      totalUsers,
      requestsPerSecond,
      averageResponseTime: 150, // 模擬值
      errorRate,
      cacheHitRate,
    };
  }

  /**
   * 獲取用戶活動指標
   */
  async getUserActivityMetrics(): Promise<UserActivityMetrics> {
    // 模擬數據
    return {
      totalUsers: 1000,
      activeToday: 150,
      activeThisWeek: 400,
      activeThisMonth: 700,
      newUsersToday: 20,
      newUsersThisWeek: 100,
    };
  }

  /**
   * 獲取學習指標
   */
  async getLearningMetrics(): Promise<LearningMetrics> {
    // 模擬數據
    return {
      totalModulesCompleted: 5000,
      totalReportsGenerated: 1200,
      totalAnalysesCompleted: 800,
      totalCrossServiceActions: 300,
      averageSessionDuration: 25, // 分鐘
      completionRate: 0.75,
    };
  }

  /**
   * 獲取等級分佈
   */
  async getLevelDistribution(): Promise<LevelDistribution> {
    // 模擬數據
    return {
      level1: 200,
      level2: 180,
      level3: 150,
      level4: 120,
      level5: 100,
      level6: 80,
      level7: 60,
      level8: 40,
      level9: 30,
      level10: 20,
      level11: 10,
      level12: 5,
      level13: 5,
    };
  }

  /**
   * 獲取徽章統計
   */
  async getBadgeStatistics(): Promise<BadgeStatistics> {
    // 模擬數據
    return {
      totalBadges: 3000,
      badgesEarnedToday: 50,
      mostCommonBadge: 'ESG 初學者',
      rareBadges: 200,
      legendaryBadges: 50,
    };
  }

  /**
   * 獲取傳承統計
   */
  async getLegacyStatistics(): Promise<LegacyStatistics> {
    // 模擬數據
    return {
      totalLegacyPoints: 50000,
      totalTransfers: 500,
      transfersToday: 10,
      averageTransferAmount: 100,
    };
  }

  /**
   * 獲取所有指標
   */
  async getAllMetrics(): Promise<{
    system: SystemMetrics;
    userActivity: UserActivityMetrics;
    learning: LearningMetrics;
    levelDistribution: LevelDistribution;
    badges: BadgeStatistics;
    legacy: LegacyStatistics;
  }> {
    const [
      system,
      userActivity,
      learning,
      levelDistribution,
      badges,
      legacy,
    ] = await Promise.all([
      this.getSystemMetrics(),
      this.getUserActivityMetrics(),
      this.getLearningMetrics(),
      this.getLevelDistribution(),
      this.getBadgeStatistics(),
      this.getLegacyStatistics(),
    ]);

    return {
      system,
      userActivity,
      learning,
      levelDistribution,
      badges,
      legacy,
    };
  }

  /**
   * 獲取活躍用戶數
   */
  private async getActiveUsers(): Promise<number> {
    // 模擬數據
    return 150;
  }

  /**
   * 獲取總用戶數
   */
  private async getTotalUsers(): Promise<number> {
    // 模擬數據
    return 1000;
  }

  /**
   * 生成健康報告
   */
  async generateHealthReport(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    score: number;
    issues: string[];
    recommendations: string[];
  }> {
    const metrics = await this.getSystemMetrics();
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // 檢查錯誤率
    if (metrics.errorRate > 0.05) {
      issues.push('錯誤率過高');
      score -= 20;
      recommendations.push('檢查錯誤日誌，修復問題');
    }

    // 檢查快取命中率
    if (metrics.cacheHitRate < 0.7) {
      issues.push('快取命中率過低');
      score -= 15;
      recommendations.push('優化快取策略');
    }

    // 檢查響應時間
    if (metrics.averageResponseTime > 500) {
      issues.push('響應時間過長');
      score -= 10;
      recommendations.push('優化數據庫查詢');
    }

    // 確定狀態
    let status: 'healthy' | 'warning' | 'critical';
    if (score >= 80) {
      status = 'healthy';
    } else if (score >= 50) {
      status = 'warning';
    } else {
      status = 'critical';
    }

    return {
      status,
      score,
      issues,
      recommendations,
    };
  }
}

// 導出實例
export const unifiedAdvancementMetrics = new UnifiedAdvancementMetrics();
