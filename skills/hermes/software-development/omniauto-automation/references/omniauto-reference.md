# OmniAuto 相關參考與配置指南

## 專案概況

- **倉庫名稱**：OmniAuto
- **GitHub 地址**：`https://github.com/DingJun1028/OmniAuto.git`
- **最後更新**：2026-07-27
- **目標**：萬能自動化工具包

## 工作進度

### 已完成項目

1. ✅ 倉庫重命名為 `OmniAuto`
2. ✅ 遠端地址同步：`https://github.com/DingJun1028/OmniAuto.git`
3. ✅ 內容已推送至遠端

### 待完成項目

1. ⏳ 設定 GitHub Actions CI/CD 工作流程
2. ⏳ 設定 Vercel 或其他部署目標的 Secrets
3. ⏳ 驗證自動化流程正確性

## GitHub Actions 工作流程配置

### 必要的 Secrets 設定

```bash
# 設定 Vercel Token（如果使用 Vercel 部署）
gh secret set VERCEL_TOKEN -b "your_token_here" --repo DingJun1028/OmniAuto

# 設定 Vercel Org ID
gh secret set VERCEL_ORG_ID -b "your_org_id_here" --repo DingJun1028/OmniAuto

# 設定 Vercel Project ID
gh secret set VERCEL_PROJECT_ID -b "your_project_id_here" --repo DingJun1028/OmniAuto
```

### 取得 Vercel 相關資訊的方法

1. **VERCEL_TOKEN**：
   - 登入 Vercel Dashboard
   - 點擊右上角的使用者頭像 → Settings → Tokens
   - 點擊 "Create new token"，複製 token 值

2. **VERCEL_ORG_ID** 和 **VERCEL_PROJECT_ID**：
   - 登入 Vercel Dashboard
   - 前往對應的專案
   - 設定頁面 URL 中會包含 org ID 和 project ID
   - 或使用 API：`curl https://api.vercel.com/v1/projects?teamId=<org_id>`

## 部署選項

### 選項 1：Vercel 部署（推薦前端專案）

適用情境：
- React、Vue、Next.js 等前端框架
- 需要快速部署的靜態/服務端渲染網站

步驟：
1. 在 Vercel 建立新專案
2. 連結 GitHub 倉庫
3. 設定 Secrets
4. 推送代碼觸發自動部署

### 選項 2：Docker 部署

適用情境：
- 後端服務
- 需要容器化管理
- 多環境部署（開發、測試、生產）

步驟：
1. 在 Dockerfile 中設定映像建置
2. 設定 DockerHub 認證 Secrets
3. 推送代碼觸發建置與部署

### 選項 3：Firebase 部署

適用情境：
- 靜態網站
- 需要 Firebase 身份驗證
- Firestore/Realtime Database 後端

步驟：
1. 安裝 Firebase CLI：`npm install -g firebase-tools`
2. 初始化 Firebase：`firebase init`
3. 設定 FIREBASE_TOKEN Secret
4. 推送代碼觸發部署

## 觀測與監控

### 健康檢查

使用 `scripts/healthcheck.sh` 進行本地健康檢查：
```bash
chmod +x scripts/healthcheck.sh
./scripts/healthcheck.sh
```

### GitHub Actions 觀測

- 訪問 GitHub Actions 頁面查看執行狀態
- 設定 Slack/Discord 通知獲得即時提醒

## 常見問題

### Q: 為什麼需要 Omniauto-automation 技能？

A: 當處理 OmniAuto 專案的自動化流程時，應載入此技能以獲得：
- 完整的 GitHub Actions 模板
- 健康檢查腳本
- 部署配置指南
- 故障排除方法

### Q: 如何驗證自動化流程？

A: 
1. 確保 `.github/workflows/omniauto-ci.yml` 已正確放入專案
2. 設定必要的 Secrets
3. 推送代碼到 `main` 分支觸發 CI/CD
4. 檢查 GitHub Actions 執行結果

### Q: 設定 Secrets 時遇到問題？

A: 
- 確認使用者有該倉庫的編輯權限
- 確認 token/金鑰有效
- 使用 `gh secret list` 查看已設定的 Secrets

## 下一步建議

1. 將 `references/omniauto-ci.yml` 複製到 OmniAuto 專案的 `.github/workflows/` 目錄
2. 設定必要的 GitHub Secrets
3. 推送代碼觸發首次 CI/CD 執行
4. 使用 `scripts/healthcheck.sh` 驗證本地環境