# ESGGO 平台啟動指南 (ESGGO Startup Guide)

## 系統概覽

**ESGGO** (善向永續) 是一個基於 5T 協議的 ESG 永續治理平台，整合了 AI 分析、資料存儲與實時監控。

## 環境配置

### 1. OpenRouter AI 服務

```env
OPENROUTER_API_KEY=your_openrouter_api_key
AI_ENGINE=openrouter
AI_MODEL=mistralai/mistral-small-3.1-24b:free
```

### 2. Telegram 閘道

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

### 3. Supabase 資料庫

```env
NEXT_PUBLIC_SUPABASE_URL=https://test-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 服務端點

| 服務     | URL                         | 功能               |
| -------- | --------------------------- | ------------------ |
| 前台     | http://localhost:3000       | Next.js 前端伺服器 |
| VPS API  | http://161.118.248.180:8642 | 生產環境 API       |
| AI Chat  | /api/omni-agent/chat        | 對話接口           |
| 筆記同步 | /api/omni-notes             | 筆記管理           |
| 知識庫   | /api/omni-knowledge         | 知識搜索           |
| 記憶體   | /api/omni-memory            | 記憶體查詢         |

## Wiki 導航

### 萬能元件終極矩陣

- `docs/wiki/OMNI_COMPONENT_MATRIX.md` - 功能導覽地圖
- `docs/wiki/OMNI_SERIES.md` - 萬能系列組件
- `docs/wiki/OMNI_SYSTEM.md` - OmniSystem MECE 架構

### 瀏覽 Wiki

```bash
# 本地訪問
http://localhost:3000/wiki/OMNI_SYSTEM.md
```

## 啟動步驟

### 1. 啟動開發伺服器

```bash
npm run dev
# 或
pnpm dev
```

### 2. 啟動前端介面

瀏覽器打開: `http://localhost:3003/omni-components`

### 3. 測試 API

```bash
# AI 對話
curl -X POST http://localhost:3000/api/omni-agent/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"請分析台積電 ESG 風險"}]}'

# 筆記同步
curl -X POST http://localhost:3000/api/omni-notes \
  -H "Content-Type: application/json" \
  -d '{"action":"sync","note":{"id":"test-001","type":"knowledge","content":"ESG測試 #測試"}}'

# 批量同步
curl -X POST http://localhost:3000/api/omni-notes \
  -H "Content-Type: application/json" \
  -d '{"action":"sync","notes":[{"id":"n1","type":"task","content":"任務一"},{"id":"n2","type":"research","content":"研究二"}]}'
```

## 功能模組

### OmniAgent 核心

- **對話模式**: 使用 Mistral Small 3.1 模型 (免費版)
- **協議**: 遵循 5T 誠信協議 (True, Good, Aware, Trustworthy, Traceable)
- **語言**: 繁體中文為主

### ESG 分析功能

1. **碳盤查**: Scope 1/2/3 排放計算
2. **合規審查**: GRI, SASB, TCFD 標準對照
3. **風險評估**: Greenwashing 風險識別
4. **報告生成**: 自動化永續報告撰寫

### Telegram 通知

- 接收系統警報
- 查詢分析結果
- 觸發排程任務

## 模型列表 (Free)

| 模型 ID                                   | 供應商  | 狀態 |
| ----------------------------------------- | ------- | ---- |
| mistralai/mistral-small-3.1-24b:free      | Mistral | 預設 |
| google/gemma-4-31b-it:free                | Google  | 可用 |
| nousresearch/hermes-3-llama-3.1-405b:free | Nous    | 可用 |
| openai/gpt-oss-120b:free                  | OpenAI  | 可用 |
| meta-llama/llama-3.3-70b-instruct:free    | Meta    | 可用 |
| qwen/qwen3-next-80b-a3b-instruct:free     | Qwen    | 可用 |
| nvidia/nemotron-3-ultra-550b-a55b:free    | NVIDIA  | 可用 |

## 故障排除

### API 無響應

1. 檢查伺服器運行: `pm2 list`
2. 重新載入: `pm2 reload omniagent-gateway`
3. 檢查日誌: `pm2 logs omniagent-gateway`

### 模型錯誤

- 切換模型: 修改 `.env` 中的 `AI_MODEL`
- 重新啟動伺服器

### 資料庫連線

- 檢查 Supabase URL 與 Key
- 確認網路連線

## 生產部署

### VPS 部署

```bash
ssh root@161.118.248.180
cd /var/www/esggo/omniagent-gateway
pm2 reload omniagent-gateway
```

### 前台部署 (Vercel)

```bash
pnpm build
vercel --prod
```

## 日常維護

### 監控命令

```bash
# 伺服器狀態
pm2 list

# API 健康
curl http://localhost:3001/api/system/health

# VPS 狀態
curl http://161.118.248.180:8642/status
```

---

**版本**: v9.0.0 (OmniSystem MECE 24 類別)  
**更新**: 2026-06-16
