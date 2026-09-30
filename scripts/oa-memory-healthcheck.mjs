#!/usr/bin/env node
// OA-Team 蜂群記憶健康檢查 (排程用，Telegram 告警版)
//
// 檢查項目:
//   1. core /health 狀態 + services.timerScanner.scansCompleted 增量
//   2. 雙蜂寫入 (Bee-07 + Bee-03)
//   3. 雙蜂跨代理召回 (r1/r2 長度 > 0)
//   4. 寫入次數 > 0 且召回 > 0 才視為「有蜂群在使用」
//
// 環境:
//   TDAI_GATEWAY_URL / TDAI_GATEWAY_API_KEY / TDAI_SERVICE_ID
//   HEALTHCHECK_QUIET=1 → 只有異常時輸出 (cron 靜默成功)
//   OA_MEMORY_MIN_WRITES=1  最低寫入成功數 (預設 2 = 兩隻蜂都要寫入)
//   OA_MEMORY_MIN_RECALL=1  最低召回成功數 (預設 1 = 至少一隻蜂召回 > 0)
//   OA_MEMORY_TEST_TIMEOUT_MS=30000 單步 timeout
//   OA_MEMORY_PING_TIMEOUT_MS=30000 /health timeout (預設 30s；勿設得比實測 RTT 小)
//   OA_MEMORY_RECALL_RETRY_MS=90000  跨代理召回重試 budget（等向量索引追上寫入）
//   OA_MEMORY_RECALL_INTERVAL_MS=5000 重試間隔
//
// 退出碼: 0 = 健康, 1 = 異常

import process from 'node:process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

// ── 金鑰解析（2026-09-21 修）───────────────────────────────────────────────
// Bearer gate 用的是 gateway 的 server.apiKey（32 bytes），
// **不是** .admin-key（39 bytes 的 sk-mem-... user_key）。兩者混用會全部 401。
// cron 會顯式 export TDAI_GATEWAY_API_KEY=.admin-key（錯誤的 user_key），
// 所以不能只靠 env 優先：env key 若 401，要能自動改試 yaml 裡真正的 gateway key。
function gatewayKeyFromYaml() {
  const candidates = [
    'C:/Users/dingj/.memory-tencentdb/memory-tdai/tdai-gateway.yaml',
    path.join(process.env.USERPROFILE ?? 'C:/Users/dingj', '.memory-tencentdb/memory-tdai/tdai-gateway.yaml'),
    '/c/Project/esggo/apps/tencentdb-memory/.memory-core-config/tdai-gateway.yaml',
  ];

  for (const f of candidates) {
    try {
      if (!fs.existsSync(f)) continue;
      const txt = fs.readFileSync(f, 'utf8');
      // 取 server: 區塊下的 apiKey（第一個縮排 apiKey）
      const m = txt.match(/^server:\s*\n(?:[ \t]+.*\n)*?[ \t]+apiKey:\s*"?([^"\r\n]+)"?/m)
             ?? txt.match(/^[ \t]+apiKey:\s*"?([^"\r\n]+)"?/m);
      const k = m?.[1]?.trim();
      if (k) return k;
    } catch { /* 繼續下一個候選 */ }
  }
  return '';
}

function resolveKey() {
  return process.env.TDAI_GATEWAY_API_KEY || gatewayKeyFromYaml() || fallbackAdminKey();
}

function fallbackAdminKey() {
  try {
    return fs.readFileSync('/c/Project/esggo/apps/tencentdb-memory/.admin-key', 'utf8').trim();
  } catch { return ''; }
}

const CORE = process.env.TDAI_GATEWAY_URL ?? 'http://127.0.0.1:8420';
// 可變：401 時會換成 yaml 的 gateway key 重試
let KEY = resolveKey();
let KEY_SWITCHED = false;
const SVC = process.env.TDAI_SERVICE_ID ?? 'oa-team-swarm';
const USER = 'admin';
const QUIET = process.env.HEALTHCHECK_QUIET === '1';
const TIMEOUT_MS = Number(process.env.OA_MEMORY_TEST_TIMEOUT_MS ?? 30000);
// /health 的 budget 必須 >= 實際 RTT。本機 TDAI 在忙碌時單次 /v3/conversation/search
// 實測要 10~17s，固定 5s 的 AbortController 會讓 ping 誤報 "This operation was aborted"
// → 假告警。預設拉高到 30s（與 TIMEOUT_MS 同級），可用 env 覆寫。
const PING_TIMEOUT_MS = Number(process.env.OA_MEMORY_PING_TIMEOUT_MS ?? 30000);
const MIN_WRITES = Number(process.env.OA_MEMORY_MIN_WRITES ?? 2);
const MIN_RECALL = Number(process.env.OA_MEMORY_MIN_RECALL ?? 1);
// 探針 nonce：純隨機英數，**不可**含日期/時間戳。實測 (6 組對照) 內容帶
// '2026-09-30T05:00:59.168Z' 這類數字時間戳時，該則訊息在 :8420 永遠檢索不到
// （等 407s、分數凍結不變）；換成純英數 token 立即召回正常。
// 每輪隨機產生即可保證唯一（另由 sid 的 Date.now() 雙重保險）。
const PROBE_NONCE = crypto.randomBytes(5).toString('hex');

