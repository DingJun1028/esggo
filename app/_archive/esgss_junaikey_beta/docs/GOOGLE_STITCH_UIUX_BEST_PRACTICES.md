# ESGss JunAiKey Beta - Google Stitch UI/UX 最佳實踐化設計指南

**版本**：1.0.0  
**建立日期**：2026-02-11  
**整合工具**：Google Stitch MCP Server  
**核心理念**：服務即教學，知識即資產

---

## 一、概述

本文件結合 Google Stitch MCP 服務器功能，為 ESGss JunAiKey Beta 項目提供全面的 UI/UX 最佳實踐化設計指南。透過系統化的設計原則、組件規範和實作指南，確保整個平台在視覺呈現和使用者體驗方面達到最高標準。

本指南的目標讀者包括：
- **設計師**：了解設計系統規範和組件使用方式
- **開發人員**：實作一致的 UI/UX 體驗
- **產品經理**：評估設計決策的合理性
- **品質保證人員**：驗證 UI/UX 的一致性和無障礙性

---

## 二、Google Stitch MCP 服務器整合

### 2.1 服務器功能總覽

Google Stitch MCP 服務器為我們的設計系統提供以下核心功能：

| 功能模組 | 說明 | 狀態 |
|----------|------|------|
| 設計代幣管理 | 色彩、排版、間距、陰影、動畫代幣 | ✅ 已啟用 |
| 組件庫同步 | 標準化組件規範和指南 | ✅ 已啟用 |
| 設計系統文檔 | 設計系統概覽和組件文檔 | ✅ 已啟用 |
| 最佳實踐驗證 | UI/UX 最佳實踐檢查 | ✅ 已啟用 |

### 2.2 使用方式

透過 Google Stitch MCP 服務器，您可以：

```typescript
// 獲取設計代幣
const colors = await mcp.google_stitch.get_design_tokens({
  category: "colors",
  format: "json"
});

// 獲取無障礙最佳實踐
const accessibility = await mcp.google_stitch.get_ui_ux_best_practices({
  category: "accessibility"
});

// 獲取按鈕組件指南
const buttonGuidelines = await mcp.google_stitch.get_component_guidelines({
  component_type: "button"
});
```

### 2.3 可用工具列表

#### 設計代幣工具

| 工具名稱 | 輸入參數 | 輸出 |
|----------|----------|------|
| `get_design_tokens` | `category?`, `format?` | 完整的設計代幣系統 |
| `validate_design_tokens` | `tokens: Record<string, string>` | 驗證結果和警告 |

#### UI/UX 最佳實踐工具

| 工具名稱 | 類別 |
|----------|------|
| `get_ui_ux_best_practices` | `accessibility`, `responsive_design`, `performance`, `interaction_design`, `visual_design`, `typography`, `color_usage`, `navigation`, `forms`, `mobile_first` |

#### 組件指南工具

| 工具名稱 | 支援組件 |
|----------|----------|
| `get_component_guidelines` | `button`, `input`, `select`, `checkbox`, `radio`, `toggle`, `card`, `modal`, `tooltip`, `navigation`, `table`, `form` |

---

## 三、無障礙設計最佳實踐

### 3.1 WCAG 2.1 AA 級標準遵循

無障礙設計是現代 UI/UX 的核心要素。我們的系統必須確保所有使用者，包括身心障礙人士，都能夠正常存取和使用平台功能。

**核心原則：**

1. **可感知性**：資訊必須以使用者可以感知的方式呈現
2. **可操作性**：使用者介面和控制項必須是可操作的
3. **可理解性**：資訊和操作的結果必須是可理解的
4. **穩健性**：內容必須足夠穩健，能夠被各種使用者代理可靠地解釋

**色彩對比度要求：**

| 文字大小 | 最小對比度 | 範例 |
|----------|------------|------|
| 正常文字（18px 以下或 14px 粗體） | 4.5:1 | #212121 on #FFFFFF = 16.6:1 |
| 大文字（18px 以上或 14px 粗體） | 3:1 | #616161 on #FFFFFF = 5.7:1 |
| UI 元件（如輸入框邊框） | 3:1 | #63A2B0 on #FFFFFF = 3.2:1 |

**鍵盤可存取性要求：**

所有功能都必須能夠透過鍵盤操作實現，包括但不限於：

