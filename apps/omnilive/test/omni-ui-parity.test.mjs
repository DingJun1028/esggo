/**
 * OmniUI 樣貌對齊測試 (parity)
 *
 * 目的: 防止 apps/omnilive/public/index.html 的玻璃外觀再次偏離
 *       packages/omni-ui (OmniUI v1.0 Liquid Glass Renderer) 的 SSOT。
 *
 * 對齊項 (取自 LiquidGlassRenderer.renderStyle / DEFAULT_GLASS):
 *   backdrop-filter blur = 20px (DEFAULT_GLASS.blur)
 *   border-radius        = 12px
 *   box-shadow           = 0 8px 32px rgba(0,0,0,0.2)
 *   border               = 1px solid rgba(201,162,75,0.3)  (BRAND_COLORS.warmGold)
 *
 * 判準: 這些值在 index.html 中必須以 token 引用出現, 且不得再有散寫的硬編碼。
 * 這是「修類不修例」的機器化守門 —— 日後新增元件再寫死值會直接紅燈。
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, '..', 'public', 'index.html'), 'utf8');
const ssotPath = join(here, '..', '..', '..', 'packages', 'omni-ui', 'src', 'index.ts');

test('OmniUI SSOT 存在且可讀 (parity 的比對基準)', () => {
  assert.ok(existsSync(ssotPath), `找不到 OmniUI SSOT: ${ssotPath}`);
});

test('玻璃模糊值對齊 OmniUI DEFAULT_GLASS.blur=20', () => {
  // SSOT 端
  const ssot = readFileSync(ssotPath, 'utf8');
  assert.match(ssot, /blur:\s*20\b/, 'SSOT 應仍為 blur:20, 若已改版請同步本測試');

  // 消費端: 必須以 token 引用, 不得散寫
  assert.match(html, /--omni-blur:\s*20px/, 'index.html 應定義 --omni-blur:20px');
  assert.ok(
    !/blur\((18|22|20)px\)/.test(html),
    '仍有硬編碼 blur 數值, 應改用 var(--omni-blur)'
  );
});

test('圓角對齊 OmniUI border-radius=12px', () => {
  assert.match(html, /--omni-radius:\s*12px/, 'index.html 應定義 --omni-radius:12px');
  assert.ok(
    !/border-radius:\s*(6|14|20)px/.test(html),
    '仍有硬編碼圓角, 應改用 var(--omni-radius)'
  );
});

test('陰影對齊 OmniUI 0 8px 32px rgba(0,0,0,0.2)', () => {
  assert.match(
    html,
    /--omni-shadow:\s*0 8px 32px rgba\(0,0,0,\.2\)/,
    'index.html 應定義 --omni-shadow 為 OmniUI 標準值'
  );
  assert.ok(
    !/box-shadow:\s*0 \d+px \d+px rgba\(0,0,0,\.(4|45|5)\)/.test(html),
    '仍有過重的硬編碼陰影, 應改用 var(--omni-shadow*)'
  );
});

test('邊框對齊 OmniUI 暖金 rgba(201,162,75,0.3)', () => {
  assert.match(
    html,
    /--line:\s*rgba\(201,162,75,\.3\)/,
    'index.html 的 --line 應為 OmniUI 暖金邊框, 非冷白'
  );
});

test('玻璃填色不再使用冷白疊色 (統一淡金 --omni-fill)', () => {
  assert.ok(
    !/rgba\(255,255,255,\.(05|06|1)\)/.test(html),
    '仍有冷白玻璃填色, 應改用 var(--omni-fill)'
  );
});

test('--green 保留 WCAG AA 版本, 未被改回品牌值', () => {
  // index.html 的註解記載: 品牌 #3c6e43 在深藍玻璃上僅 2.42:1, 不可讀。
  // 這條守門防止日後有人「對齊品牌色」而讓小字看不見。
  assert.match(html, /--green:\s*#5fb37e/, '--green 必須維持 5.67:1 的 AA 版本');
  assert.ok(
    !/--green:\s*#3c6e4[0-9a-f]/i.test(html),
    '--green 被改回低對比度的品牌值, 會讓 .csec h3 / .term b 不可讀'
  );
});

test('每個 var(--omni-*) 引用都有對應定義 (無悬空變數)', () => {
  const defined = new Set(
    [...html.matchAll(/(--omni-[a-z-]+)\s*:/g)].map((m) => m[1])
  );
  const used = new Set(
    [...html.matchAll(/var\((--omni-[a-z-]+)\)/g)].map((m) => m[1])
  );
  for (const u of used) {
    assert.ok(defined.has(u), `使用了未定義的變數 ${u}`);
  }
});

/* ── 四角鈕定位契約 ────────────────────────────────────────────────
 * 來源 bug: 四角鈕用 position:fixed + data-pos 寫死 14px, 直接釘在 viewport;
 * 而 placeSheet()/sharePlace() 以鈕的 getBoundingClientRect() 計算彈出座標。
 * 兩套座標系不一致 -> 位於視窗最上緣的鈕讓面板被算出畫面外 (使用者回報
 * 「設定彈到最上方了看不到」)。修法是兩者共用 --edge-* 變數。
 * 這組測試鎖住該不變量: 四角鈕與面板必須同源, 且不得寫死常數。
 */

