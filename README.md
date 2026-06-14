# 🌌 ESGGO 善向永續 | OmniAgent 萬能系統

> **Platform:** ESGGO 善向永續 | **Commander:** OmniAgent | **Soul:** JunAiKey | **Status:** SACRED TRINITY

[![Render Deployment](https://img.shields.io/badge/Render-Deployed-brightgreen)](https://dashboard.render.com)
[![5T Protocol](https://img.shields.io/badge/Protocol-5T_Integrity-blue)](#-5t-誠信協議-5t-integrity-protocol)
[![Design](https://img.shields.io/badge/Design-Liquid_Glass-cyan)](#-設計美學-liquid-glass-aesthetics)

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

- **單元與整合測試狀態**：🟢 **100% 全數綠燈通過**
- **測試統計**：`32` 個測試檔案，共 `118` 個 Test Cases 完美通過。
- **一鍵執行本機誠信自檢**：
  ```bash
  npm run test
  ```

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

_Generated & Sealed by OmniAgent G4 | 2026-06-12_
