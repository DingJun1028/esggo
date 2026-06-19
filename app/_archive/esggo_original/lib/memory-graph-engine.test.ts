import { describe, it, expect } from 'vitest';
import { memoryGraphEngine, MemoryGraphEngine } from './memory-graph-engine';
import type { IComponentCore } from '../types/omni-core';
import type { RegulatoryPolicy } from './policy-engine';
import type { ResonanceResult } from './governance-engine';

const mockComponent: IComponentCore = {
  uuid: 'comp-test-001',
  timestamp: Date.now(),
  version: '1.0.0',
  status: 'Trustworthy',
  formula: 'GRI 305-1',
  impact_metric: 'Test Carbon Emission',
  hash_lock: 'hash_test_lock',
  evidence: [{
    tangible_metric: 'Test Carbon Emission',
    source_origin: 'test-source',
    lifecycle_hooks: [],
    formula_ref: 'GRI 305-1'
  }]
};

const mockPolicy: RegulatoryPolicy = {
  id: 'pol-001',
  standard: 'TCFD',
  code: 'CLIMATE-01',
  name: 'TCFD Climate Disclosure',
  description: 'Climate-related financial disclosures',
  rules: []
};

const mockResonance: ResonanceResult = {
  topicId: 'topic-climate',
  label: '氣候變遷',
  internalPriority: 90,
  stakeholderPriority: 85,
  resonance: 87.5
};

describe('MemoryGraphEngine', () => {
  describe('buildLineageGraph', () => {
    it('builds graph with evidence and memory nodes', async () => {
      const graph = await memoryGraphEngine.buildLineageGraph(mockComponent);
      expect(graph.nodes.length).toBe(2);
      expect(graph.edges.length).toBe(1);

      const evidenceNode = graph.nodes.find(n => n.id === 'comp-test-001');
      expect(evidenceNode).toBeDefined();
      expect(evidenceNode!.type).toBe('EVIDENCE');
      expect(evidenceNode!.label).toBe('Test Carbon Emission');

      const memoryNode = graph.nodes.find(n => n.id === 'mem-comp-test-001');
      expect(memoryNode).toBeDefined();
      expect(memoryNode!.type).toBe('MEMORY');
    });

    it('includes policy node when provided', async () => {
      const graph = await memoryGraphEngine.buildLineageGraph(mockComponent, mockPolicy);
      const policyNode = graph.nodes.find(n => n.id === 'policy-pol-001');
      expect(policyNode).toBeDefined();
      expect(policyNode!.type).toBe('POLICY');
      expect(policyNode!.label).toBe('TCFD Climate Disclosure');

      const policyEdge = graph.edges.find(e => e.target === 'policy-pol-001');
      expect(policyEdge).toBeDefined();
      expect(policyEdge!.label).toBe('verified_against');
      expect(policyEdge!.strength).toBe(0.9);
    });

    it('includes stakeholder resonance node when provided', async () => {
      const graph = await memoryGraphEngine.buildLineageGraph(mockComponent, undefined, mockResonance);
      const resNode = graph.nodes.find(n => n.id === 'res-topic-climate');
      expect(resNode).toBeDefined();
      expect(resNode!.type).toBe('STAKEHOLDER_EXPECTATION');
      expect(resNode!.value).toBe(85);

      const resEdge = graph.edges.find(e => e.target === 'res-topic-climate');
      expect(resEdge).toBeDefined();
      expect(resEdge!.label).toBe('aligns_with');
      expect(resEdge!.strength).toBe(0.875);
    });

    it('builds full graph with all node types', async () => {
      const graph = await memoryGraphEngine.buildLineageGraph(mockComponent, mockPolicy, mockResonance);
      expect(graph.nodes.length).toBe(4);
      expect(graph.edges.length).toBe(3);

      const types = graph.nodes.map(n => n.type);
      expect(types).toContain('EVIDENCE');
      expect(types).toContain('POLICY');
      expect(types).toContain('STAKEHOLDER_EXPECTATION');
      expect(types).toContain('MEMORY');
    });
  });

  describe('singleton', () => {
    it('returns same instance via getInstance', () => {
      const instance = MemoryGraphEngine.getInstance();
      expect(instance).toBe(memoryGraphEngine);
    });
  });
});
