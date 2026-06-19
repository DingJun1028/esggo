import { useState, useEffect, useCallback } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { OmniQuantumCore } from '../services/OmniQuantumCore';
import { OracleNexus, ORACLE_SIGNALS, ESGSignal } from '../services/OracleNexus';
import { useSovereignSession } from './useSovereignSession';
import { useAgentRpg } from './useAgentRpg';

export const useOracleFeed = () => {
  const { updateEntropy } = useSovereignSession();
  const { activeAttributes } = useAgentRpg();
  const [signals, setSignals] = useState<ESGSignal[]>(ORACLE_SIGNALS);
  const [isSyncing, setIsSyncing] = useState(false);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSignals(prev =>
        prev.map(s => ({
          ...s,
          value: Math.max(0, Math.min(100, s.value + (Math.random() - 0.5) * 5)),
          trend: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'UP' : 'DOWN') : s.trend,
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Phase 41: Auto-Prediction Logic
  useEffect(() => {
    const autoCheck = setInterval(() => {
      const highRiskSignal = signals.find(s => s.projectedRisk > 0.85);
      if (highRiskSignal && !isSyncing) {
        // Auto-trigger verification if enough QE exists
        if (OmniQuantumCore.consumeEnergy(50)) {
          verifyProjection(highRiskSignal.id);
          omniLogger.info(LogCategory.SYSTEM, '[useOracleFeed] Info', { data: `[Oracle] Auto-Mitigated High Risk Signal: ${highRiskSignal.id}` });
        }
      }
    }, 8000);
    return () => clearInterval(autoCheck);
  }, [signals, isSyncing]);

  const verifyProjection = useCallback(
    (signalId: string) => {
      setIsSyncing(true);
      const { projection, variance } = OracleNexus.calculatePredictiveFlux(
        signalId,
        activeAttributes.intelligence * 1.5 + activeAttributes.precision || 0 // Calculate dynamic compute power
      );

      // Successful prediction (low variance) mitigates entropy
      const entropyMitigation = (1 - variance) * 0.05;
      updateEntropy(-entropyMitigation);

      setIsSyncing(false);
      return { projection, variance, mitigation: entropyMitigation };
    },
    [activeAttributes, updateEntropy]
  );

  return {
    signals,
    isSyncing,
    verifyProjection,
    getRecommendation: OracleNexus.getRecommendedAction,
    energyStatus: OmniQuantumCore.getStatus(),
  };
};
