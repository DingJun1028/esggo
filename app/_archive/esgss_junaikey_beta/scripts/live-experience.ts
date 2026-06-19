/**
 * 🌌 Omni System: Live Experience Ritual
 * --------------------------------------------------
 * This script demonstrates the system's core activation by:
 * 1. Initializing the Omni Core.
 * 2. Executing the Seraphim Advisor skill.
 * 3. Verifying the 3+1 Protocol evidence.
 */

import { omniLogger, LogCategory } from '../src/omni/infrastructure/logging/OmniLogger';
import { SkillExecutionEngine } from '../src/services/SkillExecutionEngine';
import { IComponentCore } from '../src/0-domain/contracts/IComponentCore';

class ExperiencerAgent implements IComponentCore {
  public uuid: string;
  public version: string;
  public timestamp: number;
  public status: 'ACTIVE';
  public evidence: any;

  constructor() {
    this.uuid = `Agent-${Date.now()}`;
    this.version = '1.0.0-LIVE';
    this.timestamp = Date.now();
    this.status = 'ACTIVE';
    this.evidence = {};
  }
}

async function runLiveExperience() {
  console.log('\n--- 🌌 OMNI SYSTEM INITIALIZING ---\n');

  const agent = new ExperiencerAgent();
  omniLogger.info(LogCategory.SYSTEM, 'Experiencer Agent Awakened', {
    agent_id: agent.uuid,
    status: 'READY',
  });

  console.log('🔮 [INTENT] Requesting AI Consultation: Seraphim Advisor...');

  try {
    const engine = SkillExecutionEngine.getInstance();
    const { result, updatedCore } = await engine.executeSkill(
      's_seraphim_advisor',
      agent,
      { context: 'Automated Live Experience' },
      ['s_seraphim_advisor'] // Simulate unlocked
    );

    console.log('\n✨ [RESULT] Seraphim Advisor Strategy Received:');
    console.log(JSON.stringify(result, null, 2));

    console.log('\n🛡️ [VERIFICATION] Checking 3+1 Evidence Chain:');
    const latestEvidence = updatedCore.evidence;
    console.log(`- Source: ${latestEvidence.traceable?.source_origin || 'N/A'}`);
    console.log(`- Hash Lock: ${latestEvidence.trustworthy?.hash_lock || 'N/A'}`);
    console.log(`- Verified At: ${latestEvidence.verified_at ? new Date(latestEvidence.verified_at).toISOString() : 'N/A'}`);

    omniLogger.info(LogCategory.AI, 'Live Experience Successfully Sealed.', {
      hash_lock: latestEvidence.trustworthy?.hash_lock,
    });

    console.log('\n--- ✅ SYSTEM LIVE EXPERIENCE COMPLETE ---\n');
  } catch (error) {
    omniLogger.error(LogCategory.SYSTEM, 'Live Experience Failed', { error });
  }
}

runLiveExperience();
