#!/usr/bin/env node
/**
 * vault-walk / knowledge-avatar 回歸測試 — 兩道已修 bug 的防回歸鎖。
 *
 * 1. vault-walk.mjs 的 JSDoc 內不得出現註解終止序列
 *    (裸 glob plugins/<萬用字元>/node_modules/ 會提前終止區塊註解 → SyntaxError)。
 * 2. collectNodes() 對同一檔案內重複結點去重; 且不同檔案的同名結點必須各自保留
 *    (舊 id 只取 base64(text) 前綴 → 366 結點塌成 220, 靜默丟 40%)。
 *
 * 跑法: node --test scripts/test-vault-walk.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectNodes, walkMarkdown } from './vault-walk.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SELF = path.join(HERE, 'vault-walk.mjs');
const AVATAR = path.join(HERE, 'knowledge-avatar.mjs');

/** 建一個臨時 vault, 回傳路徑 (呼叫端負責 rm)。 */
function tmpVault(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vault-walk-test-'));
  for (const [rel, body] of Object.entries(files)) {
    const abs = path.join(root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, body, 'utf8');
  }
  return root;
}

test('1. vault-walk.mjs 原始碼不含註解終止序列', () => {
  const src = fs.readFileSync(SELF, 'utf8');
  // 去掉真正的 JSDoc 開頭後, 檔內不該再出現 "plugins/" 後面接萬用字元的 glob。
  assert.ok(
    !/\/\*\*?\/[^\n]*plugins/.test(src),
    'vault-walk.mjs 的註解內出現含萬用字元的 plugins glob — 會提前終止註解'
  );
  assert.ok(
    !/node_modules\/[\u4e00-\u9fff\uff0c,)]/.test(src.split('\n').slice(0, 20).join('\n')),
    '檔頭註解內出現裸露程式碼片段'
  );
});

test('1b. vault-walk.mjs 可被 node 解析 (SyntaxError 防回歸)', async () => {
  const { execFileSync } = await import('node:child_process');
  execFileSync(process.execPath, ['--check', SELF], { stdio: 'pipe' });
});

test('1c. knowledge-avatar.mjs 可被 node 解析', async () => {
  const { execFileSync } = await import('node:child_process');
  execFileSync(process.execPath, ['--check', AVATAR], { stdio: 'pipe' });
});

test('2. 排除清單擋掉 .obsidian/node_modules (第三方 README 不算結點)', () => {
  const root = tmpVault({
    'Agents/keep.md': '# K\n## 真結點\n[[FloatMatrix]]\n',
    '.obsidian/plugins/x/node_modules/pkg/README.md': '# Install\n## Usage\n[[BadNode]]\n',
    'node_modules/dep/README.md': '# Options\n[[BadNode2]]\n',
    '.trash/deleted.md': '## GhostNode\n',
  });
  try {
    const nodes = collectNodes(root);
    const texts = nodes.map((n) => n.text);
    assert.deepEqual(texts.sort(), ['FloatMatrix', '真結點']);
    assert.equal(walkMarkdown(root).length, 1);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('3. 同檔重複結點去重 (8 筆真重複不該各自孵化)', () => {
  const root = tmpVault({
    'a.md': '## A\n[[Gap]]\n[[Gap]]\n[[Gap]]\n## A\n',
  });
  try {
    const nodes = collectNodes(root);
    assert.equal(nodes.length, 2, '應為 2 (heading A + wikilink Gap)');
    assert.deepEqual(nodes.map((n) => n.type).sort(), ['heading', 'wikilink']);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('4. 跨檔同名結點各自保留 (舊 base64(text) bug 的真實案例)', () => {
  const root = tmpVault({
    'one.md': '## 相關\n[[TypeMatrix]]\n',
    'two.md': '## 相關\n[[TypeMatrix]]\n',
    'three.md': '## 相關\n[[TypeMatrix]]\n',
  });
  try {
    const nodes = collectNodes(root);
    // 舊實作: 6 結點塌成 2 個 key → 只存 2 個分身, 靜默丟 4 個。
    assert.equal(nodes.length, 6, '3 檔 × (1 heading + 1 wikilink) 應全數保留');
    const keys = new Set(nodes.map((n) => `${n.file}|${n.type}|${n.text}`));
    assert.equal(keys.size, 6, '每個結點的 file+type+text 三元組必須唯一');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('5. frontmatter 不被當成 heading (只掃 body)', () => {
  const root = tmpVault({
    'fm.md': '---\ntitle: NotANode\ntags: [x]\n---\n## RealNode\n',
  });
  try {
    assert.deepEqual(collectNodes(root).map((n) => n.text), ['RealNode']);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('6. 空檔 / 不可讀情境不炸全批', () => {
  const root = tmpVault({ 'empty.md': '', 'ok.md': '## Good\n' });
  try {
    assert.deepEqual(collectNodes(root).map((n) => n.text), ['Good']);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

// --- 2026-10-01 新增: 位元組層與降級預算的防回歸 ---

test('7. scripts/*.mjs 不得含真實 NUL 位元組 (git 會判定 binary, diff 全失效)', () => {
  // 踩坑: 用 heredoc 寫入含 \0 的模板字串時, 跳脫序列被解釋成真實 0x00 寫進檔案。
  // 後果: git diff 只印 "Binary files differ", 0 insertions/0 deletions, 完全看不到改了什麼。
  const dir = HERE;
  const offenders = [];
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.mjs'))) {
    const buf = fs.readFileSync(path.join(dir, f));
    const n = buf.count ? buf.count(0) : [...buf].filter((b) => b === 0).length;
    if (n > 0) offenders.push(`${f}×${n}`);
  }
  assert.deepEqual(offenders, [], `這些檔案含真實 NUL: ${offenders.join(', ')} — 需寫成跳脫序列 \\0`);
});

test('8. tdai-memory-sync 具備熔斷: TDAI 不可達時必須快速非零退出', () => {
  // 踩坑: TDAI 完全不可達時逐筆 18s 逾時 → 358 筆 = 6444s, 拖垮整條 avatar-daily,
  // 且在每筆等滿的情況下完全沒有診斷輸出。修法是寫入迴圈前先探測一次。
  const src = fs.readFileSync(path.join(HERE, 'tdai-memory-sync.mjs'), 'utf8');
  assert.match(src, /probeOnce/, '必須有啟動前探測函式');
  assert.match(src, /Promise\.race/, '必須有硬性時間上限 (單靠 AbortController 不保證立即中止)');
  assert.match(src, /process\.exit\(1\)/, '不可達時必須誠實非零, 讓排程層看得到');
  // 熔斷必須在寫入迴圈之前, 否則沒意義。
  assert.ok(src.indexOf('probeOnce()') < src.indexOf('for (const e of entries)'),
    '探測必須發生在寫入迴圈之前');
});