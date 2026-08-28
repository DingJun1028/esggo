---
name: esggo-full-stack
title: ESGGO 全域全端技能書
description: >
  ESGGO 2026 Berkeley International Sustainable Strategy Talent Cultivation Program 
  全域全端技能書，涵蓋 VPS 部署、Firebase 學習中心、CI/CD 流水線、Docker 編譯與完整項目建置。
triggers:
  - 部署 ESGGO 整體系統
  - 建立新環境
  - 故障排除全端問題
  - 項目建置與版本管理
  - Firebase 與 Vercel 雙重部署
  - Docker 容器化
  - GitHub Actions 工作流程
pinned: false
---

# ESGGO 全域全端技能書

## 📦 項目概述

ESGGO (Environmental, Social, Governance Global Operations) 是 2026 Berkeley International Sustainable Strategy Talent Cultivation Program 的完整技術生態系統。

### 組件架構

```
ESGGO 項目組
├── esggo-vps/                 # VPS 部署腳本與設定
│   ├── deploy.sh              # 一鍵部署腳本
│   ├── nginx/                 # Nginx 配置
│   ├── systemd/               # 服務管理
│   └── scripts/               # 日常運維腳本
├── esggo-learning-center/     # Firebase + React 學習平台
│   ├── src/                   # React 前端程式碼
│   ├── functions/             # Firebase Functions
│   ├── firebase.json          # Firebase 配置
│   └── firestore.rules        # 資料庫安全規則
└── esggo/ (monorepo)         # 主倉庫，包含共享類型與腳本
    ├── packages/              # 共享函式庫
    ├── apps/                  # 子應用程式
    └── scripts/               # 建置腳本
```

---

## 🖥️ VPS 部署 (esggo-vps)

### 伺服器規格
- **主機 IP**：161.118.252.147
- **作業系統**：Ubuntu 22.04 LTS
- **Web 伺服器**：Nginx
- **應用程式**：React SPA + API 代理

### Nginx 路由規劃
```
/        → React SPA (建置後的 dist/)
/api/    → 127.0.0.1:3000 (API 伺服器)
/ftg/    → /var/www/ftg-tours
```

### SSL 憑證
- **工具**：certbot
- **域名**：esggo.co / ftg.esggo.co
- **有效期**：至 2026-10-20

### 部署腳本 (`deploy.sh`)
```bash
#!/bin/bash
set -e

# 1. 更新系統
sudo apt update && sudo apt upgrade -y

# 2. 安裝 Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. 安裝 PM2
sudo npm install -g pm2

# 4. 部署 React SPA
cd /var/www/esggo
rm -rf dist/*
npm ci --only=production
npm run build
cp -r dist/* /var/www/esggo-spa/

# 5. 重啟服務
sudo systemctl restart esggo-nginx
sudo systemctl restart esggo-api
```

### 日常運維指令
```bash
# 查看服務狀態
sudo systemctl status esggo-nginx
sudo systemctl status esggo-api

# 重啟服務
sudo systemctl restart esggo-nginx
sudo systemctl restart esggo-api

# 查看日誌
pm2 logs esggo-api
tail -f /var/log/nginx/esggo-access.log

# SSL 續期
sudo certbot renew --dry-run
```

---

## ☁️ Firebase 部署 (esggo-learning-center)

### 專案設定
- **Firebase 專案 ID**：esggo-learning-center
- **部署目標**：Firebase Hosting + Firestore
- **分支策略**：`main` → production, `learning-center` → staging

### 環境變數 (`.env`)
```bash
VITE_FB_API_KEY=AIzaSy...
VITE_FB_AUTH_DOMAIN=esggo-learning-center.firebaseapp.com
VITE_FB_PROJECT_ID=esggo-learning-center
VITE_FB_STORAGE_BUCKET=esggo-learning-center.appspot.com
VITE_FB_MESSAGING_SENDER_ID=1234567890
VITE_FB_APP_ID=1:1234567890:web:abcdef123456
VITE_BOOKING_URL=https://calendly.com/esggo-consulting
VITE_ADMIN_PASS=your-admin-password
```

### 部署指令
```bash
# 部署 Firebase
firebase login
firebase use esggo-learning-center
firebase deploy --only hosting,firestore:rules

# 部署 Vercel (備援)
vercel --prod --yes
```

---

## 🚀 CI/CD 流水線

### GitHub Actions 工作流程

#### 1. CI 工作流程 (`.github/workflows/ci.yml`)
```yaml
name: esggo-ci

on:
  push:
    branches: [main, learning-center-init]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install
      - run: pnpm run build
      - run: pnpm run test
```

#### 2. 部署工作流程 (`.github/workflows/deploy.yml`)
```yaml
name: esggo-deploy

on:
  push:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install
      - run: pnpm run build
      - run: pnpm run test

  deploy-vercel:
    needs: build-and-test
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: npm install -g pnpm@9
      - run: pnpm install
      - run: pnpm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-firebase:
    needs: build-and-test
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: npm install -g pnpm@9
      - run: npm install -g firebase-tools@latest
      - run: pnpm install
      - run: pnpm run build
      - name: Setup Firebase credentials
        run: |
          echo "${{ secrets.FIREBASE_SERVICE_ACCOUNT }}" > serviceAccountKey.json
      - uses: FirebaseExtended/action-firebase-deploy@v19
        with:
          firebaseToken: ${{ secrets.FIREBASE_TOKEN }}
          project-id: esggo-learning-center
          channelId: live
```

