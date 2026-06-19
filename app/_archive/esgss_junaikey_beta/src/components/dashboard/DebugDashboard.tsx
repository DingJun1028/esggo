import React, { useEffect, useState } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { sovereignLedger } from '../../1-service/SovereignLedger';
import { IComponentCore } from '../../types/core';

export const DebugDashboard: React.FC = () => {
  const [ledgerCount, setLedgerCount] = useState<number>(0);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    let sub: any;
    try {
      omniLogger.info(LogCategory.SYSTEM, '[DebugDashboard] Subscribing to SovereignLedger', '');
      sub = sovereignLedger.getLedgerObservable().subscribe({
        next: (data: IComponentCore[]) => {
          omniLogger.info(LogCategory.SYSTEM, '[DebugDashboard] Received data count', String(data.length));
          setLedgerCount(data.length);
        },
        error: (err: any) => {
          omniLogger.error(LogCategory.SYSTEM, '[DebugDashboard] DebugDashboard: Error', { error: err });
          setLastError(err.message || 'Unknown error');
        },
      });
    } catch (e: any) {
      omniLogger.error(LogCategory.SYSTEM, '[DebugDashboard] DebugDashboard: Setup failed', { error: e });
      // Async update to avoid effect warning
      setTimeout(() => setLastError(e.message), 0);
    }
    return () => {
      if (sub) sub.unsubscribe();
    };
  }, []);

  return (
    <div className="p-8 text-white bg-slate-800 m-4 rounded">
      <h2 className="text-xl font-bold mb-4">Debug Dashboard</h2>
      <div className="mb-4">
        <strong>Status:</strong>{' '}
        {lastError ? (
          <span className="text-red-500">Error: {lastError}</span>
        ) : (
          <span className="text-green-500">Active</span>
        )}
      </div>
      <div>
        <strong>Ledger Items:</strong> {ledgerCount}
      </div>
    </div>
  );
};
