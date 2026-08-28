---
name: esggo-learning-center-full
title: ESGGO Learning Center 完整技能書
description: >
  2026 Berkeley ESG Strategy & Innovation Program 學習中心的完整技術文件，包含專案結構、核心功能模組、開發流程、部署指南與最佳實踐。
triggers:
  - 開發 ESGGO Learning Center 相關功能
  - 部署 Firebase / Vercel
  - 故障排除
  - 國際化 (i18n)
  - Firestore 規則設計
pinned: false
---

# ESGGO Learning Center 完整技能書

## 專案概述

ESGGO Learning Center 是一個以 Vite + React + Tailwind CSS 為技術棧的線上學習平台，為 2026 Berkeley ESG Strategy & Innovation Program 學員提供學習資源與支援。

### 核心功能
1. **學員資源區**：提供課程資源與官方連結
2. **作業上傳**：學員提交作業並附帶檔案
3. **課程回放**：影片觀看與管理
4. **諮詢預約**：線上諮詢預約系統
5. **提問提交**：向 Mentor 提交問題
6. **滿意度調查**：每週調查問卷

## 專案結構

```
esggo-learning-center/
├── src/
│   ├── App.jsx              # 主應用組件
│   ├── main.jsx             # 入口點
│   ├── index.css            # Tailwind 基礎樣式
│   ├── db.js                # Firebase/Firestore 資料層
│   ├── i18n/
│   │   └── translations.js  # 國際化字串 (zh-TW/zh-CN/en)
│   ├── repositories/        # 資料庫操作模組
│   │   ├── submission.repository.js
│   │   ├── profile.repository.js
│   │   ├── mentor.repository.js
│   │   ├── pairing.repository.js
│   │   ├── rag.repository.js
│   │   ├── auth.repository.js
│   │   ├── oracle.adapter.js
│   │   └── supabase.adapter.js
│   ├── data/                # 資料檔案
│   └── schemas/             # 資料結構定義
├── functions/               # Firebase Functions
├── .github/workflows/       # GitHub Actions
│   ├── ci.yml               # CI 流水線
│   └── deploy.yml           # 部署流程
├── firebase.json            # Firebase 配置
├── firestore.rules          # Firestore 安全規則
├── vite.config.js           # Vite 設定
└── package.json
```

## 技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| Vite | 6.x | 建置與開發伺服器 |
| React | 18.x | 前端框架 |
| Tailwind CSS | 3.x | 樣式框架 |
| Firebase | 10.x | 後端即服務 |
| Vitest | 4.x | 測試框架 |
| ESLint | 9.x | 程式碼檢查 |

## 核心功能模組

### 1. 資料層 (`src/db.js`)

#### Firebase 初始化
支援雲端 Firestore + localStorage fallback 兩種模式：
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
};
```

#### 認證機制
- **匿名登入**：預設模式，`signInAnonymously()`
- **Google OAuth**：`signInWithGoogle()` 升級至正式帳號
- **Admin 密碼備援**：`/admin` 視角使用密碼驗證

#### 關鍵函數
| 函數 | 功能 |
|------|------|
| `addSubmission()` | 建立提交紀錄 |
| `subscribeSubmissions()` | 即時訂閱 submissions |
| `deleteSubmission()` | 刪除提交 |
| `upsertProfile()` | 更新使用者檔案 |
| `getProfile()` | 取得使用者檔案 |
| `upsertTAProfile()` | 更新 TA 資料 |
| `getTAProfile()` | 取得 TA 資料 |
| `requestPairing()` | 建立 TA 配對請求 |
| `uploadFiles()` | 轉檔為 base64 嵌入 Firestore |

### 2. Firestore 資料結構

#### Submissions 集合
```javascript
{
  userId: string,           // Firebase UID
  type: string,             // 'upload' | 'booking' | 'question' | 'survey'
  data: {
    attachments: [],       // 上傳檔案陣列 (base64)
    // ... 其他欄位依類型不同
  },
  createdAt: timestamp
}
```

#### Profiles 集合
```javascript
{
  displayName: string,
  email: string,
  role: string,           // 'student' | 'admin' | 'ta'
  org: string,
  status: string,         // 'active' | 'inactive'
  updatedAt: timestamp
}
```

#### Firestore 安全規則 (`firestore.rules`)
```
平台 (platforms/{platformId})
├── submissions/{docId}
│   ├── 讀取：管理員或提交者本人
│   └── 建立：已驗證使用者，包含 userId 與 type，大小 < 1MB
├── profiles/{userId}
│   └── 讀寫：管理員或使用者本人
├── mentors/{mentorId}
│   └── 讀寫：管理員或 Mentor 本人
└── pairings/{pairingId}
    └── 讀寫：管理員或相關 TA/學員
