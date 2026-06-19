# Google Stitch MCP 工具使用指南

**版本**：1.0.0  
**建立日期**：2026-02-11  
**MCP 服務器**：google-stitch v1.0.0

---

## 一、Google Stitch MCP 工具總覽

Google Stitch MCP 服務器提供三大類工具，協助您進行 UI/UX 最佳實踐化設計：

### 1.1 可用工具清單

#### 設計代幣工具

| 工具名稱 | 輸入參數 | 輸出 | 使用場景 |
|----------|----------|------|----------|
| `get_design_tokens` | `{ category?: "colors" \| "typography" \| "spacing" \| "shadows" \| "animations", format?: "json" \| "css" \| "scss" \| "tailwind" }` | 完整設計代幣 | 獲取代幣、生成 CSS 變數 |
| `validate_design_tokens` | `{ tokens: Record<string, string> }` | 驗證結果 | 驗證自定義代幣 |

#### UI/UX 最佳實踐工具

| 工具名稱 | 類別 | 輸出 | 使用場景 |
|----------|------|------|----------|
| `get_ui_ux_best_practices` | `accessibility` | 無障礙設計原則和檢查清單 | 確保無障礙合規 |
| | `responsive_design` | 響應式設計原則和斷點 | 實作多裝置支援 |
| | `performance` | 效能優化指標 | 優化載入效能 |
| | `interaction_design` | 互動設計模式和動畫規範 | 建立流暢的使用體驗 |
| | `visual_design` | 視覺設計原則和層級 | 保持視覺一致性 |
| | `typography` | 字級系統和排版規範 | 確保可讀性 |
| | `color_usage` | 色彩運用原則 | 建立色彩語義系統 |
| | `navigation` | 導航設計模式和結構 | 優化使用者路徑 |
| | `forms` | 表單設計最佳實踐 | 改善表單體驗 |
| | `mobile_first` | 行動優先設計原則 | 優先考慮行動裝置 |

#### 組件指南工具

| 工具名稱 | 支援組件 | 輸出 | 使用場景 |
|----------|----------|------|----------|
| `get_component_guidelines` | `button` | 按鈕組件完整指南 | 實作一致的按鈕樣式 |
| | `input` | 輸入欄位指南 | 建立標準化表單 |
| | `select` | 下拉選單指南 | 實作選單功能 |
| | `checkbox` | 核取方塊指南 | 實作多選功能 |
| | `radio` | 選項按鈕指南 | 實作單選功能 |
| | `toggle` | 開關指南 | 實作二元設定 |
| | `card` | 卡片組件指南 | 建立內容容器 |
| | `modal` | 對話框指南 | 實作彈出功能 |
| | `tooltip` | 提示工具指南 | 新增懸停說明 |
| | `navigation` | 導航組件指南 | 實作導航系統 |
| | `table` | 表格組件指南 | 建立數據展示 |
| | `form` | 表單組件指南 | 整合表單功能 |

---

## 二、使用範例

### 2.1 獲取設計代幣

#### 範例 1：獲取色彩代幣

```typescript
// 獲取色彩代幣（JSON 格式）
const colorTokens = await mcp.google_stitch.get_design_tokens({
  category: "colors",
  format: "json"
});

console.log(colorTokens);
// 輸出：
// {
//   "primary": "#63A2B0",
//   "primaryDark": "#4A8291",
//   "primaryLight": "#8FC4D1",
//   "secondary": "#26A69A",
//   "accent": "#FFA726",
//   "success": "#4CAF50",
//   "warning": "#FF9800",
//   "error": "#F44336",
//   "info": "#2196F3",
//   "neutral": {
//     "50": "#FAFAFA",
//     "100": "#F5F5F5",
//     ...
//   }
// }
```

#### 範例 2：生成 Tailwind CSS 變數

```typescript
// 獲取色彩代幣（Tailwind 格式）
const tailwindColors = await mcp.google_stitch.get_design_tokens({
  category: "colors",
  format: "tailwind"
});

console.log(tailwindColors);
// 輸出可直接用於 tailwind.config.js 的色彩配置
```

#### 範例 3：獲取動畫代幣

