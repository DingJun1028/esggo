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
