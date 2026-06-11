---
uuid: "OOM-CORE-999X-V11"
version: "V1.1.0"
timestamp: 1780971805268
evidence: "OMNICOMPONENT_DESIGN_SYSTEM_v1.1.md"
rules: ["Hash Lock Active", "Object.freeze()", "Zero-Hallucination"]
---

# 🏛️ ESGGO OmniComponent Library/Design System v1.1
## "ESGGO Classic 善向永續 經典版"

> **Platform:** ESGGO OmniTerminal | **Version:** v1.1 | **Theme:** ESGGO Classic  
> **核心禁區安全鎖定:** Trustworthy (OOM-CORE-999X-V11)

---

## 🏗️ 全域 Design Tokens 與 22 類元件狀態矩陣 DSL 刻印

### 1.1 萬能元件心核與全域 Tokens 容器

```typescript
// =========================================================================
// OMNIDEC_START: ESGGO Omni Design System V1.1.0 (ESGGO Classic 善向永續 經典版)
// =========================================================================

const OmniDesignSystem_Core = {
  type: "frame",
  name: "OmniDesignSystem_Tokens_V1.1.0",
  layout: "vertical",
  gap: 24,
  visible: true,
  frozen: true // Trustworthy lock
};

Object.freeze(OmniDesignSystem_Core);
```

### 1.2 OmniiTheme 三版本動態色彩矩陣（語義化綁定）

| Token | Light Value | Dark Value | 用途 |
|-------|-------------|------------|------|
| **Primary** | `#059669` (Emerald 600) | `#34D399` (Emerald 400) | 主品牌色 |
| **Background** | `#F8FAFC` (Slate 50) | `#020617` (Void) | 主背景 |
| **Surface** | `rgba(255,255,255,0.7)` | `rgba(30,41,59,0.7)` | 液態玻璃 |
| **Text Primary** | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) | 主文字 |
| **Error** | `#E11D48` (Rose 600) | `#F43F5E` (Rose 500) | 錯誤狀態 |

---

## 2. 22 類元件狀態矩陣 DSL

### 2.1 原子組件母體與 10 狀態流 (Button 為例)

```typescript
const Button_Master = {
  type: "frame",
  name: "Component/Button_Master",
  reusable: true,
  layout: "horizontal",
  padding: 16,
  gap: 8,
  fill: DynamicColors.primary
};
Insert(Button_Master, { type: "text", name: "Label", fontSize: 14, content: "永續提交" });

// 狀態覆寫矩陣
const ComponentStateMatrix = {
  Default: { fill: "var(--theme-primary)", state: "idle" },
  Hover: { fill: "rgba(5, 150, 105, 0.85)", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" },
  Focus: { outline: "2px solid #FDB515", outlineOffset: "2px" },
  Active: { transform: "scale(0.95)", brightness: "0.95" },
  Disabled: { opacity: "0.4", cursor: "not-allowed" },
  Loading: { opacity: "0.7", cursor: "wait", spinner: true },
  Error: { fill: "var(--theme-error)", shake: "200ms" },
  Success: { fill: "var(--theme-success)", checkmark: true },
  Expanded: { width: "auto", maxHeight: "500px" },
  Collapsed: { width: "44px", height: "44px" }
};
```

### 2.2 22 類核心原子組件矩陣外殼

| 編號 | 組件 | 母體 | 狀態數 |
|------|------|------|--------|
| 01 | Button | ✅ | 10 |
| 02 | Input | ✅ | 10 |
| 03 | Select | ✅ | 10 |
| 04 | Checkbox | ✅ | 10 |
| 05 | Radio | ✅ | 10 |
| 06 | Toggle | ✅ | 10 |
| 07 | Badge | ✅ | 10 |
| 08 | Icon | ✅ | 10 |
| 09 | Card | ✅ | 10 |
| 10 | Modal | ✅ | 10 |
| 11 | Tooltip | ✅ | 10 |
| 12 | Toast | ✅ | 10 |
| 13 | Breadcrumb | ✅ | 10 |
| 14 | Table | ✅ | 10 |
| 15 | Tabs | ✅ | 10 |
| 16 | Accordion | ✅ | 10 |
| 17 | Avatar | ✅ | 10 |
| 18 | Progress | ✅ | 10 |
| 19 | Skeleton | ✅ | 10 |
| 20 | Spinner | ✅ | 10 |
| 21 | Divider | ✅ | 10 |
| 22 | Link | ✅ | 10 |

---

## 3. 核心攻堅：ESG & AI 9 大專屬永續模組部署

### 3.1 全域 RWD 主畫布骨架

```typescript
const AppShell_RWD = {
  type: "frame",
  name: "ESGGO_AppShell_RWD",
  layout: "horizontal",
  width: "fill_container",
  height: "fill_container",
  fill: DynamicColors.background
};
```

### 3.2 9 大永續核心模組 (依艾森豪矩険優先級)

| 優先級 | 模組 | 說明 | 5T 覆蓋 |
|--------|------|------|---------|
| A | Carbon Dashboard | 碳盤查看板 | Trackable |
| B | AI ESG Assistant | AI 驗算助手 | Transparent + Tangible |
| C | SDGs Matrix | SDGs 矩陣 | Tangible |
| D | Governance Audit | 治理審計 | Trustworthy + Traceable |
| E | Evidence Vault | 證據金庫 | Trustworthy |
| F | Stakeholder Map | 利害關係人 | Tangible |
| G | Report Generator | 報告產生器 | Transparent |
| H | Compliance Matrix | 合規矩陣 | T1-T5 完整覆蓋 |
| I | Risk Heatmap | 風險熱點圖 | Transparent + Trackable |

---

## 4. 優先級 A 模組：Carbon Dashboard & Sustainability KPI

