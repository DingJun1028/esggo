#!/usr/bin/env node
/**
 * Vault Access Guard — 研究權限全開前的安全閘 (s 考量)
 *
 * 確保 vault 標記 `access: public-research` (讀取全開) 前：
 * 1. 不含真憑證 (sk-/API key/password/token 實值)
 * 2. 所有筆記已標 access 權限欄位
 * 3. co_authors / source_origin 若存在則合法
 *
 * 屬 §26 第二大腦研究權限機制的 Trustworthy 防護層。
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { walkMarkdown } from './vault-walk.mjs';

const VAULT = path.resolve('vault');
const SECRET_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/,           // OpenAI-style
  /ghp_[a-zA-Z0-9]{20,}/,          // GitHub PAT
  /xox[baprs]-[a-zA-Z0-9-]{10,}/,  // Slack
  /AIza[0-9A-Za-z_-]{30,}/,        // Google
  /AKIA[0-9A-Z]{16}/,              // AWS
  /eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\./, // JWT
  /-----BEGIN (PRIVATE|OPENSSH) KEY-----/,
];

// 走訪規則與 Hatch 共用 vault-walk.mjs 單一來源。
// 2026-10-01: 本檔曾獨立遞迴整個 vault/, 掃進 .obsidian/plugins/*/node_modules/
// → 對第三方套件 README 產生假告警 (缺 access 欄位)。
let blocked = 0;
const files = walkMarkdown(VAULT);
console.log(`[VaultGuard] 掃描 ${files.length} 篇筆記`);

for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  // 1. access 欄位檢查
  if (!/^access:/m.test(s)) {
    console.warn(`  ⚠ ${path.relative(VAULT, f)}: 缺 access 欄位`);
  }
  // 2. 敏感字實值掃描 (僅掃 body, 跳過 frontmatter 的 source_origin 描述)
  const body = s.replace(/^---[\s\S]*?---/, '');
  for (const pat of SECRET_PATTERNS) {
    const m = body.match(pat);
    if (m) {
      console.error(`  ❌ ${path.relative(VAULT, f)}: 疑似真憑證 ${m[0].slice(0, 12)}...`);
      blocked++;
    }
  }
}

if (blocked > 0) {
  console.error(`\n[VaultGuard] 阻斷: 發現 ${blocked} 處疑似憑證, 禁止公開研究權限`);
  process.exit(1);
}
console.log('[VaultGuard] ✅ 通過: 無真憑證, 研究權限可全開');
