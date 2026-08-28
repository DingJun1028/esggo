---
name: omniauto-automation
description: "設定與管理 OmniAuto 專案的自動化流程，包含 CI/CD、部署、觀測等。針對獨立的 AI 自動化工具包進行最佳化。"
version: 1.0.0
author: Hermes Agent (DingJun1028)
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [omniauto, automation, ci-cd, deployment, github-actions]
---

# OmniAuto 自動化流程

設定與管理 OmniAuto 專案的自動化流程。

## 什麼是 OmniAuto

OmniAuto 是一個萬能自動化工具包，位於 `DingJun1028/OmniAuto` 倉庫。它是一個獨立的 AI 自動化專案。

## 何時使用

- 設定新的 CI/CD 工作流程
- 配置 GitHub Actions
- 設定自動部署流程
- 設置觀測與監控
- 優化自動化流程

## 自動化流程設定

### 1. GitHub Actions 基礎架構

```yaml
# .github/workflows/ci.yml
name: OmniAuto CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
```

### 2. 部署流程

根據專案性質選擇部署目標：

**Vercel 部署**（適合前端專案）：
```yaml
  deploy-vercel:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**Docker 部署**（適合後端/容器化專案）：
```yaml
  deploy-docker:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/omniauto:latest
```

## 常用腳本

### 健康檢查腳本

```bash
#!/bin/bash
# scripts/healthcheck.sh
echo "[omniauto-health] Starting health check..."

# 檢查依賴
npm ci --quiet

# 運行測試
npm test
if [ $? -ne 0 ]; then
  echo "[omniauto-health] FAIL - Tests failed"
  exit 1
fi

# 建置檢查
npm run build
if [ $? -ne 0 ]; then
  echo "[omniauto-health] FAIL - Build failed"
  exit 1
fi

echo "[omniauto-health] OK"
```

## 關鍵配置

### 必需的 Secrets

| Secret 名稱 | 用途 | 取得方式 |
|------------|------|---------|
| `VERCEL_TOKEN` | Vercel 部署 | Vercel 帳號 → Settings → Tokens |
| `VERCEL_ORG_ID` | 組織 ID | Vercel Dashboard |
| `VERCEL_PROJECT_ID` | 項目 ID | Vercel Project Settings |
| `DOCKERHUB_USERNAME` | DockerHub 用戶名 | DockerHub 帳號 |
| `DOCKERHUB_TOKEN` | DockerHub 權杖 | DockerHub → Security → New Access Token |

### 環境變數

在 `.env` 檔案中設定：
```bash
# 基礎配置
NODE_ENV=production
PORT=3000

# API 金鑰（如果需要）
# API_KEY=your_api_key_here
```

## 故障排除

### 常見問題

1. **CI 失敗但本地 OK**
   - 檢查是否遺漏依賴在 `package.json` 中
   - 確認測試在乾淨環境下能通過

2. **部署權限問題**
   - 確認 Secrets 設定正確
   - 檢查 GitHub Actions 權限

3. **建置失敗**
   - 檢查 Node.js 版本相容性
   - 確認所有依賴都已安裝

## 相關技能

- `esggo-learning-center-verify-deploy` - ESGGO 學習中心部署流程
- `ai-station` - AI Station 影片生成管道
- `vps-bootstrap-and-deploy` - VPS 部署流程
- `spa-deploy-and-cdn-debug` - SPA 部署與 CDN 調試

## 參考文件

- `references/omniauto-ci.yml` - 完整的 GitHub Actions CI/CD 工作流程模板
- `references/omniauto-reference.md` - OmniAuto 相關參考與配置指南
- `scripts/healthcheck.sh` - 健康檢查腳本

## VPS 部署

適用倉庫：`DingJun1028/esggo_vps`  
目標主機：`161.118.248.180`  
部署路徑：`/opt/esggo`  
SSH 金鑰：`~/.ssh/esggo_vps` (ed25519)  
使用者：`ubuntu`

```bash
ssh -i ~/.ssh/esggo_vps ubuntu@161.118.248.180
cd /opt/esggo
sudo apt update && sudo apt upgrade -y
git clone https://github.com/DingJun1028/esggo.git .
npm install
npm run build
pm2 start ecosystem.config.js
```

注意：Hermes 無法直接執行 SSH；請在本機終端手動連線並回傳終端輸出。

## OA-Team 30 萬能蜂群啟動

```bash
agents-cli swarm start --agents=30
```

蜂群分工矩陣：
- 智庫聖所：記憶與知識
- 符文契約：API、TypeScript、ZKP
- 光之羽翼：自動化、Task、前端
- 煉金熵減：重構、效能、CI/CD
- 5T 驗算：ISO、HashLock、UUID

啟動前請確認 `soul.md` 已建立且完成 Hash Lock。

## PowerShell 環境修正

```powershell
$OutputEncoding = [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
chcp 65001 | Out-Null
Remove-Item Alias:curl -Force -ErrorAction SilentlyContinue
```

## 連續工作流程

使用此技能時，請依序：
1. 讀取 `references/omniauto-ci.yml` 作為工作流程基礎
2. 設定 GitHub Secrets
3. 推送代碼觸發 CI/CD
4. 使用 `scripts/healthcheck.sh` 驗證專案健康狀態
5. VPS 部署時先 SSH 連線，再執行 bootstrap/deploy
6. 啟動 agents-cli swarm 前確認 soul.md 與 5T 驗證