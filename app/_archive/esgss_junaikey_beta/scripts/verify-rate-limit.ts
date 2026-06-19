import axios from 'axios';

const BASE_URL = 'http://localhost:3005/api';
// Using 3005 for temporary verification server
// server.ts default port is 3001 (line 123), though process.env.PORT might override.
// We will try 3001.

async function verifyRateLimiting() {
    console.log(`🛡️  Verifying Rate Limiting on ${BASE_URL} ...`);

    // 1. Test Global Read Limiter / Agent Route Limiter
    // agentRoutes has readLimiter (200/min)
    // server should have apiRateLimiter (100/15min) -> This is stricter!

    console.log('\n--- Test 1: High Volume GET Requests (Agents) ---');
    let success = 0;
    let rateLimited = 0;
    let otherErrors = 0;

    const totalRequests = 250; // Enough to trigger the 100 limit if global is applied // Target /api/news which uses readLimiter (200 req/min)

    const requests = [];

    const start = Date.now();

    for (let i = 0; i < totalRequests; i++) {
        requests.push(
            axios.get(`${BASE_URL}/news`)
                .then((res) => {
                    process.stdout.write('.');
                    success++;
                    if (i === 0) console.log('First Request Headers (RateLimit):', res.headers['rate-limit-remaining'], res.headers['x-ratelimit-remaining']);
                })
                .catch((err) => {
                    if (err.response) {
                        if (err.response.status === 429) {
                            process.stdout.write('x');
                            rateLimited++;
                        } else {
                            process.stdout.write('E');
                            otherErrors++;
                            console.error(`Error: ${err.message} Status: ${err.response?.status}`);
                        }
                    } else {
                        console.error('Network Error:', err.message);
                        otherErrors++;
                    }
                })
        );
        // Add small delay to avoid network congestion, but fast enough to hit rate limit
        if (i % 10 === 0) await new Promise(r => setTimeout(r, 10));
    }

    await Promise.all(requests);
    const duration = (Date.now() - start) / 1000;

    console.log(`\n\nResults for ${totalRequests} requests in ${duration.toFixed(2)}s:`);
    console.log(`✅ Success (200 OK): ${success}`);
    console.log(`🚫 Rate Limited (429): ${rateLimited}`);
    console.log(`⚠️  Other Errors: ${otherErrors}`);

    if (rateLimited > 0) {
        console.log('✅ Rate Limiting is ACTIVE and WORKING.');
    } else {
        console.log('❌ Rate Limiting NOT detected (or limits not reached).');
    }
}

verifyRateLimiting().catch(err => console.error(err));
