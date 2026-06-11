'use client';

import { useEffect, useRef, useCallback } from 'react';

export interface TouchGestureOptions {
  threshold?: number;
  preventScroll?: boolean;
}

export function useTouchGesture(
  onTap?: () => void,
  onLongPress?: () => void,
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  options?: TouchGestureOptions
) {
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const elementRef = useRef<HTMLElement>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    const startX = touch.clientX;
    
    longPressTimer.current = setTimeout(() => {
      onLongPress?.();
    }, 800);
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (options?.preventScroll) {
        moveEvent.preventDefault();
      }
      
      const moveX = moveEvent.touches[0].clientX;
      const deltaX = moveX - startX;
      
      if (Math.abs(deltaX) > (options?.threshold ?? 50)) {
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      }
    };
    
    const handleTouchEnd = () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      
      if (!elementRef.current?.dataset.longpress) {
        onTap?.();
      }
      
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
    
    const element = elementRef.current;
    if (element) {
      element.addEventListener('touchmove', handleTouchMove, { passive: !options?.preventScroll });
      element.addEventListener('touchend', handleTouchEnd);
    }
  }, [onTap, onLongPress, onSwipeLeft, onSwipeRight, options]);

  return {
    ref: elementRef,
    onTouchStart: handleTouchStart,
  };
}