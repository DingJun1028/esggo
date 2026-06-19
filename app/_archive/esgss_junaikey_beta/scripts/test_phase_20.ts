import { yuantongOrchestrationService } from '../src/services/YuantongOrchestrationService';
import { governanceService } from '../src/services/GovernanceService';
import chalk from 'chalk';

async function testPhase20() {
    console.log(chalk.cyan('\n[GOV] PHASE 20: GOVERNANCE INTENT & AMBIENT INGESTION VERIFICATION\n'));

    // 1. Initial State
    const initialProposals = governanceService.getProposals();
    console.log(chalk.blue('Step 1: Checking Governance Initial State...'));
    console.log(`- Base Proposals: ${initialProposals.length}`);

    // 2. Trigger Sublimation Flow
    console.log(chalk.blue('\nStep 2: Triggering Strategic Log Flow (Ambient Ingestion)...'));
    const strategicPayload = {
        title: 'Net Zero 2050 Alignment Protocol',
        description: 'Establish a new decentralized framework for carbon credit verification across all regional nodes.',
        isStrategic: true,
        impact: 98,
        core: { version: '5T-v12.0', integrity: 0.99 }
    };

    const flow = await yuantongOrchestrationService.orchestrateFlow('LOG', strategicPayload);
    console.log(`- Flow ID: ${flow.id}`);
    console.log(`- Flow Status: ${flow.flowStatus}`);
    console.log(`- Target Module: ${flow.targetModule}`);

    // 3. Verify Proposal Creation
    console.log(chalk.blue('\nStep 3: Verifying Governance Sublimation...'));
    const finalProposals = governanceService.getProposals();
    const newProposal = finalProposals.find(p => p.creatorId === 'YUANTONG_AUTOSUB');

    if (newProposal) {
        console.log(chalk.green(`- [SUCCESS] Proposal Found: ${newProposal.title}`));
        console.log(`- Proposal Status: ${newProposal.status}`);
        console.log(`- Proposal ID: ${newProposal.id}`);
    } else {
        console.log(chalk.red('- [FAILED] No sublimated proposal found in GovernanceService.'));
        process.exit(1);
    }

    console.log(chalk.green('\n[DONE] Phase 20 Verification Complete: Ambient Ingestion & Sublimation are active.'));
}

testPhase20().catch(err => {
    console.error(chalk.red('Verification Error:'), err);
    process.exit(1);
});
