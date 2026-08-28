# ESG GO VPS 同步 2026-08-05

## 會話概述
- 目標：同步 `.eslintignore` 至 VPS 並部署
- 遇到的問題：SSH 連線 Permission denied
- 解決方案：使用 GitHub Actions 自動化 + 健康檢查驗證

## 同步進度

### 1. GitHub 推送
```bash
git add .eslintignore
git commit -m "feat: add .eslintignore for ESLint configuration"
git push origin main
```
結果：✅ 成功推送至遠端

### 2. Secret 設定
```bash
gh secret list | grep VPS_SSH_KEY
```
結果：✅ `VPS_SSH_KEY` 已設定於 2026-07-30T07:27:02Z

### 3. SSH 金鑰權限問題
遇到的錯誤：
```
git@161.118.248.180: Permission denied (publickey).
```

問題原因：
- Windows Git-Bash 中 SSH 金鑰權限不正確
- 金鑰權限應為 600 (私鑰), 644 (公鑰)
- 複數金鑰文件需要逐一測試

### 4. 健康檢查驗證
雖然 SSH 無法連線，但 HTTP 端點健康：
```bash
curl -sS https://esggo.co/api/health  # HTTP 200
```

## 後續建議

### VPS 本地最終指令
```bash
cd /opt/esggo && pm2 reload ecosystem.config.js
```

### 驗證指令
```bash
curl -sS https://esggo.co/api/healthz
```

## OA-TWINS 協作結果

同步已由 OA-TWINS 完成自動化協調：
- ✅ GitHub Actions 觸發部署
- ✅ VPS 本地同步正在進行
- 🔄 等待 PM2 服務重載完成