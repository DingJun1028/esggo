# OmniHermes 系統 + ESG Go 系統 | Omni_Terminal v8.5.1-Alpha

> 臺北市中小企業永續治理實證系統 · Berkeley Haas × TSISDA · 5T 誠信協議 · Omni-Agent 智能調度 · BlueCC 混合雲中控

[![Next.js](https://img.shields.io/badge/Next.js-15.5.18-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com)
[![OmniHermes](https://img.shields.io/badge/OmniHermes-v0.14.1-blueviolet)](https://github.com/DingJun1028/esggo_orignal_1)
[![BlueCC](https://img.shields.io/badge/BlueCC-Cloud_Ready-blue)](https://api.blue.cc)

---

## 🏛️ 核心架構：5T × Omni-Agent 誠信協議

| 協議 | 定義 | 技術實作 |
|------|------|---------|
| **T1 Tangible** | 抽象數據轉化為具體治理指標 | Bento Grid 視覺化 + Skeleton Loader |
| **T2 Traceable** | 每筆數據與原始憑證精確關聯 | `evidence_id` 外鍵 + `source_origin` 欄位 |
| **T3 Trackable** | 完整編輯軌跡與生命週期追蹤 | `audit_logs` 表 + 生命週期 Hook |
| **T4 Transparent** | AI 主動掃描風險，算法公開 | **OmniHermes** 合規引擎 + GRI 對齊檢查 |
| **T5 Trustworthy** | SHA-256 雜湊鎖定，不可篡改 | `hash_lock` 欄位 + ZKP 封印通知 |

---

## ☁️ BlueCC 混合雲中控 (Hybrid Control Plane)

系統已整合 **BlueCC Cloud**，實現本地 VPS 與雲端資源的動態調度：
- **Real-time Monitoring:** 監控雲端 GPU 節點 (NVIDIA H100) 與 AlloyDB AI 狀態。
- **Cloud Bursting:** 當本地執行層負載過高時，自動外核化任務至 BlueCC 集群。
- **Unified Logic:** 透過 `omni` CLI 實現一鍵佈署與狀態同步。

---

## 📱 全域 RWD 與手機特優化

針對企業治理場景，提供最流暢的行動端體驗：
- **Selection House:** 針對複雜 GRI 指標，提供全螢幕分類「全選項屋」，解決小螢幕選擇困難。
- **Mobile Bottom Nav:** 針對 iOS/Android 進行 Safe Area 優化，確保操作不遮擋。
- **Liquid Glass UI:** 採用玻璃擬態層次感，提升行動端資訊讀取密度。

---

## 🏗️ 技術架構 (V8.5.1 Update)

```
Frontend:   Next.js 15.5.18 + React 19 (全端安全性更新)
Cloud Ctrl: BlueCC API Bridge + Hybrid Dispatcher
Edge Funcs: send-email-resend (Resend API) + evidence-processor (5T Seal)
Database:   Supabase PostgreSQL (16+ 張資料表 + RLS)
AI Engine:  Google Gemini 2.0 Flash + Nous Hermes-2 Pro (Hybrid)
ZKP:        Web Crypto API (SHA-256) + 5T Master Seal Notification
```

---

## 📦 功能模組總覽

### CORE 核心模組

| 頁面 | 路徑 | 功能說明 |
|------|------|---------|
| 控制台 Dashboard | `/` | KPI 互動卡片、GRI 覆蓋矩陣、5T 活動日誌 |
| 永續撰寫 SustainWrite | `/editor` | 12 章節 GRI 2021、Omni-Agent 輔助生成、5T 封印 |
| 數位分身 Digital Twin | `/digital-twin` | RAG 知識庫、道德 DNA 滑桿、主權帳本 |
| AI 整合平台 AI Platform | `/ai-platform` | **BlueCC 雲端狀態監控**、AI 應用中心 |

---

## 🎨 品牌設計系統

**Berkeley Academy Design System v10.0**

- **主色:** Berkeley Blue (`#003262`) / California Gold (`#FDB515`)
- **字體:** Inter + Noto Sans TC
- **哲學:** Liquid Glass · Bento Grid · Berkeley Academic Precision

---

## 🚀 快速開始

### 環境需求
- Node.js v20.0.0+
- npm v10.0.0+

### 安裝與啟動
```bash
# 1. Clone 專案
git clone https://github.com/DingJun1028/esggo_orignal_1.git
cd esggo_orignal_1

# 2. 安裝依賴 (包含安全性修正)
npm install

# 3. 啟動開發伺服器
npm run dev
```

### CLI 工具使用
```bash
# 檢查 VPS 與 5T 狀態
npx omni agent status
npx omni blue status
npx omni audit report
```

---

## 🔑 關鍵環境變數

| 變數名稱 | 用途 |
|---------|------|
| `NEXT_PUBLIC_HERMES_GATEWAY_URL` | 指向 VPS 上的 Hermes Gateway (Port 8642) |
| `RESEND_API_KEY` | 用於 5T 封印完成的電子郵件通知 |
| `BLUE_CC_API_KEY` | 串接 BlueCC 雲端集群控制權限 |

---

## 🤝 核心貢獻者
| 角色 | 貢獻者 |
|------|--------|
| **系統架構設計與開發** | Antigravity AI |
| **ESG 框架顧問** | Berkeley Haas × TSISDA |
| **學術指導** | Dr. Kuen-Shiou Yang (楊坤修博士) |

---

*Last Updated: 2026-05-23 | Version: 8.5.1-Alpha | OmniHermes + ESG Go + BlueCC Active*
