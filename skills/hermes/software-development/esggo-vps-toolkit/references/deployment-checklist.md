# ESGGO VPS Toolkit - 部署檢查清單

## 📋 部署前檢查

### 1. 伺服器連線
- [ ] VPS 連線正常：`ssh ubuntu@161.118.252.147`
- [ ] Docker 服務運作：`docker ps`
- [ ] Nginx 服務運作：`sudo systemctl status nginx`

### 2. Docker Desktop 虛機化檢查（Windows 開發者）
- [ ] 虛機化已啟用：`Get-CimInstance Win32_Processor | Select VirtualizationFirmwareEnabled`
- [ ] BIOS 設定：Intel VT-x / AMD-V 已啟用
- [ ] Windows 功能：Microsoft-Hyper-V-All 已啟用

### 3. SSL 證書
- [ ] certbot 證書有效：`sudo certbot certificates`
- [ ] 多域名證書：esggo.co、www.esggo.co、ftg.esggo.co

### 4. Cloudflare DNS
- [ ] DNS 記錄正確：A 記錄指向 VPS IP
- [ ] SSL 模式：Full (strict)
- [ ] Token 權限：Zone:DNS:Edit

## 🚀 部署流程

### 1. 建置
```bash
cd /c/Users/dingj/esggo-learning-center
pnpm install
pnpm run build
```

### 2. 部署 Firebase
```bash
firebase login
firebase use esggo-learning-center
firebase deploy --only hosting,firestore:rules
```

### 3. 部署至 VPS
```bash
# 建置 Docker 映像
docker build -t esggo-app .

# 推到 VPS
docker save esggo-app | gzip > esggo.tar.gz
scp esggo.tar.gz ubuntu@161.118.252.147:/tmp/

# 在 VPS 上載入
ssh ubuntu@161.118.252.147 "docker load < /tmp/esggo.tar.gz"
ssh ubuntu@161.118.252.147 "docker compose down && docker compose up -d"
```

## ✅ 驗證步驟

### Firebase 部署驗證
```bash
curl -sS https://esggo-learning-center.web.app | grep -c "Berkeley"
```

### VPS 部署驗證
```bash
# Next.js live
curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/api/health

# NGINX live
curl -sS -I -H "Host: esggo.co" http://127.0.0.1/

# HTTPS end-to-end
curl -sS -I https://esggo.co/
curl -sS -I https://ftg.esggo.co/
```

## 🚨 常見失敗原因

### 1. Docker 虛機化問題
```powershell
# 檢查虛機化
Get-CimInstance Win32_Processor | Select VirtualizationFirmwareEnabled
```

### 2. HTTPS 重定向迴圈
1. 移除 nginx 80→HTTPS 重定向
2. 確保 443 server block 不再強制 HTTPS
3. 清除 Cloudflare 快取

### 3. DNS 解析問題
確認 DNS 記錄已更新指向正確的 VPS IP

## 📞 聯絡資訊

- **GitHub**：https://github.com/DingJun1028/esggo_vps
- **VPS IP**：161.118.252.147
- **域名**：https://esggo.co