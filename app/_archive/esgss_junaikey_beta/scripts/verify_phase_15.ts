import { BackendService } from '../src/services/backend';
import { OmniDataAdapter } from '../src/services/data/OmniDataAdapter';
import { IComponentCore } from '../src/0-domain/contracts/IComponentCore';
import { ncb } from '../src/lib/ncb/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function verifyPhase15() {
    console.log('🚀 Phase 15: NCB Data Integration & 5T Hardening Verification\n');

    // Wait for NCB Client to sign in
    await ncb.waitReady();

    try {
        // 1. Test BackendService.fetchFactors (Read via NCB Client)
        console.log('--- Testing BackendService.fetchFactors ---');
        const factors = await BackendService.fetchFactors() as any[];
        console.log('✅ Fetched Factors Count:', factors.length);
        if (factors.length > 0) {
            console.log('Sample Factor:', factors[0]);
        }

        // 2. Test OmniDataAdapter.getMetricDefinitions
        console.log('\n--- Testing OmniDataAdapter.getMetricDefinitions ---');
        const metrics = await OmniDataAdapter.getMetricDefinitions();
        console.log('✅ Fetched Metrics Count:', metrics.length);
        if (metrics.length > 0) {
            console.log('Sample Metric:', metrics[0].code);
        }

        // 3. Test Automated 5T Sealing and Save
        console.log('\n--- Testing Automated 5T Sealing & Save ---');
        const testReading: Partial<IComponentCore> = {
            uuid: `test-${Date.now()}`,
            timestamp: Date.now(),
            status: 'Proposed',
            data: {
                value: 42,
                calculatedValue: 420
            },
            evidence: {
                tangible: {
                    metric: 'TEST_METRIC',
                    description: 'Verification test reading',
                    impact_metric: 'kgCO2e',
                    timestamp: Date.now()
                },
                traceable: {
                    source_origin: 'PHASE_15_VERIFIER',
                    verification_links: ['https://example.com/evidence']
                },
                trackable: {
                    lifecycle_hooks: []
                },
                transparent: {
                    formula: 'x * 10',
                    validation_standard: 'TEST_STD'
                },
                trustworthy: {
                    hash_lock: 'pending',
                    is_frozen: false
                }
            }
        };

        const savedReading = await OmniDataAdapter.saveReading(testReading);
        console.log('✅ Sealing Successful. Hash Lock:', savedReading.evidence?.trustworthy?.hash_lock);
        console.log('✅ Reading Saved to NCB');

        // 4. Verify Readback with 5T mapping
        console.log('\n--- Verifying Readback from NCB ---');
        const { data, error } = await ncb
            .from('esg_readings')
            .select('*')
            .eq('uuid', savedReading.uuid)
            .single();

        const readbackRaw = data as any;

        if (error || !readbackRaw) {
            console.log('⚠️ Readback via uuid failed, trying via metric...');
            const results = await OmniDataAdapter.getReadingsByMetric('TEST_METRIC', 1);
            if (results.length > 0) {
                console.log('✅ Found reading via metric.');
                console.log('Readback 5T Trustworthy Pillar:', JSON.stringify(results[0].evidence.trustworthy, null, 2));
            }
        } else {
            console.log('✅ Readback raw data successful.');
            console.log('Readback hash_lock:', readbackRaw.hash_lock);
            if (readbackRaw.hash_lock === savedReading.evidence.trustworthy?.hash_lock) {
                console.log('💎 5T INTEGRITY VERIFIED: Hash locks match!');
            } else {
                console.log('❌ 5T INTEGRITY FAILURE: Hash locks do not match.');
            }
        }

        console.log('\n✨ Phase 15 Verification Complete!');
    } catch (error) {
        console.error('\n❌ Verification Failed:', error);
    }
}

verifyPhase15();
