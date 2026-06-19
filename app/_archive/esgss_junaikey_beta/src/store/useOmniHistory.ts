// src/store/useOmniHistory.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EvolutionLog } from '../core/knowledge/types';

interface HistoryState {
  logs: EvolutionLog[];
  stats: {
    totalHeals: number;
    totalAutomations: number;
    averageEntropy: number;
  };
  addLog: (log: Omit<EvolutionLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}

export const useOmniHistory = create<HistoryState>()(
  persist(
    (set: any) => ({
      logs: [] as EvolutionLog[],
      stats: { totalHeals: 0, totalAutomations: 0, averageEntropy: 0 },

      addLog: (newLog: Omit<EvolutionLog, 'id' | 'timestamp'>) =>
        set((state: HistoryState) => {
          const log: EvolutionLog = {
            ...newLog,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
          };

          // 更新統計數據 (簡單的計數邏輯)
          const isHeal = log.type === 'IMMUNITY_HEAL';
          const isAuto = log.type === 'AUTOMATION_TRIGGER';

          return {
            logs: [log, ...state.logs].slice(0, 1000), // 只保留最近 1000 筆
            stats: {
              ...state.stats,
              totalHeals: state.stats.totalHeals + (isHeal ? 1 : 0),
              totalAutomations: state.stats.totalAutomations + (isAuto ? 1 : 0),
            },
          };
        }),

      clearLogs: () => set({ logs: [] }),
    }),
    { name: 'jun-ai-key-history' } // 持久化到 LocalStorage
  )
);
