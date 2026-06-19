import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OmniKey } from './OmniKey.ts';
import { TaskComplexity } from '../../services/geminiService.ts';

// Mock dependencies
vi.mock('../infrastructure/memory/OmniMemory', () => ({
  useOmniMemory: {
    getState: vi.fn(() => ({
      setEvolutionPhase: vi.fn(),
      addInteractionLog: vi.fn(),
      palace: {
        theVault: { conceptWeights: {} },
        theLibrary: { domainRules: {} },
      },
      evolutionState: {
        evolutionLevel: 1,
        experiencePoints: 0,
        currentPhase: 'IDLE',
      },
      reinforceConcept: vi.fn(),
      updateEvolutionMetrics: vi.fn(),
    })),
  },
}));

vi.mock('../../services/geminiService', () => ({
  GeminiService: {
    checkAvailability: vi.fn(() => true),
    generateStrategy: vi.fn(async () => ({
      title: 'Mock Strategy',
      content: 'Step 1: Analyze\nStep 2: Remediation',
      category: 'Mock',
    })),
  },
  TaskComplexity: {
    SIMPLE: 'simple',
    MODERATE: 'moderate',
    COMPLEX: 'complex',
  },
}));

describe('OmniKey (Sentient v2.0 Integration)', () => {
  let omniKey: OmniKey;

  beforeEach(() => {
    omniKey = OmniKey.getInstance();
  });

  it('should return a 5T verified response', async () => {
    const response = await omniKey.unlock('Analyze system security');

    expect(response.core.status).toBe('Trustworthy');
    expect(response.message).toContain('Mock Strategy');
  });

  it('should handle complex tasks with Gemini strategy', async () => {
    // This input should trigger complex path in OmniEvolution heuristic
    const response = await omniKey.unlock('Perform deep security scan on dependency tree');

    expect(response.core.evidence?.logicGate?.traceable).toContain(
      'Input: Perform deep security scan'
    );
    // Verify specific output indicating strategy was generated
    expect(response.message).toContain('Step 1: Analyze');
  });
});
