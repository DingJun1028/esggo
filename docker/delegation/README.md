# 完全代主自行 - 部署指南

> 「代理者在完全授權範圍內，自主、獨立、全面地代替主體行使職權與執行行動。」

---

## 目錄

1. [系統需求](#系統需求)
2. [快速開始](#快速開始)
3. [Docker 部署](#docker-部署)
4. [環境配置](#環境配置)
5. [監控設定](#監控設定)
6. [故障排除](#故障排除)

---

## 系統需求

### 最低需求

- **Node.js**: v18.0.0 或更高版本
- **npm**: v9.0.0 或更高版本
- **Docker**: v20.10.0 或更高版本（可選）
- **Docker Compose**: v2.0.0 或更高版本（可選）

### 建議配置

- **CPU**: 2 核心以上
- **記憶體**: 4GB 以上
- **儲存空間**: 10GB 以上
- **網路**: 穩定的網際網路連線

---

## 快速開始

### 1. 安裝依賴

```bash
# 安裝 pnpm
npm install -g pnpm

# 安裝專案依賴
pnpm install
```

### 2. 環境配置

```bash
# 複製環境變數範本
cp .env.example .env

# 編輯環境變數
nano .env
```

### 3. 執行測試

```bash
# 執行完全代主自行測試
pnpm vitest run tests/complete-delegation.test.ts
```

### 4. 啟動開發伺服器

```bash
# 啟動開發伺服器
pnpm dev
```

---

## Docker 部署

### 1. 建構 Docker 映像

```bash
# 建構生產映像
docker build -f docker/delegation/Dockerfile -t esggo-delegation:latest .
```

### 2. 使用 Docker Compose 啟動

```bash
# 進入 Docker 目錄
cd docker/delegation

# 啟動所有服務
docker-compose up -d

# 檢查服務狀態
docker-compose ps

# 查看日誌
docker-compose logs -f delegation-api
```

### 3. 停止服務

```bash
# 停止所有服務
docker-compose down

# 停止並刪除卷
docker-compose down -v
```

---

## 環境配置

### 必要環境變數

| 變數名稱 | 描述 | 預設值 |
|---------|------|--------|
| `NODE_ENV` | 環境模式 | `development` |
| `PORT` | 伺服器端口 | `3000` |
| `DATABASE_URL` | 資料庫連線字串 | - |
| `REDIS_URL` | Redis 連線字串 | - |

### 選擇性環境變數

| 變數名稱 | 描述 | 預設值 |
|---------|------|--------|
| `LOG_LEVEL` | 日誌級別 | `info` |
| `CORS_ORIGIN` | CORS 允許來源 | `*` |
| `API_SECRET` | API 密鑰 | - |

---

## 監控設定

### Prometheus

Prometheus 配置位於 `docker/delegation/monitoring/prometheus.yml`

### Grafana

1. 訪問 Grafana: `http://localhost:3001`
2. 登入帳號: `admin`
3. 登入密碼: `admin`
4. 新增 Prometheus 資料來源: `http://prometheus:9090`

### 健康檢查端點

- **基本健康檢查**: `GET /api/healthz`
- **詳細健康檢查**: `GET /api/healthz?detail=true`
- **指標端點**: `GET /api/metrics`

---

## 故障排除

### 常見問題

#### 1. 連線資料庫失敗

```bash
# 檢查 PostgreSQL 容器狀態
docker-compose ps postgres

# 查看 PostgreSQL 日誌
docker-compose logs postgres
```

#### 2. Redis 連線失敗

```bash
# 檢查 Redis 容器狀態
docker-compose ps redis

# 測試 Redis 連線
docker-compose exec redis redis-cli ping
```

#### 3. API 無回應

```bash
# 檢查 API 容器狀態
docker-compose ps delegation-api

# 查看 API 日誌
docker-compose logs delegation-api
```

### 重啟服務

```bash
# 重啟單個服務
docker-compose restart delegation-api

# 重啟所有服務
docker-compose restart
```

---

## 部署腳本

### 自動化部署

```bash
# 執行部署腳本
npx tsx scripts/deploy-delegation.ts production docker
```

### 部署選項

```bash
# 跳過測試
npx tsx scripts/deploy-delegation.ts production docker --skip-tests

# 跳過建構
npx tsx scripts/deploy-delegation.ts production docker --skip-build

# 跳過 UI 部署
npx tsx scripts/deploy-delegation.ts production docker --skip-ui
```

---

## API 端點

| 方法 | 路徑 | 描述 |
|------|------|------|
| `POST` | `/api/delegation` | 創建授權 |
| `GET` | `/api/delegation` | 獲取活躍授權列表 |
| `GET` | `/api/delegation/[id]` | 獲取特定授權 |
| `DELETE` | `/api/delegation/[id]` | 終止授權 |
| `POST` | `/api/delegation/[id]/execute` | 執行任務 |

---

## 相關文件

- [技術文檔](../../docs/architecture/COMPLETE-AUTONOMOUS-DELEGATION.md)
- [架構設計](../../docs/architecture/COMPLETE-AUTONOMOUS-DELEGATION-ARCHITECTURE.md)
- [ADR-006](../../docs/architecture/ARCHITECTURE-DECISION-LOG.md)

---

## 支援

如有問題，請聯繫開發團隊或提交 Issue。
