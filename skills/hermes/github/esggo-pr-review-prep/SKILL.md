---
name: esggo-pr-review-prep
description: "esggo PR review: recon local clone when terminal is absent."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [windows]
tags: [github, code-review, esggo, pr-review, reconnaissance, my-server]
---

# esggo-pr-review-prep — PR 審查前基線偵察（無 terminal 時）

## Trigger
使用者要求 review 某個 GitHub PR（尤其 DingJun1028/esggo），但本 session：
- `terminal` 工具不存在（無法跑 `git` / `gh` / `curl` 抓 PR）
- `web_extract` / `web_search` 因 Firecrawl 額度耗盡報 `Payment Required`
- 有 `mcp__my_server__*` 檔案系統工具，且允許目錄含 `C:\Project\esggo`（目標 repo 的本地 clone）

## Why
拿不到遠端 diff 時，仍可用本地 clone 建立「審查基線」：讀現有源碼、確認既有模式與風險點。等 diff 一到（見下「解鎖路徑」）即可瞬間對照審查，而非空談。

## Steps
1. **確認允許目錄**：`mcp__my_server__list_allowed_directories` → 確認 `C:\Project\esggo` 在內。
2. **確認本地分支狀態**：讀 `.git/HEAD` 與 `.git/packed-refs` → 確認是否已有 PR 的 `feat` 分支或 `refs/pull/N`（通常沒有，PR 分支只在遠端）。
3. **建立 5T 基線**（esggo 專案關鍵）：
   - 讀 `src/lib/five-t-protocol.ts` → 現有 `FiveTTangible` / `FiveTTrackable` 等類別的 metrics 實作。
   - 讀 `5t-protocol-compliance-report.md` → 既有測試覆蓋（83 測試 100% 通過）與整合點。
4. **列目錄確認既有結構**（不要 repo-wide 搜尋）：`list_directory` 於 `app/api/`、`components/`、`src/lib/` 等，確認有無 dashboard/metrics 路由或元件。
5. **產出預擬審查清單**（見下）與「待解鎖」說明，誠實標明「尚未取得 diff、未宣稱已審查」。

## Pitfalls
- **`search_files` 在巨型 repo 會 300s 超時**：esggo 含 `node_modules` / `.next` / `.turbo`，勿對根目錄跑 search_files。改用 `read_text_file` / `list_directory` 指定明確路徑。
- **勿杜撰審查**：拿不到 diff 就明說阻塞，絕不用假 diff 產假報告（核心鐵律）。
- **靜態 Map 易失性**：esggo 的 5T 狀態全在 module-level `static Map`，serverless（vercel / wrangler / worker）cold start 會清空 → 任何 dashboard PR 必須確認是否接持久層。
- **`my-server` 只讀不寫評論**：無法對 GitHub 留言，只能產本地報告。

## 審查清單模板（esggo 5T dashboard 類 PR）
| 項 | 嚴重度 | 基線依據 |
|----|--------|----------|
| 讀取來源是靜態 Map 還是持久層（DB/KV） | 🔴 Critical | 5T 全 `static Map`，serverless 重啟即清 |
| metrics 是否有 boot seed / 註冊 | 🔴 Critical | `registerMetric` 需顯式呼叫，無自動播種 |
| 新 API 路由是否帶認證 | ⚠️ Warning | `app/api` 既有 auth 模式 |
| 輸出過 5T 閘（Trustworthy 快照 HashLock / Traceable 標記） | ⚠️ Warning | 5T 規範要求 |
| 是否改動 `five-t-protocol.ts`（83 測試需續綠） | ⚠️ Warning | 既有 5T 套件 100% 通過 |
| 新增 vitest 測試覆蓋新路由/元件 | 💡 Suggestion | repo 慣用 vitest |
| 前端落入 `components/views` \| `components/ui` 並對接新 API | 💡 Suggestion | 既有結構慣例 |
| 新檔是否硬編碼密鑰（grep `api_key\|secret\|token=`） | 🔴 Critical | 安全鐵律 |

## 解鎖路徑（取得 diff）
- **A** 復原 terminal：`hermes config set terminal.backend local` + 完全重啟 Hermes → `git fetch origin pull/N/head` + `gh pr diff N`，可 inline 留言。
- **B** 補 Firecrawl 額度 → `web_extract` 抓 `.diff` 產報告（仍無 terminal 則無法自動留言）。
- **C** 使用者貼 diff → 對照基線逐檔審。

## Verification
- 確認已讀到真實源檔（非杜撰）：輸出中引用具體檔案路徑與函式名（如 `FiveTTangible._metrics`）。
- 最終誠實聲明：是否已取得 diff、是否已完成實際審查。
