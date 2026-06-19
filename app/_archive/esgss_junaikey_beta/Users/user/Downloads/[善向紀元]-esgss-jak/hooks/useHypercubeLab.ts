
import { useReducer, useCallback } from 'react';
import { SystemVital, UniversalKnowledgeNode } from '../types';

// State and Action definitions
export interface LabState {
    isProcessing: boolean;
    activeTool: 'image' | 'video' | 'intel';
    resultText: string | null;
    synergyChain: string[];
    vitals: SystemVital | null;
    nodes: UniversalKnowledgeNode[];
    prompt: string;
    error: string | null;
    retryCount: number;
}

export type LabAction =
    | { type: 'SET_PROCESSING'; payload: boolean }
    | { type: 'SET_ACTIVE_TOOL'; payload: 'image' | 'video' | 'intel' }
    | { type: 'SET_RESULT'; payload: string | null }
    | { type: 'SET_SYNERGY_CHAIN'; payload: string[] }
    | { type: 'SET_VITALS'; payload: SystemVital | null }
    | { type: 'SET_NODES'; payload: UniversalKnowledgeNode[] }
    | { type: 'SET_PROMPT'; payload: string }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'INCREMENT_RETRY' }
    | { type: 'RESET_RETRY' };

// Initial State
export const initialState: LabState = {
    isProcessing: false,
    activeTool: 'intel',
    resultText: null,
    synergyChain: ['perception', 'cognition', 'expression'],
    vitals: null,
    nodes: [],
    prompt: '',
    error: null,
    retryCount: 0
};

// Reducer function
export function labReducer(state: LabState, action: LabAction): LabState {
    switch (action.type) {
        case 'SET_PROCESSING':
            return { ...state, isProcessing: action.payload };
        case 'SET_ACTIVE_TOOL':
            return { ...state, activeTool: action.payload };
        case 'SET_RESULT':
            return { ...state, resultText: action.payload, error: null };
        case 'SET_SYNERGY_CHAIN':
            return { ...state, synergyChain: action.payload };
        case 'SET_VITALS':
            return { ...state, vitals: action.payload };
        case 'SET_NODES':
            return { ...state, nodes: action.payload };
        case 'SET_PROMPT':
            return { ...state, prompt: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'INCREMENT_RETRY':
            return { ...state, retryCount: state.retryCount + 1 };
        case 'RESET_RETRY':
            return { ...state, retryCount: 0 };
        default:
            return state;
    }
}

// Custom Hook
export const useHypercubeLab = () => {
    const [state, dispatch] = useReducer(labReducer, initialState);

    const updateSynergyChain = useCallback((coreId: string) => {
        const newChain = state.synergyChain.includes(coreId)
            ? state.synergyChain.filter(c => c !== coreId)
            : [...state.synergyChain, coreId];
        dispatch({ type: 'SET_SYNERGY_CHAIN', payload: newChain });
    }, [state.synergyChain]);

    return {
        state,
        dispatch,
        updateSynergyChain
    };
};
