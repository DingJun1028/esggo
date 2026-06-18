# ESGGO Design Token Reference

## 色彩系統

### 主要色彩

| Token | 色值 | 用途 |
|-------|------|------|
| `primary` | `#003262` | 主色 Berkeley Blue — 標題、按鈕、連結 |
| `accent` | `#FDB515` | 強調色 Gold — 圖標、badge、高亮 |
| `background` | `#F8FAFC` | 頁面背景 |
| `surface` | `#FFFFFF` | 卡片、面板背景 |
| `border` | `#E2E8F0` | 邊框 |
| `text-primary` | `#003262` | 主要文字 |
| `text-secondary` | `#64748B` | 次要文字 |
| `text-muted` | `#94A3B8` | 輔助文字 |

### 語意色彩

| Token | 色值 | 用途 |
|-------|------|------|
| `success` | `#10B981` | 成功狀態 |
| `warning` | `#F59E0B` | 警告狀態 |
| `error` | `#EF4444` | 錯誤狀態 |
| `info` | `#06B6D4` | 資訊狀態 |

### 禁止色彩

| 色值 | 原因 |
|------|------|
| `#000000` | 純黑背景禁止 |
| `#1E293B` | slate-800 太暗 |
| `#334155` | slate-700 太暗 |
| 任何 `dark:*` | 深色模式禁止 |

## 間距系統

| Token | 值 | 用途 |
|-------|----|------|
| `xs` | `4px` | 圖標間距 |
| `sm` | `8px` | 元件內間距 |
| `md` | `16px` | 卡片內間距 |
| `lg` | `24px` | 區塊間距 |
| `xl` | `32px` | 大區塊間距 |
| `2xl` | `48px` | 頁面級間距 |

## 圓角系統

| Token | 值 | 用途 |
|-------|----|------|
| `sm` | `4px` | 小元件 |
| `md` | `8px` | 按鈕、輸入框 |
| `lg` | `12px` | 卡片 |
| `xl` | `16px` | 大卡片 |
| `2xl` | `24px` | 頁面容器 |

## 字體系統

| Token | 大小 | 用途 |
|-------|------|------|
| `xs` | `10px` | 標籤、輔助文字 |
| `sm` | `12px` | 次要文字 |
| `base` | `14px` | 內文 |
| `lg` | `16px` | 小標題 |
| `xl` | `20px` | 標題 |
| `2xl` | `24px` | 大標題 |
| `3xl` | `32px` | 頁面標題 |

## 元件規範

### 按鈕

```tsx
// 主要按鈕
<OmniButton variant="primary">
  確認
</OmniButton>

// 次要按鈕
<OmniButton variant="secondary">
  取消
</OmniButton>

// 危險按鈕
<OmniButton variant="danger">
  刪除
</OmniButton>
```

### 卡片

```tsx
// 基本卡片
<OmniBaseCard className="p-4">
  <h3 className="text-sm font-bold text-[#003262]">標題</h3>
  <p className="text-xs text-slate-500">內容</p>
</OmniBaseCard>
```

### Badge

```tsx
// 成功
<OmniBadge variant="success">已完成</OmniBadge>

// 警告
<OmniBadge variant="warning">待處理</OmniBadge>

// 錯誤
<OmniBadge variant="danger">已逾期</OmniBadge>
```

## 動畫規範

只允許以下動畫：
- `hover:shadow-md` — 卡片懸停
- `hover:border-slate-200` — 邊框變化
- `transition-colors` — 顏色過渡
- `transition-shadow` — 陰影過渡
- `animate-ping` — 狀態指示器
- `animate-spin` — 載入指示器

禁止：
- `animate-bounce` — 太花俏
- `animate-pulse` — 用於背景 glow（太亮）
- 任何 `transform` 動畫超過 200ms
