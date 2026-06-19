import jwt from 'jsonwebtoken';
import fs from 'fs';
import fetch from 'node-fetch';

const USER_ID = '550e8400-e29b-41d4-a716-446655440000';
const JWT_SECRET = 'esg-sunshine-junaikey-secret-2026';
const API_BASE = 'http://localhost:5000/api/game';

async function run() {
    const token = jwt.sign({ id: USER_ID }, JWT_SECRET, { expiresIn: '1h' });
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const results: any = { timestamp: new Date().toISOString(), tests: [] };

    const endpoints = [
        { name: 'health', url: 'http://localhost:5000/api/health', method: 'GET' },
        { name: 'sync', url: `${API_BASE}/sync`, method: 'POST', body: { userId: USER_ID, state: { level: 1 } } },
        { name: 'awaken', url: `${API_BASE}/awaken/instant-win`, method: 'POST', body: { userId: USER_ID } },
        { name: 'mystery', url: `${API_BASE}/awaken/mystery`, method: 'GET' }
    ];

    for (const ep of endpoints) {
        try {
            const res = await fetch(ep.url, {
                method: ep.method,
                headers,
                body: ep.body ? JSON.stringify(ep.body) : undefined
            });
            results.tests.push({
                name: ep.name,
                status: res.status,
                success: res.ok,
                body: await res.json().catch(() => 'NOT_JSON')
            });
        } catch (e: any) {
            results.tests.push({ name: ep.name, error: e.message });
        }
    }

    fs.writeFileSync('verification_results.json', JSON.stringify(results, null, 2));
    console.log('Verification report generated: verification_results.json');
}

run();
