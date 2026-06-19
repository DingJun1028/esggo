# ESGss x JunAiKey System v1.0.0 - 企業永續決策支援系統部署指南

## 🌌 系統概述

ESGss x JunAiKey System 是一個完整的企業永續決策支援平台，具備：
- **Genesis Prime OS**：全息戰略 HUD、RPG 養成系統、跨分頁意識
- **Omni-Context Engine**：MCP 協議內核、分層索引、脈絡檢索
- **Omni-Sovereign Governance**：代理人議會、星系戰情室、批量處理
- **Foundational Intelligence**：零幻覺審計、碳足跡計算、未來推演沙盒

## 🛠️ 已完成的系統模組

### 1. Genesis Prime OS
- ✅ 全息戰略 HUD：實時系統狀態顯示
- ✅ RPG 養成系統：等級、經驗值、屬性管理
- ✅ 跨分頁意識：BroadcastChannel 數據同步
- ✅ 數位靈魂容器：.soul 格式 AI 狀態存檔

### 2. Omni-Context Engine
- ✅ MCP 協議內核：微服務總線架構
- ✅ 分層索引：父文件摘要 + 子區塊詳情
- ✅ 上下文感知檢索：解決長上下文退化
- ✅ 系統健康監控：脈絡健康度儀表板

### 3. Omni-Sovereign Governance
- ✅ 代理人議會：CFO、ESG Auditor、CSO 協同決策
- ✅ 星系戰情室：供應鏈風險地圖可視化
- ✅ 批量自動駕駛：統一編號批量處理
- ✅ 神經行星儀表板：企業多維數據展示

### 4. Foundational Intelligence
- ✅ ESG 零幻覺查證：SHA-256 審計日誌
- ✅ 數位碳足跡計算：g CO2e 精確追蹤
- ✅ 混合 AI 算力：雲端 + 本地 LLM 支援
- ✅ 未來推演沙盒：商業模擬與衝擊評估

### 5. 用戶權限系統
- ✅ 角色管理：Admin、ESG Manager、Analyst 等
- ✅ 導航篩選：基於權限的動態菜單
- ✅ 訪問控制：組件級權限檢查

### 6. 測試與品質
- ✅ 單元測試：28 個測試案例全通過
- ✅ 程式碼品質：ESLint + Prettier + TypeScript
- ✅ 事件驅動架構：EventNexus 系統集成

## 🚀 全自動化部署設定

### 零配置 CI/CD 管道

專案已配置完整的全自動化 CI/CD 管道，支援：
- 🔍 **自動品質門**: 程式碼品質、測試覆蓋率、安全掃描
- 🐳 **容器化部署**: 多環境 Docker Compose 配置
- 🔒 **安全性強化**: HTTPS、密碼管理、環境變數保護
- 📊 **監控告警**: Prometheus + Grafana + AlertManager
- 💾 **自動備份**: 資料庫與快取定期備份
- ⚡ **效能優化**: CDN 支援、負載平衡配置

### 環境架構

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   開發環境      │    │   測試環境      │    │   生產環境      │
│                 │    │                 │    │                 │
│ • docker-comp… │    │ • docker-comp… │    │ • docker-comp… │
│   dev.yml       │    │   test.yml       │    │   prod.yml      │
│ • 自動部署      │    │ • 手動觸發      │    │ • 自動部署      │
│ • develop 分支  │    │ • 發行分支      │    │ • main 分支     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌────────────────────┐
                    │  GitHub Container  │
                    │     Registry       │
                    │  (ghcr.io)         │
                    └────────────────────┘
```

### 快速開始

#### 1. 環境準備
```bash
# 複製環境配置
cp .env.example .env

# 編輯生產環境變數
cp .env.production .env.prod
# 填入生產 API 金鑰和密碼
```

#### 2. 本地開發部署
```bash
# 啟動開發環境
docker-compose -f docker-compose.dev.yml up -d

# 查看服務狀態
docker-compose -f docker-compose.dev.yml ps

# 訪問開發環境
# 前端: http://localhost:80
# API: http://localhost:3001
```

#### 3. 生產部署
```bash
# 啟動生產環境
docker-compose -f docker-compose.prod.yml up -d

