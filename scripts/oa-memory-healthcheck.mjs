#!/usr/bin/env node
// OA-Team 蜂群記憶健康檢查 (排程用)
//
// 週期性驗證「雙蜂跨代理共享記憶」管線是否活著:
//   - core /health ok?
//   - 寫入 (Bee-07 + Bee-03) ok?
//   - 彼此召回 ok?
//
// 環境:
//   TDAI_GATEWAY_URL / TDAI_GATEWAY_API_KEY / TDAI_SERVICE_ID (同 smoke test)
//   HEALTHCHECK_QUIET=1 → 只在異常時印 (適合 cron 靜默成功)
//
// 退出碼: 0 = 健康, 1 = 異常 (供告警/監控判定)
import process from 'node:process';

const CORE = process.env.TDAI_GATEWAY_URL ?? 'http://127.0.0.1:8420';
const KEY = process.env.TDAI_GATEWAY_API_KEY ?? '';
const SVC = process.env.TDAI_SERVICE_ID ?? 'oa-team-swarm';
const USER = 'admin';
const QUIET = process.env.HEALTHCHECK_QUIET === '1';
const TIMEOUT_MS = Number(process.env.OA_MEMORY_TEST_TIMEOUT_MS ?? 30000);

function authHeaders() {
  const h = { 'content-type': 'application/json' };
  if (KEY) h['authorization'] = `Bearer ${KEY}`;
  if (SVC) h['x-tdai-service-id'] = SVC;
  return h;
}
async function ping() {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 5000);
  try {
    const r = await fetch(`${CORE}/health`, { signal: ac.signal });
    if (!r.ok) return { ok: false, detail: `HTTP ${r.status}` };
    const d = await r.json().catch(() => null);
    return { ok: d?.status === 'ok', detail: JSON.stringify(d) };
  } catch (e) {
    return { ok: false, detail: String(e.message || e) };
  } finally {
    clearTimeout(t);
  }
}
async function capture(sid, agent, content) {
  const res = await fetch(`${CORE}/v3/conversation/add`, {
    method: 'POST', headers: authHeaders(),
    body: JSON.stringify({ service_id: SVC, user_id: USER, session_id: sid, messages: [{ role: 'user', content: `[${agent}] ${content}` }] }),
  });
  const d = await res.json().catch(() => ({}));
  return { ok: res.ok, code: d.code, ids: d.data?.accepted_ids };
}
async function recall(sid, query) {
  const res = await fetch(`${CORE}/v3/conversation/search`, {
    method: 'POST', headers: authHeaders(),
    body: JSON.stringify({ service_id: SVC, user_id: USER, session_id: sid, query }),
  });
  const d = await res.json().catch(() => ({}));
  return d.data?.messages ?? [];
}
async function withTimeout(p, ms, tag) {
  return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(`TIMEOUT@${tag}`)), ms))]);
}

async function main() {
  const checks = [];
  const h = await ping();
  checks.push(['core/health', h.ok, h.detail]);
  if (!h.ok) return finish(checks);

  const sid = `oa-health-${Date.now()}`;
  const w1 = await withTimeout(capture(sid, 'Bee-07 編碼蜂', `healthcheck ${new Date().toISOString()}`), TIMEOUT_MS, 'w1').catch((e) => ({ ok: false, code: e.message }));
  const w2 = await withTimeout(capture(sid, 'Bee-03 分析蜂', 'healthcheck recall probe'), TIMEOUT_MS, 'w2').catch((e) => ({ ok: false, code: e.message }));
  checks.push(['Bee-07 寫入', !!w1.ok, JSON.stringify(w1)]);
  checks.push(['Bee-03 寫入', !!w2.ok, JSON.stringify(w2)]);

  const r1 = await withTimeout(recall(sid, 'healthcheck'), TIMEOUT_MS, 'r1').catch(() => []);
  const r2 = await withTimeout(recall(sid, 'healthcheck recall'), TIMEOUT_MS, 'r2').catch(() => []);
  const cross = r1.some((m) => m.content.includes('Bee-07')) && r2.some((m) => m.content.includes('Bee-03'));
  checks.push(['跨代理召回', cross, `r1=${r1.length} r2=${r2.length}`]);

  finish(checks);
}
function finish(checks) {
  const allOk = checks.every((c) => c[1]);
  if (!QUIET || !allOk) {
    console.log(`🐝 OA-Team 記憶健康檢查 @ ${new Date().toISOString()}`);
    for (const [name, ok, detail] of checks) console.log(`  [${ok ? 'OK' : 'FAIL'}] ${name} — ${detail}`);
    console.log(`RESULT: ${allOk ? 'HEALTHY ✅' : 'UNHEALTHY ❌'}`);
  }
  process.exit(allOk ? 0 : 1);
}
main().catch((e) => { console.error('HEALTHCHECK_ERR:', e); process.exit(1); });
