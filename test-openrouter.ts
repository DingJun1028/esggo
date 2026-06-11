
// test-openrouter.ts
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost/omniagent-api'; // Assuming Nginx proxies /omniagent-api to omniagent-gateway

async function testOpenRouter() {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // No API Key needed here, as omniagent-gateway should handle it
      },
      body: JSON.stringify({
        model: 'google/gemma-4-31b-it:free',
        messages: [{
          role: 'user',
          content: 'Hello, please introduce yourself in one sentence.'
        }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenRouter Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error testing OpenRouter:', error);
  }
}

testOpenRouter();