```

### 3. 國際化 (`src/i18n/translations.js`)

支援三種語言：
- `zh-TW`：繁體中文（預設）
- `zh-CN`：簡體中文
- `en`：英文

關鍵字串結構：
```javascript
{
  heroTitleLine1: '2026 Berkeley',
  heroTitleLine2: '柏克萊國際永續策略人才培育課程學習中心',
  f1: '學員資源區',
  f2: '作業上傳',
  f3: '課程回放',
  f6: '滿意調查',
  records: '用戶資源庫',
  admin: '管理後台',
  myRecords: '我的紀錄',
  roleStudent: '🧑‍🎓 學員視角',
  roleAdmin: '🛡️ 管理員視角',
  back: '返回首頁',
  submit: '送出提交',
  success: '提交成功！',
  // ... 完整字串
}
```

## 開發流程

### 開始開發

```bash
# 複製環境變數
cp .env.example .env

# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm run dev
```

### 測試

```bash
# 執行測試
pnpm run test

# 執行 lint
pnpm run lint
pnpm run lint:fix
```

### 建置

```bash
# 建置生產版本
pnpm run build
```

## 部署流程

### 部署至 Firebase Hosting

```bash
# 部署所有 (建議)
firebase deploy --only hosting,firestore:rules

# 僅部署 Hosting
firebase deploy --only hosting
```

### 部署至 Vercel (CI/CD)

GitHub Actions 會自動在 `main` 分支推送時部署至 Vercel：

1. 需要在 GitHub Secrets 設定：
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

### CI/CD 工作流程

`.github/workflows/deploy.yml` 包含兩個部署目標：
1. `deploy-vercel`：部署至 Vercel
2. `deploy-firebase`：部署至 Firebase Hosting

兩者皆在 `build-and-test` 成功後執行。

## 環境變數 (`.env`)

| 變數名稱 | 說明 |
|----------|------|
| `VITE_FB_API_KEY` | Firebase API Key |
| `VITE_FB_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FB_PROJECT_ID` | Firebase 專案 ID |
| `VITE_FB_STORAGE_BUCKET` | Firebase Storage Bucket |
| `VITE_FB_MESSAGING_SENDER_ID` | FCM Sender ID |
| `VITE_FB_APP_ID` | Firebase App ID |
| `VITE_BOOKING_URL` | 諮詢預約 Calendly 連結 |
| `VITE_ADMIN_PASS` | 管理員密碼 |

## Firestore Spark 計畫限制

| 限制 | 數值 | 處理方式 |
|------|------|----------|
| 單文件大小 | 1MB | 附件總量建議不超過 700KB |
| 無 Cloud Storage | - | 轉檔為 base64 嵌入 Firestore |
| 匿名存取 | - | 支援 localStorage fallback |

## 常用指令

```bash
# 開發
pnpm run dev

# 建置
pnpm run build

# 預覽建置結果
pnpm run preview

# 測試
pnpm run test

# Lint
pnpm run lint
pnpm run lint:fix

# 部署 (Firebase)
pnpm run deploy:all
pnpm run deploy:hosting
pnpm run deploy:rules
```

## 故障排除

### 1. 部署失敗：Node.js 版本不匹配
```bash
# 確認 package.json 中的 engines 設定
# Firebase Functions 需要 Node.js 20

# 本地測試
firebase emulators:exec "cd functions && npm test"
```

### 2. Google OAuth 生產環境失敗
檢查 GCP Console 設定：
1. Firebase Console → Authentication → Sign-in method → **Google enabled**
2. GCP Console → APIs & Services → Credentials → **Authorized domains** 包含：
   - `esggo-learning-center.web.app`
   - `esggo-learning-center.firebaseapp.com`
   - `localhost:5173`

### 3. Firestore 語法錯誤
```bash
# 驗證規則語法
firebase deploy --only firestore:rules

# 若失敗，檢查 rules 檔案
cat firestore.rules
```

### 4. Vite 建置錯誤：環境變數
```bash
# 確認 .env 檔案完整
cat .env

# 確認 VITE 前綴
# 所有前端環境變數必須以 VITE_ 開頭
```

## 已知問題與注意事項

1. **檔案大小限制**：Firestore 單文件上限 1MB，附件總量建議不超過 700KB
2. **i18n 重複 key**：translations.js 中 zh-TW/zh-CN 的同名 key 是正常結構（不同父物件），`no-dupe-keys` 已關閉
3. **Firestore import**：`doc`/`setDoc`/`getDoc`/`query`/`where`/`getDocs`/`serverTimestamp`/`writeBatch` 在 local 降級模式用不到，但 Firebase 模式必須用到
4. **空 catch 允許**：`catch {}` 吞掉 `delete window[cbName]` 可能的錯誤是合理寫法
5. **Hero CTA 連結**：目前 hero 區域**不保留外部課程連結**；除非使用者明確要求，否則不要把官方課程按鈕加回來

## 相關資源

- GitHub: https://github.com/DingJun1028/esggo-learning-center
- Firebase 專案: `esggo-learning-center`
- 部署目標: Firebase Hosting + Vercel (雙重部署)
- 首頁 URL: https://esggo-learning-center.web.app

## 參考文件

- [AGENTS.md](./AGENTS.md) - 開發者指引
- [IDEA.md](./IDEA.md) - 原始設計稿
- [firebase.json](./firebase.json) - Firebase 配置
- [firestore.rules](./firestore.rules) - Firestore 安全規則