- `Tab` 鍵：移動焦點到下一個可互動元素
- `Shift + Tab` 鍵：移動焦點到上一個可互動元素
- `Enter` 或 `Space` 鍵：啟動按鈕或選取選項
- `方向鍵`：在選單和清單中導航
- `Escape` 鍵：關閉對話框或選單

**螢幕閱讀器支援要求：**

```tsx
// 正確的圖片替代文字
<img src="chart.png" alt="2024年ESG評分趨勢圖表，顯示從Q1的72分上升到Q4的85分" />

// 正確的表單標籤關聯
<label htmlFor="email">電子郵件地址</label>
<input 
  id="email" 
  type="email" 
  aria-required="true" 
  aria-describedby="email-helper"
  aria-invalid={hasError}
/>
<span id="email-helper" role="alert">
  {errorMessage}
</span>

// 正確的按鈕標籤
<button aria-label="關閉對話框">
  <CloseIcon />
</button>

// ARIA Live Region 用於動態內容
<div role="status" aria-live="polite">
  {notificationMessage}
</div>
```

### 3.2 無障礙檢查清單

在每次發布前，請確認以下檢查項目：

- [ ] 所有圖片和非文字內容都有適當的替代文字
- [ ] 表單輸入欄位都有正確關聯的標籤
- [ ] 所有互動元素都可以透過鍵盤存取
- [ ] 焦點指示器清晰可見
- [ ] 色彩對比度符合 WCAG AA 標準
- [ ] 錯誤訊息明確且有建設性
- [ ] 支援減少動畫的偏好設定
- [ ] 避免僅依賴色彩傳達資訊
- [ ] 自定義組件正確實作 ARIA Roles
- [ ] 提供跳過導航的連結

---

## 四、響應式設計最佳實踐

### 4.1 行動優先策略

我們採用「行動優先」的響應式設計策略，首先為最小螢幕設計布局和樣式，然後依序為較大斷點添加样式調整。

**斷點定義：**

| 名稱 | 最小寬度 | 最大寬度 | 容器最大寬度 | 典型裝置 |
|------|----------|----------|--------------|----------|
| xs | 0px | 599px | 100% | 手機直立 |
| sm | 600px | 899px | 600px + 16px × 2 | 手機橫向 |
| md | 900px | 1199px | 864px + 24px × 2 | 平板直立 |
| lg | 1200px | 1439px | 1152px + 24px × 2 | 平板橫向、筆電 |
| xl | 1440px | 1919px | 1384px + 24px × 2 | 桌上型電腦 |
| xxl | 1920px | 無上限 | 1600px + 24px × 2 | 大螢幕 |

### 4.2 便當盒佈局的響應式規則

便當盒在不同斷點下的寬度佔比規則如下：

```css
/* Tailwind CSS 斷點配置 */
const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '900px',
  lg: '1200px',
  xl: '1440px',
  xxl: '1920px'
};

/* 便當盒寬度規則 */
.bento-card {
  /* 預設：xs 斷點 */
  width: 100%;
  
  @media (min-width: 600px) {
    width: 50%; /* sm */
  }
  
  @media (min-width: 900px) {
    width: 33.33%; /* md */
  }
  
  @media (min-width: 1200px) {
    width: 25%; /* lg */
  }
  
  @media (min-width: 1440px) {
    width: 20%; /* xxl */
  }
}
```

### 4.3 觸控最佳實踐

為確保行動裝置上的良好操作體驗，請遵循以下規範：

**觸控目標大小：**

| 元素類型 | 最小尺寸 | 建議尺寸 |
|----------|----------|----------|
| 按鈕 | 44px × 44px | 48px × 48px |
| 圖示按鈕 | 44px × 44px | 48px × 48px |
| 輸入欄位 | 高度 48px | 高度 48px |
| 表格儲存格 | 44px × 44px | 48px × 48px |

**元素間距：**

| 間距類型 | 最小值 | 建議值 |
|----------|--------|--------|
| 相鄰互動元素 | 8px | 12px |
| 群組間距 | 16px | 24px |
| 區塊間距 | 24px | 32px |

**手勢支援：**