### 必要的 GitHub Secrets
| Secret 名稱 | 用途 |
|-------------|------|
| `VERCEL_TOKEN` | Vercel 部署驗證 |
| `VERCEL_ORG_ID` | Vercel 組織 ID |
| `VERCEL_PROJECT_ID` | Vercel 專案 ID |
| `FIREBASE_TOKEN` | Firebase 部署授權 |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase Admin SDK 服務帳號金鑰 JSON |

---

## 🐳 Docker 容器化

### Dockerfile (esggo-learning-center)
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  esggo-frontend:
    build: .
    ports:
      - "80:80"
    volumes:
      - ./dist:/usr/share/nginx/html
    restart: unless-stopped

  esggo-api:
    image: node:20-alpine
    working_dir: /app
    command: npm start
    volumes:
      - ./api:/app
    ports:
      - "3000:3000"
    restart: unless-stopped
```

### Docker 指令
```bash
# 建置映像
docker build -t esggo-learning-center .

# 推到 VPS
docker save esggo-learning-center | gzip > esggo.tar.gz
scp esggo.tar.gz.gz ubuntu@161.118.252.147:/tmp/

# 在 VPS 上載入
ssh ubuntu@161.118.252.147 "docker load < /tmp/esggo.tar.gz"

# 重啟容器
ssh ubuntu@161.118.252.147 "docker-compose down && docker-compose up -d"
```

---

## 🔧 開發工具與指令

### 常用開發指令
```bash
# 開發模式
pnpm run dev

# 編寫測試
pnpm run test

# 建置
pnpm run build

# Lint 修復
pnpm run lint:fix

# 部署
pnpm run deploy:all        # 完整部署
pnpm run deploy:hosting    # 僅部署 Hosting
pnpm run deploy:rules      # 僅部署 Firestore 規則
```

### Firebase 指令
```bash
# 登入
firebase login

# 使用指定專案
firebase use esggo-learning-center

# 預覽模擬器
firebase emulators:start

# 部署
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only functions
```

---

## 🛡️ Firestore 安全規則

### 規則概覽
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function authenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return authenticated() && request.auth.token.role == 'admin';
    }

    match /platforms/{platformId} {
      allow read: if authenticated();
      allow write: if isAdmin();

      match /submissions/{docId} {
        allow read: if isAdmin() || resource.data.userId == request.auth.uid;
        allow create: if authenticated()
          && request.resource.data.keys().hasAll(['userId', 'type'])
          && request.resource.data.userId == request.auth.uid
          && request.resource.size() <= 1 * 1024 * 1024;
        allow update, delete: if isAdmin()
          || (authenticated() && resource.data.userId == request.auth.uid);
      }

      match /profiles/{userId} {
        allow read: if authenticated();
        allow write: if isAdmin() || request.auth.uid == userId;
      }

      match /mentors/{mentorId} {
        allow read: if authenticated();
        allow write: if isAdmin() || request.auth.uid == mentorId;
      }

      match /pairings/{pairingId} {
        allow read: if authenticated();
        allow write: if isAdmin()
          || (authenticated() && (
            resource.data.mentorUid == request.auth.uid
            || request.resource.data.mentorUid == request.auth.uid
            || resource.data.menteeUid == request.auth.uid
            || request.resource.data.menteeUid == request.auth.uid
          ));
      }
    }
  }
}
```

---

## ⚙️ Cloudflare 設定

### DNS 設定
- **域名**：esggo.co
- **SSL 模式**：Full (strict)
- **API 規則**：
  - 錯誤 9109：需透過 SSH 從 VPS 端執行 API
  - API 驗證：`Authorization: Bearer <user-token>` 或 `<account-token>`

---

## 🔄 版本同步 (esggo ↔ esggo-learning-center)

### 共享類型 (`scripts/export-shared-types.js`)
```javascript
// 從 esggo monorepo 匯出共享類型到 esggo-learning-center
const fs = require('fs');
const path = require('path');

const sourceTypes = './packages/shared/src/types';
const targetDir = './esggo-learning-center/src/types';

// 複製類型檔案
fs.cpSync(sourceTypes, targetDir, { recursive: true });
```

### 同步檢查 (`scripts/check-types-sync.js`)
```javascript
// 檢查兩個倉庫的類型是否同步
const sourceHash = fs.readFileSync('./esggo/packages/shared/src/types/package.json', 'utf8');
const targetHash = fs.readFileSync('./esggo-learning-center/src/types/package.json', 'utf8');

if (sourceHash === targetHash) {
  console.log('TYPES_IN_SYNC');
} else {
  console.log('TYPES_OUT_OF_SYNC');
  process.exit(1);
}
```

