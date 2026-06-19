/**
 * 🏛️ 雙向同步領域介面 (ISyncDomain)
 * --------------------------------------------------
 * 定義核心領域與應用服務之間的同步標準
 */

import { UUID } from './Omni-component-core.types';

export type SyncDirection = 'INBOUND' | 'OUTBOUND' | 'BIDIRECTIONAL';

export interface SyncSession {
  sessionId: UUID;
  startTime: number;
  direction: SyncDirection;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'FAILED';
}

export interface ISyncDomain {
  readonly syncStatus: SyncSession;
  activateDomain(): Promise<void>;
  deactivateDomain(): Promise<void>;
  synchronize(direction: SyncDirection): Promise<boolean>;
}