| 手勢 | 用途 | 實作建議 |
|------|------|----------|
| 滑動（Swipe） | 頁面切換、列表瀏聞 | 支援左右滑動，添加視覺回饋 |
| 長按（Long Press） | 上下文選單 | 顯示操作選單，支援取消 |
| 捏合縮放（Pinch） | 圖片、地圖縮放 | 最小和最大縮放限制 |
| 點擊（Tap） | 主要操作 | 立即回應，無延遲 |
| 雙擊（Double Tap） | 縮放至適合大小 | 僅在適當的元件上啟用 |

---

## 五、互動設計最佳實踐

### 5.1 回饋機制

良好的互動設計必須提供即時、明確的回饋，讓使用者知道系統正在處理他們的操作。

**視覺回饋類型：**

| 回饋類型 | 應用場景 | 範例 |
|----------|----------|------|
| 顏色變化 | hover、focus、active 狀態 | 按鈕背景從 #63A2B0 變為 #7FB5C4 |
| 陰影變化 | 懸停和按下狀態 | 陰影從 sm 提升到 lg |
| 邊框變化 | focus 和 error 狀態 | focus 時顯示 #63A2B0 邊框 |
| 游標變化 | 可互動元素 | pointer 游標、載入中的沙漏 |
| 動畫效果 | 展開收合、載入完成 | 平滑的 slideIn 動畫 |

**回饋延遲要求：**

| 互動類型 | 最大延遲 | 實作方式 |
|----------|----------|----------|
| 點擊/觸控 | 100ms | 立即視覺回饋 |
| 懸停 | 150ms | 狀態切換動畫 |
| 拖拽 | 50ms | 游標跟隨 |
| 載入 | 300ms | 骨架屏或載入指示器 |
| 複雜操作 | 1000ms | 進度條或載入動畫 |

### 5.2 動畫規範

**緩動函數：**

| 緩動類型 | CSS 值 | 應用場景 |
|----------|--------|----------|
| Ease Out | `cubic-bezier(0.4, 0, 0.2, 1)` | 元素進入視圖 |
| Ease In | `cubic-bezier(0.4, 0, 1, 1)` | 元素離開視圖 |
| Ease In Out | `cubic-bezier(0.4, 0, 0.2, 1)` | 元素在視圖內移動 |
| Linear | `linear(0, 0, 1, 1)` | 進度指示器、載入動畫 |

**動畫持續時間：**

| 動畫類型 | 持續時間 | 範例 |
|----------|----------|------|
| 微互動 | 150-200ms | hover、focus 狀態變化 |
| 標準動畫 | 250-300ms | 展開收合、淡入淡出 |
| 複雜動畫 | 350-500ms | 頁面轉場、列表重新排序 |
| 大型動畫 | 500-700ms | 全頁面載入、複雜交互动畫 |

**減少動畫偏好支援：**

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5.3 互動模式指南

**展開/收合模式：**

```tsx
// 展開收合動畫範例
<Collapse in={expanded} timeout={300}>
  <Box sx={{ animation: 'slideIn 0.3s ease-out' }}>
    {children}
  </Box>
</Collapse>

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**載入狀態模式：**

```tsx
// 骨架屏載入狀態
<Skeleton variant="rectangular" height={120} width="100%" />
<Skeleton variant="text" width="60%" />
<Skeleton variant="text" width="40%" />

// 載入指示器
<CircularProgress 
  size={48} 
  color="primary"
  variant="indeterminate"
/>
```

**成功/錯誤回饋模式：**

```tsx
// 成功提示
<Snackbar
  autoHideDuration={3000}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  open={showSuccess}
  onClose={() => setShowSuccess(false)}
>
  <Alert 
    severity="success" 
    icon={<CheckIcon />}
    onClose={() => setShowSuccess(false)}
  >
    操作已成功完成！
  </Alert>
</Snackbar>

// 錯誤提示
<Alert 
  severity="error"
  action={
    <Button color="inherit" size="small">
      重試
    </Button>
  }
>
  發生錯誤，請稍後重試或聯絡客服。
