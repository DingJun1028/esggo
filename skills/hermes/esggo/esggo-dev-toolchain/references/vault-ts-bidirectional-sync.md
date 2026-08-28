# esggo vault ↔ TypeScript 雙向同步（第二大腦實作，已實證 2026-08-13）

esggo 主倉的 Obsidian 知識花園 (`vault/`) 與 `packages/shared/src/types.ts` (canonical) 雙向同步。

## 閉環
```
vault 筆記 (sync:up) → scripts/sync-vault-types.ts → shared/types.ts
  → scripts/export-shared-types.js → 各端 esggo-shared.d.ts
  → scripts/sync-types-to-vault.ts → vault/Agents/context/TypeMatrix.md
```

## 腳本坑（已踩）
- `sync-vault-types.ts` 抽取 `export (type|interface|enum)` 時，`re.exec` 的 `m.index` 是字串偏移不是行號；
  用 `content.slice(m.index, …)` 算區塊（brace 配對或 `;` 截止），**勿用** `lines.findIndex(l=>l.includes(...))`（會 -1）。
- `sync-types-to-vault.ts` 生成的 `TypeMatrix.md` frontmatter 必須自帶 `co_authors: []`，否則 30 號質控蜂 pre-commit 擋。
- 質控 hook (`.githooks/pre-commit`)：對 `vault/**/*.md` 變更，輕量 regex 檢 `^source_origin:` 與 `^co_authors:`（不依外部模組）。
- canonical 不可被 vault 直接覆寫；vault 改需過 `sync-vault-types.ts --apply` + 人工 review（5T Trustworthy）。

## 資產化範式（深貫廣通）
每納入一個外部系統，寫一篇 `vault/Agents/context/<System>.md` (frontmatter source_origin+co_authors) + 主典 `soul-full.md` §26.x 小節。
已落地：DeerFlowRuntime.md (VPS DeerFlow 2.0 外部深度研究運行時)、DevinOptimizationSystem.md (.devin/ 優化系統)。