```typescript
const CarbonDashboard_Module = {
  type: "frame",
  name: "Module_CarbonDashboard",
  layout: "horizontal",
  gap: 16
};

// ESG Widget - 碳排放指標卡
const CarbonKPI_Widget = {
  type: "frame",
  name: "ESG_Widget_CarbonKPI",
  width: 320,
  padding: 20,
  fill: DynamicColors.surface,
  borderRadius: 12
};
```

### 4.1 碳排放指標卡 (Scope 1-3)

| 指標 | 公式 | 來源 |
|------|------|------|
| Scope 1 | 直接排放 | 設備數據 |
| Scope 2 | 間接排放 | 電費數據 |
| Scope 3 | 價值鏈排放 | 供應商數據 |
| **算法公開** | `Total = ∑ (Activity × Factor)` | ✅ 透明驗算 |

---

## 5. 優先級 B 模組：AI ESG Assistant & SDGs Matrix

```typescript
const AIEsgAssistant_Module = {
  type: "frame",
  name: "Module_AI_ESG_Assistant",
  layout: "vertical",
  padding: 20,
  fill: "rgba(15, 23, 42, 0.03)",
  borderRadius: 12
};
```

### 5.1 AI 驗算助手

| 功能 | 說明 | 規範 |
|------|------|------|
| 算法公開 | `Total_Emissions = ∑ (Activity_Data × Emission_Factor)` | ✅ |
| 零幻覺驗算 | 標註規範 `[ISO-14064-1]` | ✅ |
| 即時回饋 | 語音/文字回覆 | Tangible |

---

## 6. Design Tokens 與 Storybook 100% 映射矩険

```json
{
  "design_tokens": {
    "colors": {
      "primary": { "pencil": "$primary", "storybook": "var(--esggo-primary)", "value": "#059669" },
      "surface": { "pencil": "$surface", "storybook": "var(--esggo-surface)", "value": "rgba(255,255,255,0.7)" }
    },
    "typography": {
      "h1": { "pencil": "fontSize: 32", "storybook": "var(--font-size-h1)" },
      "label": { "pencil": "textGrowth: 'auto'", "storybook": "var(--font-size-label)" }
    }
  }
}
```

---

### 1.1 MECE 元件分類 (Mutually Exclusive, Collectively Exhaustive)

| 分類 | 描述 | 範例 |
|------|------|------|
| **Atom (原子元件)** | 不可再分割的基礎 UI 單元 | Button, Icon, Badge, Input, Label |
| **Molecule (分子元件)** | 由多個原子組成的功能單元 | SearchBox, KPICard, FormField, Breadcrumb |
| **Organism (組織元件)** | 由分子組成的複雜區塊 | NavigationBar, DataTable, Modal, CardGrid |
| **Template (模板元件)** | 定義頁面佈局的骨架 | PageLayout, SectionLayout, DashboardGrid |

### 1.2 5T + 1 維度整合 (Integrated 5T + 1 Dimensions)

| 維度 | 視覺化實現 | 元件應用 |
|------|-----------|---------|
| **Tangible (可感知)** | 具體化指標視覺 | KPI 數值顯示、進度條 |
| **Traceable (可溯源)** | source_origin 鏈式日誌 | Hash Lock、資料溯源標籤 |
| **Trackable (可追蹤)** | 生命週期 Hook 紀錄 | 狀態變更動畫、生命週期指示 |
| **Transparent (可驗算)** | 公開算法公式 | 運算公式彈窗、計算步驟顯示 |
| **Trustworthy (不可篡改)** | Hash Lock 封印 | 封印完成狀態、校驗標記 |
| **OmniiTheme (萬能主題)** | 動態主題切換 | Light/Dark/System 模式支援 |

---

## 2. OmniiTheme 色彩系統 (OmniiTheme Color System)

### 2.1 主題定義

```typescript
// themes/omniTheme.ts
export type ThemeMode = 'light' | 'dark' | 'system';

export interface OmniTheme {
  name: string;
  mode: ThemeMode;
  colors: {
    // Base colors
    background: {
      primary: string;    // 主背景
      secondary: string;  // 次背景
      tertiary: string;   // 三級背景
      elevated: string;   // 浮起層背景
      overlay: string;    // 覆蓋層背景
    };
    // Text colors
    text: {
      primary: string;    // 主文字
      secondary: string;  // 次文字
      muted: string;      // 柔文字
      disabled: string;   // 禁用文字
      inverse: string;    // 反白文字
    };
    // Brand colors
    brand: {
      primary: string;    // 主品牌色
      accent: string;     // 強調色
      secondary: string; // 輔助色
    };
    // Status colors
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    // Semantic colors
    surface: {
      glass: string;
      border: string;
      divider: string;
    };
  };
}
```

### 2.2 Light Theme (ESGGO Classic Light)

| Token | 色值 | 用途 |
|-------|------|------|
| `--theme-bg-primary` | `#FFFFFF` | 主背景 |
| `--theme-bg-secondary` | `#F8F9FA` | 次背景 |
| `--theme-bg-tertiary` | `#F1F5F9` | 三級背景 |
| `--theme-bg-elevated` | `rgba(255, 255, 255, 0.85)` | 浮起層 |
| `--theme-text-primary` | `#0F172A` | 主文字 |
| `--theme-text-secondary` | `#334155` | 次文字 |
| `--theme-text-muted` | `#64748B` | 柔文字 |
| `--theme-primary` | `#003262` | 主品牌 (Berkeley Blue) |
| `--theme-primary-hover` | `#1A3A5C` | 主品牌懸停 |
| `--theme-accent` | `#FDB515` | 強調色 (California Gold) |
| `--theme-border` | `#E2E8F0` | 邊框色 |

