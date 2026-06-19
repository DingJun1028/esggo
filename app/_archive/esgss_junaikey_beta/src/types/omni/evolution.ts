import { SkillType, EvolutionProposal } from '../agency/index.js';

// Dimension types moved to core/world types to avoid duplicates

// McpServer definition moved to src/types/mcp.ts to avoid duplicates

export interface SoulSkill {
  id: string;
  name: string;
  type: SkillType;
  description: string;
  parameters: Record<string, unknown>;
  energyCost: number;
  mastery: number;
}

export interface AgentSoul5D {
  id: string;
  name: string;
  essence: {
    name: string;
    archetype: string;
    tone: string;
    backstory: string;
    personalityTraits: string[];
    communicationStyle: string;
  };
  covenant: {
    prompt: string;
    safetyRules: string[];
    ethicalBoundaries: string[];
    behavioralLimits: string[];
  };
  memory: {
    knowledgeBaseIds: string[];
    vectorStoreIds: string[];
    retentionPolicy: {
      maxAge: number;
      compressionThreshold: number;
      archiveStrategy: string;
    };
    contextWindow: number;
  };
  authority: {
    skills: SoulSkill[];
    permissions: string[];
    accessLevel: number;
    rateLimits: {
      requestsPerMinute: number;
      tokensPerRequest: number;
    };
  };
  foundation: {
    modelConfig: {
      provider: string;
      model: string;
      temperature: number;
      maxTokens: number;
      topP: number;
    };
    performanceMetrics: {
      responseTime: number;
      tokenEfficiency: number;
      accuracy: number;
    };
  };
  resonance: {
    interactionCount: number;
  };
  evolutionProposals: EvolutionProposal[];
  level: number;
  role: string;
  status: string;
  isAwakened: boolean;
}

export interface SemanticContext {
  keywords: string[];
  summary?: string;
  entities?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
}
