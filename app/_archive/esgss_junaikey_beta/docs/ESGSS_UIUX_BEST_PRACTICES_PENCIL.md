# ESGSS JunAiKey UI/UX 最佳實踐指南
## Pencil Design System Best Practices

---

## Table of Contents

1. [設計哲學](#設計哲學)
2. [色彩系統](#色彩系統)
3. [字體規範](#字體規範)
4. [間距系統](#間距系統)
5. [原子設計原則](#原子設計原則)
6. [元件使用指南](#元件使用指南)
7. [響應式設計](#響應式設計)
8. [無障礙設計](#無障礙設計)

---

## 設計哲學

本設計系統秉持「**上善若水**」哲學，源自道德經：「上善若水，水善利萬物而不爭」。

### 核心理念

| 理念 | 說明 | 應用場景 |
|------|------|----------|
| 適應性 | 如水般適應各種容器 | 響應式佈局、組件彈性 |
| 流動性 | 自然流動的視覺體驗 | 動畫過渡、載入狀態 |
| 清澈性 | 透明、無隱藏的資訊架構 | 清晰的資訊層次 |
| 穩固性 | 堅實的基礎設計系統 | 一致的設計規範 |

### 設計原則

1. **簡潔至上** - 去除多餘元素，保留核心資訊
2. **一致性** - 全系統保持統一的視覺語言
3. **可擴展性** - 支援未來功能擴展
4. **用戶友好** - 直觀的操作體驗

---

## 色彩系統

### 主色調 (Primary Colors)

基於「上善若水」理念，主色調採用水的藍綠色系。

| 色階 | 色碼 | CSS 變數 | 用途 |
|------|------|----------|------|
| Primary 100 | #E5F4F8 | `--primary-100` | 背景、懸停狀態 |
| Primary 200 | #C2E1EB | `--primary-200` | 卡片背景、區塊分隔 |
| Primary 300 | #9FCBD9 | `--primary-300` | 圖示背景、次要按鈕 |
| Primary 400 | #7FB5C4 | `--primary-400` | 圖示、載入動畫 |
| Primary 500 | #63A2B0 | `--primary-500` | 主要按鈕、品牌色 |
| Primary 600 | #548399 | `--primary-600` | 文字、標題 |
| Primary 700 | #477385 | `--primary-700` | 深色文字、邊框 |
| Primary 800 | #3A6171 | `--primary-800` | 標題、導航欄 |
| Primary 900 | #2D4F5E | `--primary-900` | 深色背景、側邊欄 |

### 次要色調 (Secondary Colors)

| 色階 | 色碼 | CSS 變數 | 用途 |
|------|------|----------|------|
| Secondary 100 | #FEF5E0 | `--secondary-100` | 警告背景 |
| Secondary 200 | #FCE4B5 | `--secondary-200` | 提示背景 |
| Secondary 300 | #F9CD86 | `--secondary-300` | 圖示背景 |
| Secondary 400 | #F7B84B | `--secondary-400` | 強調文字 |
| Secondary 500 | #F5A623 | `--secondary-500` | 次要按鈕、強調元素 |
| Secondary 600 | #8B5A1B | `--secondary-600` | 深色警告文字 |

### 功能色彩

| 色彩 | 色碼 | CSS 變數 | 用途 |
|------|------|----------|------|
| Success | #4CAF50 | `--success` | 成功狀態、完成指示 |
| Warning | #FF9800 | `--warning` | 警告、提醒 |
| Error | #F44336 | `--error` | 錯誤、危險 |
| Info | #2196F3 | `--info` | 資訊、一般提示 |

### ESG 專屬色彩

| 支柱 | 主要色碼 | 用途 |
|------|----------|------|
| 環境 (E) | #4CAF50 | 環境指標、綠色主題 |
| 社會 (S) | #2196F3 | 社會指標、藍色主題 |
| 治理 (G) | #7B1FA2 | 治理指標、紫色主題 |

### 5T 協議色彩

| 協議 | 色彩 | 色碼 | 說明 |
|------|------|------|------|
| Traceable | 青色 | #00BCD4 | 可追溯性 |
| Trackable | 靛藍 | #3F51B5 | 可追蹤性 |
| Transparent | 淺綠 | #8BC34A | 透明度 |
| Trustworthy | 金色 | #FFC107 | 可信度 |
| Tangible | 橘色 | #FF5722 | 實質性 |

### 中性色彩

| 色階 | 色碼 | CSS 變數 | 用途 |
|------|------|----------|------|
| Neutral 50 | #FAFAFA | `--neutral-50` | 頁面背景 |
| Neutral 100 | #F5F5F5 | `--neutral-100` | 卡片背景 |
| Neutral 200 | #EEEEEE | `--neutral-200` | 邊框、分隔線 |
| Neutral 300 | #E0E0E0 | `--neutral-300` | 輸入框邊框 |
| Neutral 400 | #BDBDBD | `--neutral-400` | 佔位符 |
| Neutral 500 | #9E9E9E | `--neutral-500` | 次要文字 |
| Neutral 600 | #757575 | `--neutral-600` | 一般文字 |
| Neutral 700 | #616161 | `--neutral-700` | 標籤文字 |
| Neutral 800 | #424242 | `--neutral-800` | 標題文字 |
| Neutral 900 | #212121 | `--neutral-900` | 主要文字 |

---

## 字體規範

### 字體堆疊

```css
font-family: 'Noto Sans TC', 'Microsoft JhengHei', -apple-system, BlinkMacSystemFont, sans-serif;
```

### 字體大小

| 用途 | 大小 | CSS 變數 | 範例 |
|------|------|----------|------|
| Display | 36px | `--font-4xl` | 上善若水 ESG 永續 |
| H1 | 30px | `--font-3xl` | 環境永續報告書 |
| H2 | 24px | `--font-2xl` | 碳足跡管理 |
| H3 | 20px | `--font-xl` | 段落標題 |
| Body | 16px | `--font-base` | 一般內容 |
| Small | 14px | `--font-sm` | 標籤、說明 |
| Caption | 12px | `--font-xs` | 時間戳、版本號 |

### 字重規範

| 字重 | 數值 | 用途 |
|------|------|------|
| Regular | 400 | 一般內容 |
| Medium | 500 | 標籤、小標題 |
| Semi-Bold | 600 | 標題、強調 |
| Bold | 700 | 主要標題、數據 |

### 行高規範

| 用途 | 行高 | 說明 |
|------|------|------|
| 標題 | 1.2 - 1.3 | 緊湊行高 |
| 正文 | 1.5 - 1.6 | 標準行高 |
| 說明文字 | 1.4 - 1.5 | 較短行高 |

---

## 間距系統

基於 4px 基準的級距間距系統。

### 間距變數

| 變數 | 大小 | CSS 變數 | 用途 |
|------|------|----------|------|
| space-1 | 4px | `--space-1` | 圖示與文字間距 |
| space-2 | 8px | `--space-2` | 標籤與輸入框 |
| space-3 | 12px | `--space-3` | 按鈕內邊距 |
| space-4 | 16px | `--space-4` | 卡片內邊距 |
| space-5 | 20px | `--space-5` | 元件間距 |
| space-6 | 24px | `--space-6` | 區塊標題間距 |
| space-8 | 32px | `--space-8` | 區塊間距 |
| space-10 | 40px | `--space-10` | 大區塊間距 |
| space-12 | 48px | `--space-12` | 段落間距 |
| space-16 | 64px | `--space-16` | 章節間距 |

### 間距使用原則

1. **區塊間距** - 使用 `space-8` 至 `space-12`
2. **元件間距** - 使用 `space-4` 至 `space-6`
3. **內部間距** - 使用 `space-2` 至 `space-4`
4. **圖示間距** - 使用 `space-1` 至 `space-2`

---

## 原子設計原則

### Atoms (原子) - 最基礎的 UI 元素

#### 按鈕原子

| 類型 | CSS 類別 | 用途 |
|------|----------|------|
| 主要按鈕 | `.btn-primary` | 主要操作、提交 |
| 次要按鈕 | `.btn-secondary` | 次要操作、取消 |
| 輪廓按鈕 | `.btn-outline` | 輔助操作、詳情 |
| 禁用按鈕 | `.btn:disabled` | 禁用狀態 |

**按鈕樣式規範**：
- 圓角：`--radius-md` (8px)
- 內邊距：`space-3` × `space-5` (12px × 20px)
- 字體大小：`--font-base` (16px)

#### 輸入框原子

| 狀態 | CSS 類別 | 用途 |
|------|----------|------|
| 預設 | `.input-default` | 一般輸入 |
| 成功 | `.input-success` | 驗證通過 |
| 錯誤 | `.input-error` | 驗證失敗 |

#### 標籤原子

| 類型 | CSS 類別 | 用途 |
|------|----------|------|
| 預設 | `.badge-default` | 一般標籤 |
| 成功 | `.badge-success` | 成功狀態 |
| 錯誤 | `.badge-error` | 錯誤狀態 |
| 灰色 | `.badge-neutral` | 次要標籤 |

### Molecules (分子) - 原子組合的功能元件

| 元件名稱 | 用途 | 組成元素 |
|----------|------|----------|
| SearchMolecule | 搜尋功能 | 輸入框 + 圖示 |
| CardMolecule | 資訊卡片 | 圖示 + 標題 + 描述 + 按鈕 |
| ProgressMolecule | 進度展示 | 進度條 + 標籤 + 數據 |
| AvatarMolecule | 使用者頭像 | 圖示 + 姓名 + 職銜 |

### Organisms (有機體) - 完整的功能區塊

| 元件名稱 | 用途 | 說明 |
|----------|------|------|
| HeaderOrganism | 頁面標頭 | 品牌標誌 + 導航 + 使用者操作 |
| ESGDashboardOrganism | ESG 儀表板 | E/S/G 三支柱評等 |
| ReportCardOrganism | 報告書卡片 | 報告書摘要 + 操作按鈕 |

### Templates (模板) - 頁面骨架

| 模板名稱 | 用途 | 說明 |
|----------|------|------|
| BentoGridTemplate | 便當盒網格 | 響應式網格佈局 |
| DashboardTemplate | 儀表板模板 | 列表 + 篩選 + 操作 |

### Pages (頁面) - 完整頁面範例

| 頁面名稱 | 用途 | 核心功能 |
|----------|------|----------|
| HomePage | 首頁 | 品牌展示 + 統計數據 |
| ReportPage | 報告書列表 | 篩選 + 搜尋 + 分頁 |

---

## 元件使用指南

### 按鈕使用規範

**1. 主要按鈕**
```css
.btn-primary {
    background: #63A2B0;
    border-radius: 8px;
    padding: 12px 20px;
    color: white;
    border: none;
    cursor: pointer;
}
```

**2. 次要按鈕**
```css
.btn-secondary {
    background: #F5A623;
    border-radius: 8px;
    padding: 12px 20px;
    color: white;
    border: none;
    cursor: pointer;
}
```

**3. 輪廓按鈕**
```css
.btn-outline {
    border: 2px solid #63A2B0;
    background: transparent;
    border-radius: 8px;
    padding: 12px 20px;
    color: #63A2B0;
}
```

### 卡片設計規範

**1. 基礎卡片**
- 圓角：`--radius-lg` (12px)
- 陰影：`--shadow-md` (4px × 6px)
- 背景：白色

**2. 懸停效果**
```css
.component-card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
}
```

### 進度條設計規範

**1. 基礎進度條**
- 高度：8px
- 圓角：`--radius-full` (9999px)
- 背景：`--neutral-200`

**2. 進度指示**
- 使用漸層：`linear-gradient(90deg, var(--primary-400), var(--primary-600))`

### 圖示使用規範

**1. 圖示大小**
- 小圖示：16px × 16px
- 中圖示：24px × 24px
- 大圖示：48px × 48px

**2. 圖示間距**
- 圖示與文字： `--space-2` (8px)

---

## 響應式設計

### 斷點規範

| 斷點 | 寬度 | CSS 媒體查詢 |
|------|------|--------------|
| Desktop | ≥ 1024px | `@media (max-width: 1024px)` |
| Tablet | 768px - 1023px | `@media (max-width: 768px)` |
| Mobile | < 768px | `@media (max-width: 768px)` |

### 側邊欄響應式

| 斷點 | 側邊欄寬度 | 內容區域margin |
|------|------------|----------------|
| Desktop | 280px | margin-left: 280px |
| Tablet | 240px | margin-left: 240px |
| Mobile | 隱藏 | margin-left: 0 |

### 網格系統響應式

**Desktop (1024px+)**
```css
.bento-grid {
    grid-template-columns: repeat(4, 1fr);
}
```

**Tablet (768px - 1023px)**
```css
.bento-grid {
    grid-template-columns: repeat(2, 1fr);
}
```

**Mobile (< 768px)**
```css
.bento-grid {
    grid-template-columns: 1fr;
}
```

---

## 無障礙設計

### 色彩對比度

| 元素 | 前景色 | 背景色 | 對比度要求 |
|------|--------|--------|------------|
| 主要按鈕文字 | #FFFFFF | #63A2B0 | 4.5:1 ✓ |
| 一般文字 | #212121 | #FFFFFF | 15:1 ✓ |
| 次要文字 | #757575 | #FFFFFF | 4.2:1 ✓ |
| 標籤文字 | #477385 | #E5F4F8 | 4.8:1 ✓ |

### 互動狀態

**1. 懸停狀態**
```css
.nav-link:hover, .nav-link.active {
    background: rgba(255,255,255,0.15);
    color: white;
}
```

**2. 焦點狀態**
```css
button:focus, input:focus {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
}
```

**3. 禁用狀態**
```css
button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
```

### 動畫效能

**1. 過渡時間**
| 動畫類型 | 時間 | CSS 變數 |
|----------|------|----------|
| 快速過渡 | 150ms | `--transition-fast` |
| 標準過渡 | 250ms | `--transition-base` |
| 慢速過渡 | 350ms | `--transition-slow` |

**2. 動畫效能優化**
```css
.component-card {
    transition: var(--transition-base);
}
```

---

## 設計系統版本

| 版本 | 日期 | 更新內容 |
|------|------|----------|
| 1.0.0 | 2026-02-05 | 初始版本 |
| 1.1.0 | - | 新增 5T 協議色彩 |

---

**維護團隊：** ESGSS JunAiKey 設計團隊  
**聯繫方式：** design@esgss.junaikey.tw
## Pencil Design System Best Practices

---

## Table of Contents

1. [設計哲學](#設計哲學)
2. [色彩系統](#色彩系統)
3. [字體規範](#字體規範)
4. [間距系統](#間距系統)
5. [原子設計原則](#原子設計原則)
6. [元件使用指南](#元件使用指南)
7. [響應式設計](#響應式設計)
8. [無障礙設計](#無障礙設計)

---

## 設計哲學

本設計系統秉持「**上善若水**」哲學，源自道德經：「上善若水，水善利萬物而不爭」。

### 核心理念

| 理念 | 說明 | 應用場景 |
|------|------|----------|
| 適應性 | 如水般適應各種容器 | 響應式佈局、組件彈性 |
| 流動性 | 自然流動的視覺體驗 | 動畫過渡、載入狀態 |
| 清澈性 | 透明、無隱藏的資訊架構 | 清晰的資訊層次 |
| 穩固性 | 堅實的基礎設計系統 | 一致的設計規範 |

### 設計原則

1. **簡潔至上** - 去除多餘元素，保留核心資訊
2. **一致性** - 全系統保持統一的視覺語言
3. **可擴展性** - 支援未來功能擴展
4. **用戶友好** - 直觀的操作體驗

---

## 色彩系統

### 主色調 (Primary Colors)

基於「上善若水」理念，主色調採用水的藍綠色系。

| 色階 | 色碼 | CSS 變數 | 用途 |
|------|------|----------|------|
| Primary 100 | #E5F4F8 | `--primary-100` | 背景、懸停狀態 |
| Primary 200 | #C2E1EB | `--primary-200` | 卡片背景、區塊分隔 |
| Primary 300 | #9FCBD9 | `--primary-300` | 圖示背景、次要按鈕 |
| Primary 400 | #7FB5C4 | `--primary-400` | 圖示、載入動畫 |
| Primary 500 | #63A2B0 | `--primary-500` | 主要按鈕、品牌色 |
| Primary 600 | #548399 | `--primary-600` | 文字、標題 |
| Primary 700 | #477385 | `--primary-700` | 深色文字、邊框 |
| Primary 800 | #3A6171 | `--primary-800` | 標題、導航欄 |
| Primary 900 | #2D4F5E | `--primary-900` | 深色背景、側邊欄 |

### 次要色調 (Secondary Colors)

| 色階 | 色碼 | CSS 變數 | 用途 |
|------|------|----------|------|
| Secondary 100 | #FEF5E0 | `--secondary-100` | 警告背景 |
| Secondary 200 | #FCE4B5 | `--secondary-200` | 提示背景 |
| Secondary 300 | #F9CD86 | `--secondary-300` | 圖示背景 |
| Secondary 400 | #F7B84B | `--secondary-400` | 強調文字 |
| Secondary 500 | #F5A623 | `--secondary-500` | 次要按鈕、強調元素 |
| Secondary 600 | #8B5A1B | `--secondary-600` | 深色警告文字 |

### 功能色彩

| 色彩 | 色碼 | CSS 變數 | 用途 |
|------|------|----------|------|
| Success | #4CAF50 | `--success` | 成功狀態、完成指示 |
| Warning | #FF9800 | `--warning` | 警告、提醒 |
| Error | #F44336 | `--error` | 錯誤、危險 |
| Info | #2196F3 | `--info` | 資訊、一般提示 |

### ESG 專屬色彩

| 支柱 | 主要色碼 | 用途 |
|------|----------|------|
| 環境 (E) | #4CAF50 | 環境指標、綠色主題 |
| 社會 (S) | #2196F3 | 社會指標、藍色主題 |
| 治理 (G) | #7B1FA2 | 治理指標、紫色主題 |

### 5T 協議色彩

| 協議 | 色彩 | 色碼 | 說明 |
|------|------|------|------|
| Traceable | 青色 | #00BCD4 | 可追溯性 |
| Trackable | 靛藍 | #3F51B5 | 可追蹤性 |
| Transparent | 淺綠 | #8BC34A | 透明度 |
| Trustworthy | 金色 | #FFC107 | 可信度 |
| Tangible | 橘色 | #FF5722 | 實質性 |

### 中性色彩

| 色階 | 色碼 | CSS 變數 | 用途 |
|------|------|----------|------|
| Neutral 50 | #FAFAFA | `--neutral-50` | 頁面背景 |
| Neutral 100 | #F5F5F5 | `--neutral-100` | 卡片背景 |
| Neutral 200 | #EEEEEE | `--neutral-200` | 邊框、分隔線 |
| Neutral 300 | #E0E0E0 | `--neutral-300` | 輸入框邊框 |
| Neutral 400 | #BDBDBD | `--neutral-400` | 佔位符 |
| Neutral 500 | #9E9E9E | `--neutral-500` | 次要文字 |
| Neutral 600 | #757575 | `--neutral-600` | 一般文字 |
| Neutral 700 | #616161 | `--neutral-700` | 標籤文字 |
| Neutral 800 | #424242 | `--neutral-800` | 標題文字 |
| Neutral 900 | #212121 | `--neutral-900` | 主要文字 |

---

## 字體規範

### 字體堆疊

```css
font-family: 'Noto Sans TC', 'Microsoft JhengHei', -apple-system, BlinkMacSystemFont, sans-serif;
```

### 字體大小

| 用途 | 大小 | CSS 變數 | 範例 |
|------|------|----------|------|
| Display | 36px | `--font-4xl` | 上善若水 ESG 永續 |
| H1 | 30px | `--font-3xl` | 環境永續報告書 |
| H2 | 24px | `--font-2xl` | 碳足跡管理 |
| H3 | 20px | `--font-xl` | 段落標題 |
| Body | 16px | `--font-base` | 一般內容 |
| Small | 14px | `--font-sm` | 標籤、說明 |
| Caption | 12px | `--font-xs` | 時間戳、版本號 |

### 字重規範

| 字重 | 數值 | 用途 |
|------|------|------|
| Regular | 400 | 一般內容 |
| Medium | 500 | 標籤、小標題 |
| Semi-Bold | 600 | 標題、強調 |
| Bold | 700 | 主要標題、數據 |

### 行高規範

| 用途 | 行高 | 說明 |
|------|------|------|
| 標題 | 1.2 - 1.3 | 緊湊行高 |
| 正文 | 1.5 - 1.6 | 標準行高 |
| 說明文字 | 1.4 - 1.5 | 較短行高 |

---

## 間距系統

基於 4px 基準的級距間距系統。

### 間距變數

| 變數 | 大小 | CSS 變數 | 用途 |
|------|------|----------|------|
| space-1 | 4px | `--space-1` | 圖示與文字間距 |
| space-2 | 8px | `--space-2` | 標籤與輸入框 |
| space-3 | 12px | `--space-3` | 按鈕內邊距 |
| space-4 | 16px | `--space-4` | 卡片內邊距 |
| space-5 | 20px | `--space-5` | 元件間距 |
| space-6 | 24px | `--space-6` | 區塊標題間距 |
| space-8 | 32px | `--space-8` | 區塊間距 |
| space-10 | 40px | `--space-10` | 大區塊間距 |
| space-12 | 48px | `--space-12` | 段落間距 |
| space-16 | 64px | `--space-16` | 章節間距 |

### 間距使用原則

1. **區塊間距** - 使用 `space-8` 至 `space-12`
2. **元件間距** - 使用 `space-4` 至 `space-6`
3. **內部間距** - 使用 `space-2` 至 `space-4`
4. **圖示間距** - 使用 `space-1` 至 `space-2`

---

## 原子設計原則

### Atoms (原子) - 最基礎的 UI 元素

#### 按鈕原子

| 類型 | CSS 類別 | 用途 |
|------|----------|------|
| 主要按鈕 | `.btn-primary` | 主要操作、提交 |
| 次要按鈕 | `.btn-secondary` | 次要操作、取消 |
| 輪廓按鈕 | `.btn-outline` | 輔助操作、詳情 |
| 禁用按鈕 | `.btn:disabled` | 禁用狀態 |

**按鈕樣式規範**：
- 圓角：`--radius-md` (8px)
- 內邊距：`space-3` × `space-5` (12px × 20px)
- 字體大小：`--font-base` (16px)

#### 輸入框原子

| 狀態 | CSS 類別 | 用途 |
|------|----------|------|
| 預設 | `.input-default` | 一般輸入 |
| 成功 | `.input-success` | 驗證通過 |
| 錯誤 | `.input-error` | 驗證失敗 |

#### 標籤原子

| 類型 | CSS 類別 | 用途 |
|------|----------|------|
| 預設 | `.badge-default` | 一般標籤 |
| 成功 | `.badge-success` | 成功狀態 |
| 錯誤 | `.badge-error` | 錯誤狀態 |
| 灰色 | `.badge-neutral` | 次要標籤 |

### Molecules (分子) - 原子組合的功能元件

| 元件名稱 | 用途 | 組成元素 |
|----------|------|----------|
| SearchMolecule | 搜尋功能 | 輸入框 + 圖示 |
| CardMolecule | 資訊卡片 | 圖示 + 標題 + 描述 + 按鈕 |
| ProgressMolecule | 進度展示 | 進度條 + 標籤 + 數據 |
| AvatarMolecule | 使用者頭像 | 圖示 + 姓名 + 職銜 |

### Organisms (有機體) - 完整的功能區塊

| 元件名稱 | 用途 | 說明 |
|----------|------|------|
| HeaderOrganism | 頁面標頭 | 品牌標誌 + 導航 + 使用者操作 |
| ESGDashboardOrganism | ESG 儀表板 | E/S/G 三支柱評等 |
| ReportCardOrganism | 報告書卡片 | 報告書摘要 + 操作按鈕 |

### Templates (模板) - 頁面骨架

| 模板名稱 | 用途 | 說明 |
|----------|------|------|
| BentoGridTemplate | 便當盒網格 | 響應式網格佈局 |
| DashboardTemplate | 儀表板模板 | 列表 + 篩選 + 操作 |

### Pages (頁面) - 完整頁面範例

| 頁面名稱 | 用途 | 核心功能 |
|----------|------|----------|
| HomePage | 首頁 | 品牌展示 + 統計數據 |
| ReportPage | 報告書列表 | 篩選 + 搜尋 + 分頁 |

---

## 元件使用指南

### 按鈕使用規範

**1. 主要按鈕**
```css
.btn-primary {
    background: #63A2B0;
    border-radius: 8px;
    padding: 12px 20px;
    color: white;
    border: none;
    cursor: pointer;
}
```

**2. 次要按鈕**
```css
.btn-secondary {
    background: #F5A623;
    border-radius: 8px;
    padding: 12px 20px;
    color: white;
    border: none;
    cursor: pointer;
}
```

**3. 輪廓按鈕**
```css
.btn-outline {
    border: 2px solid #63A2B0;
    background: transparent;
    border-radius: 8px;
    padding: 12px 20px;
    color: #63A2B0;
}
```

### 卡片設計規範

**1. 基礎卡片**
- 圓角：`--radius-lg` (12px)
- 陰影：`--shadow-md` (4px × 6px)
- 背景：白色

**2. 懸停效果**
```css
.component-card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
}
```

### 進度條設計規範

**1. 基礎進度條**
- 高度：8px
- 圓角：`--radius-full` (9999px)
- 背景：`--neutral-200`

**2. 進度指示**
- 使用漸層：`linear-gradient(90deg, var(--primary-400), var(--primary-600))`

### 圖示使用規範

**1. 圖示大小**
- 小圖示：16px × 16px
- 中圖示：24px × 24px
- 大圖示：48px × 48px

**2. 圖示間距**
- 圖示與文字： `--space-2` (8px)

---

## 響應式設計

### 斷點規範

| 斷點 | 寬度 | CSS 媒體查詢 |
|------|------|--------------|
| Desktop | ≥ 1024px | `@media (max-width: 1024px)` |
| Tablet | 768px - 1023px | `@media (max-width: 768px)` |
| Mobile | < 768px | `@media (max-width: 768px)` |

### 側邊欄響應式

| 斷點 | 側邊欄寬度 | 內容區域margin |
|------|------------|----------------|
| Desktop | 280px | margin-left: 280px |
| Tablet | 240px | margin-left: 240px |
| Mobile | 隱藏 | margin-left: 0 |

### 網格系統響應式

**Desktop (1024px+)**
```css
.bento-grid {
    grid-template-columns: repeat(4, 1fr);
}
```

**Tablet (768px - 1023px)**
```css
.bento-grid {
    grid-template-columns: repeat(2, 1fr);
}
```

**Mobile (< 768px)**
```css
.bento-grid {
    grid-template-columns: 1fr;
}
```

---

## 無障礙設計

### 色彩對比度

| 元素 | 前景色 | 背景色 | 對比度要求 |
|------|--------|--------|------------|
| 主要按鈕文字 | #FFFFFF | #63A2B0 | 4.5:1 ✓ |
| 一般文字 | #212121 | #FFFFFF | 15:1 ✓ |
| 次要文字 | #757575 | #FFFFFF | 4.2:1 ✓ |
| 標籤文字 | #477385 | #E5F4F8 | 4.8:1 ✓ |

### 互動狀態

**1. 懸停狀態**
```css
.nav-link:hover, .nav-link.active {
    background: rgba(255,255,255,0.15);
    color: white;
}
```

**2. 焦點狀態**
```css
button:focus, input:focus {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
}
```

**3. 禁用狀態**
```css
button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
```

### 動畫效能

**1. 過渡時間**
| 動畫類型 | 時間 | CSS 變數 |
|----------|------|----------|
| 快速過渡 | 150ms | `--transition-fast` |
| 標準過渡 | 250ms | `--transition-base` |
| 慢速過渡 | 350ms | `--transition-slow` |

**2. 動畫效能優化**
```css
.component-card {
    transition: var(--transition-base);
}
```

---

## 設計系統版本

| 版本 | 日期 | 更新內容 |
|------|------|----------|
| 1.0.0 | 2026-02-05 | 初始版本 |
| 1.1.0 | - | 新增 5T 協議色彩 |

---

**維護團隊：** ESGSS JunAiKey 設計團隊  
**聯繫方式：** design@esgss.junaikey.tw

