/**
 * GRC Logic Verification Script
 * 
 * Verifies that the ComplianceService correctly generates 5T v10.1 compliant
 * violation objects when a threshold is breached.
 */

import { complianceService } from '../server/services/ComplianceService.js';
import { ambientDataService } from '../server/services/AmbientDataService.js';

console.log('🚀 Starting GRC Logic Verification...');

let violationCaught = false;

complianceService.on('violation', (v) => {
    console.log('✅ Violation Event Caught!');
    console.log('--- Violation Details ---');
    console.log(`Rule: ${v.ruleId} (${v.description})`);
    console.log(`Value: ${v.value} (Threshold: ${v.threshold})`);

    if (v.core) {
        console.log('--- 5T Core Verification ---');
        console.log(`UUID: ${v.core.uuid}`);
        console.log(`Version: ${v.core.version}`);
        console.log(`Status: ${v.core.status}`);

        const evidence = v.core.evidence;
        console.log('Evidence Check:');
        console.log(`- Tangible Metric: ${evidence.tangible?.metric}`);
        console.log(`- Traceable Origin: ${evidence.traceable?.source_origin}`);
        console.log(`- Trustworthy Hash: ${evidence.trustworthy?.hash_lock}`);

        if (v.core.status === 'Violated' && v.core.version === '10.1.0-sentient' && evidence.trustworthy?.hash_lock) {
            console.log('\n🌟 5T V10.1 VIOLATION OBJECT VERIFIED SUCCESSFULLY!');
            violationCaught = true;
        } else {
            console.error('\n❌ 5T CORE ATTRIBUTES MISMATCH');
        }
    } else {
        console.error('❌ NO 5T CORE ATTACHED TO VIOLATION');
    }
});

// Simulate a measurement that triggers a violation
console.log('📡 Simulating Carbon Emission Violation (Value: 150, Max: 100)...');
ambientDataService.emit('measurement', {
    sensorId: 'SENSOR-001',
    type: 'CarbonEmission',
    value: 150,
    timestamp: Date.now()
});

setTimeout(() => {
    if (!violationCaught) {
        console.error('❌ FAILED: No violation event was triggered.');
        process.exit(1);
    } else {
        console.log('🌟 GRC VERIFICATION COMPLETE.');
        process.exit(0);
    }
}, 1000);
