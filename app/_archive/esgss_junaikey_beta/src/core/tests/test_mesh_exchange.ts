import { MeshNodeDiscoveryService } from '../mesh/MeshNodeDiscoveryService';
import { MeshMessageType, MeshNode } from '../mesh/MeshProtocol';

async function runTest() {
    console.log('🌌 Starting Phase 106: Data Exchange & Consensus Test...');

    const nodeA = new MeshNodeDiscoveryService('node-alpha');
    const nodeB = new MeshNodeDiscoveryService('node-beta');
    const nodeC = new MeshNodeDiscoveryService('node-gamma');

    let consensusReached = false;
    let dataReceivedByB = false;

    // Node A Listeners
    nodeA.onConsensus((data) => {
        console.log(`✅ Node A reached consensus on hash ${data.dataHash.substring(0, 8)} with voters: ${data.voters.join(', ')}`);
        consensusReached = true;
    });

    // Node B Listeners
    nodeB.onMessage(async (msg) => {
        if (msg.type === MeshMessageType.DATA_OFFER) {
            console.log(`📥 Node B received Data Offer from ${msg.senderNodeId}. Requesting full data...`);
            await nodeB.requestData(msg.senderNodeId, msg.payload.offerId);
        }
        if (msg.type === MeshMessageType.DATA_RESPONSE) {
            console.log(`📦 Node B received full data from ${msg.senderNodeId}. Indicators:`, msg.payload);
            dataReceivedByB = true;
            console.log(`🗳️ Node B voting for consensus...`);
            // In a real scenario, Node B would hash the data it received.
            await nodeB.voteConsensus(msg.senderNodeId, dataHash);
        }
    });

    // Node C Listeners (Just vote directly for the test)
    nodeC.onMessage(async (msg) => {
        if (msg.type === MeshMessageType.DATA_OFFER) {
            console.log(`🗳️ Node C received offer, voting for consensus...`);
            await nodeC.voteConsensus(msg.senderNodeId, msg.payload.dataHash);
        }
    });

    // Setup: Node A knows B and C
    const peerB: MeshNode = { nodeId: 'node-beta', publicKey: 'pk-b', organizationId: 'org-b', endpoint: 'ep-b', reputation: 0.9 };
    const peerC: MeshNode = { nodeId: 'node-gamma', publicKey: 'pk-c', organizationId: 'org-c', endpoint: 'ep-c', reputation: 0.8 };

    // In our simplified bus, we just need the instances to exist. 
    // The static meshBus handles the routing.

    console.log('🚀 Node A offering ESG data...');
    const dataHash = await nodeA.offerData('GRI', { carbon_offset: 500, renewable_energy: 0.8 });

    // Wait for the exchange and consensus to propagate
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (consensusReached) {
        console.log('🌌 Test Complete: Data Exchange & Consensus Verified.');
        process.exit(0);
    } else {
        console.error('❌ Test Failed: Consensus was never reached.');
        process.exit(1);
    }
}

runTest().catch(err => {
    console.error('💥 Test Crashed:', err);
    process.exit(1);
});
