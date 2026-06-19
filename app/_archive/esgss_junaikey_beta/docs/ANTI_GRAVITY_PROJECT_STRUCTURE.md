# Anti-gravity Design System - Project Structure
# 反重力設計系統 - 項目結構

## 📁 項目結構

```
esgss_junaikey_beta/
├── src/
│   ├── core/                                    # 核心模組
│   │   ├── data-structures/                     # 數據結構
│   │   │   └── StartEndMatrix.ts                # Start-End Matrix 三元一體數據結構
│   │   ├── design-tokens/                       # 設計令牌
│   │   │   ├── AntiGravityTokens.ts             # 設計令牌定義
│   │   │   └── AntiGravityStyles.css            # CSS 動畫和效果
│   │   └── index.ts                             # 核心模組導出
│   │
│   ├── components/                              # 組件庫
│   │   ├── ui/                                  # UI 組件
│   │   │   └── UUIDDisplay/                     # UUID 顯示組件
│   │   │       ├── UUIDDisplay.tsx              # UUID 顯示組件
│   │   │       └── UUIDDisplay.css              # UUID 顯示樣式
│   │   │
│   │   ├── layout/                              # 布局組件
│   │   │   └── AntiGravityLayout/               # 反重力布局組件
│   │   │       ├── AntiGravityLayout.tsx        # 布局組件
│   │   │       └── AntiGravityLayout.css        # 布局樣式
│   │   │
│   │   ├── data-binding/                        # 數據綁定組件
│   │   │   └── TwoWayBinding/                   # 雙向數據綁定組件
│   │   │       ├── TwoWayBinding.tsx            # 雙向綁定組件
│   │   │       └── TwoWayBinding.css            # 雙向綁定樣式
│   │   │
│   │   ├── examples/                            # 組件示例
│   │   │   ├── ComponentExamples.tsx            # 組件使用示例
│   │   │   └── ComponentExamples.css            # 示例樣式
│   │   │
│   │   └── index.ts                             # 組件導出
│   │
│   ├── pages/                                   # 頁面
│   │   └── demo/                                # 演示頁面
│   │       ├── AntiGravityDemoPage.tsx          # 反重力設計系統演示頁面
│   │       └── AntiGravityDemoPage.css          # 演示頁面樣式
│   │
│   ├── i18n/                                    # 國際化
│   │   └── translations-extended.ts             # 擴展翻譯文件
│   │
│   ├── integrations/                            # 集成層
│   │   ├── google-stitch/                       # Google Stitch MCP 集成
│   │   │   ├── GoogleStitchIntegration.ts       # Google Stitch 集成
│   │   │   └── index.ts                         # Google Stitch 導出
│   │   └── index.ts                             # 集成層導出
│   │
│   └── styles/                                  # 全局樣式
│       └── AntiGravityGlobal.css                # 全局 CSS 變量和工具類
│
└── docs/                                        # 文檔
    ├── ANTI_GRAVITY_DESIGN_SYSTEM.md            # 設計系統文檔
    ├── ANTI_GRAVITY_QUICK_START.md              # 快速開始指南
    └── ANTI_GRAVITY_PROJECT_STRUCTURE.md        # 項目結構文檔
```

## 📦 模組說明

### 1. 核心模組 (core/)

#### 1.1 數據結構 (data-structures/)

**StartEndMatrix.ts**
- 實現三元一體數據結構（Start-End Matrix）
- 包含 UUID 類型系統
- 提供構建器模式和執行器模式
- 支持數據層、邏輯層、展示層的處理

#### 1.2 設計令牌 (design-tokens/)

**AntiGravityTokens.ts**
- 定義所有設計令牌
- 包含顏色、陰影、間距、邊框半徑、動畫、透明度、模糊、斷點、z-index、字體大小等
- 提供響應式斷點定義

**AntiGravityStyles.css**
- 定義所有 CSS 動畫和效果
- 包含浮動、脈衝、旋轉、淡入淡出、縮放、彈跳、閃爍、發光等動畫
- 支持玻璃態效果

### 2. 組件庫 (components/)

#### 2.1 UI 組件 (ui/)

