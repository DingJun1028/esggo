'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { UniversalProgress } from '@/components/ui/universal/UniversalProgress';
import { HeartPulse, CheckCircle2, AlertCircle, ArrowRight, Activity, Trophy, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
  { id: 1, category: 'Environmental', text: '企業是否已完成範疇一與範疇二的碳盤查？' },
  { id: 2, category: 'Environmental', text: '是否設定了明確的減碳目標（如 Net Zero 2050）？' },
  { id: 3, category: 'Environmental', text: '供應鏈是否納入環境影響評估機制？' },
  { id: 4, category: 'Social', text: '企業是否有完善的員工多元、公平與共融 (DEI) 政策？' },
  { id: 5, category: 'Social', text: '是否具備利害關係人溝通機制與重大性議題分析？' },
  { id: 6, category: 'Social', text: '供應鏈勞工人權是否定期進行稽核？' },
  { id: 7, category: 'Governance', text: '董事會成員是否具備 ESG 相關專業背景或定期培訓？' },
  { id: 8, category: 'Governance', text: '是否建立了透明的商業道德與反貪腐檢舉機制？' },
  { id: 9, category: 'Governance', text: 'ESG 績效是否與高階主管薪酬掛鉤？' },
  { id: 10, category: 'Data', text: 'ESG 數據是否具備數位化收集與自動化追蹤流程？' },
  { id: 11, category: 'Data', text: '報告內容是否通過外部第三方確信？' },
  { id: 12, category: 'Data', text: '是否使用 5T 誠信協議確保數據不可篡改？' },
];