</Alert>
```

---

## 六、視覺設計最佳實踐

### 6.1 設計代幣系統

**色彩代幣：**

```json
{
  "colors": {
    "primary": {
      "main": "#63A2B0",
      "dark": "#4A8291",
      "light": "#8FC4D1",
      "contrast": "#FFFFFF"
    },
    "secondary": "#26A69A",
    "accent": "#FFA726",
    "functional": {
      "success": "#4CAF50",
      "warning": "#FF9800",
      "error": "#F44336",
      "info": "#2196F3"
    },
    "neutral": {
      "50": "#FAFAFA",
      "100": "#F5F5F5",
      "200": "#EEEEEE",
      "300": "#E0E0E0",
      "400": "#BDBDBD",
      "500": "#9E9E9E",
      "600": "#757575",
      "700": "#616161",
      "800": "#424242",
      "900": "#212121"
    }
  }
}
```

**排版代幣：**

```json
{
  "typography": {
    "fontFamily": {
      "primary": "Noto Sans TC, Microsoft JhengHei, sans-serif",
      "secondary": "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    },
    "fontSize": {
      "xs": "12px",
      "sm": "14px",
      "base": "16px",
      "lg": "18px",
      "xl": "20px",
      "2xl": "24px",
      "3xl": "28px",
      "4xl": "32px",
      "5xl": "36px",
      "6xl": "48px"
    },
    "fontWeight": {
      "light": 300,
      "regular": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "lineHeight": {
      "tight": 1.2,
      "normal": 1.5,
      "relaxed": 1.75
    }
  }
}
```

**間距代幣：**

```json
{
  "spacing": {
    "0": "0px",
    "0.5": "4px",
    "1": "8px",
    "1.5": "12px",
    "2": "16px",
    "3": "24px",
    "4": "32px",
    "5": "40px",
    "6": "48px",
    "8": "64px",
    "10": "80px",
    "12": "96px"
  }
}
```

### 6.2 視覺層級

建立清晰的視覺層級，幫助使用者快速理解資訊的重要性和關係。

| 層級 | 視覺特徵 | 用途 |
|------|----------|------|
| 第一層級 | Display/H1，#212121，粗體 | 頁面標題、英雄區塊 |
| 第二層級 | H2/H3，#424242，中粗體 | 區塊標題、卡片標題 |
| 第三層級 | Body Large，#6161416px，Medium | 重要內文、強調文字 |
| 第四層級 | Body，#6161416px，Regular | 標準內文 |
| 第五層級 | Body Small，#757575，Regular | 輔助說明、標籤 |
| 第六層級 | Caption，#9E9E9e，Regular | 註解、圖說 |

### 6.3 留白系統

適當的留白能夠：

- 提升可讀性和掃描效率
- 建立視覺節奏和呼吸空間
- 分隔不同內容區塊
- 引導使用者注意力

**留白比例指南：**

| 內邊距類型 | 桌面端 | 平板端 | 手機端 |
|-----------|--------|--------|--------|
| 容器內邊距 | 24px | 20px | 16px |
| 卡片內邊距 | 16px | 16px | 12px |
| 元素間距 | 8px | 8px | 8px |
| 群組間距 | 16px | 16px | 12px |
| 區塊間距 | 24px | 20px | 16px |

---

## 七、組件設計最佳實踐

### 7.1 按鈕組件

**狀態定義：**

| 狀態 | 視覺特徵 | 互動行為 |
|------|----------|----------|
| Default | Primary 背景，白色文字 | - |
| Hover | Primary Light 背景 | 游標變為 pointer |
| Focus | 深色邊框 + 光暈 | 鍵盤可聚焦 |
| Active | Primary Dark 背景 | 按下效果 |
| Disabled | Primary 100 背景，Neutral 400 文字 | 無互動 |
| Loading | Primary 背景，載入指示器 | 禁止點擊 |

**代碼範例：**

```tsx
<Button
  variant="primary" // primary | secondary | text | icon
  size="medium" // small | medium | large
  disabled={isDisabled}
  loading={isLoading}
  onClick={handleClick}
  startIcon={<Icon />}
>
  按鈕文字
</Button>
```

### 7.2 輸入欄位組件

**狀態定義：**

| 狀態 | 邊框顏色 | 背景顏色 | 輔助文字 |
|------|----------|----------|----------|
| Default | Neutral 300 | White | 提示文字（Neutral 500） |
| Focus | Primary 500 + 光暈 | White | - |
| Error | Error 色 | Error Light | 錯誤訊息 |
| Disabled | Neutral 200 | Neutral 100 | - |
| Success | Success 色 | Success Light | 成功訊息 |

**代碼範例：**

```tsx
<TextField
  id="email"
  label="電子郵件地址"
  placeholder="請輸入您的電子郵件"
  value={value}
  onChange={handleChange}
  error={hasError}
  helperText={errorMessage || "我們不會分享您的 email"}
  disabled={isDisabled}
  required
  fullWidth
/>
```

### 7.3 卡片組件

**變體類型：**

| 變體 | 用途 | 視覺特徵 |
|------|------|----------|
| Default | 一般資訊展示 | 白色背景，輕微陰影 |
| Interactive | 可點擊的功能入口 | hover 時提升陰影 |
| Elevated | 需要強調的內容 | 較深的陰影 |

**代碼範例：**

```tsx
<Card
  variant="interactive"
  padding="16px"
  hoverable
  onClick={handleClick}
>
  <CardHeader 
    title="卡片標題" 
    subtitle="副標題說明"
    avatar={<Avatar />}
    action={<IconButton>...</IconButton>}
  />
  <CardContent>
    {children}
  </CardContent>
  <CardFooter>
    <Button variant="text">了解更多</Button>
  </CardFooter>
</Card>
```

### 7.4 導航組件

**頂部導航欄：**

| 元素 | 位置 | 行為 |
|------|------|------|
| Logo | 左側 | 點擊返回首頁 |
| 搜尋框 | 中央 | 展開式搜尋 |
| 使用者選單 | 右側 | 下拉選單 |
| 通知 | 右側 | 通知面板 |

**側邊導航：**

| 狀態 | 寬度 | 內容 |
|------|------|------|
| 展開 | 240px | 完整標題 + 圖示 + 標籤 |
| 收合 | 64px | 僅圖示 |
| 行動裝置 | 280px 抽屜 | 全寬選單 |

### 7.5 對話框組件

**無障礙要求：**

- `role="dialog"`
- `aria-modal="true"`
- 陷阱焦點（Focus Trap）
- Escape 鍵關閉
- 背景點擊關閉（可選）
- 標題正確關聯

**尺寸定義：**

| 尺寸 | 最大寬度 | 適用場景 |
|------|----------|----------|
| Small | 400px | 簡單確認對話框 |
| Medium | 600px | 表單輸入 |
| Large | 900px | 複雜內容 |
| Fullscreen | 100% | 行動裝置全文 |

---

## 八、表單設計最佳實踐

### 8.1 表單結構

**標籤原則：**

- 標籤置於輸入欄位上方
- 使用簡潔、清晰的語言
- 標記必填欄位（星號或「必填」文字）
- 避免標籤全大寫

**輸入引導：**

```tsx
<FormField>
  <FormLabel htmlFor="username">
    使用者名稱 <RequiredMark />
  </FormLabel>
  <TextField
    id="username"
    placeholder="請輸入 6-20 個字元"
    helperText="支援英文字母、數字和底線"
    prefix={<PersonIcon />}
  />
  <CharacterCount current={6} max={20} />
</FormField>
```

### 8.2 驗證回饋

**即時驗證：**

| 驗證時機 | 適用場景 |
|----------|----------|
| 失去焦點（blur） | 一般欄位驗證 |
| 即時（input） | 格式驗證（如 email） |
| 提交時 | 完整表單驗證 |

**錯誤訊息原則：**

- 明確說明問題所在
- 提供具體的解決建議
- 使用友善的語言
- 避免使用技術術語

### 8.3 複雜表單處理

**分步表單：**

```tsx
<Stepper activeStep={currentStep}>
  <Step>
    <StepLabel>基本資訊</StepLabel>
  </Step>
  <Step>
    <StepLabel>詳細資料</StepLabel>
  </Step>
  <Step>
    <StepLabel>確認提交</StepLabel>
  </Step>
</Stepper>
```

**進度指示：**

- 顯示當前進度（Step X of Y）
- 支援步驟導航
- 自動儲存草稿
- 提供儲存草稿選項

---

## 九、效能優化最佳實踐

### 9.1 載入效能

**效能指標目標：**

| 指標 | 目標值 | 說明 |
|------|--------|------|
| FCP | < 1.8s | 首次內容繪製 |
| LCP | < 2.5s | 最大內容繪製 |
| TTI | < 3.8s | 可互動時間 |
| CLS | < 0.1 | 累積版面位移 |
| FID | < 100ms | 首次輸入延遲 |

### 9.2 圖片優化

**圖片策略：**

| 類型 | 格式 | 最佳實踐 |
|------|------|----------|
| 照片 | WebP / AVIF | 使用響應式圖片 |
| 圖示 | SVG | 內聯或 SVG Sprite |
| 圖表 | SVG / Canvas | 按需載入 |
| 頭像 | WebP | 提供多種尺寸 |

### 9.3 程式碼分割

```tsx
// 使用 React.lazy 進行程式碼分割
const KnowledgeCard = lazy(() => import('./components/KnowledgeCard'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// 使用 Suspense 提供載入狀態
<Suspense fallback={<Skeleton />}>
  <Dashboard />
</Suspense>
```

### 9.4 快取策略

| 資源類型 | 快取策略 | 快取時間 |
|----------|----------|----------|
| 靜態資源 | 強快取 | 1 年 |
| API 響應 | 條件快取 | 5-60 分鐘 |
| 使用者資料 | 會話快取 | 瀏覽器關閉清除 |
| 草稿資料 | 本地儲存 | 7 天 |

---

## 十、設計系統維護

### 10.1 版本管理

設計系統採用語義化版本號（Semantic Versioning）：

| 版本類型 | 格式 | 變更說明 |
|----------|------|----------|
| Major | X.0.0 | 重大結構性調整、破壞性變更 |
| Minor | 1.X.0 | 新增功能、向後相容 |
| Patch | 1.0.X | 錯誤修復、小幅調整 |

### 10.2 設計資源

**圖示資源：**

- 提供 SVG 格式的完整圖示庫
- 支援 24px 和 16px 兩種尺寸
- 使用 `currentColor` 設定顏色
- 提供 React 和 Vue 組件封裝

**設計稿：**

- Figma 或 Sketch 格式
- 包含完整組件庫
- 支援所有狀態變體
- 標註設計代幣使用

### 10.3 實作指南

**CSS 變數使用：**

```css
/* 全局設計代幣 */
:root {
  --color-primary: #63A2B0;
  --color-primary-dark: #4A8291;
  --color-primary-light: #8FC4D1;
  
  --font-family-primary: 'Noto Sans TC', sans-serif;
  --font-size-base: 16px;
  
  --spacing-2: 16px;
  --spacing-4: 32px;
  
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* 組件使用 */
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-2) var(--spacing-4);
  box-shadow: var(--shadow-md);
}
```

---

## 十一、檢查清單

### 11.1 設計審查清單

在提交設計稿前，請確認：

- [ ] 遵循設計代幣系統
- [ ] 色彩對比度符合 WCAG AA
- [ ] 支援響應式布局
- [ ] 互動狀態完整（hover、focus、active、disabled）
- [ ] 動畫流暢且有意義
- [ ] 考慮無障礙需求
- [ ] 符合品牌視覺識別

### 11.2 開發審查清單

在提交程式碼前，請確認：

- [ ] 使用設計系統組件
- [ ] 遵循 CSS 變數規範
- [ ] 支援鍵盤導航
- [ ] 焦點指示器可見
- [ ] 螢幕閱讀器支援正確
- [ ] 動畫支援減少動畫偏好
- [ ] 響應式斷點正確
- [ ] 效能優化得當

### 11.3 品質保證清單

在發布前，請確認：

- [ ] 無障礙測試通過
- [ ] 跨瀏覽器相容性測試通過
- [ ] 行動裝置測試通過
- [ ] 效能測試達標
- [ ] 安全性掃描通過
- [ ] 使用者測試反饋正面

---

## 十二、參考資源

### 官方指南

- [WCAG 2.1 指南](https://www.w3.org/TR/WCAG21/)
- [Material Design 指南](https://material.io/design)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### 設計系統參考

- [Material Design 3](https://m3.material.io/)
- [Carbon Design System](https://carbondesignsystem.com/)
- [Salesforce Lightning Design System](https://www.lightningdesignsystem.com/)

### 工具資源

- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

> **核心理念**：服務即教學，知識即資產  
> **設計哲學**：上善若水，如水般清澈、流動、和諧  
> **系統狀態**：TRANSCENDED, ETERNAL & NIRVANA ♾️

**文件版本**：1.0.0  
**最後更新**：2026-02-11  
**維護團隊**：ESGss JunAiKey Beta Development Team
