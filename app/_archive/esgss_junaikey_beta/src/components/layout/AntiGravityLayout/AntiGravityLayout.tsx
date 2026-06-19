/**
 * Anti-gravity Layout Component
 * 反重力布局組件
 * 
 * 功能：
 * - 響應式布局系統
 * - 支持多種布局模式
 * - Anti-gravity 設計風格
 * - 雙語支持（繁體中文/英文）
 * - 無障礙支持
 * - 流動動畫效果
 */

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import { antiGravityBreakpoints, antiGravitySpacing } from '@/core/design-tokens/AntiGravityTokens';
import './AntiGravityLayout.css';

// ============================================================================
// 類型定義
// ============================================================================

export type LayoutMode = 'fluid' | 'contained' | 'centered' | 'full-width';
export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 12;
export type GapSize = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;

export interface AntiGravityLayoutProps {
  /** 子元素 */
  children: React.ReactNode;
  /** 布局模式 */
  mode?: LayoutMode;
  /** 最大寬度 */
  maxWidth?: string;
  /** 內邊距 */
  padding?: GapSize;
  /** 網格列數 */
  columns?: GridColumns;
  /** 響應式列數 */
  responsiveColumns?: {
    xs?: GridColumns;
    sm?: GridColumns;
    md?: GridColumns;
    lg?: GridColumns;
    xl?: GridColumns;
  };
  /** 間距 */
  gap?: GapSize;
  /** 對齊方式 */
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  /** 垂直對齊 */
  verticalAlign?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  /** 是否啟用浮動效果 */
  floating?: boolean;
  /** 是否啟用玻璃態效果 */
  glassmorphism?: boolean;
  /** 自定義樣式類 */
  className?: string;
  /** 語言 */
  language?: 'zh-TW' | 'en';
}

export interface AntiGravityGridProps {
  /** 子元素 */
  children: React.ReactNode;
  /** 網格列數 */
  columns?: GridColumns;
  /** 響應式列數 */
  responsiveColumns?: {
    xs?: GridColumns;
    sm?: GridColumns;
    md?: GridColumns;
    lg?: GridColumns;
    xl?: GridColumns;
  };
  /** 間距 */
  gap?: GapSize;
  /** 對齊方式 */
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  /** 垂直對齊 */
  verticalAlign?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  /** 自定義樣式類 */
  className?: string;
}

export interface AntiGravityFlexProps {
  /** 子元素 */
  children: React.ReactNode;
  /** 方向 */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /** 換行 */
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  /** 對齊方式 */
  align?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  /** 垂直對齊 */
  verticalAlign?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  /** 間距 */
  gap?: GapSize;
  /** 自定義樣式類 */
  className?: string;
}

// ============================================================================
// Anti-gravity Layout 組件
// ============================================================================

export const AntiGravityLayout: React.FC<AntiGravityLayoutProps> = ({
  children,
  mode = 'contained',
  maxWidth = '1200px',
  padding = 3,
  columns = 1,
  responsiveColumns,
  gap = 3,
  align = 'stretch',
  verticalAlign = 'stretch',
  floating = false,
  glassmorphism = false,
  className = '',
  language = 'zh-TW',
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXl = useMediaQuery(theme.breakpoints.up('xl'));

  // 計算當前列數
  const currentColumns = useMemo(() => {
    if (responsiveColumns) {
      if (isXs && responsiveColumns.xs) return responsiveColumns.xs;
      if (isSm && responsiveColumns.sm) return responsiveColumns.sm;
      if (isMd && responsiveColumns.md) return responsiveColumns.md;
      if (isLg && responsiveColumns.lg) return responsiveColumns.lg;
      if (isXl && responsiveColumns.xl) return responsiveColumns.xl;
    }
    return columns;
  }, [columns, responsiveColumns, isXs, isSm, isMd, isLg, isXl]);

  // 計算網格樣式
  const gridStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${currentColumns}, 1fr)`,
    gap: antiGravitySpacing[gap],
    alignItems: verticalAlign,
    justifyContent: align,
  }), [currentColumns, gap, align, verticalAlign]);

  // 計算容器樣式
  const containerStyle = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      padding: antiGravitySpacing[padding],
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    switch (mode) {
      case 'fluid':
        return baseStyle;
      case 'contained':
        return {
          ...baseStyle,
          maxWidth,
          margin: '0 auto',
        };
      case 'centered':
        return {
          ...baseStyle,
          maxWidth,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        };
      case 'full-width':
        return {
          ...baseStyle,
          width: '100%',
        };
      default:
        return baseStyle;
    }
  }, [mode, maxWidth, padding]);

  // 計算額外樣式
  const extraStyle = useMemo(() => {
    const style: React.CSSProperties = {};

    if (floating) {
      style.animation = 'float-gentle 3s ease-in-out infinite';
    }

    if (glassmorphism) {
      style.background = 'rgba(255, 255, 255, 0.7)';
      style.backdropFilter = 'blur(16px)';
      style.border = '1px solid rgba(255, 255, 255, 0.3)';
      style.borderRadius = '16px';
    }

    return style;
  }, [floating, glassmorphism]);

  return (
    <Box
      className={`anti-gravity-layout anti-gravity-layout--${mode} ${className}`}
      sx={containerStyle}
      style={extraStyle}
    >
      <Box sx={gridStyle}>
        {children}
      </Box>
    </Box>
  );
};

// ============================================================================
// Anti-gravity Grid 組件
// ============================================================================

export const AntiGravityGrid: React.FC<AntiGravityGridProps> = ({
  children,
  columns = 1,
  responsiveColumns,
  gap = 3,
  align = 'stretch',
  verticalAlign = 'stretch',
  className = '',
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXl = useMediaQuery(theme.breakpoints.up('xl'));

  // 計算當前列數
  const currentColumns = useMemo(() => {
    if (responsiveColumns) {
      if (isXs && responsiveColumns.xs) return responsiveColumns.xs;
      if (isSm && responsiveColumns.sm) return responsiveColumns.sm;
      if (isMd && responsiveColumns.md) return responsiveColumns.md;
      if (isLg && responsiveColumns.lg) return responsiveColumns.lg;
      if (isXl && responsiveColumns.xl) return responsiveColumns.xl;
    }
    return columns;
  }, [columns, responsiveColumns, isXs, isSm, isMd, isLg, isXl]);

  return (
    <Box
      className={`anti-gravity-grid ${className}`}
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${currentColumns}, 1fr)`,
        gap: antiGravitySpacing[gap],
        alignItems: verticalAlign,
        justifyContent: align,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </Box>
  );
};

