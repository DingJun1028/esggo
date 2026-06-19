# Anti-gravity Design System
# 反重力設計系統

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

一個遵循 Anti-gravity 設計原則的高保真、響應式 Web 界面設計系統，專注於輕量化、浮動美學和現代 UI/UX 最佳實踐。

A high-fidelity, responsive web interface design system that strictly adheres to Anti-gravity design principles, focusing on lightweight, floating aesthetics, and modern UI/UX best practices.

## ✨ 特性

### 🎨 Anti-gravity 設計原則

- **輕量化 (Lightweight)**: 最小化視覺重量，使用透明度和模糊效果
- **浮動感 (Floating)**: 元素懸浮在空間中，使用陰影和層次創造深度
- **流動性 (Fluidity)**: 流暢的動畫和過渡，自然的交互反饋
- **呼吸空間 (Breathing Space)**: 充足的留白，合理的間距，清晰的視覺層次

### 🔧 核心功能

- **三元一體數據結構 (Trinity Data Structure)**: Start-End Matrix 實現數據層、邏輯層、展示層的分離
- **UUID 顯示系統**: 支持多種顯示模式和複製功能
- **響應式布局系統**: 完整的響應式布局組件
- **雙向數據綁定**: 嚴格的類型安全和驗證
- **雙語支持**: 繁體中文和英文
- **Google Stitch MCP 集成**: 完整的集成層支持

### 📱 響應式設計

- 6 個響應式斷點 (xs, sm, md, lg, xl, 2xl)
- 自適應布局系統
- 移動端優化

### ♿ 可訪問性

- WCAG 2.1 AA 標準
- 鍵盤導航支持
- 屏幕閱讀器支持
- 高對比度模式支持
- 減少動畫模式支持

## 🚀 快速開始

### 安裝

```bash
npm install
```

### 運行開發服務器

```bash
npm run dev
```

### 查看演示頁面

訪問 `http://localhost:5173/demo/antigravity`

## 📦 組件庫

### UI 組件

#### UUIDDisplay

UUID 顯示組件，支持多種顯示模式和複製功能。

```tsx
import { UUIDDisplay } from '@/components/ui/UUIDDisplay';

<UUIDDisplay
  uuid="550e8400-e29b-41d4-a716-446655440000"
  mode="full"
  showLabel={true}
  language="zh-TW"
/>
```

**變體**:
- `UUIDDisplay`: 基礎 UUID 顯示
- `UUIDCard`: 卡片式 UUID 顯示
- `UUIDList`: 列表式 UUID 顯示

**顯示模式**:
- `full`: 完整 UUID 顯示
- `short`: 簡短 UUID 顯示
- `compact`: 緊湊 UUID 顯示

### 布局組件

#### AntiGravityLayout

響應式布局組件，支持多種布局模式。

```tsx
import { AntiGravityLayout, AntiGravityGrid, AntiGravityFlex } from '@/components/layout/AntiGravityLayout';

<AntiGravityGrid
  columns={3}
  responsiveColumns={{ sm: 1, md: 2, lg: 3 }}
  gap={3}
>
  {/* 內容 */}
</AntiGravityGrid>
```

**組件**:
- `AntiGravityLayout`: 基礎布局容器
- `AntiGravityGrid`: 網格布局
- `AntiGravityFlex`: 彈性布局
- `AntiGravityContainer`: 容器組件
- `AntiGravitySection`: 區塊組件

### 數據綁定組件

#### TwoWayBinding

雙向數據綁定組件，支持多種輸入類型和驗證。

```tsx
import { TwoWayBinding, useTwoWayBinding } from '@/components/data-binding/TwoWayBinding';

const nameBinding = useTwoWayBinding({
  initialValue: '',
  required: true,
  validateOnChange: true,
  validator: (value) => {
    if (value.length < 2) {
      return '名稱至少需要 2 個字符';
    }
    return null;
  },
});

<TwoWayBinding
  type="text"
  label="名稱"
  placeholder="請輸入您的名稱"
  binding={nameBinding}
  language="zh-TW"
/>
```

