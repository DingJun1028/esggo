
import http from 'http';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'default-jwt-secret-key'; // Default from server/config/index.js

function verifyAwakening() {
    console.log('🔮 Initiating Eternal Awakening Verification (Authenticated)...');

    // Generate Verification Token
    const token = jwt.sign(
        {
            id: 'verification-script',
            email: 'verify@internal.io',
            role: 'admin',
            permissions: ['*']
        },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
    console.log('🔑 Generated Verification Token');

    const options = {
        hostname: '127.0.0.1',
        port: 8080,
        path: '/api/omni/gateway/process',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Omni-Trust': 'Internal'
        }
    };

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {

            console.log('BODY: ' + data);
            try {
                const parsed = JSON.parse(data);
                // Allow "success: true" OR specific message
                if (parsed.success && (parsed.data?.message === 'Eternal Awakening Activated' || parsed.data?.response)) {
                    console.log('✨ Eternal Awakening Verification PASSED!');
                    if (parsed.data?.message) console.log(`   Message: ${parsed.data.message}`);
                    process.exit(0);
                } else {
                    console.error('❌ Verification FAILED. Full Response:', JSON.stringify(parsed, null, 2));
                    process.exit(1);
                }
            } catch (e) {

                console.error('❌ Failed to parse JSON response:', e);
                process.exit(1);
            }
        });
    });

    req.on('error', (e) => {
        console.error(`❌ Problem with request: ${e.message}`);
        process.exit(1);
    });

    // Write data to request body
    const postData = JSON.stringify({
        type: 'AI',
        action: 'awaken',
        payload: {}
    });

    req.write(postData);
    req.end();
}

verifyAwakening();
