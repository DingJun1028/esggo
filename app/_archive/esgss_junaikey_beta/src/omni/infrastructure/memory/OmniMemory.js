import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
const INITIAL_PALACE = {
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
const INITIAL_EVOLUTION = {
    currentPhase: 'AWAKENING',
    experiencePoints: 0,
    evolutionLevel: 1,
    wisdomMetrics: {
        memoryRetention: 1.0,
        inferenceSpeed: 0,
        patternRecognition: 0.1,
    },
};
export const useOmniMemory = create()(persist((set) => ({
    palace: INITIAL_PALACE,
    evolutionState: INITIAL_EVOLUTION,
    lastSync: null,
    esgData: null,
    // --- The Hall Operations ---
    setShortTermContext: (key, value) => set(state => ({
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
    addInteractionLog: (topic) => set(state => {
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
    updateEvolutionMetrics: (metrics) => set(state => ({
        evolutionState: {
            ...state.evolutionState,
            wisdomMetrics: {
                ...state.evolutionState.wisdomMetrics,
                ...metrics,
            },
        },
    })),
    setEvolutionPhase: (phase) => set(state => ({
        evolutionState: {
            ...state.evolutionState,
            currentPhase: phase,
        },
    })),
    setESGData: (data) => set({ esgData: data }),
    reinforceConcept: (concept, weightDelta) => set(state => {
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
    addEvidence: (evidence) => set(state => ({
        palace: {
            ...state.palace,
            theVault: {
                ...state.palace.theVault,
                evidenceChain: [evidence, ...(state.palace.theVault.evidenceChain || [])].slice(0, 50),
            },
        },
    })),
    clearMemory: () => set({
        palace: INITIAL_PALACE,
        evolutionState: INITIAL_EVOLUTION,
        lastSync: null,
        esgData: null,
    }),
}), {
    name: 'omni-eternal-memory-storage',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
        palace: state.palace,
        evolutionState: state.evolutionState,
        esgData: state.esgData,
    }),
}));