**支持的輸入類型**:
- `text`: 文本輸入
- `number`: 數字輸入
- `email`: 電子郵件輸入
- `select`: 下拉選擇
- `checkbox`: 複選框
- `switch`: 開關
- `slider`: 滑塊
- `textarea`: 多行文本

## 🎯 核心模組

### Start-End Matrix

三元一體數據結構，實現數據層、邏輯層、展示層的分離。

```tsx
import { StartEndMatrixBuilder, StartEndMatrixExecutor } from '@/core';

const matrix = new StartEndMatrixBuilder<string, string>()
  .setName('數據處理流程')
  .setDescription('三元一體數據結構示例')
  .withStart('用戶輸入數據')
  .withMatrixNode('validate', '驗證數據', [])
  .withMatrixNode('transform', '轉換數據格式', [])
  .withEnd('輸出結果', [])
  .build();

const executor = new StartEndMatrixExecutor<string, string>();
const result = await executor.execute(matrix);
```

### UUID 類型系統

嚴格的 UUID 類型系統，提供驗證和格式化功能。

```tsx
import { UUID, UUIDUtil } from '@/core';

// 生成 UUID
const uuid: UUID = UUIDUtil.generate();

// 驗證 UUID
const isValid = UUIDUtil.isValid('550e8400-e29b-41d4-a716-446655440000');

// 格式化 UUID
const formatted = UUIDUtil.format('550e8400e29b41d4a716446655440000');
```

### Google Stitch MCP 集成

完整的 Google Stitch MCP 集成層。

```tsx
import { GoogleStitchClient, GoogleStitchClientFactory } from '@/integrations/google-stitch';

const client = GoogleStitchClientFactory.create({
  apiKey: 'your-api-key',
  projectId: 'your-project-id',
  region: 'us-central1',
});

const response = await client.get('/endpoint', { param: 'value' });
```

## 🌐 國際化

支持繁體中文和英文。

```tsx
import { tExtended } from '@/i18n/translations-extended';

const title = tExtended('antigravity.title', 'zh-TW');
const subtitle = tExtended('antigravity.subtitle', 'en');
```

## 📚 文檔

- [設計系統文檔](./ANTI_GRAVITY_DESIGN_SYSTEM.md)
- [快速開始指南](./ANTI_GRAVITY_QUICK_START.md)
- [項目結構文檔](./ANTI_GRAVITY_PROJECT_STRUCTURE.md)

## 🎨 設計令牌

### 顏色

```css
--ag-primary: #63A2B0;
--ag-primary-light: #8BC4D0;
--ag-primary-dark: #4A7A85;
--ag-secondary: #7B68EE;
--accent: #FF6B9D;
```

### 間距

```css
--ag-spacing-1: 8px;
--ag-spacing-2: 16px;
--ag-spacing-3: 24px;
--ag-spacing-4: 32px;
--ag-spacing-5: 40px;
```

### 陰影

```css
--ag-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
--ag-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
--ag-shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.16);
```

### 動畫

```css
--ag-duration-fast: 0.2s;
--ag-duration-normal: 0.3s;
--ag-duration-slow: 0.5s;
--ag-easing: cubic-bezier(0.4, 0, 0.2, 1);
```

## 📱 響應式斷點

| 斷點名稱 | 最小寬度 | 設備類型 |
|---------|---------|---------|
| xs      | 0px     | 手機 |
| sm      | 600px   | 平板 |
| md      | 900px   | 小型桌面 |
| lg      | 1200px  | 桌面 |
| xl      | 1440px  | 大型桌面 |
| 2xl     | 1920px  | 超大屏幕 |

## 🔧 技術棧

- **框架**: React 18+
- **語言**: TypeScript (Strict Mode)
- **UI 庫**: Material-UI (MUI)
- **樣式**: CSS-in-JS + CSS Modules
- **國際化**: 自定義 i18n 系統
- **集成**: Google Stitch MCP

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 許可證

MIT License

## 📧 聯繫方式

如有問題或建議，請通過以下方式聯繫：

- 提交 Issue
- 發送 Pull Request

---

**Anti-gravity Design System** - 讓您的界面輕盈起來！
