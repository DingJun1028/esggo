/**
 * 引導教學系統
 * Guided Tour System
 * 
 * 提供互動式的用戶引導，幫助新用戶快速了解系統功能。
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Home, CheckCircle } from 'lucide-react';

// ============================================================================
// 類型定義
// ============================================================================

export interface TourStep {
  target: string;
  title: string;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  actionLabel?: string;
  skipLabel?: string;
}

export interface TourConfig {
  steps: TourStep[];
  onComplete?: () => void;
  onSkip?: () => void;
  initialStep?: number;
}

interface TourState {
  isOpen: boolean;
  currentStep: number;
  hasCompleted: boolean;
}

// ============================================================================
// 引導教學 Hook
// ============================================================================

export const useTour = (config: TourConfig) => {
  const [state, setState] = useState<TourState>({
    isOpen: false,
    currentStep: config.initialStep || 0,
    hasCompleted: false,
  });

  // 檢查本地存儲的完成狀態
  useEffect(() => {
    const tourId = config.steps[0]?.target || 'default';
    const completed = localStorage.getItem(`tour-completed-${tourId}`);
    if (completed) {
      setState(prev => ({ ...prev, hasCompleted: true }));
    }
  }, [config.steps]);

  const startTour = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: true, currentStep: 0 }));
  }, []);

  const endTour = useCallback((completed = false) => {
    setState(prev => ({ 
      ...prev, 
      isOpen: false, 
      hasCompleted: completed 
    }));
    
    if (completed) {
      const tourId = config.steps[0]?.target || 'default';
      localStorage.setItem(`tour-completed-${tourId}`, 'true');
      config.onComplete?.();
    } else {
      config.onSkip?.();
    }
  }, [config, config.steps]);

  const nextStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, config.steps.length - 1),
    }));
  }, [config.steps.length]);

  const prevStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(0, Math.min(step, config.steps.length - 1)),
    }));
  }, [config.steps.length]);

  const resetTour = useCallback(() => {
    const tourId = config.steps[0]?.target || 'default';
    localStorage.removeItem(`tour-completed-${tourId}`);
    setState({ isOpen: false, currentStep: 0, hasCompleted: false });
  }, [config.steps]);

  return {
    ...state,
    startTour,
    endTour,
    nextStep,
    prevStep,
    goToStep,
    resetTour,
    totalSteps: config.steps.length,
  };
};

// ============================================================================
// 引導覆蓋層
// ============================================================================

const TourOverlay: React.FC<{
  step: TourStep;
  position: string;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  currentStep: number;
  totalSteps: number;
}> = ({ step, position, onNext, onPrev, onSkip, currentStep, totalSteps }) => {
  const targetRef = useRef<HTMLElement | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // 定位目標元素
  useEffect(() => {
    const updatePosition = () => {
      const element = document.querySelector(step.target);
      if (element) {
        targetRef.current = element;
        setTargetRect(element.getBoundingClientRect());
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [step.target, currentStep]);

  // 計算浮層位置
  const getPopupStyle = () => {
    if (!targetRect) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const popupWidth = 320;
    const popupHeight = 200;
    const gap = 16;

    const positions: Record<string, React.CSSProperties> = {
      top: {
        top: targetRect.top - gap - popupHeight,
        left: targetRect.left + (targetRect.width - popupWidth) / 2,
      },
      bottom: {
        top: targetRect.bottom + gap,
        left: targetRect.left + (targetRect.width - popupWidth) / 2,
      },
      left: {
        top: targetRect.top + (targetRect.height - popupHeight) / 2,
        left: targetRect.left - gap - popupWidth,
      },
      right: {
        top: targetRect.top + (targetRect.height - popupHeight) / 2,
        left: targetRect.right + gap,
      },
      center: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
    };

    return positions[step.position || 'bottom'] || positions.bottom;
  };

  return (
    <>
      {/* 目標區域高亮 */}
      {targetRect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed pointer-events-none z-40 border-2 border-[#63a6b0] rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
          }}
        />
      )}

      {/* 提示浮層 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed z-50 w-80 bg-[#0a0f0f]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        style={getPopupStyle()}
      >
        {/* 進度指示器 */}
        <div className="h-1 bg-white/10">
          <motion.div
            className="h-full bg-[#63a6b0]"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* 內容 */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#63a6b0]/20 rounded-full flex items-center justify-center">
                <span className="text-[#63a6b0] text-sm font-bold">{currentStep + 1}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{step.title}</h3>
            </div>
            <button
              onClick={onSkip}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <div className="text-slate-400 text-sm mb-6">
            {step.content}
          </div>

          {/* 操作按鈕 */}
          <div className="flex items-center justify-between">
            <button
              onClick={onSkip}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              {step.skipLabel || '跳過'}
            </button>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={onPrev}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-400" />
                </button>
              )}
              
              <button
                onClick={currentStep === totalSteps - 1 ? onSkip : onNext}
                className="flex items-center gap-2 px-4 py-2 bg-[#63a6b0]/20 border border-[#63a6b0]/50 rounded-lg text-[#63a6b0] hover:bg-[#63a6b0]/30 transition-colors"
              >
                {currentStep === totalSteps - 1 ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    完成
                  </>
                ) : (
                  <>
                    {step.actionLabel || '下一步'}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

// ============================================================================
// 預設引導配置
// ============================================================================

export const DEFAULT_DASHBOARD_TOUR: TourConfig = {
  steps: [
    {
      target: '#dashboard-header',
      title: '歡迎使用儀表板',
      content: '這是您的個人數據儀表板，顯示所有關鍵指標和服務入口。',
      position: 'bottom',
    },
    {
      target: '#mece-services',
      title: 'MECE 服務矩陣',
      content: '24 項 MECE 服務覆蓋環境、社會、治理三大領域。點擊即可使用。',
      position: 'top',
    },
    {
      target: '#resonance-score',
      title: '共鳴率評分',
      content: '您的系統共鳴率反映與北極星目標的一致性程度。',
      position: 'right',
    },
    {
      target: '#impact-dna',
      title: '影響力 DNA',
      content: '基於 5T 協議的角色屬性，影響您的服務體驗和推薦。',
      position: 'left',
    },
  ],
};

// ============================================================================
// 預設導出
// ============================================================================

export const TourGuide: React.FC<TourConfig> = (config) => {
  const tour = useTour(config);

  if (!tour.isOpen) return null;

  return (
    <AnimatePresence>
      <TourOverlay
        step={config.steps[tour.currentStep]}
        position="bottom"
        onNext={tour.nextStep}
        onPrev={tour.prevStep}
        onSkip={() => tour.endTour(false)}
        currentStep={tour.currentStep}
        totalSteps={tour.totalSteps}
      />
    </AnimatePresence>
  );
};

export default {
  useTour,
  TourGuide,
  DEFAULT_DASHBOARD_TOUR,
};
