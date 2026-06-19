
// Verification script for Boost.Space Integration
import axios from 'axios';

async function testWebhook() {
    console.log('Testing Boost.Space Webhook...');
    try {
        const res = await axios.post('http://localhost:5006/api/integrations/boost-space/webhook', {
            module: 'l1_assessment',
            data: {
                id: 'test-id',
                status: 'completed'
            }
        }); // removed secret for now as per code comments
        console.log('Webhook Response:', res.status, res.data);
    } catch (error: any) {
        console.error('Webhook verification failed:', error.message);
        if (error.response) console.error('Response:', error.response.data);
    }
}

testWebhook();