test('四角鈕的邊距來自 --edge-* 變數 (與面板彈出座標系同源)', () => {
  for (const pos of ['tl', 'tr', 'bl', 'br']) {
    assert.match(
      html,
      new RegExp(`\\.corner-btn\\[data-pos="${pos}"\\][^{]*\\{[\\s\\S]{0,160}?var\\(--edge-`),
      `四角 ${pos} 必須用 var(--edge-*) 取邊距, 不得寫死常數`
    );
  }
  // 四角鈕基底不得再有獨立寫死的 top/left/right/bottom
  const base = html.match(/\.corner-btn\{([\s\S]*?)\n  border-radius/);
  assert.ok(base, '找不到 .corner-btn 基底規則');
  assert.ok(
    !/(^|[;{\s])(top|right|bottom|left)\s*:\s*calc?\s*\(?\s*\d+px/.test(base[1]),
    `.corner-btn 基底仍寫死邊距, 會覆蓋 data-pos 的變數: ${base[1].slice(0, 120)}`
  );
});

test('placeCorners() 存在且於初始化 + resize 時被呼叫', () => {
  assert.match(html, /function placeCorners\(\)/, '缺少 placeCorners(): 無法設定 --edge-*');
  // 初始錨定: 只在 resize 呼叫會讓 --edge-* 一開始未設定, 四角鈕停在 CSS fallback
  const calls = [...html.matchAll(/placeCorners\(\)/g)].length - 1; // 扣掉定義
  assert.ok(calls >= 2, `placeCorners() 呼叫次數不足 (${calls}), 需含初始 + resize`);
  assert.match(html, /DOMContentLoaded[^)]*placeCorners/, '應在 DOM 就緒後再錨定一次');
});

test('resize 時重算面板定位 (面板與四角鈕同源)', () => {
  assert.match(
    html,
    /addEventListener\(\s*['"]resize['"][\s\S]{0,200}?placeCorners\(\)[\s\S]{0,200}?placeSheet\(/,
    'resize 應同時重算 placeCorners() 與 placeSheet(), 否則捲動/縮放後面板錯位'
  );
});

test('四角鈕維持 position:fixed (不可改 absolute — 會錨到 #grip)', () => {
  // 祖先鏈 #stage(absolute) > #grip > #toolbar; 改 absolute 會讓鈕跟著字幕拖曳
  // 把���跑, 而非釘在介面本體四角。座標對齊改由 --edge-* 變數負責。
  const base = html.match(/\.corner-btn\{([\s\S]*?)\n  border-radius/);
  assert.ok(base, '找不到 .corner-btn 基底規則');
  assert.match(
    base[1],
    /position:\s*fixed/,
    '.corner-btn 必須維持 position:fixed (absolute 會錨到字幕把手 #grip)'
  );
});
