import { useState, useCallback, useEffect } from 'react';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger';
import {
  OmniExecutionCore,
  ExecutionRecord,
  EXECUTION_REGISTRY,
} from '../services/OmniExecutionCore';
import { useSovereignSession } from './useSovereignSession';

export const useActionExecutor = () => {
  const { updateEntropy } = useSovereignSession();
  const [history, setHistory] = useState<ExecutionRecord[]>(() => {
    const saved = localStorage.getItem('omni_execution_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('omni_execution_history', JSON.stringify(history));
  }, [history]);

  const runAction = useCallback(
    (actionId: string, signatures: string[]) => {
      const result = OmniExecutionCore.execute(actionId, signatures);

      const timestamp = new Date().toISOString();
      const record: ExecutionRecord = {
        id: result.recordId,
        actionId,
        status: result.success ? 'SUCCESS' : 'FAILED',
        timestamp: Date.now(),
        signatures,
        result: result.message,
      };

      setHistory(prev => [record, ...prev].slice(0, 50)); // Keep last 50

      // Execution has a small impact on entropy
      if (result.success) {
        updateEntropy(0.02);

        // Phase 42: Unified Logging -> Push to Impact Vault
        try {
          const savedMissions = localStorage.getItem('omni_mission_history');
          const missions = savedMissions ? JSON.parse(savedMissions) : [];

          // Determine Mode based on signatures
          const mode = signatures.length > 1 ? 'SWARM' : 'STANDARD';

          const vaultRecord = {
            id: `ACT-${result.recordId}`,
            missionId: 'EXEC_ACTION',
            title: `EXEC: ${actionId}`,
            type: 'G', // Governance Action
            xpGained: 50,
            impactGained: 20,
            synergy: 1.0,
            timestamp,
            certificateId: record.id,
            bioId: signatures[0] || 'SYSTEM',
            validationMode: mode,
            bioVerified: true,
          };

          localStorage.setItem('omni_mission_history', JSON.stringify([vaultRecord, ...missions]));
        } catch (e) {
          omniLogger.error(LogCategory.GOVERNANCE, 'Failed to sync with Impact Vault', {
            error: e,
          });
        }
      } else {
        updateEntropy(0.005); // Failed verification still has trivial overhead
      }

      return result;
    },
    [updateEntropy]
  );

  return {
    actions: EXECUTION_REGISTRY,
    history,
    runAction,
    clearHistory: () => setHistory([]),
  };
};