function authHeaders() {
  const h = { 'content-type': 'application/json' };
  if (KEY) h['authorization'] = `Bearer ${KEY}`;
  if (SVC) h['x-tdai-service-id'] = SVC;
  return h;
}

async function withTimeout(p, ms, tag) {
  return Promise.race([
    p,
    new Promise((_, rej) => setTimeout(() => rej(new Error(`TIMEOUT@${tag}`)), ms)),
  ]);
}

async function ping() {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), PING_TIMEOUT_MS);
  try {
    const r = await fetch(`${CORE}/health`, { signal: ac.signal });
    if (!r.ok) return { ok: false, detail: `HTTP ${r.status}`, raw: null };
    const d = await r.json().catch(() => null);
    return { ok: d?.status === 'ok', detail: JSON.stringify(d), raw: d };
  } catch (e) {
    return { ok: false, detail: String(e.message || e), raw: null };
  } finally {
    clearTimeout(t);
  }
}

async function capture(sid, agent, content) {
  const res = await fetch(`${CORE}/v3/conversation/add`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      service_id: SVC,
      user_id: USER,
      session_id: sid,
      messages: [{ role: 'user', content: `[${agent}] ${content}` }],
    }),
  });
  const d = await res.json().catch(() => ({}));
  return { ok: res.ok, code: d.code, ids: d.data?.accepted_ids };
}

async function recall(sid, query) {
  const res = await fetch(`${CORE}/v3/conversation/search`, {
    method: 'POST',
    headers: authHeaders(),
    // limit 是必要的：/v3/conversation/search 預設只回 top-1。兩隻蜂都寫了含
    // "healthcheck" 的訊息時，語意較近的那則永遠贏，單靠 query 區分不出兩隻蜂，
    // 跨代理召回會恆為 false → 假告警。實測 limit=10 才拿得到兩隻蜂各自的訊息。
    body: JSON.stringify({ service_id: SVC, user_id: USER, session_id: sid, query, limit: 10 }),
  });
  const d = await res.json().catch(() => ({}));
  return d.data?.messages ?? [];
}

// /v3/conversation/add 是「先回 ack，背景才建向量索引」的非同步管線。
// 寫完立刻搜尋會有競爭：先寫的那隻蜂（Bee-07）此時還沒進索引，搜尋只會撈到後寫的
// Bee-03 → 跨代理召回恆 false → 假告警。實測 r1 僅回 1 筆且為 BEE03，Bee-07 缺席。
// 修法 = 帶退避的重試：兩隻蜂都搜到就立刻回，否則在 budget 內繼續輪詢。
const RECALL_RETRY_MS = Number(process.env.OA_MEMORY_RECALL_RETRY_MS ?? 90000);
const RECALL_INTERVAL_MS = Number(process.env.OA_MEMORY_RECALL_INTERVAL_MS ?? 5000);

async function recallCross(sid) {
  const t0 = Date.now();
  let attempt = 0;
  let r1 = [];
  let r2 = [];
  let best = { r1: 0, r2: 0 };

  // 兩次搜尋並行：本機單次 search 實測 10~17s，序列做會讓一輪翻倍。
  for (;;) {
    attempt += 1;
    const [a, b] = await Promise.all([
      withTimeout(recall(sid, 'healthcheck'), TIMEOUT_MS, 'r1').catch(() => []),
      withTimeout(recall(sid, 'healthcheck recall'), TIMEOUT_MS, 'r2').catch(() => []),
    ]);
    r1 = a; r2 = b;
    best = { r1: Math.max(best.r1, r1.length), r2: Math.max(best.r2, r2.length) };
    const has7 = r1.some((m) => m.content?.includes('Bee-07'));
    const has3 = r2.some((m) => m.content?.includes('Bee-03'));
    if (has7 && has3) return { r1, r2, attempts: attempt, elapsed: Date.now() - t0, pass: true };
    if (Date.now() - t0 >= RECALL_RETRY_MS) break;
    await new Promise((r) => setTimeout(r, RECALL_INTERVAL_MS));
  }
  return { r1, r2, attempts: attempt, elapsed: Date.now() - t0, pass: false, best };
}

