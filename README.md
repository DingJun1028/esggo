# ESG GO — OmniAgent Full-Stack Platform

## 🌐 專案簡介 (Project Overview)
ESG GO 是一個結合 **Bidirectional TypeScript** 架構與 **OmniAgent AI 核心** 的次世代 ESG 自動化平台。本專案透過高度整合的 AI 網關與自動化部署流程，實現從地端開發到雲端運作的零幻覺同步。

### 🚀 核心架構 (Core Architecture)
- **Frontend/Backend**: Next.js 15 (Standalone Mode)
- **AI Engine**: Google Gemma 4 (31B) via OpenRouter & Gemini 2.0 Flash
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
