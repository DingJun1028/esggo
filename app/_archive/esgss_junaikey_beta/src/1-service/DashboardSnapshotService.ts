import { IComponentCore } from '../../lib/ucc-engine';

interface DashboardStats {
  evidenceCount: number;
  truthsLinked: number;
  systemHealth: string;
  activeAgents: number;
  ultimateSkillUnlocked: boolean;
}

interface SnapshotPayload {
  uuid: string;
  timestamp: number;
  type: 'dashboard_state';
  data: DashboardStats;
  meta: {
    protocol: '5T';
    version: '8.2.0';
  };
}

class DashboardSnapshotService {
  private snapshotInterval: number = 300000; // 5 minutes

  /**
   * 判斷是否需要進行快照
   * Determines if a snapshot is needed based on the last snapshot time.
   */
  public shouldSnapshot(lastSnapshotTime: number): boolean {
    return Date.now() - lastSnapshotTime >= this.snapshotInterval;
  }

  /**
   * 創建快照數據
   * Creates the snapshot payload from current dashboard stats.
   * 遵循 5T 協議：
   * - Traceable (可溯): 記錄時間戳與 UUID
   * - Trackable (可蹤): 記錄系統狀態
   */
  public createSnapshot(stats: DashboardStats): SnapshotPayload {
    return {
      uuid: crypto.randomUUID(),
      timestamp: Date.now(),
      type: 'dashboard_state',
      data: stats,
      meta: {
        protocol: '5T',
        version: '8.2.0',
      },
    };
  }

  /**
   * 設置快照間隔
   */
  public setSnapshotInterval(interval: number): void {
    this.snapshotInterval = interval;
  }

  /**
   * 獲取快照間隔
   */
  public getSnapshotInterval(): number {
    return this.snapshotInterval;
  }
}

export const dashboardSnapshotService = new DashboardSnapshotService();
