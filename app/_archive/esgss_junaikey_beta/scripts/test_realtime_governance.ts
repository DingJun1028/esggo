import 'dotenv/config';
import { governanceService, ProposalCategory } from '../src/services/GovernanceService.ts';
import { supabase } from '../src/lib/supabase.ts';
import chalk from 'chalk';

async function testRealtimeGovernance() {
    console.log(chalk.cyan.bold('[TEST] Starting Realtime Governance Verification...'));

    if (!supabase) {
        console.error(chalk.red('[ERROR] Supabase client not initialized. Check .env'));
        process.exit(1);
    }

    // 1. Initialize Service & Realtime
    console.log(chalk.yellow('[1] Initializing Service...'));
    await governanceService.loadProposals();

    // 2. Setup Listener
    let updateReceived = false;
    const unsubscribe = governanceService.subscribe((proposals) => {
        // Check if our specific test proposal exists
        const testProp = proposals.find(p => p.title === 'Realtime Injection Test');
        if (testProp) {
            console.log(chalk.green(`[SUCCESS] Received Realtime Update! Found proposal: ${testProp.id}`));
            updateReceived = true;
        }
    });

    // 3. Simulate External Insertion (Direct via Supabase Client)
    console.log(chalk.yellow('[2] Simulating External DB Insertion...'));
    const { error } = await supabase.from('governance_proposals').insert({
        creator_id: 'external_tester',
        title: 'Realtime Injection Test',
        description: 'This proposal was inserted directly into DB to test realtime sync.',
        category: 'TECHNICAL',
        votes_for: 0,
        votes_against: 0,
        quorum: 100,
        status: 'ACTIVE',
        impact_score: 50
    });

    if (error) {
        console.error(chalk.red('[ERROR] Failed to insert test proposal:'), error);
        process.exit(1);
    }

    // 4. Wait for Realtime Event
    console.log(chalk.yellow('[3] Waiting for Realtime Sync (10s timeout)...'));

    // Wait loop
    let waited = 0;
    while (!updateReceived && waited < 10000) {
        await new Promise(r => setTimeout(r, 1000));
        waited += 1000;
        process.stdout.write('.');
    }
    console.log('');

    if (updateReceived) {
        console.log(chalk.green.bold('\n[PASS] Realtime Governance Verified!'));
    } else {
        console.error(chalk.red.bold('\n[FAIL] Timeout waiting for realtime update.'));
    }

    unsubscribe();
    process.exit(updateReceived ? 0 : 1);
}

testRealtimeGovernance().catch(err => {
    console.error(chalk.red('Test Failed with Error:'), err);
    process.exit(1);
});
