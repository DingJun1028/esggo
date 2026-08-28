# 部署檢查清單

## 前置條件
- [ ] `.env` 設定完成
- [ ] `VITE_FB_*` 環境變數填寫正確
- [ ] `VITE_ADMIN_PASS` 設定
- [ ] Firebase 專案已建立

## 部署流程
```bash
# 1. 本地建置驗證
pnpm run build

# 2. 測試驗證
pnpm run test

# 3. 部署
firebase deploy --only hosting,firestore:rules

# 4. 驗證
curl -sS https://esggo-learning-center.web.app | grep -c "Berkeley"
```

## 常見失敗原因
1. **環境變數缺失**：檢查 `.env` 是否包含所有必填項
2. **Firebase 權限**：確認 Firebase Token 有效
3. **Firestore 規則**：檢查 `firestore.rules` 語法
4. **建置錯誤**：`pnpm run build` 必須成功