import { getOmniCore } from '@core/omni-core';

async function test9MagicEffects() {
  console.log('🧪 Testing 9 Magic Effects...\n');

  const core = getOmniCore({
    vpsHost: '161.118.248.180',
    vpsPort: 8042
  });

  console.log('[VPS] Entanglement ID:', core.vpsAgent?.entanglementId, '\n');

  // Helper to build a mock bus event
  const mockEvent = (topic: string) => ({
    uuid: `evt-${Date.now()}`,
    version: '1.0.0',
    timestamp: Date.now(),
    evidence: {},
    source_origin: 'test',
    topic,
    lifecycle_path: [{ stage: 'EMERGED' as const, timestamp: Date.now(), node: 'test' }],
    payload: { test: true },
  });

  // 1. ChaosHealing (混沌自癒)
  console.log('[1/9] ChaosHealing...');
  const chaosResult = await core.chaosHealing.triggerChaos(mockEvent('resilience') as any);
  console.log('   ✅ Chaos ID:', chaosResult?.chaosId);

  // 2. TemporalRift (時空裂縫)
  console.log('[2/9] TemporalRift...');
  const rift = await core.temporalRift.openRift({ startTime: Date.now() - 1000 });
  console.log('   ✅ Rift Session:', rift.sessionId);

  // 3. CellularFission (細胞分裂)
  console.log('[3/9] CellularFission...');
  const fission = await core.cellularFission.triggerFission('parent-agent', 'backpressure');
  console.log('   ✅ Child Agent:', fission.childAgentId);

  // 4. ProphetMatrix (先知矩陣)
  console.log('[4/9] ProphetMatrix...');
  const prediction = await core.prophetMatrix.predictIntent('user-intent');
  console.log('   ✅ Predicted Topics:', prediction.predictedTopics.join(', '));

  // 5. OmniscientHive (全知蜂巢)
  console.log('[5/9] OmniscientHive...');
  core.omniscientHive.contribute('key1', 'shared-value', core.soul.uuid);
  const knowledge = core.omniscientHive.getSharedKnowledge('key1');
  const decision = await core.omniscientHive.swarmDecision(['opt-a', 'opt-b']);
  console.log('   ✅ Shared Knowledge:', knowledge, '| Swarm Decision:', decision);

  // 6. MartialLaw (武裝戒嚴)
  console.log('[6/9] MartialLaw...');
  await core.martialLaw.activate('security-test');
  console.log('   ✅ Martial Law Active:', core.martialLaw.status().active);
  await core.martialLaw.deactivate();
  console.log('   ✅ Martial Law Deactivated:', !core.martialLaw.status().active);

  // 7. UniversalMemory (全面記憶)
  console.log('[7/9] UniversalMemory...');
  const memoryEntry = {
    id: `mem-${Date.now()}`,
    content: 'OmniCore test memory',
    metadata: { source: 'test', confidence: 0.9, domain: 'system', relatedIds: [] },
    createdAt: Date.now(),
    accessCount: 0,
    decayFactor: 1,
    tags: ['test', 'omnicore'],
    parentIds: [],
    hash: '0xTEST',
  };
  const memId = await core.universalMemory.personalizedStore(memoryEntry as any, 'test-user');
  const memories = await core.universalMemory.personalizedSearch('OmniCore', 'test-user');
  console.log('   ✅ Stored Memory ID:', memId, '| Found:', memories.length);

  // 8. TaiChiResonance (太極共振)
  console.log('[8/9] TaiChiResonance...');
  const resonance = await core.taiChiResonance.resonateDecision({
    intent: 'optimal-path',
    options: [
      { id: 'path-a', description: 'Path A' },
      { id: 'path-b', description: 'Path B' },
    ],
  });
  console.log('   ✅ Chosen Option:', resonance.chosenOptionId, '| Alignment:', resonance.soulAlignment.aligned);

  // 9. OmniConvergence (萬法歸宗)
  console.log('[9/9] OmniConvergence...');
  const synergy = await core.omniConvergence.synergize();
  console.log('   ✅ Synergy Score:', synergy.synergyScore.toFixed(3));

  console.log('\n🎉 All 9 magic effects executed successfully!\n');
}

test9MagicEffects().catch(err => {
  console.error('❌ Magic effect test failed:', err.message);
});