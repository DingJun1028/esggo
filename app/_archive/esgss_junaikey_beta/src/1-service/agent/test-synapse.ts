import { CrystalTool } from './tools/CrystalTool';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { omni } from '../../0-core/trinity';

async function verifySynapse() {
  omniLogger.info(LogCategory.SYSTEM, '[test-synapse] 🔗 [Synapse] Verifying Agent-Crystal Connection...\n');

  const agentTool = new CrystalTool();
  const MOCK_AGENT_ID = 'Gemini-Flash-007';

  // 1. Setup: Seed the Crystal with some knowledge
  omniLogger.info(LogCategory.SYSTEM, '[test-synapse] 1. Seeding Crystal with knowledge...');
  await omni.createInfoOne('AncientWisdom', {
    value: 'Everything is connected.',
    trustworthy: true,
  });

  // 2. Test READ (Query)
  omniLogger.info(LogCategory.SYSTEM, '[test-synapse] \n2. Testing Agent Query (READ)...');
  const results = await agentTool.queryKnowledge('AncientWisdom');

  if (results.length > 0) {
    omniLogger.info(LogCategory.SYSTEM, '[test-synapse]    ✅ Query Successful!');
    omniLogger.info(LogCategory.SYSTEM, '[test-synapse]    Retrieved:', results[0].attrs);
  } else {
    omniLogger.error(LogCategory.SYSTEM, '[test-synapse]    ❌ Query Failed: No results found.');
  }

  // 3. Test WRITE (Propose)
  omniLogger.info(LogCategory.SYSTEM, '[test-synapse] \n3. Testing Agent Proposal (WRITE)...');
  const proposalId = await agentTool.proposeInsight(
    'MarketTrend',
    { direction: 'UP', confidence: 0.95 },
    MOCK_AGENT_ID
  );

  if (proposalId) {
    omniLogger.info(LogCategory.SYSTEM, '[test-synapse]    ✅ Proposal Submitted Successfully!');
    omniLogger.info(LogCategory.SYSTEM, '[test-synapse] Info', { data: `   Proposal ID: ${proposalId}` });

    // Verify it was actually stored
    omniLogger.info(LogCategory.SYSTEM, '[test-synapse]    Verifying storage...');
    const stored = await agentTool.queryKnowledge('AgentProposal');
    const myProposal = stored.find(p => p.attrs.uuid === proposalId);

    if (myProposal) {
      omniLogger.info(LogCategory.SYSTEM, '[test-synapse]    ✅ Proposal confirmed in Crystal Storage.');
    } else {
      omniLogger.error(LogCategory.SYSTEM, '[test-synapse]    ❌ Proposal not found in storage.');
    }
  } else {
    omniLogger.error(LogCategory.SYSTEM, '[test-synapse]    ❌ Proposal Failed.');
  }

  omniLogger.info(LogCategory.SYSTEM, '[test-synapse] \n🔗 [Synapse] Verification Protocol Complete.');
}

if (require.main === module) {
  verifySynapse().catch(console.error);
}
