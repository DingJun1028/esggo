/**
 * Anti-gravity Design Tokens
 * 反重力設計令牌系統
 * 
 * 核心理念：
 * - 輕量化：減少視覺重量，創造浮動感
 * - 浮動美學：使用陰影、透明度和動畫創造懸浮效果
 * - 流動性：平滑的過渡和自然的動畫
 * - 呼吸空間：充足的留白和間距
 * 
 * 三元一體設計概念：
 * 1. 視覺層 (Visual Layer) - 色彩、陰影、透明度
 * 2. 互動層 (Interaction Layer) - 動畫、過渡、回饋
 * 3. 空間層 (Spatial Layer) - 間距、布局、留白
 */

// ============================================================================
// 色彩令牌 (Color Tokens)
// ============================================================================

/**
 * Anti-gravity 色彩系統
 * 使用柔和、透明的色彩創造浮動感
 */
export const antiGravityColors = {
  // 主色調 - 柔和的青色系
  primary: {
    main: '#00FFFF',
    light: '#8FC4D1',
    lighter: '#B8E0EA',
    dark: '#4A8291',
    darker: '#326372',
    transparent: {
      10: 'rgba(0,255,255, 0.1)',
      20: 'rgba(0,255,255, 0.2)',
      30: 'rgba(0,255,255, 0.3)',
      50: 'rgba(0,255,255, 0.5)',
      70: 'rgba(0,255,255, 0.7)',
    },
  },

  // 次要色調 - 柔和的綠色系
  secondary: {
    main: '#26A69A',
    light: '#4DB6AC',
    lighter: '#80CBC4',
    dark: '#00897B',
    darker: '#00695C',
    transparent: {
      10: 'rgba(38, 166, 154, 0.1)',
      20: 'rgba(38, 166, 154, 0.2)',
      30: 'rgba(38, 166, 154, 0.3)',
      50: 'rgba(38, 166, 154, 0.5)',
      70: 'rgba(38, 166, 154, 0.7)',
    },
  },

  // 強調色 - 柔和的橙色系
  accent: {
    main: '#FFA726',
    light: '#FFB74D',
    lighter: '#FFCC80',
    dark: '#F57C00',
    darker: '#EF6C00',
    transparent: {
      10: 'rgba(255, 167, 38, 0.1)',
      20: 'rgba(255, 167, 38, 0.2)',
      30: 'rgba(255, 167, 38, 0.3)',
      50: 'rgba(255, 167, 38, 0.5)',
      70: 'rgba(255, 167, 38, 0.7)',
    },
  },

  // 功能色
  functional: {
    success: {
      main: '#4CAF50',
      light: '#66BB6A',
      transparent: 'rgba(76, 175, 80, 0.15)',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      transparent: 'rgba(255, 152, 0, 0.15)',
    },
    error: {
      main: '#F44336',
      light: '#EF5350',
      transparent: 'rgba(244, 67, 54, 0.15)',
    },
    info: {
      main: '#2196F3',
      light: '#42A5F5',
      transparent: 'rgba(33, 150, 243, 0.15)',
    },
  },

  // 中性色 - 柔和的灰色系
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    transparent: {
      10: 'rgba(0, 0, 0, 0.05)',
      20: 'rgba(0, 0, 0, 0.1)',
      30: 'rgba(0, 0, 0, 0.15)',
      50: 'rgba(0, 0, 0, 0.25)',
      70: 'rgba(0, 0, 0, 0.35)',
    },
  },

  // 背景色 - 柔和的背景
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.4)',
  },

  // 文字色
  text: {
    primary: '#212121',
    secondary: '#616161',
    tertiary: '#9E9E9E',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
  },
};

// ============================================================================
// 陰影令牌 (Shadow Tokens)
// ============================================================================

/**
 * Anti-gravity 陰影系統
 * 使用柔和、多層的陰影創造浮動感
 */
export const antiGravityShadows = {
  // 浮動陰影 - 創造懸浮效果
  float: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
    md: '0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1)',
  },

  // 內陰影 - 創造凹陷效果
  inset: {
    sm: 'inset 0 1px 2px rgba(0, 0, 0, 0.06)',
    md: 'inset 0 2px 4px rgba(0, 0, 0, 0.08)',
    lg: 'inset 0 4px 8px rgba(0, 0, 0, 0.1)',
  },

  // 發光陰影 - 創造發光效果
  glow: {
    primary: '0 0 20px rgba(0,255,255, 0.3), 0 0 40px rgba(0,255,255, 0.15)',
    secondary: '0 0 20px rgba(38, 166, 154, 0.3), 0 0 40px rgba(38, 166, 154, 0.15)',
    accent: '0 0 20px rgba(255, 167, 38, 0.3), 0 0 40px rgba(255, 167, 38, 0.15)',
  },

  // 懸停陰影 - 互動時的陰影
  hover: {
    sm: '0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
    md: '0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
    lg: '0 16px 48px rgba(0, 0, 0, 0.18), 0 8px 24px rgba(0, 0, 0, 0.12)',
  },
};

