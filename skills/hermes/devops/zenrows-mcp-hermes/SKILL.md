---
name: zenrows-mcp-hermes
version: 1.0.0
author: dingj (OA-Team)
license: AGPL-3.0
metadata:
  hermes:
    tags: [mcp, scraping, zenrows, cron, automation]
    related_skills: [hermes-agent, hermes-mcp-management]
description: Connect Zenrows MCP to Hermes Agent for scraping/cron.
---

# Zenrows MCP ↔ Hermes Agent 整合

為 Hermes Agent 接入 Zenrows MCP，取得反爬抓取（proxy 輪換、anti-bot 繞過、browser 自動化）與排程抓取能力。

## When to Use

- 使用者想把 Zenrows 的 scrape / browser 工具接入 Hermes
- 要讓 Hermes 抓受 Cloudflare / 動態渲染保護的頁面
- 要排程每日價格監控、競品情報、求職版監看，並推播到 Telegram/Slack/Discord


- 使用者想把 Zenrows 的 scrape / browser 工具接入 Hermes
- 要讓 Hermes 抓受 Cloudflare / 動態渲染保護的頁面
- 要排程每日價格監控、競品情報、求職版監看，並推播到 Telegram/Slack/Discord

## 前置

- 已裝 Hermes（`hermes doctor` 通過）
- 已設 LLM provider（`hermes model`，context ≥ 64k）
- 有 Zenrows 帳號與 API key：https://app.zenrows.com/register

## 步驟

### 1. 加 Zenrows MCP 到 config

Hermes 的 `mcp_servers` 不在內建 catalog（尚未收錄），需手動加到 config。

- Windows: `C:\Users\<user>\AppData\Local\hermes\config.yaml`
- Linux/macOS/WSL2: `~/.hermes/config.yaml`

遠端 URL 版（推薦，免本地安裝）：

```yaml
mcp_servers:
  zenrows:
    url: "https://mcp.zenrows.com/mcp"
    headers:
      Authorization: "Bearer <YOUR_ZENROWS_API_KEY>"
```

本機 stdio 版（需 Node.js，`npx -y @zenrows/mcp`）：

```yaml
mcp_servers:
  zenrows:
    command: "npx"
    args: ["-y", "@zenrows/mcp"]
    env:
      ZENROWS_API_KEY: "<YOUR_ZENROWS_API_KEY>"
```

### 2. 啟動 / 重新載入

```bash
hermes chat          # 啟動時自動發現 MCP 並註冊 mcp_zenrows_* 工具
# 執行中改了 config，在 chat 內：
/reload-mcp          # 動態重載；不行就關掉重開 hermes chat
```

驗證：在 chat 問「Tell me which MCP-backed tools are available right now.」，應回 Zenrows + `mcp_zenrows_scrape` 等。

### 3. 選用：工具過濾

只允許 scrape、擋掉 browser 自動化：

```yaml
mcp_servers:
  zenrows:
    url: "https://mcp.zenrows.com/mcp"
    headers:
      Authorization: "Bearer <YOUR_ZENROWS_API_KEY>"
    tools:
      include: [scrape]
```

### 4. 基本用法（chat 內自然語言）

```
Scrape the top headlines from news.ycombinator.com and summarize the top 5.
Go to https://www.scrapingcourse.com/ecommerce and extract all product names and prices as a table.
Use Zenrows to scrape https://www.scrapingcourse.com/antibot-challenge and summarize.
```

Hermes 會根據頁面自動決定是否升級到 anti-bot bypass；必要時明說「Use Zenrows to scrape」。

### 5. 排程抓取（cron）

```bash
/cron add "every day at 9 am" "Scrape https://www.amazon.com/s?k=headset, get top 3 deals by price+ratings, return summary." --name "Headset deals"
```

靜默模式（無變化不出聲）：

```bash
/cron add "1d" "Scrape <url>, extract job postings. If nothing changed since last run, respond [SILENT]. Else list new postings." --name "Buying intent monitor"
```

管理：

```bash
/cron list            # 列出
/cron run <job_id>    # 立即測試
/cron pause <job_id>  # 暫停
/cron edit <job_id> --schedule "4h"
/cron remove <job_id> # 刪除
```

> cron 跑在全新 session，不繼承當前 chat 上下文；網址、擷取目標、輸出格式都要寫進 prompt。

### 6. 訊息推播（選用）

```bash
hermes gateway setup     # 互動選 Telegram/Discord/Slack/...
hermes gateway install   # 註冊成系統服務
hermes gateway start     # 背景跑
hermes gateway status    # 確認
```

Telegram 用 `@BotFather` 的 `/newbot` 拿 bot token 填進互動 CLI。

## 多 MCP 並存

```yaml
mcp_servers:
  zenrows:
    url: "https://mcp.zenrows.com/mcp"
    headers:
      Authorization: "Bearer <YOUR_ZENROWS_API_KEY>"
  github:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "<YOUR_TOKEN>"
```

## 成本

- MCP server 接入免費；每次 tool call 計入 Zenrows 訂閱：`scrape` 用 Fetch credits，`browser_*` 用 Browser Sessions credits。
- 用量看 https://app.zenrows.com/analytics

## 陷阱 / 排錯

1. **Telegram 沒回應**：gateway 沒跑 → `hermes gateway status` → 沒跑就 `hermes gateway start`；檢查 bot token 正確（@BotFather 建的）。
2. **MCP 工具沒載入**：確認 config 存到正確路徑 → 重啟 `hermes chat` → 驗證 API key 與 endpoint 拼對。
3. **抓到空/被擋內容**：Hermes 偶爾會用內建 browser 而非 Zenrows。明說：「Use Zenrows to scrape <url>」。
4. **cron 跑了但沒推播**：確認 gateway 在跑；`/cron run <job_id>` 看即時輸出。
5. **config 路徑**：務必改執行 Hermes 的那台機器的 config；ssh 盒上的 `~/.hermes/config.yaml` 不影響桌面 Hermes。
6. **本地 stdio 版**：需 Node 22；package 名為 `@zenrows/mcp`（文檔偶爾誤寫 `@file:"zenrows/mcp"` 是排版錯，實際是 `@zenrows/mcp`）。

## 與 OA-Team / 5T 關聯（選用）

此技能可視為「外部資料擷取層」。若接入 OA-Team 蜂群：traceable 要求記錄 source_origin（被抓的 URL + Zenrows 工具名），trustworthy 可對抓取結果 `Object.freeze()` 後入庫。
