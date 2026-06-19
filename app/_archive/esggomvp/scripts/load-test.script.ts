import { omniOne } from '../src/core/omni-one';
import { LogCategory, omniLogger } from '../src/core/omniLogger';

/**
 * ⚡ InfoOne Alpha Performance Benchmarking
 * =========================================
 * Simulates concurrent manifestation intents for the 24 MECE services.
 */

async function runLoadTest(concurrentUsers: number = 10, requestsPerUser: number = 5) {
    omniLogger.info(LogCategory.SYSTEM, `🚀 Starting Alpha Load Test: ${concurrentUsers} users, ${requestsPerUser} requests/user`);

    const startTime = Date.now();
    let successCount = 0;
    let failCount = 0;
    const latencies: number[] = [];

    const intents = [
        'Carbon Inventory Q1',
        'Corporate Health Check',
        'AI Strategy Strategy',
        'One-Click Report Forging',
        'Nexus Bridge Sync'
    ];

    const tasks = [];

    for (let u = 0; u < concurrentUsers; u++) {
        for (let r = 0; r < requestsPerUser; r++) {
            tasks.push(async () => {
                const reqStart = Date.now();
                try {
                    const intent = intents[Math.floor(Math.random() * intents.length)];
                    const atom = await omniOne.manifest({
                        intent,
                        type: 'Intelligence',
                        payload: { test: true, timestamp: Date.now() },
                        domainRef: 'TEST_BENCHMARK',
                        impactMetric: 'Performance Verification'
                    });

                    if (atom.uuid) {
                        successCount++;
                        latencies.push(Date.now() - reqStart);
                    }
                } catch (err) {
                    failCount++;
                    console.error("❌ Request failed:", err);
                }
            });
        }
    }

    await Promise.all(tasks.map(t => t()));

    const totalTime = Date.now() - startTime;
    const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;

    console.log("\n--- 📊 Alpha Load Test Results ---");
    console.log(`Total Requests: ${successCount + failCount}`);
    console.log(`Success: ${successCount}`);
    console.log(`Failures: ${failCount}`);
    console.log(`Total Duration: ${totalTime}ms`);
    console.log(`Avg Latency: ${avgLatency.toFixed(2)}ms`);
    console.log(`Throughput: ${((successCount + failCount) / (totalTime / 1000)).toFixed(2)} req/s`);
    console.log("----------------------------------\n");
}

// Execute benchmark
runLoadTest(20, 10).catch(console.error);
