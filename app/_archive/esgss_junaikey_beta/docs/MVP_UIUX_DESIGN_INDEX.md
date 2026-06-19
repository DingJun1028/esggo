# ESGss JunAiKey MVP UI/UX 設計規範 v2.0

**版本**: 2.0.0  
**建立日期**: 2026-02-13  
**核心理念**: **服務即教學，知識即資產**  
**預設主題**: 上善若水 (Aqua Flow)  
**主題色碼**: #63A2B0

---

## 📋 設計文件索引

本設計系統包含以下 HTML 互動式設計稿：

| 文件名稱 | 描述 | 路徑 |
|----------|------|------|
| **主儀表板設計** | ESG 永續儀表板主頁面 | [`MVP_UIUX_DESIGN_V2.html`](./MVP_UIUX_DESIGN_V2.html) |
| **氣候風險分析** | 氣候風險評估與矩陣頁面 | [`MVP_UIUX_CLIMATE_RISK.html`](./MVP_UIUX_CLIMATE_RISK.html) |
| **永續報告中心** | 報告管理與生成頁面 | [`MVP_UIUX_REPORT_CENTER.html`](./MVP_UIUX_REPORT_CENTER.html) |

---

## 🎨 設計系統規範

### 1. 色彩系統

#### Primary 主色系 - 上善若水

| 色階名稱 | 色碼 | 用途說明 |
|----------|------|----------|
| Primary 900 | `#2D4F5E` | 最深色，用於特殊強調文字 |
| Primary 700 | `#477385` | 次深色，用於 disabled 狀態 |
| Primary 500 | `#63A2B0` | **核心色**，用於主要按鈕背景 |
| Primary 300 | `#9FCBD9` | 更淺色，用於 hover 背景 |
| Primary 100 | `#E5F4F8` | 最淺色，用於頁面背景 |

#### ESG 維度色彩

| 維度 | 色碼 | 象徵意義 |
|------|------|----------|
| Environmental 環境 | `#4CAF50` | 綠色代表自然、生態、永續 |
| Social 社會 | `#9C27B0` | 紫色代表人文、關懷、多元 |
| Governance 治理 | `#3F51B5` | 藍色代表誠信、透明、責任 |

#### Functional 功能色系

| 功能類型 | 色碼 | 用途說明 |
|----------|------|----------|
| Success 成功 | `#4CAF50` | 操作成功確認、進度完成 |
| Warning 警告 | `#FF9800` | 需要注意的提示、期限提醒 |
| Error 錯誤 | `#F44336` | 操作失敗、錯誤訊息 |
| Info 資訊 | `#2196F3` | 一般提示、新功能通知 |

---

### 2. 排版設計規格

#### 2.1 便當盒式佈局 (Bento Grid)

```
┌────────────────────────────────────────────────────────────────┐
│  Header (固定高度 72px)                                          │
├─────────┬──────────────────────────────────────────────────────┤
│         │  Breadcrumb + Page Header                             │
│ Sidebar │──────────────────────────────────────────────────────│
│ (260px) │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│         │  │ KPI 1   │ │ KPI 2   │ │ KPI 3   │ │ KPI 4   │    │
│         │  └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
│         │──────────────────────────────────────────────────────│
│         │  ┌────────────────────────┐ ┌──────────────────┐    │
│         │  │                        │ │                  │    │
│         │  │    Main Content        │ │   Sidebar        │    │
│         │  │    (2fr)               │ │   (1fr)          │    │
│         │  │                        │ │                  │    │
│         │  └────────────────────────┘ └──────────────────┘    │
└─────────┴──────────────────────────────────────────────────────┘
```

#### 2.2 間距規範

| 層級 | 數值 | 用途 |
|------|------|------|
| xs | 4px | 緊湊元素間距 |
| sm | 8px | 相關元素間距 |
| md | 16px | 標準區塊間距 |
| lg | 24px | 大區塊間距 |
| xl | 32px | 頁面區段間距 |

#### 2.3 圓角規範

| 層級 | 數值 | 用途 |
|------|------|------|
| sm | 4px | 小型元素（標籤、徽章） |
| md | 8px | 中型元素（按鈕、輸入框） |
| lg | 16px | 大型元素（卡片、對話框） |
| full | 9999px | 圓形元素（頭像、膠囊按鈕） |

---

### 3. 組件設計規範

#### 3.1 按鈕樣式

```css
/* Primary Button */
.btn-primary {
    background: #63A2B0;
    color: white;
    padding: 0.625rem 1.25rem;
    border-radius: 8px;
    font-weight: 500;
}

/* Secondary Button */
.btn-secondary {
    background: white;
    color: #616161;
    border: 1px solid #E0E0E0;
    padding: 0.625rem 1.25rem;
    border-radius: 8px;
}
```

#### 3.2 卡片樣式

```css
.card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    overflow: hidden;
}

.card-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #EEEEEE;
}

.card-body {
    padding: 1.5rem;
}
```

