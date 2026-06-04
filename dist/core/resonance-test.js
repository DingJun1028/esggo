"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resonanceEngine_1 = require("./resonanceEngine");
async function test() {
    const engine = new resonanceEngine_1.ResonanceEngine();
    const card = {
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
//# sourceMappingURL=resonance-test.js.map