'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Brain, Shield, Sparkles, Send, Target, Rocket, Lock, 
  RefreshCw, Bot, Globe, Database, ShieldCheck, ArrowUpRight,
  Fingerprint, Activity, FileText, Layers, List, Lock as LockIcon,
  Search, Award, HelpCircle, ChevronRight, ChevronLeft, Play, Trophy
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { BrandStatusDot } from '../../components/brand';
import StandardPage from '../../components/brand/StandardPage';
import { fadeIn, staggerContainer } from '../../lib/animations';
import { UniversalPageConfig } from '../../lib/page-config';

const ONBOARDING_STEPS = [
  {
    id: 'perception',
    title: '第一步：感知數據 (Perception)',
    desc: '透過 Alchemy 視覺引擎將原始憑證轉化為 5T 實證。',
    icon: <Sparkles size={24}/>,
    color: '#FDB515',
    action: '前往煉金術',
    link: '/omniagent-alchemy',
    details: [
      '上傳電費單、發票或認證 PDF。',
      'OmniAgent 自動提取 GRI 關鍵指標。',
      '完成第一次 5T 誠信封印。'
    ]
  },
  {
    id: 'alignment',
    title: '第二步：智庫對齊 (Alignment)',
    desc: '對標國際標準與產業標竿，獲取最佳治理建議。',
    icon: <Trophy size={24}/>,
    color: '#3B7EA1',
    action: '瀏覽智庫',
    link: '/best-practice',
    details: [
      '檢索 450+ 產業標竿案例。',
      '載入「5T Ready」專家撰寫模板。',
      '由 AI 進行現狀與標竿的缺口分析。'
    ]
  },
  {
    id: 'execution',
    title: '第三步：任務執行 (Execution)',
    desc: '呼叫 Swarm 蜂群代理人，自動產出高品質報告。',
    icon: <Bot size={24}/>,
    color: '#8B5CF6',
    action: '啟動調度中心',
    link: '/omniagent-orchestrator',
    details: [
      '指派 Z0-Auditor 執行合規性掃描。',
      '利用 SustainWrite 執行 5000 字深度撰寫。',
      '追蹤 AI 思考鏈 (Genkit Trace)。'
    ]
  },
  {
    id: 'evolution',
    title: '第四步：戰略進化 (Evolution)',
    desc: '模擬企業願景，啟動數位分身的自我成長。',
    icon: <Brain size={24}/>,
    color: '#003262',
    action: '進入實驗室',
    link: '/strategy-lab',
    details: [
      '在策略實驗室預演「零碳路徑」。',
      '喚醒主權數位分身並進行 DNA 建模。',
      '同步最新進化提案至動態架構。'
    ]
  },
  {
    id: 'trust',
    title: '第五步：主權確信 (Trust)',
    desc: '完成萬能聖碑刻印，開放外部透明驗算。',
    icon: <Lock size={24}/>,
    color: '#10B981',
    action: '檢視聖碑',
    link: '/vault-omni',
    details: [
      '將所有成果歸檔至 Vault Omni。',
      '生成不可篡改的 Master Seal。',
      '提供 VerifyLink™ 給外部審計師。'
    ]
  }
];

const FEATURE_MANIFEST = [
  { module: '調度中心', sub: 'Orchestrator', desc: '全系統的指揮大腦，管理 AI 代理人的任務分配與執行生命週期。', icon: <Bot size={16}/> },
  { module: '商情中心', sub: 'Intelligence', desc: '即時追蹤全球 ESG 法規、碳政策與競爭對手動態。', icon: <Globe size={16}/> },
  { module: 'OmniAgent 煉金術', sub: 'Alchemy', desc: '多模態 AI 視覺引擎，將紙本憑證「點石成金」變為結構化數據。', icon: <Sparkles size={16}/> },
  { module: '永續撰寫', sub: 'SustainWrite', desc: '對齊 GRI 2021 的深度文案引擎，支援 5T 數據自動填報。', icon: <FileText size={16}/> },
  { module: '戰略實驗室', sub: 'Strategy Lab', desc: '蜂群共識模擬器，用於分析戰略決策的影響力與系統進化。', icon: <Zap size={16}/> },
  { module: '萬能聖碑', sub: 'Vault Omni', desc: '不可篡改的實證帳本，是企業數位主權的最終物理歸宿。', icon: <Database size={16}/> },
];

