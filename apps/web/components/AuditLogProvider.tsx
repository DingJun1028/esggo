'use client';

import React, { useEffect } from 'react';

// Mock omniAgentBus since it is not imported
const omniAgentBus = {
  subscribe: (event: string, callback: (payload: any) => void) => {
    return { unsubscribe: () => {} };
  }
};

const HistoricalAuditor = () => {
  useEffect(() => {
    const subscriber = omniAgentBus.subscribe('system:consensus:aligned', (payload: any) => {
      console.log('[Auditor] Consensus aligned:', payload);
      const logEvent = {
        type: 'CONSENSUS_ALIGNMENT',
        evidence: payload?.evidenceUuid,
        consensusValue: payload?.frnLoss,
        timestamp: new Date().toISOString()
      };
      fetch('/api/audit-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEvent)
      }).catch(() => {});
    });

    return () => subscriber.unsubscribe();
  }, []);
  return null;
};

export const AuditLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <React.Fragment>
      <HistoricalAuditor />
      {children}
    </React.Fragment>
  );
};
