import { useState, useEffect } from 'react';

/**
 * 屏幕斷點定義
 */
export const BREAKPOINTS = {
  xs: 0,      // 超小屏 - 手機豎屏
  sm: 640,    // 小屏 - 大手機
  md: 768,    // 中屏 - 平板
  lg: 1024,   // 大屏 - 小筆電
  xl: 1280,   // 超大屏 - 筆電/桌面
  '2xl': 1536 // 超超大屏 - 大桌面
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * 設備類型
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'large-desktop';

/**
 * 方向類型
 */
export type Orientation = 'portrait' | 'landscape';

/**
 * 響應式狀態接口
 */
export interface ResponsiveState {
  /** 當前屏幕寬度 */
  width: number;
  /** 當前屏幕高度 */
  height: number;
  /** 當前斷點 */
  breakpoint: Breakpoint;
  /** 設備類型 */
  deviceType: DeviceType;
  /** 屏幕方向 */
  orientation: Orientation;
  /** 是否為移動設備 */
  isMobile: boolean;
  /** 是否為平板設備 */
  isTablet: boolean;
  /** 是否為桌面設備 */
  isDesktop: boolean;
  /** 是否為大桌面設備 */
  isLargeDesktop: boolean;
  /** 是否為觸摸設備 */
  isTouchDevice: boolean;
  /** 是否支持懸停 */
  supportsHover: boolean;
  /** 像素密度 */
  pixelRatio: number;
}

/**
 * 響應式Hook - 提供完整的響應式狀態管理
 */
export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    // 初始化狀態
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const height = typeof window !== 'undefined' ? window.innerHeight : 768;

    return {
      width,
      height,
      breakpoint: getBreakpoint(width),
      deviceType: getDeviceType(width),
      orientation: getOrientation(width, height),
      isMobile: width < BREAKPOINTS.md,
      isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
      isDesktop: width >= BREAKPOINTS.lg && width < BREAKPOINTS['2xl'],
      isLargeDesktop: width >= BREAKPOINTS['2xl'],
      isTouchDevice: typeof window !== 'undefined' && 'ontouchstart' in window,
      supportsHover: typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches,
      pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setState({
        width,
        height,
        breakpoint: getBreakpoint(width),
        deviceType: getDeviceType(width),
        orientation: getOrientation(width, height),
        isMobile: width < BREAKPOINTS.md,
        isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
        isDesktop: width >= BREAKPOINTS.lg && width < BREAKPOINTS['2xl'],
        isLargeDesktop: width >= BREAKPOINTS['2xl'],
        isTouchDevice: 'ontouchstart' in window,
        supportsHover: window.matchMedia('(hover: hover)').matches,
        pixelRatio: window.devicePixelRatio
      });
    };

    // 監聽窗口大小變化
    window.addEventListener('resize', handleResize);

    // 監聽方向變化
    window.addEventListener('orientationchange', handleResize);

    // 初始化
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return state;
}

/**
 * 根據寬度獲取斷點
 */
function getBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
}

/**
 * 根據寬度獲取設備類型
 */
function getDeviceType(width: number): DeviceType {
  if (width >= BREAKPOINTS['2xl']) return 'large-desktop';
  if (width >= BREAKPOINTS.lg) return 'desktop';
  if (width >= BREAKPOINTS.md) return 'tablet';
  return 'mobile';
}

/**
 * 根據寬度和高度獲取方向
 */
function getOrientation(width: number, height: number): Orientation {
  return width > height ? 'landscape' : 'portrait';
}

/**
 * 自定義Hook - 檢查是否匹配特定斷點
 */
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const { width } = useResponsive();

  switch (breakpoint) {
    case 'xs': return width >= BREAKPOINTS.xs;
    case 'sm': return width >= BREAKPOINTS.sm;
    case 'md': return width >= BREAKPOINTS.md;
    case 'lg': return width >= BREAKPOINTS.lg;
    case 'xl': return width >= BREAKPOINTS.xl;
    case '2xl': return width >= BREAKPOINTS['2xl'];
    default: return false;
  }
}

/**
 * 自定義Hook - 檢查是否在指定範圍內
 */
export function useBreakpointRange(
  min: Breakpoint = 'xs',
  max: Breakpoint = '2xl'
): boolean {
  const { width } = useResponsive();

  const minWidth = BREAKPOINTS[min];
  const maxWidth = BREAKPOINTS[max];

  return width >= minWidth && width < maxWidth;
}

/**
 * 自定義Hook - 設備類型檢查
 */
export function useDeviceType(targetType: DeviceType): boolean {
  const { deviceType } = useResponsive();
  return deviceType === targetType;
}

/**
 * 自定義Hook - 方向檢查
 */
export function useOrientation(targetOrientation: Orientation): boolean {
  const { orientation } = useResponsive();
  return orientation === targetOrientation;
}