### 2.3 Dark Theme (ESGGO Classic Dark)

| Token | 色值 | 用途 |
|-------|------|------|
| `--theme-bg-primary` | `#020617` | 主背景 (Void) |
| `--theme-bg-secondary` | `#0A0F1E` | 次背景 |
| `--theme-bg-tertiary` | `#1E293B` | 三級背景 |
| `--theme-bg-elevated` | `rgba(30, 41, 59, 0.85)` | 浮起層 |
| `--theme-text-primary` | `#F8FAFC` | 主文字 |
| `--theme-text-secondary` | `#CBD5E1` | 次文字 |
| `--theme-text-muted` | `#64748B` | 柔文字 |
| `--theme-primary` | `#FDB515` | 主品牌 (Gold) |
| `--theme-primary-hover` | `#FCC136` | 主品牌懸停 |
| `--theme-accent` | `#3B7EA1` | 強調色 (Founders Rock) |
| `--theme-border` | `#334155` | 邊框色 |

### 2.4 System Theme (跟隨系統)

```css
@media (prefers-color-scheme: dark) {
  :root {
    /* Apply dark theme variables */
  }
}
@media (prefers-color-scheme: light) {
  :root {
    /* Apply light theme variables */
  }
}
```

---

## 3. 間距系統 (Spacing System)

### 3.1 8px Base Grid System

| Token | 值 | 用途 |
|-------|-----|------|
| `spacing-1` | `4px` | 元素內部微間距 |
| `spacing-2` | `8px` | 緊密相關元素 |
| `spacing-3` | `12px` | 元件內部間距 |
| `spacing-4` | `16px` | 元件間標準間距 |
| `spacing-5` | `20px` | 次要區塊間距 |
| `spacing-6` | `24px` | 區塊標準間距 |
| `spacing-8` | `32px` | 大區塊分隔 |
| `spacing-12` | `48px` | 頁面區段分隔 |
| `spacing-16` | `64px` | 頁面大區段 |

---

## 4. 元件詳細規範 (Component Specifications)

### 4.1 Atom 原子元件

#### 4.1.1 OmniButton (萬能按鈕)

**屬性定義:**
```typescript
interface OmniButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'glass';
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'icon';
  state?: 'default' | 'hover' | 'active' | 'disabled' | 'loading' | 'error';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  onClick?: () => void;
  loadingText?: string;
}
```

**視覺規範:**

| 狀態 | Light Theme | Dark Theme |
|------|-----------|----------|
| **Default** | bg: `#003262`, text: `#FDB515` | bg: `#FDB515`, text: `#003262` |
| **Hover** | translateY(-1px), shadow: lg | translateY(-1px), shadow: lg |
| **Active** | translateY(0), brightness(0.95) | translateY(0), brightness(0.95) |
| **Disabled** | opacity: 0.4, cursor: not-allowed | opacity: 0.4, cursor: not-allowed |
| **Loading** | Spinner + 文字 | Spinner + 文字 |

**尺寸規範:**

| 尺寸 | Padding | FontSize | 最小高度 |
|------|---------|----------|----------|
| XL | 16px 32px | 16px | 56px |
| LG | 12px 24px | 14px | 48px |
| MD | 8px 16px | 14px | 44px |
| SM | 6px 12px | 12px | 36px |
| XS | 4px 8px | 12px | 28px |
| Icon | 8px | — | 44px |

#### 4.1.2 OmniInput (萬能輸入框)

```typescript
interface OmniInputProps {
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'lg' | 'md' | 'sm';
  state?: 'default' | 'hover' | 'focus' | 'error' | 'disabled';
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;
}
```

**狀態視覺:**

| 狀態 | 邊框 | 陰影 |
|------|------|------|
| Default | 1px solid `#E2E8F0` | — |
| Hover | 1px solid `#CBD5E1` | — |
| Focus | 2px solid `#003262` | `0 0 0 3px rgba(0,50,98,0.15)` |
| Error | 2px solid `#EF4444` | `0 0 0 3px rgba(239,68,68,0.15)` |
| Disabled | 1px solid `#E2E8F0` | — |

**尺寸規範:**

| 尺寸 | 高度 | FontSize |
|------|------|----------|
| LG | 48px | 16px |
| MD | 44px | 14px |
| SM | 36px | 12px |

#### 4.1.3 OmniBadge (萬能徽章)

```typescript
interface OmniBadgeProps {
  variant?: 'default' | 't1' | 't2' | 't3' | 't4' | 't5' | 'verified' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'rounded' | 'pill' | 'square';
}
```

**5T 徽章色彩:**

| 類型 | 背景 | 文字色 | 用途 |
|------|------|--------|------|
| T1 Tangible | `rgba(16,185,129,0.1)` | `#10B981` | 可感知指標 |
| T2 Traceable | `rgba(59,126,161,0.1)` | `#3B7EA1` | 可溯源日誌 |
| T3 Trackable | `rgba(139,92,246,0.1)` | `#8B5CF6` | 可追蹤生命週期 |
| T4 Transparent | `rgba(245,158,11,0.1)` | `#F59E0B` | 可透明驗算 |
| T5 Trustworthy | `rgba(0,50,98,0.15)` | `#003262` | 不可篡改封印 |

#### 4.1.4 OmniCard (萬能卡片)

```typescript
interface OmniCardProps {
  variant?: 'default' | 'glass' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  selected?: boolean;
  loading?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}
```

**視覺規格:**

| 元素 | Light | Dark |
|------|-------|------|
| **Glass** | rgba(255,255,255,0.7) bg | rgba(30,41,59,0.7) bg |
| **Hover** | translateY(-2px) + shadow-lg | translateY(-2px) + shadow-xl |
| **Selected** | ring-2 ring-theme-primary | ring-2 ring-theme-primary |
| **Loading** | pulse skeleton | pulse skeleton |

