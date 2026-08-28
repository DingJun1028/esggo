# Firebase 設定指南

## 必要環境變數

### 核心設定
```bash
VITE_FB_API_KEY=AIzaSyDxxxxxxx
VITE_FB_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FB_PROJECT_ID=your-project
VITE_FB_STORAGE_BUCKET=your-project.appspot.com
VITE_FB_MESSAGING_SENDER_ID=1234567890
VITE_FB_APP_ID=1:1234567890:web:abcdef123456
VITE_FB_APP_ID_SLUG=esggo-learning-center
```

### 授權設定
```bash
VITE_BOOKING_URL=https://calendly.com/your-link
VITE_ADMIN_PASS=your-admin-password
```

## Google OAuth 設定步驟

1. Firebase Console → Authentication → Sign-in method → 啟用 Google
2. GCP Console → APIs & Services → Credentials → Authorized domains:
   - `localhost:5173` (開發)
   - `esggo-learning-center.web.app` (生產)
   - `esggo-learning-center.firebaseapp.com` (備用)

## Firestore 資料結構

### 平台命名空間
```
platforms/{platformId}/
  submissions/{docId}
  profiles/{userId}
  mentors/{mentorId}
  pairings/{pairingId}
```

### 提交類型 (type)
- `upload`：作業上傳
- `booking`：諮詢預約
- `question`：提問提交
- `survey`：滿意度調查

## 安全規則關鍵點

### Submissions 規則
```javascript
allow read: if isAdmin() || resource.data.userId == request.auth.uid;
allow create: if authenticated() && request.resource.data.userId == request.auth.uid;
allow update, delete: if isAdmin() || (authenticated() && resource.data.userId == request.auth.uid);
```

### 限制條件
- 單文件大小：1MB 以下
- 附件總量：建議不超過 700KB
- 必填欄位：`userId`, `type`