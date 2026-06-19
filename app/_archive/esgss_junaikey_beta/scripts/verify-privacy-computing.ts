/**
 * Phase 62: Federated ESG Intelligence Verification
 * --------------------------------------------------
 * Verifies Federated Learning Bridge (FedAvg) and Zero-Knowledge Proof Service.
 */

import { federatedLearningBridge, ModelUpdate } from '../src/services/FederatedLearningBridge.js';
import { zeroKnowledgeProofService } from '../server/services/ZeroKnowledgeProofService.js';
import { omniLogger, LogCategory } from '../server/services/omni/infrastructure/logging/OmniLogger.js';

async function runPrivacyComputingVerification() {
    omniLogger.info(LogCategory.SYSTEM, '🌐 STARTING PRIVACY COMPUTING VERIFICATION (Phase 62)...');

    console.log('\n🏗️  1. Testing Federated Learning Bridge...');
    const bridge = federatedLearningBridge; // Singleton access via export

    // Simulate 3 nodes sending updates
    const updates: ModelUpdate[] = [
        { nodeId: 'Node-A', roundId: 1, weights: [0.12, 0.12, 0.12, 0.12, 0.12], sampleSize: 100 },
        { nodeId: 'Node-B', roundId: 1, weights: [0.10, 0.10, 0.10, 0.10, 0.10], sampleSize: 100 },
        { nodeId: 'Node-C', roundId: 1, weights: [0.08, 0.08, 0.08, 0.08, 0.08], sampleSize: 100 }
    ];

    updates.forEach(u => bridge.submitUpdate(u));

    const globalModel = bridge.getGlobalModel();
    console.log(`- New Global Model Version: ${globalModel.version}`);
    console.log(`- Aggregated Weights: ${JSON.stringify(globalModel.weights)}`);
    console.log(`- Round ID: ${globalModel.roundId}`);

    if (globalModel.roundId === 2) {
        console.log('✅ Federated Learning Aggregation Successful.');
    } else {
        console.error('❌ FedAvg Failed to advance round.');
        process.exit(1);
    }

    console.log('\n🏗️  2. Testing Zero-Knowledge Proofs...');
    // Prove Emissions < 1000 without revealing actual emission (850)
    const secretEmission = 850;
    const threshold = 1000;

    const proof = zeroKnowledgeProofService.generateProof(secretEmission, threshold, 'LESS_THAN');
    console.log(`- Generated Proof ID: ${proof.proofId}`);
    console.log(`- Encrypted Hash: ${proof.encryptedProof}`);

    const isVerified = zeroKnowledgeProofService.verifyProof(proof);
    console.log(`- Verification Result: ${isVerified ? 'VALID' : 'INVALID'}`);

    if (isVerified) {
        console.log('✅ ZK-Proof Generation & Verification Successful.');
    } else {
        console.error('❌ ZK-Proof Failed.');
        process.exit(1);
    }

    console.log('\n================================================');
    console.log('🌐 PRIVACY COMPUTING VERIFIED');
    console.log('Status: SECURE');
    console.log('================================================');
}

runPrivacyComputingVerification().catch(err => {
    console.error('❌ Verification Failed:', err);
    process.exit(1);
});
