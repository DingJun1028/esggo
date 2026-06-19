import fetch from 'node-fetch';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;
const BASE_URL = `http://localhost:${PORT}/api`;
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const TEST_USER_ID = 'verify-cache-user-001';

// Generate Test Token
const TEST_TOKEN = jwt.sign(
    {
        id: TEST_USER_ID,
        userId: TEST_USER_ID, // Ensure compatibility with different payload expectations
        role: 'user',
        email: 'verify@example.com'
    },
    JWT_SECRET,
    { expiresIn: '1h' }
);

const HEADERS = {
    'Authorization': `Bearer ${TEST_TOKEN}`,
    'Content-Type': 'application/json'
};

const ENDPOINTS = [
    { path: '/news', name: 'Public News' }, // Assuming public
    { path: '/profile/leaderboard', name: 'Profile Leaderboard' },
    { path: `/profile/${TEST_USER_ID}`, name: 'User Profile' },
    { path: `/game/state/${TEST_USER_ID}`, name: 'Game State' },
    { path: '/ncb/data/schema', name: 'NCB Schema' },
    // { path: '/ncb/data/tables/users/rows', name: 'NCB Table Rows' } // Commented out to avoid 404 if table doesn't exist
];

async function benchmark() {
    console.log('🌟 [REDIS CACHE] Starting Benchmark with Auth...\n');
    console.log(`🔑 Generated Test Token for User: ${TEST_USER_ID}`);

    for (const endpoint of ENDPOINTS) {
        console.log(`--- Testing Endpoint: ${endpoint.name} (${endpoint.path}) ---`);

        try {
            // 1. First Request (Cache MISS)
            const start1 = Date.now();
            const res1 = await fetch(`${BASE_URL}${endpoint.path}`, { headers: HEADERS });
            const end1 = Date.now();
            const cacheHeader1 = res1.headers.get('X-Cache');
            const cacheKey1 = res1.headers.get('X-Cache-Key');
            console.log(`[1st Request] Status: ${res1.status}, X-Cache: ${cacheHeader1}, Key: ${cacheKey1}, Time: ${end1 - start1}ms`);

            if (res1.status === 401 || res1.status === 403) {
                console.warn(`⚠️ [AUTH FAIL] Access denied. Check JWT_SECRET or route permissions.`);
                const text = await res1.text();
                console.warn(`[DEBUG] Response: ${text}`);
                continue;
            }

            if (res1.status >= 400) {
                try {
                    const text = await res1.text();
                    try {
                        const json = JSON.parse(text);
                        console.warn(`[DEBUG] 1st Request Failed (${res1.status}):`, JSON.stringify(json, null, 2));
                    } catch {
                        try {
                            const json = JSON.parse(text);
                            console.warn(`[DEBUG] 1st Request Failed (${res1.status}):`, JSON.stringify(json, null, 2));
                        } catch {
                            console.warn(`[DEBUG] 1st Request Failed (${res1.status}): ${text.substring(0, 500)}`);
                        }
                    }
                } catch (e) {
                    console.warn(`[DEBUG] 1st Request Failed (${res1.status}): Could not read body.`);
                }
            }

            // 2. Second Request (Cache HIT)
            const start2 = Date.now();
            const res2 = await fetch(`${BASE_URL}${endpoint.path}`, { headers: HEADERS });
            const end2 = Date.now();
            const cacheHeader2 = res2.headers.get('X-Cache');
            const cacheKey2 = res2.headers.get('X-Cache-Key');
            console.log(`[2nd Request] Status: ${res2.status}, X-Cache: ${cacheHeader2}, Key: ${cacheKey2}, Time: ${end2 - start2}ms`);



            if (cacheHeader2 === 'HIT') {
                const improvement = ((end1 - start1) - (end2 - start2));
                const percentage = (end1 - start1) > 0 ? ((improvement / (end1 - start1)) * 100).toFixed(2) : "0.00";
                console.log(`✅ [SUCCESS] Cache HIT confirmed. Performance improved by ${improvement}ms (${percentage}%).\n`);
            } else if (res2.status >= 500) {
                try {
                    const text = await res2.text();
                    try {
                        const json = JSON.parse(text);
                        console.error(`❌ [FAILURE] Server error on 2nd request: ${res2.status}`, JSON.stringify(json, null, 2));
                    } catch {
                        console.error(`❌ [FAILURE] Server error on 2nd request: ${res2.status} - ${text.substring(0, 500)}`);
                    }
                } catch (e) {
                    console.error(`❌ [FAILURE] Server error on 2nd request: ${res2.status} - Could not read body.`);
                }
            } else {
                console.warn(`❌ [FAILURE] Cache MISS on second request. Check server implementation or Cache-Control headers.\n`);
            }
        } catch (err: any) {
            console.error(`❌ [ERROR] Request failed: ${err.message}\n`);
        }
    }

    // 3. Health Check Verification
    console.log('--- System Health Check ---');
    try {
        const healthRes = await fetch(`${BASE_URL}/health`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const healthData = await healthRes.json() as any;

        if (healthData.data?.redis_status) {
            console.log('✅ [SUCCESS] Redis detailed status visible in health check.');
            console.log(`[REDIS] Connected: ${healthData.data.redis_status.connected}, Store: ${healthData.data.redis_status.store}`);
        } else {
            console.warn('❌ [FAILURE] Redis status missing from health check.');
            // console.log('DEBUG: Health Data Structure:', JSON.stringify(healthData, null, 2));
        }
    } catch (e: any) {
        console.error('Failed to fetch health check:', e.message);
    }
}

benchmark().catch(err => {
    console.error('Benchmark Error:', err.message);
    console.log('\n💡 Tip: Ensure the server is running on port 3001 (npm run dev)');
});
