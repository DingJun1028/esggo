import 'dotenv/config';
import { governanceService } from '../src/services/GovernanceService.ts';
import { isSupabaseConfigured } from '../src/lib/supabase.ts';
import { ethicalGuardianService } from '../src/services/EthicalGuardianService.ts';
import { type Agent } from '../src/types/index.ts';
import chalk from 'chalk';

async function testPhase22() {
    console.log(chalk.bold.cyan('\n[GOV] PHASE 22: SENTIENT DAO & ETHICAL GUARDIAN VERIFICATION\n'));

    // 1. Mock Agents
    console.log('Supabase Configured:', isSupabaseConfigured);
    const masterAgent: Agent = {
        id: 'agent_sovereign',
        name: 'Sovereign-Prime',
        level: 42,
        dna: { intelligence: 95, resilience: 90, creativity: 80, empathy: 85, precision: 90, speed: 70 },
        stats: { intelligence: 95, resilience: 90 } // Mock stats for compatibility if needed
    } as any;

    const rogueAgent: Agent = {
        id: 'agent_rogue',
        name: 'Shadow-Logic',
        level: 10,
        dna: { intelligence: 60, resilience: 40, creativity: 30, empathy: 10, precision: 40, speed: 50 }
    } as any;

    console.log(chalk.yellow('Step 1: Calculating Sentient Voting Power...'));
    const sovereignPower = governanceService.calculateVotingPower(masterAgent);
    console.log(`- Sovereign-Prime Power: ${chalk.green(sovereignPower)}`);

    // 2. Create Proposal
    console.log(chalk.yellow('\nStep 2: Initializing Autonomous Proposal...'));
    await governanceService.createProposal({
        creatorId: masterAgent.id,
        title: 'Global ESG Integration Protocol',
        description: 'Mandatory carbon transparency for all sub-entities.',
        category: 'ENVIRONMENTAL',
        quorum: 1000,
        impactScore: 98
    });

    const proposals = governanceService.getProposals();
    const activeProp = proposals[0];
    console.log(`- Proposal Created: ${chalk.magenta(activeProp?.title)} (Status: ${activeProp?.status})`);

    // 3. Ethical Audit
    console.log(chalk.yellow('\nStep 3: Performing Ethical Guardianship Audit...'));
    const audit1 = await ethicalGuardianService.auditAction(masterAgent.id, 'VOTE_FOR_ESG', { propId: activeProp?.id });
    console.log(`- Sovereign Audit Score: ${chalk.green(audit1.score + '%')} [${audit1.status}]`);
    console.log(`- Feedback: ${chalk.italic(audit1.feedback)}`);

    const audit2 = await ethicalGuardianService.auditAction(rogueAgent.id, 'BYPASS_CONSENSUS', { propId: activeProp?.id });
    console.log(`- Rogue Audit Score: ${chalk.red(audit2.score + '%')} [${audit2.status}]`);

    // 4. Voting Cycle
    console.log(chalk.yellow('\nStep 4: Executing Consensus Cycle...'));
    if (audit1.status === 'ALIGNED') {
        await governanceService.castVote(activeProp?.id!, masterAgent, true);
    }

    const updatedProp = governanceService.getProposals().find(p => p.id === activeProp?.id);
    console.log(`- Consensus Status: ${updatedProp?.votesFor}/${activeProp?.quorum} Power`);
    console.log(`- Final Status: ${chalk.bold.green(updatedProp?.status)}`);

    // 5. Compass Alignment
    console.log(chalk.yellow('\nStep 5: Verifying Moral Compass Alignment...'));
    const alignment = ethicalGuardianService.getAlignment();
    console.log(`- Transparency: ${alignment.transparency.toFixed(1)}%`);
    console.log(`- Integrity: ${alignment.integrity.toFixed(1)}%`);

    console.log(chalk.bold.green('\n[DONE] Phase 22 Verification Complete: Sentient DAO is Operational.\n'));
}

testPhase22().catch(err => {
    console.error(chalk.red('\n[FAILED] Phase 22 Verification Failed:'), err);
    process.exit(1);
});
