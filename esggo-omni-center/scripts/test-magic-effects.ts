import { getOmniCore } from '@core/omni-core';
import {
  ChaosHealing,
  TemporalRift,
  CellularFission,
  ProphetMatrix,
  OmniscientHive,
  MartialLaw,
  UniversalMemory,
  TaiChiResonance,
  OmniConvergence,
} from '../core/types/twelve-omni';

async function testMagicEffects() {
  console.log('=== 9大奇效組合測試 ===');
  const core = getOmniCore();

  console.log('[ChaosHealing] 测试自愈模块');
  const healResult = await core.chaosHealing.triggerChaos({
    topic: 'test-topic',
    payload: { test: 'data' }
  });
  console.log('Chaos Healing Result:', healResult);

  console.log('[TemporalRift] 时空裂缝激活');
  const riftStatus = await core.temporalRift.openRift({
    startTime: Date.now() - 1000,
    endTime: Date.now()
  });
  console.log('Rift Session Created:', 'sessionId: ' + riftStatus['sessionId']);

  console.log('[CellularFission] 细胞分裂系统');
  const fissionResult = await core.cellularFission.triggerFission('agent-123', 'test-reason');
  console.log('Fission Result:', fissionResult);

  console.log('[ProphetMatrix] 先知矩陣查询');
  const prophetInsight = await core.prophetMatrix.predictIntent('test-stub');
  console.log('Prophet Insight:', prophetInsight);

  console.log('[OmniscientHive] 全知蜂巢数据同步');
  await core.omniscientHive.contribute('key-test', { test: 'data' }, 'agent-123');
  const shared = await core.omniscientHive.getSharedKnowledge('key-test');
  console.log('Shared Knowledge Sample:', shared);

  console.log('[MartialLaw] 武装戒严状态');
  await core.martialLaw.activate('test-reason');
  console.log('Martial Law Activated');

  console.log('[UniversalMemory] 全面记忆查询');
  // 这里我们使用创建的内存存储
  const sample = await core.universalMemory.personalizedSearch('test', 'user-1');
  console.log('Memory Search Sample Count:', sample.length);

  console.log('[TaiChiResonance] 太极共振调整');
  const resonanceLevel = await core.taiChiResonance.resonateDecision({
    intent: 'test-intent',
    options: ['option-a', 'option-b']
  });
  console.log('Resonance Decision:', resonanceLevel);

  console.log('[OmniConvergence] 万法归宗整合');
  const snapshot = await core.omniConvergence.fullSnapshot();
  console.log('Convergence Snapshot:', snapshot);
  const health = await core.omniConvergence.fullHealth();
  console.log('Convergence Health:', health);
  const synergy = await core.omniConvergence.synergize();
  console.log('Convergence Synergy:', synergy);

  console.log('\n=== 所有奇效组合测试完成 ===');
}

testMagicEffects().catch(err => console.error('Error:', err));