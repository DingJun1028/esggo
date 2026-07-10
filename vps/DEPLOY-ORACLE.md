# ESG GO — Oracle Cloud VPS 部署指南

> ⚠️ 本文件為 **Docker Compose 藍圖**（esggo.ai / Redis 容器），與 VPS 實際運行狀態不符。
> 實際生產狀態請見 **[DEPLOY-REALITY.md](./DEPLOY-REALITY.md)**（nginx + PM2、esggo.co、Cloudflare DNS）。

## 概覽

本文件說明如何將 ESG GO 平台部署到 Oracle Cloud Always Free ARM Ampere A1 VPS。

### Oracle Always Free 資源

| 資源         | 限制                       | 分配                          |
| ------------ | -------------------------- | ----------------------------- |
| **Compute**  | 4 OCPU / 24 GB RAM (ARM)   | esggo-core: 3 CPU / 8 GB      |
|              |                            | gateway: 0.5 CPU / 1 GB       |
|              |                            | keepalive: 0.3 CPU / 64 MB    |
|              |                            | **合計: 3.8 / 4 OCPU, 9.1 / 24 GB** |
| **Storage**  | 200 GB Boot Volume         | Docker images + app data      |
| **Network**  | 10 TB/month outbound       | Web traffic                   |
| **Database** | 2× Autonomous DB (20 GB)   | 可選：ESG 資料儲存            |
| **SSL**      | Let's Encrypt (免費)       | 自動續約                      |

### 與其他免費層比較

| 平台           | CPU     | RAM    | Storage  | Network     | 評分 |
| -------------- | ------- | ------ | -------- | ----------- | ---- |
| **Oracle**     | 4 ARM   | 24 GB  | 200 GB   | 10 TB       | ⭐⭐⭐⭐⭐ |
| GCP            | 1 x86   | 1 GB   | 30 GB    | 1 GB        | ⭐⭐   |
| AWS            | 1 x86   | 1 GB   | 30 GB    | 100 GB      | ⭐⭐   |
| Azure          | 1 x86   | 1 GB   | 64 GB    | 15 GB       | ⭐⭐⭐ |

---

## 快速開始

### 前置需求

1. Oracle Cloud 帳戶（免費注册）
2. 一個網域名稱（可用子域名）
3. GitHub 帳戶（用於 CI/CD）

### Step 1: 建立 Oracle VPS

