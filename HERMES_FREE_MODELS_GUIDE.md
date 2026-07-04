# Hermes OmniAgent — 免費模型升級執行指南

> 版本：v3.1.0 | 日期：2026-07-04 | 作者：ESGGO Team

---

## 一、升級摘要

| 項目 | 升級前 | 升級後 |
|------|--------|--------|
| 免費模型數 | 7 個 | **15 個** |
| AI Provider | OpenRouter only | **Groq + OpenRouter + Gemini** |
| 每日免費額度 | 200 req/day | **200 req/day + 30 req/min (Groq)** |
| 模型品質 | 中等 | **大型 (70B-405B) 為主力** |
| 推理速度 | 普通 | **Groq 3-5x 加速** |

---

## 二、修改檔案清單

### 核心 AI 模組
| 檔案 | 修改內容 |
|------|---------|
| `apps/gateway/omni-server.mjs` | ✅ 新增 Groq 整合、擴充 11 個免費模型、修復 .env 載入 |
| `src/lib/agnes-api.ts` | ✅ 修復 `:free` Bug、新增 Groq fallback |
| `src/core/ai/report-generator.ts` | ✅ 擴充模型清單至 11 個 |

### API 路由
| 檔案 | 修改內容 |
|------|---------|
| `app/api/omni-one/route.ts` | ✅ 新增 Groq 支援、修復 FREE_TIER_ONLY 邏輯 |
| `app/api/agnes/route.ts` | ✅ 已自動回傳 provider/model metadata |

### 前端介面
| 檔案 | 修改內容 |
|------|---------|
| `src/components/AgnesProvider.tsx` | ✅ 暴露 provider/model/usage 狀態 |
| `app/omni-center/omni-one-chat.tsx` | ✅ 顯示 Provider/Model badge、更新模型切換器 |

### 設定檔
| 檔案 | 修改內容 |
|------|---------|
| `apps/gateway/.env` | ✅ 新增 GROQ_API_KEY |
| `.env`（根目錄） | ✅ 新增 GROQ_API_KEY |
| `apps/gateway/.env.example` | ✅ 新增 GROQ_API_KEY 範本 |
| `vps/.env.example` | ✅ 新增 GROQ_API_KEY 範本 |
| `deploy_hermes.sh` | ✅ 新增 GROQ_API_KEY 環境變數 |
| `vps/docker-compose.yml` | ✅ 新增 GROQ_API_KEY |

---

## 三、免費模型清單

### Groq（主力 — 最快，無每日上限）

| 模型 ID | 名稱 | 參數量 | Context | 用途 |
|---------|------|--------|---------|------|
| `llama-3.3-70b-versatile` | Llama 3.3 70B | 70B | 32K | ESG 分析、報告生成 |
| `llama-3.1-8b-instant` | Llama 3.1 8B | 8B | 8K | 快速回應、分類 |
| `gemma2-9b-it` | Gemma 2 9B | 9B | 8K | 輕量任務 |
| `mixtral-8x7b-32768` | Mixtral 8x7B | 8x7B | 32K | 長文本處理 |

### OpenRouter :free（備援 — 200 req/day）

| 模型 ID | 名稱 | Tier |
|---------|------|------|
| `nousresearch/hermes-3-llama-3.1-405b:free` | Hermes 3 405B | Premium |
| `meta-llama/llama-3.2-90b-vision:free` | Llama 3.2 90B Vision | Premium |
| `openai/gpt-oss-120b:free` | GPT-OSS 120B | Premium |
| `meta-llama/llama-3.3-70b-instruct:free` | Llama 3.3 70B | Large |
| `qwen/qwen3-next-80b-a3b-instruct:free` | Qwen3 Next 80B | Large |
| `mistralai/mistral-small-3.1-24b:free` | Mistral Small 3.1 24B | Mid |
| `google/gemma-4-31b-it:free` | Gemma 4 31B | Mid |
| `google/gemma-3-27b-it:free` | Gemma 3 27B | Mid |
| `qwen/qwen3-vl-8b:free` | Qwen3-VL 8B | Light |
| `google/gemma-2-27b-it:free` | Gemma 2 27B | Mid |
| `meta-llama/llama-3.2-3b-instruct:free` | Llama 3.2 3B | Light |

---

## 四、部署步驟

### 4.1 取得 Groq API Key

1. 前往 https://console.groq.com/keys
2. 註冊/登入帳號
3. 點擊 "Create API Key"
4. 複製 `gsk_xxxxxxxx` 格式的 Key

### 4.2 本機設定

```bash
# 設定環境變數
export GROQ_API_KEY=gsk_xxxxxxxx

# 驗證語法
node --check apps/gateway/omni-server.mjs
```

### 4.3 VPS 部署