---

### 4.2 Molecule 分子元件

#### 4.2.1 OmniKPICard (KPI 指標卡片)

**結構:**

```
┌─────────────────────────────────────┐
│ [Icon]  KPI Title           [Badge]  │
│                                     │
│    8,246.5                        │
│    ┌─────────────────┐            │
│    │ ▲ 12.5%         │            │
│    └─────────────────┘            │
│                                     │
│ GRI 305-1 • 来源: ERP系統         │
└─────────────────────────────────────┘
```

**樣式規格:**

| 元素 | 屬性 |
|------|------|
| 容器 | `120px min-height`, `16px padding`, `border-radius: 16px` |
| 圖示 | `40×40px`, `border-radius: 10px` |
| 數值 | JetBrains Mono, `32px`, `font-weight: 700` |
| 單位 | `14px Regular`, `#64748B` |
| 趨勢 | 綠色 `#10B981` (上升) / 紅色 `#EF4444` (下降) |
| 標籤 | `12px Uppercase Bold`, `#64748B` |

#### 4.2.2 OmniFormField (表單欄位)

**結構:**

```
Label
[Input/Switch/Checkbox]
Helper Text / Error Text
```

**組成:** Label + Input + Helper/Error + Animation

---

### 4.3 Organism 組織元件

#### 4.3.1 OmniNavigationBar (導航欄)

**桌面版結構:**

```
┌─────────────────────────────────────────────────────────┐
│ Logo      控制台 永續撰寫 數據 報告 ...      [UserMenu] │
└─────────────────────────────────────────────────────────┘
```

**行動版結構:**

```
┌─────────────────────────────────┐
│ [Menu]  ESGGO              [User] │
└─────────────────────────────────┘
底部導航列 (5 items + More)
```

**狀態視覺:**

| 狀態 | 屬性 |
|------|------|
| Default | 背景透明, 高度 64px |
| Scrolled | 背景 `rgba(255,255,255,0.8)`, 陰影 md |
| Mobile | 高度 56px, 底部導航固定 |

#### 4.3.2 OmniModal (彈窗)

**尺寸規範:**

| 尺寸 | 寬度 | 最大高度 |
|------|------|----------|
| Small | 400px | 80vh |
| Default | 600px | 85vh |
| Large | 800px | 90vh |
| Fullscreen (Mobile) | 100vw | 100vh |

**動畫規範:**
- 進入: `opacity: 0→1`, `scale: 0.95→1`, `250ms ease-out`
- 背景: `bg-overlay` 遮罩，`backdrop-filter: blur(4px)`

---

### 4.4 Template 模板元件

#### 4.4.1 OmniPageTemplate (頁面模板)

```typescript
interface OmniPageTemplateProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}
```

**布局規格:**

```
Sidebar (Desktop) | Main Content
  width: 280px    | padding: 24px
  width: 72px     | max-width: 1440px
```

---

## 5. 動效與互動 (Animation & Interaction)

### 5.1 過渡時間 (Durations)

| 場景 | 時間 | 緩動函數 |
|------|------|----------|
| 微互動 (Hover, Focus) | 150ms | ease-out |
| 元件展開/收合 | 200ms | ease-in-out |
| 頁面切換 | 300ms | cubic-bezier(0.4, 0, 0.2, 1) |
| 側邊欄展開 | 300ms | ease-in-out |
| Modal 開啟 | 250ms | ease-out |
| Toast 通知 | 200ms | ease-in-out |
| 5T 封印動畫 | 800ms — 2000ms | 分段動畫 |

### 5.2 互動狀態總覽

| 元素 | Hover | Focus | Active | Disabled |
|------|-------|-------|--------|----------|
| 按鈕 | translateY(-1px) + shadow | outline 2px gold | translateY(0) + brightness(0.95) | opacity 0.4 |
| 卡片 | translateY(-2px) + shadow | — | — | — |
| 輸入框 | border-color light | outline 2px primary + shadow | — | opacity 0.6 |

---

## 6. 字體層級系統 (Typography Scale)

### 6.1 字體家族

| 用途 | 字體 | 備用字體 |
|------|------|----------|
| 主要標題 | Inter | system-ui |
| 中文內容 | Noto Sans TC | PingFang TC |
| 數據/代碼 | JetBrains Mono | Consolas |
| 品牌 Logo | Inter Black | Arial Black |

### 6.2 字體比例尺

| 層級 | 尺寸 | 字重 | 行高 | 用途 |
|------|------|------|------|------|
| Display | 48px | 900 | 1.1 | 品牌大標 |
| H1 | 32px | 700 | 1.2 | 頁面主標 |
| H2 | 24px | 600 | 1.3 | 區塊標題 |
| H3 | 18px | 600 | 1.4 | 子標題 |
| H4 | 14px | 700 | 1.4 | 標籤標題 |
| Body L | 16px | 400 | 1.6 | 主文大 |
| Body | 14px | 400 | 1.5 | 一般內文 |
| Body S | 13px | 400 | 1.5 | 次要說明 |
| Caption | 12px | 400 | 1.4 | 提示、腳注 |
| Overline | 11px | 700 | 1.4 | 類別標記 |
| Mono | 13px | 500 | 1.4 | 數據字 |

---

## 7. 可及性規範 (Accessibility)

### 7.1 WCAG AA 標準

