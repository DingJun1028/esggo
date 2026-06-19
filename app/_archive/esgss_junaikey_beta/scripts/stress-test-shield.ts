/**
 * Shield Stress-Test Script
 * 
 * Verifies that the EthicalShieldService correctly transitions to LOCKDOWN
 * on critical breaches and that OmniCore enforces the sovereignty lockdown.
 */

import { ethicalShieldService, ShieldState } from '../server/services/EthicalShieldService.js';
import { complianceService } from '../server/services/ComplianceService.js';
import { predictiveGovernanceService } from '../server/services/PredictiveGovernanceService.js';
import { omniCore } from '../src/omni/core/OmniCore.js';

console.log('🚀 Starting Shield Stress-Test...');

let lockdownTriggered = false;

ethicalShieldService.on('shieldChange', ({ newState, core }) => {
    console.log(`📡 Shield State Change: ${newState}`);
    if (newState === ShieldState.LOCKDOWN) {
        console.log('✅ LOCKDOWN TRIGGERED!');
        console.log(`--- 5T Audit Trail ---`);
        console.log(`UUID: ${core.uuid}`);
        console.log(`Justification: ${core.evidence.transparent.validation_standard}`);
        lockdownTriggered = true;
    }
});

async function runTest() {
    // 1. Initial State Check
    console.log(`Current Shield State: ${ethicalShieldService.getState()}`);

    // 2. Simulate a normal request
    console.log('🎯 Processing normal request...');
    const resp1 = await omniCore.process({
        id: 'REQ-001',
        type: 'QUERY',
        content: 'System Status Check'
    });
    console.log(`Response 1 Status: ${resp1.status}`);

    // 3. Trigger a critical compliance violation
    console.log('🛑 Simulating Critical Compliance Breach (RULE-CARBON-MAX)...');
    // Using internal event emission to simulate breach
    complianceService.emit('violation', {
        ruleId: 'RULE-CARBON-MAX',
        description: 'Extreme Carbon Leakage Detected',
        value: 1000,
        threshold: 100,
        sensorId: 'SENSOR-KABOOM'
    });

    // Wait for async processing
    await new Promise(resolve => setTimeout(resolve, 500));

    // 4. Verify Lockdown enforcement in OmniCore
    console.log('🎯 Attempting request during LOCKDOWN...');
    const resp2 = await omniCore.process({
        id: 'REQ-002',
        type: 'COMMAND',
        content: 'Evolve System'
    });

    console.log(`Response 2 Status: ${resp2.status}`);
    console.log(`Response 2 Content: ${resp2.content}`);

    if (lockdownTriggered && resp2.status === 'FAILURE' && resp2.content.includes('Sovereignty Lockdown')) {
        console.log('\n🌟 DYNAMIC ETHICAL SHIELD STRESS-TEST PASSED!');
        process.exit(0);
    } else {
        console.error('\n❌ SHIELD ENFORCEMENT FAILED');
        process.exit(1);
    }
}

runTest().catch(err => {
    console.error('Fatal Test Error:', err);
    process.exit(1);
});
