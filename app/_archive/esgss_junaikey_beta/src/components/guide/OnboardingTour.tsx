// src/components/guide/OnboardingTour.tsx
import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const TOUR_STEPS: TourStep[] = [
  {
    target: 'body',
    title: '歡迎來到 ESGss JunAiKey',
    content: '您的全方位 ESG 智能指揮中心。本系統將協助您整合數據、生成的報告，並達成永續目標。',
    position: 'center',
  },
  {
    target: '[data-tour="dashboard-metrics"]',
    title: '戰情儀表板',
    content: '這裡即時顯示您的 ESG 核心指標，包含碳排放、SROI 與法規遵循度。',
    position: 'bottom',
  },
  {
    target: '[data-tour="compliance-matrix"]',
    title: '法規核規矩陣',
    content: '全自動追蹤氣候變遷因應法、勞基法等關鍵法規的合規狀態。',
    position: 'left',
  },
  {
    target: '[data-tour="nav-reports"]',
    title: '報告指揮中心',
    content: '點擊這裡進入報告生成器，利用引導精靈 (Wizard) 準備資料並一鍵產出報告。',
    position: 'right',
  },
  {
    target: '[data-tour="nav-library"]',
    title: 'Omni-Library',
    content: '這裡收藏了所有企業年報、法規庫與真實案例研讀。',
    position: 'right',
  },
];

export const OnboardingTour: React.FC = () => {
  const { style } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});

  // Liquid Glass or Optics style class for the dialog
  const dialogClass =
    style === 'glass'
      ? 'liquid-glass border-white/20'
      : 'minimalist-optics bg-slate-900 border-white/10';

  const accentColor = style === 'glass' ? 'text-cyan-400' : 'text-blue-500';
  const buttonClass =
    style === 'glass'
      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-cyan-500/20'
      : 'bg-blue-600 hover:bg-blue-500';

  useEffect(() => {
    // Reset tour state for dev purposes or check local storage
    const visited = localStorage.getItem('has_seen_tour_v10.0_liquid');
    if (!visited) {
      setTimeout(() => setIsOpen(true), 1500);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const step = TOUR_STEPS[currentStep];
    if (!step) return;

    if (step.position === 'center') {
      setHighlightStyle({});
      return;
    }

    const targetEl = document.querySelector(step.target);
    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      setHighlightStyle({
        top: rect.top - 10,
        left: rect.left - 10,
        width: rect.width + 20,
        height: rect.height + 20,
      });
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep, isOpen]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('has_seen_tour_v10.0_liquid', 'true');
  };

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  if (!step) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-all duration-700 pointer-events-auto ${style === 'glass' ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/80'}`}
      />

      {/* Highlighter (Spotlight) */}
      {step.position !== 'center' && (
        <div
          className={`absolute rounded-xl transition-all duration-500 ease-in-out box-content border-2 ${style === 'glass' ? 'border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.3)]' : 'border-blue-500 shadow-none'}`}
          style={highlightStyle}
        />
      )}

      {/* Dialog */}
      <div
        className={`absolute transition-all duration-500 flex flex-col items-center justify-center w-full h-full`}
      >
        <div
          className={`pointer-events-auto p-6 shadow-2xl max-w-md w-full mx-4 flex flex-col gap-4 animate-in zoom-in-95 duration-500 ${dialogClass} ${step.position !== 'center' ? 'absolute' : ''}`}
          style={
            step.position === 'top'
              ? { top: (highlightStyle.top as number) - 220, left: 0, right: 0, margin: 'auto' }
              : step.position === 'bottom'
                ? {
                    top: (highlightStyle.top as number) + (highlightStyle.height as number) + 20,
                    left: 0,
                    right: 0,
                    margin: 'auto',
                  }
                : step.position === 'left'
                  ? {
                      top: highlightStyle.top as number,
                      right: window.innerWidth - (highlightStyle.left as number) + 20,
                    }
                  : step.position === 'right'
                    ? {
                        top: highlightStyle.top as number,
                        left:
                          (highlightStyle.left as number) + (highlightStyle.width as number) + 20,
                      }
                    : {}
          }
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold ${style === 'glass' ? 'bg-cyan-600' : 'bg-blue-600'}`}
              >
                {currentStep + 1}
              </span>
              <span
                className={`text-xs uppercase tracking-widest font-semibold ${style === 'glass' ? 'text-cyan-200' : 'text-gray-400'}`}
              >
                GUIDED TOUR
              </span>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h3
              className={`text-xl font-bold mb-2 ${style === 'glass' ? 'text-white' : 'text-gray-100'}`}
            >
              {step.title}
            </h3>
            <p
              className={`leading-relaxed text-sm ${style === 'glass' ? 'text-gray-200' : 'text-gray-400'}`}
            >
              {step.content}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-2">
            <div className="flex gap-1">
              {TOUR_STEPS.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${idx === currentStep ? `${style === 'glass' ? 'bg-cyan-400 w-4' : 'bg-blue-500 w-4'}` : 'bg-gray-700'}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className={`flex items-center gap-2 text-white px-5 py-2 rounded-full text-sm font-bold transition-all hover:scale-105 ${buttonClass}`}
            >
              {currentStep === TOUR_STEPS.length - 1 ? (
                <>
                  開始使用 <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  下一步 <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
