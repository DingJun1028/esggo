---
name: browser-use-automation
description: "Browser Use Cloud API automation patterns for web scraping, data collection, and browser automation tasks"
version: 1.0.0
author: Hermes Agent
license: MIT
tags: [browser, automation, web-scraping, api-integration, browser-use]
metadata:
  hermes:
    tags: [browser, automation, web-scraping, api-integration]
---

# Browser Use Cloud Automation

技能概述：
使用 Browser Use Cloud API 進行網頁自動化、數據收集和瀏覽器操作。

## 何時使用

- 需要自動化複雜的網頁操作（搜尋、下載、表單提交等）
- 收集來自動化網站的數據（arXiv、論文、產品資訊等）
- 需要 stealth 代理和住宅 IP 來繞過反爬機制
- 執行需要多步驟瀏覽器操作的任務

## 工作流程

### 1. 安裝與配置

```bash
# 安裝 SDK
pip install browser-use-sdk

# 設定 API 金鑰
export BROWSER_USE_API_KEY=你的金鑰
```

### 2. API V4 使用模式（推薦）

API V4 最準確，適合複雜任務：

```python
from browser_use_sdk.v4 import BrowserUse

client = BrowserUse(api_key="bu_你的金鑰")

# 建立執行任務
run = client.runs.create(
    task="你的任務描述",
    model="grok-4.5",  # 最佳價格/準確率平衡
)

# 等待完成
result = client.runs.wait_for_completion(run.id)
```

### 3. 直接 REST API 呼叫

```bash
# 建立任務
curl -X POST https://api.browser-use.com/api/v4/runs \
  -H "X-Browser-Use-API-Key: bu_你的金鑰" \
  -H "Content-Type: application/json" \
  -d '{"task":"你的任務","model":"grok-4.5"}'

# 輪詢狀態
curl https://api.browser-use.com/api/v4/runs/{run_id}/status \
  -H "X-Browser-Use-API-Key: bu_你的金鑰"

# 獲取結果
curl https://api.browser-use.com/api/v4/runs/{run_id} \
  -H "X-Browser-Use-API-Key: bu_你的金鑰"
```

## 常見模型選擇

| 模型 | API 字串 | 輸入 | 快取讀取 | 輸出 | BYOK |
|------|----------|------|----------|------|------|
| Claude Opus 5 | `claude-opus-5` | $6.00 | $0.60 | $30.00 | Anthropic |
| Grok 4.5 | `grok-4.5` | $2.40 | $0.36 | $7.20 | — |
| GPT-5.6 | `gpt-5.6` | $6.00 | $0.60 | $36.00 | OpenAI |

## 常見任務範例

### arXiv 論文搜尋與下載

```python
run = client.runs.create(
    task="""
    Go to https://arxiv.org/search/ and search for 'web agents' papers.
    Filter for papers submitted between March 14, 2026 and March 21, 2026.
    Download all PDF papers and provide a summary.
    """,
    model="grok-4.5",
)
```

### 多網站比較

```python
run = client.runs.create(
    task="Compare pricing plans across 5 competitor websites",
    model="grok-4.5",
)
```

## 重要注意事項

### 停止瀏覽器

不要使用 `client.close()` 或關閉 CDP 連接！
使用正確的停止方法：

```python
# 獲取瀏覽器 ID
browser = client.browsers.create(proxy_country_code="us")

# 正確停止
client.browsers.stop(browser.id)
```

或使用 REST API：

```bash
curl -X PATCH https://api.browser-use.com/api/v4/browsers/{browser_id} \
  -H "X-Browser-Use-API-Key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action":"stop"}'
```

### 代理設定

```python
browser = client.browsers.create(proxy_country_code="us")  # 美國代理
browser = client.browsers.create(proxy_country_code="null")  # 無代理
```

## 錯誤處理

### 常見錯誤

1. **API 金鑰無效**：確保金鑰以 `bu_` 開頭
2. **模型不支援**：使用 V4 API 時，新模型可能需要直接呼叫 REST
3. **瀏覽器超時**：增加 `timeout` 參數或使用較快的模型

## 相關技能

- `autonomous-ai-agents/hermes-agent` — Hermes Agent 整合
- `swarm-deployment` — 多代理部署模式
- `hermes-mcp-management` — MCP 伺服器管理

## 參考文件

- 官方文檔：https://docs.browser-use.com
- API 文檔：https://docs.browser-use.com/cloud/api-v4-overview
- 定價資訊：https://browser-use.com/pricing.md