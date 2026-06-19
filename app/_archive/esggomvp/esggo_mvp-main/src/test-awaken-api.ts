import fetch from 'node-fetch';

async function testAwaken() {
    console.log("🧪 Testing OmniOne Awakening API...");
    
    try {
        const response = await fetch('http://localhost:3000/api/omni-one', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operation: 'init' })
        });
        
        const data = await response.json();
        console.log("Response:", JSON.stringify(data, null, 2));
        
        if (data.success) {
            console.log("✅ Awakening API Test Passed!");
        } else {
            console.log("❌ Awakening API Test Failed:", data.error);
        }
    } catch (error) {
        console.error("❌ API Request Failed:", error.message);
        console.log("Note: This test requires the dev server to be running on port 3000.");
    }
}

testAwaken();
