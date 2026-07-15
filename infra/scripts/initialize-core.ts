import { getOmniCore } from '@core/omni-core';
import { createOmniSeed, plantOmniSeed } from '@core/sonnar/omni-seed';

async function initializeSystem() {
  console.log('🚀 Starting OmniCore Initialization...');
  
  // 1. Create OmniCore with VPS config and summon config
  const core = getOmniCore({
    vpsHost: '161.118.248.180',
    vpsPort: 8042,
    summon: true, // enable OA-Summon ritual
  });

  // 2. Verify VPS connection
  const vpsHealth = await core.checkVPSHealth();
  console.log('[VPS] Health:', vpsHealth.system);

  // 3. Check VPS registration via quantum entanglement
  if (core.vpsAgent?.entanglementId) {
    console.log('[Quantum] Entanglement ID:', core.vpsAgent.entanglementId);
  }

  // 4. Run OmniSoul awakening sequence
  console.log('[OmniSoul] Current state:', core.soul.state);
  if (core.soul.state === 'aligned') {
    console.log('[OmniSoul] Attempting advanced awakening to "transcendent"...');
    await core.soul.awaken('transcendent');
    console.log('✅ OmniSoul awakened to transcendent state');
  }

  // 5. Plant OmniSeed on the correct coordinate
  const seed = createOmniSeed({ evidence: { purpose: 'system_init' } });
  console.log('[OmniSeed] Created seed:', seed.uuid);
  
  // Plant seed at the core coordinate
  const planted = plantOmniSeed(seed, '#全知之眼');
  console.log('[OmniSeed] Planted seed at:', planted.coordinate);
  console.log('[OmniSeed] Status:', planted.status);

  // 6. Test a magic effect (ChaosHealing) for fun
  const healing = core.chaosHealing;
  const healResult = await healing.triggerChaos({
    topic: 'test-topic',
    payload: { test: 'data' }
  });
  console.log('[ChaosHealing] Test chaos injection:', healResult);

  console.log('🌟 OmniCore Initialization Complete! System is now LIVE 🌟');
}

initializeSystem().catch(err => {
  console.error('❌ Initialization failed:', err);
});