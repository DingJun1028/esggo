const https = require('https');

const apiKey = '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';
const model = 'openrouter/free';

console.log(`Testing model: ${model}`);

const data = JSON.stringify({
    model: model,
    messages: [{ role: 'user', content: 'Say hello in Traditional Chinese' }]
});

const options = {
    hostname: 'openrouter.ai',
    path: '/api/v1/chat/completions',
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://localhost',
        'X-Title': 'ESG-GO-Test',
        'Content-Length': Buffer.byteLength(data)
    }
};

const req = https.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => {
        responseData += chunk;
    });
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        try {
            console.log(JSON.stringify(JSON.parse(responseData), null, 2));
        } catch (e) {
            console.log(responseData);
        }
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
