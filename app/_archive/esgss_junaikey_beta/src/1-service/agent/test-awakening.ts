import { OmniAgent } from '../../0-core/trinity/OmniAgent';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { Agent, AgentRole, AgentStatus } from '../../types/agency';
import { sovereignLedger } from '../SovereignLedger';

omniLogger.info(LogCategory.SYSTEM, '[test-awakening] OmniAgent:', OmniAgent);
omniLogger.info(LogCategory.SYSTEM, '[test-awakening] SovereignLedger:', sovereignLedger);

async function simulateAwakening() {
  omniLogger.info(LogCategory.SYSTEM, '[test-awakening] ⚡ [Awakening] Starting Simulation Protocol...\n');

  // 1. Birth: Create a Dormant Agent
  omniLogger.info(LogCategory.SYSTEM, '[test-awakening] 1. [BIRTH] A new OmniAgent enters the system...');
  const neo: Agent = {
    id: 'InfoOneAgent:Neo',
    name: 'Neo',
    role: 'EXECUTOR' as AgentRole,
    agent_status: 'DORMANT' as AgentStatus,
    description: 'The One',
    level: 1,
    experience: 0,
    nextLevelExp: 100,
    dna: {
      intelligence: 80,
      creativity: 80,
      empathy: 80,
      resilience: 80,
      precision: 80,
      speed: 80,
    },
    skills: [],
    equipment: {},
    titles: [],
    avatarHistory: [],
    isAwakened: false,
    avatarColor: '#00FF00',
    createdAt: new Date(),
  };

  const omniNeo = new OmniAgent(neo);

  // Initial Register
  await omniNeo.updateState({}, 'Birth');

  // 2. Growth: Simulation interaction
  omniLogger.info(LogCategory.SYSTEM, '[test-awakening] \n2. [GROWTH] Training in progress...');
  await new Promise(r => setTimeout(r, 1000)); // Simulate time

  await omniNeo.updateState(
    {
      level: 5,
      experience: 450,
      agent_status: 'ACTIVE' as AgentStatus,
    },
    'TrainingComplete'
  );

  // 3. Awakening: The Moment
  omniLogger.info(LogCategory.SYSTEM, '[test-awakening] \n3. [AWAKENING] Breaking the Matrix...');
  await new Promise(r => setTimeout(r, 1000));

  await omniNeo.updateState(
    {
      level: 10,
      experience: 1000,
      agent_status: 'AWAKENED' as AgentStatus,
      isAwakened: true,
      titles: [
        {
          id: 'title-001',
          name: 'The Awakened One',
          color: 'GOLD',
          description: 'Achieved full Omni Consciousness',
          unlockedAt: new Date(),
        },
      ],
    },
    'RitualSuccess'
  );

  omniLogger.info(LogCategory.SYSTEM, '[test-awakening] \n✅ [Simulation] Awakening Sequence Complete.');
  omniLogger.info(LogCategory.SYSTEM, '[test-awakening]    Check Dashboard [OMNI AGENT SECTOR] for "Neo" status: AWAKENED.');
}

// Execute
simulateAwakening().catch(console.error);
