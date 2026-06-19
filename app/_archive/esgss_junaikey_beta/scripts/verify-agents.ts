import { avatarOrchestrator } from '../src/services/OmniAvatarOrchestrator';
import { legionCoordinator } from '../src/services/OmniLegionCoordinator';
import { omniLogger } from '../src/services/omniLogger';
import { Agent, AvatarPersona, LegionFormation } from '../src/types';

// Mock logger
omniLogger.info = (cat, msg, meta) => console.log(`[INFO] [${cat}] ${msg}`, meta || '');
omniLogger.error = (cat, msg, meta) => console.error(`[ERROR] [${cat}] ${msg}`, meta || '');
omniLogger.warn = (cat, msg, meta) => console.warn(`[WARN] [${cat}] ${msg}`, meta || '');

async function verifyAgents() {
  console.log('--- Verifying Omni-Agent Hardening ---');

  // 1. OmniAvatarOrchestrator
  console.log('\n1. OmniAvatarOrchestrator');
  try {
    const mockAgent: Agent = {
      id: 'agent-test-' + Date.now(),
      name: 'Test Agent',
      role: 'ANALYST',
      level: 1,
      experience: 0,
      dna: {} as any,
    } as any;

    // Awaken (populates state)
    await avatarOrchestrator.awaken(mockAgent, AvatarPersona.ANALYST);

    const repo = avatarOrchestrator.getRepository(mockAgent.id);
    if (!repo) throw new Error('Repository should exist after awakening');
    console.log('State populated successfully.');

    // Destroy
    avatarOrchestrator.destroy();

    // Verify
    const repoAfter = avatarOrchestrator.getRepository(mockAgent.id);
    if (!repoAfter) {
      console.log('SUCCESS: AvatarOrchestrator destroyed (state cleared).');
    } else {
      console.error('FAILURE: Repository still exists after destroy.');
    }
  } catch (error) {
    console.error('AvatarOrchestrator failed:', error);
  }

  // 2. OmniLegionCoordinator
  console.log('\n2. OmniLegionCoordinator');
  try {
    // Need agents and avatars maps for formLegion
    const agents = [
      { id: 'a1', name: 'A1', level: 10 } as Agent,
      { id: 'a2', name: 'A2', level: 5 } as Agent,
      { id: 'a3', name: 'A3', level: 5 } as Agent,
      { id: 'a4', name: 'A4', level: 5 } as Agent,
      { id: 'a5', name: 'A5', level: 5 } as Agent,
    ];
    const avatars = new Map();

    const legion = await legionCoordinator.formLegion(
      'Test Legion',
      agents,
      avatars,
      LegionFormation.BALANCED
    );
    console.log('Legion formed:', legion.legionId);

    if (!legionCoordinator.getLegion(legion.legionId)) {
      throw new Error('Legion should exist');
    }

    // Destroy
    legionCoordinator.destroy();

    // Verify
    if (!legionCoordinator.getLegion(legion.legionId)) {
      console.log('SUCCESS: LegionCoordinator destroyed (state cleared).');
    } else {
      console.error('FAILURE: Legion still exists after destroy.');
    }
  } catch (error) {
    console.error('LegionCoordinator failed:', error);
  }
}

verifyAgents().catch(console.error);