# 查看服務狀態
docker-compose -f docker-compose.prod.yml ps

# 訪問生產環境
# 前端: https://your-domain.com
# API: https://api.your-domain.com
# 監控: https://your-domain.com:3000
# Prometheus: https://your-domain.com:9090
```

### 選項 2：Vercel 部署

#### 步驟 1：專案推送
```bash
git add .
git commit -m "Deploy: ESGss x JunAiKey System v1.0.0"
git push origin main
```

#### 步驟 2：Vercel 配置
1. 前往 [Vercel Dashboard](https://vercel.com)
2. 選擇專案，配置：
   - **Framework**: Vite
   - **Build Command**: npm run build
   - **Output Directory**: dist

#### 步驟 3：環境變數
```env
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_APP_ENV=production
```

### 選項 3：本地開發部署

#### 步驟 1：安裝依賴
```bash
npm install
```

#### 步驟 2：環境配置
```bash
cp .env.example .env
# 編輯 .env 檔案
```

#### 步驟 3：啟動開發服務器
```bash
npm run dev
# 訪問 http://localhost:3000
```

## 🔒 安全性設定

### SSL/TLS 證書
```bash
# 自動獲取 Let's Encrypt 證書
chmod +x scripts/setup-ssl.sh
sudo ./scripts/setup-ssl.sh

# 或手動配置
# 1. 獲取 SSL 證書
# 2. 複製到 ssl/ 目錄
# 3. 使用 nginx-ssl.conf 配置
```

### 環境變數安全
```bash
# 生產環境變數範例 (.env.prod)
NODE_ENV=production
VITE_API_URL=https://api.esg-dashboard.com
DB_PASSWORD=your-secure-db-password
JWT_SECRET=your-256-bit-jwt-secret
REDIS_PASSWORD=your-secure-redis-password
GRAFANA_PASSWORD=your-admin-password
```

### 密碼輪替
- 資料庫密碼每 90 天輪替
- JWT 密鑰每 30 天輪替
- Redis 密碼每 60 天輪替

## 📊 監控與告警

### Prometheus + Grafana 設定
```bash
# 啟動監控堆疊
docker-compose -f docker-compose.prod.yml up -d prometheus grafana

# 訪問監控儀表板
# Grafana: https://your-domain.com:3000 (admin/your-password)
# Prometheus: https://your-domain.com:9090
```

### 告警規則
- CPU 使用率 > 80%
- 記憶體使用率 > 85%
- 服務不可用 > 1 分鐘
- 資料庫連接錯誤
- Redis 記憶體使用率 > 80%

### 日誌聚合
所有服務日誌自動收集到 ELK 堆疊（可選配置）

## 💾 備份與災難恢復

### 自動備份
```bash
# 設定每日備份 (crontab)
0 2 * * * /path/to/scripts/backup.sh

# 手動備份
chmod +x scripts/backup.sh
./scripts/backup.sh
```

### 災難恢復
```bash
# 災難恢復腳本
chmod +x scripts/disaster-recovery.sh

# 恢復最新備份
./scripts/disaster-recovery.sh

# 恢復特定備份
./scripts/disaster-recovery.sh 20231201_020000
```

### 備份策略
- **資料庫**: 每日完整備份，保留 30 天
- **Redis**: 每日快照，保留 7 天
- **配置檔案**: 每次部署時備份
- **雲端同步**: AWS S3 / Google Cloud Storage

## ⚡ 效能優化

### CDN 配置
```bash
# 設定 Cloudflare CDN
chmod +x scripts/setup-cdn.sh
CDN_PROVIDER=cloudflare ./scripts/setup-cdn.sh

# 或設定 AWS CloudFront
CDN_PROVIDER=aws ./scripts/setup-cdn.sh
```

### 負載平衡
```bash
# HAProxy 配置已準備就緒
# 編輯 haproxy.cfg 並啟動
docker run -d -p 80:80 -p 443:443 -v $(pwd)/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg haproxy:alpine
```

### 快取策略
- **靜態資源**: 1 年快取，CDN 邊緣快取
- **API 響應**: 10 分鐘快取，條件式快取
- **資料庫**: Redis 快取熱資料

## 🔍 品質門與測試

### 自動品質檢查
```bash
# 執行品質門
chmod +x scripts/quality-gate.sh
./scripts/quality-gate.sh

