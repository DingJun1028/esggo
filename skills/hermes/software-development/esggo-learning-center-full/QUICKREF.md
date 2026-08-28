# ESGGO Learning Center 快速參考

## 📋 目錄跳板

| 主題 | 內容 |
|------|------|
| [VPS 部署](#vps-部署) | Ubuntu + Nginx + SSL |
| [Firebase 學習中心](#firebase-學習中心) | React + Firebase + Firestore |
| [CI/CD 流水線](#cicd-流水線) | GitHub Actions 自動化 |
| [Docker 容器化](#docker-容器化) | 容器建置與部署 |
| [故障排除](#故障排除) | 常見問題解決方案 |

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
```

## ☁️ Firebase 學習中心

### 部署指令
```bash
# 部署 Firebase
firebase login
firebase use esggo-learning-center
firebase deploy --only hosting,firestore:rules
```

### 環境變數
```bash
VITE_FB_API_KEY=AIzaSy...
VITE_FB_AUTH_DOMAIN=esggo-learning-center.firebaseapp.com
VITE_FB_PROJECT_ID=esggo-learning-center
VITE_BOOKING_URL=https://calendly.com/esggo-consulting
VITE_ADMIN_PASS=your-password
```

## 🚀 CI/CD 流水線

### 必要 Secrets
| Secret | 用途 |
|--------|------|
| `VERCEL_TOKEN` | Vercel 部署 |
| `VERCEL_ORG_ID` | 組織 ID |
| `VERCEL_PROJECT_ID` | 專案 ID |
| `FIREBASE_TOKEN` | Firebase 部署 |
| `FIREBASE_SERVICE_ACCOUNT` | 服務帳號金鑰 |

## 🔧 開發指令

```bash
# 開發
pnpm run dev

# 測試
pnpm run test

# 建置
pnpm run build

# 部署 Firebase
pnpm run deploy:all
```

## 🛡️ Firestore 安全規則

```javascript
// Submissions
allow read: if isAdmin() || resource.data.userId == request.auth.uid;
allow create: if authenticated()
  && request.resource.data.userId == request.auth.uid
  && request.resource.size() <= 1 * 1024 * 1024;
```

## 📞 聯絡資訊

- **VPS**：161.118.252.147
- **域名**：https://esggo.co
- **Firebase**：esggo-learning-center