import { omniLogger, LogCategory } from './omniLogger.js';

/**
 * Scheduled Scan Service - Automated Security Monitoring
 * Supports daily, weekly, and monthly scheduled scans
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
   * Start scheduled scan
   */
  async scheduleSecurityScan(interval: ScanInterval): Promise<void> {
    // Cancel any existing schedule first
    this.cancelSchedule();

    const ms = this.getIntervalMs(interval);
    const nextScan = Date.now() + ms;

    this.config = {
      interval,
      nextScan,
      enabled: true,
    };

    // Set up the timer
    this.intervalId = setInterval(async () => {
      await this.executeScan();
      // Update next scan time
      if (this.config) {
        this.config.nextScan = Date.now() + this.getIntervalMs(interval);
        this.saveConfig();
      }
    }, ms) as any;

    this.saveConfig();

    omniLogger.info(LogCategory.SECURITY, `Scheduled scan started: ${interval}`, {
      nextScan: new Date(nextScan),
    });
  }

  /**
   * Cancel scheduled scan
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

    omniLogger.info(LogCategory.SECURITY, 'Scheduled scan cancelled');
  }

  /**
   * Get next scan time
   */
  getNextScanTime(): Date | null {
    return this.config?.enabled ? new Date(this.config.nextScan) : null;
  }

  /**
   * Check if active
   */
  isActive(): boolean {
    return this.intervalId !== null && this.config?.enabled === true;
  }

  /**
   * Get current configuration
   */
  getConfig(): ScheduleConfig | null {
    return this.config;
  }

  /**
   * Execute scan
   */
  private async executeScan(): Promise<void> {
    try {
      const { SnykService } = await import('./SnykService');
      const { OmniNexus } = await import('./OmniNexus');

      omniLogger.info(LogCategory.SECURITY, 'Starting scheduled scan...');

      const result = await SnykService.quickScan();

      if (result) {
        const critical = result.summary.critical;
        const high = result.summary.high;
        const total = critical + high;

        if (total > 0) {
          // Send high-priority notification
          OmniNexus.emit({
            id: `scheduled-scan-${Date.now()}`,
            source: 'security',
            priority: critical > 0 ? 'critical' : 'high',
            message: `🕐 Scheduled scan found ${total} high-risk vulnerabilities`,
            timestamp: Date.now(),
            metadata: {
              scheduled: true,
              interval: this.config?.interval,
              summary: result.summary,
            },
          });

          omniLogger.info(
            LogCategory.SECURITY,
            `Scheduled scan complete: Found ${total} high-risk vulnerabilities`,
            result.summary
          );
        } else {
          omniLogger.info(
            LogCategory.SECURITY,
            'Scheduled scan complete: No high-risk vulnerabilities found'
          );
        }
      }
    } catch (error) {
      omniLogger.error(LogCategory.SECURITY, 'Scheduled scan failed', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Calculate interval in milliseconds
   */
  private getIntervalMs(interval: ScanInterval): number {
    switch (interval) {
      case 'daily':
        return 24 * 60 * 60 * 1000; // 24 hours
      case 'weekly':
        return 7 * 24 * 60 * 60 * 1000; // 7 days
      case 'monthly':
        return 30 * 24 * 60 * 60 * 1000; // 30 days
    }
  }

  /**
   * Save configuration
   */
  private saveConfig(): void {
    if (this.config) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * Restore saved schedule
   */
  private restoreSchedule(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const config: ScheduleConfig = JSON.parse(saved);

        if (config.enabled) {
          this.config = config;

          // If next scan time has passed, execute immediately
          if (config.nextScan < Date.now()) {
            this.executeScan();
          }

          // Start schedule
          this.scheduleSecurityScan(config.interval);

          omniLogger.info(LogCategory.SECURITY, 'Scheduled scan restored', {
            interval: config.interval,
          });
        }
      }
    } catch (error) {
      omniLogger.error(LogCategory.SECURITY, 'Failed to restore scheduled scan', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

// Singleton
export const SchedulerService = new SchedulerServiceClass();
