import { MeshNodeDiscoveryService } from '../mesh/MeshNodeDiscoveryService';
import { MeshMessageType, MeshNode } from '../mesh/MeshProtocol';

async function runTest() {
    console.log('🌌 Starting Planetary Mesh Bidirectional Handshake Test...');

    // 1. Initialize two separate nodes
    const nodeA = new MeshNodeDiscoveryService('node-alpha');
    const nodeB = new MeshNodeDiscoveryService('node-beta');

    console.log('Node A ID:', 'node-alpha');
    console.log('Node B ID:', 'node-beta');

    // 2. Setup Node A to listen for responses
    let responseReceived = false;
    nodeA.onMessage((msg) => {
        if (msg.type === MeshMessageType.HANDSHAKE && msg.senderNodeId === 'node-beta') {
            console.log(`✅ Node A received handshake response from ${msg.senderNodeId}`);
            responseReceived = true;
        }
    });

    // 3. Setup Mock Node B connectivity
    // Node A needs to "know" Node B to initiate
    const peerB: MeshNode = {
        nodeId: 'node-beta',
        publicKey: 'mock-pk-beta',
        organizationId: 'org-beta',
        endpoint: 'https://beta.mesh.org',
        reputation: 1.0
    };

    // 4. Node A initiates handshake to Node B
    console.log('🚀 Node A initiating handshake to Node B...');
    const success = await nodeA.connect(peerB);

    if (!success) {
        console.error('❌ Handshake initiation failed.');
        process.exit(1);
    }

    // 5. Wait for the asynchronous response
    console.log('⏳ Waiting for Node B automatic response...');
    await new Promise(resolve => setTimeout(resolve, 500));

    if (responseReceived) {
        console.log('🌌 Test Complete: Bidirectional Handshake Verified.');
    } else {
        console.error('❌ Test Failed: Node A never received the handshake response from Node B.');
        process.exit(1);
    }
}

runTest().catch(err => {
    console.error('Test error:', err);
    process.exit(1);
});