1. 登入 [Oracle Cloud Console](https://cloud.oracle.com)
2. 建立 Compute Instance:
   - **Image**: Ubuntu 22.04/24.04 (或 Oracle Linux 8)
   - **Shape**: VM.Standard.A1.Flex (ARM)
   - **OCPUs**: 4
   - **Memory**: 24 GB
   - **Storage**: 200 GB
3. 配置 Security List:
   - Allow SSH (port 22) from your IP
   - Allow HTTP (port 80) from anywhere
   - Allow HTTPS (port 443) from anywhere

### Step 2: 一鍵安裝

```bash
# SSH 進入 VPS
ssh ubuntu@YOUR_VPS_IP

# 下載並執行安裝腳本
curl -fsSL https://raw.githubusercontent.com/DingJun1028/esggo/main/vps/setup-oracle-vps.sh | sudo bash

# 或手動執行
git clone https://github.com/DingJun1028/esggo.git /tmp/esggo
cd /tmp/esggo/vps
chmod +x setup-oracle-vps.sh
sudo ./setup-oracle-vps.sh --domain esggo.ai --email admin@esggo.ai
```

### Step 3: 設定環境變數

```bash
cd /opt/esggo/vps
cp .env.production .env
vi .env  # 填入你的 API Keys
```

### Step 4: 啟動服務

```bash
cd /opt/esggo/vps
docker compose -f docker-compose.prod.yml up -d
```

### Step 5: 驗證

```bash
# 檢查服務狀態
docker compose -f docker-compose.prod.yml ps

# 檢查健康狀態
curl -s http://localhost/api/health | jq

# 檢查日誌
docker compose -f docker-compose.prod.yml logs -f esggo
```

---

## 架構

```
                    ┌─────────────────────────────────────────┐
                    │           Oracle Cloud VPS              │
                    │         (ARM Ampere A1 4C/24G)          │
                    │                                         │
Internet ──► 80/443 │  ┌─────────────────────────────────┐   │
                    │  │         Nginx (Alpine)           │   │
                    │  │   • SSL termination              │   │
                    │  │   • Reverse proxy                │   │
                    │  │   • Gzip compression             │   │
                    │  └──────────┬──────────────────────┘   │
                    │             │                           │
                    │  ┌──────────▼──────────────────────┐   │
                    │  │     ESG GO (Next.js)            │   │
                    │  │     Port 3000                   │   │
                    │  │     Memory: 8 GB                │   │
                    │  └──────────┬──────────────────────┘   │
                    │             │                           │
                    │  ┌──────────▼──────────────────────┐   │
                    │  │     Gateway (Express)           │   │
                    │  │     Port 8642                   │   │
                    │  │     Memory: 1 GB                │   │
                    │  └──────────┬──────────────────────┘   │
                    │             │                           │
                    │  ┌──────────▼──────────────────────┐   │
                    │  │     Redis 7 (Alpine)            │   │
                    │  │     Port 6379 (internal)        │   │
                    │  │     Memory: 768 MB              │   │
                    │  └────────────────────────────────┘   │
                    │                                         │
                    │  ┌────────────────────────────────┐   │
                    │  │     Keepalive Service          │   │
                    │  │     (防止閒置回收)              │   │
                    │  │     Memory: 64 MB              │   │
                    │  └────────────────────────────────┘   │
                    └─────────────────────────────────────────┘
```

---

## Docker 映像構建

### ARM64 原生構建

```bash
# 本地構建（需要在 ARM VPS 上執行）
docker compose -f docker-compose.prod.yml build

# 或強制重新構建
docker compose -f docker-compose.prod.yml build --no-cache
```

### GitHub Actions 自動構建

推送到 `main` 分支時，GitHub Actions 會自動:
1. 執行 TypeScript 檢查和測試
2. 構建 ARM64 Docker 映像
3. 推送到 Docker Hub
4. 部署到 Oracle VPS

---

## 常用指令

### 服務管理

```bash
# 查看服務狀態
docker compose -f docker-compose.prod.yml ps

# 啟動所有服務
docker compose -f docker-compose.prod.yml up -d

# 停止所有服務
docker compose -f docker-compose.prod.yml down

# 重啟特定服務
docker compose -f docker-compose.prod.yml restart esggo

# 查看日誌
docker compose -f docker-compose.prod.yml logs -f esggo
docker compose -f docker-compose.prod.yml logs -f nginx

# 進入容器
docker exec -it esggo-core sh
docker exec -it omniagent-gateway sh
```

### 更新部署

```bash
# 方法 1: Git pull + Docker rebuild
cd /opt/esggo
git pull origin main
cd vps
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d

# 方法 2: 使用自動更新腳本
sudo /opt/scripts/esggo-autoupdate.sh
```

### 備份與還原

```bash
# 執行備份
bash /opt/esggo/vps/backup.sh

# 列出備份
bash /opt/esggo/vps/backup.sh --list

# 還原備份
bash /opt/esggo/vps/backup.sh restore 20250101_030000
```

### 健康監控

```bash
# 手動健康檢查
bash /opt/esggo/vps/health-monitor.sh

# 查看監控日誌
tail -f /var/log/health-monitor.log
```

---

## SSL 憑證

### 初始設定

```bash
# 方法 1: 使用 certbot 容器
docker compose -f docker-compose.prod.yml --profile certbot run --rm certbot certonly \
  --webroot \
  -w /var/www/certbot \
  -d esggo.ai \
  --email admin@esggo.ai \
  --agree-tos

# 方法 2: 手動安裝
sudo apt install certbot
sudo certbot certonly --webroot -w /var/www/certbot -d esggo.ai
```

### 自動續約

Certbot 容器會自動每 12 小時檢查並續約憑證。

手動續約:
```bash
docker compose -f docker-compose.prod.yml --profile certbot run --rm certbot renew
```

---

## Oracle 閒置回收防護

Oracle Cloud 會在 VM 閒置 7 天後回收。本部署包含保活機制:

### 自動保活

`oracle-keepalive` 容器會每 5 分鐘消耗 CPU 約 60 秒:
- 使用 `/dev/urandom` 產生 10MB 資料
- 維持 CPU 使用率 > 20%

### Cron 保活

```bash
# 查看 cron jobs
crontab -l

# 手動觸發保活
/opt/scripts/oracle-keepalive.sh
```

### 監控

```bash
# 檢查 CPU 使用率
top -bn1 | head -5

# 檢查保活日誌
tail -f /var/log/oracle-keepalive.log
```

---

## 故障排除

### 服務無法啟動

```bash
# 檢查日誌
docker compose -f docker-compose.prod.yml logs esggo
docker compose -f docker-compose.prod.yml logs nginx

# 檢查記憶體
free -h

# 檢查磁碟
df -h

# 檢查連接埠
ss -tlnp | grep -E ':(80|443|3000|8642|6379)'
```

### Nginx 502 Bad Gateway

```bash
# 確認 esggo 容器健康
docker compose -f docker-compose.prod.yml ps esggo

# 檢查 Nginx 連接設定
docker exec esggo-nginx nginx -t

# 重啟 Nginx
docker compose -f docker-compose.prod.yml restart nginx
```

### Redis 連線失敗

```bash
# 測試 Redis 連線
docker exec esggo-redis redis-cli ping

# 檢查 Redis 日誌
docker compose -f docker-compose.prod.yml logs redis
```

### Docker 映像構建失敗

```bash
# 清理 Docker 快取
docker system prune -a

# 重新構建
docker compose -f docker-compose.prod.yml build --no-cache
```

---

## GitHub Actions 設定

在 GitHub Repo Settings → Secrets 中設定:

| Secret               | 說明                              |
| -------------------- | --------------------------------- |
| `ORACLE_VPS_HOST`    | VPS 公網 IP                      |
| `ORACLE_VPS_USER`    | SSH 使用者名稱 (ubuntu/root)      |
| `ORACLE_VPS_SSH_KEY` | SSH 私鑰 (完整的 OPENSSH 格式)    |
| `DOCKERHUB_USERNAME` | Docker Hub 使用者名稱              |
| `DOCKERHUB_TOKEN`    | Docker Hub Access Token           |

---

## 安全性

### 已實施的安全措施

- ✅ UFW 防火牆 (僅開放 22, 80, 443)
- ✅ Fail2Ban 防暴力破解
- ✅ Nginx 安全標頭 (X-Frame-Options, CSP, etc.)
- ✅ SSL/TLS 1.2/1.3
- ✅ Redis 僅監聽 127.0.0.1
- ✅ Docker 容器網路隔離
- ✅ 非 root 使用者運行 Next.js

### 安全檢查清單

- [ ] 定期更新系統套件
- [ ] 監控異常登入
- [ ] 檢查 Docker 映像漏洞
- [ ] 備份 SSL 憑證
- [ ] 設定 Budget Alert (防意外費用)

---

## 費用說明

**Always Free 層級不收取任何費用**，但需注意:

1. **Idle Reclamation**: 7 天閒置可能被回收（已實施保活）
2. **Volume**: 200 GB Boot Volume 免費
3. **Network**: 10 TB/month outbound 免費
4. **Database**: 2× 20 GB Autonomous DB 免費

**建議**: 設定 Budget Alert 以接收任何意外費用通知。

---

## 參考連結

- [Oracle Cloud Always Free](https://www.oracle.com/cloud/free/)
- [Oracle Cloud Always Free 免費層限制](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier.htm)
- [Oracle VM 閒置回收政策](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-always_free.htm)
- [Docker Compose 文件](https://docs.docker.com/compose/)
- [Next.js 部署](https://nextjs.org/docs/deployment)
