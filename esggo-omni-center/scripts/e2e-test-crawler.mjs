// ============================================================
// E2E Test: FSC Crawler → Sonar Bridge → Subscription Engine
// scripts/e2e-test-crawler.mjs
// Run: node scripts/e2e-test-crawler.mjs
// ============================================================

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// We need to test the TS modules — use tsx or transpile on the fly
// For simplicity, test the HTTP API endpoints instead (black-box)

const BASE = 'http://localhost:3000';
let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ❌ ${name} — ${err.message}`);
    failed++;
  }
}

async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

console.log('═══════════════════════════════════════');
console.log(' ESGSonar E2E Test Suite');
console.log('═══════════════════════════════════════\n');

// ─── Phase 1: Health Check ─────────────────────────────────
console.log('Phase 1: Health Check');
await test('GET /api/health 回傳 200', async () => {
  const data = await fetchJSON(`${BASE}/api/health`);
  if (!data.status && !data.components) throw new Error('No status returned');
});
await test('Health 含 esgsonar_component', async () => {
  const data = await fetchJSON(`${BASE}/api/health`);
  const has = data.components?.esgsonar_crawler || data.esgsonar_crawler || JSON.stringify(data).includes('esgsonar');
  if (!has) throw new Error('Missing esgsonar component in health');
});

// ─── Phase 2: Crawl API ────────────────────────────────────
console.log('\nPhase 2: Crawl API');
await test('GET /api/sonnar/crawl 回傳 scheduler 狀態', async () => {
  const data = await fetchJSON(`${BASE}/api/sonnar/crawl`);
  if (!data.success) throw new Error('success !== true');
  if (!data.data) throw new Error('No data field');
});

await test('POST /api/sonnar/crawl 觸發 tw-fsc 爬蟲', async () => {
  const data = await fetchJSON(`${BASE}/api/sonnar/crawl`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sourceId: 'tw-fsc' }),
  });
  if (!data.success) throw new Error('Crawl trigger failed');
  console.log(`    → itemsFound: ${data.data?.itemsFound || 0}, eventsGenerated: ${data.data?.eventsGenerated || 0}`);
});

// ─── Phase 3: Radar API ────────────────────────────────────
console.log('\nPhase 3: Radar & Signals');
await test('GET /api/sonnar/radar 回傳信號概覽', async () => {
  const data = await fetchJSON(`${BASE}/api/sonnar/radar`);
  if (!data.success) throw new Error('success !== true');
});

// ─── Phase 4: Alerts API ───────────────────────────────────
console.log('\nPhase 4: Alerts');
await test('GET /api/sonnar/alerts 回傳警報列表', async () => {
  const data = await fetchJSON(`${BASE}/api/sonnar/alerts`);
  if (!data.success) throw new Error('success !== true');
});

// ─── Summary ───────────────────────────────────────────────
console.log('\n═══════════════════════════════════════');
console.log(` 結果: ${passed} passed, ${failed} failed`);
console.log('═══════════════════════════════════════');
process.exit(failed > 0 ? 1 : 0);
