/**
 * Verification Script: Carbon Domain logic (v10.1)
 *
 * Checks:
 * 1. EmissionFactorDatabase correctly retrieves factors.
 * 2. CarbonInventoryService calculates inventory with 5T core.
 * 3. 5T evidence is correctly structured.
 */

import { CarbonInventoryService } from '../server/services/CarbonInventoryService.js';
import { EmissionFactorDatabase } from '../server/services/EmissionFactorDatabase.js';

async function runVerification() {
    console.log('🚀 Starting Carbon Domain Logic Verification...');

    const efDb = new EmissionFactorDatabase();
    const inventoryService = new CarbonInventoryService();

    // Test 1: EF Database
    console.log('\n--- Test 1: Emission Factor Database ---');
    const electricityFactor = await efDb.getFactor('electricity', 'taiwan');
    console.log(`Taiwan Electricity Factor: ${electricityFactor.co2e} ${electricityFactor.unit} (Expected: 0.509)`);

    if (electricityFactor.co2e === 0.509) {
        console.log('✅ EF Database Match Success');
    } else {
        console.log('❌ EF Database Match Failure');
        process.exit(1)
    }

    // Test 2: Inventory Calculation (Mocked result for structure check)
    console.log('\n--- Test 2: Carbon Inventory Calculation Structure ---');
    // Since fetchEvidenceData is mocked to return [], we'll manually check the calc flow if possible
    // or just check if the method exists and returns the expected structure.

    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');
    const inventory = await inventoryService.calculateInventory('test-org', startDate, endDate);

    console.log('Inventory Total:', inventory.totalEmissions);
    console.log('Inventory Version:', inventory.core?.version);
    console.log('Inventory Status:', inventory.core?.status);

    if (inventory.core?.version === '10.1.0-sentient' && inventory.core?.status === 'Calculated') {
        console.log('✅ 5T Core Integration Success');
    } else {
        console.log('❌ 5T Core Integration Failure');
        process.exit(1);
    }

    // Test 3: Evidence Structure
    console.log('\n--- Test 3: Evidence Structure Verification ---');
    const evidence = inventory.core?.evidence;
    console.log('Tangible Evidence Meta:', evidence?.tangible?.metric);
    console.log('Traceable Source:', evidence?.traceable?.source_origin);
    console.log('Trustworthy Locked:', evidence?.trustworthy?.is_frozen);

    if (evidence?.tangible && evidence?.traceable && evidence?.trustworthy) {
        console.log('✅ 5T Evidence Structure Success');
    } else {
        console.log('❌ 5T Evidence Structure Failure');
        process.exit(1);
    }

    console.log('\n🌟 ALL CARBON DOMAIN VERIFICATIONS PASSED!');
}

runVerification().catch(err => {
    console.error('Verification failed:', err);
    process.exit(1);
});