#### 3.3 狀態徽章

```css
.status-badge {
    display: inline-flex;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
}

.status-badge.success { background: rgba(76,175,80,0.1); color: #4CAF50; }
.status-badge.warning { background: rgba(255,152,0,0.1); color: #FF9800; }
.status-badge.error { background: rgba(244,67,54,0.1); color: #F44336; }
```

---

### 4. 響應式設計斷點

| 斷點名稱 | 寬度範圍 | 主要變化 |
|----------|----------|----------|
| Desktop | ≥1200px | 完整佈局，側邊欄展開 |
| Tablet | 768px - 1199px | 側邊欄收合，KPI 卡片 2 列 |
| Mobile | <768px | 單列佈局，隱藏側邊欄 |

---

### 5. 動畫規範

#### 5.1 過渡動畫

```css
/* 標準過渡 */
transition: all 0.2s ease;

/* 懸停效果 */
.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* 點擊效果 */
.btn:active {
    transform: scale(0.98);
}
```

#### 5.2 載入動畫

```css
/* 骨架屏動畫 */
@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}

.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}
```

---

### 6. 無障礙設計規範

#### 6.1 色彩對比度

- 主要文字與背景對比度 ≥ 4.5:1
- 大型文字對比度 ≥ 3:1
- 互動元素對比度 ≥ 3:1

#### 6.2 焦點狀態

```css
:focus-visible {
    outline: 2px solid #63A2B0;
    outline-offset: 2px;
}
```

#### 6.3 鍵盤導航

- 所有互動元素可通過 Tab 鍵導航
- 支援 Enter/Space 鍵觸發按鈕
- 支援 Escape 鍵關閉對話框

---

## 📱 頁面設計說明

### 1. 主儀表板 (Dashboard)

**檔案**: [`MVP_UIUX_DESIGN_V2.html`](./MVP_UIUX_DESIGN_V2.html)

**功能區塊**:
- **Header**: 導航列、用戶資訊、通知
- **Sidebar**: 主選單、服務中心、系統設定
- **KPI Cards**: ESG 三維度評分 + 總評分
- **Bento Grid**: 趨勢圖表、快速操作、近期活動
- **Data Table**: ESG 指標明細

**設計亮點**:
- 便當盒式模組化佈局
- 清晰的視覺層級
- 即時數據視覺化

---

### 2. 氣候風險分析 (Climate Risk)

**檔案**: [`MVP_UIUX_CLIMATE_RISK.html`](./MVP_UIUX_CLIMATE_RISK.html)

**功能區塊**:
- **Summary Cards**: 總風險評分、高風險項目數、實體/轉型風險指數
- **Risk Matrix**: 5x5 風險矩陣圖（機率 x 影響）
- **Key Risks**: 關鍵風險項目清單
- **Scenario Analysis**: 1.5°C / 2°C / 4°C 情境分析
- **Risk Table**: 風險項目明細與改善進度

**設計亮點**:
- 直觀的風險矩陣視覺化
- 情境分析切換功能
- 風險等級色彩編碼

---

### 3. 永續報告中心 (Report Center)

**檔案**: [`MVP_UIUX_REPORT_CENTER.html`](./MVP_UIUX_REPORT_CENTER.html)

**功能區塊**:
- **Stats Row**: 總報告數、範本數、待審核、已發布、已歸檔
- **Report List**: 報告列表與狀態
- **Quick Create**: 快速建立新報告
- **Templates**: 熱門範本庫
- **Calendar**: 行事曆與截止日期

**設計亮點**:
- 清晰的報告狀態追蹤
- 整合的行事曆功能
- 快速建立工作流程

---

## 🔧 技術實現建議

### 1. CSS 變數配置

```css
:root {
    /* Primary */
    --primary-500: #63A2B0;
    --primary-100: #E5F4F8;
    
    /* ESG Colors */
    --esg-environmental: #4CAF50;
    --esg-social: #9C27B0;
    --esg-governance: #3F51B5;
    
    /* Functional */
    --success: #4CAF50;
    --warning: #FF9800;
    --error: #F44336;
    --info: #2196F3;
    
    /* Shadows */
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
    
    /* Radius */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 16px;
}
```

### 2. React/Tailwind 元件範例

```tsx
// KPI Card Component
const KPICard = ({ icon, value, label, trend, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${color}`}>
                {icon}
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
        </div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600 mt-1">{label}</div>
    </div>
);
```

---

## 📚 相關文件

- [系統 UI/UX 規格書](./SYSTEM_UIUX_SPECIFICATION.md)
- [ESG 服務頁面 UI/UX 規範](./ESG_SERVICES_UIUX_SPECIFICATION.md)
- [使用者體驗流程設計](./ESG_GO_USER_EXPERIENCE_DESIGN.md)
- [2026 產品藍圖](./ESGSS_2026_ROADMAP.md)

---

**文件維護**: 設計團隊  
**最後更新**: 2026-02-13