function finish(checks, alert) {
  const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
  const status = failed.length === 0 ? 'HEALTHY' : 'ALERT';
  const ts = new Date().toISOString();

  if (status === 'HEALTHY' && QUIET) {
    // cron 靜默成功：只輸出一行方便 cron 日誌 grep
    console.log(`[${ts}] ${status}: ok`);
  } else {
    console.log(`🐝 OA-Team 記憶健康檢查 @ ${ts}`);
    for (const [name, ok, detail] of checks) {
      console.log(`  [${ok ? 'OK' : 'FAIL'}] ${name} — ${detail}`);
    }
    if (alert) console.log(`  ⚠️ ${alert}`);
    console.log(`RESULT: ${status}${failed.length ? ' ❌ ' + failed.join(', ') : ' ✅'}`);
  }

  // 用 process.exitCode 而非 process.exit()，避免 Windows libuv 在 async handle 關閉時
  // 觸發 "Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)" 導致 exit code=127。
  process.exitCode = status === 'HEALTHY' ? 0 : 1;
}

async function main() {
  const checks = [];
  const h = await ping();
  checks.push(['core/health', h.ok, h.detail]);

  if (!h.ok) return finish(checks, 'core 不可達，停止後續檢查');

  const sid = `oa-health-${Date.now()}`;
  // 探針 token 刻意不含日期/數字。實測 (probe-len.mjs, 6 組對照)：
  // 內容含 '2026-09-30T05:00:59.168Z' 等數字時間戳時，該則訊息在 :8420 永遠檢索不到
  // （等 407s、分數凍結不變）；換成純英數 token 立即召回正常。
  // 唯一性已由 sid 的 Date.now() 與 PROBE_TOKEN 保證，無需在內容塞時間戳。
  const PROBE_TOKEN = `probe${PROBE_NONCE}`;
  let w1 = await withTimeout(capture(sid, 'Bee-07 編碼蜂', `healthcheck ${PROBE_TOKEN}`), TIMEOUT_MS, 'w1').catch((e) => ({ ok: false, code: e.message }));

  // ── 401 自動換 key 重試 ──────────────────────────────────────────────────
  // cron 傳的 TDAI_GATEWAY_API_KEY 常是 .admin-key（user_key，非 gateway key）。
  // 第一次寫入 401 時，改用 yaml 裡真正的 server.apiKey 重試整輪，避免假告警。
  if (!w1.ok && w1.code === 401 && !KEY_SWITCHED) {
    const alt = gatewayKeyFromYaml();
    if (alt && alt !== KEY) {
      KEY = alt;
      KEY_SWITCHED = true;
      console.log('  [i] 401 → 改用 gateway yaml 的 server.apiKey 重試（env key 是 user_key，非 gateway key）');
      w1 = await withTimeout(capture(sid, 'Bee-07 編碼蜂', `healthcheck ${new Date().toISOString()}`), TIMEOUT_MS, 'w1-retry').catch((e) => ({ ok: false, code: e.message }));
    }
  }

  const w2 = await withTimeout(capture(sid, 'Bee-03 分析蜂', 'healthcheck recall probe'), TIMEOUT_MS, 'w2').catch((e) => ({ ok: false, code: e.message }));

  const w1Ok = !!w1.ok && (Array.isArray(w1.ids) ? w1.ids.length > 0 : false);
  const w2Ok = !!w2.ok && (Array.isArray(w2.ids) ? w2.ids.length > 0 : false);
  const writesOk = (w1Ok ? 1 : 0) + (w2Ok ? 1 : 0);

  checks.push(['Bee-07 寫入', w1Ok, JSON.stringify(w1)]);
  checks.push(['Bee-03 寫入', w2Ok, JSON.stringify(w2)]);
  checks.push(['寫入成功數', writesOk >= MIN_WRITES, `${writesOk}/${MIN_WRITES}`]);

  // 跨代理召回帶退避重試：寫入與建索引是異步的，立即搜尋會漏掉先寫的那隻蜂。
  const { r1, r2, attempts, elapsed, pass: cross, best } = await recallCross(sid);
  const recallOk = (r1.length > 0 ? 1 : 0) + (r2.length > 0 ? 1 : 0);

  checks.push(['跨代理召回', cross, `r1=${r1.length} r2=${r2.length} attempts=${attempts} waited=${Math.round(elapsed / 1000)}s`]);
  checks.push(['召回成功數', recallOk >= MIN_RECALL, `${recallOk}/${MIN_RECALL}`]);

  // 用量門檻：寫入+召回合併 >= MIN_WRITES 才算「有蜂群在用」
  const usageOk = writesOk >= MIN_WRITES && recallOk >= MIN_RECALL;
  checks.push(['蜂群使用量', usageOk, `writes=${writesOk} recall=${recallOk} threshold=${MIN_WRITES}/${MIN_RECALL}`]);

  const alerts = [];
  if (!usageOk) alerts.push('記憶管線通但用量不足（< 10 筆 or 召回 0），可能無蜂群呼叫');

  finish(checks, alerts.join('; ') || '');
}

main().catch((e) => {
  console.error('HEALTHCHECK_FAIL:', e);
  process.exit(1);
});
