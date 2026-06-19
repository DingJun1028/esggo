
import axios from 'axios';

const PORTS = [3001, 5000, 8080];

async function verifyHealth() {
    for (const port of PORTS) {
        const url = `http://localhost:${port}/api/omni/health/detailed`;
        console.log(`Trying ${url}...`);
        try {
            const response = await axios.get(url, { timeout: 2000 });
            console.log(`✅ Success on port ${port}!`);
            const data = response.data;

            console.log('Response Structure:');
            console.log(JSON.stringify(data, null, 2));

            // Verify structure for OmniContext
            if (data.success && data.data && data.data.health && data.data.cache) {
                console.log('✅ Structure matches OmniContext expectation (data.health & data.cache present)');
                console.log('Redis Memory:', data.data.cache.used_memory);
            } else {
                console.error('❌ Structure MISMATCH!');
            }
            return;
        } catch (error: any) {
            console.log(`❌ Failed on port ${port}: ${error.message}`);
        }
    }
    console.error('❌ Could not connect to any port.');
}

verifyHealth();
