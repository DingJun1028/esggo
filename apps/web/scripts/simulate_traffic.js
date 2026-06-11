const http = require('http');
const fs = require('fs');

// ==========================================
// ESGGO - 高流量模擬測試腳本 (Load Testing)
// ==========================================

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:3000/omni-workflows';
const CONCURRENCY = parseInt(process.env.CONCURRENCY) || 50; // 併發數量
const DURATION_SEC = parseInt(process.env.DURATION_SEC) || 30; // 測試持續時間(秒)

console.log(`🚀 啟動高流量模擬測試...`);
console.log(`📍 目標網址: ${TARGET_URL}`);
console.log(`⚡ 併發連線: ${CONCURRENCY}`);
console.log(`⏱️ 持續時間: ${DURATION_SEC} 秒`);

let requestCount = 0;
let errorCount = 0;
const startTime = Date.now();
const endTime = startTime + (DURATION_SEC * 1000);

function makeRequest() {
    if (Date.now() >= endTime) return;

    http.get(TARGET_URL, (res) => {
        res.on('data', () => { }); // 消耗 response data 避免內存洩漏
        res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                requestCount++;
            } else {
                errorCount++;
            }
            makeRequest(); // 完成後立刻發起下一個請求
        });
    }).on('error', (err) => {
        errorCount++;
        makeRequest();
    });
}

// 啟動併發 Worker
for (let i = 0; i < CONCURRENCY; i++) {
    makeRequest();
}

const interval = setInterval(() => {
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    console.log(`📊 執行中... 已發送 ${requestCount} 請求 (錯誤: ${errorCount}) - 耗時 ${elapsed}s`);

    if (now >= endTime) {
        clearInterval(interval);
        const rps = (requestCount / DURATION_SEC).toFixed(2);
        console.log('\n✅ 測試完成！');
        console.log(`📈 總請求數: ${requestCount}`);
        console.log(`❌ 錯誤數: ${errorCount}`);
        console.log(`⚡ RPS (Requests per second): ${rps} req/s`);
        console.log('👉 請前往 New Relic APM 儀表板觀察 Throughput 與 Transaction 時間！');

        // 輸出供 GitHub Actions 使用
        if (process.env.GITHUB_OUTPUT) {
            fs.appendFileSync(process.env.GITHUB_OUTPUT, `total_requests=${requestCount}\n`);
            fs.appendFileSync(process.env.GITHUB_OUTPUT, `error_count=${errorCount}\n`);
            fs.appendFileSync(process.env.GITHUB_OUTPUT, `rps=${rps}\n`);
        }

        // 讓 CI 知道發生異常並顯示紅燈
        if (errorCount > 0) {
            process.exit(1);
        }
    }
}, 2000);