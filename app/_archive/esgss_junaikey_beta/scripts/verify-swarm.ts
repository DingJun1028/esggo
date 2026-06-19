import { agentService } from '../src/services/agentService';
import { swarmOrchestrator } from '../src/core/swarm/SwarmOrchestrator';

async function verifySwarm() {
  console.log('🐝 Starting Swarm Intelligence Verification...');

  // 1. Initial State
  const initialStats = swarmOrchestrator.getSwarmStats();
  console.log(
    `[INIT] Swarm Stats: Agents=${initialStats.activeAgents}, Links=${initialStats.neuralLinks}`
  );

  // 2. Create a Test Agent
  console.log('\n[STEP 1] Creating "Test Unit Alpha"...');
  const newAgent = await agentService.createAgent({
    name: 'Test Unit Alpha',
    role: 'ANALYST' as any,
    status: 'TRAINING',
    description: 'Swarm connectivity tester.',
    dna: {
      intelligence: 50,
      creativity: 50,
      empathy: 50,
      resilience: 50,
      precision: 50,
      speed: 50,
    },
    skills: [],
    avatarHistory: [],
    avatarColor: '#888888',
    equipment: {},
    titles: [],
    isAwakened: false,
  });
  console.log(`   > Created Agent: ${newAgent.id}`);

  // 3. Verify NOT in Swarm yet (not awakened)
  let stats = swarmOrchestrator.getSwarmStats();
  if (stats.activeAgents === initialStats.activeAgents) {
    console.log('   ✅ Agent is not in Swarm yet (Status: TRAINING)');
  } else {
    console.error('   ❌ Error: Agent prematurely joined Swarm!');
  }

  // 4. Awaken Agent (Trigger Registration)
  console.log('\n[STEP 2] Awakening Agent...');
  await agentService.awakeAgent(newAgent.id, 'analyst' as any);

  // 5. Verify Swarm Registration
  stats = swarmOrchestrator.getSwarmStats();
  console.log(`[POST-AWAKENING] Swarm Stats: Agents=${stats.activeAgents}`);

  if (stats.activeAgents > initialStats.activeAgents) {
    console.log('   ✅ Agent successfully auto-registered with SwarmOrchestrator!');
  } else {
    console.error('   ❌ Error: Agent failed to register with Swarm.');
  }

  // 6. Test Broadcast
  console.log('\n[STEP 3] Testing Neural Broadcast...');
  await swarmOrchestrator.broadcastDirective('ANALYST', 'Optimize Verification Protocols');
  console.log('   ✅ Broadcast sent without error.');

  console.log('\n🐝 Swarm Verification Complete.');
}

verifySwarm().catch(console.error);
