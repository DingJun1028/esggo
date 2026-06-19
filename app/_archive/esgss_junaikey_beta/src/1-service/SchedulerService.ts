import { omniLogger, LogCategory } from './omniLogger';

/**
 * 定時掃描服務 - 自動化安全監控
 * 支持每日、每週、每月定時掃描
 */

type ScanInterval = 'daily' | 'weekly' | 'monthly';

interface ScheduleConfig {
  interval: ScanInterval;
  nextScan: number;
  enabled: boolean;
}

class SchedulerServiceClass {
  private intervalId: NodeJS.Timeout | null = null;
  private config: ScheduleConfig | null = null;
  private readonly STORAGE_KEY = 'scheduled_scan_config';

  constructor() {
    this.restoreSchedule();
  }

  /**
   * 啟動定時掃描
   */
  async scheduleSecurityScan(interval: ScanInterval): Promise<void> {
    // 先取消現有排程
    this.cancelSchedule();

    const ms = this.getIntervalMs(interval);
    const nextScan = Date.now() + ms;

    this.config = {
      interval,
      nextScan,
      enabled: true,
    };

    // 設置定時器
    this.intervalId = setInterval(async () => {
      await this.executeScan();
      // 更新下次掃描時間
      if (this.config) {
        this.config.nextScan = Date.now() + this.getIntervalMs(interval);
        this.saveConfig();
      }
    }, ms) as any;

    this.saveConfig();

    omniLogger.info(LogCategory.SECURITY, `定時掃描已啟動: ${interval}`, {
      nextScan: new Date(nextScan),
    });
  }

  /**
   * 取消定時掃描
   */
  cancelSchedule(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.config) {
      this.config.enabled = false;
      this.saveConfig();
    }

    omniLogger.info(LogCategory.SECURITY, '定時掃描已取消');
  }

  /**
   * 獲取下次掃描時間
   */
  getNextScanTime(): Date | null {
    return this.config?.enabled ? new Date(this.config.nextScan) : null;
  }

  /**
   * 檢查是否啟用
   */
  isActive(): boolean {
    return this.intervalId !== null && this.config?.enabled === true;
  }

  /**
   * 獲取當前配置
   */
  getConfig(): ScheduleConfig | null {
    return this.config;
  }

  /**
   * 執行掃描
   */
  private async executeScan(): Promise<void> {
    try {
      const { SnykService } = await import('./SnykService');
      const { OmniNexus } = await import('./OmniNexus');

      omniLogger.info(LogCategory.SECURITY, '開始定時掃描...');

      const result = await SnykService.quickScan();

      if (result) {
        const critical = result.summary.critical;
        const high = result.summary.high;
        const total = critical + high;

        if (total > 0) {
          // 發送高優先級通知
          OmniNexus.emit({
            id: `scheduled-scan-${Date.now()}`,
            source: 'security',
            priority: critical > 0 ? 'critical' : 'high',
            message: `🕐 定時掃描發現 ${total} 個高危漏洞`,
            timestamp: Date.now(),
            metadata: {
              scheduled: true,
              interval: this.config?.interval,
              summary: result.summary,
            },
          });

          omniLogger.info(
            LogCategory.SECURITY,
            `定時掃描完成: 發現 ${total} 個高危漏洞`,
            result.summary
          );
        } else {
          omniLogger.info(LogCategory.SECURITY, '定時掃描完成: 未發現高危漏洞');
        }
      }
    } catch (error) {
      omniLogger.error(LogCategory.SECURITY, '定時掃描失敗', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * 計算間隔毫秒數
   */
  private getIntervalMs(interval: ScanInterval): number {
    switch (interval) {
      case 'daily':
        return 24 * 60 * 60 * 1000; // 24小時
      case 'weekly':
        return 7 * 24 * 60 * 60 * 1000; // 7天
      case 'monthly':
        return 30 * 24 * 60 * 60 * 1000; // 30天
    }
  }

  /**
   * 保存配置
   */
  private saveConfig(): void {
    if (this.config) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * 恢復已保存的排程
   */
  private restoreSchedule(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const config: ScheduleConfig = JSON.parse(saved);

        if (config.enabled) {
          this.config = config;

          // 如果下次掃描時間已過，立即執行一次
          if (config.nextScan < Date.now()) {
            this.executeScan();
          }

          // 啟動排程
          this.scheduleSecurityScan(config.interval);

          omniLogger.info(LogCategory.SECURITY, '已恢復定時掃描', { interval: config.interval });
        }
      }
    } catch (error) {
      omniLogger.error(LogCategory.SECURITY, '恢復定時掃描失敗', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

// 單例
export const SchedulerService = new SchedulerServiceClass();
