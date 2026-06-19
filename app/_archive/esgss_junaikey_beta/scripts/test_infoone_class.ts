
import { InfoOneCore } from '../src/omni/core/InfoOneCore';

console.log('--- InfoOneCore Class Verification ---');

// Case 1: Locking with missing evidence (Expect Failure/Draft)
console.log('\nCase 1: Locking with incomplete evidence (Expect Draft)');
const incompleteCore = new InfoOneCore({
    uuid: 'test-incomplete-001',
    version: '0.0.1-draft',
    timestamp: Date.now(),
    evidence: {
        tangible: { metric: 'Something' } // Missing other fields
    } as any
});

console.log('Initial Status:', incompleteCore.status);
incompleteCore.lock();
console.log('Post-Lock Status (Should be Draft):', incompleteCore.status);

if (incompleteCore.status === 'Draft') {
    console.log('✅ Case 1 Passed: Incomplete core remained Draft.');
} else {
    console.error('❌ Case 1 Failed: Core should not be locked.');
}

// Case 2: Locking with full 5T evidence (Expect Success/Trustworthy)
console.log('\nCase 2: Locking with full 5T evidence (Expect Trustworthy)');
const validCore = new InfoOneCore({
    uuid: 'test-valid-002',
    version: '1.0.0',
    timestamp: Date.now(),
    evidence: {
        tangible: { metric: 'Impact_Metric_Test', timestamp: Date.now() },
        traceable: { source_origin: 'Test_Script', owner: 'QA_Bot' },
        trackable: { lifecycle_hooks: [{ event: 'Created', timestamp: Date.now(), actor: 'Tester' }], current_hook_id: 'H1' },
        transparent: { formula: 'x=y', validation_standard: 'Test-Standard' },
        trustworthy: { hash_lock: 'PENDING', is_frozen: false }
    }
});

console.log('Initial Status:', validCore.status);
validCore.lock();
console.log('Post-Lock Status (Should be Trustworthy):', validCore.status);
console.log('Is Evidence Frozen?', Object.isFrozen(validCore.evidence));

if (validCore.status === 'Trustworthy' && Object.isFrozen(validCore.evidence)) {
    console.log('✅ Case 2 Passed: Core became Trustworthy and Frozen.');
} else {
    console.error('❌ Case 2 Failed: Core state incorrect.');
}
