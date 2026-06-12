'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useOmniTheme } from '../theme/OmniThemeProvider';
import { Brain, X, Send } from 'lucide-react';
import type { OmniAssistantProps, AssistantState, AssistantSize, AssistantColor, AssistantPosition } from '@/types/omni-assistant';

export function OmniAssistant({
  variant = 'compact',
  position,
  size = 'md',
  color = 'berkeley-blue',
  initialState = 'idle',
  autoCollapse = true,
  allowDrag = true,
  onPositionChange,
  onStateChange,
}: OmniAssistantProps) {
  const { isMobile } = useOmniTheme();
  const [state, setState] = useState<AssistantState>(initialState);
  const [isExpanded, setIsExpanded] = useState(variant === 'expanded');
  const [currentPosition, setCurrentPosition] = useState<AssistantPosition>(
    position || { x: isMobile ? 16 : 24, y: isMobile ? 80 : 24 }
  );
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  const orbSize: Record<AssistantSize, string> = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  const orbColor: Record<AssistantColor, string> = {
    'berkeley-blue': 'bg-berkeley-blue',
    'california-gold': 'bg-california-gold',
    'glow-cyan': 'bg-cyan-core shadow-cyan-glow',
    'glow-emerald': 'bg-emerald-soul shadow-emerald-glow',
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!allowDrag) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    
    const newPosition = {
      x: Math.max(16, Math.min(window.innerWidth - 72, currentPosition.x + deltaX)),
      y: Math.max(16, Math.min(window.innerHeight - 72, currentPosition.y + deltaY)),
    };
    
    setCurrentPosition(newPosition);
    onPositionChange?.(newPosition);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onPositionChange?.(currentPosition);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, currentPosition]);

  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  if (!isExpanded) {
    return (
      <div
        className={cn(
          'fixed z-40 rounded-full cursor-pointer transition-all duration-300',
          'flex items-center justify-center',
          'shadow-lg hover:scale-110 active:scale-95',
          orbSize[size],
          orbColor[color],
          state === 'idle' && 'animate-pulse-slow',
          state === 'listening' && 'animate-glow-pulse',
          isMobile ? 'bottom-20 right-4' : 'bottom-6 right-6'
        )}
        style={{
          ...(isDragging ? { 
            right: currentPosition.x, 
            bottom: currentPosition.y,
            zIndex: 50,
          } : !isMobile ? {
            right: currentPosition.x ? window.innerWidth - currentPosition.x - 56 : undefined,
            bottom: currentPosition.y,
          } : {
            right: 16,
            bottom: 80,
          }),
        }}
        onClick={() => setIsExpanded(true)}
        onMouseDown={handleMouseDown}
      >
        <Brain className="w-6 h-6 text-white" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fixed z-40 bg-theme-surface-glass backdrop-blur-md',
        'border border-theme-border rounded-2xl shadow-xl',
        'flex flex-col',
        isMobile ? 'w-[calc(100vw-32px)] max-w-sm h-[500px]' : 'w-80 h-[500px]',
        isMobile ? 'bottom-20 right-4' : 'bottom-32 right-20'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-theme-divider">
        <div className="flex items-center gap-2">
          <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', orbColor[color])}>
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-theme-text-primary">OmniAssistant</span>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-1 rounded hover:bg-theme-bg-tertiary"
        >
          <X className="w-4 h-4 text-theme-text-secondary" />
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Chat messages would go here */}
        <div className="text-center text-theme-text-muted text-caption mt-4">
          {state === 'idle' && '點擊開始對話'}
          {state === 'listening' && '聆聽中...'}
          {state === 'processing' && '處理中...'}
          {state === 'speaking' && '回覆中...'}
        </div>
      </div>
      
      <div className="p-3 border-t border-theme-divider">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="輸入您的問題..."
            className="flex-1 h-9 px-3 rounded-md border border-theme-border bg-theme-bg-primary"
          />
          <button className="w-9 h-9 rounded-md bg-theme-primary text-theme-accent flex items-center justify-center">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}