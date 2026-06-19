import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

const API_BASE = 'http://localhost:8080/api/game';
const USER_ID = '550e8400-e29b-41d4-a716-446655440000'; // Valid UUID for DB compatibility // Use a test ID
const JWT_SECRET = 'esg-sunshine-junaikey-secret-2026'; // From .env

const token = jwt.sign({ id: USER_ID }, JWT_SECRET, { expiresIn: '1h' });

const HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};

async function testSync() {
    console.log('[DEBUG] Testing /sync...');
    try {
        const res = await fetch(`${API_BASE}/sync`, {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify({
                userId: USER_ID,
                state: { level: 1, xp: 100, timestamp: Date.now() }
            })
        });
        console.log(`[DEBUG] Sync HTTP Status: ${res.status}`);
        const text = await res.text();
        try {
            const data = JSON.parse(text);
            console.log('[DEBUG] Sync Response JSON:', JSON.stringify(data));
        } catch (je) {
            console.log('[DEBUG] Sync !NOT JSON! Body snippet:', text.substring(0, 200));
        }
    } catch (e: any) {
        console.error('[ERROR] Sync Failed:', e.message);
    }
}

async function testAwakening() {
    console.log('[DEBUG] Testing /awaken/instant-win...');
    try {
        const res = await fetch(`${API_BASE}/awaken/instant-win`, {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify({ userId: USER_ID })
        });
        console.log(`[DEBUG] Awakening HTTP Status: ${res.status}`);
        const text = await res.text();
        try {
            const data = JSON.parse(text);
            console.log('[DEBUG] Instant Win Response JSON:', JSON.stringify(data));
        } catch (je) {
            console.log('[DEBUG] Awakening !NOT JSON! Body snippet:', text.substring(0, 200));
        }
    } catch (e: any) {
        console.error('[ERROR] Instant Win Failed:', e.message);
    }
}

async function testMystery() {
    console.log('[DEBUG] Testing /awaken/mystery...');
    try {
        const res = await fetch(`${API_BASE}/awaken/mystery`, {
            method: 'GET',
            headers: HEADERS
        });
        console.log(`[DEBUG] Mystery HTTP Status: ${res.status}`);
        const text = await res.text();
        try {
            const data = JSON.parse(text);
            console.log('[DEBUG] Mystery Response JSON:', JSON.stringify(data));
        } catch (je) {
            console.log('[DEBUG] Mystery !NOT JSON! Body snippet:', text.substring(0, 200));
        }
    } catch (e: any) {
        console.error('[ERROR] Mystery Failed:', e.message);
    }
}

async function testHealth() {
    console.log('[DEBUG] Testing /api/health...');
    try {
        const res = await fetch('http://localhost:8080/api/health');
        console.log(`[DEBUG] Health HTTP Status: ${res.status}`);
        const text = await res.text();
        try {
            const data = JSON.parse(text);
            console.log('[DEBUG] Health Response:', JSON.stringify(data));
        } catch (je) {
            console.log('[DEBUG] Health !NOT JSON! Body snippet:', text.substring(0, 200));
        }
    } catch (e) {
        console.error('Health Check Failed:', e);
    }
    console.log('[DEBUG] Finished Health Check');
}

async function run() {
    await testHealth();
    console.log('-----------------------------------');
    console.log('Starting Sync Test...');
    await testSync();
    console.log('-----------------------------------');
    console.log('Starting Awakening Test...');
    await testAwakening();
    console.log('-----------------------------------');
    console.log('Starting Mystery Test...');
    await testMystery();
    console.log('-----------------------------------');
    console.log('All Tests Completed.');
}

run();
