# Google Stitch MCP 完整操作範例

**目標**：從零開始使用 Google Stitch MCP 工具，實作一個符合最佳實踐的 UI 組件

本範例將展示如何：
1. 設置 MCP 環境
2. 使用設計代幣工具
3. 使用 UI/UX 最佳實踐工具
4. 使用組件指南工具
5. 整合並產出可用的程式碼

---

## 第一步：環境設置

### 1.1 安裝 Google Stitch MCP 服務器

```bash
# 1. 進入專案目錄
cd c:\Project\esgss_junaikey_beta

# 2. 安裝依賴
cd mcp-servers/google-stitch
npm install

# 3. 編譯 TypeScript
npm run build

# 4. 返回主目錄
cd c:\Project\esgss_junaikey_beta
```

### 1.2 配置 MCP 設定檔

編輯 `C:\Users\jun\AppData\Roaming\Antigravity\User\globalStorage\kilocode.kilo-code\settings\mcp_settings.json`：

```json
{
  "mcpServers": {
    "google-stitch": {
      "command": "node",
      "args": ["c:/Project/esgss_junaikey_beta/mcp-servers/google-stitch/build/index.js"],
      "disabled": false,
      "alwaysAllow": ["get_design_tokens", "get_ui_ux_best_practices", "get_component_guidelines"]
    }
  }
}
```

---

## 第二步：獲取設計代幣

### 2.1 執行批量代幣獲取腳本

創建 `scripts/fetch-design-tokens.js`：

```javascript
/**
 * 批量獲取設計代幣腳本
 * 執行方式: node scripts/fetch-design-tokens.js
 */

import { McpClient } from '@modelcontextprotocol/sdk/client/index.js';

async function fetchDesignTokens() {
  const client = new McpClient();
  
  console.log('🔄 正在獲取設計代幣...\n');
  
  try {
    // 並行獲取所有代幣類別
    const [colors, typography, spacing, shadows, animations] = await Promise.all([
      client.callTool({
        name: 'google_stitch.get_design_tokens',
        arguments: { category: 'colors', format: 'json' }
      }),
      client.callTool({
        name: 'google_stitch.get_design_tokens',
        arguments: { category: 'typography', format: 'json' }
      }),
      client.callTool({
        name: 'google_stitch.get_design_tokens',
        arguments: { category: 'spacing', format: 'json' }
      }),
      client.callTool({
        name: 'google_stitch.get_design_tokens',
        arguments: { category: 'shadows', format: 'json' }
      }),
      client.callTool({
        name: 'google_stitch.get_design_tokens',
        arguments: { category: 'animations', format: 'json' }
      })
    ]);
    
    console.log('✅ 設計代幣獲取完成\n');
    
    // 解析並儲存
    const designTokens = {
      colors: JSON.parse(colors[0].text),
      typography: JSON.parse(typography[0].text),
      spacing: JSON.parse(spacing[0].text),
      shadows: JSON.parse(shadows[0].text),
      animations: JSON.parse(animations[0].text)
    };
    
    // 輸出結果
    console.log('📦 色彩代幣:');
    console.log(`  Primary: ${designTokens.colors.primary}`);
    console.log(`  Secondary: ${designTokens.colors.secondary}`);
    console.log(`  Accent: ${designTokens.colors.accent}\n`);
    
    console.log('📦 間距代幣:');
    Object.entries(designTokens.spacing).slice(0, 6).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
    
    return designTokens;
    
  } catch (error) {
    console.error('❌ 獲取設計代幣失敗:', error);
    throw error;
  }
}

fetchDesignTokens();
```

### 2.2 執行腳本

```bash
node scripts/fetch-design-tokens.js
```

**預期輸出**：
```
🔄 正在獲取設計代幣...

✅ 設計代幣獲取完成

📦 色彩代幣:
  Primary: #63A2B0
  Secondary: #26A69A
  Accent: #FFA726

📦 間距代幣:
  0: 0px
  0.5: 4px
  1: 8px
  2: 16px
  3: 24px
  4: 32px
```

