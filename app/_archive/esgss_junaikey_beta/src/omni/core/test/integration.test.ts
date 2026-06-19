import { describe, it, expect, vi } from 'vitest';
import { OmniCoreEngine } from '../../infrastructure/core/OmniCoreEngine.ts';
import { OmniKnowledge } from '../../infrastructure/knowledge/OmniKnowledge.ts';

describe('Omni Core Integration', () => {
  it('should generate and store an OmniElement during an execution turn', async () => {
    // 1. Get Engine Instance
    const engine = OmniCoreEngine.getInstance();

    // 2. Start Engine (if needed)
    await engine.start();

    // 3. Run a Turn and Capture Result
    const result = await engine.executeTurn();

    // 4. Verify Turn Result contains OmniElements
    expect(result.omniElements.length).toBeGreaterThan(0);
    expect(result.omniElements[0].label).toBe('OmniSensing');

    // 5. Verify Persistence in Knowledge Warehouse
    const storedElement = await OmniKnowledge.retrieveElement(result.omniElements[0].uid);
    expect(storedElement).toBeDefined();
    expect(storedElement?.uid).toBe(result.omniElements[0].uid);
    expect(storedElement?.label).toBe('OmniSensing');
  });
});
