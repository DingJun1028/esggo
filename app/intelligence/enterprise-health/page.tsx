'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';

const QUESTIONS = [
  { id: 1, category: 'E (環境)', text: '貴公司是否已完成最近一年度的溫室氣體盤查 (ISO 14064-1)？' },
  { id: 2, category: 'E (環境)', text: '是否有制定明確的減碳或淨零排放目標 (如 RE100, SBTi)？' },
  { id: 3, category: 'E (環境)', text: '能源使用數據是否能做到每月/每季系統化追蹤？' },
  { id: 4, category: 'E (環境)', text: '是否已導入廢棄物管理或循環經濟相關措施？' },
  { id: 5, category: 'S (社會)', text: '貴公司是否有完整的人權盡職調查機制？' },
  { id: 6, category: 'S (社會)', text: '供應商管理機制中，是否包含 ESG 稽核或評鑑？' },
  { id: 7, category: 'S (社會)', text: '員工福利與健康安全制度是否優於法規要求？' },
  { id: 8, category: 'S (社會)', text: '是否有定期的員工滿意度或敬業度調查？' },
  { id: 9, category: 'G (治理)', text: '董事會中是否設有永續/ESG 專屬委員會？' },
  { id: 10, category: 'G (治理)', text: '是否有明確的風險鑑別與管理矩陣 (如氣候變遷 TCFD)？' },
  { id: 11, category: 'G (治理)', text: '資訊安全與隱私保護政策是否已落實並取得認證？' },
  { id: 12, category: 'G (治理)', text: '商業操守與反貪腐政策是否已向全體員工宣導並簽署？' },
  { id: 13, category: 'Data (數據)', text: '目前收集 ESG 數據的方式已達到系統化與自動化？' },
  { id: 14, category: 'Data (數據)', text: '是否能確保 ESG 數據的不可篡改與可追溯性 (5T 合規)？' },
  { id: 15, category: 'Data (數據)', text: '每年發布的永續報告書是否有經過第三方查證？' },
];

const OPTIONS = [
  { value: 3, label: '完全符合 / 已完善落實' },
  { value: 2, label: '部分符合 / 正在規劃中' },
  { value: 1, label: '尚未開始 / 不清楚' },
];

export default function EnterpriseHealthWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const question = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  const handleSelectOption = (value: number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const handleNext = async () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((p) => p + 1);
    } else {
      // Submit and redirect
      setIsSubmitting(true);
      // store answers in local storage to pass to result page for now
      if (typeof window !== 'undefined') {
        localStorage.setItem('esg_health_answers', JSON.stringify(answers));
      }
      setTimeout(() => {
        router.push('/intelligence/enterprise-health/result');
      }, 800);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((p) => p - 1);
    } else {
      router.push('/intelligence');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
              <Stethoscope size={24} className="text-cyan-600" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#003262]">企業 ESG 健檢嚮導</h1>
              <p className="text-xs text-slate-400 font-mono">15-STEP DIAGNOSTIC WIZARD</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-[#003262]">{currentStep + 1}<span className="text-sm text-slate-400">/{QUESTIONS.length}</span></p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card */}
        <OmniBaseCard className="p-8 md:p-12 border-0 shadow-lg relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldCheck size={120} />
          </div>

          <div className="relative z-10 space-y-8">
            <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-bold rounded-full border border-cyan-100">
              {question.category}
            </span>
            
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-snug">
              {question.text}
            </h2>

            <div className="space-y-3 pt-4">
              {OPTIONS.map((opt) => {
                const isSelected = answers[question.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectOption(opt.value)}
                    className={cn(
                      'w-full text-left px-6 py-4 rounded-xl border-2 transition-all flex items-center justify-between group',
                      isSelected 
                        ? 'border-cyan-500 bg-cyan-50/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                        : 'border-slate-100 hover:border-cyan-200 hover:bg-slate-50'
                    )}
                  >
                    <span className={cn(
                      'font-bold text-base',
                      isSelected ? 'text-cyan-800' : 'text-slate-600'
                    )}>
                      {opt.label}
                    </span>
                    <div className={cn(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                      isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-slate-200 group-hover:border-cyan-300'
                    )}>
                      {isSelected && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </OmniBaseCard>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <OmniButton variant="ghost" onClick={handlePrev} className="text-slate-500 hover:text-slate-800 font-bold">
            <ArrowLeft size={16} className="mr-2" /> {currentStep === 0 ? '返回商情中心' : '上一題'}
          </OmniButton>
          
          <OmniButton 
            variant="primary" 
            size="lg" 
            onClick={handleNext} 
            isLoading={isSubmitting}
            disabled={!answers[question.id] || isSubmitting}
            className="bg-[#003262] hover:bg-[#002244] min-w-[140px] tracking-widest"
          >
            {currentStep === QUESTIONS.length - 1 ? '完成診斷' : '下一題'} {!isSubmitting && <ArrowRight size={16} className="ml-2" />}
          </OmniButton>
        </div>

      </div>
    </div>
  );
}
