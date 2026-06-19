
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001/api';

async function testRateLimit(endpoint: string, limit: number, name: string) {
    console.log(`\n🛡️ [RATE LIMIT TEST] Testing ${name} (${limit} req/window)...`);

    let success = 0;
    let blocked = 0;
    const totalRequests = limit + 10; // Try to exceed the limit

    const startTime = Date.now();

    for (let i = 0; i < totalRequests; i++) {
        try {
            const res = await fetch(`${BASE_URL}${endpoint}`);
            if (res.status === 200 || res.status === 201 || res.status === 404 || res.status === 400 || res.status === 401) {
                // 404/400/401 are also "success" in terms of reaching the application layer (not blocked by rate limiter)
                success++;
                process.stdout.write('.');
            } else if (res.status === 429) {
                blocked++;
                process.stdout.write('X');
            } else {
                process.stdout.write('?');
            }
        } catch (e: any) {
            console.error(`Request failed: ${e.message}`);
        }
    }

    const duration = Date.now() - startTime;
    console.log(`\nResults for ${name}:`);
    console.log(`✅ Passed: ${success}`);
    console.log(`⛔ Blocked: ${blocked}`);
    console.log(`⏱️ Duration: ${duration}ms`);

    if (blocked > 0) {
        console.log(`✅ [PASS] ${name} Rate Limiter is ACTIVE.`);
    } else {
        console.warn(`❌ [FAIL] ${name} Rate Limiter did NOT trigger. Check configuration.`);
    }
}

async function runTests() {
    console.log('🚀 Starting Rate Limit Verification Suite');

    // Test 1: Global API Limit (approx 100/15min)
    // We might not want to flood 100 requests in a quick test, but let's try a burst.
    // NOTE: This might ban us for subsequent tests if not careful.
    // For specific limiters with lower thresholds, it's easier to test.

    // Test 2: Read Limiter (200/min) is high, hard to test quickly without spamming.

    // Test 3: Auth/Sensitive (5/15min) - This is great for testing.
    // Assuming /api/manifest is auth limited (or we can use a known auth route if available without credentials for 401s)
    // Ideally we hit an endpoint that uses 'authLimiter' or 'sensitiveOperationLimiter'.
    // Looking at server.ts: app.post('/api/manifest', authLimiter, ...)

    // We need to send POST for manifest
    console.log(`\n🛡️ [RATE LIMIT TEST] Testing Sensitive/Auth Limiter (5 req/window)...`);
    let sensitiveBlocked = 0;
    for (let i = 0; i < 10; i++) {
        try {
            const res = await fetch(`${BASE_URL}/manifest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ source_agent: 'test' }) // Invalid but should hit limiter
            });
            if (res.status === 429) {
                sensitiveBlocked++;
                process.stdout.write('X');
            } else {
                process.stdout.write('.');
            }
        } catch (e) { }
    }

    if (sensitiveBlocked > 0) {
        console.log(`\n✅ [PASS] Sensitive/Auth Limiter is ACTIVE. Blocked ${sensitiveBlocked} requests.`);
    } else {
        console.warn(`\n❌ [FAIL] Sensitive/Auth Limiter did NOT trigger.`);
    }

    // Test 4: AI Chat Limiter (30/min)
    // Endpoint: /api/interact
    console.log(`\n🛡️ [RATE LIMIT TEST] Testing AI Chat Limiter (30 req/min)...`);
    let aiBlocked = 0;
    // We need a session ID to get past 400, but 400s might still count towards rate limit if it's applied before validation?
    // In server.ts: app.get('/api/interact', aiChatLimiter, authenticateRequest, ...)
    // Rate limit comes BEFORE auth, so we can test with invalid requests.

    for (let i = 0; i < 35; i++) {
        try {
            const res = await fetch(`${BASE_URL}/interact?sessionId=test&message=test`);
            if (res.status === 429) {
                aiBlocked++;
                process.stdout.write('X');
            } else {
                process.stdout.write('.');
            }
        } catch (e) { }
    }

    if (aiBlocked > 0) {
        console.log(`\n✅ [PASS] AI Chat Limiter is ACTIVE. Blocked ${aiBlocked} requests.`);
    } else {
        console.warn(`\n❌ [FAIL] AI Chat Limiter did NOT trigger.`);
    }
}

runTests().catch(console.error);
