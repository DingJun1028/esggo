
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

async function verifyAvatarFlow() {
    console.log('🚀 Starting Avatar Flow Verification...');

    try {
        // 1. Get State
        console.log('\n--- 1. Fetching State ---');
        try {
            const stateRes = await axios.get(`${API_BASE}/avatar/state`, {
                headers: { Authorization: 'Bearer OMNI_DEV_KEY_999' }
            });
            console.log('State:', stateRes.data);
        } catch (e: any) {
            if (e.response?.status === 401 || e.response?.status === 403) {
                console.warn('⚠️ Auth failed. Token rejected.', e.response?.data);
                throw e;
            }
            throw e;
        }

        // 2. Switch Persona
        console.log('\n--- 2. Switching Persona to JUNA ---');
        const switchRes = await axios.post(`${API_BASE}/avatar/switch`, { personaId: 'juna' }, {
            headers: { Authorization: 'Bearer OMNI_DEV_KEY_999' }
        });
        console.log('Switch Result:', switchRes.data);

        // 3. Chat
        console.log('\n--- 3. Chatting with JUNA ---');
        const chatRes = await axios.post(`${API_BASE}/avatar/chat`, {
            message: 'Report status of Phase 6.'
        }, {
            headers: { Authorization: 'Bearer OMNI_DEV_KEY_999' }
        });
        console.log('Chat Response:', chatRes.data);

        console.log('\n✅ Verification Passed!');
    } catch (error: any) {
        console.error('❌ Verification Failed:', error.response?.data || error.message);
        process.exit(1);
    }
}

verifyAvatarFlow();
