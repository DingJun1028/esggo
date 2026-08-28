# ESGGO Learning Center 部署檢查清單

## 📋 部署前檢查

### 1. 環境變數
- [ ] `.env` 設定完成
- [ ] `VITE_FB_API_KEY` 設定
- [ ] `VITE_FB_AUTH_DOMAIN` 設定
- [ ] `VITE_FB_PROJECT_ID` 設定
- [ ] `VITE_FB_APP_ID` 設定
- [ ] `VITE_ADMIN_PASS` 設定

### 2. Firebase 檢查
- [ ] Firebase 登入：`firebase login`
- [ ] 專案選擇：`firebase use esggo-learning-center`
- [ ] Firestore 資料庫已建立

### 3. 本地建置驗證
```bash
cd /c/Users/dingj/esggo-learning-center
pnpm install
pnpm run build
pnpm run test
```

## 🚀 部署流程

### 1. 部署 Firebase
```bash
firebase deploy --only hosting,firestore:rules
```

### 2. 部署 Vercel (如使用)
```bash
vercel --prod --yes
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

## 🚨 常見失敗原因

### 1. 環境變數缺失
檢查 `.env` 是否包含所有 `VITE_FB_*` 項目

### 2. Firebase 權限
確認 Firebase Token 有效

### 3. Firestore 語法錯誤
```bash
firebase deploy --only firestore:rules
```

### 4. 建置錯誤
```bash
pnpm run build
```

### 5. Docker Desktop 虛機化問題 (Windows)
```powershell
# 檢查虛機化
Get-CimInstance Win32_Processor | Select VirtualizationFirmwareEnabled
```

## 📞 聯絡資訊

- **GitHub**：https://github.com/DingJun1028/esggo-learning-center
- **Firebase 專案**：esggo-learning-center
- **VPS IP**：161.118.252.147
- **域名**：https://esggo.co