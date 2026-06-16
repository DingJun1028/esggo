# ESGGO 主題包設計規範

## 設計系統

### 配色方案 | Color Palette

#### 基礎色彩

- **Berkeley Blue**: `#003262` - 主品牌色
- **California Gold**: `#FDB515` - 強調色
- **Success Green**: `#10B981` - 成功狀態
- **Warning Amber**: `#F59E0B` - 警告狀態
- **Error Red**: `#EF4444` - 錯誤狀態

#### 中性色彩

- **Neutral 50**: `#FAFAFA` - 背景
- **Neutral 100**: `#F5F5F5` - 次要背景
- **Neutral 200**: `#E5E5E5` - 分隔線
- **Neutral 300**: `#D4D4D4` - 邊框
- **Neutral 800**: `#262626` - 文字
- **Neutral 900**: `#171717` - 主要文字

### 字體系統 | Typography

#### 字體系列

- **Primary**: `Inter` - 系統預設
- **Mono**: `Fira Code` - 程式碼

#### 字級規劃

| 等級    | 大小 | 粗細 | 行高 |
| ------- | ---- | ---- | ---- |
| h1      | 32px | 700  | 1.2  |
| h2      | 28px | 600  | 1.3  |
| h3      | 24px | 600  | 1.4  |
| body    | 16px | 400  | 1.6  |
| caption | 14px | 400  | 1.4  |

### 元件規範 | Components

#### 按鈕

```tsx
// 主要按鈕
<button className="bg-berkeley-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
  主要行動
</button>

// 強調按鈕
<button className="bg-california-gold text-black px-4 py-2 rounded-lg hover:bg-amber-600 transition">
  強調行動
</button>
```

#### 卡片

```tsx
<div className="bg-white rounded-xl shadow-lg border border-neutral-200">
  <div className="p-6">
    <h3 className="text-h3 font-semibold mb-2">標題</h3>
    <p className="text-body text-neutral-800">內容...</p>
  </div>
</div>
```

### 動畫規則 | Animation

#### 過渡時間

- **快速**: 150ms - hover 效果
- **標準**: 300ms - 開場動畫
- **緩慢**: 500ms - 頁面切換

#### easing 函數

- **standard**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **decelerate**: `cubic-bezier(0.2, 0, 0, 1)`
- **accelerate**: `cubic-bezier(0.2, 0, 0.2, 1)`
