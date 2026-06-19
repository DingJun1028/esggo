
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;
const API_TOKEN = process.env.API_SECRET_TOKEN || 'SUPER_SECRET_TOKEN'; // Use configured token

const headers = {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
};

async function verifyAwakening() {
    console.log('🌟 Verifying OmniSpirit Awakening Endpoints...');
    console.log(`📡 Target: ${BASE_URL}`);

    try {
        // 1. Check Initial Status
        console.log('\n🔍 1. Checking Initial Awakening Status...');
        const statusRes = await axios.get(`${BASE_URL}/awakening/status`, { headers });
        console.log('✅ Status:', statusRes.data.data.phase);

        // 2. Start Evolution Daemon
        console.log('\n🚀 2. Starting Omni-Evolution Daemon...');
        const startRes = await axios.post(`${BASE_URL}/evolution/daemon/start`, {}, { headers });
        console.log('✅ Response:', startRes.data.message);

        // 3. Trigger Awakening (Simulated/Real)
        console.log('\n⚡ 3. Triggering Awakening Sequence...');
        console.log('   (Note: This might take a moment as it wakes up services)');

        // We expect this to return success, possibly with a "process started" message
        const triggerRes = await axios.post(`${BASE_URL}/awakening/trigger`, {}, { headers });
        console.log('✅ Trigger Result:', triggerRes.data);

        // 4. Poll for Status Change
        console.log('\n⏳ 4. Polling for Status Change (5s)...');
        await new Promise(r => setTimeout(r, 5000));
        const finalStatusRes = await axios.get(`${BASE_URL}/awakening/status`, { headers });
        console.log('✅ Final Status:', finalStatusRes.data.data.phase);

        // 5. Stop Daemon (Cleanup)
        console.log('\n🛑 5. Stopping Omni-Evolution Daemon...');
        await axios.post(`${BASE_URL}/evolution/daemon/stop`, {}, { headers });
        console.log('✅ Daemon Stopped.');

        console.log('\n✨ Verification Complete: OmniSpirit Interfaced Successfully.');

    } catch (error: any) {
        if (error.response) {
            console.error('❌ API Error:', error.response.status, error.response.data);
        } else if (error.code === 'ECONNREFUSED') {
            console.error('❌ Connection Refused. Is the server running?');
            console.error(`   Run: npm start (in server directory)`);
        } else {
            console.error('❌ Unexpected Error:', error.message);
        }
    }
}

// Run verification
verifyAwakening();