export default function SovereignOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);

  // ── Universal Page Configuration ──────────────────────────────────
  const pageConfig: UniversalPageConfig = {
    id: 'onboarding-guide',
    title: '主權治理新手教學 Sovereign Onboarding',
    subtitle: 'oX Platform Guide · 從零到一 · 五步達成全域 5T 治理閉環。',
    icon: <Rocket size={32} className="text-berkeley-blue" />,
    griReference: 'Guide / 0-1',
    activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'],
    isOXModule: true,
    features: { useProvenance: true },

    primaryActions: [
      { id: 'start', label: '開始第一步', icon: <Play size={16}/>, onClick: () => window.location.href = ONBOARDING_STEPS[0].link }
    ],

    kpis: [
      { key: 'steps', label: '教學總階', value: ONBOARDING_STEPS.length.toString(), icon: <Layers size={18}/> },
      { key: 'modules', label: '涵蓋模組', value: '11', icon: <Activity size={18}/>, verified: true },
      { key: 'sovereignty', label: '主權達成度', value: '100', unit: '%', icon: <ShieldCheck size={18}/> },
    ],

    sections: [
      {
        id: 'stepper',
        title: 'oX 治理閉環五部曲 (The 5-Step Loop)',
        columns: 8,
        component: (
          <div className="space-y-10 relative">
             {/* Progress Line */}
             <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-slate-100 -z-10" />

             <div className="space-y-8">
                {ONBOARDING_STEPS.map((step, idx) => (
                  <motion.div 
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card 
                      hoverEffect 
                      className={cn(
                        "p-10 border-white/60 shadow-glass transition-all relative overflow-hidden cursor-pointer",
                        currentStep === idx ? "ring-2 ring-berkeley-blue bg-white/90 scale-[1.02]" : "bg-white/60 opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
                      )}
                      onClick={() => setCurrentStep(idx)}
                    >
                       <div className="flex items-start gap-10">
                          <div className={cn(
                            "w-24 h-24 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-lg transition-transform",
                            currentStep === idx ? "bg-berkeley-blue text-california-gold scale-110" : "bg-slate-50 text-slate-400"
                          )}>
                             {React.cloneElement(step.icon as React.ReactElement, { size: 32 })}
                          </div>
                          <div className="flex-1">
                             <div className="flex justify-between items-center mb-3">
                                <h3 className="text-2xl font-black text-berkeley-blue uppercase tracking-tight">{step.title}</h3>
                                {currentStep === idx && (
                                  <div className="flex items-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-verified animate-ping" />
                                     <span className="text-[10px] font-black text-verified uppercase tracking-widest">Focused</span>
                                  </div>
                                )}
                             </div>
                             <p className="text-base text-slate-600 font-bold mb-6">{step.desc}</p>
                             
                             <AnimatePresence>
                               {currentStep === idx && (
                                 <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                 >
                                    <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 shadow-inner mb-8">
                                       <ul className="space-y-4">
                                          {step.details.map((d, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-slate-500 font-medium">
                                               <div className="w-1.5 h-1.5 rounded-full bg-berkeley-blue mt-1.5 shadow-[0_0_8px_#003262]" /> 
                                               <span className="leading-relaxed">{d}</span>
                                            </li>
                                          ))}
                                       </ul>
                                    </div>
                                    <Button variant="primary" className="h-14 rounded-2xl px-10 text-base tracking-widest uppercase shadow-lg" onClick={(e) => { e.stopPropagation(); window.location.href = step.link; }}>
                                       {step.action} <ArrowUpRight size={20} className="ml-3"/>
                                    </Button>
                                 </motion.div>
                               )}
                             </AnimatePresence>
                          </div>
                       </div>
                    </Card>
                  </motion.div>
                ))}
             </div>
          </div>
        )
      },
      {
        id: 'feature-manifest',
        title: 'oX 模組功能手冊',
        columns: 4,
        component: (
          <div className="space-y-10">
             <Card className="bg-berkeley-blue text-white p-10 rounded-[3rem] border-none shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center gap-3 text-california-gold">
                      <Sparkles size={20} fill="currentColor" />
                      <p className="text-[11px] font-black uppercase tracking-[0.3em]">Quick Tip</p>
                   </div>
                   <p className="text-base font-black leading-relaxed italic text-blue-50/90">
                     「您可以隨時在側邊欄切換模組，5T 實證會自動在後台進行跨維度同步，實現真正的數位主權。」
                   </p>
                </div>
                <HelpCircle size={140} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
             </Card>

             <div className="space-y-6">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] px-2 ml-1">功能辭典 (Registry)</p>
                <div className="grid gap-4">
                   {FEATURE_MANIFEST.map((f, i) => (
                     <div key={i} className="p-5 bg-white/60 backdrop-blur-md border border-white/80 rounded-[1.5rem] flex items-start gap-5 hover:border-berkeley-blue/30 transition-all shadow-sm group">
                        <div className="w-10 h-10 rounded-xl bg-berkeley-blue/5 text-berkeley-blue flex items-center justify-center shrink-0 group-hover:bg-berkeley-blue group-hover:text-california-gold transition-all shadow-inner">
                           {React.cloneElement(f.icon as React.ReactElement, { size: 20 })}
                        </div>
                        <div>
                           <p className="text-[13px] font-black text-berkeley-blue uppercase tracking-tight">{f.module}</p>
                           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1.5">{f.sub}</p>
                           <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">{f.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
                <Button variant="glass" className="w-full h-12 text-[11px] font-black text-berkeley-blue hover:text-berkeley-dark h-12 rounded-xl border-slate-200">
                   查看全模組技術規格 <ArrowUpRight size={16} className="ml-2"/>
                </Button>
             </div>
          </div>
        )
      }
    ]
  };

  return <StandardPage config={pageConfig} />;
}
