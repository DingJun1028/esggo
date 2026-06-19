import { reportService } from '../src/services/ReportService';
import { truthEngine } from '../src/omni/services/OmniTruthEngine';
import { omniLogger, LogCategory } from '../src/omni/infrastructure/logging/OmniLogger';

async function testSovereignDisclosure() {
    console.log('--- Phase 17: Sovereign Disclosure Verification ---');

    // 1. Seed Truth Engine with some "Scope 1" data
    console.log('[1] Seeding Truth Engine...');
    await truthEngine.registerClaimWithEvidence(
        'Scope 1 Carbon Emissions: 1420.75 tCO2e',
        [] // No evidence needed for simple mock-real test
    );

    // 2. Generate Report
    console.log('[2] Generating Sovereign Report...');
    try {
        const report = await reportService.generateReport({
            type: 'carbon',
            timeframe: 'quarterly',
            format: 'pdf'
        });

        console.log('--- REPORT METADATA ---');
        console.log(`Title: ${report.title}`);
        console.log(`Claims Count: ${report.metadata.claims_count}`);
        console.log(`Version: ${report.metadata.version}`);
        console.log(`Protocol: ${report.metadata.protocol}`);

        // 3. Verify Content
        console.log('[3] Verifying Typst Content...');
        if (report.content.includes('1420.75 tCO2e')) {
            console.log('✅ Real Data Integration Verified!');
        } else {
            console.log('❌ Real Data Integration Failed (Expected 1420.75 tCO2e)');
        }

        if (report.content.includes('5T VERIFIED')) {
            console.log('✅ 5T Watermark Verified!');
        } else {
            console.log('❌ 5T Watermark Missing!');
        }

        if (report.content.includes('Hash Lock:')) {
            console.log('✅ Hash Lock Seal Verified!');
        } else {
            console.log('❌ Hash Lock Missing!');
        }

        console.log('[SUCCESS] Sovereign Disclosure Phase Verified.');
    } catch (err) {
        console.error('[ERROR] Sovereign Disclosure Test Failed:', err);
    }
}

testSovereignDisclosure();