| 項目 | 標準 |
|------|------|
| 文字對比度 (一般) | ≥ 4.5:1 |
| 文字對比度 (大) | ≥ 3:1 |
| 觸控目標 | 最小 44×44px |
| 鍵盤導覽 | 全元件支援 Tab |
| 焦點指示器 | `outline: 2px solid #FDB515` |
| ARIA 標籤 | 所有互動元素具備 aria-label |
| 動效減少 | 支援 `prefers-reduced-motion` |

---

## 8. 響應式斷點 (Responsive Breakpoints)

| 名稱 | 範圍 | 佈局策略 |
|------|------|----------|
| Mobile XS | < 480px | 單欄、底部導覽 |
| Mobile | 480px — 767px | 單欄、底部導覽 |
| Tablet | 768px — 1023px | 雙欄、收合側邊欄 |
| Desktop | 1024px — 1279px | 12欄網格、側邊欄 |
| Desktop L | 1280px — 1535px | 側邊欄展開 |
| Desktop XL | ≥ 1536px | 最大寬度 1920px |

---

## 9. OmniComponent 實作範例 (Implementation Examples)

### 9.1 OmniButton 完整實作

```tsx
// components/ui/OmniButton.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const omniButtonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-theme-primary text-theme-accent hover:bg-theme-primary-hover focus:ring-theme-accent',
        secondary: 'bg-theme-accent text-theme-primary hover:opacity-90 focus:ring-theme-primary',
        ghost: 'bg-transparent text-theme-primary border border-theme-primary hover:bg-theme-primary/8',
        danger: 'bg-transparent text-lethal border border-lethal hover:bg-lethal/10',
        success: 'bg-success/10 text-success border border-success hover:bg-success/20',
        glass: 'bg-glass-surface text-theme-primary border border-glass-border backdrop-blur-md',
      },
      size: {
        xl: 'px-8 py-4 text-body-lg h-14',
        lg: 'px-6 py-3 text-body h-12',
        md: 'px-4 py-2 text-body h-11',
        sm: 'px-3 py-1.5 text-caption h-9',
        xs: 'px-2 py-1 text-caption-sm h-7',
        icon: 'p-2 h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface OmniButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof omniButtonVariants> {
  loading?: boolean;
  loadingText?: string;
}
```

### 9.2 OmniThemeProvider 主題提供者

```tsx
// components/theme/OmniThemeProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode } from '@/types/theme';

interface OmniThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const OmniThemeContext = createContext<OmniThemeContextValue | undefined>(undefined);

export function OmniThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('system');
  
  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const activeTheme = theme === 'system' ? systemTheme : theme;
    
    root.classList.remove('light', 'dark');
    root.classList.add(activeTheme);
  }, [theme]);
  
  return (
    <OmniThemeContext.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </OmniThemeContext.Provider>
  );
}
```

---

## 10. 元件需求單模板 (Component Requirements Template)

### 10.1 標準需求單格式

```
Component: [元件名稱]
Version: v1.1
Type: [Atom/Molecule/Organism/Template]
Theme Support: Light/Dark/System

Properties:
- variant: [選項]
- size: [選項]
- state: [選項]

Visual States:
- Default: [描述]
- Hover: [描述]
- Focus: [描述]
- Active: [描述]
- Disabled: [描述]
- Error: [描述]
- Loading: [描述]

Accessibility:
- ARIA: [標籤]
- Keyboard Navigation: [支援]
- Focus Indicator: [規範]

5T Integration:
- Tangible: [如何具體]
- Traceable: [溯源方式]
- Trackable: [追蹤方式]
- Transparent: [透明方式]
- Trustworthy: [封印方式]

Dependencies:
- [相依套件]
```

---

## 11. ESGGO Classic Theme CSS 變數 (CSS Variables)

### 11.1 Light Theme Variables

```css
:root[data-theme="light"], :root:not([data-theme]) {
  /* Background */
  --theme-bg-primary: #FFFFFF;
  --theme-bg-secondary: #F8F9FA;
  --theme-bg-tertiary: #F1F5F9;
  --theme-bg-elevated: rgba(255, 255, 255, 0.85);
  --theme-bg-overlay: rgba(0, 50, 98, 0.08);
  
  /* Text */
  --theme-text-primary: #0F172A;
  --theme-text-secondary: #334155;
  --theme-text-muted: #64748B;
  --theme-text-disabled: #94A3B8;
  --theme-text-inverse: #FFFFFF;
  
  /* Brand */
  --theme-primary: #003262;
  --theme-primary-hover: #1A3A5C;
  --theme-accent: #FDB515;
  --theme-secondary: #3B7EA1;
  
  /* Status */
  --theme-success: #22C55E;
  --theme-warning: #F59E0B;
  --theme-error: #EF4444;
  --theme-info: #06B6D4;
  
  /* Surface */
  --theme-surface-glass: rgba(255, 255, 255, 0.7);
  --theme-border: #E2E8F0;
  --theme-divider: #F1F5F9;
}
```

### 11.2 Dark Theme Variables

```css
:root[data-theme="dark"] {
  /* Background */
  --theme-bg-primary: #020617;
  --theme-bg-secondary: #0A0F1E;
  --theme-bg-tertiary: #1E293B;
  --theme-bg-elevated: rgba(30, 41, 59, 0.85);
  --theme-bg-overlay: rgba(255, 255, 255, 0.08);
  
  /* Text */
  --theme-text-primary: #F8FAFC;
  --theme-text-secondary: #CBD5E1;
  --theme-text-muted: #64748B;
  --theme-text-disabled: #475569;
  --theme-text-inverse: #020617;
  
  /* Brand */
  --theme-primary: #FDB515;
  --theme-primary-hover: #FCC136;
  --theme-accent: #3B7EA1;
  --theme-secondary: #B9D9EB;
  
  /* Status */
  --theme-success: #22C55E;
  --theme-warning: #F59E0B;
  --theme-error: #EF4444;
  --theme-info: #06B6D4;
  
  /* Surface */
  --theme-surface-glass: rgba(30, 41, 59, 0.7);
  --theme-border: #334155;
  --theme-divider: #1E293B;
}
```

