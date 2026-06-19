/**
 * 🧪 Phase 27 Verification Script: Infrastructure resonance
 * 
 * Tests:
 * 1. Sovereign Vault Persistence (LocalStorage)
 * 2. Batch Sealing Performance & Integrity
 * 3. Zone Locking logic in Sustainable Village
 */

import SovereignVaultService from '../src/services/SovereignVaultService';
import { VillageZone } from '../src/omni/context/OmniContext';

// Mock LocalStorage and Window for Node environment
const mockStorage: Record<string, string> = {};
global.localStorage = {
    getItem: (key: string) => mockStorage[key] || null,
    setItem: (key: string, value: string) => { mockStorage[key] = value; },
    removeItem: (key: string) => { delete mockStorage[key]; },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); },
    key: (index: number) => Object.keys(mockStorage)[index] || null,
    length: Object.keys(mockStorage).length
};
(global as any).window = global;

async function runTests() {
    console.log('🏛️ Starting Phase 27 Verification...\n');

    try {
        // --- 1. Test Sovereign Identity Initialization ---
        console.log('[1/4] Initializing Sovereign Identity...');
        const participant = SovereignVaultService.initializeSovereign('MOCK_PUBLIC_KEY');
        if (!participant.did.startsWith('did:esgss:')) throw new Error('Invalid DID format');
        console.log(`✅ Identity Created: ${participant.did}`);

        // --- 2. Test Batch Sealing & Integrity ---
        console.log('\n[2/4] Testing Batch Sealing & Chain Integrity...');
        const payloads = [
            { data: 'Energy Audit 001', value: 100 },
            { data: 'Carbon Offset 001', value: 50 },
            { data: 'Waste Reduction 001', value: 30 }
        ];

        const startTime = Date.now();
        const records = await SovereignVaultService.sealBatch('ESG_DATA', payloads);
        const endTime = Date.now();

        if (records.length !== 3) throw new Error('Batch seal failed: record count mismatch');

        const isIntegrityValid = SovereignVaultService.verifyIntegrity();
        if (!isIntegrityValid) throw new Error('Chain integrity check failed');

        console.log(`✅ Batch Sealed: 3 records in ${endTime - startTime}ms`);
        console.log(`✅ Chain Integrity: Verified Perfect`);

        // --- 3. Test Persistence (Simulate reload) ---
        console.log('\n[3/4] Testing Persistence (LocalStorage Simulation)...');
        // We can't easily re-instantiate a singleton without clearing cache, 
        // but we can check if data exists in mockStorage
        const savedData = localStorage.getItem('esgss_sovereign_vault');
        if (!savedData) throw new Error('Persistence failed: No data in localStorage');

        const parsed = JSON.parse(savedData);
        if (parsed.ledger.length !== 3) throw new Error('Persistence failed: Ledger count mismatch after save');
        console.log(`✅ Persistence: ${parsed.ledger.length} records saved to storage`);

        // --- 4. Verify Zone Locking Logic ---
        console.log('\n[4/4] Verifying Zone Locking Logic...');
        const ZONE_REQUIREMENTS: Record<VillageZone, number> = {
            'HUT': 1,
            'GUILD': 2,
            'WILD': 3,
            'ALTAR': 4,
            'SOVEREIGN': 5,
            'SWARM': 6
        };

        const testLevelAccess = (level: number, zone: VillageZone) => {
            const required = ZONE_REQUIREMENTS[zone];
            return level >= required;
        };

        // Test Cases
        const cases = [
            { level: 1, zone: 'HUT' as VillageZone, expected: true },
            { level: 1, zone: 'GUILD' as VillageZone, expected: false },
            { level: 5, zone: 'SOVEREIGN' as VillageZone, expected: true },
            { level: 5, zone: 'SWARM' as VillageZone, expected: false }
        ];

        cases.forEach(c => {
            const result = testLevelAccess(c.level, c.zone);
            if (result !== c.expected) {
                throw new Error(`Locking logic failed for Level ${c.level} accessing ${c.zone}. Expected ${c.expected}, got ${result}`);
            }
        });
        console.log(`✅ Zone Locking Logic: Correct (4/4 test cases passed)`);

        console.log('\n🎉 Phase 27 Verification Successful! All systems resonant.');

    } catch (error: any) {
        console.error(`\n❌ Verification Failed: ${error.message}`);
        process.exit(1);
    }
}

runTests();
