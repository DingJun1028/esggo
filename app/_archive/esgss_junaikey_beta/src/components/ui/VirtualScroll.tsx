/**
 * 🌀 VirtualScroll - 虛擬滾動組件
 * 高效能渲染大型列表，只渲染可視區域內的項目
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Loader2 } from 'lucide-react';

// ==================== 類型定義 ====================

export interface VirtualScrollProps<T = any> {
  /** 資料陣列 */
  items: T[];
  /** 項目渲染函數 */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** 項目高度（固定高度模式） */
  itemHeight?: number;
  /** 項目高度不固定時的自訂測量函數 */
  estimateSize?: (index: number) => number;
  /** 可視區域高度 */
  height: number | string;
  /** 容器寬度 */
  width?: number | string;
  /** 緩衝區大小（上下各多渲染幾項） */
  overscan?: number;
  /** 是否啟用捲動到頂部按鈕 */
  showScrollToTop?: boolean;
  /** 是否啟用無限載入 */
  hasMore?: boolean;
  /** 載入中狀態 */
  isLoading?: boolean;
  /** 載入更多回調函數 */
  onLoadMore?: () => void;
  /** 滾動到底部距離阈值 */
  scrollThreshold?: number;
  /** 自定義 className */
  className?: string;
  /** 是否使用動畫 */
  animated?: boolean;
  /** 滾動容器 ref 回調 */
  containerRef?: (el: HTMLDivElement | null) => void;
}

// ==================== 虛擬滾動鉤子 ====================

export function useVirtualScroll<T>({
  items,
  itemHeight,
  estimateSize = () => 50,
  height = 400,
  overscan = 5,
  scrollThreshold = 100,
}: {
  items: T[];
  itemHeight?: number;
  estimateSize?: (index: number) => number;
  height: number | string;
  overscan?: number;
  scrollThreshold?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // 計算總高度
  const totalHeight = useMemo(() => {
    if (itemHeight) {
      return items.length * itemHeight;
    }
    return items.reduce((sum, _, index) => sum + estimateSize(index), 0);
  }, [items, itemHeight, estimateSize]);

  // 計算可見範圍
  const visibleRange = useMemo(() => {
    const containerHeight = typeof height === 'number' ? height : 400;
    const startIndex = Math.max(0, Math.floor(scrollTop / (itemHeight || 50)) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / (itemHeight || 50)) + overscan
    );
    return { startIndex, endIndex };
  }, [scrollTop, items.length, itemHeight, estimateSize, height, overscan]);

  // 處理滾動
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setScrollTop(target.scrollTop);

    // 檢測是否接近底部
    const { scrollHeight, clientHeight, scrollTop: st } = target;
    const distanceToBottom = scrollHeight - clientHeight - st;
    setIsAtBottom(distanceToBottom < scrollThreshold);
  }, [scrollThreshold]);

  // 滾動到指定索引
  const scrollToIndex = useCallback((index: number, align: 'start' | 'center' | 'end' = 'start') => {
    if (!containerRef.current) return;

    const targetPosition = itemHeight 
      ? index * itemHeight 
      : items.slice(0, index).reduce((sum, _, i) => sum + estimateSize(i), 0);

    containerRef.current.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  }, [itemHeight, estimateSize, items]);

  // 滾動到頂部
  const scrollToTop = useCallback(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 滾動到底部
  const scrollToBottom = useCallback(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({ 
      top: containerRef.current.scrollHeight, 
      behavior: 'smooth' 
    });
  }, []);

  return {
    containerRef,
    scrollTop,
    isAtBottom,
    totalHeight,
    visibleRange,
    handleScroll,
    scrollToIndex,
    scrollToTop,
    scrollToBottom,
  };
}

// ==================== 固定高度虛擬列表 ====================

