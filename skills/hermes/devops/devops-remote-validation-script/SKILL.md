---
name: devops-remote-validation-script
description: Scripts for SSH endpoint validation of remote servers.
author: Agent (DingJun1028)
version: 1.0
tags:
  - devops
  - testing
  - ssh
  - health-check
---

# 🧪 Remote Validation Script

## 📚 使用情境

當需要：
- 驗證遠端伺服器健康狀態
- 測試 API 功能
- 將測試腳本「下放」給使用者在遠端執行

## 🛠 核心腳本：`test_remote.mjs`

### 功能
- ✅ 健康檢查 `/health`
- ✅ 單語翻譯測試
- ✅ 多語平行翻譯測試
- ✅ SSE 端點驗證

### 使用方式

```bash
# 方式 1：SSH 遠端拉取
ssh ubuntu@your-vps 'bash <(curl -s https://raw.githubusercontent.com/DingJun1028/esggo/main/apps/universal-translator/test_remote.mjs)'

# 方式 2：下載執行
curl -O https://xxx/test_remote.mjs && node test_remote.mjs

# 方式 3：指定 port
PORT=8788 node test_remote.mjs
```

## ⚠️ 常見阻塞

| 阻塞來源 | 解決方案 |
|----------|----------|
| `shell` 工具不可用 | 改用 `terminal` 或寫遠端腳本 |
| 服務未啟動 | `pm2 start` 或 `node server.mjs &` |
| 防火牆阻擋 | `ufw allow 8788` |

## 📝 版控

- v1.0: 2026-08-06，基於 `apps/universal-translator/test_remote.mjs`