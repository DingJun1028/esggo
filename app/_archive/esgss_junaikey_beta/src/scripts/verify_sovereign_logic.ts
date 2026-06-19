/**
 * ?зк OmniSovereign Logic Verification
 * 
 * Tests the OmniCultivation and OmniConstruction sovereign flows.
 */

import { omniCultivation } from '../omni/core/OmniCultivation.ts';
import { omniConstruction } from '../omni/core/OmniConstruction.ts';
import { omniComprehense } from '../omni/core/OmniComprehense.ts';

async function verifySovereign() {
    console.log('--- ?зк OmniSovereign Logic Verification Start ---');

    const targetId = 'test_agent_alpha';
    const siteId = 'test_site_gamma';

    // 1. Verify Cultivation
    console.log('\n[1] Testing OmniCultivation:');

    console.log('   - Nourishing...');
    let target = await omniCultivation.nourish(targetId, 0.4);
    console.log(`     Progress: ${target.growth.toFixed(2)}, Entropy: ${target.entropy.toFixed(2)}`);

    console.log('   - Pruning...');
    target = await omniCultivation.prune(targetId, 0.5);
    console.log(`     Progress: ${target.growth.toFixed(2)}, Entropy: ${target.entropy.toFixed(2)}`);

    console.log('   - Nourishing again to mature...');
    await omniCultivation.nourish(targetId, 0.6);

    console.log('   - Crystallizing...');
    const crystal = await omniCultivation.crystallize(targetId);
    console.log(`     Result: ${crystal.assetId} (${crystal.type})`);
    console.log(`     Seal: ${crystal.seal}`);


    // 2. Verify Construction
    console.log('\n[2] Testing OmniConstruction:');

    console.log('   - Assembling structure...');
    let site = await omniConstruction.assemble(siteId, 'SovereignPortal_v1', 0.5);
    console.log(`     Progress: ${site.progress.toFixed(2)}, Integrity: ${site.integrity.toFixed(2)}`);

    console.log('   - Inspecting...');
    site = await omniConstruction.inspect(siteId, 0.8);
    console.log(`     Integrity: ${site.integrity.toFixed(2)}`);

    console.log('   - Assembling final components...');
    site = await omniConstruction.assemble(siteId, 'TrustGateway', 0.5);

    console.log('   - Finalizing...');
    const result = await omniConstruction.finalize(siteId);
    console.log(`     Result: ${result.assetId} (${result.type})`);
    console.log(`     Seal: ${result.seal}`);

    // 3. Verify Comprehense
    console.log('\n[3] Testing OmniComprehense:');
    const topicId = 'ESG_Essence';

    console.log('   - Synthesizing concepts...');
    let comp = await omniComprehense.synthesize(topicId, 0.4);
    console.log(`     Depth: ${(comp.depth * 100).toFixed(2)}%`);

    console.log('   - Abstracting principles...');
    comp = await omniComprehense.abstract(topicId, 0.5);
    console.log(`     Abstraction Level: ${(comp.abstractionLevel * 100).toFixed(2)}%`);

    console.log('   - Deepening to transcendence...');
    await omniComprehense.synthesize(topicId, 0.5);
    await omniComprehense.abstract(topicId, 0.4);

    const finalInsight = await omniComprehense.deepen(topicId);
    console.log(`     Status: ${finalInsight.status}`);
    console.log(`     Insight: ${finalInsight.insight}`);

    console.log('\n--- ??OmniSovereign Logic Verification Complete ---');
}

verifySovereign().catch(err => {
    console.error('??Verification failed:', err);
    process.exit(1);
});
