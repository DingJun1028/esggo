# ESGGO 聖典文獻 — 03：Repo 核心記憶碎片

> **來源：** `C:\Project\esggo_repo\` — 主要代碼倉庫（1949 files, 109MB）
> **分析結果：** 3862 個檔案中，3754 個已存在於母資料夾（97% 重疊）
> **獨特檔案：** 108 個（多為暫存檔、安裝包、測試檔）

## 獨特且有價值的內容

### 1. 環境配置（.env.production）
- 完整的生產環境變數配置範例
- 包含 Supabase、Firebase、Gemini、OpenAI、Telegram 等金鑰配置
- 已更新至記憶系統

### 2. 審計報告（audit.json）
- npm 安全審計報告（89KB）
- 記錄所有已知漏洞及修復版本

### 3. 工具腳本
- `create-admin.mjs` — Firebase Admin 建立腳本
- `create_dark_mode_design_system.js` — Stitch SDK 設計系統建立
- `gemma_4_example.py` — Gemma 4 模型載入範例
- `tailwind.config.ts` — 完整 Tailwind 配置（含自定義顏色）

### 4. 獨特頁面（app/）
- `app/consulting/` — 顧問服務頁面
- `app/omniagent-orchestrator/` — OmniAgent 編排器
- `app/omni-workflows/` — 工作流程頁面
- `app/omni-dashboard/` — 儀表板
- `app/omni-blueprint/` — 藍圖頁面
- `app/omni-skills/` — 技能頁面
- `app/omni-audit/` — 審計頁面
- `app/omni-orchestrator/` — 編排器
- `app/notes/` — 筆記頁面
- `app/omni-alchemy/` — 煉金術頁面
- `app/vault-omni/` — Vault Omni 頁面
- `app/omniguide/` — OmniGuide 頁面

### 5. 獨特服務（src/services/）
- 300+ 個服務檔案，包含：
  - AI 整合（Gemini, Ollama, Straico）
  - 區塊鏈（BlockchainAnchorService）
  - 治理（GovernanceCore, GovernanceDAO）
  - ESG（ComplianceSentinel, EmissionFactorService）
  - 情報（IntelligenceForge, IntelligenceDetectionService）
  - 供應鏈（SupplyChainManager, SupplierScoringService）
  - 報告（PDFGeneratorService, ReportGenerationService）
  - 安全（securityService, QuantumEncryptionService）

## 結論
esggo_repo 的核心內容 97% 已存在於母資料夾。獨特內容主要是：
1. 舊版頁面（已在母資料夾更新）
2. 工具腳本（已過時）
3. 測試/暫存檔（無需保留）

**建議：** 封存此資料夾，無需進一步提取。
