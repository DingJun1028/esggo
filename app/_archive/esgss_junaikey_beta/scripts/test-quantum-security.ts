/**
 * Phase 60: Quantum Security Verification Script
 * ---------------------------------------------
 * Verifies that the QuantumTrustAnchorService correctly secures 5T v11.1 cores
 * and that the factory integrates these anchors.
 */

import { OmniComponentCoreFactory } from '../server/services/OmniComponentCore.js';
import { quantumTrustAnchorService } from '../server/services/QuantumTrustAnchorService.js';
import { consensusGovernanceService } from '../server/services/ConsensusGovernanceService.js';

console.log('🚀 Starting Phase 60: Quantum Security Verification...');

async function runTest() {
    // 1. Verify Factory Integration for v11.1
    console.log('\n🏗️ Testing Factory for v11.1 Quantum Anchors...');
    const core = OmniComponentCoreFactory.create({
        sourceOrigin: 'TEST-SOURCE',
        rawDataPath: '/vault/test.json',
        verificationMethod: 'QUANTUM-SIM-V1',
        version: '11.1.0-alpha'
    });

    console.log(`Core Version: ${core.version}`);
    console.log(`Quantum Anchor: ${(core.evidence.trustworthy as any).quantum_anchor}`);
    console.log(`Post-Quantum Hash: ${(core.evidence.trustworthy as any).post_quantum_hash}`);

    if (!(core.evidence.trustworthy as any).quantum_anchor || !(core.evidence.trustworthy as any).post_quantum_hash) {
        throw new Error('v11.1 Core missing quantum anchors');
    }

    // 2. Verify Anchor Logic
    console.log('\n⚛️ Verifying Lattice Anchor Integrity...');
    const isValid = quantumTrustAnchorService.verifyAnchor(
        core.uuid,
        (core.evidence.trustworthy as any).quantum_anchor,
        core.evidence.trustworthy.hash_lock
    );
    console.log(`Anchor Verification Result: ${isValid}`);
    if (!isValid) throw new Error('Quantum anchor verification failed');

    // 3. Verify Consensus Integration (Uses v11.1 by default now)
    console.log('\n🗳️ Testing Consensus Proposal with v11.1 Quantum Anchors...');
    const propId = await consensusGovernanceService.submitProposal({
        type: 'GOVERNANCE_ADJUSTMENT',
        description: 'Quantum Security Standard Update',
        initiator: 'AGT-GUARDIAN-001',
        quorum: 1,
        expiresAt: Date.now() + 5000
    });

    const proposal = consensusGovernanceService.getProposal(propId);
    console.log(`Proposal ${propId} Version: ${proposal?.core?.version}`);
    console.log(`Proposal Quantum Anchor: ${(proposal?.core?.evidence.trustworthy as any).quantum_anchor}`);

    if (proposal?.core?.version !== '11.1.0-alpha' || !(proposal?.core?.evidence.trustworthy as any).quantum_anchor) {
        throw new Error('Governance proposal failed to initialize with v11.1 Quantum Anchor');
    }

    console.log('\n🌟 PHASE 60: QUANTUM-RESISTANT TRUST ANCHORS VERIFIED SUCCESSFULLY!');
    process.exit(0);
}

runTest().catch(err => {
    console.error('Fatal Test Error:', err);
    process.exit(1);
});