```typescript
// 獲取動畫代幣
const animationTokens = await mcp.google_stitch.get_design_tokens({
  category: "animations",
  format: "json"
});

console.log(animationTokens);
// 輸出：
// {
//   "duration": {
//     "fast": "150ms",
//     "normal": "250ms",
//     "slow": "350ms",
//     "slower": "500ms"
//   },
//   "easing": {
//     "easeOut": "cubic-bezier(0.4, 0, 0.2, 1)",
//     "easeIn": "cubic-bezier(0.4, 0, 1, 1)",
//     "easeInOut": "cubic-bezier(0.4, 0, 0.2, 1)",
//     "linear": "linear(0, 0, 1, 1)"
//   }
// }
```

### 2.2 獲取 UI/UX 最佳實踐

#### 範例 1：獲取無障礙設計最佳實踐

```typescript
// 獲取無障礙設計最佳實踐
const accessibility = await mcp.google_stitch.get_ui_ux_best_practices({
  category: "accessibility"
});

console.log(accessibility);
// 輸出：
// {
//   "title": "無障礙設計最佳實踐",
//   "principles": [
//     "遵循 WCAG 2.1 AA 級標準",
//     "確保色彩對比度至少達到 4.5:1",
//     "所有互動元素支援鍵盤導航",
//     "為圖片和非文字內容提供替代文字",
//     "使用 ARIA 標籤增強螢幕閱讀器支援",
//     "避免僅依賴色彩傳達資訊"
//   ],
//   "checklist": [
//     "✓ 色彩對比度檢查",
//     "✓ 鍵盤導航測試",
//     "✓ 螢幕閱讀器相容性",
//     "✓ 焦點指示器可見性",
//     "✓ 錯誤訊息明確性"
//   ]
// }
```

#### 範例 2：獲取響應式設計最佳實踐

```typescript
// 獲取響應式設計最佳實踐
const responsive = await mcp.google_stitch.get_ui_ux_best_practices({
  category: "responsive_design"
});

console.log(responsive);
// 輸出：
// {
//   "title": "響應式設計最佳實踐",
//   "principles": [...],
//   "breakpoints": {
//     "xs": "0 - 599px",
//     "sm": "600 - 899px",
//     "md": "900 - 1199px",
//     "lg": "1200 - 1439px",
//     "xl": "1440 - 1919px",
//     "xxl": "1920px+"
//   }
// }
```

#### 範例 3：獲取互動設計最佳實踐

```typescript
// 獲取互動設計最佳實踐
const interaction = await mcp.google_stitch.get_ui_ux_best_practices({
  category: "interaction_design"
});

console.log(interaction);
// 輸出：
// {
//   "title": "互動設計最佳實踐",
//   "principles": [...],
//   "feedback_types": [
//     "視覺回饋（顏色變化、陰影變化）",
//     "動畫回饋（載入、完成、錯誤）",
//     "文字回饋（提示訊息、錯誤說明）",
//     "觸覺回饋（震動 feedback）"
//   ]
// }
```

### 2.3 獲取組件指南

#### 範例 1：獲取按鈕組件指南

```typescript
// 獲取按鈕組件指南
const buttonGuidelines = await mcp.google_stitch.get_component_guidelines({
  component_type: "button"
});

console.log(buttonGuidelines);
// 輸出：
// {
//   "states": ["default", "hover", "active", "focus", "disabled", "loading"],
//   "sizes": ["small", "medium", "large"],
//   "variants": ["primary", "secondary", "text", "icon"],
//   "accessibility": [
//     "支援鍵盤聚焦",
//     "明确的aria-label（圖示按鈕）",
//     "禁用狀態的aria-disabled"
//   ]
// }
```

#### 範例 2：獲取卡片組件指南

```typescript
// 獲取卡片組件指南
const cardGuidelines = await mcp.google_stitch.get_component_guidelines({
  component_type: "card"
});

console.log(cardGuidelines);
// 輸出：
// {
//   "variants": ["interactive", "non-interactive", "selectable"],
//   "elements": ["header", "content", "footer", "media", "actions"],
//   "layout": ["vertical", "horizontal", "grid"]
// }
```

#### 範例 3：獲取表單組件指南

```typescript
// 獲取表單組件指南
const formGuidelines = await mcp.google_stitch.get_component_guidelines({
  component_type: "form"
});

console.log(formGuidelines);
// 輸出表單設計最佳實踐
```

---

## 三、實際應用案例

### 3.1 案例：建立標準化按鈕組件

