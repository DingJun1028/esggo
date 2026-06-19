import { useState, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.ts';

import { evolutionEngine, EvolutionDaemonStatus } from '@/omni/services/OmniEvolutionEngine.ts';
import { getUltimateAwakeningProtocol } from '@/omni/protocols/UltimateAwakeningProtocol.ts';

export interface AwakeningState {
  daemonStatus: EvolutionDaemonStatus;
  awakeningProtocolState: any; // Using any for now to avoid extensive type mapping if specific types aren't exported
  isAutoEvolutionEnabled: boolean;
}

export const useAwakening = () => {
  const [state, setState] = useState<AwakeningState>({
    daemonStatus: {
      isRunning: false,
      cycleCount: 0,
      agentsEvolved: 0,
      lastRun: null,
    },
    awakeningProtocolState: null,
    isAutoEvolutionEnabled: false,
  });

  const refresh = () => {
    try {
      const daemonStatus = evolutionEngine.getDaemonStatus();
      const protocolState = getUltimateAwakeningProtocol().getState();

      setState({
        daemonStatus,
        awakeningProtocolState: protocolState,
        isAutoEvolutionEnabled: daemonStatus.isRunning,
      });
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[useAwakening] Failed to refresh Awakening state', { error })
    }
  };

  const toggleAutoEvolution = (enabled: boolean) => {
    if (enabled) {
      evolutionEngine.startAutoEvolutionDaemon();
    } else {
      evolutionEngine.stopAutoEvolutionDaemon();
    }
    refresh();
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 2000); // Poll every 2s
    return () => clearInterval(interval);
  }, []);

  return {
    ...state,
    refresh,
    toggleAutoEvolution,
  };
};
