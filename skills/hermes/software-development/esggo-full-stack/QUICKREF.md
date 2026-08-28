# ESGGO 全域全端技能書 - 快速參考

## 📋 目錄跳板

| 主題 | 內容 |
|------|------|
| [VPS 部署](#vps-部署) | Ubuntu 22.04 + Nginx + SSL |
| [Firebase 學習中心](#firebase-學習中心) | React + Firebase + Firestore |
| [CI/CD 流水線](#cicd-流水線) | GitHub Actions 自動化 |
| [Docker 容器化](#docker-容器化) | 容器建置與部署 |
| [故障排除](#故障排除) | 常見問題解決方案 |

---

## 🖥️ VPS 部署

### 伺服器資訊
- **IP**：161.118.252.147
- **OS**：Ubuntu 22.04 LTS
- **Nginx**：`/` → SPA, `/api/` → 127.0.0.1:3000, `/ftg/` → /var/www/ftg-tours

### 常用指令
```bash
# 服務狀態
sudo systemctl status esggo-nginx
sudo systemctl status esggo-api

# 重啟服務
sudo systemctl restart esggo-nginx
sudo systemctl restart esggo-api

# SSL 續期
sudo certbot renew --dry-run

# 日誌查看
pm2 logs esggo-api
tail -f /var/log/nginx/esggo-access.log
```

---

## ☁️ Firebase 學習中心

### 部署指令
```bash
# 登入與設定
firebase login
firebase use esggo-learning-center

# 部署
firebase deploy --only hosting,firestore:rules

# 測試
pnpm run build
pnpm run test
```

### 環境變數
```bash
VITE_FB_API_KEY=AIzaSy...
VITE_FB_AUTH_DOMAIN=esggo-learning-center.firebaseapp.com
VITE_FB_PROJECT_ID=esggo-learning-center
VITE_BOOKING_URL=https://calendly.com/esggo-consulting
VITE_ADMIN_PASS=your-password
```

---

## 🚀 CI/CD 流水線

### 必要 Secrets
| Secret | 用途 |
|--------|------|
| `VERCEL_TOKEN` | Vercel 部署 |
| `VERCEL_ORG_ID` | 組織 ID |
| `VERCEL_PROJECT_ID` | 專案 ID |
| `FIREBASE_TOKEN` | Firebase 部署 |
| `FIREBASE_SERVICE_ACCOUNT` | 服務帳號金鑰 |

### 部署指令
```bash
# 完整部署
firebase deploy

# 僅部署 Hosting
firebase deploy --only hosting

# 僅部署規則
firebase deploy --only firestore:rules
```

---

## 🐳 Docker 容器化

```bash
# 建置
docker build -t esggo-learning-center .

# 推到 VPS
scp esggo.tar.gz ubuntu@161.118.252.147:/tmp/

# 在 VPS 上載入
ssh ubuntu@161.118.252.147 "docker load < /tmp/esggo.tar.gz"

# 重啟
ssh ubuntu@161.118.252.147 "docker-compose up -d"
```

---

## ⚙️ 常用腳本

### 部署腳本 (`deploy.sh`)
```bash
#!/bin/bash
set -e

# 更新系統
sudo apt update && sudo apt upgrade -y

# 安裝 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安裝 PM2
sudo npm install -g pm2

# 部署 React SPA
cd /var/www/esggo
npm ci --only=production
npm run build
cp -r dist/* /var/www/esggo-spa/

# 重啟服務
sudo systemctl restart esggo-nginx
sudo systemctl restart esggo-api
```

---

## 🔧 開發指令

```bash
# 開發
pnpm run dev

# 測試
pnpm run test

# 建置
pnpm run build

# Lint
pnpm run lint
pnpm run lint:fix

# 部署 Firebase
pnpm run deploy:all
```

---

## 🛡️ Firestore 規則

### 關鍵規則
```javascript
// Submissions
allow create: if authenticated()
  && request.resource.data.userId == request.auth.uid
  && request.resource.size() <= 1 * 1024 * 1024;

allow read: if isAdmin() || resource.data.userId == request.auth.uid;

// Profiles
allow read, write: if isAdmin() || request.auth.uid == userId;
```

---

## 📞 聯絡資訊

- **VPS**：161.118.252.147
- **域名**：https://esggo.co
- **Firebase**：esggo-learning-center