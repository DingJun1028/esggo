import { neuralGridService } from '../src/services/NeuralGridService';
import { consciousnessSynthesisEngine } from '../src/services/ConsciousnessSynthesisEngine';
import chalk from 'chalk';

async function testPhase23() {
    console.log(chalk.cyan('\n[NEURAL] PHASE 23: GLOBAL NEURAL GRID & REAL-TIME SYNTHESIS VERIFICATION\n'));

    // 1. Initial State Check
    const initialGrid = neuralGridService.getGridData();
    console.log(chalk.blue('Step 1: Checking Neural Grid Initial State...'));
    console.log(`- Active Nodes: ${initialGrid.nodes.length}`);
    console.log(`- Initial Coherence: ${(initialGrid.state.coherence * 100).toFixed(1)}%`);

    // 2. Trigger Resonance
    console.log(chalk.blue('\nStep 2: Triggering Node Resonance...'));
    const firstNodeId = initialGrid.nodes[0]?.id;
    if (firstNodeId) {
        neuralGridService.triggerResonance(firstNodeId);
        const updatedGrid = neuralGridService.getGridData();
        console.log(`- Resonance Triggered on Node: ${firstNodeId}`);
        console.log(`- Updated Coherence: ${(updatedGrid.state.coherence * 100).toFixed(1)}%`);
    }

    // 3. Consciousness Synthesis Engine
    console.log(chalk.blue('\nStep 3: Monitoring Consciousness Synthesis Engine...'));
    const urs = consciousnessSynthesisEngine.getURS();
    console.log(`- Perception Level: ${urs.perceptionLevel}`);
    console.log(`- Ethical Integrity: ${(urs.ethicalIntegrity * 100).toFixed(1)}%`);
    console.log(`- Active Insights: ${urs.activeInsights.length}`);

    // 4. Subscription Test
    console.log(chalk.blue('\nStep 4: Verifying Service Subscriptions...'));
    let updateReceived = false;
    const unsub = consciousnessSynthesisEngine.subscribe((state) => {
        updateReceived = true;
        console.log(`- [SUBSCRIPTION] State Update Received. Resonance: ${(state.globalResonance * 100).toFixed(1)}%`);
    });

    // Wait for internal updates (every 2s in services)
    console.log(chalk.yellow('Waiting for real-time update sync (4s)...'));
    await new Promise(resolve => setTimeout(resolve, 4000));

    unsub();

    if (updateReceived) {
        console.log(chalk.green('\n[DONE] Phase 23 Verification Complete: Neural Grid & Synthesis Engine are operational.'));
    } else {
        console.log(chalk.red('\n[FAILED] Phase 23 Verification Failed: No state updates received.'));
        process.exit(1);
    }
}

testPhase23().catch(err => {
    console.error(chalk.red('Verification Error:'), err);
    process.exit(1);
});
