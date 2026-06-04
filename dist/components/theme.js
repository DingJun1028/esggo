"use strict";
// src/components/theme.ts
// ESG GO Design System Themes
// "光明/暗影/系統" (Light/Dark/System) -> "善向永續經典/柏克萊學院風/極致簡約/最佳實踐"
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeContext = exports.FusionTheme = exports.MindfulTheme = exports.BerkeleyTheme = exports.AtlanticTheme = void 0;
// ── Atlantic (海洋) ──────────────────────────────────────────────────────
// 1. 良質 seawater (青海色/ 海藍)
exports.AtlanticTheme = {
    name: 'Atlantic',
    colors: {
        primary: '#003366', // 深海藍
        secondary: '#0099CC', // 潮間藍
        background: '#F0F8FF', // 海面白
        surface: '#E6F2FF', // 波紋白
        success: '#28A745', // 成功綠
        warning: '#D39F00', // 警告黃
        danger: '#DC3545', // 危險紅
        muted: '#6C757D', // 低飽和
        contrast: '#FFFFFF', // 對比白
    },
    spacing: {
        unit: 8, // 基本單位 (rem)
        radius: {
            small: 4,
            medium: 8,
            large: 12,
        },
    },
    typography: {
        fontFamily: '"Inter", sans-serif',
        sizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            md: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
        },
    },
    borderRadius: 'medium',
};
// ── Berkeley (柏克萊) ───────────────────────────────────────────────────
// 2. 大學堂 (知識與創新之光)
exports.BerkeleyTheme = {
    name: 'Berkeley',
    colors: {
        primary: '#B30059', // 布蘭森紅 (University Red)
        secondary: '#00A1E9', // 校園藍
        background: '#F8F9FA', // 大學堂白
        surface: '#FFFFFF', // 認知白
        success: '#28A745',
        warning: '#FFC107',
        danger: '#DC3545',
        muted: '#6C757D',
        contrast: '#212529',
    },
    spacing: {
        unit: 4,
        radius: {
            small: 2,
            medium: 6,
            large: 10,
        },
    },
    typography: {
        fontFamily: '"Playfair Display", serif',
        sizes: {
            xs: '0.8rem',
            sm: '0.9rem',
            md: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
        },
    },
    borderRadius: 'large',
};
// ── Mindful (正念) ─────────────────────────────────────────────────────
// 3. 永續核心 (永續實踐之光)
exports.MindfulTheme = {
    name: 'Mindful',
    colors: {
        primary: '#2E8B57', // 海綠 (Sea Green)
        secondary: '#9ACD32', // 黃綠
        background: '#FAF9F6', // 柔白
        surface: '#F5F5F5', // 靜白
        success: '#4CAF50',
        warning: '#FF9800',
        danger: '#E91E63',
        muted: '#757575',
        contrast: '#202124',
    },
    spacing: {
        unit: 16,
        radius: {
            small: 3,
            medium: 9,
            large: 12,
        },
    },
    typography: {
        fontFamily: '"Source Sans Pro", sans-serif',
        sizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            md: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
        },
    },
    borderRadius: 'rounded',
};
// ── Fusion (融合) ──────────────────────────────────────────────────────
// 4. 實踐最佳 (Best Practice)
exports.FusionTheme = {
    name: 'Fusion',
    colors: {
        primary: '#1E90FF', // 藍色強調
        secondary: '#32CD32', // 綠黃
        background: '#F0FFF0', // 明淡綠
        surface: '#E6FFE6', // 輕綠
        success: '#28A745',
        warning: '#FFC107',
        danger: '#DC3545',
        muted: '#6C757D',
        contrast: '#212529',
    },
    spacing: {
        unit: 10,
        radius: {
            small: 5,
            medium: 10,
            large: 15,
        },
    },
    typography: {
        fontFamily: '"Roboto", sans-serif',
        sizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            md: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
        },
    },
    borderRadius: 'pill',
};
// 讓使用者可以根據「應用場景」切換主題；從此點開始，所有組件都自動根據主題綠色調整版面與配色。
exports.ThemeContext = {
    current: 'Fusion', // 預設使用最佳實踐款 (Fusion)
    switchTo: (theme) => {
        // 實作全局主題變更設計
        console.log(`切換至主題: ${theme}`);
        // 實作細節參考: 使用 CSS變變數 or Ant Design StyleProvider
        return true;
    },
    // 提供全域配置映射
    themes: {
        Atlantic: exports.AtlanticTheme,
        Berkeley: exports.BerkeleyTheme,
        Mindful: exports.MindfulTheme,
        Fusion: exports.FusionTheme,
    },
};
exports.default = exports.ThemeContext;
//# sourceMappingURL=theme.js.map