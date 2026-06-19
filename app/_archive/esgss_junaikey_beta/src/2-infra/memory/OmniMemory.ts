import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  ESGDataTag,
  MemoryPalaceStructure,
  IEvolutionState,
  SixFormsPhase,
} from '../../0-domain/contracts/Omni-entity.types';

// 奧秘永憶 (Omni Eternal Memory) - 記憶宮殿實作
// This is the persistent state manager implementing the Memory Palace architecture.

interface OmniMemoryState {
  // 記憶宮殿核心資料結構
  palace: MemoryPalaceStructure;
  evolutionState: IEvolutionState;
  lastSync: string | null;

  // 核心數據 (Core Data)
  esgData: ESGDataTag | null;

  // 奧秘元鑰操作 (OmniKey Actions)
  setShortTermContext: (key: string, value: any) => void;
  addInteractionLog: (topic: string) => void;
  updateEvolutionMetrics: (metrics: Partial<IEvolutionState['wisdomMetrics']>) => void;
  setEvolutionPhase: (phase: SixFormsPhase) => void;
  setESGData: (data: ESGDataTag) => void;

  // 萬有引力 (Gravity) - 權重調整
  reinforceConcept: (concept: string, weightDelta: number) => void;

  // 系統操作
  clearMemory: () => void;
}

const INITIAL_PALACE: MemoryPalaceStructure = {
  theHall: {
    sessionId: null,
    recentInteractions: [],
    activeContext: {},
  },
  theLibrary: {
    manifesto: [
      '以終為始，始終如一 (Start with the End in mind, Consistent from beginning to end)',
      '使用者為中心 (User Centric)',
      '萬物皆可優化 (Everything is optimizable)',
    ],
    domainRules: {
      ESG: ['Environmental', 'Social', 'Governance'],
      JunAiKey: ['Security', 'Integration', 'Evolution'],
    },
  },
  theVault: {
    evolutionLogs: [],
    conceptWeights: {},
  },
};

const INITIAL_EVOLUTION: IEvolutionState = {
  currentPhase: 'AWAKENING',
  experiencePoints: 0,
  evolutionLevel: 1,
  wisdomMetrics: {
    memoryRetention: 1.0,
    inferenceSpeed: 0,
    patternRecognition: 0.1,
  },
};

export const useOmniMemory = create<OmniMemoryState>()(
  persist(
    (set): OmniMemoryState => ({
      palace: INITIAL_PALACE,
      evolutionState: INITIAL_EVOLUTION,
      lastSync: null as string | null,
      esgData: null as ESGDataTag | null,

      // --- 大廳操作 (The Hall) ---
      setShortTermContext: (key: string, value: any) =>
        set(state => ({
          palace: {
            ...state.palace,
            theHall: {
              ...state.palace.theHall,
              activeContext: {
                ...state.palace.theHall.activeContext,
                [key]: value,
              },
            },
          },
        })),

      addInteractionLog: (topic: string) =>
        set(state => {
          const newLog = { topic, timestamp: new Date().toISOString() };
          const updatedLogs = [newLog, ...state.palace.theHall.recentInteractions].slice(0, 10);
          return {
            palace: {
              ...state.palace,
              theHall: {
                ...state.palace.theHall,
                recentInteractions: updatedLogs,
              },
            },
          };
        }),

      // --- 進化與金庫操作 (Evolution & The Vault) ---
      updateEvolutionMetrics: (metrics: Partial<IEvolutionState['wisdomMetrics']>) =>
        set(state => ({
          evolutionState: {
            ...state.evolutionState,
            wisdomMetrics: {
              ...state.evolutionState.wisdomMetrics,
              ...metrics,
            },
          },
        })),

      setEvolutionPhase: (phase: SixFormsPhase) =>
        set(state => ({
          evolutionState: {
            ...state.evolutionState,
            currentPhase: phase,
          },
        })),

      setESGData: (data: ESGDataTag) => set({ esgData: data }),

      reinforceConcept: (concept: string, weightDelta: number) =>
        set(state => {
          const currentWeight = state.palace.theVault.conceptWeights[concept] || 0;
          return {
            palace: {
              ...state.palace,
              theVault: {
                ...state.palace.theVault,
                conceptWeights: {
                  ...state.palace.theVault.conceptWeights,
                  [concept]: currentWeight + weightDelta,
                },
              },
            },
          };
        }),

      clearMemory: () =>
        set({
          palace: INITIAL_PALACE,
          evolutionState: INITIAL_EVOLUTION,
          lastSync: null as string | null,
          esgData: null as ESGDataTag | null,
        }),
    }),
    {
      name: 'omni-eternal-memory-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state: OmniMemoryState) => ({
        palace: state.palace,
        evolutionState: state.evolutionState,
        esgData: state.esgData,
      }),
    }
  )
);