---

## 12. 手機特化版優化 (Mobile-Specific Optimizations)

### 12.1 手機端核心設計原則

| 原則 | 實踐方式 |
|------|----------|
| **Thumb-Friendly** | 觸控目標最小 48×48px，重要操作放置於底部 60px 安全區 |
| **單手操作** | 導覽與主要按鈕可在單手可及範圍內 |
| **最小化輸入** | 優先使用選擇/切換而非文字輸入 |
| **高效率展示** | 卡片水平捲動、抽屜式選單、快捷操作 |
| **手指操作防誤觸** | 相鄰按鈕最小間距 8px |

### 12.2 手機端特化版元件變體

#### 12.2.1 MobileOmniButton (手機版按鈕)

| 手機版尺寸 | Padding | FontSize | 最小高度 | 用途 |
|-----------|---------|----------|----------|------|
| **Mobile-Floating** | 16px 20px | 14px | 56px | 浮動動作按鈕 |
| **Mobile-Compact** | 12px 16px | 13px | 48px | 內容區操作 |
| **Mobile-Icon** | 12px | — | 48px | 圖示純按鈕 |
| **Mobile-Bottom** | 16px 24px | 15px | 56px | 底部主按鈕 |

**手機端特殊狀態:**
- **Long Press** (長按): 顯示次要選單或說明
- **Swipe Actions**: 左滑/右滑快捷操作
- **Bottom Safe Area**: 自動避開 iPhone Home Indicator

#### 12.2.2 MobileOmniInput (手機版輸入)

**手機版優化:**
```tsx
interface MobileOmniInputProps extends OmniInputProps {
  inputMode?: 'text' | 'numeric' | 'email' | 'tel' | 'decimal';
  enterKeyHint?: 'done' | 'next' | 'search' | 'send';
  showClearButton?: boolean;
  showPasswordToggle?: boolean;
}
```

| 手機特化 | 處理方式 |
|---------|----------|
| 鍵盤遮蓋 | 自動滾動至可視區 |
| 自動大寫/數字鍵盤 | 根據 inputMode 切換 |
| 清除按鈕 | 於輸入內容時顯示 |
| 語音輸入 | 支援 speechRecognition |

#### 12.2.3 MobileOmniKPICard (手機版KPI卡片)

**手機版布局:**
```
┌─────────────────────┐
│ [Icon]  標題     [Badge]  │
│                       │
│    8.2k            │
│    ▲ 12.5%          │
│ GRI • ERP          │
└─────────────────────┘
```

**手機版優化:**
- 數值縮減顯示 (8,246 → 8.2k)
- 圖示大小: 32×32px
- padding: 16px
- 手勢支援: 左滑展開詳細、點擊全屏顯示

#### 12.2.4 MobileOmniBottomNav (底部導覽)

```tsx
interface MobileBottomNavProps {
  items: Array<{
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    badge?: number;
    onPress?: () => void;
  }>;
  showLabels?: boolean; // Mobile SM 以下隱藏
}
```

**布局結構:**
```
┌─────────────────────────────────────┐
│ [Home] [Write] [Vault] [Insights] [More] │
│    控制台  撰寫   金庫   洞察    更多  │
└─────────────────────────────────────┘
```

| 規格 | 值 |
|------|-----|
| 高度 | 64px (safe area 88px) |
| 圖示大小 | 24×24px |
| 標籤 | 11px, Uppercase |
| 背景 | glass-surface 或 solid |
| 邊框 | divider 上邊框 1px |

### 12.3 手機端手勢系統

| 手勢 | 觸發元素 | 動作 |
|------|----------|------|
| **Tap** | 所有可點擊 | 一般點擊 |
| **Long Press** (500ms) | 按鈕、卡片 | 展開快捷選單 |
| **Swipe Left** | 列表項目 | 顯示操作按鈕 |
| **Swipe Right** | 列表項目 | 返回/取消 |
| **Pull to Refresh** | 滾動容器頂部 | 刷新數據 |
| **Infinite Scroll** | 滾動至底部 | 載入更多 |

### 12.4 手機端動態格局 (Mobile Layout Patterns)

#### 12.4.1 手機儀表版格局

```
手機: 單欄滾動
┌─────────────┐
│ KPI卡片滾動 │ ← 水平捲動
└─────────────┘
┌─────────────┐
│ 內容卡片    │
└─────────────┘
┌─────────────┐
│ 操作按鈕    │ ← 固定底部
└─────────────┘
```

#### 12.4.2 手機表單格局

```
┌─────────────────┐
│ 返回   標題    │ ← 頂部導覽
├─────────────────┤
│ 欄位滾動區    │ ← 內容滾動
├─────────────────┤
│ [確定] [取消]   │ ← 底部按鈕
└─────────────────┘
```

### 12.5 手機端主題適配

| 主題 | 手機背景 | 文字色 | 邊框 |
|------|---------|--------|------|
| **Mobile Light** | `#FFFFFF` | `#0F172A` | `#E2E8F0` |
| **Mobile Dark** | `#0A0F1E` | `#F8FAFC` | `#334155` |
| **Mobile Accent** | `#FDB515` (底部導覽) | `#003262` | — |

---

## 13. 桌面與平板電腦端優化 (Desktop & Tablet Optimizations)

### 13.1 桌面版增強功能

| 功能 | 桌面版實作 |
|------|------------|
| **鍵盤快捷鍵** | Ctrl+K 搜尋, Ctrl+N 新建 |
| **懸停預覽** | Tooltip 豐富內容 |
| **右鍵選單** | 快捷操作選單 |
| **多欄網格** | 12欄 Bento Grid |
| **浮動工具列** | 選定內容時顯示 |

