import { ResonanceEngine } from './resonanceEngine';
import { IComponentCore } from '../../lib/core-types';

async function test() {
  const engine = new ResonanceEngine();
  const card: IComponentCore = {
    uuid: 'test-uuid',
    version: '8.5.0-ooriginal',
    timestamp: Date.now(),
    evidence: [],
    formula: 'test',
    impact_metric: 'test',
    status: 'Trustworthy',
    hash_lock: 'test-lock'
  };
  
  const result = await engine.calculateResonance([card]);
  console.log('Resonance Result:', JSON.stringify(result, null, 2));
}

test().catch(console.error);