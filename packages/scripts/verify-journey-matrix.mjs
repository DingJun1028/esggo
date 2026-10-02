#!/usr/bin/env node
/**
 * journey 產品功能終始矩陣守門（E6 零孤兒 + 42 格完整性）
 *
 * 產品：journey.ftgesggo.esggo.co（FTG 永續旅程 App）
 *
 * 這不是「檢查檔案在不在」——那是敘事。它實際做五件事：
 *   P1 窮盡：掃描真實檔案系統（App.jsx 路由 / server.js 端點 / CREATE TABLE），
 *            逐一歸屬；無對應宣告 = FAIL
 *   P2 互斥：同一產物不得出現在兩個域
 *   P3 42 格：7 域（J0 平台層 + 六流）× 6 柱全滿，每格須有 endState + startChain + probe
 *   P4 探針實跑：抽取格內 probe 的檔案存在性斷言並真的檢查
 *   P5 前端消費：比對前端實際呼叫的 API 與後端端點，標出無人消費的端點（敘事風險）
 *
 * 5T 對映：P1=Trackable / P2=Trustworthy / P3=Transparent / P4=Traceable / P5=Tangible
 * 用法：node scripts/verify-journey-matrix.mjs [--json] [--probe] [--inventory]
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const argv = new Set(process.argv.slice(2));
const AS_JSON = argv.has('--json');
const AS_INVENTORY = argv.has('--inventory');
const RUN_PROBE = argv.has('--probe');

const results = [];
let hardFail = 0;
const push = (gate, name, ok, detail) => {
  results.push({ gate, name, ok, detail });
  if (!ok) hardFail++;
  if (!AS_JSON) {
    const icon = ok ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';
    console.log(`${icon} ${gate} ${name}${detail ? ` — ${detail}` : ''}`);
  }
};
const warn = (gate, name, detail) => {
  results.push({ gate, name, ok: true, warn: true, detail });
  if (!AS_JSON) console.log(`\x1b[33m▲\x1b[0m ${gate} ${name} — ${detail}`);
};

// ── 掃描真實檔案系統（不信任任何手寫清單）───────────────────────────
const APP_JSX = path.join(ROOT, 'apps/ftg-journey-web/src/App.jsx');
const SERVER_JS = path.join(ROOT, 'apps/ftg-journey-server/server.js');

function scanPages() {
  if (!fs.existsSync(APP_JSX)) return [];
  const src = fs.readFileSync(APP_JSX, 'utf-8');
  const out = [];
  for (const m of src.matchAll(/<Route\s+path="([^"]+)"/g)) out.push(m[1]);
  return out;
}

function scanApis() {
  if (!fs.existsSync(SERVER_JS)) return [];
  const src = fs.readFileSync(SERVER_JS, 'utf-8');
  const out = [];
  for (const m of src.matchAll(/app\.(get|post|put|delete)\('([^']+)'/g)) {
    out.push({ method: m[1].toUpperCase(), path: m[2], key: `${m[1].toUpperCase()} ${m[2]}` });
  }
  return out;
}

function scanTables() {
  if (!fs.existsSync(SERVER_JS)) return [];
  const src = fs.readFileSync(SERVER_JS, 'utf-8');
  const out = [];
  for (const m of src.matchAll(/CREATE TABLE IF NOT EXISTS (\w+)/g)) out.push(m[1]);
  return out;
}

/** 前端實際呼叫的 API：
 *  a) `${API_BASE}<path>` 直接 fetch
 *  b) AuthContext 暴露的 api.get/post/put/del('<path>') 包裝（apiFetch 的呼叫點）
 *  只抓 a) 會誤判「端點無人使用」——這正是本守門要防的敘事陷阱。 */