### 13.2 平板電腦適配

| 特性 | 平板實作 |
|------|---------|
| **折疊側邊欄** | 72px 圖示模式 |
| **分欄布局** | 6欄網格系統 |
| **觸控+鍵盤** | 混合輸入模式 |
| **多工視窗** | Split View 支援 |

---

## 14. 設計圖規格 (Design Mockup Specifications)

### 14.1 OmniButton 設計圖

```
Desktop: Primary Button
┌─────────────────────────────────────┐
│ 主要操作按鈕                        │
│ [背景: #003262] [文字: #FDB515]     │
│ 高度: 44px, 圓角: 8px              │
│ Hover: translateY(-1px) + shadow-lg  │
└─────────────────────────────────────┘

Mobile: Floating Action Button
┌─────────────────────────┐
│ [icon]                 │
│ 背景: #FDB515          │
│ 尺寸: 56×56px, 圓形    │
│ 位置: 右下角, margin: 16px │
└─────────────────────────┘
```

### 14.2 OmniKPICard 設計圖

```
Desktop Bento Grid (3-4 columns)
┌──────────────┬──────────────┬──────────────┐
│ Card #1      │ Card #2      │ Card #3      │
│ 碳排總量     │ 活能指數     │ 水使用量     │
│ 8,246.5 t    │ 78.2 kWh/m²  │ 1,245 m³     │
└──────────────┴──────────────┴──────────────┘

Mobile Horizontal Scroll
┌──────────────────────────────────────────────────┐
│ ← [卡1][卡2][卡3][卡4][卡5] →                    │
│ 水平滑動檢視                                     │
└──────────────────────────────────────────────────┘
```

### 14.3 OmniModal 設計圖

```
Desktop Modal
┌──────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────┐ │
│ │ Modal Header                                │ │
│ │ [Title]                    [Close X]       │ │
│ ├─────────────────────────────────────────────┤ │
│ │ Modal Content                               │ │
│ │                                             │ │
│ ├─────────────────────────────────────────────┤ │
│ │ [取消]          [確定]                      │ │
│ └─────────────────────────────────────────────┘ │
│ 背景: rgba(0,0,0,0.5), blur: 4px              │
└──────────────────────────────────────────────────┘

Mobile Fullscreen Modal
┌──────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────┐ │
│ │ [返回 <]         標題              [Next >]  │ │
│ ├─────────────────────────────────────────────┤ │
│ │ 內容全屏顯示                                │ │
│ │                                             │ │
│ ├─────────────────────────────────────────────┤ │
│ │ [確定] (全寬)                              │ │
│ └─────────────────────────────────────────────┘ │
│ 高度: 100vh, 無邊框, 圓角: 0                  │
└──────────────────────────────────────────────────┘
```

---

## 15. 元件需求單範例 (Component Requirements Example)

### 15.1 OmniButton 需求單

```
Component: OmniButton
Version: v1.1.0
Type: Atom
Theme Support: Light/Dark/System

Properties:
- variant: primary | secondary | ghost | danger | success | glass
- size: xl (Desktop) | lg | md | sm (Mobile)
- state: default | hover | active | disabled | loading | error
- loadingText: string (選用)
- fullWidth: boolean (Mobile適用)

Visual States:
- Default: Berkeley Blue bg, Gold text
- Hover: translateY(-1px) + shadow-lg
- Focus: outline 2px gold, offset 2px
- Active: translateY(0) + brightness(0.95)
- Disabled: opacity 0.4, cursor not-allowed
- Loading: Spinner icon + 文字
- Error: shake animation 200ms

Accessibility:
- ARIA: button, aria-pressed, aria-disabled
- Keyboard Navigation: Enter, Space, Tab
- Focus Indicator: 2px solid #FDB515

5T Integration:
- Tangible: 點擊動作立即回饋視覺變化
- Traceable: 點擊日誌上傳至 AuditTrail
- Trackable: lifecycle hook 記錄狀態變化
- Transparent: 若為計算按鈕, 顯示公式步驟
- Trustworthy: 提交後顯示 SHA-256 封印

Mobile-Specific:
- Touch target: minimum 48×48px
- Long Press: 展開快捷選單
- Edge spacing: 8px 邊距防誤觸

Dependencies:
- lucide-react (icons)
- class-variance-authority (styling)
- tailwind-merge (className merge)
```

---

## 17. OmniAssistant 漂浮光球 (Floating Assistant Orb)

### 17.1 OmniAssistant 概述

OmniAssistant 是 OmniAgent 的副版本，作為備份介面提供浮動式操作體驗。位於螢幕右下角，可移動並提供與 OmniAgent 相似的功能介面。

### 17.2 OmniAssistant 屬性定義

```typescript
interface OmniAssistantProps {
  variant?: 'compact' | 'expanded';  // 緊縮/展開模式
  position?: { x: number; y: number }; // 位置座標 (允許拖動)
  size?: 'sm' | 'md' | 'lg';         // 尺寸
  color?: 'berkeley-blue' | 'california-gold' | 'glow'; // 顏色主題
  initialState?: 'idle' | 'listening' | 'processing' | 'speaking';
  autoCollapse?: boolean;             // 自動收縮
  allowDrag?: boolean;                  // 允許拖動
  onDragEnd?: (position: { x: number; y: number }) => void;
}
```

### 17.3 視覺規格

#### 緊縮狀態 (Idle State)

```
┌─────────────────┐
│     ◉           │ ← 圓形光球
│   Berkeley Blue  │ ← 主題色
│   直徑: 56px     │
└─────────────────┘
```

