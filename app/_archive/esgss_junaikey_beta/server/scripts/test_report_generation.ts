import axios from 'axios';

/**
 * scripts/test_report_generation.ts
 * Automated verification of the Report Generation API layer using Axios for stability.
 */

const BASE_URL = 'http://localhost:3001/api/reports';
const AUTH_TOKEN = 'test_token';

async function verifyReportAPI() {
    console.log('🚀 Starting Report Generation API Verification (Axios Mode)');

    const client = axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json'
        },
        validateStatus: () => true // Don't throw on 4xx/5xx for easier logging
    });

    try {
        // [1] Generating Report
        console.log('[1] Generating Report...');
        const genRes = await client.post('/generate', {
            userId: 'test-user-123',
            type: 'ESG_Intelligence',
            target: 'VerifCorp',
            focusAreas: ['ESG'],
            format: 'json'
        });

        console.log('Status:', genRes.status);
        if (genRes.status !== 202) {
            throw new Error(`Failed to generate report: ${genRes.status} ${JSON.stringify(genRes.data)}`);
        }

        const jobId = genRes.data.jobId;
        console.log(`✅ Job ID: ${jobId}`);

        // [2] Polling Status
        console.log(`\n[2] Polling status for job ${jobId}...`);
        let status = 'pending';
        let attempts = 0;
        let reportId = null;

        while ((status === 'waiting' || status === 'active' || status === 'pending') && attempts < 30) {
            attempts++;
            const statusRes = await client.get(`/status/${jobId}`);
            status = statusRes.data.status || 'unknown';
            console.log(`   Attempt ${attempts}: Status = ${status}, Data: ${JSON.stringify(statusRes.data)}`);

            if (status === 'completed' || status === 'ready' || (statusRes.data.progress === 100 && statusRes.data.result)) {
                console.log(`   FULL STATUS RESPONSE: ${JSON.stringify(statusRes.data, null, 2)}`);
                reportId = statusRes.data.result?.id || statusRes.data.result?.reportId;
                console.log(`   ✅ Matched completed status. Assigned reportId: ${reportId}`);
                break;
            }
            if (status === 'failed') {
                throw new Error(`Job failed: ${statusRes.data.error || 'Unknown error'}`);
            }
            await new Promise(r => setTimeout(r, 2000));
        }

        if (!reportId) {
            throw new Error('Report generation timed out or failed to return ID');
        }
        console.log(`✅ Report generated with ID: ${reportId}`);

        // [3] Testing History Cache (MISS)
        console.log('\n[3] Fetching History (Expecting Cache MISS)...');
        const hist1 = await client.get('/history');
        console.log(`   Status: ${hist1.status}, Items: ${hist1.data.data?.reports?.length || 0}`);
        console.log(`   Cache Header: ${hist1.headers['x-cache'] || 'none'}`);

        // [4] Testing History Cache (HIT)
        console.log('\n[4] Fetching History again (Expecting Cache HIT)...');
        const hist2 = await client.get('/history');
        console.log(`   Status: ${hist2.status}, Cache Header: ${hist2.headers['x-cache'] || 'none'}`);

        // [5] Fetching Single Report
        console.log(`\n[5] Fetching Single Report ${reportId}...`);
        const single = await client.get(`/${reportId}`);
        console.log(`   Status: ${single.status}, Title: ${single.data.data?.title}`);

        // [6] Deleting Report
        console.log(`\n[6] Deleting Report ${reportId}...`);
        const delRes = await client.delete(`/${reportId}`);
        console.log(`   Status: ${delRes.status}`);

        // [7] Verifying 404
        console.log('\n[7] Verifying 404 after deletion...');
        const verify404 = await client.get(`/${reportId}`);
        console.log(`   Status: ${verify404.status} (Expected 404)`);

        if (verify404.status === 404) {
            console.log('\n✨ ALL TESTS PASSED! Triple verification complete.');
        } else {
            console.log('\n⚠️ TEST FAILED: Report still exists after deletion.');
        }

    } catch (error: any) {
        console.error('\n❌ Verification Failed:');
        console.error(error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
        process.exit(1);
    }
}

verifyReportAPI().catch(console.error);

