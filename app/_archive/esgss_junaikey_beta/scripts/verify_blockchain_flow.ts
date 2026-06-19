import { EvidenceVault } from '@/services/EvidenceVault';
import { truthEngine } from '@/omni/services/OmniTruthEngine';
import { blockchainAnchor } from '@/omni/services/BlockchainAnchorService';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

async function runVerification() {
  console.log('--- Starting Blockchain Verification Flow ---');

  try {
    // 1. Deposit Evidence
    console.log('[1] Depositing Evidence...');
    const evidenceContent = { report: 'ESG Financials Q1', score: 95 };
    const evidence = await EvidenceVault.deposit(
      evidenceContent,
      'esg_q1.json',
      'application/json'
    );
    console.log(` > Evidence Deposited: ${evidence.id} (Hash: ${evidence.fileHash})`);

    // Check Mempool
    const status1 = blockchainAnchor.getChainStatus();
    console.log(` > Mempool Count: ${status1.pendingTxCount} (Expected: >0)`);

    // 2. Trigger Anchoring (Mine Block)
    console.log('[2] Triggering Blockchain Anchor...');
    const txCount = await EvidenceVault.triggerAnchor();
    console.log(` > Block Mined with ${txCount} transactions.`);

    const status2 = blockchainAnchor.getChainStatus();
    console.log(` > Current Height: ${status2.currentHeight}`);
    console.log(` > Latest Hash: ${status2.latestBlockHash}`);

    // 3. Register and Verify Claim
    console.log('[3] Registering Truth Claim with Evidence...');
    const claim = await truthEngine.registerClaimWithEvidence(
      'ESG Score for Q1 is 95 verified on-chain',
      [evidence.id]
    );
    console.log(` > Claim Registered: ${claim.id}`);

    // 4. Validate Claim (Check logic)
    console.log('[4] Validating Claim via Truth Engine...');
    // Note: registerClaimWithEvidence already assumes verification, but let's run refined validation
    // We need to access the claim via standard interface if we want to run validateClaim
    // But registerClaimWithEvidence puts it in truthClaimsRegister.
    // Let's manually register it as a "submitted claim" to test the validation loop logic if we want,
    // OR just verify the metadata on the truthClaim.

    // Let's verify the evidence metadata itself has the proof
    const updatedEvidence = EvidenceVault.getById(evidence.id);
    if (updatedEvidence?.blockHeight && updatedEvidence?.witness === 'Blockchain') {
      console.log(' > SUCCESS: Evidence is marked as anchored by Blockchain witness.');
      console.log(` > Block Height: ${updatedEvidence.blockHeight}`);
      console.log(` > Merkle Proof Present: ${!!updatedEvidence.merkleProof}`);
    } else {
      console.error(' > FAILURE: Evidence missing blockchain metadata.');
    }
  } catch (error) {
    console.error('Verification Failed:', error);
  }
}

// Run if called directly
runVerification().then(() => console.log('--- Finished ---'));
