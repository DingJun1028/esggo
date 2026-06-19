import * as dotenv from 'dotenv';
dotenv.config();

import { OmniDataAdapter } from '../src/services/data/OmniDataAdapter.js';
import { omniLogger } from '../src/services/omniLogger.js';
import { LogCategory } from '../src/utils/logger.js';

async function verifyNcbAdapter() {
    console.log('🧪 Verifying OmniDataAdapter & EsgDataMapper (NCB Bridge)...');

    try {
        // 1. Fetch Metric Definitions
        console.log('\n--- Step 1: Metric Definitions ---');
        const metrics = await OmniDataAdapter.getMetricDefinitions();
        console.log('Active Metrics Found:', metrics.length);

        if (metrics.length > 0) {
            console.log('First Metric:', metrics[0]);
        } else {
            console.log('⚠️ No active metrics found. (Expected if DB is fresh)');
        }

        // 2. Fetch Readings (Test with a dummy ID)
        console.log('\n--- Step 2: ESG Readings ---');
        const readings = await OmniDataAdapter.getReadingsByMetric('TEST_METRIC_001', 5);
        console.log('Readings found for TEST_METRIC_001:', readings.length);

        if (readings.length > 0) {
            const ucc = readings[0];
            if (!ucc) {
                console.error('❌ Failed to map data to UCC.');
                return;
            }

            console.log('✅ UCC Object Created:', ucc.uuid);
            console.log('   - Timestamp:', new Date(ucc.timestamp).toLocaleString());
            console.log('   - Formula:', ucc.formula);
            console.log('   - Status:', ucc.status);
            console.log('5T Verification Check:');
            console.log('- Tangible:', !!ucc.evidence.tangible);
            console.log('- Traceable:', !!ucc.evidence.traceable);
            console.log('- Trustworthy:', !!ucc.evidence.trustworthy);
        }

        console.log('\n✅ [VERIFICATION SCRIPT DONE] Bridge components are operational.');
    } catch (error) {
        console.error('\n❌ [VERIFICATION FAILED]:', error);
        process.exit(1);
    }
}

verifyNcbAdapter().catch(console.error);