---

## 📋 故障排除指南

### 1. 部署失敗：Node.js 版本不匹配
```bash
# 檢查 Node.js 版本
node --version  # 需為 20.x

# Firebase Functions 設定
# functions/package.json
{
  "engines": {
    "node": "20"
  }
}
```

### 2. Google OAuth 生產環境失敗
檢查 GCP Console 設定：
1. Firebase Console → Authentication → Sign-in method → **Google enabled**
2. GCP Console → APIs & Services → Credentials → **Authorized domains** 包含：
   - `esggo-learning-center.web.app`
   - `esggo-learning-center.firebaseapp.com`
   - `localhost:5173`

### 3. 服務無法啟動
```bash
# 檢查 PM2 進程
pm2 list
pm2 logs esggo-api

# 檢查 Nginx 配置
sudo nginx -t
sudo systemctl status nginx

# 檢查端口佔用
sudo lsof -i :3000
sudo lsof -i :80
```

### 4. SSL 證書問題
```bash
# 檢查證書狀態
sudo certbot certificates

# 續期
sudo certbot renew

# 手動重新取得
sudo certbot --nginx -d esggo.co -d www.esggo.co
```

---

## 📧 聯絡資訊

- **GitHub**：https://github.com/DingJun1028/esggo_vps
- **Firebase 專案**：esggo-learning-center
- **VPS IP**：161.118.252.147
- **主要域名**：https://esggo.co

---

## 🛡️ Dependabot 弱點處理（實戰驗證流程）

**入口**：`gh api "repos/DingJun1028/esggo/dependabot/alerts?state=open&per_page=100" --paginate`

`--paginate` 會把多頁 JSON array 串接成 `][`，需先 `raw.replace("][", ",")` 才能 parse。
（`-q length` 會逐頁計數而失真，別直接用。）

### 決策準則（照順序，勿跳）

1. **先看 manifest 分佈** —— 弱點常集中在不該入庫的副本目錄。
   實例：49 個 alert 中 24 個來自 `esggo-omni-center/`（learning-center 副本）。
2. **`pnpm why <pkg>` 查來源** —— transitive 弱點往往無法直接修，要看誰拉進來的。
3. **`pnpm audit --prod`** 區分 runtime / dev-only。**用 pnpm 不用 npm**
   （npm 讀不懂 pnpm 隔離結構會誤報）。
4. **查上游宣告範圍** —— `npm view <parent>@<ver> dependencies.<child>`。
   若修補版落在範圍內，強升是安全的；落在範圍外則屬破壞性。

### ⚠️ overrides 必須加 `<major` 上界（本次踩到）

`pnpm-workspace.yaml` 的 `overrides` 用裸 `">=x.y.z"` 會讓 pnpm 解析到**最新 major**：

| 套件 | 意圖 | 裸 `>=` 實際結果 |
|---|---|---|
| body-parser | 1.20.6 | **2.3.0** ← 跨 major |
| protobufjs | 7.6.5 | **8.7.1** ← 跨 major |
| fast-uri | 3.1.5 | **4.1.2** ← 跨 major |

正確寫法：`">=1.20.6 <2"`。改完務必 `grep -oE "^  <pkg>@[0-9.]+" pnpm-lock.yaml` 核實版本。

### undici 的例外（AGENTS.md 第 5 條要正確理解）

`apps/learning-center/AGENTS.md` 說「勿用 overrides 強升 undici，會破壞 jsdom 測試環境」——
禁的是**跨 major**。實查 `jsdom@29.1.1` 宣告 `undici: ^7.25.0`，
故 `7.28.0 → 7.29.0`（同 major patch）**在範圍內、安全**，實測 484/484 測試全過。
別把規則讀成「undici 一律不能動」而放著 high 弱點不修。

### 可接受的例外要寫進設定檔

sharp `<0.35.0` (GHSA-f88m-g3jw-g9cj, high) 保留不修，理由記在 `pnpm-workspace.yaml` 註解：
next 在 devDependencies、專案 0 處用 `next/image`、next@16 只接受 `^0.34.5`。
依 AGENTS.md 第 7 條不為綠燈破壞依賴鏈。**理由要留在程式碼裡，不是只寫在 commit message。**

### 驗證組合（缺一不可）
```bash
pnpm audit --prod     # 目標 "No known vulnerabilities found"
pnpm test             # jsdom 被破壞會在這裡爆
pnpm typecheck && pnpm lint && pnpm build
```
升級前先 `cp pnpm-lock.yaml pnpm-lock.yaml.bak`。

**成果**：根 workspace 11 個 alert → `pnpm audit --prod` 0 弱點，測試 484/484 無回歸。

---

## 📚 相關文件

- [AGENTS.md](./AGENTS.md) - 開發者指引
- [IDEA.md](./IDEA.md) - 設計稿
- [firebase.json](./firebase.json) - Firebase 配置
- [firestore.rules](./firestore.rules) - Firestore 安全規則
- [.github/workflows/deploy.yml](./.github/workflows/deploy.yml) - 部署流程