/**
 * Tour - 互動式引導教學系統
 * 提供引導用戶熟悉系統功能的 tour 功能
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  CheckCircle, 
  Circle,
  Play,
  RotateCcw,
  SkipForward
} from 'lucide-react';

// ==================== 類型定義 ====================

export interface TourStep {
  target: string; // CSS 選擇器
  title: string;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  action?: {
    label: string;
    onClick: () => void;
  };
  highlightPadding?: number;
}

export interface Tour {
  id: string;
  name: string;
  description?: string;
  steps: TourStep[];
  isOptional?: boolean;
}

interface TourStore {
  // Tour 狀態
  currentTour: Tour | null;
  currentStepIndex: number;
  isOpen: boolean;
  completedTours: string[];
  
  // Tour 操作
  startTour: (tour: Tour) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  endTour: () => void;
  skipTour: (tourId: string) => void;
  completeTour: (tourId: string) => void;
  
  // 標記步驟為已看過
  markStepViewed: (tourId: string, stepIndex: number) => void;
  isStepViewed: (tourId: string, stepIndex: number) => boolean;
}

// ==================== Zustand Store ====================

export const useTourStore = create<TourStore>()(
  persist(
    (set, get) => ({
      currentTour: null,
      currentStepIndex: 0,
      isOpen: false,
      completedTours: [],

      startTour: (tour) => {
        set({
          currentTour: tour,
          currentStepIndex: 0,
          isOpen: true,
        });
      },

      nextStep: () => {
        const { currentTour, currentStepIndex } = get();
        if (currentTour && currentStepIndex < currentTour.steps.length - 1) {
          set({ currentStepIndex: currentStepIndex + 1 });
        } else {
          get().endTour();
        }
      },

      prevStep: () => {
        const { currentStepIndex } = get();
        if (currentStepIndex > 0) {
          set({ currentStepIndex: currentStepIndex - 1 });
        }
      },

      goToStep: (index) => {
        set({ currentStepIndex: index });
      },

      endTour: () => {
        const { currentTour } = get();
        if (currentTour) {
          get().markStepViewed(currentTour.id, get().currentStepIndex);
        }
        set({
          currentTour: null,
          currentStepIndex: 0,
          isOpen: false,
        });
      },

      skipTour: (tourId) => {
        set((state) => ({
          completedTours: [...state.completedTours, `skipped:${tourId}`],
          currentTour: null,
          currentStepIndex: 0,
          isOpen: false,
        }));
      },

      completeTour: (tourId) => {
        set((state) => ({
          completedTours: [...state.completedTours, `completed:${tourId}`],
          currentTour: null,
          currentStepIndex: 0,
          isOpen: false,
        }));
      },

      markStepViewed: (tourId, stepIndex) => {
        const key = `viewed:${tourId}:${stepIndex}`;
        const viewedSteps = JSON.parse(
          localStorage.getItem('tour_viewed_steps') || '{}'
        );
        viewedSteps[key] = true;
        localStorage.setItem('tour_viewed_steps', JSON.stringify(viewedSteps));
      },

      isStepViewed: (tourId, stepIndex) => {
        const key = `viewed:${tourId}:${stepIndex}`;
        const viewedSteps = JSON.parse(
          localStorage.getItem('tour_viewed_steps') || '{}'
        );
        return viewedSteps[key] === true;
      },
    }),
    {
      name: 'tour-storage',
      partialize: (state) => ({ completedTours: state.completedTours }),
    }
  )
);

// ==================== Hook ====================

export function useTour() {
  const store = useTourStore();

  return {
    startTour: store.startTour,
    nextStep: store.nextStep,
    prevStep: store.prevStep,
    goToStep: store.goToStep,
    endTour: store.endTour,
    skipTour: store.skipTour,
    completeTour: store.completeTour,
    isOpen: store.isOpen,
    currentTour: store.currentTour,
    currentStepIndex: store.currentStepIndex,
  };
}

// ==================== Tour 遮罩 ====================

export const TourMask: React.FC = () => {
  const { currentTour, currentStepIndex } = useTourStore();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!currentTour) return;

    const updatePosition = () => {
      const step = currentTour.steps[currentStepIndex];
      const targetElement = document.querySelector(step.target);
      
      if (targetElement) {
        setTargetRect(targetElement.getBoundingClientRect());
        
        // 滾動到目標元素
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [currentTour, currentStepIndex]);

  if (!currentTour) return null;

  const step = currentTour.steps[currentStepIndex];
  const highlightPadding = step.highlightPadding ?? 8;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {/* 遮罩層 - 使用 SVG 實現挖孔效果 */}
      <svg className="absolute inset-0 w-full h-full" style={{ isolation: 'isolate' }}>
        <defs>
          <mask id="tour-mask">
            <rect fill="white" x="0" y="0" width="100%" height="100%" />
            {targetRect && (
              <rect
                x={targetRect.left - highlightPadding}
                y={targetRect.top - highlightPadding}
                width={targetRect.width + highlightPadding * 2}
                height={targetRect.height + highlightPadding * 2}
                rx="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          fill="rgba(0, 0, 0, 0.6)"
          className="w-full h-full"
          style={{ mask: 'url(#tour-mask)' }}
        />
      </svg>

      {/* 目標元素高亮框 */}
      {targetRect && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute border-2 border-blue-500 rounded-lg shadow-[0_0_0_4px_rgba(59,130,246,0.3)]"
          style={{
            left: targetRect.left - highlightPadding,
            top: targetRect.top - highlightPadding,
            width: targetRect.width + highlightPadding * 2,
            height: targetRect.height + highlightPadding * 2,
          }}
        />
      )}
    </div>
  );
};

