/**
 * 7-Layer Skill Architecture - Constellations System
 */

import type { TalentNode } from './aiPartner';

// ============================================================================
// Seven Constellations
// ============================================================================

export enum Constellation {
  PERCEPTION = 'perception',
  MEMORY = 'memory',
  REASONING = 'reasoning',
  ACTION = 'action',
  COMMUNICATION = 'communication',
  SAFETY = 'safety',
  LEARNING = 'learning',
}

// ============================================================================
// RAG Zero Hallucination System
// ============================================================================

export interface TruthDataLabel {
  id: string;
  content: string;
  source: {
    knowledgeBase: string;
    documentId: string;
    chunkId: string;
    timestamp: Date;
  };
  tracking: {
    retrievalId: string;
    similarity: number;
    rank: number;
    context: string[];
  };
  verification: {
    hash: string;
    signature: string;
    verified: boolean;
    verifiedAt: Date;
  };
  immutable: {
    locked: boolean;
    lockedAt: Date;
    checksum: string;
  };
}

export interface ZeroHallucinationRAG {
  enabled: boolean;
  truthVerification: {
    requireSource: boolean;
    requireVerification: boolean;
    minimumSimilarity: number;
  };
  traceability: {
    trackAllRetrieval: boolean;
    logAllAccess: boolean;
    auditTrail: boolean;
  };
  dataIntegrity: {
    hashVerification: boolean;
    signatureCheck: boolean;
    immutableLock: boolean;
  };
}

// ============================================================================
// Constellation Definitions
// ============================================================================

export const PerceptionConstellation: TalentNode[] = [
  {
    id: 'perception_tier1_vision',
    name: 'Vision Enhancement',
    description: 'Improves visual analysis and image recognition accuracy.',
    constellation: 'perception',
    tier: 1,
    position: { x: 0, y: 0 },
    requires: [],
    cost: 1,
    bonuses: [{ attribute: 'precision', value: 5, type: 'flat' }],
    unlockedSkills: ['vision_analyze'],
    unlocked: false,
  },
  {
    id: 'perception_tier2_audio',
    name: 'Audio Sensitivity',
    description: 'Enhances audio processing and speech recognition.',
    constellation: 'perception',
    tier: 2,
    position: { x: -1, y: 1 },
    requires: ['perception_tier1_vision'],
    cost: 2,
    bonuses: [{ attribute: 'precision', value: 8, type: 'flat' }],
    unlockedSkills: ['audio_transcribe'],
    unlocked: false,
  },
  {
    id: 'perception_tier3_sentiment',
    name: 'Sentiment Insight',
    description: 'Deep understanding of emotional semantics.',
    constellation: 'perception',
    tier: 3,
    position: { x: 1, y: 1 },
    requires: ['perception_tier1_vision'],
    cost: 3,
    bonuses: [
      { attribute: 'empathy', value: 10, type: 'flat' },
      { attribute: 'wisdom', value: 5, type: 'flat' },
    ],
    unlockedSkills: ['sentiment_analyze'],
    unlocked: false,
  },
];

export const MemoryConstellation: TalentNode[] = [
  {
    id: 'memory_tier1_store',
    name: 'Memory Storage',
    description: 'Increases memory capacity and retention.',
    constellation: 'memory',
    tier: 1,
    position: { x: 2, y: 0 },
    requires: [],
    cost: 1,
    bonuses: [{ attribute: 'wisdom', value: 5, type: 'flat' }],
    unlockedSkills: ['memory_store'],
    unlocked: false,
  },
  {
    id: 'memory_tier2_recall',
    name: 'Perfect Recall',
    description: 'Improves retrieval speed and accuracy.',
    constellation: 'memory',
    tier: 2,
    position: { x: 2, y: 1 },
    requires: ['memory_tier1_store'],
    cost: 2,
    bonuses: [
      { attribute: 'wisdom', value: 8, type: 'flat' },
      { attribute: 'efficiency', value: 5, type: 'flat' },
    ],
    unlockedSkills: ['memory_recall'],
    unlocked: false,
  },
  {
    id: 'memory_tier3_context',
    name: 'Context Integration',
    description: 'Synthesizes context for summary generation.',
    constellation: 'memory',
    tier: 3,
    position: { x: 2, y: 2 },
    requires: ['memory_tier2_recall'],
    cost: 3,
    bonuses: [
      { attribute: 'intelligence', value: 10, type: 'flat' },
      { attribute: 'wisdom', value: 10, type: 'flat' },
    ],
    unlockedSkills: ['context_summarize'],
    unlocked: false,
  },
];

