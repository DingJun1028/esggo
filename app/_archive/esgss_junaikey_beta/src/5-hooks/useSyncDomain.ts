/**
 * 💡 六層架構 Hook：雙向同步領域鉤子 (useSyncDomain)
 * --------------------------------------------------
 * 提供 UI 組件訪問最中心層同步領域的介面
 */

import { useState, useEffect } from 'react';
import { syncDomain, SyncSession } from '@domain';
import { SyncStatus } from '@service/bidirectionalSync';

export const useSyncDomain = () => {
  const [session, setSession] = useState<SyncSession>(syncDomain.syncStatus);
  const [isSyncing, setIsSyncing] = useState(false);

  /**
   * 觸發雙向同步
   */
  const triggerSync = async () => {
    setIsSyncing(true);
    try {
      await syncDomain.synchronize('BIDIRECTIONAL');
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    session,
    isSyncing,
    triggerSync,
    status: session.status,
  };
};
