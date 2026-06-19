// ESG 儀表板響應式設計系統
// 基於 Tailwind CSS 的響應式工具函數

export const breakpoints = {
  sm: 640, // 小螢幕手機
  md: 768, // 大螢幕手機 / 小平板
  lg: 1024, // 平板 / 小筆電
  xl: 1280, // 筆電 / 桌面
  '2xl': 1536, // 大螢幕桌面
} as const;

export type Breakpoint = keyof typeof breakpoints;

// 響應式工具類
export const responsiveClasses = {
  // 容器寬度
  container: 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',

  // 網格系統
  grid: {
    responsive: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6',
    dashboard: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4',
    sidebar: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2',
  },

  // 間距
  spacing: {
    section: 'p-4 sm:p-6 lg:p-8',
    card: 'p-3 sm:p-4 lg:p-6',
    component: 'p-2 sm:p-3 lg:p-4',
  },

  // 文字大小
  text: {
    title: 'text-lg sm:text-xl lg:text-2xl xl:text-3xl',
    subtitle: 'text-sm sm:text-base lg:text-lg',
    body: 'text-xs sm:text-sm lg:text-base',
    caption: 'text-[10px] sm:text-xs lg:text-sm',
    micro: 'text-[8px] sm:text-[10px] lg:text-xs',
  },

  // 按鈕
  button: {
    primary: 'px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 text-sm sm:text-base',
    secondary: 'px-3 py-2 sm:px-4 lg:px-6 text-sm',
    icon: 'p-2 sm:p-3 lg:p-4',
  },

  // 卡片
  card: {
    default: 'rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6',
    compact: 'rounded-md sm:rounded-lg p-2 sm:p-3 lg:p-4',
    spacious: 'rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8',
  },
} as const;

// Hook: 響應式狀態
import { useState, useEffect } from 'react';

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < breakpoints.sm) setBreakpoint('sm');
      else if (width < breakpoints.md) setBreakpoint('md');
      else if (width < breakpoints.lg) setBreakpoint('lg');
      else if (width < breakpoints.xl) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const isMobile = breakpoint === 'sm';
  const isTablet = breakpoint === 'md';
  const isDesktop = breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl';
  const isLargeDesktop = breakpoint === '2xl';

  return { breakpoint, isMobile, isTablet, isDesktop, isLargeDesktop };
};

// Hook: 設備方向
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  return orientation;
};

// Hook: 觸控設備檢測
export const useTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  return isTouchDevice;
};

// 工具函數: 條件渲染
export const renderResponsive = <T>(mobile: T, tablet?: T, desktop?: T, largeDesktop?: T) => {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useBreakpoint();

  if (isMobile) return mobile;
  if (isTablet && tablet) return tablet;
  if (isLargeDesktop && largeDesktop) return largeDesktop;
  if (isDesktop && desktop) return desktop;

  return mobile;
};

// 工具函數: 響應式類名
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// 工具函數: 條件類名
export const cx = (base: string, responsive: Record<Breakpoint, string>) => {
  const classes = [base];

  // 根據當前斷點添加響應式類
  const { breakpoint } = useBreakpoint();
  const responsiveClass = responsive[breakpoint];
  if (responsiveClass) classes.push(responsiveClass);

  return classes.join(' ');
};

// 常見的響應式模式
export const responsivePatterns = {
  // 隱藏模式
  hidden: {
    mobileOnly: 'block sm:hidden',
    tabletOnly: 'hidden sm:block lg:hidden',
    desktopOnly: 'hidden lg:block',
    mobileTablet: 'block lg:hidden',
    tabletDesktop: 'hidden sm:block',
  },

  // 佈局模式
  layout: {
    sidebarCollapsed: 'w-16 sm:w-20 lg:w-64',
    sidebarExpanded: 'w-64',
    contentWithSidebar: 'ml-16 sm:ml-20 lg:ml-64',
    contentFullWidth: 'ml-0',
  },

  // 導航模式
  navigation: {
    mobileMenu: 'fixed inset-0 z-50 lg:hidden',
    desktopMenu: 'hidden lg:flex',
    mobileOverlay: 'fixed inset-0 bg-black/50 lg:hidden',
  },
} as const;
