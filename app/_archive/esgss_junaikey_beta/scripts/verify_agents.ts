import { agentService } from '../src/services/agentService';
import { omniLogger } from '../src/services/omniLogger';

async function verifyAgentSystem() {
  console.log('🧪 Starting Agent System Verification...');

  // 1. Initial Count
  const initialAgents = await agentService.getAgents();
  console.log(`Initial Agent Count: ${initialAgents.length}`);

  // 2. Create Agent
  console.log('Creating Test Agent...');
  const newAgent = await agentService.createAgent({
    name: 'Obelisk-Alpha',
    role: 'STRATEGIST',
    status: 'ACTIVE',
    description: 'Verification Unit',
    dna: {
      intelligence: 90,
      creativity: 50,
      empathy: 50,
      resilience: 90,
      precision: 100,
      speed: 80,
    },
    skills: [],
    equipment: {},
    titles: [],
    isAwakened: false,
    avatarHistory: [],
    avatarColor: '#FFD700',
  });
  console.log(`Agent Created: ${newAgent.name} (${newAgent.id})`);

  // 3. Verify Count Increase
  const updatedAgents = await agentService.getAgents();
  console.log(`Updated Agent Count: ${updatedAgents.length}`);

  if (updatedAgents.length === initialAgents.length + 1) {
    console.log('✅ Agent Count Verification Passed');
  } else {
    console.error('❌ Agent Count Verification Failed');
    process.exit(1);
  }

  // 4. Verify 3 Yes 1 No Logic Data Points
  if (newAgent.id && newAgent.createdAt && newAgent.level === 1) {
    console.log('✅ 3-Yes-1-No Data Integrity Passed');
  } else {
    console.error('❌ Data Integrity Failed');
  }

  console.log('✨ Verification Complete');
}

verifyAgentSystem().catch(console.error);
