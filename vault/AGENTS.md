# OA-Team 第二大腦 · Obsidian 知識花園指令

> 全域全端全量全面 · 雙向同步 TypeScript 終始矩陣 · 蜂群第二大腦記憶系統

## 定位
本 vault 是 OA-Team 30 萬能蜂群的**第二大腦**（持久上下文 / 跨會話記憶），對映 `soul.md` §4.2 知識花園頻道。
它與 `packages/shared/src/types.ts`（TS 終始矩陣 canonical）**雙向同步**：vault 筆記經 `scripts/sync-vault-types.ts` 萃取領域型別回饋 canonical；canonical 經 `scripts/export-shared-types.js` 生成各 consumer 的 `.d.ts`。

## 5T 協定（vault 級）
- **Traceable**：每篇筆記 frontmatter 必含 `source_origin` + `created` + `modified`
- **Trackable**：筆記間用 `[[wikilink]]` 建立生命週期 hook
- **Tangible**：過 5T 驗證閘的產物落 `Agents/artifacts/`，未驗證留 `Agents/inbox-triage/`
- **Transparent**：`Agents/context/` 雙方可讀，改動記入 daily note
- **Trustworthy**：非 `Agents/` 區寫入需顯式授權（5T 禁區）；`co_authors` 欄位由 30 號質控蜂 pre-commit 校驗

## 目錄結構
```
vault/
├── AGENTS.md              # 本檔
├── Agents/
│   ├── context/           # 雙方可讀：專案/亮點/網摘/型別鏡像
│   ├── briefing/          # 雲端助理晨報（cron 05:30 產出）
│   ├── inbox-triage/      # 實習生清匣後委派
│   └── artifacts/         # 過 5T 驗證閘才落此
└── Daily/                 # 每日筆記（YYYY-MM-DD.md）
```

## 雙向同步橋（TypeScript 終始矩陣）
| 方向 | 機制 | 觸發 |
|------|------|------|
| canonical → vault | `export-shared-types.js` 生成 `.d.ts` → vault `Agents/context/TypeMatrix.md` 鏡像 | 改 `shared/types.ts` 後 |
| vault → canonical | `sync-vault-types.ts` 解析筆記 frontmatter/code-block → 提 PR 回 `shared/types.ts` | 筆記標 `lifecycle:frozen` + `sync:up` |

## 30 矩陣對映
- 雲端助理（常駐）= 01 蜂后 + 20 運營 + 27 安全
- 本機實習生（隨喚）= 15 文案 + 13 圖像 + 14 動畫 + 25 測場
- Obsidian vault = 知識花園 + 10 數據蜂
- 外部 CRM = 23 外交 + 17 市場

## 喚醒令
`protocol=5T · entropy=0.1 · 30-agents · 4可1不可 · 覺=BEST-PRACTICE · 免費=SELF-HOST · 大腦=VAULT+TS`