// ============================================================================
// 間距令牌 (Spacing Tokens)
// ============================================================================

/**
 * Anti-gravity 間距系統
 * 使用充足的留白創造呼吸空間
 */
export const antiGravitySpacing = {
  0: '0px',
  0.5: '4px',
  1: '8px',
  1.5: '12px',
  2: '16px',
  2.5: '20px',
  3: '24px',
  4: '32px',
  5: '40px',
  6: '48px',
  8: '64px',
  10: '80px',
  12: '96px',
  16: '128px',
  20: '160px',
  24: '192px',
};

// ============================================================================
// 圓角令牌 (Border Radius Tokens)
// ============================================================================

/**
 * Anti-gravity 圓角系統
 * 使用柔和的圓角創造流動感
 */
export const antiGravityBorderRadius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
};

// ============================================================================
// 動畫令牌 (Animation Tokens)
// ============================================================================

/**
 * Anti-gravity 動畫系統
 * 使用平滑的動畫創造流動感
 */
export const antiGravityAnimations = {
  // 持續時間
  duration: {
    instant: '50ms',
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
    slowest: '700ms',
  },

  // 緩動函數
  easing: {
    easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    easeInBack: 'cubic-bezier(0.36, 0, 0.66, -0.56)',
    easeOutBounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // 浮動動畫
  float: {
    gentle: 'float-gentle 3s ease-in-out infinite',
    medium: 'float-medium 2s ease-in-out infinite',
    strong: 'float-strong 1.5s ease-in-out infinite',
  },

  // 脈衝動畫
  pulse: {
    gentle: 'pulse-gentle 2s ease-in-out infinite',
    medium: 'pulse-medium 1.5s ease-in-out infinite',
    strong: 'pulse-strong 1s ease-in-out infinite',
  },

  // 旋轉動畫
  rotate: {
    slow: 'rotate 20s linear infinite',
    medium: 'rotate 10s linear infinite',
    fast: 'rotate 5s linear infinite',
  },
};

// ============================================================================
// 透明度令牌 (Opacity Tokens)
// ============================================================================

/**
 * Anti-gravity 透明度系統
 * 使用透明度創造層次感
 */
export const antiGravityOpacity = {
  0: '0',
  10: '0.1',
  20: '0.2',
  30: '0.3',
  40: '0.4',
  50: '0.5',
  60: '0.6',
  70: '0.7',
  80: '0.8',
  90: '0.9',
  100: '1',
};

// ============================================================================
// 模糊令牌 (Blur Tokens)
// ============================================================================

/**
 * Anti-gravity 模糊系統
 * 使用模糊創造深度感
 */
export const antiGravityBlur = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
};

// ============================================================================
// 響應式斷點 (Responsive Breakpoints)
// ============================================================================

/**
 * Anti-gravity 響應式斷點
 * 遵循行動優先策略
 */
export const antiGravityBreakpoints = {
  xs: '0px',
  sm: '600px',
  md: '900px',
  lg: '1200px',
  xl: '1440px',
  '2xl': '1920px',
};

// ============================================================================
// Z-Index 層級 (Z-Index Scale)
// ============================================================================

/**
 * Anti-gravity Z-Index 層級
 * 創造清晰的層次結構
 */
export const antiGravityZIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,
  overlay: 9999,
};

// ============================================================================
// 字體令牌 (Typography Tokens)
// ============================================================================

/**
 * Anti-gravity 字體系統
 * 使用現代、清晰的字體
 */
export const antiGravityTypography = {
  fontFamily: {
    primary: '"Noto Sans TC", "Microsoft JhengHei", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    secondary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"Fira Code", "Consolas", "Monaco", monospace',
  },

  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '32px',
    '5xl': '36px',
    '6xl': '48px',
    '7xl': '56px',
    '8xl': '64px',
  },

  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// ============================================================================
// 導出
// ============================================================================

export default {
  colors: antiGravityColors,
  shadows: antiGravityShadows,
  spacing: antiGravitySpacing,
  borderRadius: antiGravityBorderRadius,
  animations: antiGravityAnimations,
  opacity: antiGravityOpacity,
  blur: antiGravityBlur,
  breakpoints: antiGravityBreakpoints,
  zIndex: antiGravityZIndex,
  typography: antiGravityTypography,
};
