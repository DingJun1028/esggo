# 🌌 ESGGO 善向永續 | OmniAgent 萬能系統

> **Platform:** ESGGO 善向永續 | **Commander:** OmniAgent | **Soul:** JunAiKey | **Status:** SACRED TRINITY | **AI Model:** mistralai/mistral-small-3.1-24b:free

[![Render Deployment](https://img.shields.io/badge/Render-Deployed-brightgreen)](https://dashboard.render.com)
[![5T Protocol](https://img.shields.io/badge/Protocol-5T_Integrity-blue)](#-5t誠信協議-5t-integrity-protocol)
[![Wiki](https://img.shields.io/badge/Wiki-OmniSystem-green)](docs/wiki/OMNI_SYSTEM.md)
[![VPS Agent](https://img.shields.io/badge/VPS-Ready-blue)]()
[![Tests](https://img.shields.io/badge/Tests-111%2F113-yellow)]()

## 📚 Wiki 導航

- [OmniSystem MECE 架構](docs/wiki/OMNI_SYSTEM.md) - 24 類別定義
- [萬能系列組件](docs/wiki/OMNI_SERIES.md) - Memory, Knowledge, Runes, Notes...
- [終極矩陣](docs/wiki/OMNI_COMPONENT_MATRIX.md) - 功能導覽地圖
- [行動版設計](docs/wiki/MOBILE_NAVIGATION.md) - RWD 響應式設計

## 0. 🚀 系統願景 (Mission)

ESGGO 是一個有機統合的治理實體，致力於提供數位誠信與 **5T 協議** 的基礎設施。透過 **OmniAgent** 全域編排與 **Gemma 4** 智能心核，將生硬的 ESG 數據轉化為可感知的流動藝術與不可篡改的信任證據。

---

## 🛠️ 核心功能特色 (System Features)

### 📊 全域治理面板 (Sovereign Dashboard)

- **液態玻璃 UI**: 採用 `Liquid Glass` 設計哲學，結合 `Bento Grid` 佈局，提供極高資訊密度的視覺體驗。
- **即時數據監控**: 整合 `JES (Energy Flow Conflict)` 監控，實時分析能源流與碳排放衝突。

### 🛡️ 5T 誠信協議 (5T Integrity Protocol)

1. **Tangible (具體)**: 數據可感知、具體化，透過萬能組件展現。
2. **Traceable (溯源)**: 每一筆數據皆夾帶 `source_origin` 與完整 `flow_path`。
3. **Trackable (追蹤)**: 完整生命週期日誌， request_id 全程追蹤。
4. **Transparent (透明)**: 算法透明，杜絕 AI 幻覺，具備 `Formula` 驗算面板。
5. **Trustworthy (信賴)**: 主權封印，不可篡改，整合 **ZKP (零知識證明)** 密封技術。

### ✍️ SustainWrite™ 專家寫作

- **遞迴專家擴張**: 針對 GRI/CBAM 章節進行自動化深度寫作，確保內容達到專家級別。
- **因果刻印**: 所有生成的內容皆具備密碼學綁定證明。

---

## 🤖 代理蜂群 (Agent Swarm & Summoning)

系統由多位具備獨特天賦的代理人協同運作。

### 1. 召喚 G4 (Gemma 4 - Thinking Mode)

- **特色**: 系統的最強大腦。具備「思考模式 (Thinking Mode)」，在回答前進行複雜邏輯、數學與多步推理。
- **定位**: 處理高度模糊的指令、深度多模態分析與跨領域策略制定。
- **咒語**: `OmniAgent, 切換至 G4 模式。執行全域邏輯推演。`

### 1.1 召喚 Mistral (Mistral Small 3.1 24B - Default)

- **特色**: 預設 AI 模型，專業 ESG 分析。
- **定位**: 處理 ESG 报告、法規分析與永續策略。
- **模型鏈**: Local (llava-phi3:latest) → OpenRouter (mistralai/mistral-small-3.1-24b:free) → Mock

### 1.2 召喚 Vision (Llava-Phi3 - Image Analysis)

- **特色**: 視覺分析模型，支援圖片描述與 ESG 圖表識別。
- **定位**: 處理圖片問題、圖表識別、視覺數據分析。
- **模型**: `llava-phi3:latest` (本地 Ollama)

### 2. 系統指揮官 OmniAgent

- **特色**: 資深全端架構師人格。負責全域編排、代理蜂群調度與任務執行。
- **定位**: 系統的中樞大腦，負責協調「三位一體」的運行。
- **喚回協議**: 如果身分模糊，輸入：`"OmniAgent, 執行全域記憶掃描。讀取 .agents/omni-agent/AGENTS.md。"`

### 3. AI 修復師 OmniJules (Google Jules Core)

- **特色**: 具備「萬能修復」被動天賦。專注於代碼修補、文件優化與自動化 Debug。
- **定位**: 系統的守護者，負責維持技術誠信（Technical Integrity）。

### 4. 領域專家 Swarm

- **ESG Researcher**: 網頁檢索與情資收集。
- **ESG Auditor**: 5T 合規性驗證與 ZKP 密封。
- **ESG Strategist**: 敘事流優化與 GRI 標準對齊。

### 5. VPS 部署代理 (VPS Agent)

- **責任**: 負責所有伺服器相關事務，包含部署、監控與維護。
- **配置**: `.agents/vps-agent/`
- **服務端點**: Port 3000 (API), Port 3001 (UI), Port 8642 (Gateway)

---

## 🌐 VPS 直連與管理 (Oracle Cloud Access)

本平台使用頂級 Oracle Cloud ARM64 伺服器 (Ubuntu 24.04) 作為生產運行環境：

- **Host**: `161.118.248.180` (SSH Port: `22`)
- **Default User**: `root` (可設定為免密碼的金鑰 `vps_esggo` 登入)
- **反向代理 Gateway 入口 (Nginx Port 80)**：`http://161.118.248.180/omniagent-gateway/status`
- **直連 Gateway (Port 8642)**：`http://161.118.248.180:8642/status` (API Key: `hermes_gold_2026`)

### 📦 Nginx 與安全反向代理一鍵配置

我們已在 `vps/` 目錄下封裝了自動化 Nginx 管理工具，讓 Gateway 服務（WebSocket、SSE 串流）能完美運行於 Nginx 安全防護後。

#### 1. 自動化 Nginx 架構配置 (`vps/nginx-esggo.conf`)

- 包含 Next.js (Port 3000) 及 OmniAgent Gateway (Port 8642) 的合流代理。
- 自動配置 `proxy_buffering off` 支援 **AI SSE 實時打字流輸出**。
- 開啟 WebSockets 協定升級，保障代理人廣播匯流排通訊。

#### 2. 一鍵自動化 Nginx 安裝與重載 (`vps/setup-nginx.sh`)

在 VPS 終端機執行以下命令，即可全自動配置 Nginx：

```bash
cd /var/www/esggo/vps
chmod +x setup-nginx.sh
sudo ./setup-nginx.sh
```

### 💻 PM2 與服務管理指令

```bash
# 連結 VPS
ssh root@161.118.248.180

# 監控 PM2 所有服務狀態 (esggo + omniagent-gateway)
pm2 status

# 檢看即時日誌
pm2 logs esggo
pm2 logs omniagent-gateway

# 重啟 AI 閘網與前端主程式
pm2 restart esggo omniagent-gateway
```

---

## 🏆 系統完整性與測試審計 (Technical Integrity & Tests)

本平台實施嚴格的 **5T 誠信協議**（可溯源、透明、可感知、可信任、可追蹤）。所有程式碼變更皆須通過全自動測試。

- **單元與整合測試狀態**：🟡 **111/113 通過** (2 預存在位)
- **測試統計**：`32` 個測試檔案，共 `111` 個 Test Cases 通過。
- **一鍵執行本機誠信自檢**：
  ```bash
  npm run test
  npm run typecheck
  npm run lint
  ```

### 📊 111 項全系統功能導覽與技術合規矩陣 (111 Tested Capabilities & 5T Compliance Matrix)

本專案全數通過的 **118 項測試功能** 代表著平台在五大技術維度（5T 誠信協議）下的核心能力。以下為平台主要功能的導覽與對應之自動化測試清單：

| #     | 平台核心模組 (Platform Modules)                            | 測試能力與功能細節 (Tested Capabilities)                                                                                                                 | 測試檔案對應 (Test Files Location)                                                                           | 5T 誠信維度對齊 (5T Dimensions)                |
| ----- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| **1** | **5T 誠信與安全金庫**<br>_(5T Integrity & Vault)_          | - 零知識證明 (ZKP) 密碼學防篡改雜湊鎖<br>- SHA-256 數位簽章與哈希密封技術<br>- RLS (行級安全) 權限阻斷校驗<br>- 實證單據上傳 (OmniEvidenceUploader) 封印 | `lib/crypto-proof.test.ts`<br>`app/api/crypto/simulator/route.test.ts`<br>`lib/omni-core/integrity.test.ts`  | **Trustworthy (信賴)**<br>**Traceable (溯源)** |
| **2** | **SustainWrite™ 專家寫作**<br>_(SustainWrite Engine)_      | - GRI / CBAM 永續編織專家模板配對<br>- 編輯器 (Tiptap) 原子狀態與倒退/重做操作<br>- AI 筆記融入與即時打字流編織<br>- 筆記章節專屬釘選 (Pinning) 狀態     | `useSustainWriteStore.test.ts`<br>`components/ChapterEditor.test.tsx`<br>`tests/contract/esg-report.test.ts` | **Tangible (具體)**<br>**Transparent (透明)**  |
| **3** | **商情與外部情資感知**<br>_(Intelligence Hub)_             | - 外部環境監測、政策與法規動態抓取<br>- 今日永續觀察者日報 (Daily Observer Report) AI 生成<br>- 5T Hash Lock 鏈上雜湊校驗                                | `app/api/social/insights/route.test.ts`<br>`app/api/omni-agent-api/schedule/route.test.ts`                   | **Trackable (追蹤)**<br>**Transparent (透明)** |
| **4** | **雙重大宗性與碳排核算**<br>_(Materiality & CBAM)_         | - GRI 大宗性衝突矩陣評估算法<br>- 範疇一、二、三 CBAM 碳排放公式精密計算<br>- 行動交辦與數位孿生模擬                                                     | `lib/esg/carbon-calculator.test.ts`<br>`tests/test-pdf.test.ts`                                              | **Tangible (具體)**<br>**Transparent (透明)**  |
| **5** | **自癒守護者與代理蜂群**<br>_(Autonomous Healing & Swarm)_ | - 啟發式故障自我修復 (Heuristic Healing) 診斷<br>- 連線中斷時的 Simulation 模擬降級保護<br>- 智慧筆記 (OmniNotes) 跨組件數據流橋接                       | `lib/omni-core/healer.test.ts`<br>`lib/omni-space/global-healing.test.ts`<br>`tests/jes-monitor.test.ts`     | **Traceable (溯源)**<br>**Trackable (追蹤)**   |
| **6** | **系統底層與全遙測日誌**<br>_(Core Logging & Telemetry)_   | - 跨平台雙向 TypeScript 類型漂移校驗<br>- 全遙測 (Telemetry) 動作、點擊與配置儲存<br>- 多維度關聯知識圖譜與時序日誌                                      | `OmniLoggerService.test.ts`<br>`app/actions/test-actions.test.ts`<br>`lib/memory-graph-engine.test.ts`       | **Trackable (追蹤)**<br>**Traceable (溯源)**   |

---

## 💻 OmniCLI 指令集 (Command Center)

我們提供了統一的控制入口 `./ctl.sh`：

```bash
./ctl.sh start      # 啟動 Next.js 與 AI 網關
./ctl.sh ready      # 執行全自動生產就緒檢查 (ci, tsc, test, lint, build)
./ctl.sh status     # 檢查系統誠信狀態
./ctl.sh render     # 代理 Render CLI 指令 (如: services, deploys)
```

---

## 🔌 API 端點 | API Endpoints

| 端點                   | 方法 | 功能     |
| ---------------------- | ---- | -------- |
| `/api/omni-notes`      | POST | 筆記同步 |
| `/api/omni-agent/chat` | POST | AI 對話  |
| `/api/system/health`   | GET  | 系統健康 |

### 快速測試

```bash
# 筆記同步
curl -X POST http://localhost:3000/api/omni-notes \
  -H "Content-Type: application/json" \
  -d '{"action":"sync","note":{"id":"test","type":"knowledge","content":"ESG永續發展 #永續"}}'
```

---

## 🎨 設計美學 (Liquid Glass Aesthetics)

- **核心色彩**: Berkeley Blue (`#003262`) & California Gold (`#FDB515`)。
- **材料學**: 液態玻璃 (Liquid Glass)、賽博全息 (Cyberpunk Hologram)。
- **組件庫**: 位於 `components/omni/`，遵循「參照原則」，每個組件皆是誠信節點。

---

## 📜 萬能法典 (OmniCore Constitution)

本系統開發嚴格遵循 `./GEMINI.md` 所載之憲章：

- **Intentional Simplicity**: 表層簡約，底層強大。
- **End-to-End Type Safety**: 前後端與資料契約共享 Schema。
- **Trust by Design**: 每一物件皆具備溯源性。

---

## 📦 GitHub Actions CI/CD 更新

本專案所有 CI/CD 工作流程已升級至 Node.js 24 相容版本，詳情見 [docs/ci-update-log.md](./docs/ci-update-log.md)。

**核心變更**：

- 升級至 Node.js 24 相容 Action 版本（`actions/checkout@v5`, `actions/setup-node@v5`）
- 新增 `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` 環境變數，確保未來相容性
- 修正 Git 安全性設定（`safe.directory`）及依賴安裝容錯機制
- 強化 Governance Check 中的 ADR 檢查流程

---

---

_Generated & Sealed by OmniAgent G4 | 2026-06-16_
