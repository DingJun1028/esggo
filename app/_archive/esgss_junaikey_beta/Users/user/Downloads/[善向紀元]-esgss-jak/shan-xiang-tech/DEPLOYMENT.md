# 🚀 善向技術 AI 代理學習平台部署指南

**專案代號**: ShanXiang-Tech-2026
**版本**: 1.0.0-alpha

---

## 📋 目錄

1. [系統需求](#系統需求)
2. [本地開發環境](#本地開發環境)
3. [Docker 部署](#docker-部署)
4. [生產環境部署](#生產環境部署)
5. [API 使用指南](#api-使用指南)
6. [故障排除](#故障排除)

---

## 💻 系統需求

### 最低系統需求
- **Node.js**: 18.0.0 或更高版本
- **Docker**: 20.10.0 或更高版本
- **Docker Compose**: 2.0.0 或更高版本
- **記憶體**: 至少 2GB RAM
- **磁碟空間**: 至少 1GB 可用空間

### 推薦系統配置
- **Node.js**: 20.0.0 或更高版本
- **Docker**: 24.0.0 或更高版本
- **記憶體**: 4GB RAM 或更多
- **CPU**: 雙核心或更高

---

## 🛠️ 本地開發環境

### 1. 環境準備

```bash
# 1. 克隆專案
git clone https://github.com/shan-xiang-tech/ai-agents-platform.git
cd shan-xiang-tech

# 2. 安裝依賴
npm install

# 3. 啟動開發服務器
npm run dev

# 4. 訪問平台
open http://localhost:3000
```

### 2. 開發命令

```bash
# 啟動開發服務器
npm run dev

# 運行測試
npm test

# 程式碼檢查
npm run lint

# 程式碼格式化
npm run format

# 建構生產版本
npm run build
```

### 3. 環境變數

創建 `.env` 文件：

```bash
# 應用程式配置
NODE_ENV=development
PORT=3002

# API 配置
API_BASE_URL=http://localhost:3002

# 可選：外部服務配置
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key
```

---

## 🐳 Docker 部署

### 單一服務部署

```bash
# 1. 建構並啟動所有服務
docker-compose up --build -d

# 2. 查看服務狀態
docker-compose ps

# 3. 查看日誌
docker-compose logs -f

# 4. 停止服務
docker-compose down
```

### 服務說明

| 服務名稱 | 端口 | 描述 |
|----------|------|------|
| shan-xiang-web | 8080 | 前端網頁界面 |
| shan-xiang-api | 3002 | 後端 API 服務 |
| shan-xiang-runner | - | 代理執行環境 (按需) |

### 訪問地址

- **前端界面**: http://localhost:8080
- **API 服務**: http://localhost:3002
- **API 文檔**: http://localhost:3002/api/courses
- **健康檢查**: http://localhost:8080/health

### 代理執行環境

```bash
# 啟動代理執行環境
docker-compose --profile runner up shan-xiang-runner

# 查看執行日誌
docker-compose logs shan-xiang-runner
```

---

## 🌐 生產環境部署

### 使用 Vercel 部署 (推薦)

```bash
# 1. 安裝 Vercel CLI
npm i -g vercel

# 2. 登入 Vercel
vercel login

# 3. 部署專案
vercel --prod

# 4. 設定環境變數
vercel env add NODE_ENV
vercel env add API_BASE_URL
```

### 使用 Docker Swarm

```bash
# 1. 初始化 Swarm
docker swarm init

# 2. 部署堆疊
docker stack deploy -c docker-compose.yml shan-xiang-stack

# 3. 查看服務
docker stack services shan-xiang-stack
```

### 使用 Kubernetes

```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: shan-xiang-tech
spec:
  replicas: 3
  selector:
    matchLabels:
      app: shan-xiang-tech
  template:
    metadata:
      labels:
        app: shan-xiang-tech
    spec:
      containers:
      - name: shan-xiang-api
        image: shan-xiang-tech:latest
        ports:
        - containerPort: 3002
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3002"
```

---

## 📡 API 使用指南

### 基礎 URL

```bash
# 本地開發
http://localhost:3002/api/v1

# 生產環境
https://api.shan-xiang.tech/v1
```

### 課程 API

```bash
# 獲取所有課程
GET /api/v1/courses

# 獲取單個課程
GET /api/v1/courses/{courseId}

# 按分類篩選課程
GET /api/v1/courses?category=multi-agent

# 搜索課程
GET /api/v1/search?q=langchain
```

### 學習進度 API

```bash
# 更新學習進度
POST /api/v1/progress/{userId}/{courseId}
Content-Type: application/json

{
  "progress": 75,
  "completed": false
}

# 獲取用戶進度
GET /api/v1/progress/{userId}
```

### 學習路徑 API

```bash
# 獲取學習路徑
GET /api/v1/learning-paths
```

---

## 🔧 故障排除

### 常見問題

#### 1. Docker 建構失敗

**問題**: `npm install` 在 Docker 中失敗

**解決方案**:
```bash
# 清除 Docker 快取
docker system prune -a

# 重新建構
docker-compose build --no-cache
```

#### 2. 端口衝突

**問題**: 端口 3002 或 8080 已被佔用

**解決方案**:
```bash
# 修改 docker-compose.yml 中的端口映射
ports:
  - "3003:3002"  # 改為 3003
  - "8081:80"    # 改為 8081
```

#### 3. API 無法訪問

**問題**: 前端可以訪問，但 API 呼叫失敗

**檢查項目**:
```bash
# 檢查 API 服務狀態
docker-compose ps shan-xiang-api

# 查看 API 日誌
docker-compose logs shan-xiang-api

# 測試 API 健康檢查
curl http://localhost:3002/health
```

#### 4. 記憶體不足

**問題**: Node.js 應用程式崩潰

**解決方案**:
```bash
# 增加 Docker 記憶體限制
# 在 docker-compose.yml 中添加
services:
  shan-xiang-api:
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
```

### 效能優化

#### 1. 啟用 Gzip 壓縮

```nginx
# nginx.conf
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

#### 2. 設定快取標頭

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

#### 3. 資料庫優化

```javascript
// 使用連線池
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

---

## 📊 監控和日誌

### 應用程式日誌

```bash
# 查看所有服務日誌
docker-compose logs -f

# 查看特定服務日誌
docker-compose logs -f shan-xiang-api

# 查看最近 100 行日誌
docker-compose logs --tail=100 shan-xiang-api
```

### 健康檢查端點

```bash
# API 健康檢查
GET /health

# 響應格式
{
  "status": "healthy",
  "timestamp": "2026-01-04T17:28:11.525Z",
  "version": "1.0.0-alpha",
  "environment": "production"
}
```

### 效能指標

```bash
# Docker 統計資訊
docker stats

# 系統資源使用
docker system df

# 容器資源使用
docker stats $(docker ps --format "{{.Names}}")
```

---

## 🔐 安全配置

### 環境變數安全

```bash
# 不要將敏感資訊提交到版本控制
# 使用 .env 文件並加入 .gitignore
echo ".env" >> .gitignore
echo "db.json" >> .gitignore
```

### API 安全

```javascript
// 啟用 CORS
import cors from 'cors';
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://shan-xiang.tech']
    : ['http://localhost:3000']
}));
```

### Docker 安全

```yaml
# docker-compose.yml 安全配置
services:
  shan-xiang-api:
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
```

---

## 📞 支援

### 聯絡方式

- **技術支援**: tech@shan-xiang.com
- **問題反饋**: https://github.com/shan-xiang-tech/ai-agents-platform/issues
- **文檔更新**: https://github.com/shan-xiang-tech/ai-agents-platform

### 社群資源

- **Discord 社群**: https://discord.gg/shan-xiang-tech
- **技術部落格**: https://blog.shan-xiang.com
- **學習社群**: https://community.shan-xiang.com

---

*本部署指南將持續更新。如有問題，請隨時聯絡善向技術團隊。*