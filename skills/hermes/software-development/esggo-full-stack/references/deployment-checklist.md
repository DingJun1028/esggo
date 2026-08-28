# ESGGO 全域全端部署檢查清單

## 📦 部署前檢查

### VPS 檢查
- [ ] VPS 連線正常：`ssh ubuntu@161.118.252.147`
- [ ] Docker 服務運作：`docker ps`
- [ ] Nginx 服務運作：`sudo systemctl status nginx`
- [ ] SSL 證書有效：`sudo certbot certificates`

### Firebase 檢查
- [ ] Firebase 登入：`firebase login`
- [ ] 專案選擇：`firebase use esggo-learning-center`
- [ ] 環境變數：`.env` 包含所有 `VITE_FB_*` 項目

### GitHub Secrets
- [ ] `VERCEL_TOKEN` 設定
- [ ] `VERCEL_ORG_ID` 設定
- [ ] `VERCEL_PROJECT_ID` 設定
- [ ] `FIREBASE_TOKEN` 設定
- [ ] `FIREBASE_SERVICE_ACCOUNT` 設定
- [ ] `VPS_SSH_KEY` 設定

## 🚀 部署流程

### 1. 本地建置
```bash
cd /c/Users/dingj/esggo-learning-center
pnpm install
pnpm run build
pnpm run test
```

### 2. 部署 Firebase
```bash
firebase deploy --only hosting,firestore:rules
```

### 3. 部署 Vercel (如使用)
```bash
vercel --prod --yes
```

### 4. VPS 部署 (如需要)
```bash
# 建置 Docker 映像
docker build -t esggo-learning-center .

# 推到 VPS
scp -i ~/.ssh/id_rsa_esggo_real esggo.tar.gz ubuntu@161.118.252.147:/tmp/

# 在 VPS 上載入
ssh ubuntu@161.118.252.147 "docker load < /tmp/esggo.tar.gz"

# 重啟容器
ssh ubuntu@161.118.252.147 "docker-compose down && docker-compose up -d"
```

## ✅ 驗證步驟

### Firebase 部署驗證
```bash
curl -sS https://esggo-learning-center.web.app | grep -c "Berkeley"
```

### Vercel 部署驗證
```bash
curl -sS -o /dev/null -w "%{http_code}" https://<your-domain>/
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

### 1. Node.js 版本不匹配
```bash
node --version  # 需為 20.x
```

### 2. Google OAuth 生產環境失敗
檢查 GCP Console：
1. Firebase Console → Authentication → Sign-in method → **Google enabled**
2. GCP Console → APIs & Services → Credentials → **Authorized domains** 包含正確域名

### 3. Firestore 語法錯誤
```bash
firebase deploy --only firestore:rules
```

### 4. SSL 證書問題
```bash
sudo certbot certificates
sudo certbot renew
```

### 5. HTTPS 重定向迴圈
1. 移除 nginx 80→HTTPS 重定向
2. 確保 443 server block 不再強制 HTTPS
3. 清除 Cloudflare 快取

## 📞 聯絡資訊

- **GitHub**：https://github.com/DingJun1028/esggo_vps
- **VPS IP**：161.118.252.147
- **域名**：https://esggo.co
- **Firebase 專案**：esggo-learning-center