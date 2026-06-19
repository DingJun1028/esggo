
import { GoodwardLogicGate } from '../src/omni/core/GoodwardCore';
import { IComponentCore } from '../src/0-domain/contracts/IComponentCore';
import { LogCategory, omniLogger } from '../src/services/omniLogger';

// Mock logger to avoid errors in standalone script
omniLogger.info = (cat, msg) => console.log(`[INFO] ${msg}`);
omniLogger.warn = (cat, msg) => console.warn(`[WARN] ${msg}`);

async function testInfoOne() {
    console.log('🧪 Testing InfoOne (Goodward Core) Logic Gate...');

    // Case 1: Valid Data
    const validData: Partial<IComponentCore> = {
        label: 'Carbon Emission Report 2025',
        evidence: {
            tangible: { metric: 'Impact_Metric_v1' },
            traceable: { source_origin: '/vault/raw/emissions.json' },
            trackable: { lifecycle_hooks: [], current_hook_id: 'HOOK_001' },
            transparent: { formula: '[ISO-14064-1]' }
        }
    };

    const core1 = GoodwardLogicGate.crystallize(validData);

    if (core1.status === 'Trustworthy' && Object.isFrozen(core1)) {
        console.log('✅ Case 1 Passed: Valid data became Trustworthy & Frozen.');
        console.log(`   Internal Hash: ${core1.evidence.trustworthy?.hash_lock}`);
        console.log(`   Metric: ${core1.evidence.tangible?.metric}`);
    } else {
        console.error('❌ Case 1 Failed:', core1.status, 'Frozen:', Object.isFrozen(core1));
    }

    // Case 2: Invalid Data (Missing Transparent/Formula)
    const invalidData: Partial<IComponentCore> = {
        label: 'Incomplete Report',
        evidence: {
            tangible: { metric: 'Impact_Metric_v1' },
            traceable: { source_origin: '/vault/raw/emissions.json' },
            trackable: { lifecycle_hooks: [] },
            // Missing transparent
        }
    };

    const core2 = GoodwardLogicGate.crystallize(invalidData);

    if (core2.status === 'Draft' && !core2.evidence.trustworthy?.is_frozen) {
        console.log('✅ Case 2 Passed: Invalid data remained Draft.');
    } else {
        console.error('❌ Case 2 Failed:', core2.status);
    }

    // Case 3: Tamper Check
    try {
        (core1 as any).status = 'Draft';
        console.error('❌ Case 3 Failed: Modification allowed on locked core.');
    } catch (e) {
        console.log('✅ Case 3 Passed: Modification blocked by Object.freeze().');
    }
}

testInfoOne();
