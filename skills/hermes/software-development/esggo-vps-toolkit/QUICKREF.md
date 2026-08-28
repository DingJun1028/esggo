# ESGGO VPS Toolkit - 快速參考

## 🛠️ 常用指令

### SSH 登入
```bash
ssh -i ~/.ssh/id_rsa_esggo ubuntu@161.118.252.147
```

### 服務管理
```bash
# 查看服務狀態
sudo systemctl status nginx
sudo systemctl status docker
sudo systemctl status esggo-api

# 重啟服務
sudo systemctl restart nginx
sudo systemctl restart docker
```

### Docker 操作
```bash
# 檢查 Docker 狀態
docker compose version
docker ps

# 重啟容器
docker compose down
docker compose up -d
```

### SSL 續期
```bash
# 檢查證書
sudo certbot certificates

# 續期
sudo certbot renew --dry-run
```

### Nginx 配置
```bash
# 檢查配置
sudo nginx -t

# 重新載入
sudo systemctl reload nginx
```

## 🌐 域名規劃

| 域名 | 路由 | 目標 |
|------|------|------|
| esggo.co | `/` | React SPA |
| www.esggo.co | `/` | React SPA |
| ftg.esggo.co | `/ftg/` | /var/www/ftg-tours |
| esggo.co/api/ | `/api/` | 127.0.0.1:3000 |

## 📁 重要路徑

- **VPS IP**：161.118.252.147
- **作業系統**：Ubuntu 22.04 LTS / 24.04 LTS
- **Web 伺服器**：Nginx
- **應用程式**：React SPA + Next.js API
- **Docker**：docker-compose (v2 plugin)
- **SSL**：certbot + Cloudflare

## 🔐 金鑰管理

### GitHub Actions 金鑰
- **私鑰**：`VPS_SSH_KEY` (repo Secret)
- **公鑰**：安裝於 `~/.ssh/authorized_keys`

### Cloudflare API
- **Token**：需 Zone:DNS:Edit 權限
- **Zone ID**：8dda3653e490290412f7be84a84e0dc9
- **Account ID**：d9d7ecd92cbad6d858fba3e529b9cb7b

## 🚨 常見問題

### 1. HTTPS 重定向迴圈
1. 移除 nginx 80→HTTPS 重定向
2. 確保 443 server block 不再強制 HTTPS
3. 重新載入 nginx
4. 清除 Cloudflare 快取

### 2. Docker 容器無法啟動
```bash
# 檢查
docker ps -a
docker logs <container-name>

# 重啟 Docker
sudo systemctl restart docker

# 或重裝
sudo apt-get install -y docker.io docker-compose-plugin containerd
```

### 3. certbot 續期失敗
1. 確認 DNS 記錄正確解析到 VPS
2. 手動續期：`sudo certbot --nginx -d esggo.co -d www.esggo.co`

### 4. Docker Desktop Virtualization Issues (Windows)

#### 常見錯誤
> "Virtualization support wasn't detected. Contact your IT admin to enable virtualization or check system requirements."

#### 預檢查指令
```powershell
# 檢查虛機化支援
Get-CimInstance -ClassName Win32_Processor | Select-Object VirtualizationFirmwareEnabled
# 或使用
wmic cpu get VirtualizationFirmwareEnabled
```

#### 解決方案步驟

1. **BIOS/UEFI 設定**
   - 重新啟動電腦
   - 進入 BIOS/UEFI (F2, F12, DEL, ESC)
   - 啟用虛機化：
     - Intel：Intel VT-x 或 Vanderpool
     - AMD：AMD-V 或 SVM
   - 儲存設定並離開

2. **Windows 功能**
   ```powershell
   # 以系統管理員身分執行
   dism /online /enable-feature /featurename:Microsoft-Hyper-V-All /all /norestart
   dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   ```

3. **WSL 2 設定**
   ```powershell
   # 安裝 WSL 2
   wsl --install
   # 設定為預設
   wsl --set-default-version 2
   ```

4. **Windows 版本支援**

| 版本 | 支援情況 |
|------|----------|
| Windows 10/11 Pro | ✅ 完整支援 (Hyper-V) |
| Windows 10/11 Home | ✅ WSL 2 後端 |
| Windows 10/11 Enterprise | ✅ 完整支援 |
| Windows 10/11 Education | ✅ 完整支援 |

5. **備援方案**
   - Docker Toolbox (陳舊版，無需 WSL 2)
   - 在 Linux VM 中使用 Docker
   - Docker Desktop with WSL 2 後端 (建議 Home 版)

## 📞 聯絡資訊

- **GitHub**：https://github.com/DingJun1028/esggo_vps
- **VPS IP**：161.118.252.147
- **主要域名**：https://esggo.co