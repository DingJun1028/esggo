const http = require('http');

function request(path, method, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    });

    req.on('error', error => reject(error));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("=== API 健康度檢查開始 ===");

  try {
    // 1. Test Ingest API
    console.log("\\n[1] 測試 /api/omni-agent/ingest (RAG 智庫寫入端點)...");
    const ingestRes = await request('/api/omni-agent/ingest', 'POST', {
      documentName: 'test_architecture.md',
      content: 'OmniAgent is testing the pipeline.'
    });
    console.log(`Status: ${ingestRes.statusCode}`);
    console.log(`Response: ${ingestRes.data}`);

    // 2. Test Chat API
    console.log("\\n[2] 測試 /api/omni-agent/chat (LLM 串流對話端點)...");
    const chatRes = await request('/api/omni-agent/chat', 'POST', {
      messages: [{ role: 'user', content: '哈囉，OmniAgent！請測試連線。' }]
    });
    console.log(`Status: ${chatRes.statusCode}`);
    console.log(`Response: ${chatRes.data}`);

    // 3. Test ESG Metrics API
    console.log("\\n[3] 測試 /api/metrics/esg (儀表板資料端點)...");
    const metricsRes = await request('/api/metrics/esg', 'GET');
    console.log(`Status: ${metricsRes.statusCode}`);
    console.log(`Response: ${metricsRes.data.substring(0, 100)}... (truncated)`);

    console.log("\\n=== API 測試完畢 ===");
  } catch (err) {
    console.error("測試發生錯誤:", err.message);
  }
}

runTests();
