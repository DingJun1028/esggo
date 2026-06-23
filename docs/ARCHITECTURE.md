# ESGGO 最佳實踐目錄布局

> 基於 OmniCore Constitution、5T 協議與視覺設計規範的層次化領域驅動架構

## 目錄結構

```
esggo/
├─ src/                         # 應用程式源碼 (TypeScript / React)
│   ├─ core/                    # 核心領域服務（純業務邏輯）
│   │   ├─ services/            # 應用級服務（OmniSpace, MemorySanctuary）
│   │   ├─ repositories/        # 資料存取抽象層（evidence.repository.ts）
│   │   └─ utils/               # 可重用輔助工具、守衛、加密證明
│   ├─ server/                  # Next.js API / 伺服器端程式碼
│   │   ├─ memory/              # OmniMemorySync, 記憶體快取
│   │   ├─ services/            # 伺服器端服務實作
│   │   └─ routes/              # API 路由處理器（app/api/...）
│   ├─ components/               # UI 層（React 元件）
│   │   ├─ providers/            # Context 提供者
│   │   ├─ ui/                   # 原子 UI 元件（Button, Toggle, Card）
│   │   ├─ layout/               # 佈局元件（Header, Sidebar, Footer）
│   │   ├─ pages/                # 頁面級元件（Dashboard, ReportBuilder）
│   │   └─ design-system/        # Design system token 包裝
│   └─ lib/                      # 共享函式庫
│       ├─ design-system/        # Design system 定義
│       │   ├─ tokens/           # HSL 色板、間距、圓角
│       │   ├─ themes/           # Light / Dark theme
│       │   └─ utils.ts          # cn utility, theme switcher
│       └─ atomic/               # 核心原子元件
├─ public/                       # 靜態資源
├─ styles/                       # 全域 CSS
├─ config/                       # 環境配置
│   ├─ firebase/
│   ├─ supabase/
│   └─ design-system/
├─ scripts/                      # 建置 / 部署 / 維護腳本
│   ├─ vps/                      # VPS 相關腳本
│   └─ ci/                       # CI/CD 輔助
├─ .github/                      # GitHub Actions
├─ docs/                         # 架構決策記錄（ADR）
│   ├─ ADRs/
│   └─ design/
├─ tests/                        # 測試
│   ├─ unit/
│   └─ integration/
├─ .env*
├─ package.json
├─ tsconfig.json
└─ README.md
```

## 5T 合規檢查清單

| 5T | 檢查項目 | 位置 |
|----|---------|------|
| Tangible | UI 元件使用 bg-gradient, glass-morphism、微動畫 | src/lib/design-system/themes/ |
| Traceable | 每個原子、Provider、服務都有 uuid、source_origin | src/lib/atomic/, components/providers/ |
| Trackable | 所有變更走 Git, ADR, OmniVault 記錄 | docs/ADRs/ |
| Transparent | 設定檔、API 金鑰、Hash-lock 均有審計日誌 | config/ |
| Trustworthy | crypto-proof.ts 產生 SHA-256 鎖 | src/lib/crypto-proof.ts |

## Provider 建議

| Provider | 責任 | 位置 |
|----------|------|------|
| QueryProvider | TanStack Query Client | components/providers/QueryProvider.tsx |
| AuthProvider | Firebase/Supabase Auth | components/providers/AuthProvider.tsx |
| ThemeProvider | Design system theme | components/providers/ThemeProvider.tsx |
| MemorySyncProvider | 前後端 memory snapshot 同步 | components/providers/MemorySyncProvider.tsx |

## 部署腳本位置

`scripts/vps/deploy-omni.sh`

---
**版本**: v8.5.1 (OmniCore Matrix Evolved)
**更新**: 2026-06-23
