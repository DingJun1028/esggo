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
| Nginx | :80/:443 | 反向代理 |

---

## 一、SSH 登入

### 從 Windows (PowerShell / CMD)

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
# 啟動互動對話（預設模型：google/gemma-4-31b-it:free）
hermes

# 指定模型
hermes -m gemini-2.5-flash

# 指定模型提供者
hermes --provider openrouter -m google/gemma-4-31b-it:free
hermes --provider gemini -m gemini-2.5-flash
```

### 單一查詢 (One-shot)

```bash
# 快速查詢
hermes -z '你好，請介紹一下你自己'

# 指定提供者
hermes -z '分析 ESG 風險' --provider openrouter -m google/gemma-4-31b-it:free
```

### Gateway 管理

```bash
# 查看狀態
hermes gateway status

# 啟動 Gateway
hermes gateway start

# 重啟 Gateway
hermes gateway restart

# 查看日誌
journalctl --user -u hermes-gateway -f
```

---

## 三、PM2 程序管理

```bash
# 查看所有程序
pm2 list

# 查看日誌
pm2 logs                  # 所有程序
pm2 logs esggo-core       # ESGGO 前端
pm2 logs omniagent-gateway # AI Gateway

# 重啟
pm2 restart esggo-core
pm2 restart omniagent-gateway

# 停止
pm2 stop esggo-core

# 效能監控
pm2 monit
```

### 程序說明

| 程序名 | 端口 | 說明 |
|--------|------|------|
| esggo-core | 3000 | Next.js 主應用 |
| omniagent-gateway | 8642 | OmniAgent AI Gateway |

---

## 四、Nginx 反向代理

### 配置位置

```
/etc/nginx/sites-available/omniagent  →  Gateway 代理
/etc/nginx/sites-available/esggo     →  前端代理
```

### 管理命令

```bash
# 測試配置
sudo nginx -t

# 重啟
sudo systemctl restart nginx

# 查看狀態
sudo systemctl status nginx
```

---

## 五、系統監控

```bash
# 系統資源
htop              # 互動式監控
free -h           # 記憶體
df -h             # 磁碟
uptime            # 負載

# VPS 健康檢查
curl http://localhost:8642/health    # Gateway 健康
curl http://localhost:3000            # 前端健康
```

---

## 六、Telegram Bot

### Bot 資訊

- **Bot Token**: 已配置於 `/var/www/esggo/.env`
- **Chat ID**: 6387287462
- **Gateway 整合**: 透過 Hermes Gateway 的 Telegram platform

### 驗證 Bot 運作

```bash
# 測試 Bot API
curl -s "https://api.telegram.org/bot8306758508:AAGnNRDHDxdcJ3lL99Qeix2NMX4lAmZTtKg/getMe"
```

---

## 七、可用 AI 模型 (免費)

| 模型 ID | 提供者 | 說明 |
|---------|--------|------|
| google/gemma-4-31b-it:free | OpenRouter | 預設模型 (31B) |
| gemini-2.5-flash | Google | 備用模型 |

### 切換模型

```bash
# 預設已被設為 Gemma 4
cat ~/.hermes/config.yaml | grep default

# 手動切換
hermes -m <模型ID>
```

---

## 八、故障排除

### PM2 程序下線

```bash
pm2 list                    # 查看狀態
pm2 logs esggo-core         # 查看日誌
pm2 restart esggo-core      # 重啟
```

### Nginx 502 Bad Gateway

```bash
# 檢查後端是否運行
pm2 list
curl http://localhost:8642/health

# 檢查 nginx 錯誤日誌
sudo tail -50 /var/log/nginx/error.log
```

### Hermes Gateway 錯誤

```bash
# 查看 Gateway 日誌
journalctl --user -u hermes-gateway --since today

# 重新安裝 Gateway 服務
hermes gateway uninstall
hermes gateway install
hermes gateway start
```

### 系統重啟後服務未啟動

```bash
# 確認 PM2 開機腳本
pm2 status
pm2 startup
pm2 save

# 確認 nginx
sudo systemctl enable nginx
```

---

## 九、Git 倉庫

```bash
cd /var/www/esggo

# 拉最新代碼
git pull origin main

# 重新構建
npm run build

# 重啟 PM2
pm2 restart esggo-core
```

---

## 安全設定摘要

- SSH 密碼登入：**已禁用**
- 防火牆 (ufw)：**已啟用**，開放 22/80/443/3000/8642
- fail2ban：**已安裝並運行**
- .env 權限：**chmod 600**

---

**最後更新：2026-06-23**