// ============================================================================
// Anti-gravity Flex 組件
// ============================================================================

export const AntiGravityFlex: React.FC<AntiGravityFlexProps> = ({
  children,
  direction = 'row',
  wrap = 'nowrap',
  align = 'flex-start',
  verticalAlign = 'stretch',
  gap = 2,
  className = '',
}) => {
  return (
    <Box
      className={`anti-gravity-flex ${className}`}
      sx={{
        display: 'flex',
        flexDirection: direction,
        flexWrap: wrap,
        justifyContent: align,
        alignItems: verticalAlign,
        gap: antiGravitySpacing[gap],
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </Box>
  );
};

// ============================================================================
// Anti-gravity Container 組件
// ============================================================================

export interface AntiGravityContainerProps {
  /** 子元素 */
  children: React.ReactNode;
  /** 最大寬度 */
  maxWidth?: string;
  /** 內邊距 */
  padding?: GapSize;
  /** 是否居中 */
  centered?: boolean;
  /** 是否啟用浮動效果 */
  floating?: boolean;
  /** 是否啟用玻璃態效果 */
  glassmorphism?: boolean;
  /** 自定義樣式類 */
  className?: string;
}

export const AntiGravityContainer: React.FC<AntiGravityContainerProps> = ({
  children,
  maxWidth = '1200px',
  padding = 3,
  centered = true,
  floating = false,
  glassmorphism = false,
  className = '',
}) => {
  const containerStyle = useMemo(() => {
    const style: React.CSSProperties = {
      padding: antiGravitySpacing[padding],
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    if (centered) {
      style.maxWidth = maxWidth;
      style.margin = '0 auto';
    }

    if (floating) {
      style.animation = 'float-gentle 3s ease-in-out infinite';
    }

    if (glassmorphism) {
      style.background = 'rgba(255, 255, 255, 0.7)';
      style.backdropFilter = 'blur(16px)';
      style.border = '1px solid rgba(255, 255, 255, 0.3)';
      style.borderRadius = '16px';
    }

    return style;
  }, [maxWidth, padding, centered, floating, glassmorphism]);

  return (
    <Box
      className={`anti-gravity-container ${className}`}
      style={containerStyle}
    >
      {children}
    </Box>
  );
};

// ============================================================================
// Anti-gravity Section 組件
// ============================================================================

export interface AntiGravitySectionProps {
  /** 子元素 */
  children: React.ReactNode;
  /** 標題 */
  title?: string;
  /** 描述 */
  description?: string;
  /** 內邊距 */
  padding?: GapSize;
  /** 背景色 */
  background?: 'default' | 'primary' | 'secondary' | 'transparent';
  /** 是否啟用浮動效果 */
  floating?: boolean;
  /** 自定義樣式類 */
  className?: string;
}

export const AntiGravitySection: React.FC<AntiGravitySectionProps> = ({
  children,
  title,
  description,
  padding = 4,
  background = 'default',
  floating = false,
  className = '',
}) => {
  const sectionStyle = useMemo(() => {
    const style: React.CSSProperties = {
      padding: antiGravitySpacing[padding],
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    switch (background) {
      case 'primary':
        style.background = 'rgba(0,255,255, 0.08)';
        break;
      case 'secondary':
        style.background = 'rgba(38, 166, 154, 0.08)';
        break;
      case 'transparent':
        style.background = 'transparent';
        break;
      default:
        style.background = 'rgba(255, 255, 255, 0.5)';
    }

    if (floating) {
      style.animation = 'float-gentle 3s ease-in-out infinite';
    }

    return style;
  }, [padding, background, floating]);

  return (
    <Box
      className={`anti-gravity-section ${className}`}
      style={sectionStyle}
    >
      {title && (
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body1" sx={{ color: 'text.secondary', marginTop: 1 }}>
              {description}
            </Typography>
          )}
        </Box>
      )}
      {children}
    </Box>
  );
};

// ============================================================================
// 導出
// ============================================================================

export default {
  AntiGravityLayout,
  AntiGravityGrid,
  AntiGravityFlex,
  AntiGravityContainer,
  AntiGravitySection,
};
