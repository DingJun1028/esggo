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

---

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
4. **重新構建**:
   如果出現模組丟失，執行 `./deploy-omni.sh` 會自動觸發 `npm ci` 進行物理級重建。

---

## 🛡️ 安全規範
- **密鑰保護**: 切勿在連線後直接於終端打印 `.env` 內容。
- **防火牆**: 僅開放必要端口 (80, 443, 22, 8642)。
