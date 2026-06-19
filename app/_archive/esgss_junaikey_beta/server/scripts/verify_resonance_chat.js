
import fetch from 'node-fetch';

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;
const API_TOKEN = process.env.API_SECRET_TOKEN || 'SUPER_SECRET_TOKEN';

async function verifyResonanceChat() {
    console.log(`[VERIFY] Starting Resonance Chat Verification on ${BASE_URL}...`);

    // 1. Manifest (Create Session)
    console.log('[VERIFY] 1. Creating Session (Manifestation)...');
    let sessionId;
    try {
        const manifestResponse = await fetch(`${BASE_URL}/api/manifest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_TOKEN}`
            },
            body: JSON.stringify({
                source_agent: 'primary_agent_001', // Use a plausible ID, fallback will handle it if missing
                overrides: {
                    mask: {
                        tone: 'Resonant',
                        language: 'en'
                    }
                }
            })
        });

        if (!manifestResponse.ok) {
            const errorText = await manifestResponse.text();
            throw new Error(`Manifestation failed: ${manifestResponse.status} ${manifestResponse.statusText} - ${errorText}`);
        }

        const manifestData = await manifestResponse.json();
        sessionId = manifestData.data.sessionId;
        console.log(`[VERIFY] Session Created: ${sessionId}`);
    } catch (e) {
        console.error('[VERIFY] Manifestation Error:', e.message);
        process.exit(1);
    }

    // 2. Interact (Chat)
    console.log('[VERIFY] 2. Sending Message to /api/interact...');
    const message = "Hello, how is the system resonance today?";

    try {
        const interactUrl = `${BASE_URL}/api/interact?sessionId=${sessionId}&message=${encodeURIComponent(message)}`;

        const interactResponse = await fetch(interactUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Accept': 'text/event-stream'
            }
        });

        if (!interactResponse.ok) {
            const errorText = await interactResponse.text();
            throw new Error(`Interaction failed: ${interactResponse.status} ${interactResponse.statusText} - ${errorText}`);
        }

        console.log('[VERIFY] Stream established. Listening for resonance...');

        // Read stream
        const body = interactResponse.body;
        // Node-fetch body is a stream
        body.setEncoding('utf8');

        let fullResponse = '';
        let events = [];

        body.on('data', (chunk) => {
            const lines = chunk.split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonStr = line.slice(6);
                    if (jsonStr === '[DONE]') continue;
                    try {
                        const data = JSON.parse(jsonStr);
                        events.push(data); // Capture raw event
                        if (data.type === 'text') {
                            process.stdout.write(data.content);
                            fullResponse += data.content;
                        } else if (data.type === 'thought') {
                            console.log(`\n[THOUGHT]: ${data.content}`);
                        } else if (data.type === 'error') {
                            console.error(`\n[ERROR]: ${data.content}`);
                        } else {
                            console.log(`\n[UNKNOWN]: ${JSON.stringify(data)}`);
                        }
                    } catch (e) {
                        // ignore partial JSON
                    }
                }
            }
        });

        await new Promise((resolve, reject) => {
            body.on('end', resolve);
            body.on('error', reject);
        });

        console.log('\n[VERIFY] Interaction Complete.');

        // Write result to file for verification
        const fs = await import('fs');
        fs.writeFileSync('validation_result.json', JSON.stringify({
            fullResponse,
            events,
            status: 'success',
            timestamp: new Date().toISOString()
        }, null, 2));
        console.log('[VERIFY] Result written to validation_result.json');

    } catch (error) {
        console.error('[VERIFY] Error:', error.message);
        const fs = await import('fs');
        try {
            fs.writeFileSync('validation_result.json', JSON.stringify({
                error: error.message,
                status: 'error',
                timestamp: new Date().toISOString()
            }, null, 2));
        } catch (e) { }
        process.exit(1);
    }
}

verifyResonanceChat();
