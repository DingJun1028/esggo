/**
 * sync-types-to-vault.ts — OA-Team 第二大腦雙向同步橋（canonical → vault 方向）
 *
 * 全域全端全量全面 · 雙向 TypeScript 終始矩陣
 * 終 (canonical): esggo/shared/types.ts
 * 始 (vault):     vault/Agents/context/TypeMatrix.md（人讀鏡像，sync:mirror）
 *
 * 職責：讀 shared/types.ts 所有 export type/interface/enum，渲染成 Obsidian 筆記，
 *       寫入 vault/Agents/context/TypeMatrix.md（含 frontmatter sync:mirror + wikilink）。
 *       與 sync-vault-types.ts（vault→canonical）互補，形成雙向閉環。
 *
 * 用法：npx tsx scripts/sync-types-to-vault.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'shared', 'types.ts');
const DEST = path.join(ROOT, 'vault', 'Agents', 'context', 'TypeMatrix.md');

const content = fs.readFileSync(SRC, 'utf8');
const lines = content.split('\n');

interface TypeDef { name: string; kind: string; block: string; }
const defs: TypeDef[] = [];
const re = /export\s+(type|interface|enum)\s+([A-Za-z0-9_]+)/g;
let m: RegExpExecArray | null;
while ((m = re.exec(content))) {
  const kind = m[1];
  const name = m[2];
  const start = m.index;
  let end = start;
  if (kind === 'type' && !content.slice(start, start + 200).includes('{')) {
    // 單行 type 別名：找到分號
    end = content.indexOf(';', start);
    if (end < 0) end = content.indexOf('\n', start);
  } else {
    // brace 配對
    let braces = 0;
    let i = start;
    for (; i < content.length; i++) {
      if (content[i] === '{') braces++;
      else if (content[i] === '}') { braces--; if (braces <= 0) { end = i + 1; break; } }
    }
  }
  const block = content.slice(start, end).trim().replace(/;$/, '');
  defs.push({ name, kind, block });
}

const byKind = (k: string) => defs.filter((d) => d.kind === k).map((d) => `- [[${d.name}]] (${d.kind})`);

const md = `---
source_origin: esggo/shared/types.ts
created: 2026-08-13
modified: ${new Date().toISOString().slice(0, 10)}
sync: mirror
lifecycle: active
---

# 型別矩陣鏡像（TypeScript 終始矩陣 · vault 端）

> 本檔由 \`scripts/sync-types-to-vault.ts\` 從 \`esggo/shared/types.ts\` 自動生成（sync:mirror）。
> 人類可讀鏡像，與各端 \`types/generated/esggo-shared.d.ts\` 同步。
> 若需新增型別：先在 vault 筆記標 \`sync:up\` 寫 ts code-block → 跑 \`sync-vault-types.ts\` → 合入 canonical。

## 統計
- 總型別：${defs.length}
- enum：${defs.filter((d) => d.kind === 'enum').length}
- interface：${defs.filter((d) => d.kind === 'interface').length}
- type：${defs.filter((d) => d.kind === 'type').length}

## 索引（wikilink）
### Enum
${byKind('enum').join('\n') || '（無）'}

### Interface
${byKind('interface').join('\n') || '（無）'}

### Type
${byKind('type').join('\n') || '（無）'}

## 定義詳列
${defs.map((d) => `### ${d.name}\n\`\`\`ts\n${d.block}\n\`\`\`\n`).join('\n')}
`;

fs.mkdirSync(path.dirname(DEST), { recursive: true });
fs.writeFileSync(DEST, md, 'utf-8');
console.log(`OK ${path.relative(ROOT, DEST)} — ${defs.length} types mirrored`);