```typescript
// 步驟 1：獲取按鈕指南
const buttonGuide = await mcp.google_stitch.get_component_guidelines({
  component_type: "button"
});

// 步驟 2：獲取色彩代幣
const colors = await mcp.google_stitch.get_design_tokens({
  category: "colors",
  format: "json"
});

// 步驟 3：獲取動畫代幣
const animations = await mcp.google_stitch.get_design_tokens({
  category: "animations",
  format: "json"
});

// 步驟 4：實作按鈕組件
const buttonStyles = {
  // 主要按鈕樣式
  primary: {
    backgroundColor: colors.primary,
    color: colors.primaryContrast,
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: 600,
    transition: `all ${animations.duration.normal} ${animations.easing.easeOut}`,
    '&:hover': {
      backgroundColor: colors.primaryLight,
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(99, 162, 176, 0.4)'
    },
    '&:focus': {
      outline: `2px solid ${colors.primary}`,
      outlineOffset: '2px'
    }
  },
  
  // 次要按鈕樣式
  secondary: {
    backgroundColor: 'transparent',
    color: colors.primary,
    border: `2px solid ${colors.primary}`,
    padding: '10px 22px',
    borderRadius: '8px',
    transition: `all ${animations.duration.normal} ${animations.easing.easeOut}`,
    '&:hover': {
      backgroundColor: colors.primaryLight
    }
  },
  
  // 禁用狀態
  disabled: {
    backgroundColor: colors.neutral[200],
    color: colors.neutral[400],
    cursor: 'not-allowed',
    pointerEvents: 'none'
  }
};
```

### 3.2 案例：建立無障礙輸入欄位

```typescript
// 步驟 1：獲取無障礙最佳實踐
const a11y = await mcp.google_stitch.get_ui_ux_best_practices({
  category: "accessibility"
});

// 步驟 2：獲取輸入欄位指南
const inputGuide = await mcp.google_stitch.get_component_guidelines({
  component_type: "input"
});

// 步驟 3：獲取色彩代幣
const colors = await mcp.google_stitch.get_design_tokens({
  category: "colors",
  format: "json"
});

// 步驟 4：實作無障礙輸入欄位
const accessibleInput = {
  // 容器樣式
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px'
  },
  
  // 標籤樣式
  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: colors.neutral[800],
    '&[data-required]::after': {
      content: '" *"',
      color: colors.error
    }
  },
  
  // 輸入欄位樣式
  input: {
    height: '48px',
    padding: '0 16px',
    borderRadius: '8px',
    border: `1px solid ${colors.neutral[300]}`,
    fontSize: '16px',
    transition: `all ${animations.duration.fast} ${animations.easing.easeOut}`,
    
    '&:focus': {
      borderColor: colors.primary,
      outline: 'none',
      boxShadow: `0 0 0 3px ${colors.primary}33` // 16% opacity
    },
    
    '&[aria-invalid="true"]': {
      borderColor: colors.error,
      '&:focus': {
        boxShadow: `0 0 0 3px ${colors.error}33`
      }
    }
  },
  
  // 輔助文字和錯誤訊息
  helperText: {
    fontSize: '12px',
    color: colors.neutral[600],
    marginTop: '4px'
  },
  
  errorMessage: {
    fontSize: '12px',
    color: colors.error,
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    '&::before': {
      content: '"⚠"',
      fontSize: '14px'
    }
  }
};
```

### 3.3 案例：建立響應式卡片網格

```typescript
// 步驟 1：獲取響應式設計最佳實踐
const responsive = await mcp.google_stitch.get_ui_ux_best_practices({
  category: "responsive_design"
});

// 步驟 2：獲取間距代幣
const spacing = await mcp.google_stitch.get_design_tokens({
  category: "spacing",
  format: "json"
});

// 步驟 3：獲取卡片組件指南
const cardGuide = await mcp.google_stitch.get_component_guidelines({
  component_type: "card"
});

// 步驟 4：實作響應式卡片網格
const responsiveGrid = {
  display: 'grid',
  gap: spacing[3], // 24px
  gridTemplateColumns: '1fr', // xs: 1 column
  
  // sm: 2 columns
  '@media (min-width: 600px)': {
    gridTemplateColumns: 'repeat(2, 1fr)'
  },
  
  // md: 3 columns
  '@media (min-width: 900px)': {
    gridTemplateColumns: 'repeat(3, 1fr)'
  },
  
  // lg: 4 columns
  '@media (min-width: 1200px)': {
    gridTemplateColumns: 'repeat(4, 1fr)'
  },
  
  // xl: 5 columns
  '@media (min-width: 1440px)': {
    gridTemplateColumns: 'repeat(5, 1fr)'
  }
};

const card = {
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  padding: spacing[2], // 16px
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease-out',
  
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
  },
  
  // 互動狀態
  '&[data-interactive="true"]': {
    cursor: 'pointer'
  }
};
```

