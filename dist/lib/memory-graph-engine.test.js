"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const memory_graph_engine_1 = require("./memory-graph-engine");
const mockComponent = {
    uuid: 'comp-test-001',
    timestamp: Date.now(),
    version: '1.0.0',
    status: 'Trustworthy',
    formula: 'GRI 305-1',
    impact_metric: 'Test Carbon Emission',
    hash_lock: 'hash_test_lock',
    evidence: [{
            finalEffect: 'Test Carbon Emission',
            originCause: 'test-source',
            processTrace: [],
            formula_ref: 'GRI 305-1'
        }]
};
const mockPolicy = {
    id: 'pol-001',
    standard: 'TCFD',
    code: 'CLIMATE-01',
    name: 'TCFD Climate Disclosure',
    description: 'Climate-related financial disclosures',
    rules: []
};
const mockResonance = {
    topicId: 'topic-climate',
    label: '氣候變遷',
    internalPriority: 90,
    stakeholderPriority: 85,
    resonance: 87.5
};
(0, vitest_1.describe)('MemoryGraphEngine', () => {
    (0, vitest_1.describe)('buildLineageGraph', () => {
        (0, vitest_1.it)('builds graph with evidence and memory nodes', async () => {
            const graph = await memory_graph_engine_1.memoryGraphEngine.buildLineageGraph(mockComponent);
            (0, vitest_1.expect)(graph.nodes.length).toBe(2);
            (0, vitest_1.expect)(graph.edges.length).toBe(1);
            const evidenceNode = graph.nodes.find(n => n.id === 'comp-test-001');
            (0, vitest_1.expect)(evidenceNode).toBeDefined();
            (0, vitest_1.expect)(evidenceNode.type).toBe('EVIDENCE');
            (0, vitest_1.expect)(evidenceNode.label).toBe('Test Carbon Emission');
            const memoryNode = graph.nodes.find(n => n.id === 'mem-comp-test-001');
            (0, vitest_1.expect)(memoryNode).toBeDefined();
            (0, vitest_1.expect)(memoryNode.type).toBe('MEMORY');
        });
        (0, vitest_1.it)('includes policy node when provided', async () => {
            const graph = await memory_graph_engine_1.memoryGraphEngine.buildLineageGraph(mockComponent, mockPolicy);
            const policyNode = graph.nodes.find(n => n.id === 'policy-pol-001');
            (0, vitest_1.expect)(policyNode).toBeDefined();
            (0, vitest_1.expect)(policyNode.type).toBe('POLICY');
            (0, vitest_1.expect)(policyNode.label).toBe('TCFD Climate Disclosure');
            const policyEdge = graph.edges.find(e => e.target === 'policy-pol-001');
            (0, vitest_1.expect)(policyEdge).toBeDefined();
            (0, vitest_1.expect)(policyEdge.label).toBe('verified_against');
            (0, vitest_1.expect)(policyEdge.strength).toBe(0.9);
        });
        (0, vitest_1.it)('includes stakeholder resonance node when provided', async () => {
            const graph = await memory_graph_engine_1.memoryGraphEngine.buildLineageGraph(mockComponent, undefined, mockResonance);
            const resNode = graph.nodes.find(n => n.id === 'res-topic-climate');
            (0, vitest_1.expect)(resNode).toBeDefined();
            (0, vitest_1.expect)(resNode.type).toBe('STAKEHOLDER_EXPECTATION');
            (0, vitest_1.expect)(resNode.value).toBe(85);
            const resEdge = graph.edges.find(e => e.target === 'res-topic-climate');
            (0, vitest_1.expect)(resEdge).toBeDefined();
            (0, vitest_1.expect)(resEdge.label).toBe('aligns_with');
            (0, vitest_1.expect)(resEdge.strength).toBe(0.875);
        });
        (0, vitest_1.it)('builds full graph with all node types', async () => {
            const graph = await memory_graph_engine_1.memoryGraphEngine.buildLineageGraph(mockComponent, mockPolicy, mockResonance);
            (0, vitest_1.expect)(graph.nodes.length).toBe(4);
            (0, vitest_1.expect)(graph.edges.length).toBe(3);
            const types = graph.nodes.map(n => n.type);
            (0, vitest_1.expect)(types).toContain('EVIDENCE');
            (0, vitest_1.expect)(types).toContain('POLICY');
            (0, vitest_1.expect)(types).toContain('STAKEHOLDER_EXPECTATION');
            (0, vitest_1.expect)(types).toContain('MEMORY');
        });
    });
    (0, vitest_1.describe)('singleton', () => {
        (0, vitest_1.it)('returns same instance via getInstance', () => {
            const instance = memory_graph_engine_1.MemoryGraphEngine.getInstance();
            (0, vitest_1.expect)(instance).toBe(memory_graph_engine_1.memoryGraphEngine);
        });
    });
});
//# sourceMappingURL=memory-graph-engine.test.js.map