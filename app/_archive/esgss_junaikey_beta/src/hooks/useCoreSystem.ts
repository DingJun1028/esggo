import { useState, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { getJunAIKey, SystemHealth, Goal } from '../core/omnikey';

export const useCoreSystem = () => {
  const core = getJunAIKey();
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeCycles, setActiveCycles] = useState<any[]>([]); // Should be MysticCycle[]

  // Poll System Health & goals (Simulation of real-time subscription)
  useEffect(() => {
    let initialized = false;
    const fetchState = async () => {
      // Load OKRs if not already loaded (Initial seed)
      if (!initialized) {
        try {
          // Dynamic import to avoid issues if file doesn't exist yet (though I just created it)
          const okrData = await import('../data/okr_2026_q1.json');
          const currentGoals = core.goals.getGoals();
          if (currentGoals.length === 0) {
            core.goals.loadOKRs(okrData.default || okrData);
          }
          initialized = true;
        } catch (e) {
          omniLogger.error(LogCategory.SYSTEM, '[useCoreSystem] Failed to load OKR data', { error: e });
        }
      }

      // 1. Diagnostics
      const latestHealth = await core.diagnostics.checkHealth();
      setHealth(latestHealth);

      // 2. Goals
      const currentGoals = core.goals.getGoals();
      setGoals(currentGoals);

      // 3. Active Cycles (Get full objects)
      const cycles = core.getActiveCycles();
      setActiveCycles(cycles);
    };

    // Initial fetch
    fetchState();

    // Polling interval
    const intervalId = setInterval(fetchState, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // Manual Action Triggers
  const triggerRescan = async () => {
    return await core.diagnostics.checkHealth();
  };

  const addManualGoal = (description: string) => {
    const goal = core.goals.createGoal(description, 'medium', ['manual']);
    setGoals(core.goals.getGoals()); // Update local state immediately
    return goal;
  };

  return {
    health,
    goals,
    activeCycles,
    actions: {
      triggerRescan,
      addManualGoal,
    },
  };
};
