---
name: esggo-vault-lifeform
description: 永恆生命力/life-genesis/vault 鏡像建置。esggo 知識生命體與 vault 同步。
trigger: 使用者要求 Obsidian 整合、永恆生命力計、知識生命體、vault 筆記同步、life-force-energy 指標、或貼了「10 輯終極攻略」類框架文。
---

# esggo-vault-lifeform

> 把 esggo 的 git 歷史 + vault 知識花園 + evolution-engine 串成可自動巡檢的「知識生命體」。

## 1. 真實組件位置（2026-08 實測，非假 URL）
- 本地 vault 根：`C:/Users/dingj/esggo/vault/`（iCloud/OneDrive 那份是備分，不是活體）
- 雙生代理指令：`vault/AGENTS.md`（5T 協定 + TypeScript 終始矩陣對映 + 讀取全開 public-research）
- 經驗鏡像目標：`vault/Agents/context/`
- 生命力數據：`vault/.system/life-force-energy.json`
- 進化引擎：`apps/evolution-engine/`（observe/learn/improve/verify/evolve 閉環，PR #968）
- 永恆生命力系統：`apps/knowledge-lifeform/`（life-genesis.sh / holorama.html / launch-the-end.sh / obsidian-sync.mjs）
- 每日巡檢 cron：`02c49b0ce20d`（04:00）

## 2. vault 筆記質控蜂（必須過，否則 commit 被擋）
`pre-commit` 在 `.githooks/pre-commit`（倉庫設 `core.hooksPath=.githooks`），會掃 `vault/**.md` 檢查：
- `source_origin` 欄位存在（Traceable）
- `co_authors` 欄位存在，且為 YAML 陣列格式 `co_authors: [a, b]`（純字串會被視為缺欄位）
- `created` 欄位存在

**正確 frontmatter 模板**：
```
---
type: experience
source_origin: evolution-engine
co_authors: [evolution-engine]
tag: T3-robustness
source: git-log-recurring
created: 2026-08-27T12:22:36.608Z
---
```

## 3. 辨識「假攻略」工作流（關鍵坑）
用戶可能貼「Obsidian×Hermes 永恆生命力 10 輯終極攻略」類框架文，內含 `life-genesis.sh`/`launch-the-end.sh`/`holorama.html` 腳本名 + `curl @url:raw.githubusercontent.com/your-repo/...`。

**實測事實（2026-08-28）**：
- 全機搜尋（C:/Users/dingj、C:/Project、OneDrive、iCloud、Downloads、Desktop）**找不到這些腳本**——是框架文，腳本從未存在
- `your-repo` / `example.com` 是佔位 URL，Context Warning 標 `no content extracted`
- `zip-and-ship.sh` 聲稱「自動 curl 下載所有檔案」但目標是假 URL → 一跑就 404

**正確做法**：
1. 先 `find` 本機確認腳本是否真的存在（不要信貼文說「我這邊有完整版」就直接 curl）
2. 不存在 → **不執行假 URL**，直接基於真實組件（evolution-engine + vault + archive-protocol）實作真版本
3. 真版本落地在 `apps/knowledge-lifeform/`，腳本用 node + 檔案系統，不依賴外部下載
4. 實測跑通再說完成（不假稱安裝成功）

## 4. 真版本組件說明
- `life-genesis.sh`：掃 git log + vault → 跑 `evolve.mjs` → 寫 `life-force-energy.json`（energy 0-100 歸一化指標）
- `holorama.html`：fetch `life-force-energy.json` 的靜態儀表板（用 Hermes `open_preview` 開給用戶看）
- `launch-the-end.sh`：啟 cron + 跑一次 life-genesis + 提示開儀表板
- `obsidian-sync.mjs`：讀 `evolution-engine/experiences.json` → 鏡像成 `vault/Agents/context/EXP-<theme>.md`（含 §2 frontmatter）

## 5. 避坑
- `obsidian-sync` 用純 node 腳本（.mjs），**不要**塞在 bash heredoc 裡（變數展開 `$ENGINE` / `\$VAULT` 會亂）
- 若 commit 被質控蜂擋，先看 `.githooks/pre-commit` 錯誤訊息，補對應 frontmatter 欄位
- evolution-engine 的 `experiences.json` 是本地累積記憶（memory 後端 Provider not initialized 時的替代）
