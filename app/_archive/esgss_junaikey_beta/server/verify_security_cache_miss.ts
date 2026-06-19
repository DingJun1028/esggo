
const BASE_URL = 'http://localhost:3001/api/news'; // Using news endpoint which has cacheMiddleware

async function attack() {
    console.log('🛡️ [SECURITY TEST] Starting Cache Miss Attack Simulation...');

    let successCount = 0;
    let blockedCount = 0;

    for (let i = 0; i < 60; i++) {
        // Append random query param to ensure cache miss
        const url = `${BASE_URL}?q=${Math.random().toString(36).substring(7)}`;
        try {
            const res = await fetch(url);

            if (res.status === 200) {
                successCount++;
                process.stdout.write('.');
            } else if (res.status === 429) {
                blockedCount++;
                process.stdout.write('X');
            } else {
                process.stdout.write('?');
            }
        } catch (e) {
            console.error(e);
        }
    }

    console.log('\n\n--- Results ---');
    console.log(`✅ Successful Requests: ${successCount}`);
    console.log(`🛡️ Blocked Requests (429): ${blockedCount}`);

    if (blockedCount > 0) {
        console.log('\n✅ [SUCCESS] Cache Miss Limiter is active and blocking attacks.');
    } else {
        console.warn('\n❌ [FAILURE] No requests were blocked. Check middleware configuration.');
    }
}

attack();
