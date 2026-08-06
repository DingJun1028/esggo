# ESG GO - Oracle Always Free 部署指南

## 概述

本指南說明如何將 ESG GO 部署到 Oracle Cloud Always Free 方案。

### 資源配額
- **運算**：2 OCPUs ARM Ampere A1 / 12GB RAM（永久免費）
- **儲存**：200GB 區塊儲存
- **資料庫**：Oracle Autonomous DB（1 OCPU / 20GB）
- **流量**：10TB/月出站流量
- **負載平衡**：1x 10Mbps Flex LB

### 架構
```
用戶 → Nginx (HTTPS) → Next.js (App) → Redis (Cache)
                     → Oracle Autonomous DB (Data)
```

## 快速開始

### 1. 註冊 Oracle Cloud 帳戶
1. 前往 https://cloud.oracle.com/free
2. 點擊「Start for Free」
3. 填寫註冊資訊（需信用卡驗證）
4. 選擇主區域（建議：Tokyo 或 Osaka）

### 2. 建立 Always Free 實例
1. 登入 Oracle Cloud Console
2. 建立 VM.Standard.A1.Flex 實例
3. 設定 2 OCPUs / 12GB RAM
4. 選擇 Ubuntu 22.04 LTS
5. 設定安全性清單（Security List）：
   - 入站：22 (SSH), 80 (HTTP), 443 (HTTPS)
   - 出站：全部允許

### 3. 初始化伺服器
```bash
# SSH 登入伺服器
ssh ubuntu@<your-server-ip>

# 下載並執行初始化腳本
wget https://raw.githubusercontent.com/your-org/esggo/main/oracle-deploy/scripts/init-server.sh
bash init-server.sh
```

### 4. 部署 ESG GO
```bash
# 登入 deploy 使用者
su - deploy

# 克隆專案
git clone https://github.com/your-org/esggo.git /opt/esggo
cd /opt/esggo

# 建立環境變數
cp oracle-deploy/.env.production.example .env.production
nano .env.production  # 填入你的金鑰

# 執行部署
bash oracle-deploy/scripts/deploy.sh
```

### 5. 設定網域
1. 在網域 registrant 設定 DNS A 記錄指向伺服器 IP
2. 等待 DNS 生效（通常 5-30 分鐘）
3. 執行 `sudo certbot --nginx -d your-domain.com`

## 檔案結構

```
oracle-deploy/
├── README.md                    # 本文件
├── docker-compose.prod.yml      # 生產環境 Docker Compose
├── .env.production.example      # 環境變數範本
├── nginx/
│   └── conf.d/
│       └── default.conf         # Nginx 配置
└── scripts/
    ├── init-server.sh           # 伺服器初始化腳本
    ├── deploy.sh                # 部署腳本
    └── keepalive.sh             # 防閒置回收腳本
```

## 常用指令

### 查看服務狀態
```bash
docker compose -f docker-compose.prod.yml ps
```

### 查看日誌
```bash
# 全部日誌
docker compose -f docker-compose.prod.yml logs -f

# 特定服務
docker compose -f docker-compose.prod.yml logs -f nextjs
docker compose -f docker-compose.prod.yml logs -f nginx
```

### 重啟服務
```bash
docker compose -f docker-compose.prod.yml restart
```

### 進入容器
```bash
docker exec -it esggo-app sh
```

### 更新部署
```bash
cd /opt/esggo
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

## 監控

### 檢查資源使用
```bash
# CPU 和記憶體
docker stats

# 磁碟使用
df -h

# Docker 映像大小
docker images
```

### 檢查防閒置狀態
```bash
# 查看 keepalive 日誌
tail -f /var/log/esggo-keepalive.log

# 查看 cron jobs
crontab -l
```

## 故障排除

### 服務無法啟動
```bash
# 檢查 Docker 日誌
docker compose -f docker-compose.prod.yml logs

# 檢查端口佔用
netstat -tlnp | grep -E ':(80|443|3000)'

# 檢查防火牆
sudo ufw status
```

### TLS 憑證問題
```bash
# 手動續期
sudo certbot renew

# 檢查憑證有效期
sudo certbot certificates
```

### 記憶體不足
```bash
# 檢查記憶體使用
free -h

# 檢查 Docker 容器記憶體
docker stats --no-stream

# 調整 swap
sudo swapoff -a
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## 安全性建議

1. **定期更新系統**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **監控登入嘗試**
   ```bash
   sudo fail2ban-client status sshd
   ```

3. **備份資料**
   ```bash
   # 備份 Docker volumes
   docker run --rm -v esggo_redis_data:/data -v $(pwd):/backup alpine tar czf /backup/redis_backup.tar.gz /data
   ```

4. **設定監控**
   - 使用 Oracle Cloud Monitoring
   - 設定告警規則

## 成本估算

| 項目 | 費用 |
|------|------|
| VM (2 OCPUs / 12GB) | $0/月 |
| 區塊儲存 (20GB) | $0/月 |
| Oracle Autonomous DB | $0/月 |
| 出站流量 (10TB) | $0/月 |
| TLS 憑證 (Let's Encrypt) | $0 |
| **合計** | **$0/月** |

## 注意事項

1. **閒置回收**：Oracle 會回收 7 天內使用率低於 20% 的實例
   - 解決方案：使用 keepalive.sh 腳本保持活躍

2. **容量限制**：熱門區域可能無容量
   - 解決方案：選擇非熱門區域或重試

3. **配額變更**：Oracle 可能隨時調整配額
   - 解決方案：監控使用率，準備備份方案

4. **資料備份**：定期備份到 Oracle Object Storage
   - 使用 `oci os object bulk-upload` 指令

## 支援

如有問題，請參閱：
- Oracle Cloud 文件：https://docs.oracle.com/iaas/Content/home.htm
- ESG GO GitHub Issues：https://github.com/your-org/esggo/issues
