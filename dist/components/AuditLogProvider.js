import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
            }).catch(() => { });
        });
        return () => subscriber.unsubscribe();
    }, []);
};
export const AuditLogProvider = ({ children }) => {
    return (_jsxs(React.Fragment, { children: [_jsx(HistoricalAuditor, {}), children] }));
};
//# sourceMappingURL=AuditLogProvider.js.map