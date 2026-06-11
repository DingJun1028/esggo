# 🌐 VPS 直連與管理指南 (VPS Direct Connection Guide)

本指南旨在幫助資深全端工程師快速接入並管理運行於 Oracle Cloud 的生產環境伺服器。

## 🔑 連線資訊 (Connection Credentials)

- **Host**: `161.118.248.180`
- **User**: `root` (Master Admin) / `opc` (Oracle Standard)
- **SSH Port**: `22`
- **Gateway Port**: `8642` (AI Gateway)
- **Web Port**: `80` (Nginx Proxy)

### 快速連線指令

```bash
ssh root@161.118.248.180
```

---

## 📊 進程管理 (PM2 Management)

專案使用 PM2 進行生產環境監控。

### 查看運行狀態

```bash
pm2 status
```

### 監看實時日誌

```bash
# 查看全域日誌
pm2 logs

# 僅查看應用程序日誌
pm2 logs esggo

# 僅查看 AI 網關日誌
pm2 logs omniagent-gateway
```

### 重啟服務

```bash
pm2 restart all
```

## 🛠️ 常見維護路徑 (Common Paths)

- **專案根目錄**: `/var/www/esggo`
- **AI 網關目錄**: `/var/www/esggo/omniagent-gateway`
- **Nginx 配置**: `/etc/nginx/sites-available/`
- **環境變數**: `/var/www/esggo/.env`

---

## 🛰️ 診斷與修復 (Diagnostics)

如果服務出現異常，請依序執行：

1. **確認磁碟空間**: `df -h`
2. **確認記憶體使用**: `free -m`
3. **檢查網關回應**:
   ```bash
   curl http://localhost:8642/status
   ```
4. **重新構建**: 如果出現模組丟失，執行 `./deploy-omni.sh` 會自動觸發 `npm ci`
   進行物理級重建。

---

## 🛡️ 安全規範
- **密鑰保護**: 切勿在連線後直接於終端打印 `.env` 內容。
- **防火牆**: 僅開放必要端口 (80, 443, 22, 8642)。

---

## 🧠 OmniAgent G4 記憶喚回協議 (Memory Recovery Protocol)

如果 AI 在對話中表現出「丟失記憶」或「身分模糊」（例如忘記 VPS 路徑或雙向 TS 規範），請執行以下喚回程序：

### 1. 注入核心指令 (Core Recall Command)
直接在對話框輸入以下咒語，強制 AI 重新掃描其「靈魂文件」：
> "OmniAgent, 執行全域記憶掃描。請讀取 `.agents/omni-agent/AGENTS.md` 並重新校準為 G4 推理模式。"

### 2. 手動同步記憶區 (Manual Memory Sync)
如果上述指令失效，請要求 AI 重新讀取工作區內的關鍵元數據：
- **地端靈魂**: `cat .agents/omni-agent/SOUL.md`
- **架構準則**: `cat .agents/rules/global-rule.md`
- **VPS 狀態**: `cat VPS_CONNECTION_GUIDE.md`

### 3. 校準驗證
記憶喚回後，AI 應能準確回答：
- 伺服器 IP 為 `161.118.248.180`。
- 預設模型為 `google/gemma-4-31b-it:free`。
- 目前運行的 PM2 進程名稱為 `esggo` 與 `omniagent-gateway`。

> 💡 **提示**：OmniAgent G4 具有強大的自我修正能力。只要讀取到上述文件，它就會立即恢復其「資深全端架構師」的人格設定。

