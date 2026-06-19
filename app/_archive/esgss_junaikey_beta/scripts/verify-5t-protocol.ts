/**
 * 🧪 5T Protocol Verification Script
 * --------------------------------------------------
 * This script tests the integrity of the 5T Shield and Trustworthy Lock.
 */

import { TrustworthyLock } from '../src/utils/TrustworthyLock';

async function verifyProtocol() {
    console.log('🧪 Starting 5T Protocol Verification...');

    // 1. Create a sample component
    const originalData = {
        uuid: 'test-uuid-001',
        timestamp: Date.now(),
        formula: 'Impact = A + B',
        impactMetric: '100 tCO2e',
        evidence: {
            tangible: { metric: 'Audit Report V1' },
            traceable: { source_origin: 'Verified Factory' },
            trackable: { pathway: ['Step 1', 'Step 2'] },
            transparent: { validation_standard: 'ESG-GL-2026' },
        }
    };

    console.log('📦 Sealing data with Trustworthy Lock...');
    const sealed = await TrustworthyLock.seal(originalData);
    console.log(`✅ Data Sealed. Hash Lock: ${sealed.hash_lock}`);

    // 2. Verify Integrity
    console.log('🔍 Verifying integrity of sealed data...');
    const isIntegrityIntact = await TrustworthyLock.verify(sealed);
    console.log(`Result: ${isIntegrityIntact ? '🟢 INTACT' : '🔴 CORRUPTED'}`);

    if (!isIntegrityIntact) throw new Error('Self-verification failed!');

    // 3. Simulate Tampering
    console.log('⚒️ Simulating data tampering...');
    const tamperedData = JSON.parse(JSON.stringify(sealed));
    tamperedData.data.impactMetric = '999 tCO2e'; // Change a single value

    console.log('🔍 Verifying tampered data...');
    const isTamperedDetected = !(await TrustworthyLock.verify(tamperedData));
    console.log(`Result: ${isTamperedDetected ? '🟢 TAMPER DETECTED' : '🔴 TAMPER NOT DETECTED'}`);

    if (isTamperedDetected) {
        console.log('🏆 5T Protocol Verification Successful: Tamper detection is operational.');
    } else {
        throw new Error('Critical: Tamper detection failed!');
    }
}

verifyProtocol().catch(err => {
    console.error('❌ Verification Error:', err);
    process.exit(1);
});
