/**
 * Dashboard Snapshot Service
 * --------------------------------------------------
 * [Core Mission] Implement "Data Snapshot as Evidence", ensuring dashboard states are traceable.
 * [Protocol] 4+1 Protocol (Traceable, Trackable, Calculable, Immutable)
 * [Function] Periodically save dashboard states to the evidence vault.
 */

import { EvidenceVault } from '@/services/EvidenceVault.ts';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.ts';

import { EvidenceMap } from '@/omni/infrastructure/types/Omni-component-core.types.ts';
import { createHash } from '@/utils/crypto-shim.ts';

export interface DashboardSnapshot {
  timestamp: number;
  stats: {
    evidenceCount: number;
    truthsLinked: number;
    systemHealth: number;
    activeAgents: number;
    awakeningProgress: number;
    ultimateSkillUnlocked: boolean;
  };
  daemonStatus: {
    isRunning: boolean;
    cycleCount: number;
    agentsEvolved: number;
  };
}

class DashboardSnapshotService {
  private lastSnapshotHash: string | null = null;
  private snapshotInterval: number = 5 * 60 * 1000; // 5 minutes

  /**
   * Generate SHA-256 hash value of the data
   */
  private generateHash(data: DashboardSnapshot): string {
    const dataString = JSON.stringify(data);
    return createHash('sha256').update(dataString).digest('hex');
  }

  /**
   * Capture dashboard snapshot and save to evidence vault
   */
  public async captureSnapshot(data: DashboardSnapshot): Promise<void> {
    try {
      // Generate hash for current data
      const currentHash = this.generateHash(data);

      // If data unchanged, skip saving (avoid duplicates)
      if (currentHash === this.lastSnapshotHash) {
        return;
      }

      // Prepare full snapshot data (compliant with 4+1 Protocol)
      const snapshotPayload = {
        // Traceable
        source_origin: 'BentoDashboard.snapshot',
        trace_id: `dashboard_${Date.now()}`,

        // Trackable
        timestamp: data.timestamp,
        snapshot_type: 'dashboard_state',

        // Calculable
        stats: {
          evidenceCount: data.stats.evidenceCount,
          truthsLinked: data.stats.truthsLinked,
          systemHealth: data.stats.systemHealth,
          activeAgents: data.stats.activeAgents,
          awakeningProgress: data.stats.awakeningProgress,
          ultimateSkillUnlocked: data.stats.ultimateSkillUnlocked,
          // Calculate derived metrics
          truthLinkageRate:
            data.stats.evidenceCount > 0
              ? ((data.stats.truthsLinked / data.stats.evidenceCount) * 100).toFixed(2) + '%'
              : '0%',
        },
        daemonStatus: {
          isRunning: data.daemonStatus.isRunning,
          cycleCount: data.daemonStatus.cycleCount,
          agentsEvolved: data.daemonStatus.agentsEvolved,
        },

        // Immutable
        hash_lock: currentHash,
        verified_at: Date.now(),
      };

      // Use EvidenceVault.deposit to save snapshot
      const evidence = await EvidenceVault.deposit(
        snapshotPayload,
        `dashboard_snapshot_${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
        'application/json'
      );

      // Update last snapshot hash
      this.lastSnapshotHash = currentHash;

      console.log('[DashboardSnapshot] ✅ Snapshot saved to evidence vault', {
        evidenceId: evidence.id,
        timestamp: new Date(data.timestamp).toLocaleString('en-US'),
        hash: currentHash.substring(0, 12),
        truthLinkageRate: snapshotPayload.stats.truthLinkageRate,
      });
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[DashboardSnapshotService] [DashboardSnapshot] ❌ Snapshot saving failed:', { error })
    }
  }

  /**
   * Check if snapshot should be triggered (based on interval)
   */
  public shouldSnapshot(lastSnapshotTime: number): boolean {
    return Date.now() - lastSnapshotTime >= this.snapshotInterval;
  }

  /**
   * Get snapshot interval (milliseconds)
   */
  public getSnapshotInterval(): number {
    return this.snapshotInterval;
  }

  /**
   * Set snapshot interval (milliseconds)
   */
  public setSnapshotInterval(interval: number): void {
    this.snapshotInterval = interval;
  }
}

// Export singleton
export const dashboardSnapshotService = new DashboardSnapshotService();