/**
 * 自定義Hook - 容器查詢 (Container Queries) 模擬
 */
export function useContainerWidth(containerRef: React.RefObject<HTMLElement>) {
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.unobserve(element);
    };
  }, [containerRef]);

  return containerWidth;
}

/**
 * 響應式圖片Hook - 根據屏幕密度和大小選擇最適合的圖片
 */
export function useResponsiveImage(
  baseSrc: string,
  breakpoints: { [key in Breakpoint]?: string } = {}
) {
  const { breakpoint, pixelRatio } = useResponsive();

  // 根據斷點和像素密度選擇圖片
  const getImageSrc = () => {
    // 高像素密度設備使用 2x 圖片
    const suffix = pixelRatio >= 2 ? '@2x' : '';

    // 根據斷點選擇合適的圖片
    const breakpointSrc = breakpoints[breakpoint];
    if (breakpointSrc) {
      return pixelRatio >= 2 ? breakpointSrc.replace('.jpg', '@2x.jpg').replace('.png', '@2x.png') : breakpointSrc;
    }

    // 返回基礎圖片
    return pixelRatio >= 2 ? baseSrc.replace('.jpg', '@2x.jpg').replace('.png', '@2x.png') : baseSrc;
  };

  return getImageSrc();
}

/**
 * 響應式動畫Hook - 根據設備性能調整動畫
 */
export function useResponsiveAnimation() {
  const { deviceType, supportsHover, isTouchDevice } = useResponsive();

  const getAnimationConfig = () => {
    // 根據設備調整動畫設置
    const configs = {
      mobile: {
        duration: 200,
        easing: 'ease-out',
        reducedMotion: true
      },
      tablet: {
        duration: 300,
        easing: 'ease-out',
        reducedMotion: false
      },
      desktop: {
        duration: 400,
        easing: 'ease-out',
        reducedMotion: false
      },
      'large-desktop': {
        duration: 500,
        easing: 'ease-out',
        reducedMotion: false
      }
    };

    const config = configs[deviceType];

    // 如果用戶偏好減少動畫，進一步降低動畫
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      config.duration = Math.min(config.duration, 150);
      config.reducedMotion = true;
    }

    return {
      ...config,
      hoverEnabled: supportsHover && !isTouchDevice,
      touchEnabled: isTouchDevice
    };
  };

  return getAnimationConfig();
}

/**
 * 響應式佈局Hook - 提供佈局相關的響應式信息
 */
export function useResponsiveLayout() {
  const responsive = useResponsive();

  const getLayoutConfig = () => {
    return {
      // 側邊欄配置
      sidebar: {
        width: responsive.isMobile ? '100vw' : '280px',
        position: responsive.isMobile ? 'fixed' : 'relative',
        overlay: responsive.isMobile
      },

      // 網格配置
      grid: {
        columns: responsive.isMobile ? 1 :
                 responsive.isTablet ? 2 :
                 responsive.isDesktop ? 3 : 4,
        gap: responsive.isMobile ? '1rem' : '1.5rem'
      },

      // 卡片配置
      card: {
        padding: responsive.isMobile ? '1rem' : '1.5rem',
        shadow: responsive.isMobile ? 'sm' : 'md'
      },

      // 導航配置
      navigation: {
        type: responsive.isMobile ? 'hamburger' : 'horizontal',
        height: responsive.isMobile ? '56px' : '64px'
      }
    };
  };

  return {
    ...responsive,
    layout: getLayoutConfig()
  };
}

/**
 * 動畫偏好Hook - 根據設備性能和用戶偏好決定動畫設置
 */
export function useAnimationPreferences() {
  const { deviceType, supportsHover, pixelRatio } = useResponsive();

  // 檢查用戶是否偏好減少動畫
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const getAnimationConfig = () => {
    // 如果用戶偏好減少動畫，一律禁用
    if (prefersReducedMotion) {
      return {
        shouldAnimate: false,
        getAnimationDuration: () => 0,
        reducedMotion: true
      };
    }

    // 根據設備類型調整動畫設置
    const configs = {
      mobile: {
        shouldAnimate: pixelRatio <= 2, // 高像素密度設備可能動畫較慢
        duration: 200,
        reducedMotion: false
      },
      tablet: {
        shouldAnimate: true,
        duration: 300,
        reducedMotion: false
      },
      desktop: {
        shouldAnimate: true,
        duration: 400,
        reducedMotion: false
      },
      'large-desktop': {
        shouldAnimate: true,
        duration: 500,
        reducedMotion: false
      }
    };

    const config = configs[deviceType];

    return {
      shouldAnimate: config.shouldAnimate,
      getAnimationDuration: (multiplier = 1) => config.duration * multiplier,
      reducedMotion: config.reducedMotion,
      supportsHover,
      pixelRatio
    };
  };

  return getAnimationConfig();
}