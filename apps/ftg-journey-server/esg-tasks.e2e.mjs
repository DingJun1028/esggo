// ESG 任務 E2E 實測：真實啟動後端、打真實請求。
// 目的：驗證 JG7 修正後，「後端目錄驅動前端表單」的路徑是否真的通。
// 依 node-e2e-verification：PORT/DB_PATH 可覆寫 → 用 scratch 庫，不碰真實資料。
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = 'C:/Project/esggo/apps/ftg-journey-server';
const PORT = 8801;
const BASE = `http://127.0.0.1:${PORT}`;
const JWT_SECRET = crypto.randomBytes(48).toString('hex');
const DB_DIR = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'ftg-e2e-')), 'ftg.db');

let failures = 0;
const check = (ok, label, extra = '') => {
  console.log(`${ok ? '✅' : '❌'} ${label}${extra ? ' — ' + extra : ''}`);
  if (!ok) failures++;
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// 不 await json：Express 未捕捉例外會回 HTML，會把真正的 stack 藏起來
async function jget(url, opts) {
  const r = await fetch(url, opts);
  const t = await r.text();
  try {
    return { ok: r.ok, status: r.status, data: JSON.parse(t) };
  } catch {
    console.log(`  [raw ${r.status}] ${t.slice(0, 300)}`);
    return { ok: false, status: r.status, data: null };
  }
}

// 自簽 token：JWT_SECRET 是本腳本自己產生的，這裡用同一把鑰簽
function mintToken(email) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(
    JSON.stringify({ email, name: 'E2E', picture: '', exp: Math.floor(Date.now() / 1000) + 3600 })
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(header + '.' + body).digest('base64url');
  return header + '.' + body + '.' + sig;
}

const EMAIL = 'e2e@example.com';
const TOKEN = mintToken(EMAIL);
const auth = { 'content-type': 'application/json', authorization: `Bearer ${TOKEN}` };

const server = spawn('node', ['server.js'], {
  cwd: ROOT,
  env: { ...process.env, PORT: String(PORT), DB_PATH: DB_DIR, JWT_SECRET },
});
server.stdout.on('data', () => {});
server.stderr.on('data', (d) => console.log(`  [server] ${String(d).slice(0, 200)}`));
server.on('error', (e) => console.log(`  [spawn error] ${e.message}`));
server.on('exit', (code, sig) => console.log(`  [server exit] code=${code} signal=${sig}`));

try {
  // 等健康檢查真的起來，不用盲等
  let up = false;
  for (let i = 0; i < 40; i++) {
    try {
      const h = await fetch(`${BASE}/health`);
      if (h.ok) { up = true; break; }
    } catch { /* 尚未 listen */ }
    await wait(250);
  }
  check(up, '後端真實啟動 /health');
  if (!up) throw new Error('server did not start');

  // ---- 1. 無 token 必須被擋 -------------------------------------------
  const noAuth = await jget(`${BASE}/api/badges`);
  check(noAuth.status === 401, '無 token → 401', `got ${noAuth.status}`);

  // ---- 2. 建立旅程 -----------------------------------------------------
  const created = await jget(`${BASE}/api/journeys`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      title: 'E2E 淨灘', service_type: 'travel',
      destination: '宜蘭', start_date: '2026-10-01', end_date: '2026-10-01',
    }),
  });
  check(created.ok && !!created.data?.id, '建立旅程', JSON.stringify(created.data));
  const JID = created.data?.id;

  // ---- 3. 核心：目錄欄位驅動表單 ---------------------------------------
  const catalog = await jget(`${BASE}/api/journeys/${JID}/esg-tasks`, { headers: auth });
  const tasks = catalog.data?.tasks || [];
  check(Array.isArray(tasks) && tasks.length === 6, 'GET 回傳任務目錄 6 筆', `got ${tasks.length}`);

  // 前端 openTask() 讀 task.fields.forEach —— 每個任務都必須有非空 fields
  const noFields = tasks.filter((t) => !Array.isArray(t.fields) || t.fields.length === 0);
  check(noFields.length === 0, '每個任務都有非空 fields（前端表單不會 TypeError）',
    noFields.map((t) => t.id).join(','));

  // select 型別必須有 options（前端 field.options.map 直接迭代）
  const badSelect = tasks.flatMap((t) => (t.fields || []))
    .filter((f) => f.type === 'select' && (!Array.isArray(f.options) || f.options.length === 0));
  check(badSelect.length === 0, 'select 欄位都有非空 options', badSelect.map((f) => f.name).join(','));

  // ---- 4. 逐任務提交真實資料 → 驗證 impact 同步 ------------------------
  // 每筆都用「填完表單會送出的樣子」：所有 fields 都有值
  const submissions = {
    cleanup:    { count: 12, weight: 2.5, types: '塑膠' },
    carbon:     { distance: 100, mode: '汽車', passengers: 2 },   // 預期 100*0.17/2 = 8.5 kg
    carbonWalk: { distance: 10, mode: '步行', passengers: 1 },    // 預期 0 kg（零排放）
    biodiversity: { count: 3, species: '黑面琵鷺', habitat: '濕地' },
    local:      { amount: 450, business: '在地小店', category: '餐飲' },
    water:      { saved: 120, purpose: '清洗' },
    waste:      { count: 5, items: '餐具', reusable: '自備餐具' },
  };

  const taskIdFor = (k) => (k === 'carbonWalk' ? 'carbon' : k);

  for (const [key, data] of Object.entries(submissions)) {
    const tid = taskIdFor(key);
    const r = await jget(`${BASE}/api/journeys/${JID}/esg-tasks`, {
      method: 'POST', headers: auth,
      body: JSON.stringify({ task_id: tid, data }),
    });
    check(r.ok, `POST esg-tasks ${tid} (${key})`, r.ok ? '' : `status=${r.status}`);
  }

  // ---- 5. impact 表實際內容 ------------------------------------------
  const impactRes = await jget(`${BASE}/api/journeys/${JID}/impact`, { headers: auth });
  const rows = impactRes.data || [];
  const byMetric = {};
  for (const row of rows) {
    byMetric[row.metric_id] = (byMetric[row.metric_id] || 0) + Number(row.value);
  }
  console.log('  impact by_metric =', JSON.stringify(byMetric));

  check(byMetric.trash_collected === 12, 'trash_collected = 12 件', String(byMetric.trash_collected));
  check(byMetric.species_observed === 3, 'species_observed = 3 種', String(byMetric.species_observed));
  check(byMetric.local_spending === 450, 'local_spending = 450 元', String(byMetric.local_spending));
  check(byMetric.water_saved === 120, 'water_saved = 120 L', String(byMetric.water_saved));
  check(byMetric.waste_reduced === 5, 'waste_reduced = 5 件', String(byMetric.waste_reduced));

  // 汽車 100km / 2 人 = 8.5 kg；步行 10km = 0 kg（零排放不可被算成汽車）
  const carbonVal = byMetric.carbon_saved || 0;
  check(Math.abs(carbonVal - 8.5) < 1e-9, 'carbon_saved = 8.5 kg（100km 汽車 ÷2 人）', String(carbonVal));
  // 距離獨立記 km，不混進 carbon_saved
  check(byMetric.distance === 110, 'distance = 110 km（100+10，與 kg 拆開）', String(byMetric.distance));

  // ---- 6. 零排放不得寫入 carbon_saved ---------------------------------
  const walkOnly = await jget(`${BASE}/api/journeys/${JID}/esg-tasks`, {
    method: 'POST', headers: auth,
    body: JSON.stringify({ task_id: 'carbon', data: { distance: 5, mode: '步行', passengers: 1 } }),
  });
  check(walkOnly.ok, 'POST 步行紀錄不應 500', walkOnly.ok ? '' : `status=${walkOnly.status} body=${JSON.stringify(walkOnly.data)}`);
  const after = await jget(`${BASE}/api/journeys/${JID}/impact`, { headers: auth });
  const afterCarbon = (after.data || []).filter((r) => r.metric_id === 'carbon_saved')
    .reduce((s, r) => s + Number(r.value), 0);
  check(Math.abs(afterCarbon - 8.5) < 1e-9, '步行 5km 未增加 carbon_saved（零排放）', String(afterCarbon));

  // ---- 7. totals（任務卡即時顯示）-------------------------------------
  const cat2 = await jget(`${BASE}/api/journeys/${JID}/esg-tasks`, { headers: auth });
  const totals = cat2.data?.totals || {};
  console.log('  totals =', JSON.stringify(totals));
  check(totals.cleanup === 12, 'totals.cleanup = 12', String(totals.cleanup));
  check(Math.abs((totals.carbon || 0) - 8.5) < 1e-9, 'totals.carbon = 8.5 kg', String(totals.carbon));
  check(totals.distance === 115, 'totals.distance = 115 km', String(totals.distance));

  // ---- 8. 描述性欄位必須真的存下來（JG7 修正的核心主張）--------------
  const logs = cat2.data?.logs || [];
  const bioLog = logs.find((l) => l.task_id === 'biodiversity');
  check(bioLog?.data?.species === '黑面琵鷺' && bioLog?.data?.habitat === '濕地',
    '不計 impact 的描述欄位仍完整保存', JSON.stringify(bioLog?.data));

  // ---- 9. 權限：他人不得讀取 ------------------------------------------
  const other = await jget(`${BASE}/api/journeys/${JID}/esg-tasks`, {
    headers: { authorization: `Bearer ${mintToken('intruder@example.com')}` },
  });
  check(other.status === 403, '非成員存取 → 403', `got ${other.status}`);

  // ---- 10. 偽造簽章的 token（安全缺陷偵測）--------------------------
  // 必須打在「不需要旅程權限」的端點上，才能分辨是簽章擋下的還是權限擋下的。
  // server.js verifyToken() 只 base64 解 payload、從不比對 HMAC 簽章。
  const forgedHeader = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const forgedBody = Buffer.from(JSON.stringify({
    email: 'attacker@example.com', exp: Math.floor(Date.now() / 1000) + 3600,
  })).toString('base64url');
  const forged = `${forgedHeader}.${forgedBody}.${'A'.repeat(43)}`;
  const forgedAuth = { authorization: `Bearer ${forged}` };

  // /api/badges 只有 verifyToken，沒有 requireAccess → 簽章是唯一防線
  const forgedBadges = await jget(`${BASE}/api/badges`, { headers: forgedAuth });
  check(forgedBadges.status === 401,
    '偽造簽章 token 過不了 verifyToken（安全）', `status=${forgedBadges.status}`);

  // 若攻擊者自稱旅程擁有者，requireAccess 是否也只靠 payload 的 email？
  const stolen = await jget(`${BASE}/api/journeys/${JID}/esg-tasks`, { headers: forgedAuth });
  check(stolen.status === 401,
    '偽造簽章 + 猜到 journeyId 仍被拒（安全）', `status=${stolen.status}`);

  console.log(`\n=== E2E 結果：${failures === 0 ? '全部通過' : failures + ' 項失敗'} ===`);
} catch (err) {
  failures++;
  console.log('❌ E2E 中斷：', err.message);
} finally {
  server.kill('SIGKILL');
  try { fs.rmSync(path.dirname(DB_DIR), { recursive: true, force: true }); } catch {}
}
process.exitCode = failures === 0 ? 0 : 1;