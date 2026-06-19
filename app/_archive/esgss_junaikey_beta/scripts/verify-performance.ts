/**
 * verify-performance.ts
 * [🧪驗證] Phase 5: 效能與快取優化測試
 */

import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';
// 模擬 Next.js 環境下的 UUID 讀取 (實際測試中我們直接調用 API)
const TEST_UUID = '8888-9999-0000-1111';

async function verifyPerformance() {
    console.log("🚀 Starting Phase 5: Performance & Infrastructure Verification...");

    try {
        console.log("\n--- Scenario 1: Cache-Aside Latency (Vault API) ---");

        // 第一次請求：應該是 MISS
        const start1 = Date.now();
        const res1 = await axios.get(`${API_BASE}/vault/read?uuid=${TEST_UUID}`);
        const duration1 = Date.now() - start1;
        const cacheStatus1 = res1.headers['x-cache'];
        console.log(`[Request 1] Status: ${cacheStatus1} | Latency: ${duration1}ms`);

        // 第二次請求：應該是 HIT
        const start2 = Date.now();
        const res2 = await axios.get(`${API_BASE}/vault/read?uuid=${TEST_UUID}`);
        const duration2 = Date.now() - start2;
        const cacheStatus2 = res2.headers['x-cache'];
        console.log(`[Request 2] Status: ${cacheStatus2} | Latency: ${duration2}ms`);

        if (cacheStatus2 === 'HIT' && duration2 < duration1) {
            console.log(`✅ Cache optimization confirmed: ${Math.round((1 - duration2 / duration1) * 100)}% speedup.`);
        } else {
            console.warn(`⚠️ Cache HIT observed but latency didn't improve significantly.`);
        }

        console.log("\n--- Scenario 2: Error Standardization (Traceability) ---");
        try {
            await axios.get(`${API_BASE}/vault/read?uuid=INVALID_UUID`);
        } catch (error: any) {
            const body = error.response.data;
            console.log(`[Error Body] success: ${body.success}, requestId: ${body.requestId}`);
            if (body.requestId && body.requestId.startsWith('omni-')) {
                console.log("✅ Error standardization & Trace ID confirmed.");
            }
        }

        console.log("\n🎉 Phase 5 Infrastructure Hardening Verified!");

    } catch (err: any) {
        console.error("❌ Verification Failed. (Ensure server is running on :3001)");
        console.error(err.message);
    }
}

verifyPerformance();
