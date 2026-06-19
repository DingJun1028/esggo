
// Native fetch is available in Node.js 18+
// Running as ESM because package.json likely has "type": "module"


async function testChat() {
    console.log('🔍 Diagnostics Starting...');

    // 1. Test Health
    try {
        console.log('Testing /api/health...');
        const healthRes = await fetch('http://localhost:3001/api/health');
        if (healthRes.ok) {
            const healthData = await healthRes.json();
            console.log('✅ Health Check Passed:', JSON.stringify(healthData, null, 2));
        } else {
            console.error('❌ Health Check Failed:', healthRes.status);
        }
    } catch (e) {
        console.error('❌ Health Check Connection Failed:', e.message);
    }

    // 2. Test Process
    console.log('\nTesting /api/process endpoint...');
    try {
        const response = await fetch('http://localhost:3001/api/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer dev-token' // Mock auth
            },
            body: JSON.stringify({
                type: 'test',
                content: 'Hello, this is a test message from verification script.',
                parts: []
            })
        });

        if (!response.ok) {
            console.error('❌ Process Error Status:', response.status, response.statusText);
            const text = await response.text();
            console.error('❌ Process Error Body:', text);
            return;
        }

        const data = await response.json();
        console.log('✅ Process Success! Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('❌ Process Fetch failed:', error.message);
        console.error('CAUSE: The server might not be running on port 3001 or the endpoint is missing.');
    }
}

testChat();
