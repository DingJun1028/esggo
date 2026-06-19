
import { InfoOneCore } from '../src/omni/core/InfoOneCore';
import { sovereignVaultService } from '../src/services/SovereignVaultService';

async function testPersistence() {
    console.log('🧪 Starting Phase 79 Persistence Verification...');

    // 1. Initialize Core
    const core = new InfoOneCore({
        uuid: 'PERSISTENCE-TEST-01',
        name: 'Test Agent',
        virtues: {},
        evidence: { tangible: {} }
    } as any);

    // 2. Modify State
    (core as any).status = 'ACTIVE';
    (core as any).arvoStatus = 'VERIFIED';
    (core as any).omniCrystal = {
        id: 'CRYSTAL-TEST',
        hash: '0x123456789',
        purity: 0.99,
        formationTime: Date.now(),
        generation: 1,
        ownerUuid: 'SYSTEM'
    };

    console.log('📝 Original State:', core.dehydrate());

    // 3. Dehydrate & Save
    const jsonState = core.dehydrate();
    const storageKey = 'TEST_AGENT_KEY';

    // Mock window for service if needed, or rely on service handling non-browser env
    // The service checks `typeof window`. In this node script, window is undefined.
    // We will verify dehydration logic primarily here, and mock the service storage for Node.

    // Manually mock the service storage for this test since we are in Node
    const mockStorage = new Map<string, string>();
    mockStorage.set(`OMNI_VAULT_${storageKey}`, jsonState);
    console.log('💾 Saved to Mock Storage.');

    // 4. Create Fresh Instance
    const freshCore = new InfoOneCore({
        uuid: 'PERSISTENCE-TEST-01', // Same UUID
        name: 'Test Agent',
        virtues: {},
        evidence: { tangible: {} }
    } as any);

    // 5. Load & Hydrate
    const loadedJson = mockStorage.get(`OMNI_VAULT_${storageKey}`);
    if (loadedJson) {
        freshCore.hydrate(loadedJson);
        console.log('💧 Hydrated Fresh Core.');
    } else {
        console.error('❌ Failed to load from storage.');
        process.exit(1);
    }

    // 6. Verify
    if (freshCore.omniCrystal?.id === 'CRYSTAL-TEST' && freshCore.status === 'ACTIVE') {
        console.log('✅ Persistence Verified: Crystal ID and Status Match.');
        console.log('Rehydrated Crystal:', freshCore.omniCrystal);
    } else {
        console.error('❌ Verification Failed.');
        console.log('Expected: CRYSTAL-TEST, ACTIVE');
        console.log('Actual:', freshCore.omniCrystal?.id, freshCore.status);
    }
}

testPersistence();