---

## 第三步：獲取 UI/UX 最佳實踐

### 3.1 獲取無障礙設計最佳實踐

```javascript
async function fetchAccessibilityBestPractices() {
  const client = new McpClient();
  
  console.log('♿ 正在獲取無障礙設計最佳實踐...\n');
  
  const result = await client.callTool({
    name: 'google_stitch.get_ui_ux_best_practices',
    arguments: { category: 'accessibility' }
  });
  
  const a11y = JSON.parse(result[0].text);
  
  console.log('📖 無障礙設計原則:');
  a11y.principles.forEach((principle, index) => {
    console.log(`  ${index + 1}. ${principle}`);
  });
  
  console.log('\n✅ 無障礙檢查清單:');
  a11y.checklist.forEach((item) => {
    console.log(`  ${item}`);
  });
  
  return a11y;
}
```

### 3.2 獲取互動設計最佳實踐

```javascript
async function fetchInteractionBestPractices() {
  const client = new McpClient();
  
  console.log('🎯 正在獲取互動設計最佳實踐...\n');
  
  const result = await client.callTool({
    name: 'google_stitch.get_ui_ux_best_practices',
    arguments: { category: 'interaction_design' }
  });
  
  const interaction = JSON.parse(result[0].text);
  
  console.log('📖 互動設計原則:');
  interaction.principles.forEach((principle, index) => {
    console.log(`  ${index + 1}. ${principle}`);
  });
  
  console.log('\n🔄 回饋類型:');
  interaction.feedback_types.forEach((type) => {
    console.log(`  • ${type}`);
  });
  
  return interaction;
}
```

### 3.3 獲取響應式設計最佳實踐

```javascript
async function fetchResponsiveBestPractices() {
  const client = new McpClient();
  
  console.log('📱 正在獲取響應式設計最佳實踐...\n');
  
  const result = await client.callTool({
    name: 'google_stitch.get_ui_ux_best_practices',
    arguments: { category: 'responsive_design' }
  });
  
  const responsive = JSON.parse(result[0].text);
  
  console.log('📖 響應式設計原則:');
  responsive.principles.forEach((principle, index) => {
    console.log(`  ${index + 1}. ${principle}`);
  });
  
  console.log('\n📐 斷點定義:');
  Object.entries(responsive.breakpoints).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  return responsive;
}
```

---

## 第四步：獲取組件指南

### 4.1 獲取按鈕組件指南

```javascript
async function fetchButtonGuidelines() {
  const client = new McpClient();
  
  console.log('🔘 正在獲取按鈕組件指南...\n');
  
  const result = await client.callTool({
    name: 'google_stitch.get_component_guidelines',
    arguments: { component_type: 'button' }
  });
  
  const button = JSON.parse(result[0].text);
  
  console.log('📖 按鈕狀態:');
  button.states.forEach((state) => {
    console.log(`  • ${state}`);
  });
  
  console.log('\n📐 按鈕尺寸:');
  button.sizes.forEach((size) => {
    console.log(`  • ${size}`);
  });
  
  console.log('\n🎨 按鈕變體:');
  button.variants.forEach((variant) => {
    console.log(`  • ${variant}`);
  });
  
  console.log('\n♿ 無障礙要求:');
  button.accessibility.forEach((a11y) => {
    console.log(`  ✓ ${a11y}`);
  });
  
  return button;
}
```

### 4.2 獲取卡片組件指南

```javascript
async function fetchCardGuidelines() {
  const client = new McpClient();
  
  console.log('📦 正在獲取卡片組件指南...\n');
  
  const result = await client.callTool({
    name: 'google_stitch.get_component_guidelines',
    arguments: { component_type: 'card' }
  });
  
  const card = JSON.parse(result[0].text);
  
  console.log('📖 卡片變體:');
  card.variants.forEach((variant) => {
    console.log(`  • ${variant}`);
  });
  
  console.log('\n🧩 卡片元素:');
  card.elements.forEach((element) => {
    console.log(`  • ${element}`);
  });
  
  console.log('\n📐 卡片佈局:');
  card.layout.forEach((layout) => {
    console.log(`  • ${layout}`);
  });
  
  return card;
}
```

