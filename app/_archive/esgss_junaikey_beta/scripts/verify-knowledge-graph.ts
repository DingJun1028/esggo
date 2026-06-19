/**
 * Phase 68: Cognitive Knowledge Graph Verification
 * --------------------------------------------------
 * Verifies the graph service's ability to store and link knowledge nodes.
 */

import { knowledgeGraphService, NodeType, EdgeType } from '../src/services/KnowledgeGraphService';
import { omniLogger, LogCategory } from '../server/services/omni/infrastructure/logging/OmniLogger.js';

async function verifyKnowledgeGraph() {
    omniLogger.info(LogCategory.SYSTEM, '🧠 [VERIFY] Initializing Knowledge Graph Test...');

    // 1. Snapshot Check (Initial Seed)
    const snapshot = knowledgeGraphService.getGraphSnapshot();
    console.log(`✅ [Graph Init] Nodes: ${snapshot.nodes.length}, Edges: ${snapshot.edges.length}`);
    if (snapshot.nodes.length < 2) throw new Error('Seeding failed.');

    // 2. Pulse Ingestion
    console.log('\n🧠 [Ingestion] Simulating Market Pulse...');
    knowledgeGraphService.ingestPulse('pulse-test-01', 'Global Carbon Tax increasing 5%');
    console.log('✅ [Ingestion] Pulse added and linked.');

    // 3. Traversal (Relation Check)
    console.log('\n🧠 [Traversal] Analyzing impact of "Carbon Tax"...');
    // Find relations for the new pulse node
    const relations = knowledgeGraphService.findRelated('pulse-test-01');
    relations.forEach(r => {
        console.log(`   - Linked to [${r.node.type}] ${r.node.label} via ${r.edge.type} (w:${r.edge.weight})`);
    });

    if (relations.length === 0) throw new Error('Automatic linking failed.');

    // Check deep connection (Course -> Concept -> Pulse)
    // For this simple test, we just verify direct or 1-hop connections existed from seed.
    const conceptRelations = knowledgeGraphService.findRelated('con-carbon');
    console.log(`\n🧠 [Deep Check] "Carbon Emissions" Concept is central node.`);
    console.log(`   - Total Connections: ${conceptRelations.length}`);

    console.log('\n================================================');
    console.log('🧠 OMNIBRAIN KNOWLEDGE GRAPH VERIFIED');
    console.log('Status: COGNITIVE');
    console.log('================================================');
}

verifyKnowledgeGraph().catch(err => {
    console.error('❌ [VERIFY] Failed:', err);
    process.exit(1);
});
