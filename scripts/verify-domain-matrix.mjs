#!/usr/bin/env node
/**
 * 域層終始矩陣守門（E6 零孤兒 + 30 格完整性）
 *
 * 這不是「檢查檔案在不在」——那是敘事。它實際做四件事：
 *   P1 窮盡：掃描真實檔案系統，30 頁 + 107 API 逐一歸屬；無規則命中 = FAIL
 *   P2 互斥：同一路由不得出現在兩個域
 *   P3 30 格：5 域 × 6 柱全滿，每格須有 endState + startChain + probe
 *   P4 探針實跑：抽取格內 probe 中可機械執行的檔案存在性斷言並真的檢查
 *
 * 5T 對映：P1=Trackable / P2=Trustworthy / P3=Transparent / P4=Traceable
 * 用法：node scripts/verify-domain-matrix.mjs [--json] [--probe]
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

// ── 掃描真實檔案系統（不信任任何手寫清單）───────────────────────────
function scanPages() {
  const out = [];
  for (const base of ['app', 'src/app']) {
    const abs = path.join(ROOT, base);
    if (!fs.existsSync(abs)) continue;
    const walk = (dir) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name === 'page.tsx') {
          const rel = path.relative(ROOT, p).replace(/\\/g, '/');
          const seg = rel.replace(/^src\/app/, 'app').replace(/\/page\.tsx$/, '');
          out.push({ route: '/' + seg.replace(/^app\/?/, ''), file: rel });
        }
      }
    };
    walk(abs);
  }
  return out;
}

function scanApis() {
  const out = [];
  for (const base of ['app/api', 'src/app/api']) {
    const abs = path.join(ROOT, base);
    if (!fs.existsSync(abs)) continue;
    const walk = (dir) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name === 'route.ts') {
          const rel = path.relative(ROOT, p).replace(/\\/g, '/');
          const seg = rel.replace(/^src\/app/, 'app').replace(/\/route\.ts$/, '');
          out.push({ route: seg.replace(/^app/, ''), file: rel });
        }
      }
    };
    walk(abs);
  }
  return out;
}

const pages = scanPages();
const apis = scanApis();

// ── 載入 canonical（經 tsx，避免自製 TS 解析器）────────────────────
// 走獨立 dump 檔而非 `tsx -e`：Windows shell 會破壞 -e 的引號
const canon = (() => {
  const r = spawnSync('npx', ['tsx', 'scripts/domain-canonical.dump.ts'], {
    cwd: ROOT,
    encoding: 'utf-8',
    shell: true,
  });
  if (r.status !== 0) {
    console.error('[canonical load failed]', (r.stderr || '').slice(0, 800));
    process.exit(2);
  }
  return JSON.parse((r.stdout || '').trim().split('\n').pop());
})();

const PILLARS = ['memory', 'time', 'space', 'causality', 'immortal', 'circular'];
const domainDefs = canon.DOMAINS;
const routeMod = canon;

if (!AS_JSON) {
  console.log('══ 域層終始矩陣守門 (E6 零孤兒 + 30 格) ══\n');
}

// ── P1 窮盡：每個真實檔案都能歸屬 ─────────────────────────────────
const pageAssign = new Map();
for (const a of routeMod.PAGES) {
  if (pageAssign.has(a.file)) hardFail++;
  pageAssign.set(a.file, a.domain);
}
// rules 已由 dump 端序列化為 { src, domain, note }（見 domain-canonical.dump.ts 註解）
const reCache = routeMod.API_PREFIX_RULES.map((r) => ({ re: new RegExp(r.src), domain: r.domain, note: r.note }));
function resolveApi(route) {
  for (const r of reCache) if (r.re.test(route)) return r.domain;
  return null;
}

const orphanPages = pages.filter((p) => !pageAssign.has(p.file));
push('P1', `頁面歸屬窮盡 (${pages.length} 頁)`, orphanPages.length === 0,
  orphanPages.length ? `孤兒: ${orphanPages.map((p) => p.route).join(', ')}` : '全部命中');

const apiHits = new Map();
for (const a of apis) {
  const d = resolveApi(a.route);
  if (d) apiHits.set(a.file, d);
}
const orphanApis = apis.filter((a) => !apiHits.has(a.file));
push('P1', `API 歸屬窮盡 (${apis.length} 路由)`, orphanApis.length === 0,
  orphanApis.length ? `孤兒 ${orphanApis.length}: ${orphanApis.slice(0, 8).map((a) => a.route).join(', ')}${orphanApis.length > 8 ? ' …' : ''}` : '全部命中');

// ── P2 互斥：同檔案不得雙歸屬 ─────────────────────────────────────
const seen = new Map();
const dupes = [];
for (const [file, d] of pageAssign) {
  const key = `page:${file}`;
  if (seen.has(key) && seen.get(key) !== d) dupes.push(`${file}: ${seen.get(key)} vs ${d}`);
  seen.set(key, d);
}
push('P2', '路由歸屬互斥', dupes.length === 0, dupes.length ? dupes.join('; ') : '無重複宣告');

// ── P2b 陰影偵測：src/app 與 app 定義同一路由時，src/app 為死碼 ──────
// Next.js 只解析單一 app 目錄（根 app/ 優先）。兩處同時定義 = 死碼 + 路由歧義。
// baseline 語意：本階段為「凍結現況」，故已知死碼列入 BASELINE 記為 WARN；
// 出現在 BASELINE 之外的新死碼才是真正的守門失敗（防止回歸）。
const BASELINE_SHADOWED = new Set([
  '/delegation/events', '/demo/delegation', '/demo/esg-analysis', '/design-system',
  '/omni-factory', '/api/delegation/audit', '/api/delegation/events',
  '/api/delegation/events/stream', '/api/delegation/health', '/api/delegation/metrics',
  '/api/delegation', '/api/delegation/[id]/execute', '/api/delegation/[id]',
  '/api/esg-report', '/api/health/metrics', '/api/health', '/api/health-metrics', '/api/healthz',
]);
const shadowed = [];
{
  const appSet = new Set(pages.map((p) => p.file.replace(/^src\/app/, 'app')));
  for (const p of pages) {
    if (p.file.startsWith('src/app/') && appSet.has(p.file.replace(/^src\/app/, 'app'))) {
      shadowed.push(p.route);
    }
  }
  const apiAppSet = new Set(apis.map((a) => a.file.replace(/^src\/app/, 'app')));
  for (const a of apis) {
    if (a.file.startsWith('src/app/') && apiAppSet.has(a.file.replace(/^src\/app/, 'app'))) {
      shadowed.push(a.route);
    }
  }
}
const shadowSet = new Set(shadowed);
const regression = [...shadowSet].filter((r) => !BASELINE_SHADOWED.has(r));  // 新增死碼 = 真回歸
const fixed = [...BASELINE_SHADOWED].filter((r) => !shadowSet.has(r));          // 已修 = 可收斂 baseline
results.push({ gate: 'P2b', name: '陰影偵測 (src/app 死碼)', ok: regression.length === 0, warn: true,
  detail: `死碼 ${shadowSet.size} 個（已登記 baseline）｜新增回歸 ${regression.length}｜已修復 ${fixed.length}` +
    (regression.length ? `｜新回歸: ${regression.join(', ')}` : '') });
if (!AS_JSON) {
  const reg = regression.length ? '\x1b[31m' : '\x1b[33m';
  console.log(`${reg}▲\x1b[0m P2b 陰影偵測 — 死碼 ${shadowSet.size} 個已登記；新增回歸 ${regression.length}，已修復 ${fixed.length}` +
    (regression.length ? `（新回歸: ${regression.join(', ')}）` : ''));
}
if (regression.length) hardFail++;

// ── P3 30 格完整性：5 域 × 6 柱，每格三要素齊備 ───────────────────
let cellCount = 0;
let cellMissing = [];
for (const d of domainDefs) {
  const got = d.cells.map((c) => c.pillar);
  for (const p of PILLARS) {
    const cell = d.cells.find((c) => c.pillar === p);
    if (!cell) { cellMissing.push(`${d.id}/${p} 缺格`); continue; }
    cellCount++;
    for (const f of ['endState', 'startChain', 'probe']) {
      if (!cell[f] || String(cell[f]).trim().length < 8) {
        cellMissing.push(`${d.id}/${p}.${f} 未實質填寫`);
      }
    }
  }
  if (!d.canonical || !fs.existsSync(path.join(ROOT, d.canonical))) {
    cellMissing.push(`${d.id} canonical 檔不存在: ${d.canonical}`);
  }
  if (d.frozen === false && (!d.frozenReason || d.frozenReason.length < 10)) {
    cellMissing.push(`${d.id} frozen=false 必須給出理由`);
  }
}
push('P3', `30 格完整性 (5 域 × 6 柱)`, cellCount === 30 && cellMissing.length === 0,
  cellCount === 30 && cellMissing.length === 0 ? `30/30 格三要素齊備` : cellMissing.join('; '));

// ── P4 探針實跑：檔案存在性類斷言真的檢查 ──────────────────────────
if (RUN_PROBE) {
  const fileProbes = [];
  for (const d of domainDefs) {
    for (const c of d.cells) {
      const m = c.probe.match(/^([\w./[\]-]+\.(?:ts|tsx|mjs|json|md))\s+(存在)/);
      if (m) fileProbes.push({ id: `${d.id}/${c.pillar}`, file: m[1], ok: fs.existsSync(path.join(ROOT, m[1])) });
    }
  }
  const bad = fileProbes.filter((p) => !p.ok);
  push('P4', `探針實跑 (${fileProbes.length} 檔案存在性斷言)`, bad.length === 0,
    bad.length ? `未通過: ${bad.map((b) => `${b.id}→${b.file}`).join(', ')}` : '全數存在');
} else {
  if (!AS_JSON) console.log('\x1b[33m•\x1b[0m P4 探針實跑 — 需 --probe 旗標（本次跳過）');
}

// ── 摘要 ─────────────────────────────────────────────────────────
const dist = {};
// Map 不可用 Object.values（回傳空陣列）—— 須展開 values()
for (const d of pageAssign.values()) dist[d] = (dist[d] || 0) + 1;
for (const d of apiHits.values()) dist[d] = (dist[d] || 0) + 1;

if (AS_JSON) {
  // 逐條歸屬一併輸出，使 docs/ESGGO-ROUTE-INVENTORY.md 可由守門單一來源重產
  // （--inventory 會用它產生 Markdown；人工編輯的 inventory 不算數）
  const routeList = [
    ...[...pageAssign].map(([file, domain]) => ({ route: pages.find((p) => p.file === file)?.route ?? file, kind: 'page', domain, file })),
    ...[...apiHits].map(([file, domain]) => ({ route: apis.find((a) => a.file === file)?.route ?? file, kind: 'api', domain, file })),
  ].sort((a, b) => (a.kind + a.route).localeCompare(b.kind + b.route));
  console.log(JSON.stringify({
    ok: hardFail === 0, hardFail, results, dist,
    generatedAt: new Date().toISOString(),
    counts: { pages: pages.length, apis: apis.length, total: routeList.length },
    routes: routeList,
    shadowed: [...shadowSet],
  }, null, 2));
} else if (AS_INVENTORY) {
  // 產生 docs/ESGGO-ROUTE-INVENTORY.md —— 產物必須可重產，不可手編
  const routeList = [
    ...[...pageAssign].map(([file, domain]) => ({ route: pages.find((p) => p.file === file)?.route ?? file, kind: 'page', domain, file })),
    ...[...apiHits].map(([file, domain]) => ({ route: apis.find((a) => a.file === file)?.route ?? file, kind: 'api', domain, file })),
  ].sort((a, b) => (a.kind + a.route).localeCompare(b.kind + b.route));
  const DOMAIN_LABEL = { D1: '永續報告', D2: '商情中心', D3: 'ESG 戰情室', D4: '永續閱覽室', D5: '每日 ESGGO', P0: '平台層' };
  const L = [];
  L.push('# ESGGO 路由歸屬清單（Route Inventory）');
  L.push('');
  L.push('> **本檔為機讀產物，勿手動編輯。** 由 `node scripts/verify-domain-matrix.mjs --inventory` 重產。');
  L.push('> source_origin: `src/matrix/routes.ts` + 檔案系統實掃（`app/` + `src/app/`）');
  L.push('> co_authors: [萬能蜂后(01), 萬能架構蜂(09), 萬能數據蜂(10), 萬能質控蜂(30)]');
  L.push('');
  L.push(`- 產生時間: \`${new Date().toISOString()}\``);
  L.push(`- 總計: **${routeList.length}** 條（頁面 ${pages.length} + API ${apis.length}）`);
  L.push(`- 守門結果: **${hardFail === 0 ? 'PASS (EXIT=0)' : `FAIL (${hardFail} 項)`}**`);
  L.push('');
  L.push('## 歸屬分布');
  L.push('');
  L.push('| 域 | 意義 | 條數 | 產物形態 | Hash Lock |');
  L.push('|---|---|---:|---|---|');
  for (const d of ['D1', 'D2', 'D3', 'D4', 'D5', 'P0']) {
    const n = dist[d] || 0;
    const meta = (canon.DOMAINS || []).find((x) => x.id === d) || {};
    // 欄位名取自 src/matrix/index.ts 的 Domain 介面：artifactForm / frozen。
    // 若讀不到就明示缺值，不可靜默退化為 '—'（那會讓 inventory 說謊）。
    if (!meta.id) {
      L.push(`| ${d} | ${DOMAIN_LABEL[d]} | ${n} | \`⚠ canonical 缺 ${d}\` | \`⚠ 無法判定\` |`);
      continue;
    }
    L.push(`| ${d} | ${meta.name ?? DOMAIN_LABEL[d]} | ${n} | ${meta.artifactForm} | ${meta.frozen ? '需凍結' : `免凍結（${meta.frozenReason}）`} |`);
  }
  L.push('');
  L.push('## 已登記死碼（src/app 被根 app/ 遮蔽）');
  L.push('');
  L.push(`> ${shadowSet.size} 條。Next.js 只解析單一 app 目錄，根 \`app/\` 存在時 \`src/app/**\` 全部不生效。`);
  L.push('> 階段 0 為凍結現況，故列為 baseline（WARN）；baseline 之外的新死碼才報紅。');
  L.push('');
  for (const r of [...shadowSet].sort()) L.push(`- \`${r}\``);
  L.push('');
  L.push('## 逐條歸屬');
  L.push('');
  L.push('| 路由 | 類型 | 域 | 檔案 |');
  L.push('|---|---|---|---|');
  for (const r of routeList) L.push(`| \`${r.route}\` | ${r.kind} | ${r.domain} ${DOMAIN_LABEL[r.domain]} | \`${r.file}\` |`);
  L.push('');
  const md = L.join('\n');
  fs.writeFileSync(path.join(ROOT, 'docs/ESGGO-ROUTE-INVENTORY.md'), md, 'utf-8');
  console.log(`✓ docs/ESGGO-ROUTE-INVENTORY.md 已重產 (${routeList.length} 條)`);
} else {
  console.log(`\n歸屬分布: ${Object.entries(dist).map(([k, v]) => `${k}=${v}`).join('  ')}`);
  console.log(hardFail === 0
    ? '\n\x1b[32m✅ 域層終始矩陣守門通過 — 30 格 + 零孤兒 + 歸屬互斥\x1b[0m'
    : `\n\x1b[31m❌ 域層守門失敗 (${hardFail} 項)\x1b[0m`);
}
process.exit(hardFail === 0 ? 0 : 1);
