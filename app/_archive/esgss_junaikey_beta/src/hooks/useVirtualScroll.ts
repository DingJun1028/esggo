import { useState, useEffect, useRef, useMemo } from 'react';

interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  itemCount: number;
  overscan?: number;
}

interface VirtualScrollResult {
  virtualItems: Array<{
    index: number;
    start: number;
    size: number;
  }>;
  totalHeight: number;
  scrollToIndex: (index: number) => void;
}

/**
 * 虛擬滾動 Hook - 優化長列表性能
 * 只渲染可見區域的項目,大幅提升滾動性能
 */
export function useVirtualScroll({
  itemHeight,
  containerHeight,
  itemCount,
  overscan = 3,
}: VirtualScrollOptions): VirtualScrollResult {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLElement | null>(null);

  // 計算可見範圍
  const { virtualItems, totalHeight } = useMemo(() => {
    const rangeStart = Math.floor(scrollTop / itemHeight);
    const rangeEnd = Math.ceil((scrollTop + containerHeight) / itemHeight);

    // 添加 overscan 以提供更平滑的滾動體驗
    const start = Math.max(0, rangeStart - overscan);
    const end = Math.min(itemCount - 1, rangeEnd + overscan);

    const items = [];
    for (let i = start; i <= end; i++) {
      items.push({
        index: i,
        start: i * itemHeight,
        size: itemHeight,
      });
    }

    return {
      virtualItems: items,
      totalHeight: itemCount * itemHeight,
    };
  }, [scrollTop, itemHeight, containerHeight, itemCount, overscan]);

  // 滾動到指定索引
  const scrollToIndex = (index: number) => {
    if (scrollElementRef.current) {
      const targetScrollTop = index * itemHeight;
      scrollElementRef.current.scrollTop = targetScrollTop;
      setScrollTop(targetScrollTop);
    }
  };

  // 監聽滾動事件
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      setScrollTop(target.scrollTop);
    };

    const element = scrollElementRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll, { passive: true });
      return () => element.removeEventListener('scroll', handleScroll);
    }

    return undefined;
  }, []);

  // 暴露 ref 設置方法
  useEffect(() => {
    const setRef = (element: HTMLElement | null) => {
      scrollElementRef.current = element;
    };
    (useVirtualScroll as any).setScrollElement = setRef;
  }, []);

  return {
    virtualItems,
    totalHeight,
    scrollToIndex,
  };
}

/**
 * 設置滾動容器元素
 */
export function setVirtualScrollElement(element: HTMLElement | null) {
  if ((useVirtualScroll as any).setScrollElement) {
    (useVirtualScroll as any).setScrollElement(element);
  }
}
