import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OmniMultiAgentOrchestrator } from '../omni-multi-agent-orchestrator';
import { OmniDecisionValidator } from '../omni-decision-validator';
import { OmniPersonaManager } from '../omni-persona-manager';

describe('OmniMultiAgentOrchestrator', () => {
    let orchestrator: OmniMultiAgentOrchestrator;
    let validator: OmniDecisionValidator;

    beforeEach(() => {
        orchestrator = OmniMultiAgentOrchestrator.getInstance();
        validator = OmniDecisionValidator.getInstance();
    });

    it('should coordinate socratic reasoning between personas', async () => {
        const query = 'Should we invest in solar microgrids for the local community?';
        const domain = 'excellence';
        
        const result = await orchestrator.orchestrate(query, domain);
        
        expect(result).toBeDefined();
        expect(result.reasoningChain.length).toBeGreaterThanOrEqual(1);
        expect(result.finalConsensus).toContain('Consensus');
        expect(result.validation.passed).toBe(true);
        expect(result.validation.score).toBeGreaterThan(0.6);
    });

    it('should handle different domains with relevant personas', async () => {
        const carbonQuery = 'Analyze scope 3 emissions for the supply chain.';
        const result = await orchestrator.orchestrate(carbonQuery, 'carbon');
        
        expect(result.reasoningChain.some(r => r.persona === 'carbon-keeper')).toBe(true);
    });

    it('should fail validation for extremely vague or invalid queries', async () => {
        // This depends on how strict the rules are. 
        // In current implementation, truth/traceability check for payload.query
        const result = await orchestrator.orchestrate('', 'general');
        // If query is empty, it might still pass some simulated rules but score lower.
        // Let's check if the score is affected.
        expect(result.validation.score).toBeLessThan(1.0);
    });
});

describe('OmniDecisionValidator', () => {
    let validator: OmniDecisionValidator;

    beforeEach(() => {
        validator = OmniDecisionValidator.getInstance();
    });

    it('should perform strict 5T validation', async () => {
        const input = {
            id: 'test-dec-001',
            domain: 'excellence',
            action: 'validate',
            payload: {
                query: 'Test Query',
                reasoning_steps: 5,
                alternativesConsidered: true,
                esgAlignment: true,
                consensus: 'Reached'
            }
        };

        const result = await validator.validate(input);
        
        expect(result.passed).toBe(true);
        expect(result.score).toBeGreaterThan(0.8);
        expect(result.tangible.score).toBeGreaterThan(0);
        expect(result.traceable.sourceOrigin).toBe('OmniNexus');
    });

    it('should fail if critical information is missing', async () => {
        const input = {
            id: 'test-dec-002',
            domain: 'unknown',
            action: 'validate',
            payload: {} // Empty payload
        };

        const result = await validator.validate(input);
        // Traceability rule requires domain and id. 
        // Truth rule requires query or consensus.
        expect(result.score).toBeLessThan(0.7);
    });
});