export const FixedSizeVirtualList = <T extends { id?: string | number }>({
  items,
  renderItem,
  itemHeight = 50,
  height = 400,
  width = '100%',
  overscan = 5,
  showScrollToTop = false,
  hasMore = false,
  isLoading = false,
  onLoadMore,
  scrollThreshold = 100,
  className = '',
  animated = true,
  containerRef: externalContainerRef,
}: VirtualScrollProps<T>) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const containerRef = externalContainerRef || internalRef;
  const [scrollTop, setScrollTop] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // 計算可見範圍
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + (typeof height === 'number' ? height : 400)) / itemHeight) + overscan
    );
    return { startIndex, endIndex };
  }, [scrollTop, items.length, itemHeight, height, overscan]);

  // 處理滾動
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setScrollTop(target.scrollTop);

    // 檢測是否接近底部
    const { scrollHeight, clientHeight, scrollTop: st } = target;
    const distanceToBottom = scrollHeight - clientHeight - st;
    const atBottom = distanceToBottom < scrollThreshold;
    setIsAtBottom(atBottom);

    // 觸發載入更多
    if (atBottom && hasMore && !isLoading && onLoadMore) {
      onLoadMore();
    }
  }, [scrollThreshold, hasMore, isLoading, onLoadMore]);

  // 滾動到頂部
  const scrollToTop = useCallback(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [containerRef]);

  // 渲染項目
  const visibleItems = useMemo(() => {
    const result = [];
    for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
      if (i >= 0 && i < items.length) {
        result.push(
          <div
            key={items[i].id || i}
            style={{
              position: 'absolute',
              top: i * itemHeight,
              left: 0,
              right: 0,
              height: itemHeight,
            }}
          >
            {animated ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                {renderItem(items[i], i)}
              </motion.div>
            ) : (
              renderItem(items[i], i)
            )}
          </div>
        );
      }
    }
    return result;
  }, [items, visibleRange, itemHeight, renderItem, animated]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      style={{ height, width }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems}
      </div>

      {/* 滾動到頂部按鈕 */}
      {showScrollToTop && scrollTop > 200 && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed right-8 bottom-8 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <ChevronUp size={24} />
        </motion.button>
      )}

      {/* 載入更多指示器 */}
      {isLoading && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center p-4 bg-gradient-to-t from-white to-transparent">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      )}
    </div>
  );
};

// ==================== 可變高度虛擬列表 ====================

export const VariableSizeVirtualList = <T extends { id?: string | number }>({
  items,
  renderItem,
  estimateSize = () => 50,
  height = 400,
  width = '100%',
  overscan = 5,
  showScrollToTop = false,
  hasMore = false,
  isLoading = false,
  onLoadMore,
  scrollThreshold = 100,
  className = '',
  animated = true,
  containerRef: externalContainerRef,
}: VirtualScrollProps<T>) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const containerRef = externalContainerRef || internalRef;
  const [scrollTop, setScrollTop] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const itemHeights = useRef<Map<number, number>>(new Map());

  // 計算每個項目位置
  const itemPositions = useMemo(() => {
    const positions: { index: number; offset: number; size: number }[] = [];
    let currentOffset = 0;

    for (let i = 0; i < items.length; i++) {
      const size = itemHeights.current.get(i) || estimateSize(i);
      positions.push({ index: i, offset: currentOffset, size });
      currentOffset += size;
    }

    return positions;
  }, [items, estimateSize]);

  // 計算總高度
  const totalHeight = useMemo(() => {
    return itemPositions.reduce((sum, pos) => sum + pos.size, 0);
  }, [itemPositions]);

  // 二分搜尋找到可見範圍
  const findVisibleRange = useCallback(() => {
    const containerHeight = typeof height === 'number' ? height : 400;
    let startIndex = 0;
    let endIndex = items.length - 1;

    // 找起始索引
    let low = 0;
    let high = items.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const pos = itemPositions[mid];
      if (pos.offset + pos.size <= scrollTop) {
        startIndex = mid + 1;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    // 找結束索引
    const visibleBottom = scrollTop + containerHeight;
    low = startIndex;
    high = items.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const pos = itemPositions[mid];
      if (pos.offset < visibleBottom) {
        endIndex = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return {
      startIndex: Math.max(0, startIndex - overscan),
      endIndex: Math.min(items.length - 1, endIndex + overscan),
    };
  }, [scrollTop, items.length, itemPositions, height, overscan]);

  const visibleRange = findVisibleRange();

  // 處理滾動
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setScrollTop(target.scrollTop);

    const { scrollHeight, clientHeight, scrollTop: st } = target;
    const distanceToBottom = scrollHeight - clientHeight - st;
    const atBottom = distanceToBottom < scrollThreshold;
    setIsAtBottom(atBottom);

    if (atBottom && hasMore && !isLoading && onLoadMore) {
      onLoadMore();
    }
  }, [scrollThreshold, hasMore, isLoading, onLoadMore]);

  // 測量項目高度
  const measureItem = useCallback((index: number, element: HTMLDivElement) => {
    const size = element.getBoundingClientRect().height;
    if (itemHeights.current.get(index) !== size) {
      itemHeights.current.set(index, size);
      // 觸發重新計算（實際專案中可能需要優化）
      // setRecalculate(prev => !prev);
    }
  }, []);

  // 滾動到指定項目
  const scrollToItem = useCallback((index: number) => {
    if (index < 0 || index >= items.length) return;
    
    const targetPosition = itemPositions[index].offset;
    containerRef.current?.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  }, [itemPositions, containerRef]);

  // 渲染可見項目
  const visibleItems = useMemo(() => {
    const result = [];
    for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
      if (i >= 0 && i < items.length) {
        const pos = itemPositions[i];
        result.push(
          <div
            key={items[i].id || i}
            ref={(el) => {
              if (el) measureItem(i, el);
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              transform: `translateY(${pos.offset}px)`,
            }}
          >
            {animated ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                {renderItem(items[i], i)}
              </motion.div>
            ) : (
              renderItem(items[i], i)
            )}
          </div>
        );
      }
    }
    return result;
  }, [items, visibleRange, itemPositions, renderItem, animated, measureItem]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      style={{ height, width }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems}
      </div>

      {/* 滾動到頂部按鈕 */}
      {showScrollToTop && scrollTop > 200 && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed right-8 bottom-8 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <ChevronUp size={24} />
        </motion.button>
      )}

      {/* 載入更多指示器 */}
      {isLoading && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center p-4 bg-gradient-to-t from-white to-transparent">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      )}
    </div>
  );
};