```bash
# 1. SSH 到 VPS
ssh root@161.118.248.180

# 2. 進入 Gateway 目錄
cd /root/gateway

# 3. 安裝依賴（首次）
cat > package.json << 'EOF'
{
  "name": "esggo-omnigateway",
  "version": "3.0.0",
  "type": "module",
  "dependencies": {
    "express": "^4.21.0",
    "cors": "^2.8.5",
    "helmet": "^8.0.0",
    "express-rate-limit": "^7.4.0",
    "ws": "^8.18.0",
    "@google/generative-ai": "^0.21.0"
  }
}
EOF
npm install --production

# 4. 更新 .env 加入 GROQ_API_KEY
sed -i 's/^# GROQ_API_KEY=.*/GROQ_API_KEY=gsk_xxxxxxxx/' ~/.hermes/.env
cp ~/.hermes/.env /root/gateway/.env

# 5. 複製更新的 omni-server.mjs（從本機）
# scp apps/gateway/omni-server.mjs root@161.118.248.180:/root/gateway/

# 6. 重啟服務
systemctl restart omnigateway

# 7. 驗證
curl -s http://127.0.0.1:8642/status | python3 -m json.tool
```

### 4.4 驗證部署

```bash
# 檢查服務狀態
systemctl status omnigateway

# 檢查 Provider 連線
curl -s http://161.118.248.180:8642/status | grep -E '"groq"|"openrouter"'

# 測試 AI 執行
curl -s -X POST http://161.118.248.180:8642/execute \
  -H "Content-Type: application/json" \
  -H "X-Omni-Token: YOUR_GATEWAY_KEY" \
  -d '{"task":{"id":"test","taskType":"carbon_calculation","title":"碳排測試","prompt":"簡述 ISO 14064"},"skillId":"carbon_calculation"}'
```

---

## 五、AI Fallback Chain

```
┌─────────────────────────────────────────────────────────┐
│  1. Local Ollama/Gemma  ──── 完全免費（自架）            │
│  2. Google Gemini       ──── 免費層（需 key）            │
│  3. Groq                ──── 30 req/min，無每日上限 ⭐   │
│  4. OpenRouter :free    ──── 200 req/day（11 個模型）    │
│  5. Mock                ──── 保底回退                    │
└─────────────────────────────────────────────────────────┘
```

---

## 六、技能-模型對照表

| 技能 ID | 技能名稱 | OpenRouter 模型 | Groq 模型 |
|---------|---------|----------------|-----------|
| `gri_report_draft` | GRI 報告草稿 | Llama 3.2 90B Vision | Llama 3.3 70B |
| `carbon_calculation` | ISO 14064 碳排計算 | Mistral Small 3.1 24B | Llama 3.3 70B |
| `compliance_review` | CSRD/GRI 合規審查 | Qwen3 Next 80B | Llama 3.3 70B |
| `evidence_ocr` | 帳單 OCR 提取 | Qwen3-VL 8B | Gemma 2 9B |
| `email_archival` | 郵件自動歸檔 | Llama 3.3 70B | Llama 3.1 8B |
| `stakeholder_analysis` | 問卷分析 | Qwen3 Next 80B | Llama 3.3 70B |
| `omni_jules_heal` | 自動修復 | GPT-OSS 120B | Llama 3.3 70B |
| `swarm_orchestration` | 蜂群調度 | Mistral Small 3.1 24B | Llama 3.1 8B |

---

## 七、API 端點

| 端點 | 方法 | 說明 |
|------|------|------|
| `/health` | GET | 健康檢查 |
| `/status` | GET | 完整狀態（含 Provider 狀態） |
| `/models` | GET | 免費模型清單 |
| `/skills` | GET | 技能註冊表 |
| `/execute` | POST | AI 任務執行 |
| `/stream` | POST | SSE 串流 AI 輸出 |

---

## 八、故障排除

### Q1: Gateway 啟動失敗 `Cannot find package 'express'`
```bash
cd /root/gateway && npm install --production
```

### Q2: Provider 顯示 `false`
```bash
# 確認 .env 在 Gateway 目錄
ls -la /root/gateway/.env
grep GROQ_API_KEY /root/gateway/.env
# 重啟
systemctl restart omnigateway
```

### Q3: Groq 429 Rate Limited
Groq 限制 30 req/min。系統會自動 fallback 到 OpenRouter :free 模型。

### Q4: OpenRouter 429 Rate Limited
OpenRouter :free 限制 200 req/day。系統會自動使用 Groq 或 Mock fallback。

### Q5: 查看即時日誌
```bash
journalctl -u omnigateway -f
```

---

## 九、監控指標

透過 `GET /status` 查看：
- `providers.groq` — Groq 連線狀態
- `providers.openrouter` — OpenRouter 連線狀態
- `providers.free_models` — 免費模型總數
- `errors.totalErrors` — 錯誤總數
- `uptime_seconds` — 運行時間

---

## 十、成本估算

| Provider | 費用 | 備註 |
|----------|------|------|
| Groq | **$0** | 30 req/min，無每日上限 |
| OpenRouter :free | **$0** | 200 req/day |
| Gemini | **$0** | 免費層 |
| **總計** | **$0/月** | 完全免費 |

---

> 完成！Hermes 現在有 15 個免費模型可用，Groq 作為主力 Provider，推理速度提升 3-5 倍且無每日上限。
