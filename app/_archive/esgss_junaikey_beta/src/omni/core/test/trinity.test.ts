import { describe, it, expect } from 'vitest';
import { createOmniElement } from '../../infrastructure/core/OmniFactory.ts';
import { OmniKnowledge } from '../../infrastructure/knowledge/OmniKnowledge.ts';
import { OmniElement } from '../types/OmniElement.ts';

describe('Omni Core (Trinity) Architecture', () => {
  it('should create an OmniElement with correct UID and Label', () => {
    const element = createOmniElement('OmniStandard', { intent: 'verify' });
    expect(element.label).toBe('OmniStandard');
    expect(element.uid).toContain('OmniStandard-');
    expect(element.attrs).toEqual({ intent: 'verify' });
    expect(element.version).toBe('1.0');
  });

  it('should store and retrieve an OmniElement via OmniKnowledge', async () => {
    const element = createOmniElement('OmniOne', { data: 'test-payload' });

    await OmniKnowledge.storeElement(element);

    const retrieved = await OmniKnowledge.retrieveElement(element.uid);
    expect(retrieved).toBeDefined();
    expect(retrieved?.uid).toBe(element.uid);
    expect(retrieved?.label).toBe('OmniOne');
  });

  it('should maintain a Trinity chain (Reasoning flow simulation)', async () => {
    // 1. Perception (Input)
    const root = createOmniElement('OmniInput', { raw: 'input data' });
    await OmniKnowledge.storeElement(root);

    // 2. Reasoning (Derived)
    const derived = createOmniElement('OmniReasoning', { analysis: 'processed' }, root.uid);
    await OmniKnowledge.storeElement(derived);

    // 3. Verification
    const fetchedDerived = await OmniKnowledge.retrieveElement(derived.uid);
    expect(fetchedDerived?.predecessor).toBe(root.uid);

    // Check Knowledge Graph Reflection
    const graph = OmniKnowledge.getKnowledgeGraph();
    const node = graph.nodes.get(derived.uid);
    expect(node).toBeDefined();
    expect(node?.type).toBe('element');
    expect(node?.sources).toContain(`derived-from:${root.uid}`);
  });
});
