// Omni Tags - Shared Type Definitions
// This file serves as the single source of truth for types across the system (Frontend & Backend).
import { IEvidenceMap } from '../../../0-domain/contracts/IComponentCore.ts';

// 1. Core Entity Tags
export interface OmniEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ESGDataTag extends OmniEntity {
  environmental: {
    carbonFootprint: number;
    energyConsumption: number;
    waterUsage: number;
    wasteGeneration: number;
  };
  social: {
    employeeSatisfaction: number;
    diversityIndex: number;
    communityImpact: number;
    humanRightsScore: number;
  };
  governance: {
    transparencyScore: number;
    boardDiversity: number;
    ethicalCompliance: number;
    stakeholderEngagement: number;
  };
  metadata?: Record<string, unknown>;
}

// 2. Omni Resonance Interface
// Defines how the "Heart Core" (Controller/Hook) should behave.
export interface OmniResonance<T> {
  // The Data/State (Eternal Memory)
  data: T | null;
  loading: boolean;
  error: string | null;

  // Actions (Knowledge Base Triggers)
  refresh: () => Promise<void>;
  update: (newData: Partial<T>) => Promise<void>;

  // Resonance Status
  resonanceLevel: 'dormant' | 'active' | 'harmonized';
}

// 3. API Response Tags
export interface OmniResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string; // Error details for dissonance handling
  resonanceId?: string; // Tracking ID
}

// 4. Six Forms of Mystery Phases
export type SixFormsPhase =
  | 'AWAKENING' // Sensing: Receiving user input
  | 'ANALYSIS' // Analysis: Understanding intent and core logic
  | 'RESONANCE' // Resonance: Connecting to the Memory Palace
  | 'STRATEGY' // Mystery: Developing strategy and plan
  | 'EXECUTION' // Deployment: Executing specific actions
  | 'EVOLUTION'; // Ascension: Feedback and self-optimization

// 5. Evolution State Interface
export interface IEvolutionState {
  currentPhase: SixFormsPhase;
  experiencePoints: number; // Experience Points (XP)
  evolutionLevel: number; // Evolution Level (Lv)
  wisdomMetrics: {
    // Wisdom Key Indicators
    memoryRetention: number; // Memory Retention Rate
    inferenceSpeed: number; // Inference Speed (ms)
    patternRecognition: number; // Pattern Recognition Score (0-1)
  };
}

// 6. Memory Palace Structure
export interface MemoryPalaceStructure {
  // The Hall - Short-term active memory
  theHall: {
    sessionId: string | null;
    recentInteractions: Array<{ topic: string; timestamp: string }>; // Summary of recent interactions
    activeContext: Record<string, unknown>; // Currently active context variables
  };
  // The Library - Static core knowledge
  theLibrary: {
    manifesto: string[]; // Core manifesto
    domainRules: Record<string, string[]>; // Domain rules (ESG, etc.)
  };
  // The Vault - Long-term deep memory and weights
  theVault: {
    evolutionLogs: Array<{ phase: SixFormsPhase; outcome: string; timestamp: string }>;
    conceptWeights: Record<string, number>; // Concept weights (Omni Gravity Core)
    evidenceChain?: IEvidenceMap[]; // 5T Trust Verification Chain
  };
}