export default function HealthCheckPage() {
  const [currentStep, setCurrentStep] = useState(0); // 0: Start, 1: Quiz, 2: Result
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [activeQuestion, setActiveQuestion] = useState(0);

  const handleAnswer = (val: boolean) => {
    setAnswers({ ...answers, [QUESTIONS[activeQuestion].id]: val });
    if (activeQuestion < QUESTIONS.length - 1) {
      setActiveQuestion(activeQuestion + 1);
    } else {
      setCurrentStep(2);
    }
  };

  const calculateScore = () => {
    const yesCount = Object.values(answers).filter(v => v).length;
    return Math.round((yesCount / QUESTIONS.length) * 100);
  };

  const getMaturityLevel = (score: number) => {
    if (score >= 90) return { label: '領導級 Leader', color: 'text-emerald-400', desc: '您的企業在 ESG 治理上已具備標竿地位。' };
    if (score >= 70) return { label: '進階級 Advanced', color: 'text-cyan-400', desc: '已建立完善架構，重點在於持續優化與確信。' };
    if (score >= 40) return { label: '發展級 Developing', color: 'text-amber-400', desc: '初步具備合規能力，需加強數據自動化與供應鏈管理。' };
    return { label: '起步級 Beginner', color: 'text-rose-400', desc: '建議優先完成碳盤查與重大性評估，建立治理地基。' };
  };

  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-4 text-center md:text-left">
          <UniversalBadge variant="success" icon="✨">
            旅程 I. 初始導入與配置
          </UniversalBadge>
          <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center justify-center md:justify-start gap-3">
            <HeartPulse className="text-rose-400" /> 企業健檢 Health Check
          </h1>
          <p className="text-lg text-white/60 max-w-2xl">
            快速診斷您的 ESG 治理成熟度。回答 12 個關鍵問題，獲取專屬的 90 天改善路徑圖。
          </p>
        </header>

        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="py-20"
            >
              <UniversalCard variant="glow" className="text-center p-12 space-y-8">
                <div className="w-24 h-24 bg-cyan-core/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap size={48} className="text-cyan-core animate-pulse" />
                </div>
                <h2 className="text-3xl font-bold">準備好開始您的 ESG 診斷嗎？</h2>
                <p className="text-white/60">預計耗時 2 分鐘。您的回答將作為 AI 生成改善建議的依據。</p>
                <UniversalButton variant="primary" size="lg" onClick={() => setCurrentStep(1)} className="px-12 rounded-2xl">
                  開始健檢 <ArrowRight className="ml-2" />
                </UniversalButton>
              </UniversalCard>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-core">
                  Question {activeQuestion + 1} of {QUESTIONS.length}
                </p>
                <p className="text-sm font-mono text-white/40">
                  {QUESTIONS[activeQuestion].category}
                </p>
              </div>
              <UniversalProgress value={((activeQuestion) / QUESTIONS.length) * 100}  />
              
              <UniversalCard variant="bordered" className="p-8 md:p-16 min-h-[300px] flex flex-col justify-center items-center text-center space-y-12">
                <h3 className="text-2xl md:text-3xl font-bold leading-snug max-w-2xl">
                  {QUESTIONS[activeQuestion].text}
                </h3>
                <div className="flex gap-6 w-full max-w-md">
                  <button
                    onClick={() => handleAnswer(true)}
                    className="flex-1 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={20} /> 是 (YES)
                  </button>
                  <button
                    onClick={() => handleAnswer(false)}
                    className="flex-1 py-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <AlertCircle size={20} /> 否 (NO)
                  </button>
                </div>
              </UniversalCard>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 pb-20"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <UniversalCard title="成熟度評分" variant="glow" className="md:col-span-1 flex flex-col items-center justify-center py-10">
                  <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="64" cy="64" r="58" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                      <circle cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="8" 
                        strokeDasharray={364} 
                        strokeDashoffset={364 - (364 * calculateScore()) / 100}
                        className="text-cyan-core transition-all duration-1000"
                      />
                    </svg>
                    <span className="text-4xl font-black">{calculateScore()}</span>
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest text-white/40">Total Score</p>
                </UniversalCard>

                <UniversalCard title="診斷結果" variant="bordered" className="md:col-span-2 space-y-4">
                  <h3 className={`text-3xl font-black ${getMaturityLevel(calculateScore()).color}`}>
                    {getMaturityLevel(calculateScore()).label}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {getMaturityLevel(calculateScore()).desc}
                  </p>
                  <div className="pt-4 flex gap-4">
                    <div className="flex-1 p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-[10px] font-black uppercase text-white/30 mb-1">優勢領域</p>
                      <p className="text-xs text-emerald-400 font-bold">合規意識強、治理架構初步成形</p>
                    </div>
                    <div className="flex-1 p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-[10px] font-black uppercase text-white/30 mb-1">待改進點</p>
                      <p className="text-xs text-amber-400 font-bold">數據自動化不足、缺乏供應鏈深度稽核</p>
                    </div>
                  </div>
                </UniversalCard>
              </div>

              <h2 className="text-2xl font-bold flex items-center gap-3 pt-8">
                <Trophy size={24} className="text-california-gold" /> 90 天改善路徑圖
              </h2>
              
              <div className="space-y-4">
                {[
                  { days: '0-30', task: '完成範疇一、二碳盤查，匯入 ESGGO 數據中樞', icon: <Activity className="text-cyan-core" /> },
                  { days: '31-60', task: '啟動供應鏈 ESG 預審問卷，建立關鍵供應商清單', icon: <ShieldCheck className="text-emerald-400" /> },
                  { days: '61-90', task: '使用 SustainWrite 生成初版 GRI 報告草稿', icon: <Zap className="text-amber-400" /> },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 bg-white/5 rounded-[1.5rem] border border-white/10 hover:border-cyan-500/30 transition-all group">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex flex-col items-center justify-center shrink-0 border border-white/5 group-hover:bg-cyan-500/10 transition-colors">
                      <span className="text-[10px] font-black text-white/30 uppercase">Day</span>
                      <span className="text-lg font-black text-cyan-core">{item.days}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-bold text-white/80 group-hover:text-white transition-colors">{item.task}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl">
                      {item.icon}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-8">
                <UniversalButton variant="primary" size="lg" className="rounded-2xl px-12" onClick={() => window.location.href = '/'}>
                  進入控制台啟動任務 <ArrowRight className="ml-2" />
                </UniversalButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