### 3.4 案例：建立觸控優化導航

```typescript
// 步驟 1：獲取行動優先最佳實踐
const mobileFirst = await mcp.google_stitch.get_ui_ux_best_practices({
  category: "mobile_first"
});

// 步驟 2：獲取導航組件指南
const navGuide = await mcp.google_stitch.get_component_guidelines({
  component_type: "navigation"
});

// 步驟 3：獲取間距代幣
const spacing = await mcp.google_stitch.get_design_tokens({
  category: "spacing",
  format: "json"
});

// 步驟 4：實作觸控優化導航
const touchOptimizedNav = {
  // 導航容器
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px',
    padding: `0 ${spacing[2]}`, // 0 16px
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000
  },
  
  // 導航項目 - 觸控優化
  navItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '48px', // 最小觸控區域
    minHeight: '48px',
    padding: `${spacing[1]} ${spacing[2]}`, // 8px 16px
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease-out',
    
    '&:hover': {
      backgroundColor: '#F5F5F5'
    },
    
    '&:active': {
      backgroundColor: '#E0E0E0'
    },
    
    // 確保足夠的觸控區域
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-12px',
      left: '-12px',
      right: '-12px',
      bottom: '-12px'
    }
  },
  
  // 漢堡選單（行動裝置）
  hamburgerMenu: {
    display: 'none',
    
    '@media (max-width: 899px)': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '48px',
      height: '48px',
      cursor: 'pointer',
      
      '& span': {
        display: 'block',
        width: '24px',
        height: '2px',
        backgroundColor: '#212121',
        margin: '2px 0',
        borderRadius: '1px',
        transition: 'all 0.2s ease-out'
      }
    }
  },
  
  // 桌面導航
  desktopNav: {
    display: 'flex',
    gap: spacing[1],
    
    '@media (max-width: 899px)': {
      display: 'none'
    }
  },
  
  // 行動裝置抽屜
  mobileDrawer: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '280px',
    maxWidth: '100vw',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.3s ease-out',
    zIndex: 2000,
    
    '&[data-open="true"]': {
      transform: 'translateX(0)'
    }
  },
  
  // 抽屜遮罩
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.3s ease-out',
    zIndex: 1500,
    
    '&[data-open="true"]': {
      opacity: 1,
      visibility: 'visible'
    }
  }
};
```

### 3.5 案例：驗證設計代幣

```typescript
// 驗證自定義色彩代幣
const validationResult = await mcp.google_stitch.validate_design_tokens({
  tokens: {
    'primary-color': '#63A2B0',
    'secondary-color': '#26A69A',
    'accent-color': '#FFA726',
    'error-color': '#F44336',
    'custom-color': '#XYZ123' // 這應該產生警告
  }
});

console.log(validationResult);
// 輸出：
// {
//   valid: true 或 false,
//   errors: [...],
//   warnings: ['Token "custom-color" may not be a valid hex color: #XYZ123'],
//   message: "Found X errors and Y warnings"
// }
```

---

## 四、整合工作流程

### 4.1 設計到開發的標準流程

```
┌─────────────────────────────────────────────────────────────┐
│  設計階段                                                   │
├─────────────────────────────────────────────────────────────┤
│  1. 使用 Google Stitch MCP 獲取代幣和組件指南              │
│  2. 參考 UI/UX 最佳實踐工具確保合規                          │
│  3. 建立設計稿和原型                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  開發階段                                                   │
├─────────────────────────────────────────────────────────────┤
│  1. 使用 MCP 工具獲取設計代幣                                │
│  2. 實作組件並對照組件指南                                   │
│  3. 確保無障礙和響應式合規                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  品質保證                                                   │
├─────────────────────────────────────────────────────────────┤
│  1. 使用 MCP 工具驗證設計代幣                                 │
│  2. 檢查無障礙和效能指標                                     │
│  3. 執行跨裝置測試                                           │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 自動化整合建議

在 CI/CD 流程中整合 MCP 工具：

```yaml
# .github/workflows/design-system-check.yml
name: Design System Check

