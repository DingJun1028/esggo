# ESG Sunshine Universal System (善向紀元)

> 統一整合的ESG智慧平台 - 整合前端、後端、AI服務、資料庫等所有子系統

## 🏗️ 系統架構

```
ESG Sunshine Universal System
├── 🎨 前端應用 (React + Vite)
├── 🚀 API 網關 (Nginx)
├── 🔧 ESG 主後端 (Node.js/Express)
├── 📊 ESG API 服務 (舊版兼容)
├── 🧠 JunAiKey 萬能智庫 (AI + Vector DB)
├── 🤖 Shan Xiang Tech AI代理平台
├── 🗄️ PostgreSQL 資料庫 (主資料庫 + Vector DB)
├── ⚡ Redis 快取服務
└── 📈 監控系統 (Prometheus + Grafana)
```

## 🚀 快速開始

### 1. 環境準備

```bash
# 複製環境配置
cp .env.unified .env

# 編輯環境變數 (填入你的API金鑰)
nano .env
```

### 2. 一鍵安裝所有依賴

```bash
npm run install:all
```

### 3. 啟動統一系統

```bash
# 開發環境 (推薦)
npm run dev:unified

# 或啟用監控
npm run dev:unified:monitoring

# 或啟用所有工具
npm run dev:unified:tools
```

### 4. 訪問系統

- **前端應用**: http://localhost
- **API 文檔**: http://localhost/api/docs
- **監控面板**: http://localhost:3005 (admin/admin)
- **系統健康檢查**: http://localhost/health

## 📋 系統組件

### 核心服務

| 服務名稱 | 端口 | 描述 | 狀態 |
|---------|------|------|------|
| API Gateway | 80 | 統一入口點 | ✅ |
| ESG Frontend | 3000 | React 應用 | ✅ |
| ESG Backend | 3001 | 主API服務 | ✅ |
| ESG API (Legacy) | 3002 | 向下兼容API | ✅ |
| JunAiKey DB | 3003 | AI智庫服務 | ✅ |
| Shan Xiang Tech | 3004 | AI代理平台 | ✅ |
| PostgreSQL | 5432 | 主資料庫 | ✅ |
| JunAiKey DB | 5433 | Vector資料庫 | ✅ |
| Redis | 6379/6380 | 快取服務 | ✅ |

### 可選服務

| 服務名稱 | 端口 | 描述 | 啟動命令 |
|---------|------|------|----------|
| Prometheus | 9090 | 監控系統 | `npm run monitor:start` |
| Grafana | 3005 | 可視化面板 | `npm run monitor:start` |
| JunAiKey CLI | - | 命令行工具 | `npm run dev:unified:tools` |

## 🛠️ 開發命令

### 統一管理

```bash
# 安裝所有子系統依賴
npm run install:all

# 啟動完整系統
npm run dev:unified

# 檢查系統健康
npm run system:health

# 查看系統日誌
npm run system:logs

# 重啟系統
npm run system:restart
```

### 子系統獨立開發

```bash
# 前端開發
npm run dev:frontend

# 後端開發
npm run dev:backend

# API 服務
npm run dev:api

# JunAiKey 智庫
npm run dev:junaikeydb

# Shan Xiang Tech
npm run dev:shanxiang
```

### 測試

```bash
# 執行所有測試
npm run test:all

# 前端測試
npm run test:frontend

# 後端測試
npm run test:backend
```

### 部署

```bash
# 建置所有服務
npm run build:all

# 生產環境部署
npm run prod:deploy

# 停止生產環境
npm run prod:stop
```

## 🔧 配置說明

### 環境變數

系統使用統一的環境配置，所有服務共享相同的環境變數：

- **`.env.unified`**: 範本配置檔案
- **`.env`**: 實際使用的配置檔案

### 重要配置

```bash
# AI 服務
GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key

# 資料庫
DATABASE_URL=postgresql://user:pass@host:port/db

# 快取
REDIS_HOST=redis-host
REDIS_PORT=6379

# 認證
JWT_SECRET=your-jwt-secret
ADMIN_SECRET=admin-secret
```

## 🌐 API 路由

API 網關統一管理所有服務的路由：

```
GET  /                    → ESG 前端應用
GET  /api/*               → ESG 主後端
GET  /api/v1/*            → ESG API (舊版)
GET  /junaikey/*          → JunAiKey 智庫服務
GET  /shanxiang/*         → Shan Xiang Tech 平台
GET  /health              → 系統健康檢查
```

## 📊 監控與維護

### 健康檢查

```bash
# 檢查整體系統健康
curl http://localhost/health

# 檢查特定服務
curl http://localhost/api/health
curl http://localhost/junaikey/health
```

### 日誌查看

```bash
# 查看所有服務日誌
docker-compose logs -f

# 查看特定服務日誌
docker-compose logs -f esg-backend
docker-compose logs -f junaikeydb-backend
```

### 資料庫管理

```bash
# 資料庫遷移
npm run db:migrate

# 資料庫備份
npm run db:backup
```

## 🔒 安全配置

### 認證與授權

- JWT 認證系統
- 角色-based 權限管理
- API 速率限制
- CORS 配置

### SSL/TLS

系統支援 HTTPS（需要SSL證書）：

```bash
# 將證書放在 ssl/ 目錄下
ssl/
├── fullchain.pem
└── privkey.pem
```

## 🚀 擴展與客製化

### 添加新服務

1. 在 `docker-compose.yml` 中添加服務定義
2. 更新 `nginx-gateway.conf` 添加路由規則
3. 在 `.env.unified` 中添加相關配置
4. 添加管理腳本到 `package.json`

### 自訂主題

系統支援主題客製化：

```css
/* styles/custom-theme.css */
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
}
```

## 🐛 故障排除

### 常見問題

**Q: 服務無法啟動**
A: 檢查 Docker 和環境變數配置

```bash
# 檢查環境變數
cat .env | grep -v PASSWORD

# 檢查 Docker 狀態
docker-compose ps
```

**Q: API 請求失敗**
A: 檢查 API 網關和服務健康狀態

```bash
# 檢查網關狀態
curl -I http://localhost

# 檢查後端服務
curl http://localhost:3001/api/health
```

**Q: 資料庫連線失敗**
A: 檢查資料庫容器和網路連線

```bash
# 檢查資料庫容器
docker-compose logs esg-db

# 測試資料庫連線
docker-compose exec esg-db psql -U esg_user -d esg_dashboard -c "SELECT 1;"
```

### 效能優化

- 使用 Redis 快取
- 啟用 Gzip 壓縮
- 配置適當的資源限制
- 定期清理日誌和快取

## 📚 進一步閱讀

- [系統架構文檔](./ARCHITECTURE.md)
- [API 文檔](./API_DOCUMENTATION.md)
- [部署指南](./DEPLOYMENT_GUIDE.md)
- [開發規範](./BEST_PRACTICES_GUIDE.md)

## 🤝 貢獻指南

歡迎參與貢獻！請遵循以下步驟：

1. Fork 此專案
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 📄 授權

此專案採用 MIT 授權條款。

---

**ESG Sunshine Universal System** © 2024. 善向永續，萬能元鑰。