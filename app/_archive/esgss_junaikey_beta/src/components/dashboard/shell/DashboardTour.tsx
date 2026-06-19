import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

const TEXT = {
  SKIPPED: { zh: '跳過導覽', en: 'Skip Tour' },
  NEXT: { zh: '下一步', en: 'Next' },
  FINISH: { zh: '開始探索', en: 'Start Exploring' },
  STEPS: [
    {
      title: { zh: '歡迎來到 JunAiKey 影響力外殼', en: 'Welcome to JunAiKey Impact Shell' },
      desc: {
        zh: '這是您的 Omni 生態系統中央操作介面。整合監控、營運、智慧與合規四大支柱。',
        en: 'This is your central operating interface for the Omni ecosystem. Integrating Monitor, Operations, Intelligence, and Compliance.',
      },
      highlightId: 'shell-root',
    },
    {
      title: { zh: '全域監控儀表板', en: 'Global Monitor Dashboard' },
      desc: {
        zh: '四大象限：人才 (Arjuna)、合規 (Governance)、審計 (Audit) 與經濟 (ITK)，提供即時系統健康數據。',
        en: 'Four Quadrants: Talent, Governance, Audit, and Economy, providing real-time system health data.',
      },
      highlightId: 'nav-overview',
    },
    {
      title: { zh: 'IPMS 營運中心', en: 'IPMS Operations Center' },
      desc: {
        zh: '在此執行影響力專案，將資源轉化為熵減，提升 G-Score。',
        en: 'Execute impact projects here, converting resources into entropy reduction to boost G-Score.',
      },
      highlightId: 'nav-ipms',
    },
    {
      title: { zh: 'Omni 智慧軍團', en: 'Omni Intelligence Legion' },
      desc: {
        zh: '指揮您的 AI 代理人團隊，執行深度分析與自動化任務。',
        en: 'Command your AI agent teams for deep analysis and automated tasks.',
      },
      highlightId: 'nav-legion',
    },
    {
      title: { zh: 'ESG 合規報告', en: 'ESG Compliance Reporting' },
      desc: {
        zh: '生成不可篡改的區塊鏈驗證報告，確保「三可一不可」真實性。',
        en: 'Generate immutable blockchain-verified reports, ensuring strict authenticity.',
      },
      highlightId: 'nav-report',
    },
  ],
};

export const DashboardTour = ({ onComplete }: { onComplete: () => void }) => {
  const { language } = useLanguage();
  const isZh = language === 'zh-TW';
  const [step, setStep] = useState(0);

  const currentStep = TEXT.STEPS[step] || TEXT.STEPS[0];
  const isLast = step === TEXT.STEPS.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        {/* Spotlight Effect (simplified for now, ideally would use dynamic rects) */}

        <motion.div
          key={step}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-slate-900 border border-emerald-500/50 rounded-2xl p-6 max-w-md shadow-[0_0_50px_rgba(16,185,129,0.2)] relative"
        >
          <button
            onClick={onComplete}
            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="mb-4 text-emerald-400 font-black text-4xl opacity-20 absolute -top-4 -left-4 pointer-events-none">
            0{step + 1}
          </div>

          <h3 className="text-xl font-bold text-white mb-2 relative z-10">
            {isZh ? currentStep?.title.zh : currentStep?.title.en}
          </h3>
          <p className="text-slate-300 mb-6 text-sm relative z-10">
            {isZh ? currentStep?.desc.zh : currentStep?.desc.en}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {TEXT.STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-emerald-500' : 'bg-slate-700'}`}
                />
              ))}
            </div>

            <button
              onClick={() => (isLast ? onComplete() : setStep(s => s + 1))}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/20"
            >
              {isLast
                ? isZh
                  ? TEXT.FINISH.zh
                  : TEXT.FINISH.en
                : isZh
                  ? TEXT.NEXT.zh
                  : TEXT.NEXT.en}
              {isLast ? <Check size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
