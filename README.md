# ESG GO — OmniAgent & OmniJules 雙核驅動平台

## 🌐 專案簡介 (Project Overview)
ESG GO 是一個結合 **Bidirectional TypeScript** 架構與 **OmniAgent / OmniJules AI 雙核** 的次世代 ESG 自動化平台。本專案透過高度整合的 AI 網關與自動化部署流程，實現從地端開發到雲端運作的零幻覺同步。

> 💡 **AI 核心原型揭秘：** 
> 本平台的核心 AI 基於兩大頂尖開源軟體：
> - **OmniAgent**：原型為 **Hermes**，具備強大的跨平台特性，經 ESGGO 轉化後成為專屬的萬能代理。
> - **OmniJules**：前身為 **Google Jules**，具備「萬能果因協議」，專職系統底層修復與自主演化。
> 
> 在 ESGGO 平台中，我們將這兩大開源傑作發揚光大，所有數據與經驗將跨平台共享，但對外僅以 **OmniAgent** 與 **OmniJules** 命名，象徵它們已完全融入 5T 永續治理的核心。

### 🚀 核心架構 (Core Architecture)
- **Frontend/Backend**: Next.js 15 (Standalone Mode)
- **AI Core (Hermes Based)**: OmniAgent (ESG Master Orchestrator)
- **AI Healer (Jules Based)**: OmniJules (Karma Protocol Enforcer)
- **Cloud Infrastructure**: Oracle Cloud VM (ARM64 Optimized)
- **Process Management**: PM2 (Production Runtime)
- **Security**: Strict transitive dependency overrides & GitHub Push Protection
---

## 🛠️ 快速開始 (Quick Start)

### 1. 地端開發 (Local Development)
```bash
npm install
npm run dev
```

### 2. 生產部署 (Production Deployment)
本專案配備「神聖部署契約」，可一鍵同步至 VPS：
```bash
./deploy-omni.sh
```

### 3. 安全優化 (Security Audit)
目前已透過 `package.json` 中的 `overrides` 解決 40+ 個安全漏洞：
```bash
npm audit
```

---

## 📂 目錄結構 (Directory Structure)
- `/app`: Next.js App Router 核心邏輯
- `/omniagent-gateway`: 高性能 AI 任務網關 (Node.js)
- `/scripts`: 自動化維護與環境配置腳本
- `/vps`: VPS 特有配置文件 (Nginx, Systemd)

---

## 🔗 相關指南 (Related Guides)
- [VPS 直連與維護指南](./VPS_CONNECTION_GUIDE.md) — 關於伺服器連線、日誌監控與 PM2 管理。

---

## 🛡️ 維護承諾 (Maintenance Commitment)
由 **OmniAgent** 自動監控與維護：
1. **環境一致性**: 確保地端、GitHub 與 VPS 三方同步。
2. **自動安全性修復**: 持續監控並修補依賴項漏洞。
3. **性能優化**: 針對 ARM64 架構優化運行效率。