---

## 第五步：整合產出程式碼

### 5.1 完整的整合腳本

創建 `scripts/generate-ui-component.js`：

```javascript
/**
 * Google Stitch MCP 完整整合範例
 * 
 * 功能：
 * 1. 獲取設計代幣
 * 2. 獲取 UI/UX 最佳實踐
 * 3. 獲取組件指南
 * 4. 產出符合最佳實踐的 React 組件
 */

import { McpClient } from '@modelcontextprotocol/sdk/client/index.js';
import fs from 'fs';

class GoogleStitchMCP {
  constructor() {
    this.client = new McpClient();
  }
  
  async getDesignTokens() {
    const [colors, typography, spacing, shadows, animations] = await Promise.all([
      this.call('get_design_tokens', { category: 'colors', format: 'json' }),
      this.call('get_design_tokens', { category: 'typography', format: 'json' }),
      this.call('get_design_tokens', { category: 'spacing', format: 'json' }),
      this.call('get_design_tokens', { category: 'shadows', format: 'json' }),
      this.call('get_design_tokens', { category: 'animations', format: 'json' })
    ]);
    
    return {
      colors: JSON.parse(colors[0].text),
      typography: JSON.parse(typography[0].text),
      spacing: JSON.parse(spacing[0].text),
      shadows: JSON.parse(shadows[0].text),
      animations: JSON.parse(animations[0].text)
    };
  }
  
  async getBestPractices(category) {
    const result = await this.call('get_ui_ux_best_practices', { category });
    return JSON.parse(result[0].text);
  }
  
  async getComponentGuidelines(componentType) {
    const result = await this.call('get_component_guidelines', { component_type: componentType });
    return JSON.parse(result[0].text);
  }
  
  async call(toolName, args) {
    return await this.client.callTool({
      name: `google_stitch.${toolName}`,
      arguments: args
    });
  }
}

async function generateButtonComponent() {
  const mcp = new GoogleStitchMCP();
  
  console.log('🚀 開始生成 Button 組件...\n');
  
  // 1. 獲取代幣和指南
  console.log('📥 步驟 1: 獲取設計代幣和指南');
  const [tokens, buttonGuide, a11y, interaction] = await Promise.all([
    mcp.getDesignTokens(),
    mcp.getComponentGuidelines('button'),
    mcp.getBestPractices('accessibility'),
    mcp.getBestPractices('interaction_design')
  ]);
  
  console.log('✅ 代幣和指南獲取完成\n');
  
  // 2. 生成 React 組件
  console.log('📝 步驟 2: 生成 React 組件');
  
  const componentCode = generateReactComponent(tokens, buttonGuide, a11y);
  
  // 3. 儲存組件
  const outputPath = 'src/components/ui/ESButton/ESButton.tsx';
  const dir = outputPath.replace('/ESButton.tsx', '');
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, componentCode);
  console.log(`✅ 組件已儲存至: ${outputPath}\n`);
  
  // 4. 生成样式文件
  console.log('🎨 步驟 3: 生成樣式文件');
  const stylesCode = generateStyles(tokens, buttonGuide);
  fs.writeFileSync('src/components/ui/ESButton/ESButton.module.css', stylesCode);
  console.log(`✅ 樣式已儲存至: src/components/ui/ESButton/ESButton.module.css\n`);
  
  // 5. 生成測試文件
  console.log('🧪 步驟 4: 生成測試文件');
  const testCode = generateTests(buttonGuide);
  fs.writeFileSync('src/components/ui/ESButton/ESButton.test.tsx', testCode);
  console.log(`✅ 測試已儲存至: src/components/ui/ESButton/ESButton.test.tsx\n`);
  
  console.log('🎉 Button 組件生成完成！');
  
  return {
    tokens,
    buttonGuide,
    a11y,
    interaction
  };
}

function generateReactComponent(tokens, buttonGuide, a11y) {
  const colors = tokens.colors;
  const spacing = tokens.spacing;
  const animations = tokens.animations;
  
  return `/**
 * ESButton - ESGss JunAiKey 標準按鈕組件
 * 
 * 生成的組件遵循 Google Stitch MCP 提供的最佳實踐：
 * - ${a11y.principles[0]}
 * - ${a11y.principles[2]}
 * 
 * 支援的狀態: ${buttonGuide.states.join(', ')}
 * 支援的尺寸: ${buttonGuide.sizes.join(', ')}
 * 支援的變體: ${buttonGuide.variants.join(', ')}
 */

