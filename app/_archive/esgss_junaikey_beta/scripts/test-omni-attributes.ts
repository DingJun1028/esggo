import { OmniAgent } from '../src/0-core/trinity/OmniAgent';
import { Agent } from '../src/types/agency';

async function testOmniAttributes() {
    console.log('🧪 Testing Omni Attributes Refactor (v10.5)...\n');

    const testAgentData: Agent = {
        id: 'test-agent-1',
        name: 'Test Mentor',
        role: 'ESG Advisor',
        level: 5,
        agent_status: 'ACTIVE',
        description: 'A test agent for attribute verification.'
    };

    const agent = new OmniAgent(testAgentData);

    console.log('--- Agent Information ---');
    console.log(`Name: ${agent.asInfoOne().attrs.name}`);
    console.log(`Level: ${agent.asInfoOne().attrs.level}`);
    console.log(`UUID: ${agent.uuid}\n`);

    // 1. Verify Virtues (IMeritProfile10)
    console.log('--- 1. Virtues (IMeritProfile10) ---');
    console.log('Virtues:', agent.virtues);
    if (agent.virtues.str === 10 && agent.virtues.int === 10 && agent.virtues.benevolence === 50) {
        console.log('✅ Virtues initialized correctly.\n');
    } else {
        console.error('❌ Virtues initialization FAILED.\n');
    }

    // 2. Verify RPG Stats
    console.log('--- 2. RPG Stats ---');
    console.log('RPG Stats:', agent.rpgStats);
    if (agent.rpgStats.int === 10 && agent.rpgStats.str === 10) {
        console.log('✅ RPG Stats initialized correctly.\n');
    } else {
        console.error('❌ RPG Stats initialization FAILED.\n');
    }

    // 3. Verify Vitals
    console.log('--- 3. Vitals ---');
    console.log('Vitals:', agent.vitals);
    if (agent.vitals.hp === 150 && agent.vitals.maxHp === 150) {
        console.log('✅ Vitals initialized correctly.\n');
    } else {
        console.error('❌ Vitals initialization FAILED.\n');
    }

    // 4. Verify ESG Attributes
    console.log('--- 4. ESG Attributes ---');
    console.log('ESG:', agent.esg);
    if (agent.esg.environmental === 50 && agent.esg.social === 50) {
        console.log('✅ ESG Attributes initialized correctly.\n');
    } else {
        console.error('❌ ESG Attributes initialization FAILED.\n');
    }

    // 5. Verify Omni Attributes
    console.log('--- 5. Omni Attributes ---');
    console.log('Omni Attrs:', agent.omniAttrs);
    if (agent.omniAttrs.resonance === 1.0 && agent.omniAttrs.integrity === 100) {
        console.log('✅ Omni Attributes initialized correctly.\n');
    } else {
        console.error('❌ Omni Attributes initialization FAILED.\n');
    }

    // 6. Verify Crystallization (toComponentCore)
    console.log('--- 6. Crystallization (toComponentCore) ---');
    const core = agent.toComponentCore('Test crystallization');
    console.log('infoCore attributes:');
    console.log('- rpgStats:', core.infoCore.rpgStats);
    console.log('- vitals:', core.infoCore.vitals);
    console.log('- esg:', core.infoCore.esg);
    console.log('- omniAttrs:', core.infoCore.omniAttrs);

    if (core.infoCore.rpgStats && core.infoCore.vitals && core.infoCore.esg && core.infoCore.omniAttrs) {
        console.log('\n✅ infoCore successfully captured all attribute systems.\n');
    } else {
        console.error('\n❌ infoCore MISSING attribute systems.\n');
    }

    console.log('🚀 Attribute Refactor Verification Complete.');
}

testOmniAttributes().catch(err => {
    console.error('Test FAILED with error:', err);
    process.exit(1);
});