| 屬性 | 值 |
|------|-----|
| 形狀 | 圓形 (border-radius: 50%) |
| 直徑 | 56px (Mobile) / 64px (Desktop) |
| 主題色 | `#003262` (Berkeley Blue) / `#FDB515` (Gold) |
| 光暈效果 | radial-gradient, 20px spread |
| 懸停動畫 | scale: 1.1 + glow pulse |
| 點擊動畫 | scale: 0.95 → 展開 |

#### 展開狀態 (Expanded State)

```
┌─────────────────────────────────────┐
│ ┌─────┐ OmniAssistant              [X] │
│ │ ◉   │                              │
│ └─────┤                              │
│       │ AI 助理對話介面              │
│       │                              │
│ [輸入框______________________] [送出] │
└─────────────────────────────────────┘
```

| 屬性 | 值 |
|------|-----|
| 寬度 | 320px (Mobile: 100vw - 32px) |
| 最大高度 | 500px |
| 圓角 | 20px |
| 背景 | glass-surface |
| 位置 | 右下角, margin 16px |

### 17.4 狀態視覺

| 狀態 | 視覺效果 | 動畫 |
|------|---------|------|
| **Idle** | 靜態光球 | pulse 4s 緩慢閃動 |
| **Listening** | 波紋擴散效果 | scale 1.2 循環 |
| **Processing** | 旋轉動態 | spin 1s linear |
| **Speaking** | 音波視覺 | bar height 變化 |

### 17.5 互動邏輯

| 手勢 | 動作 |
|------|------|
| **Tap** | 展開對話視窗 |
| **Long Press** (800ms) | 切換顏色主題 |
| **Drag** | 移動位置 |
| **Edge Snap** | 貼近邊緣自動對齊 |

### 17.6 5T 整合

| 維度 | OmniAssistant 實作 |
|------|-------------------|
| Tangible | 即時語音/文字回饋 |
| Traceable | 對話紀錄可溯源 |
| Trackable | 生命週期狀態追蹤 |
| Transparent | 顯示思考步驟 |
| Trustworthy | 對話加密存證 |

### 17.7 備份功能

| 功能 | 說明 |
|------|------|
| **會話同步** | 與 OmniAgent 即時同步 |
| **離線模式** | 本地快取基本功能 |
| **安全模式** | 加密通訊, Hash Lock 校驗 |
| **快速切換** | 一鍵切換至主 OmniAgent |

---

## 18. OmniAgent vs OmniAssistant 對比表

| 特性 | OmniAgent | OmniAssistant |
|------|---------|--------------|
| **位置** | 側邊欄/專用區域 | 右下角漂浮 (可拖動) |
| **尺寸** | 固定側邊欄大小 | 可縮放光球 (56-64px) |
| **狀態** | 常開 | 按需展開 |
| **備份** | 主介面 | 備份介面 |
| **操作** | 完整功能 | 精簡功能 |
| **手勢** | 點擊/鍵盤 | 拖動/長按/點擊 |

---

## 19. 檔案結構 (File Structure)

```
src/
├── components/
│   ├── ui/
│   │   ├── atom/
│   │   │   ├── OmniButton.tsx
│   │   │   ├── OmniInput.tsx
│   │   │   ├── OmniBadge.tsx
│   │   │   ├── OmniIcon.tsx
│   │   │   └── OmniDivider.tsx
│   │   ├── molecule/
│   │   │   ├── OmniKPICard.tsx
│   │   │   ├── OmniFormField.tsx
│   │   │   └── OmniBreadcrumb.tsx
│   │   ├── organism/
│   │   │   ├── OmniSidebar.tsx
│   │   │   ├── OmniHeader.tsx
│   │   │   ├── OmniModal.tsx
│   │   │   └── OmniCardGrid.tsx
│   │   └── mobile/
│   │       ├── MobileOmniButton.tsx
│   │       ├── MobileOmniKPICard.tsx
│   │       ├── MobileOmniInput.tsx
│   │       ├── MobileBottomNav.tsx
│   │       └── MobileDrawer.tsx
│   ├── assistant/
│   │   ├── OmniAssistant.tsx
│   │   ├── OmniAssistantOrb.tsx
│   │   ├── OmniAssistantChat.tsx
│   │   └── useAssistantDrag.ts
│   ├── theme/
│   │   ├── OmniThemeProvider.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── omni-theme.ts
│   │   └── useOmniTheme.ts
│   └── hooks/
│       ├── useTouchGesture.ts
│       ├── useLongPress.ts
│       └── useMobileKeyboard.ts
├── styles/
│   └── themes/
│       ├── omni-light.css
│       ├── omni-dark.css
│       └── omni-system.css
└── types/
    ├── omni-component.ts
    └── omni-assistant.ts
```

---

## 20. 元件需求單範本 (Component Requirements Template)

### 20.1 標準需求單格式

```
Component: [元件名稱]
Version: v1.1.0
Type: [Atom/Molecule/Organism/Template]
Theme Support: Light/Dark/System
Mobile Support: Yes/No (Mobile-Specific Props)

Properties:
- variant: [選項]
- size: [選項]  
- state: [選項]

Visual States:
- Default: [描述]
- Hover: [描述]
- Focus: [描述]
- Active: [描述]
- Disabled: [描述]
- Loading: [描述]
- Error: [描述]

Accessibility:
- ARIA: [標籤]
- Keyboard Navigation: [支援]
- Focus Indicator: [規範]

5T Integration:
- Tangible: [如何具體]
- Traceable: [溯源方式]
- Trackable: [追蹤方式]
- Transparent: [透明方式]
- Trustworthy: [封印方式]

Dependencies:
- [相依套件]
```

---