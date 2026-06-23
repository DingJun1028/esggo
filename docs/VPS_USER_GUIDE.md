# ESGGO VPS 使用者登入指南

## 系統概覽

| 項目 | 值 |
|------|-----|
| VPS IP | 161.118.248.180 |
| SSH 端口 | 22 |
| 使用者 | root |
| 系統 | Ubuntu 24.04 LTS (ARM64) |
| OCPU | 4 |
| RAM | 24 GB |

## 服務端點

| 服務 | URL | 說明 |
|------|-----|------|
| ESGGO 前端 | http://161.118.248.180 | Next.js 15 主應用 |
| OmniAgent Gateway | http://161.118.248.180:8642 | AI Gateway v3.0 |
| Hermes Agent | 內建 Gateway | AI 推理引擎 |
| Nginx | :80 | 反向代理 |

---

## 一、SSH 登入

### 從 Windows (PowerShell)

```powershell
ssh -i C:\Users\Administrator\Downloads\ssh-key-2026-04-25.key root@161.118.248.180
```

### 從 macOS / Linux

```bash
ssh -i ~/.ssh/esggo-vps-key root@161.118.248.180
```

### 從瀏覽器 (Oracle Cloud Console)

1. 登入 https://console.cloud.oracle.com
2. Compute → Instances → Ubuntu 24.04
3. **Console Connection** → 建立連接

> 注意：SSH 已禁用密碼登入，只允許金鑰認證。

---

## 二、Hermes Agent 使用方式

### 互動模式 (TUI)

```bash
# 啟動互動對話（預設模型：openrouter/owl-alpha）
hermes

# 指定模型
hermes -m google/gemma-4-31b-it:free
hermes -m nvidia/nemotron-3-ultra-550b-a55b:free

# 指定模型提供者
hermes --provider openrouter -m google/gemma-4-31b-it:free
```

### 單一查詢 (One-shot)

```bash
hermes -z '你好，請介紹一下你自己'
hermes -z '分析 ESG 風險' --provider openrouter -m google/gemma-4-31b-it:free
```

### Gateway 管理

```bash
hermes gateway status       # 查看狀態
hermes gateway start        # 啟動
hermes gateway restart      # 重啟
journalctl --user -u hermes-gateway -f  # 查看日誌
```

---

## 三、可用 AI 模型 (OpenRouter 免費，17個)

| 模型 ID | 說明 | 上下文 |
|---------|------|--------|
| google/gemma-4-31b-it:free | Gemma 4 31B (Thinking) | 262K |
| google/gemma-4-26b-a4b-it:free | Gemma 4 26B A4B | 262K |
| nvidia/nemotron-3-ultra-550b-a55b:free | NVIDIA Nemotron 3 Ultra 550B | 1M |
| nvidia/nemotron-3-super-120b-a12b:free | NVIDIA Nemotron 3 Super 120B | 1M |
| qwen/qwen3-coder:free | Qwen3 Coder | 1M |
| qwen/qwen3-next-80b-a3b-instruct:free | Qwen3 Next 80B | 262K |
| openai/gpt-oss-120b:free | GPT-OSS 120B | 131K |
| openai/gpt-oss-20b:free | GPT-OSS 20B | 131K |
| meta-llama/llama-3.3-70b-instruct:free | Llama 3.3 70B | 131K |
| meta-llama/llama-3.2-3b-instruct:free | Llama 3.2 3B | 131K |
| nousresearch/hermes-3-llama-3.1-405b:free | Hermes 3 405B | 131K |
| nvidia/nemotron-nano-9b-v2:free | NVIDIA Nano 9B | 128K |
| liquid/lfm-2.5-1.2b-thinking:free | Liquid LFM 2.5 Thinking | 32K |
| cognitivecomputations/dolphin-mistral-24b-venice-edition:free | Dolphin Mistral 24B | 32K |
| poolside/laguna-xs.2:free | Poolside Laguna XS.2 | 262K |
| poolside/laguna-m.1:free | Poolside Laguna M.1 | 262K |
| openrouter/free | OpenRouter Auto | 200K |

### 切換模型

```bash
hermes -m <模型ID>
# 例如：
hermes -m nvidia/nemotron-3-ultra-550b-a55b:free
hermes -m google/gemma-4-31b-it:free
```

---

## 四、PM2 程序管理

```bash
pm2 list                               # 查看所有程序
pm2 logs esggo-core                    # ESGGO 前端日誌
pm2 logs omniagent-gateway             # Gateway 日誌
pm2 restart esggo-core                 # 重啟前端
pm2 restart omniagent-gateway          # 重啟 Gateway
pm2 monit                              # 效能監控
```

### 程序說明

| 程序名 | 端口 | 說明 |
|--------|------|------|
| esggo-core | 3000 | Next.js 主應用 |
| omniagent-gateway | 8642 | OmniAgent AI Gateway (v3.0) |

---

## 五、Nginx 反向代理

```
http://161.118.248.180/      → esggo-core (:3000)
http://161.118.248.180:8642  → omniagent-gateway (WebSocket + API)
http://161.118.248.180/ws    → WebSocket 雙向同步
```

---

## 六、系統監控

```bash
uptime            # 負載
free -h           # 記憶體
df -h             # 磁碟
curl http://localhost:3000            # 前端健康
curl http://localhost:8642/health    # Gateway 健康
```

---

## 七、Git 部署

```bash
cd /var/www/esggo
git pull origin main      # 拉最新代碼
pm2 restart esggo-core    # 重啟前端
```

---

## 安全設定

- SSH：**只用 key**（密碼已禁用）
- 防火牆 ufw：**已啟用**，開放 22/80/443/3000:3010/8642
- fail2ban：**已安裝並運行**
- .env 權限：**chmod 600**

---

**最後更新：2026-06-23 | 模型數量：17 個免費 | 端口：3000-3010**