export const ReasoningConstellation: TalentNode[] = [
  {
    id: 'reasoning_tier1_decompose',
    name: 'Task Decomposition',
    description: 'Breaks down complex tasks into executable steps.',
    constellation: 'reasoning',
    tier: 1,
    position: { x: 4, y: 0 },
    requires: [],
    cost: 1,
    bonuses: [{ attribute: 'intelligence', value: 5, type: 'flat' }],
    unlockedSkills: ['task_decompose'],
    unlocked: false,
  },
  {
    id: 'reasoning_tier2_logic',
    name: 'Logical Reasoning',
    description: 'Enhances logical deduction and analysis.',
    constellation: 'reasoning',
    tier: 2,
    position: { x: 4, y: 1 },
    requires: ['reasoning_tier1_decompose'],
    cost: 2,
    bonuses: [
      { attribute: 'intelligence', value: 10, type: 'flat' },
      { attribute: 'precision', value: 5, type: 'flat' },
    ],
    unlockedSkills: ['logic_reasoning'],
    unlocked: false,
  },
  {
    id: 'reasoning_tier3_decision',
    name: 'Decision Optimization',
    description: 'Optimizes decision-making processes.',
    constellation: 'reasoning',
    tier: 3,
    position: { x: 4, y: 2 },
    requires: ['reasoning_tier2_logic'],
    cost: 3,
    bonuses: [
      { attribute: 'intelligence', value: 15, type: 'flat' },
      { attribute: 'wisdom', value: 10, type: 'flat' },
    ],
    unlockedSkills: ['decision_making'],
    unlocked: false,
  },
];

export const ActionConstellation: TalentNode[] = [
  {
    id: 'action_tier1_search',
    name: 'Info Retrieval',
    description: 'Optimizes web search and data gathering.',
    constellation: 'action',
    tier: 1,
    position: { x: 6, y: 0 },
    requires: [],
    cost: 1,
    bonuses: [{ attribute: 'efficiency', value: 5, type: 'flat' }],
    unlockedSkills: ['web_search'],
    unlocked: false,
  },
  {
    id: 'action_tier2_generate',
    name: 'Content Gen',
    description: 'Enhances text generation quality.',
    constellation: 'action',
    tier: 2,
    position: { x: 6, y: 1 },
    requires: ['action_tier1_search'],
    cost: 2,
    bonuses: [
      { attribute: 'creativity', value: 10, type: 'flat' },
      { attribute: 'efficiency', value: 5, type: 'flat' },
    ],
    unlockedSkills: ['text_generate'],
    unlocked: false,
  },
  {
    id: 'action_tier3_execute',
    name: 'Code Execution',
    description: 'Safely executes code for automation.',
    constellation: 'action',
    tier: 3,
    position: { x: 6, y: 2 },
    requires: ['action_tier2_generate'],
    cost: 3,
    bonuses: [
      { attribute: 'intelligence', value: 10, type: 'flat' },
      { attribute: 'precision', value: 10, type: 'flat' },
    ],
    unlockedSkills: ['code_execute'],
    unlocked: false,
  },
];

export const CommunicationConstellation: TalentNode[] = [
  {
    id: 'communication_tier1_email',
    name: 'Email Comms',
    description: 'Automates email handling.',
    constellation: 'communication',
    tier: 1,
    position: { x: 8, y: 0 },
    requires: [],
    cost: 1,
    bonuses: [{ attribute: 'charisma', value: 5, type: 'flat' }],
    unlockedSkills: ['email_send'],
    unlocked: false,
  },
  {
    id: 'communication_tier2_notify',
    name: 'Smart Notify',
    description: 'Optimizes notification delivery.',
    constellation: 'communication',
    tier: 2,
    position: { x: 8, y: 1 },
    requires: ['communication_tier1_email'],
    cost: 2,
    bonuses: [
      { attribute: 'charisma', value: 8, type: 'flat' },
      { attribute: 'efficiency', value: 5, type: 'flat' },
    ],
    unlockedSkills: ['notification_create'],
    unlocked: false,
  },
];

