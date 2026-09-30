# esggo AGENTS.md — 自動修復協議

## Base44 開發環境

- **啟動**: `docker compose -f docker-compose.base44.yml up -d`
- **預覽端口**: 3000（Next.js 16 Turbopack dev server，bind 0.0.0.0）
- **資料庫**: PostgreSQL 16（compose service `postgres`），Prisma schema 用 `prisma db push` 同步（無 migration 檔案）
- **唯一必填環境變數**: `DATABASE_URL`（compose 內聯提供，指向本地 postgres）
- **可選外部服務**: AI providers（Gemini/Groq/OpenRouter）、Supabase、Firebase — app 不接也可啟動
- **Auth**: 本地 localStorage 模擬（`src/lib/auth.ts`），不依賴 Firebase
- **兩個 next.config**: Next.js 16 使用 `next.config.js`（非 `.ts`）；`allowedDevOrigins` 加在 `.js` 中
- **健康檢查**: `/api/healthz` 回傳 503（import smart-ai-router 失敗），compose healthcheck 改用 `/`
- **驗證 app 運作**: `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/` 應回 200

## 自動修復機制

## 自動修復機制

本專案啟用了 **自動修復 + 萬能分身追蹤** 機制，位於 `.hermes/auto-repair/`。

### 機制架構

```
.hermes/auto-repair/
├── error-patterns.yaml   # 錯誤模式匹配規則
├── fix-actions.yaml      # 修復動作映射
├── repair-engine.py      # 核心修復引擎
├── clone-tracker.py      # 萬能分身追蹤器
├── auto-fix.sh           # 入口腳本
├── repair-log.jsonl      # 修復日誌
└── tracker-log.jsonl     # 追蹤日誌
```

### 使用方式

```bash
# 根據錯誤訊息自動修復
./auto-fix.sh "Permission denied (publickey)"

# 從檔案讀取錯誤並修復
./auto-fix.sh --file /tmp/error.log

# 監控模式：自動檢查並修復
./auto-fix.sh --monitor

# 查看追蹤器狀態
./auto-fix.sh --status

# 顯示幫助
./auto-fix.sh --help
```

### 自動修復範圍

| 錯誤類型 | 自動修復動作 |
|---|---|
| Dependabot 漏洞 | 自動生成 per-package PR |
| SSH Permission denied | 自動 chmod 600 + 重連 |
| pnpm audit 漏洞 | 自動添加 override 到 pnpm-workspace.yaml |
| 建構失敗 (Prisma) | 自動 prisma generate + rebuild |
| .env.example 衝突 | 自動去重合併 |
| Python 截斷 | 自動寫檔後執行 |
| VPS PM2 reload | 自動 SSH + pm2 reload ecosystem.config.js |

### 萬能分身追蹤

- 每個修復任務分配唯一 `task_id`
- 分身會追蹤每一步進度並記錄日誌
- 失敗時自動升級（最多 3 次重試）
- 升級後通知用戶手動介入

### 配置

錯誤模式定義於 `.hermes/auto-repair/error-patterns.yaml`，修復動作定義於 `.hermes/auto-repair/fix-actions.yaml`。

### 日誌

- 修復日誌：`.hermes/auto-repair/repair-log.jsonl`
- 追蹤日誌：`.hermes/auto-repair/tracker-log.jsonl`
- 狀態檔：`.hermes/auto-repair/tracker-state.json`
