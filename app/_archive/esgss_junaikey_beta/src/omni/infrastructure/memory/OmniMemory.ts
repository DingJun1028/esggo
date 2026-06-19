import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  ESGDataTag,
  MemoryPalaceStructure,
  IEvolutionState,
  SixFormsPhase,
} from '../types/Omni-entity.types.ts';
import { IEvidenceMap } from '../../../0-domain/contracts/IComponentCore.ts';

// Omni Eternal Memory - Memory Palace Implementation
// This is the persistent state manager implementing the Memory Palace architecture.

interface OmniMemoryState {
  // Memory Palace Core Data Structure
  palace: MemoryPalaceStructure;
  evolutionState: IEvolutionState;
  lastSync: string | null;

  // Core Data
  esgData: ESGDataTag | null;

  // OmniKey Actions
  setShortTermContext: (key: string, value: any) => void;
  addInteractionLog: (topic: string) => void;
  updateEvolutionMetrics: (metrics: Partial<IEvolutionState['wisdomMetrics']>) => void;
  setEvolutionPhase: (phase: SixFormsPhase) => void;
  setESGData: (data: ESGDataTag) => void;
  // 5T Evidence Logging
  addEvidence: (evidence: IEvidenceMap) => void;

  // Omni Gravity - Weight Adjustment
  reinforceConcept: (concept: string, weightDelta: number) => void;

  // System Operations
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
      'Start with the End in mind, Consistent from beginning to end',
      'User Centric',
      'Everything is optimizable',
    ],
    domainRules: {
      ESG: ['Environmental', 'Social', 'Governance'],
      JunAiKey: ['Security', 'Integration', 'Evolution'],
    },
  },
  theVault: {
    evolutionLogs: [],
    conceptWeights: {},
    evidenceChain: [],
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

      // --- The Hall Operations ---
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

      // --- Evolution & The Vault Operations ---
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

      addEvidence: (evidence: IEvidenceMap) =>
        set(state => ({
          palace: {
            ...state.palace,
            theVault: {
              ...state.palace.theVault,
              evidenceChain: [evidence, ...(state.palace.theVault.evidenceChain || [])].slice(
                0,
                50
              ),
            },
          },
        })),

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
