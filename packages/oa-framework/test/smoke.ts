/**
 * OA Framework smoke test — 驗證 7 子框架註冊 + 5T 鑄造
 * 執行: npx tsx test/smoke.ts
 */
import { createOAFrame, verify5T, OA_SUBFRAMES } from '../src/index.js';

async function main() {
  const oa = createOAFrame({
    llmModel: 'gemini-2.5-flash',
    memoryGateway: 'http://127.0.0.1:8420',
  });

  console.log('=== OA 元框架啟動 ===');
  console.log('已註冊子框架:', OA_SUBFRAMES.length, '個');

  const task = { id: 't1', prompt: '為 ESG-GO 產出 5T 合規元件骨架' };
  const results = await oa.run(task);

  console.log('\n=== 7 框架並行產出 (5T 雙層鑄造: 欄位級 + 內容級 omni-gate) ===');
  let allPass = true;
  for (const r of results) {
    const v = verify5T(r);
    if (!v.pass) allPass = false;
    const contentTag = v.contentPassed ? 'CONTENT_OK' : `CONTENT_FAIL:${v.failed.filter(f=>f.startsWith('content:')).join(',')}`;
    console.log(
      `[${r.subFrame}] hash=${r.hashLock.slice(0, 12)}... field=${v.pass && v.contentPassed ? 'PASS' : 'FAIL'} ${contentTag}`
    );
  }

  const health = await oa.healthAll();
  console.log('\n=== 健康檢查 ===');
  for (const [id, h] of Object.entries(health)) {
    console.log(`  ${id}: ${h.status}`);
  }

  console.log(`\nRESULT: ${results.length === 7 && allPass ? 'ALL_7_FRAMEWORKS_OK' : 'INCOMPLETE'}`);
}

main().catch((e) => {
  console.error('SMOKE_FAIL:', e);
  process.exit(1);
});
