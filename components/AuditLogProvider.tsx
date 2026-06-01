const HistoricalAuditor = () => {
  useEffect(() => {
    const subscriber = omniAgentBus.subscribe('system:consensus:aligned', (payload) => {
      console.log('[Auditor] Consensus aligned:', payload);
      // Log to external monitoring
      const logEvent = {
        type: 'CONSENSUS_ALIGNMENT',
        evidence: payload.evidenceUuid,
        consensusValue: payload.frnLoss,
        timestamp: new Date().toISOString()
      };
      // In production, send to monitoring endpoint
      fetch('/api/audit-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEvent)
      }).catch(() => {});
    });

    return () => subscriber.unsubscribe();
  }, []);
};

export const AuditLogProvider: React.FC = ({ children }) => {
  return (
    <React.Fragment>
      <HistoricalAuditor />
      {children}
    </React.Fragment>
  );
};