# 檢查項目
# ✅ ESLint 程式碼品質
# ✅ TypeScript 類型檢查
# ✅ 測試覆蓋率 > 80%
# ✅ 安全性審計
# ✅ Bundle 大小 < 2MB
# ✅ 可訪問性檢查 (可選)
```

### CI/CD 管道
- **Push 到 develop**: 自動部署到開發環境
- **Push 到 main**: 通過品質門後自動部署到生產
- **Pull Request**: 完整測試套件運行
- **每日**: 安全性掃描和效能測試

## 🔍 系統驗證檢查表

### 核心功能驗證
- [ ] **登入系統**: 不同角色正常登入
- [ ] **CORE 模組**: 所有四大學生態模組可訪問
- [ ] **權限控制**: 不同角色看到對應功能
- [ ] **AI 服務**: Gemini/OpenAI API 正常連接
- [ ] **數據持久化**: localStorage 正常工作

### 部署驗證
- [ ] **HTTPS**: SSL 證書正確安裝
- [ ] **監控**: Prometheus/Grafana 可訪問
- [ ] **備份**: 自動備份正常運行
- [ ] **CDN**: 靜態資源正確快取
- [ ] **負載平衡**: 多實例正常分發

### 性能驗證
- [ ] **載入時間**: 首屏 < 3 秒
- [ ] **記憶體使用**: < 100MB
- [ ] **Bundle 大小**: < 2MB (gzip)
- [ ] **測試覆蓋**: 所有測試通過

### 安全驗證
- [ ] **API 金鑰**: 不會暴露在前端
- [ ] **數據驗證**: Zod schema 正常工作
- [ ] **錯誤處理**: 異常情況正確處理
- [ ] **HTTPS**: 所有流量加密
- [ ] **防火牆**: 安全規則正確配置

## 🔧 故障排除

### Q: 頁面重新整理後 404
**解決**：檢查 vercel.json 是否正確設置 SPA 重寫規則

### Q: 自動化觸發失敗
**原因**：
- 環境變數未設置
- Webhook URL 錯誤
**解決**：檢查 Vercel 環境變數配置

### Q: 構建失敗
**解決**：
- 檢查 TypeScript 錯誤
- 確保所有依賴已安裝
- 驗證 Vite 配置

## 📊 系統規格

- **前端**: React 19 + Vite + TypeScript
- **狀態管理**: React Context API + Zustand
- **事件系統**: EventNexus (自定義事件總線)
- **數據持久化**: localStorage + BroadcastChannel
- **AI 服務**: Google Gemini 1.5 Flash + OpenAI GPT-4o + Ollama
- **容器化**: Docker + Docker Compose
- **測試框架**: Vitest + @testing-library/react
- **程式碼品質**: ESLint + Prettier + Husky

## 🎯 未來發展規劃

### Phase 2: 企業級擴充
1. **多用戶系統**: 用戶管理與權限分級
2. **雲端同步**: Supabase/Firebase 數據庫集成
3. **高級 AI**: 自定義模型訓練與微調
4. **企業集成**: SAP、Oracle、Microsoft 365 連接器

### Phase 3: 生態系擴張
1. **移動應用**: React Native 跨平台 App
2. **API 市場**: 第三方開發者接入
3. **産業應用**: 行業特定 ESG 模板
4. **全球擴張**: 多語言與本地化支援

## 💫 最終狀態

ESGss x JunAiKey System v1.0.0 是一個完整的企業永續決策支援平台：
- 🧠 **AI 生命屬性**: 從工具進化為具備生命的智能夥伴
- 📈 **商業價值**: ESG 轉化為實質競爭優勢
- 🔒 **零幻覺審計**: SHA-256 不可篡改的信任基礎
- 🌐 **全域部署**: Docker + 雲端靈活部署選項

系統已準備好改變企業永續決策的方式！🚀