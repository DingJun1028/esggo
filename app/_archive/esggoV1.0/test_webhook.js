const fetch = require('node-fetch'); // If not available, we can use built-in fetch in Node 18+
const crypto = require('crypto');

async function testWebhook() {
    const secret = 'esg_go_secret_123';
    const body = JSON.stringify({
        event: "TODO_UPDATED",
        currentValue: { id: "test_blue_001", title: "ESG Audit: Vendor A", done: true }
    });

    const hmac = crypto.createHmac('sha256', secret);
    const signature = hmac.update(body).digest('hex');

    const url = 'http://localhost:3000/api/external/blue-webhook';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-blue-signature': signature
            },
            body: body
        });

        const result = await response.json();
        console.log('Response Status:', response.status);
        console.log('Response Body:', result);
    } catch (err) {
        console.error('Test Failed:', err.message);
    }
}

testWebhook();
