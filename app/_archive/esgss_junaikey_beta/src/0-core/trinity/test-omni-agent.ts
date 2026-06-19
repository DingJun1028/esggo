import { OmniAgent } from './OmniAgent';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { Agent, AgentRole, AgentStatus } from '../../types/agency';
import { sovereignLedger } from '../../1-service/SovereignLedger';

async function verifyOmniAgent() {
  try {
    omniLogger.info(LogCategory.SYSTEM, '[test-omni-agent] 🤖 [OmniAgent] Starting Verification Protocol...');

    // 0. MOCK Agent Data
    const mockAgentData: Agent = {
      id: 'agent-007',
      name: 'James Bond',
      role: 'ANALYST' as AgentRole,
      agent_status: 'ACTIVE' as AgentStatus,
      description: 'Top secret agent',
      level: 1,
      experience: 0,
      nextLevelExp: 100,
      dna: {
        intelligence: 90,
        creativity: 80,
        empathy: 50,
        resilience: 90,
        precision: 95,
        speed: 85,
      },
      skills: [],
      equipment: {},
      titles: [],
      avatarHistory: [],
      isAwakened: false,
      avatarColor: '#000000',
      createdAt: new Date(),
    };

    // 1. Initialize OmniAgent
    omniLogger.info(LogCategory.SYSTEM, '[test-omni-agent] 1. Initializing OmniAgent...');
    const myAgent = new OmniAgent(mockAgentData);
    omniLogger.info(LogCategory.SYSTEM, '[test-omni-agent]    ✅ Created Agent: ' + myAgent.asInfoOne().attrs.name);

    // 2. Evolve Agent (State Update -> Ledger)
    omniLogger.info(LogCategory.SYSTEM, '[test-omni-agent] 2. Evolving Agent (Level Up)...');
    await myAgent.updateState(
      {
        level: 2,
        experience: 150,
      },
      'MissionComplete'
    );
    omniLogger.info(LogCategory.SYSTEM, '[test-omni-agent]    ✅ Evolve Completed');

    // 3. Verify Ledger
    omniLogger.info(LogCategory.SYSTEM, '[test-omni-agent] 3. Verifying Sovereign Ledger...');
    const ledger = sovereignLedger.getLedger();
    const agentEntry = ledger.find(
      e => e.label === 'SovereignImpact' || (e.data as any)?.name === 'James Bond'
    );

    if (agentEntry) {
      omniLogger.info(LogCategory.SYSTEM, '[test-omni-agent]    ✅ Ledger Verification Passed!');
      omniLogger.info(LogCategory.SYSTEM, '[test-omni-agent]    Level in Ledger: ' + (agentEntry.data as any).level);
    } else {
      omniLogger.error(LogCategory.SYSTEM, '[test-omni-agent]    ❌ Ledger Verification Failed: Agent not found');
      throw new Error('Ledger verify failed');
    }

    // 4. Verify Trinity Mapping
    omniLogger.info(LogCategory.SYSTEM, '[test-omni-agent] 4. Verifying Trinity Mapping...');
    const trinity = myAgent.toTrinity();
    if (trinity.uuid === myAgent.uuid && trinity.component && trinity.knowledge) {
      omniLogger.info(LogCategory.SYSTEM, '[test-omni-agent]    ✅ Trinity Mapping Passed!');
    } else {
      omniLogger.error(LogCategory.SYSTEM, '[test-omni-agent]    ❌ Trinity Mapping Failed');
      throw new Error('Trinity map failed');
    }

    omniLogger.info(LogCategory.SYSTEM, '\n🎉 OmniAgent Verification Successful!');
  } catch (error: any) {
    console.error('\n❌ TEST CRASHED:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the verification
verifyOmniAgent().catch((err) => {
  console.error('Fatal Test Error:', err);
  process.exit(1);
});
