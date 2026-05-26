import { ResonanceEngine } from './resonanceEngine';
import { OmniCard } from '../../lib/core-types';

async function test() {
  const engine = new ResonanceEngine();
  const card: OmniCard = {
    uuid: 'test-uuid',
    version: '8.5.0-ooriginal',
    timestamp: Date.now(),
    evidence: []
  };
  
  const result = await engine.calculateResonance([card]);
  console.log('Resonance Result:', JSON.stringify(result, null, 2));
}

test().catch(console.error);