import React, { forwardRef, useMemo } from 'react';
import styles from './ESButton.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'icon';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonState = 'default' | 'hover' | 'active' | 'focus' | 'disabled' | 'loading';

export interface ESButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按鈕變體 */
  variant?: ButtonVariant;
  /** 按鈕尺寸 */
  size?: ButtonSize;
  /** 圖示（可選） */
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  /** 載入狀態 */
  loading?: boolean;
  /** 完整寬度 */
  fullWidth?: boolean;
  /** 自定義樣式類 */
  className?: string;
}

const sizeMap = {
  small: { height: '36px', padding: '8px 16px', fontSize: '14px' },
  medium: { height: '48px', padding: '12px 24px', fontSize: '16px' },
  large: { height: '56px', padding: '16px 32px', fontSize: '18px' }
};

export const ESButton = forwardRef<HTMLButtonElement, ESButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'medium',
      startIcon,
      endIcon,
      loading = false,
      fullWidth = false,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    // 計算動畫持續時間
    const animationDuration = useMemo(() => {
      return {
        normal: '${animations.duration.normal}',
        fast: '${animations.duration.fast}'
      };
    }, []);
    
    // 構建類名
    const classNames = useMemo(() => {
      const classes = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        disabled && styles.disabled
      ].filter(Boolean).join(' ');
      
      return classes;
    }, [variant, size, fullWidth, loading, disabled]);
    
    // 處理點擊事件
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) {
        e.preventDefault();
        return;
      }
      props.onClick?.(e);
    };
    
    return (
      <button
        ref={ref}
        type="button"
        className={classNames}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        ${buttonGuide.accessibility[0] ? `aria-label={props['aria-label'] || "${children?.toString() || '按鈕'}"}` : ''}
        onClick={handleClick}
        {...props}
      >
        {loading ? (
          <span className={styles.spinner} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="31.4 31.4"
                style={{
                  animation: 'spin ${animations.duration.normal} linear infinite'
                }}
              />
            </svg>
          </span>
        ) : (
          <>
            {startIcon && (
              <span className={styles.icon} aria-hidden="true">
                {startIcon}
              </span>
            )}
            <span className={styles.label}>{children}</span>
            {endIcon && (
              <span className={styles.icon} aria-hidden="true">
                {endIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

ESButton.displayName = 'ESButton';

export default ESButton;
`;
}

function generateStyles(tokens, buttonGuide) {
  const colors = tokens.colors;
  const spacing = tokens.spacing;
  const shadows = tokens.shadows;
  const animations = tokens.animations;
  
  return `/* ESButton 樣式文件 */

/* 基礎按鈕樣式 */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing[1]};
  border: none;
  border-radius: 8px;
  font-family: ${tokens.typography.fontFamily.primary};
  font-weight: 600;
  cursor: pointer;
  transition: all ${animations.duration.normal} ${animations.easing.easeOut};
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

/* 按鈕尺寸 */
.small {
  height: ${sizeMap.small.height};
  padding: ${sizeMap.small.padding};
  font-size: ${sizeMap.small.fontSize};
}

.medium {
  height: ${sizeMap.medium.height};
  padding: ${sizeMap.medium.padding};
  font-size: ${sizeMap.medium.fontSize};
}

.large {
  height: ${sizeMap.large.height};
  padding: ${sizeMap.large.padding};
  font-size: ${sizeMap.large.fontSize};
}

/* 主要按鈕變體 */
.primary {
  background-color: ${colors.primary};
  color: ${colors.primaryContrast};
  box-shadow: ${shadows.sm};
}

.primary:hover:not(:disabled):not(.loading) {
  background-color: ${colors.primaryLight};
  box-shadow: ${shadows.md};
  transform: translateY(-2px);
}

.primary:active:not(:disabled):not(.loading) {
  background-color: ${colors.primaryDark};
  transform: translateY(0);
  box-shadow: ${shadows.sm};
}

.primary:focus-visible {
  outline: 2px solid ${colors.primary};
  outline-offset: 2px;
}

/* 次要按鈕變體 */
.secondary {
  background-color: transparent;
  color: ${colors.primary};
  border: 2px solid ${colors.primary};
}

.secondary:hover:not(:disabled):not(.loading) {
  background-color: ${colors.primaryLight}20;
}

.secondary:active:not(:disabled):not(.loading) {
  background-color: ${colors.primaryLight}40;
}

/* 文字按鈕變體 */
.text {
  background-color: transparent;
  color: ${colors.primary};
  box-shadow: none;
}

.text:hover:not(:disabled):not(.loading) {
  background-color: ${colors.primaryLight}20;
}

/* 禁用狀態 */
.disabled {
  background-color: ${colors.neutral[200]};
  color: ${colors.neutral[400]};
  cursor: not-allowed;
  pointer-events: none;
  box-shadow: none;
}

/* 載入狀態 */
.loading {
  cursor: wait;
  opacity: 0.8;
}

.spinner {
  display: inline-flex;
  animation: spin ${animations.duration.normal} linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 圖示樣式 */
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon svg {
  width: 1.25em;
  height: 1.25em;
}

/* 標籤樣式 */
.label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 完整寬度 */
.fullWidth {
  width: 100%;
}

/* 減少動畫偏好支援 */
@media (prefers-reduced-motion: reduce) {
  .button,
  .spinner {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;
}

function generateTests(buttonGuide) {
  return `/**
 * ESButton 測試文件
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ESButton } from './ESButton';

describe('ESButton', () => {
  // 測試基本渲染
  it('renders button with children', () => {
    render(<ESButton>點擊我</ESButton>);
    expect(screen.getByRole('button', { name: '點擊我' })).toBeInTheDocument();
  });

  // 測試按鈕變體
  it('renders primary variant by default', () => {
    render(<ESButton>主要按鈕</ESButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('primary');
  });

  it('renders secondary variant', () => {
    render(<ESButton variant="secondary">次要按鈕</ESButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('secondary');
  });

  // 測試按鈕尺寸
  it('renders small size', () => {
    render(<ESButton size="small">小按鈕</ESButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('small');
  });

  it('renders large size', () => {
    render(<ESButton size="large">大按鈕</ESButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('large');
  });

  // 測試禁用狀態
  it('renders disabled state', () => {
    render(<ESButton disabled>禁用按鈕</ESButton>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  // 測試點擊事件
  it('calls onClick handler', () => {
    const handleClick = jest.fn();
    render(<ESButton onClick={handleClick}>點擊測試</ESButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // 測試禁用狀態下點擊不會觸發
  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<ESButton disabled onClick={handleClick}>禁用測試</ESButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // 測試載入狀態
  it('renders loading state', () => {
    render(<ESButton loading>載入中</ESButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('loading');
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  // 測試完整寬度
  it('renders full width', () => {
    render(<ESButton fullWidth>全寬按鈕</ESButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('fullWidth');
  });

  // 測試圖示顯示
  it('renders start icon', () => {
    const MockIcon = () => <svg data-testid="icon" />;
    render(<ESButton startIcon={<MockIcon />}>有圖示</ESButton>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  // 測試 ${buttonGuide.accessibility[0]}
  it('has correct aria-label for icon button', () () => {
    const MockIcon = () => <svg />;
    render(<ESButton variant="icon" aria-label="關閉"><MockIcon /></ESButton>);
    const button = screen.getByRole('button', { name: '關閉' });
    expect(button).toHaveAttribute('aria-label', '關閉');
  });
});
`;
}

// 執行生成
generateButtonComponent().catch(console.error);
```

### 5.2 執行整合腳本

```bash
node scripts/generate-ui-component.js
```

**預期輸出**：
```
🚀 開始生成 Button 組件...

📥 步驟 1: 獲取設計代幣和指南
✅ 代幣和指南獲取完成

📝 步驟 2: 生成 React 組件
✅ 組件已儲存至: src/components/ui/ESButton/ESButton.tsx

🎨 步驟 3: 生成樣式文件
✅ 樣式已儲存至: src/components/ui/ESButton/ESButton.module.css

🧪 步驟 4: 生成測試文件
✅ 測試已儲存至: src/components/ui/ESButton/ESButton.test.tsx

🎉 Button 組件生成完成！
```

---

## 第六步：使用生成的組件

### 6.1 在專案中引入組件

```tsx
// src/pages/Dashboard.tsx
import React, { useState } from 'react';
import { ESButton } from '../components/ui/ESButton/ESButton';
import { ESButton } from '../components/ui/ESButton';

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const handleClick = async () => {
    setLoading(true);
    try {
      // 模擬 API 呼叫
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>ESGss JunAiKey Dashboard</h1>
      
      <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
        <ESButton
          variant="primary"
          size="medium"
          onClick={handleClick}
          loading={loading}
        >
          {loading ? '處理中...' : `計數: ${count}`}
        </ESButton>
        
        <ESButton
          variant="secondary"
          size="medium"
          onClick={() => setCount(0)}
        >
          重置
        </ESButton>
        
        <ESButton variant="text">
          了解更多
        </ESButton>
      </div>
    </div>
  );
};

export default Dashboard;
```

### 6.2 執行測試

```bash
npm test -- --testPathPattern="ESButton"
```

---

## 完整流程摘要

```
┌─────────────────────────────────────────────────────────────────┐
│  Google Stitch MCP 完整操作流程                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1️⃣  環境設置                                                   │
│     └─→ npm install + npm run build                            │
│     └─→ 配置 mcp_settings.json                                  │
│                                                                 │
│  2️⃣  獲取代幣                                                   │
│     └─→ get_design_tokens (colors, typography, spacing, etc.)   │
│                                                                 │
│  3️⃣  獲取最佳實踐                                               │
│     └─→ get_ui_ux_best_practices                               │
│         ├─ accessibility                                        │
│         ├─ interaction_design                                   │
│         └─ responsive_design                                    │
│                                                                 │
│  4️⃣  獲取組件指南                                               │
│     └─→ get_component_guidelines (button, card, input, etc.)    │
│                                                                 │
│  5️⃣  整合產出                                                   │
│     └─→ 生成 React 組件                                         │
│     └─→ 生成 CSS 樣式                                           │
│     └─→ 生成測試文件                                            │
│                                                                 │
│  6️⃣  使用與驗證                                                 │
│     └─→ 在專案中引入組件                                         │
│     └─→ 執行測試                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 常見問題排解

### Q1: MCP 客戶端連接失敗

```bash
# 檢查服務器是否正在運行
ps aux | grep node

# 手動啟動服務器測試
cd mcp-servers/google-stitch
npm run build
node build/index.js
```

### Q2: 工具調用超時

增加超時時間：
```javascript
const client = new McpClient({
  timeout: 30000 // 30 秒
});
```

### Q3: 代幣格式錯誤

檢查 JSON 格式是否正確：
```javascript
try {
  const tokens = JSON.parse(result[0].text);
} catch (error) {
  console.error('JSON 解析錯誤:', error);
  console.log('原始回應:', result[0].text);
}
```

---

**文件版本**：1.0.0  
**最後更新**：2026-02-11  
**維護團隊**：ESGss JunAiKey Beta Development Team