// ==================== Tour Tooltip ====================

export const TourTooltip: React.FC = () => {
  const { 
    currentTour, 
    currentStepIndex, 
    nextStep, 
    prevStep, 
    goToStep,
    endTour, 
    skipTour,
    completeTour,
  } = useTourStore();

  if (!currentTour) return null;

  const step = currentTour.steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === currentTour.steps.length - 1;
  const progress = ((currentStepIndex + 1) / currentTour.steps.length) * 100;

  // 計算 tooltip 位置
  const getTooltipPosition = () => {
    const stepPos = step.position || 'auto';
    if (stepPos !== 'auto') return stepPos;

    // 自動計算最佳位置
    const targetElement = document.querySelector(step.target);
    if (!targetElement) return 'bottom';

    const rect = targetElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // 檢查哪個方向有更多空間
    const spaceAbove = rect.top;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceLeft = rect.left;
    const spaceRight = viewportWidth - rect.right;

    const maxVertical = Math.max(spaceAbove, spaceBelow);
    const maxHorizontal = Math.max(spaceLeft, spaceRight);

    if (maxVertical > 300) {
      return spaceAbove > spaceBelow ? 'top' : 'bottom';
    }
    if (maxHorizontal > 400) {
      return spaceLeft > spaceRight ? 'left' : 'right';
    }

    return 'bottom';
  };

  const position = getTooltipPosition();

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-4',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-4',
    left: 'right-full top-1/2 -translate-y-1/2 mr-4',
    right: 'left-full top-1/2 -translate-y-1/2 ml-4',
  };

  return (
    <>
      {/* 遮罩 */}
      <TourMask />

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className={`absolute z-50 w-[400px] max-w-[calc(100vw-2rem)] ${positionClasses[position]}`}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* 進度條 */}
          <div className="h-1 bg-gray-200">
            <motion.div
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>

          {/* 標題 */}
          <div className="p-4 pb-0">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {step.title}
              </h3>
              <button
                onClick={endTour}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* 內容 */}
          <div className="p-4">
            <p className="text-gray-600 leading-relaxed">
              {step.content}
            </p>

            {/* 步驟指示器 */}
            <div className="flex items-center justify-center gap-1 mt-4">
              {currentTour.steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToStep(index)}
                  className={`
                    w-2 h-2 rounded-full transition-all
                    ${index === currentStepIndex 
                      ? 'bg-blue-600 w-6' 
                      : index < currentStepIndex 
                        ? 'bg-green-500' 
                        : 'bg-gray-300'
                    }
                  `}
                />
              ))}
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="p-4 pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* 跳過按鈕 */}
                {isFirstStep && !currentTour.isOptional && (
                  <button
                    onClick={() => skipTour(currentTour.id)}
                    className="flex items-center gap-1 px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                  >
                    <SkipForward size={16} />
                    跳過
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* 上一步 */}
                {!isFirstStep && (
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={18} />
                    上一步
                  </button>
                )}

                {/* 下一步 / 完成 */}
                <button
                  onClick={isLastStep ? () => completeTour(currentTour.id) : nextStep}
                  className="flex items-center gap-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  {isLastStep ? (
                    <>
                      <CheckCircle size={18} />
                      完成
                    </>
                  ) : (
                    <>
                      下一步
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 箭頭 */}
        <div className={`
          absolute w-4 h-4 bg-white transform rotate-45
          ${position === 'top' ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' : ''}
          ${position === 'bottom' ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''}
          ${position === 'left' ? 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2' : ''}
          ${position === 'right' ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2' : ''}
        `} />
      </motion.div>
    </>
  );
};

// ==================== Tour 控制器 ====================

export const TourController: React.FC<{ tour: Tour }> = ({ tour }) => {
  const { startTour, isOpen, endTour, completedTours } = useTourStore();
  const isCompleted = completedTours.includes(`completed:${tour.id}`);
  const isSkipped = completedTours.includes(`skipped:${tour.id}`);

  if (isSkipped) return null;

  return (
    <AnimatePresence>
      {!isOpen && !isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed bottom-4 left-4 z-30"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg p-4 max-w-sm">
            <div className="flex items-start gap-3">
              <Play size={24} className="flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold">{tour.name}</h4>
                {tour.description && (
                  <p className="text-sm text-white/80 mt-1">{tour.description}</p>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => startTour(tour)}
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                  >
                    開始引導
                  </button>
                  <button
                    onClick={() => useTourStore.getState().skipTour(tour.id)}
                    className="px-3 py-2 text-white/80 hover:text-white transition-colors text-sm"
                  >
                    不需要
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ==================== 重置 Tour ====================

export const resetAllTours = () => {
  localStorage.removeItem('tour-storage');
  localStorage.removeItem('tour_viewed_steps');
  window.location.reload();
};

export default TourTooltip;
