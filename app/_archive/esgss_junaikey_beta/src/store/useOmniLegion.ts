/**
 * 奧秘軍團狀態管理 Store
 *
 * 使用 Zustand 管理軍團狀態
 * 集成 persist 中間件以實現持久化
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Legion, LegionId, MissionProgress } from '../types';

// 為持久化轉換 Map 為對象
interface SerializedLegionState {
  legions: Record<string, Legion>;
  missionProgress: Record<string, MissionProgress>;
  activeLegionId: LegionId | null;
}

interface OmniLegionState {
  // 狀態
  legions: Map<LegionId, Legion>;
  missionProgress: Map<string, MissionProgress>;
  activeLegionId: LegionId | null;

  // Actions
  addLegion: (legion: Legion) => void;
  removeLegion: (legionId: LegionId) => void;
  updateLegion: (legionId: LegionId, updates: Partial<Legion>) => void;
  getLegion: (legionId: LegionId) => Legion | undefined;
  setActiveLegion: (legionId: LegionId | null) => void;
  setMissionProgress: (missionId: string, progress: MissionProgress) => void;
  clearAll: () => void;
}

export const useOmniLegion = create<OmniLegionState>()(
  persist(
    (set, get) => ({
      legions: new Map(),
      missionProgress: new Map(),
      activeLegionId: null,

      addLegion: (legion: Legion) => {
        set(state => {
          const newLegions = new Map(state.legions);
          newLegions.set(legion.legionId, legion);
          return { legions: newLegions };
        });
      },

      removeLegion: (legionId: LegionId) => {
        set(state => {
          const newLegions = new Map(state.legions);
          newLegions.delete(legionId);
          return {
            legions: newLegions,
            activeLegionId: state.activeLegionId === legionId ? null : state.activeLegionId,
          };
        });
      },

      updateLegion: (legionId: LegionId, updates: Partial<Legion>) => {
        set(state => {
          const legion = state.legions.get(legionId);
          if (!legion) return state;

          const newLegions = new Map(state.legions);
          newLegions.set(legionId, { ...legion, ...updates });
          return { legions: newLegions };
        });
      },

      getLegion: (legionId: LegionId) => {
        return get().legions.get(legionId);
      },

      setActiveLegion: (legionId: LegionId | null) => {
        set({ activeLegionId: legionId });
      },

      setMissionProgress: (missionId: string, progress: MissionProgress) => {
        set(state => {
          const newProgress = new Map(state.missionProgress);
          newProgress.set(missionId, progress);
          return { missionProgress: newProgress };
        });
      },

      clearAll: () => {
        set({
          legions: new Map(),
          missionProgress: new Map(),
          activeLegionId: null,
        });
      },
    }),
    {
      name: 'avos_legion_storage',
      storage: createJSONStorage(() => localStorage),
      // Custom serialize/deserialize for Map
      partialize: state => ({
        legions: Object.fromEntries(state.legions),
        missionProgress: Object.fromEntries(state.missionProgress),
        activeLegionId: state.activeLegionId,
      }),
      onRehydrateStorage: () => state => {
        if (state) {
          // Convert Objects back to Maps
          if (state.legions && !(state.legions instanceof Map)) {
            state.legions = new Map(Object.entries(state.legions));
          }
          if (state.missionProgress && !(state.missionProgress instanceof Map)) {
            state.missionProgress = new Map(Object.entries(state.missionProgress));
          }
        }
      },
    }
  )
);
