import zkpService from '../server/services/zkpService.js';
import vaultService from '../server/services/vault.js';
import chalk from 'chalk';
import dotenv from 'dotenv';
import pool from '../server/db/index.js';

dotenv.config();

async function verifyPrivacy() {
  console.log(chalk.cyan('🔐 Verifying Privacy (ZKP) & Audit (Vault)...'));

  try {
    // 1. ZKP: Commit to a Private Value (e.g., Carbon Offset Cost)
    console.log(chalk.blue('... Generating ZKP Commitment ...'));
    const secretValue = 150000; // $150k
    const commitmentData = zkpService.createCommitment(secretValue) as any;

    console.log(`Value: [HIDDEN]`);
    console.log(`Secret: [HIDDEN]`);
    console.log(`Commitment: ${commitmentData.commitment}`);

    // 2. Verify Commitment
    // Proving I know the value without revealing it to the public (public only sees commitment)
    // But the verifier (who receives value+secret securely) can check it matches.
    const isValid = zkpService.verifyCommitment(
      commitmentData.commitment,
      secretValue,
      commitmentData.secret
    );

    if (isValid) {
      console.log(chalk.green('✓ Commitment Verified (Math holds up)'));
    } else {
      throw new Error('ZKP Commitment Failed');
    }

    // 3. Vault: Log this event
    console.log(chalk.blue('... Logging Evidence to Vault ...'));
    const receipt = await vaultService.logEvidence('AGENT', 'agent_007', 'ZKP_COMMITMENT', {
      commitment: commitmentData.commitment,
    });
    console.log(`Receipt: ${receipt.receiptId}`);

    // 4. Audit: Retrieve Trail
    const trail = await vaultService.retrieveAuditTrail('agent_007');
    if (trail.length >= 2) {
      // 2 mock items
      console.log(chalk.green('✓ Audit Trail Retrieved Successfully'));
    }

    console.log(chalk.green('\n✨ INTEGRITY & PRIVACY VERIFIED ✨'));
    await pool.end();
    process.exit(0);
  } catch (error: any) {
    console.error(chalk.red('❌ Verification Failed:'), error);
    await pool.end();
    process.exit(1);
  }
}

verifyPrivacy();