export const SafetyConstellation: TalentNode[] = [
  {
    id: 'safety_tier1_filter',
    name: 'Content Filter',
    description: 'Filters inappropriate content.',
    constellation: 'safety',
    tier: 1,
    position: { x: 10, y: 0 },
    requires: [],
    cost: 1,
    bonuses: [{ attribute: 'precision', value: 5, type: 'flat' }],
    unlockedSkills: ['content_filter'],
    unlocked: false,
  },
  {
    id: 'safety_tier2_risk',
    name: 'Risk Assess',
    description: 'Evaluates operational risks.',
    constellation: 'safety',
    tier: 2,
    position: { x: 10, y: 1 },
    requires: ['safety_tier1_filter'],
    cost: 2,
    bonuses: [
      { attribute: 'intelligence', value: 8, type: 'flat' },
      { attribute: 'precision', value: 8, type: 'flat' },
    ],
    unlockedSkills: ['risk_assess'],
    unlocked: false,
  },
  {
    id: 'safety_tier3_compliance',
    name: 'Compliance',
    description: 'Ensures regulatory compliance.',
    constellation: 'safety',
    tier: 3,
    position: { x: 10, y: 2 },
    requires: ['safety_tier2_risk'],
    cost: 3,
    bonuses: [
      { attribute: 'wisdom', value: 10, type: 'flat' },
      { attribute: 'precision', value: 10, type: 'flat' },
    ],
    unlockedSkills: ['compliance_check'],
    unlocked: false,
  },
];

export const LearningConstellation: TalentNode[] = [
  {
    id: 'learning_tier1_propose',
    name: 'Skill Proposal',
    description: 'Proposes new skills for evolution.',
    constellation: 'learning',
    tier: 1,
    position: { x: 12, y: 0 },
    requires: [],
    cost: 1,
    bonuses: [{ attribute: 'creativity', value: 5, type: 'flat' }],
    unlockedSkills: ['skill_propose'],
    unlocked: false,
  },
  {
    id: 'learning_tier2_feedback',
    name: 'Feedback Loop',
    description: 'Learns from feedback to optimize.',
    constellation: 'learning',
    tier: 2,
    position: { x: 12, y: 1 },
    requires: ['learning_tier1_propose'],
    cost: 2,
    bonuses: [
      { attribute: 'intelligence', value: 8, type: 'flat' },
      { attribute: 'wisdom', value: 8, type: 'flat' },
    ],
    unlockedSkills: ['feedback_learn'],
    unlocked: false,
  },
  {
    id: 'learning_tier3_performance',
    name: 'Perf Analysis',
    description: 'Analyzes self-performance for improvement.',
    constellation: 'learning',
    tier: 3,
    position: { x: 12, y: 2 },
    requires: ['learning_tier2_feedback'],
    cost: 3,
    bonuses: [{ attribute: 'all', value: 5, type: 'flat' }],
    unlockedSkills: ['performance_analyze'],
    unlocked: false,
  },
];

export const AllConstellations = {
  [Constellation.PERCEPTION]: PerceptionConstellation,
  [Constellation.MEMORY]: MemoryConstellation,
  [Constellation.REASONING]: ReasoningConstellation,
  [Constellation.ACTION]: ActionConstellation,
  [Constellation.COMMUNICATION]: CommunicationConstellation,
  [Constellation.SAFETY]: SafetyConstellation,
  [Constellation.LEARNING]: LearningConstellation,
};

export const InitialRAGEquipment: ZeroHallucinationRAG = {
  enabled: true,
  truthVerification: {
    requireSource: true,
    requireVerification: true,
    minimumSimilarity: 0.7,
  },
  traceability: {
    trackAllRetrieval: true,
    logAllAccess: true,
    auditTrail: true,
  },
  dataIntegrity: {
    hashVerification: true,
    signatureCheck: true,
    immutableLock: true,
  },
};