function scanFrontendCalls() {
  const base = path.join(ROOT, 'apps/ftg-journey-web/src');
  const out = new Set();
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(jsx?|tsx?)$/.test(e.name)) {
        const src = fs.readFileSync(p, 'utf-8');
        for (const m of src.matchAll(/\$\{API_BASE\}([^'"`\s]*)/g)) out.add(m[1]);
        for (const m of src.matchAll(/\bapi\.(?:get|post|put|del)\(\s*[`'"]([^`'"]*)[`'"]/g)) out.add(m[1]);
        for (const m of src.matchAll(/\bapiFetch\(\s*[`'"]([^`'"]*)[`'"]/g)) out.add(m[1]);
      }
    }
  };
  if (fs.existsSync(base)) walk(base);
  return [...out].filter((p) => p.startsWith('/'));
}

const pages = scanPages();
const apis = scanApis();
const tables = scanTables();
const feCalls = scanFrontendCalls();

// ── 載入 canonical（經 tsx；Windows shell 會吃 -e 的引號，故走獨立檔案）────
const canon = (() => {
  const r = spawnSync('npx', ['tsx', 'scripts/journey-canonical.dump.ts'], {
    cwd: ROOT, encoding: 'utf-8', shell: true,
  });
  if (r.status !== 0) {
    console.error('[canonical load failed]', (r.stderr || '').slice(0, 800));
    process.exit(2);
  }
  return JSON.parse((r.stdout || '').trim().split('\n').pop());
})();

const PILLARS = ['memory', 'time', 'space', 'causality', 'immortal', 'circular'];
const domainDefs = canon.DOMAINS;

/** canonical 宣告 key 正規化：取第一段空白前的路徑作為比對 key */
const declKeys = (list) => new Set(list.map((a) => a.product.split(' ')[0]));

if (!AS_JSON) {
  console.log('══ journey 產品功能終始矩陣守門（零孤兒 + 42 格）══\n');
}

// ── P1 窮盡 ────────────────────────────────────────────────────────
const orphanPages = pages.filter((r) => !declKeys(canon.PAGES).has(r));
push('P1', `頁面歸屬窮盡 (${pages.length} 路由)`, orphanPages.length === 0,
  orphanPages.length ? `孤兒: ${orphanPages.join(', ')}` : '全部命中');

const declApiKeys = new Set(canon.APIS.map((a) => a.product));
const orphanApis = apis.filter((a) => !declApiKeys.has(a.key));
push('P1', `API 歸屬窮盡 (${apis.length} 端點)`, orphanApis.length === 0,
  orphanApis.length ? `孤兒 ${orphanApis.length}: ${orphanApis.map((a) => a.key).join(', ')}` : '全部命中');

const declTables = declKeys(canon.TABLES);
const orphanTables = tables.filter((t) => !declTables.has(t));
push('P1', `資料表歸屬窮盡 (${tables.length} 表)`, orphanTables.length === 0,
  orphanTables.length ? `孤兒: ${orphanTables.join(', ')}` : '全部命中');

// ── P2 互斥：同一產物不得雙歸屬 ─────────────────────────────────────
const dupes = [];
for (const list of [canon.PAGES, canon.APIS, canon.TABLES]) {
  const seen = new Map();
  for (const a of list) {
    const key = `${a.kind}:${a.product}`;
    if (seen.has(key) && seen.get(key) !== a.domain) dupes.push(`${key}: ${seen.get(key)} vs ${a.domain}`);
    seen.set(key, a.domain);
  }
}
push('P2', '產物歸屬互斥', dupes.length === 0, dupes.length ? dupes.join('; ') : '無重複宣告');

// ── P3 42 格完整性 ─────────────────────────────────────────────────
let cellCount = 0;
const cellMissing = [];
for (const d of domainDefs) {
  for (const p of PILLARS) {
    const cell = d.cells.find((c) => c.pillar === p);
    if (!cell) { cellMissing.push(`${d.id}/${p} 缺格`); continue; }
    cellCount++;
    for (const f of ['endState', 'startChain', 'probe']) {
      if (!cell[f] || String(cell[f]).trim().length < 8) cellMissing.push(`${d.id}/${p}.${f} 未實質填寫`);
    }
  }
  if (!d.canonical || !fs.existsSync(path.join(ROOT, d.canonical))) {
    cellMissing.push(`${d.id} canonical 檔不存在: ${d.canonical}`);
  }
  if (d.frozen === false && (!d.frozenReason || d.frozenReason.length < 10)) {
    cellMissing.push(`${d.id} frozen=false 必須給出理由`);
  }
  if (!d.sitePromise || d.sitePromise.length < 6) cellMissing.push(`${d.id} 缺官網文案對照 sitePromise`);
}
push('P3', `42 格完整性 (7 域 × 6 柱)`, cellCount === 42 && cellMissing.length === 0,
  cellCount === 42 && cellMissing.length === 0 ? '42/42 格三要素齊備' : cellMissing.join('; '));

// ── P4 探針實跑：檔案存在性類斷言真的檢查 ───────────────────────────
if (RUN_PROBE) {
  const fileProbes = [];
  for (const d of domainDefs) {
    for (const c of d.cells) {
      const m = c.probe.match(/^([\w./[\]-]+\.(?:ts|tsx|mjs|json|md|js|jsx|test\.js))\s+存在/);
      if (m) fileProbes.push({ id: `${d.id}/${c.pillar}`, file: m[1], ok: fs.existsSync(path.join(ROOT, m[1])) });
    }
  }
  const bad = fileProbes.filter((p) => !p.ok);
  push('P4', `探針實跑 (${fileProbes.length} 檔案存在性斷言)`, bad.length === 0,
    bad.length ? `未通過: ${bad.map((b) => `${b.id}→${b.file}`).join(', ')}` : '全數存在');
} else if (!AS_JSON) {
  console.log('\x1b[33m•\x1b[0m P4 探針實跑 — 需 --probe 旗標（本次跳過）');
}

// ── P5 前端消費比對：API 存在 ≠ 有人用 ──────────────────────────────
{
  // 把前端呼叫的樣板變數與後端的 :param 正規化成同一形式（皆 → :x）才可比對
  const normalize = (p) => p
    .replace(/\$\{[^}]+\}/g, ':x')
    .replace(/:[A-Za-z_]\w*/g, ':x')
    .replace(/\/+/g, '/');
  const feNorm = new Set(feCalls.map(normalize));
  const unused = apis.filter((a) => !feNorm.has(normalize(a.path)) && a.path !== '/health');
  warn('P5', 'API 消費比對（存在 ≠ 被使用）',
    `前端呼叫 ${feCalls.length} 種路徑｜後端端點 ${apis.length}｜前端未直接呼叫 ${unused.length} 條` +
    (unused.length ? `: ${unused.map((a) => a.key).join(', ')}` : ''));
}

// ── 摘要 ───────────────────────────────────────────────────────────
const dist = {};
for (const a of [...canon.PAGES, ...canon.APIS, ...canon.TABLES]) {
  dist[a.domain] = (dist[a.domain] || 0) + 1;
}
const DOMAIN_LABEL = { J0: '平台層', J1: '基礎流', J2: '覺曉流', J3: '凝聚流', J4: '復元流', J5: '共好流', J6: '留念流' };

if (AS_INVENTORY) {
  const L = [];
  L.push('# journey 產品功能歸屬清單（Product Inventory）');
  L.push('');
  L.push('> **本檔為機讀產物，勿手動編輯。** 由 `node scripts/verify-journey-matrix.mjs --inventory` 重產。');
  L.push('> source_origin: `src/matrix/journey/routes.ts` + 檔案系統實掃（App.jsx + server.js）');
  L.push('> co_authors: [萬能蜂后(01), 萬能架構蜂(09), 萬能數據蜂(10), 萬能質控蜂(30)]');
  L.push('');
  L.push(`- 產生時間: \`${new Date().toISOString()}\``);
  L.push(`- 總計: **${pages.length + apis.length + tables.length}** 個產物（頁面 ${pages.length} + API ${apis.length} + 表 ${tables.length}）`);
  L.push(`- 守門結果: **${hardFail === 0 ? 'PASS (EXIT=0)' : `FAIL (${hardFail} 項)`}**`);
  L.push('');
  L.push('## 歸屬分布');
  L.push('');
  L.push('| 域 | 名稱 | 產物數 | 產物形態 | Hash Lock |');
  L.push('|---|---|---:|---|---|');
  for (const d of ['J0', 'J1', 'J2', 'J3', 'J4', 'J5', 'J6']) {
    const meta = domainDefs.find((x) => x.id === d) || {};
    L.push(`| ${d} | ${DOMAIN_LABEL[d]} | ${dist[d] || 0} | ${meta.artifactForm ?? '⚠ 缺'} | ${meta.frozen ? '需凍結' : `免凍結（${meta.frozenReason}）`} |`);
  }
  L.push('');
  L.push('## 42 格終始矩陣');
  L.push('');
  L.push('| 域 | 柱 | 終（endState） | 始（startChain） | 探針（probe） |');
  L.push('|---|---|---|---|---|');
  for (const d of domainDefs) {
    for (const c of d.cells) {
      L.push(`| ${d.id} ${d.name} | ${c.pillar} | ${c.endState} | ${c.startChain} | \`${c.probe}\` |`);
    }
  }
  L.push('');
  L.push('## 逐條歸屬');
  L.push('');
  L.push('| 產物 | 類型 | 域 | 來源檔案 | 備註 |');
  L.push('|---|---|---|---|---|');
  for (const a of [...canon.PAGES, ...canon.APIS, ...canon.TABLES]) {
    L.push(`| \`${a.product}\` | ${a.kind} | ${a.domain} ${DOMAIN_LABEL[a.domain]} | \`${a.file}\` | ${a.note ?? ''} |`);
  }
  L.push('');
  const md = L.join('\n');
  fs.writeFileSync(path.join(ROOT, 'docs/JOURNEY-PRODUCT-INVENTORY.md'), md, 'utf-8');
  console.log(`✓ docs/JOURNEY-PRODUCT-INVENTORY.md 已重產 (${pages.length + apis.length + tables.length} 個產物)`);
} else if (AS_JSON) {
  console.log(JSON.stringify({
    ok: hardFail === 0, hardFail, results, dist,
    generatedAt: new Date().toISOString(),
    counts: { pages: pages.length, apis: apis.length, tables: tables.length },
  }, null, 2));
} else {
  console.log(`\n歸屬分布: ${Object.entries(dist).sort().map(([k, v]) => `${k}=${v}`).join('  ')}`);
  console.log(hardFail === 0
    ? '\n\x1b[32m✅ journey 產品功能終始矩陣守門通過 — 42 格 + 零孤兒 + 歸屬互斥\x1b[0m'
    : `\n\x1b[31m❌ journey 域層守門失敗 (${hardFail} 項)\x1b[0m`);
}
process.exit(hardFail === 0 ? 0 : 1);