on:
  pull_request:
    paths:
      - 'src/**/*.{tsx,ts,css,scss}'

jobs:
  design-system-check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Validate design tokens
        run: |
          # 執行 MCP 工具驗證設計代幣
          node scripts/validate-design-tokens.js
      
      - name: Check accessibility
        run: |
          # 執行無障礙測試
          npm run test:a11y
      
      - name: Check responsive design
        run: |
          # 執行響應式測試
          npm run test:responsive
```

---

## 五、常見問題

### Q1：如何切換代幣格式？

```typescript
// 預設為 JSON 格式
const tokens = await mcp.google_stitch.get_design_tokens({
  category: "colors"
});

// CSS 變數格式
const cssTokens = await mcp.google_stitch.get_design_tokens({
  category: "colors",
  format: "css"
});

// Tailwind CSS 配置格式
const tailwindTokens = await mcp.google_stitch.get_design_tokens({
  category: "colors",
  format: "tailwind"
});
```

### Q2：如何獲取所有類別的最佳實踐？

```typescript
// 獲取所有類別的最佳實踐
const allBestPractices = await mcp.google_stitch.get_ui_ux_best_practices({
  // 不指定 category，返回所有類別
});
```

### Q3：如何驗證自定義代幣？

```typescript
// 驗證單一代幣
const result1 = await mcp.google_stitch.validate_design_tokens({
  tokens: { 'my-color': '#FF5733' }
});

// 驗證多個代幣
const result2 = await mcp.google_stitch.validate_design_tokens({
  tokens: {
    'primary': '#63A2B0',
    'secondary': '#26A69A',
    'custom': '#XYZ999'
  }
});
```

---

## 六、進階使用

### 6.1 批量獲取代幣

```typescript
// 同時獲取多種代幣
const [colors, typography, spacing, shadows, animations] = await Promise.all([
  mcp.google_stitch.get_design_tokens({ category: "colors" }),
  mcp.google_stitch.get_design_tokens({ category: "typography" }),
  mcp.google_stitch.get_design_tokens({ category: "spacing" }),
  mcp.google_stitch.get_design_tokens({ category: "shadows" }),
  mcp.google_stitch.get_design_tokens({ category: "animations" })
]);

// 生成完整的設計系統配置
const designSystem = {
  colors: JSON.parse(colors),
  typography: JSON.parse(typography),
  spacing: JSON.parse(spacing),
  shadows: JSON.parse(shadows),
  animations: JSON.parse(animations)
};
```

### 6.2 批量獲取組件指南

```typescript
// 同時獲取多種組件指南
const [button, input, card, modal] = await Promise.all([
  mcp.google_stitch.get_component_guidelines({ component_type: "button" }),
  mcp.google_stitch.get_component_guidelines({ component_type: "input" }),
  mcp.google_stitch.get_component_guidelines({ component_type: "card" }),
  mcp.google_stitch.get_component_guidelines({ component_type: "modal" })
]);

// 生成組件庫配置
const componentLibrary = {
  button: JSON.parse(button),
  input: JSON.parse(input),
  card: JSON.parse(card),
  modal: JSON.parse(modal)
};
```

### 6.3 創建自定義代幣驗證腳本

```typescript
// validate-design-tokens.js
import { McpClient } from '@modelcontextprotocol/sdk/client/index.js';

async function validateDesignTokens() {
  const client = new McpClient();
  
  const tokens = {
    // 從設計系統載入代幣
    ...loadTokensFromDesignSystem()
  };
  
  const result = await client.callTool({
    name: 'google_stitch.validate_design_tokens',
    arguments: { tokens }
  });
  
  if (!result.valid) {
    console.error('Design token validation failed:');
    result.errors.forEach(error => console.error(`  - ${error}`));
    result.warnings.forEach(warning => console.warn(`  - ${warning}`));
    process.exit(1);
  }
  
  console.log('✅ Design tokens validated successfully');
}

validateDesignTokens();
```

---

**文件版本**：1.0.0  
**最後更新**：2026-02-11  
**維護團隊**：ESGss JunAiKey Beta Development Team