// ==================== 虛擬網格 ====================

export interface VirtualGridProps<T = any> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  columns?: number;
  itemWidth: number;
  itemHeight?: number;
  gap?: number;
  height?: number | string;
  overscan?: number;
  className?: string;
}

export const VirtualGrid = <T extends { id?: string | number }>({
  items,
  renderItem,
  columns = 4,
  itemWidth,
  itemHeight = 150,
  gap = 16,
  height = 600,
  overscan = 2,
  className = '',
}: VirtualGridProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // 計算行數
  const rowCount = Math.ceil(items.length / columns);
  const totalHeight = rowCount * (itemHeight + gap) - gap;
  const containerHeight = typeof height === 'number' ? height : 600;

  // 計算可見範圍
  const visibleRange = useMemo(() => {
    const rowHeight = itemHeight + gap;
    const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const endRow = Math.min(
      rowCount - 1,
      Math.ceil((scrollTop + containerHeight) / rowHeight) + overscan
    );
    return { startRow, endRow };
  }, [scrollTop, rowCount, itemHeight, gap, containerHeight, overscan]);

  // 處理滾動
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // 渲染項目
  const visibleItems = useMemo(() => {
    const result = [];
    for (let row = visibleRange.startRow; row <= visibleRange.endRow; row++) {
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        if (index >= items.length) break;

        result.push(
          <div
            key={items[index].id || index}
            className="absolute"
            style={{
              width: itemWidth,
              height: itemHeight,
              left: col * (itemWidth + gap),
              top: row * (itemHeight + gap),
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {renderItem(items[index], index)}
            </motion.div>
          </div>
        );
      }
    }
    return result;
  }, [items, visibleRange, columns, itemWidth, itemHeight, gap, renderItem]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      style={{ height, width: '100%' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems}
      </div>
    </div>
  );
};

// ==================== 使用範例 ====================

/**
 * 使用範例
 * 
 * ```tsx
 * import { FixedSizeVirtualList, VariableSizeVirtualList, VirtualGrid } from '@/components/ui';
 * 
 * // 固定高度列表
 * const FixedList = () => (
 *   <FixedSizeVirtualList
 *     items={data}
 *     itemHeight={60}
 *     height={400}
 *     renderItem={(item, index) => (
 *       <div className="p-4 border-b">{item.name}</div>
 *     )}
 *   />
 * );
 * 
 * // 可變高度列表
 * const VariableList = () => (
 *   <VariableSizeVirtualList
 *     items={data}
 *     height={400}
 *     estimateSize={(index) => data[index].height}
 *     renderItem={(item, index) => (
 *       <div className="p-4">{item.content}</div>
 *     )}
 *   />
 * );
 * 
 * // 網格佈局
 * const Grid = () => (
 *   <VirtualGrid
 *     items={data}
 *     columns={3}
 *     itemWidth={200}
 *     itemHeight={150}
 *     renderItem={(item, index) => (
 *       <div className="card">{item.name}</div>
 *     )}
 *   />
 * );
 * ```
 */

export default FixedSizeVirtualList;
