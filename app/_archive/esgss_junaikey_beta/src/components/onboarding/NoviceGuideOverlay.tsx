import React, { useState } from 'react';
import { Language, ServiceModule } from '@/types/core';
import { ChevronRight, ChevronLeft, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui';

interface GuideStep {
  module: ServiceModule;
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
  targetId: string; // DOM ID to highlight
}

const GUIDE_STEPS: GuideStep[] = [
  {
    module: ServiceModule.COGNITIVE,
    titleZh: '感知智能 (Cognitive Intelligence)',
    titleEn: 'Cognitive Intelligence',
    descZh: '系統的「大腦」，包含真理儀表板與 AI 戰略中心，為您提供實時洞察。',
    descEn:
      "The system's 'Brain', featuring Truth Dashboards and AI Strategic Centers for real-time insights.",
    targetId: 'nav-module-COGNITIVE',
  },
  {
    module: ServiceModule.EXCELLENCE,
    titleZh: '卓越永續 (ESG Excellence)',
    titleEn: 'ESG Excellence',
    descZh: '管理碳資產與永續數據，是實現淨零轉型的核心門戶。',
    descEn:
      'Manage carbon assets and sustainability data, the core portal for net-zero transformation.',
    targetId: 'nav-module-EXCELLENCE',
  },
  {
    module: ServiceModule.GOVERNANCE,
    titleZh: '誠信治理 (Immutable Governance)',
    titleEn: 'Immutable Governance',
    descZh: '基於 4T 協議的證據佐證庫，確保數據不可篡改且可信。',
    descEn: 'Evidence vault based on 4T Protocol, ensuring data is tamper-proof and trustworthy.',
    targetId: 'nav-module-GOVERNANCE',
  },
  {
    module: ServiceModule.AGENCY,
    titleZh: '自主代行 (Autonomous Agency)',
    titleEn: 'Autonomous Agency',
    descZh: '在此打造您的 AI Agent 團隊，自動化執行繁重的永續任務。',
    descEn: 'Forge your team of AI Agents here to automate heavy sustainability tasks.',
    targetId: 'nav-module-AGENCY',
  },
  {
    module: ServiceModule.ECOSYSTEM,
    titleZh: '合力共生 (Collaborative Ecosystem)',
    titleEn: 'Collaborative Ecosystem',
    descZh: '與供應商、夥伴共同協作，擴大永續影響力。',
    descEn: 'Collaborate with suppliers and partners to amplify sustainability impact.',
    targetId: 'nav-module-ECOSYSTEM',
  },
];

interface NoviceGuideOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
  language: Language;
}

export const NoviceGuideOverlay: React.FC<NoviceGuideOverlayProps> = ({
  isOpen,
  onComplete,
  language,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  if (!isOpen) return null;

  const isZh = language === 'zh-TW';
  const step = GUIDE_STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < GUIDE_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center p-8 pointer-events-none">
      {/* Dimmed Background - In a real app, we'd use a portal and highlight the target element */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] pointer-events-auto"
        onClick={e => e.stopPropagation()}
      />

      <div className="relative w-full max-w-xl bg-slate-900/90 border border-blue-500/30 backdrop-blur-xl rounded-3xl p-6 shadow-2xl pointer-events-auto animate-in slide-in-from-bottom-10 duration-500">
        <div className="flex gap-6">
          {/* Step Icon */}
          <div className="w-16 h-16 shrink-0 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
            <Info className="w-8 h-8 text-blue-400" />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest">
                  {isZh
                    ? `導覽步驟 ${currentStep + 1} / ${GUIDE_STEPS.length}`
                    : `Guide Step ${currentStep + 1} / ${GUIDE_STEPS.length}`}
                </span>
                <h3 className="text-xl font-bold text-white">
                  {isZh ? step?.titleZh : step?.titleEn}
                </h3>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed">
              {isZh ? step?.descZh : step?.descEn}
            </p>

            <div className="flex justify-between items-center pt-4">
              <div className="flex gap-1">
                {GUIDE_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-blue-500' : 'w-2 bg-slate-800'}`}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrev}
                    className="text-slate-400 hover:text-white"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    {isZh ? '上一步' : 'Prev'}
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6"
                >
                  {currentStep === GUIDE_STEPS.length - 1
                    ? isZh
                      ? '完成'
                      : 'Finish'
                    : isZh
                      ? '下一步'
                      : 'Next'}
                  {currentStep < GUIDE_STEPS.length - 1 && (
                    <ChevronRight className="w-4 h-4 ml-1" />
                  )}
                  {currentStep === GUIDE_STEPS.length - 1 && <Check className="w-4 h-4 ml-1" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Pointer Arrow (Visual only for now) */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-8 bg-blue-500/30 clip-path-arrow-left" />
      </div>
    </div>
  );
};
