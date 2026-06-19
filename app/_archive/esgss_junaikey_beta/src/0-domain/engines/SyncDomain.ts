/**
 * 🏛️ 雙向同步核心引擎 (SyncDomain)
 * --------------------------------------------------
 * 作為最中心層的同步調度器，連結 1-service 與 0-domain。
 */

import { ISyncDomain, SyncDirection, SyncSession } from '../contracts/ISyncDomain';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { bidirectionalSyncService } from '@service/bidirectionalSync';
import { realTimeDataSync } from '@service/realTimeDataSync';
import { omniDataCenterService } from '@service/OmniDataCenterService';

export class SyncDomain implements ISyncDomain {
  private _session: SyncSession;

  constructor() {
    this._session = {
      sessionId: 'SYNC-' + Date.now(),
      startTime: Date.now(),
      direction: 'BIDIRECTIONAL',
      status: 'ACTIVE',
    };
  }

  get syncStatus(): SyncSession {
    return this._session;
  }

  /**
   * 開啟最中心層的同步領域
   */
  async activateDomain(): Promise<void> {
    omniLogger.info(LogCategory.SYSTEM, 'Activating Bidirectional Sync Domain (Central Core)');
    this._session.status = 'ACTIVE';

    // 初始化實時同步鏈結
    await realTimeDataSync.connect('wss://esg-sovereign-node.cloud', { timeout: 5000 });

    // 激活 OmniSpace 引擎
    await omniDataCenterService.activateOmniEngine();

    omniLogger.info(
      LogCategory.SYSTEM,
      'Sync Domain Activated: Sovereign & OmniSpace Link Established'
    );
  }

  async deactivateDomain(): Promise<void> {
    this._session.status = 'PAUSED';
    realTimeDataSync.disconnect();
    omniLogger.info(LogCategory.SYSTEM, 'Sync Domain Deactivated');
  }

  /**
   * 執行深度同步
   */
  async synchronize(direction: SyncDirection = 'BIDIRECTIONAL'): Promise<boolean> {
    omniLogger.info(LogCategory.SYSTEM, `Triggering Core Synchronization: ${direction}`);

    if (direction === 'BIDIRECTIONAL' || direction === 'OUTBOUND') {
      await bidirectionalSyncService.startSync();
      // 核心提煉：同步至 OmniSpace 數據中心
      await omniDataCenterService.refineAndSync({
        id: this._session.sessionId,
        type: 'DOMAIN_SNAPSHOT',
        timestamp: Date.now(),
      });
    }

    return true;
  }
}

export const syncDomain = new SyncDomain();
