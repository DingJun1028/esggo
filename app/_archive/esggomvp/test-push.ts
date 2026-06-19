import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { OmniNcbService } from './src/core/omni-ncb-service';

async function testSimplePush() {
    console.log('🧪 Testing Simple Push...');
    const result = await OmniNcbService.saveReport({
        uuid: 'test-' + Date.now(),
        title: 'Test Report',
        status: 'draft',
        reporting_year: 2026,
        payload: { test: true }
    });
    console.log('Result:', JSON.stringify(result, null, 2));
}

testSimplePush().catch(console.error);
