#!/usr/bin/env node
/**
 * Vault 走訪共用模組 — OA-Team 知識結點列舉的單一來源。
 *
 * 為何存在：knowledge-avatar.mjs (Hatch) 與 vault-access-guard.mjs (Guard)
 * 各自遞迴整個 vault/，且都沒有排除清單 → 兩者都會鑽進
 * vault 的 .obsidian plugins 依賴樹 (plugins 底下的 node_modules)，
 * 把第三方 README 當成知識結點。
 *
 * (註: 上面的 glob 刻意不寫成帶萬用字元的 plugins 形式 — 該字串含
 *  註解終止序列，會在 JSDoc 區塊註解內提前終止註解，導致本檔 SyntaxError。)
 *
 * 實測後果（修 Guard 前）：Hatch 孵化 2043 分身（真實業務量 366），
 * 分身命名空間被 Install/Usage/Options/About 等套件文件佔據。
 *
 * 因此排除清單必須共用：只改一處會讓另一支腳本繼續產出假告警。
 */

import fs from 'node:fs';
import path from 'node:path';

/** 不屬於 OA-Team 知識結點來源的目錄名 (比對目錄 entry 名稱, 非完整路徑)。 */
export const EXCLUDED_DIRS = new Set([
  '.obsidian',    // Obsidian plugin + 其 node_modules (第三方 README)
  '.git',         // 版控內部
  'node_modules', // 任何位置的依賴樹
  '.trash',       // Obsidian 垃圾桶
  '.space',       // Obsidian Spaces 內部
]);

/** 技能/測試契約明確豁免的檔名。 */
export const EXCLUDED_FILES = new Set(['AGENTS.md']);

/**
 * 遞迴列出 vault 下的 markdown 檔 (絕對路徑)。
 * @param {string} vaultRoot vault 根目錄
 * @returns {string[]}
 */
export function walkMarkdown(vaultRoot) {
  const out = [];
  const walk = (dir) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return; // 不可讀目錄跳過, 不炸全批
    }
    for (const e of entries) {
      if (EXCLUDED_DIRS.has(e.name)) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.md') && !EXCLUDED_FILES.has(e.name)) out.push(p);
    }
  };
  walk(vaultRoot);
  return out;
}

/**
 * 遞迴列出知識結點 (## 標題 + [[wikilink]]), 以 vault 相對路徑記錄來源。
 *
 * 同一檔案內的重複結點 (例: 一篇筆記引用 [[GapRemediation]] 兩次) 是**同一個**
 * 知識結點, 必須去重 — 否則下游 (knowledge-avatar.mjs) 會把重複項當成獨立結點,
 * 而 id 生成器只認 file+type+text, 兩者必然撞 key。
 *
 * @param {string} vaultRoot
 * @returns {{type:string,text:string,file:string}[]}
 */
export function collectNodes(vaultRoot) {
  const nodes = [];
  const seen = new Set(); // `${file}\u0000${type}\u0000${text}`
  const push = (type, text, file) => {
    const key = `${file}\u0000${type}\u0000${text}`;
    if (seen.has(key)) return;
    seen.add(key);
    nodes.push({ type, text, file });
  };
  for (const abs of walkMarkdown(vaultRoot)) {
    let s;
    try {
      s = fs.readFileSync(abs, 'utf8');
    } catch {
      continue; // 不可讀檔跳過, 不炸全批
    }
    const file = path.relative(vaultRoot, abs).split(path.sep).join('/');
    const body = s.replace(/^---[\s\S]*?---/, '');
    for (const m of body.matchAll(/^##\s+(.+)$/gm)) {
      push('heading', m[1].trim(), file);
    }
    for (const m of body.matchAll(/\[\[([^\]]+)\]\]/g)) {
      push('wikilink', m[1].trim(), file);
    }
  }
  return nodes;
}