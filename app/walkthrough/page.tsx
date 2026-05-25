'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Brain, Shield, Sparkles, Send, Target, Rocket, Lock, 
  RefreshCw, Bot, Globe, Database, ShieldCheck, ArrowUpRight,
  Fingerprint, Activity, FileText, Layers, List, Lock as LockIcon,
  Search, Award, HelpCircle, ChevronRight, ChevronLeft, Play, Trophy
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandStatusDot, 
  BrandPageHeader, BrandCardHeader, StandardPage, BrandTabs
} from '../../components/brand';
import { cn } from '../../lib/utils';
import { UniversalPageConfig } from '../../lib/page-config';

const ONBOARDING_STEPS = [
  {
    id: 'perception',
    title: '第一步：感知數據 (Perception)',
    desc: '透過 Alchemy 視覺引擎將原始憑證轉化為 5T 實證。',
    icon: <Sparkles size={24}/>,
    color: '#FDB515',
    action: '前往煉金術',
    link: '/hermes-alchemy',
    details: [
      '上傳電費單、發票或認證 PDF。',
      'Hermes 自動提取 GRI 關鍵指標。',
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
    link: '/hermes-orchestrator',
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
  { module: 'Hermes 煉金術', sub: 'Alchemy', desc: '多模態 AI 視覺引擎，將紙本憑證「點石成金」變為結構化數據。', icon: <Sparkles size={16}/> },
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
    icon: <Rocket size={32} className="text-[#003262]" />,
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
             <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-slate-100 -z-10" />

             <div className="space-y-6">
                {ONBOARDING_STEPS.map((step, idx) => (
                  <motion.div 
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <BrandCard 
                      hover 
                      padding="lg" 
                      className={cn(
                        "border-none shadow-sm transition-all relative overflow-hidden",
                        currentStep === idx ? "ring-2 ring-blue-500 shadow-premium" : "opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
                      )}
                      onClick={() => setCurrentStep(idx)}
                    >
                       <div className="flex items-start gap-8">
                          <div className={cn(
                            "w-20 h-20 rounded-[2rem] flex items-center justify-center shrink-0 shadow-lg",
                            currentStep === idx ? "bg-[#003262] text-[#FDB515]" : "bg-slate-100 text-slate-400"
                          )}>
                             {step.icon}
                          </div>
                          <div className="flex-1">
                             <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-black text-[#003262] uppercase tracking-tight">{step.title}</h3>
                                {currentStep === idx && <BrandStatusDot status="active" pulse size="sm" />}
                             </div>
                             <p className="text-sm text-slate-600 font-bold mb-4">{step.desc}</p>
                             
                             <AnimatePresence>
                               {currentStep === idx && (
                                 <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                 >
                                    <ul className="space-y-2 mb-6">
                                       {step.details.map((d, i) => (
                                         <li key={i} className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                            <div className="w-1 h-1 rounded-full bg-blue-400" /> {d}
                                         </li>
                                       ))}
                                    </ul>
                                    <BrandButton variant="primary" size="sm" className="rounded-xl px-6" onClick={(e) => { e.stopPropagation(); window.location.href = step.link; }}>
                                       {step.action} <ArrowUpRight size={14} className="ml-2"/>
                                    </BrandButton>
                                 </motion.div>
                               )}
                             </AnimatePresence>
                          </div>
                       </div>
                    </BrandCard>
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
          <div className="space-y-6">
             <BrandCard className="bg-[#003262] text-white p-8 rounded-[2.5rem] border-none shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                   <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.3em]">Quick Tip</p>
                   <p className="text-sm font-black leading-relaxed italic">
                     「您可以隨時在側邊欄切換模組，5T 實證會自動在後台進行跨維度同步。」
                   </p>
                </div>
                <HelpCircle size={100} className="absolute -bottom-8 -right-8 text-white/5 rotate-12" />
             </BrandCard>

             <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">功能辭典</p>
                <div className="grid gap-3">
                   {FEATURE_MANIFEST.map((f, i) => (
                     <div key={i} className="p-4 bg-white border border-slate-50 rounded-2xl flex items-start gap-4 hover:border-blue-200 transition-all shadow-sm group">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                           {f.icon}
                        </div>
                        <div>
                           <p className="text-[11px] font-black text-[#003262]">{f.module}</p>
                           <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter mb-1">{f.sub}</p>
                           <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{f.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
                <BrandButton variant="ghost" fullWidth className="text-[10px] font-black text-blue-600 hover:bg-blue-50 h-10 rounded-xl">
                   查看全模組技術規格 <ArrowUpRight size={12} className="ml-1"/>
                </BrandButton>
             </div>
          </div>
        )
      }
    ]
  };

  return <StandardPage config={pageConfig} />;
}
