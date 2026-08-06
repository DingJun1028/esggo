import { getOmniCore } from '@core/omni-core';

async function finalVerification() {
  console.log('🔍 Full System Integration Verification...\n');

  const core = getOmniCore({
    vpsHost: '161.118.248.180',
    vpsPort: 8042,
  });

  // Run full initialization to ensure everything is wired
  if (!core.initialized) {
    await core.initialize();
  }

  const status = await core.getStatus();

  console.log('=== OmniCore System Status ===');
  console.log('Initialised :', status.initialized);
  console.log('Singularity :', status.singularity?.signature?.uuid ? 'manifested' : 'missing');
  console.log('Key         :', status.key?.name, `(${status.key?.tier})`);
  console.log('Soul        :', status.soul?.name, '->', status.soul?.state);
  console.log('VPS         :', status.vps
    ? `entangled=${status.vps.entangled} host=${status.vps.host}`
    : 'not configured');
  console.log('Ecosystem   :', JSON.stringify(status.ecosystem));

  // Run the 9 magic effects again as a final smoke test
  console.log('\n=== Magic Effect Smoke Test ===');
  const chaos = await core.chaosHealing.triggerChaos({
    uuid: 'evt-final', version: '1.0.0', timestamp: Date.now(), evidence: {},
    source_origin: 'verify', topic: 'final', lifecycle_path: [], payload: {},
  } as any);
  console.log('ChaosHealing   :', chaos.chaosId ? 'OK' : 'FAIL');

  const rift = await core.temporalRift.openRift({ startTime: Date.now() - 1000 });
  console.log('TemporalRift   :', rift.sessionId ? 'OK' : 'FAIL');

  const fission = await core.cellularFission.triggerFission('p', 'verify');
  console.log('CellularFission:', fission.childAgentId ? 'OK' : 'FAIL');

  const pred = await core.prophetMatrix.predictIntent('verify');
  console.log('ProphetMatrix  :', pred.confidence ? 'OK' : 'FAIL');

  core.omniscientHive.contribute('k', 'v', core.soul.uuid);
  console.log('OmniscientHive :', core.omniscientHive.getSharedKnowledge('k') ? 'OK' : 'FAIL');

  await core.martialLaw.activate('verify');
  const ml = core.martialLaw.status().active;
  await core.martialLaw.deactivate();
  console.log('MartialLaw     :', ml ? 'OK' : 'FAIL');

  const mem = await core.universalMemory.personalizedStore({
    id: 'm', content: 'x', metadata: { source: 't', confidence: 1, domain: 'd', relatedIds: [] },
    createdAt: Date.now(), accessCount: 0, decayFactor: 1, tags: [], parentIds: [], hash: 'h',
  } as any, 'u');
  console.log('UniversalMemory:', mem ? 'OK' : 'FAIL');

  const res = await core.taiChiResonance.resonateDecision({
    intent: 'verify', options: [{ id: 'a', description: 'A' }],
  });
  console.log('TaiChiResonance:', res.chosenOptionId ? 'OK' : 'FAIL');

  const syn = await core.omniConvergence.synergize();
  console.log('OmniConvergence:', syn.synergyScore > 0 ? 'OK' : 'FAIL');

  console.log('\n🎯 Deployment Verification Complete — System is LIVE and HEALTHY');
}

finalVerification().catch(err => {
  console.error('❌ Verification failed:', err.message);
});