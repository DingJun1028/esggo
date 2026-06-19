/**
 * Multi-Agent Consensus Verification Script
 * ----------------------------------------
 * Verifies that the ConsensusGovernanceService correctly manages decentralized
 * voting and that EthicalShieldService enforces consensus for shield resets.
 */

import { consensusGovernanceService, ProposalStatus } from '../server/services/ConsensusGovernanceService.js';
import { ethicalShieldService, ShieldState } from '../server/services/EthicalShieldService.js';
import { complianceService } from '../server/services/ComplianceService.js';

console.log('🚀 Starting Multi-Agent Consensus Verification...');

async function runTest() {
    // 1. Force a LOCKDOWN state via a violation
    console.log('\n🛑 Triggering Initial LOCKDOWN...');
    complianceService.emit('violation', {
        ruleId: 'RULE-PROTOCOL-BREACH',
        description: 'Critical protocol variance detected',
        value: 1,
        threshold: 0,
        sensorId: 'NODE-001'
    });

    console.log(`Current Shield State: ${ethicalShieldService.getState()}`);
    if (ethicalShieldService.getState() !== ShieldState.LOCKDOWN) {
        throw new Error('Failed to enter LOCKDOWN state');
    }

    // 2. Submit a Shield Reset Proposal
    console.log('\n📋 Submitting Shield Reset Proposal...');
    const proposalId = await consensusGovernanceService.submitProposal({
        type: 'SHIELD_RESET',
        description: 'Restoring sovereignty after protocol variance resolution.',
        initiator: 'AGT-STRATEGIST-001',
        quorum: 2, // Requires 2 approvals
        expiresAt: Date.now() + 10000
    });
    console.log(`Proposal ID: ${proposalId}`);

    // 3. Attempt to reset WITHOUT consensus (Should fail)
    console.log('\n🎯 Attempting reset WITHOUT consensus (Expect rejection)...');
    const resetAttempt1 = await ethicalShieldService.resetShield(proposalId);
    console.log(`Reset Attempt 1 Success: ${resetAttempt1}`);
    if (resetAttempt1) throw new Error('Shield reset unexpectedly before consensus');

    // 4. Cast Votes
    console.log('\n🗳️ Casting Agent Votes...');
    await consensusGovernanceService.castVote(proposalId, 'AGT-STRATEGIST-001', true);
    await consensusGovernanceService.castVote(proposalId, 'AGT-GUARDIAN-002', true);

    const proposal = consensusGovernanceService.getProposal(proposalId);
    console.log(`Proposal Status after votes: ${proposal?.status}`);

    if (proposal?.status !== ProposalStatus.APPROVED) {
        throw new Error('Proposal failed to reach APPROVED status after quorum');
    }

    // 5. Attempt reset WITH consensus (Should succeed)
    console.log('\n🎯 Attempting reset WITH consensus (Expect success)...');
    const resetAttempt2 = await ethicalShieldService.resetShield(proposalId);
    console.log(`Reset Attempt 2 Success: ${resetAttempt2}`);

    console.log(`Final Shield State: ${ethicalShieldService.getState()}`);

    if (resetAttempt2 && ethicalShieldService.getState() === ShieldState.NORMAL) {
        console.log('\n🌟 MULTI-AGENT CONSENSUS PROTOCOL VERIFIED SUCCESSFULLY!');

        console.log('\n--- 5T v11.0 Consensus Core Audit ---');
        console.log(`UUID: ${proposal.core?.uuid}`);
        console.log(`Status: ${proposal.core?.status}`);
        console.log(`Transparent Reasoning:`);
        proposal.core?.evidence.metadata?.reasoning_path.forEach((r: string) => console.log(` - ${r}`));
        console.log(`Trustworthy Hash: ${proposal.core?.evidence.trustworthy.hash_lock}`);

        process.exit(0);
    } else {
        console.error('\n❌ CONSENSUS ENFORCEMENT FAILED');
        process.exit(1);
    }
}

runTest().catch(err => {
    console.error('Fatal Test Error:', err);
    process.exit(1);
});