**UUIDDisplay/**
- UUID 顯示組件
- 支持三種變體：UUIDDisplay、UUIDCard、UUIDList
- 支持三種顯示模式：full、short、compact
- 支持複製功能
- 支持雙語顯示

#### 2.2 布局組件 (layout/)

**AntiGravityLayout/**
- 響應式布局組件
- 包含 AntiGravityLayout、AntiGravityGrid、AntiGravityFlex、AntiGravityContainer、AntiGravitySection
- 支持響應式列數
- 支持浮動效果
- 支持玻璃態背景

#### 2.3 數據綁定組件 (data-binding/)

**TwoWayBinding/**
- 雙向數據綁定組件
- 支持多種輸入類型：text、number、email、select、checkbox、switch、slider、textarea
- 支持驗證
- 支持錯誤提示
- 支持雙語顯示

#### 2.4 組件示例 (examples/)

**ComponentExamples/**
- 展示如何組合使用所有組件
- 包含用戶資料卡片、產品列表、註冊表單、數據處理流程、完整頁面等示例

### 3. 頁面 (pages/)

#### 3.1 演示頁面 (demo/)

**AntiGravityDemoPage/**
- 完整的演示頁面
- 展示所有組件的功能
- 支持標籤頁導航
- 支持實時語言切換

### 4. 國際化 (i18n/)

**translations-extended.ts**
- 擴展翻譯文件
- 支持繁體中文和英文
- 包含所有新組件的翻譯

### 5. 集成層 (integrations/)

#### 5.1 Google Stitch MCP 集成 (google-stitch/)

**GoogleStitchIntegration.ts**
- Google Stitch MCP 客戶端
- 支持所有 HTTP 方法
- 支持事件監聽
- 支持請求隊列
- 支持超時處理

### 6. 全局樣式 (styles/)

**AntiGravityGlobal.css**
- 全局 CSS 變量
- 工具類
- 基礎樣式
- 響應式樣式
- 深色模式支持

## 🎨 設計原則

### Anti-gravity 設計原則

1. **輕量化 (Lightweight)**
   - 最小化視覺重量
   - 使用透明度和模糊效果
   - 減少不必要的裝飾

2. **浮動感 (Floating)**
   - 元素懸浮在空間中
   - 使用陰影和層次創造深度
   - 柔和的動畫過渡

3. **流動性 (Fluidity)**
   - 流暢的動畫和過渡
   - 自然的交互反饋
   - 響應式布局

4. **呼吸空間 (Breathing Space)**
   - 充足的留白
   - 合理的間距
   - 清晰的視覺層次

### 三元一體設計概念 (Trinity Design Concept)

1. **數據層 (Data Layer - Start)**
   - 數據的來源和存儲
   - 數據結構定義
   - 數據驗證

2. **邏輯層 (Logic Layer - Matrix)**
   - 數據處理和轉換
   - 業務邏輯實現
   - 數據流控制

3. **展示層 (Presentation Layer - End)**
   - 用戶界面展示
   - 交互邏輯
   - 視覺反饋

## 🔧 技術棧

- **框架**: React 18+
- **語言**: TypeScript (Strict Mode)
- **UI 庫**: Material-UI (MUI)
- **樣式**: CSS-in-JS + CSS Modules
- **國際化**: 自定義 i18n 系統
- **集成**: Google Stitch MCP

## 📱 響應式斷點

| 斷點名稱 | 最小寬度 | 設備類型 |
|---------|---------|---------|
| xs      | 0px     | 手機 |
| sm      | 600px   | 平板 |
| md      | 900px   | 小型桌面 |
| lg      | 1200px  | 桌面 |
| xl      | 1440px  | 大型桌面 |
| 2xl     | 1920px  | 超大屏幕 |

## 🌐 國際化支持

- **繁體中文 (zh-TW)**: 主要語言
- **English (en)**: 次要語言

## ♿ 可訪問性

- WCAG 2.1 AA 標準
- 鍵盤導航支持
- 屏幕閱讀器支持
- 高對比度模式支持
- 減少動畫模式支持

## 🚀 快速開始

### 安裝依賴

```bash
npm install
```

### 運行開發服務器

```bash
npm run dev
```

### 查看演示頁面

訪問 `http://localhost:5173/demo/antigravity`

## 📚 文檔

- [設計系統文檔](./ANTI_GRAVITY_DESIGN_SYSTEM.md)
- [快速開始指南](./ANTI_GRAVITY_QUICK_START.md)
- [項目結構文檔](./ANTI_GRAVITY_PROJECT_STRUCTURE.md)

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 許可證

MIT License
