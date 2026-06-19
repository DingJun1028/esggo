'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Book, Dna, MessageSquare, Lock, Zap, Plus, Send, 
  ChevronDown, ChevronUp, Upload, FileText, CheckCircle, 
  RefreshCw, Shield, AlertCircle, Info, Sparkles, Target,
  Fingerprint, Activity, Database, ShieldCheck, ArrowUpRight,
  TrendingUp, Layers, List, Lock as LockIcon, Rocket, Bot
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTabs, BrandStatusDot, 
  BrandProgress, BrandScoreRing, BrandPageHeader, BrandCardHeader,
  StandardPage, BrandTable
} from '../../components/brand';
import { addToKnowledgeBase, KNOWLEDGE_BASE } from '../../lib/agent/rag-engine';
import SelectionHouse, { SelectionCategory } from '../../components/ui/SelectionHouse';
import ProvenanceDrawer, { ProvenanceStep } from '../../components/ui/ProvenanceDrawer';
import { ScenarioVisualizer } from '../../components/ui/ScenarioVisualizer';
import { digitalTwinEngine, ProjectionResult } from '../../lib/digital-twin-engine';
import { cn } from '../../lib/utils';
import { UniversalPageConfig } from '../../lib/page-config';
import Link from 'next/link';

const defaultDna = {
  integrity: 92,
  transparency: 88,
  empathy: 74,
  decisiveness: 65
};

const dnaLabels = {
  integrity: { label: '誠信度 (Integrity)', desc: '確保資料真實無篡改' },
  transparency: { label: '透明度 (Transparency)', desc: '決策過程可解釋性' },
  empathy: { label: '共情力 (Empathy)', desc: '利害關係人利益平衡' },
  decisiveness: { label: '果斷力 (Decisiveness)', desc: '面對衝突的決斷速度' }
};

export default function SovereignDigitalTwinPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'knowledge' | 'simulation' | 'dna' | 'chat' | 'ledger'>('overview');
  const [dna, setDna] = useState(defaultDna);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '您好！我是您的主權數位分身。我已載入 5T 聖碑紀錄與您的 2026 進化戰略。請問需要進行哪方面的決策模擬？' },
  ]);
  const [input, setInput] = useState('');
  const [awakeningStage, setAwakeningStage] = useState(3);
  const [uploading, setUploading] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [selectedKb, setSelectedKb] = useState<any>(null);
  const [isKbSelectionOpen, setIsKbSelectionOpen] = useState(false);
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [knowledge, setKnowledge] = useState(KNOWLEDGE_BASE);
  const [simulationResult, setSimulationResult] = useState<ProjectionResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [modifiers, setModifiers] = useState({ carbonEmissions: -0.15, energyUsage: -0.10 });

  const overallDna = Math.round(Object.values(dna).reduce((a, b) => a + b, 0) / 4);

  const handleFileUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setExtractionProgress(0);
    const steps = [20, 45, 75, 100];
    for (const s of steps) {
      await new Promise(r => setTimeout(r, 300));
      setExtractionProgress(s);
    }
    const newFragment = {
      id: `f_${Date.now()}`,
      source: file.name,
      text: `已從 ${file.name} 中提取 ESG 相關內容。已同步至 oX 知識智庫。`,
      metadata: { type: 'user-upload', size: file.size },
      date: '今天',
      category: 'Sovereign Upload'
    };
    await addToKnowledgeBase([newFragment]);
    setKnowledge([...KNOWLEDGE_BASE]);
    setUploading(false);
    setExtractionProgress(0);
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    await new Promise(r => setTimeout(r, 2000));
    const result = await digitalTwinEngine.simulate({
      id: 'pivot-2026',
      name: 'oX 綠能進化',
      modifiers: [
        { targetField: 'carbonEmissions', valueChange: modifiers.carbonEmissions },
        { targetField: 'energyUsage', valueChange: modifiers.energyUsage },
      ]
    }, { carbonEmissions: 1250, energyUsage: 50000, waterUsage: 800, wasteGenerated: 120 });
    setSimulationResult(result);
    setIsSimulating(false);
    setMessages(prev => [...prev, { role: 'assistant', content: `模擬完成。預計引入 5T 治理後，合規風險將降低 ${Math.abs(modifiers.carbonEmissions * 150)}%，系統誠信度提升至 99.8%。` }]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    await new Promise(r => setTimeout(r, 1000));
    setMessages(prev => [...prev, { role: 'assistant', content: '根據萬能聖碑的最新刻印數據，您的範疇二排放已低於產業標竿 12%。建議在下一次戰略實驗室提案中考慮「零碳供應鏈」目標。' }]);
  };

  // ── Universal Page Configuration ──────────────────────────────────
  const pageConfig: UniversalPageConfig = {
    id: 'sovereign-digital-twin',
    title: '主權數位分身 Sovereign Twin',
    subtitle: 'oX Cognitive Entity · 知識共鳴 · 道德建模 · 5T 主權映射。',
    icon: <Fingerprint size={32} className="text-[#003262]" />,
    griReference: 'Governance / Identity',
    activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'],
    isOXModule: true,
    features: { useProvenance: true },

    primaryActions: [
      { id: 'resonance', label: '啟動全域共鳴', icon: <Zap size={16}/>, onClick: () => alert('正在同步全模組數據，喚醒分身意識...') },
      { id: 'alchemy', label: 'OmniAgent Alchemy', icon: <Sparkles size={16}/>, variant: 'secondary', onClick: () => window.location.href = '/omniagent-alchemy' }
    ],

    kpis: [
      { key: 'dna-match', label: 'DNA 吻合度', value: overallDna.toString(), unit: '%', icon: <Dna size={18}/> },
      { key: 'knowledge', label: '主權知識碎片', value: (knowledge.length * 15).toString(), icon: <Book size={18}/> },
      { key: 'integrity', label: '意識誠信度', value: '99.8', unit: '%', icon: <ShieldCheck size={18} className="text-emerald-500"/>, verified: true },
    ],

    sections: [
      {
        id: 'main-nav',
        title: '分身維度導航',
        columns: 12,
        component: (
          <BrandTabs 
            activeTab={activeTab}
            onTabChange={(t) => setActiveTab(t as any)}
            tabs={[
              { id: 'overview', label: '狀態總覽', icon: <Brain size={14} /> },
              { id: 'knowledge', label: '知識倉庫', icon: <Book size={14} /> },
              { id: 'simulation', label: '模擬實驗室', icon: <Zap size={14} /> },
              { id: 'dna', label: '道德 DNA', icon: <Dna size={14} /> },
              { id: 'chat', label: '智慧對話', icon: <MessageSquare size={14} /> },
              { id: 'ledger', label: '主權帳本', icon: <Lock size={14} /> },
            ]}
          />
        )
      },
      {
        id: 'overview-visual',
        title: '分身覺醒狀態',
        columns: 4,
        hidden: activeTab !== 'overview',
        component: (
          <div className="flex flex-col items-center justify-center space-y-8 py-10">
             <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full group-hover:bg-blue-500/30 transition-all duration-1000" />
                <BrandScoreRing 
                  score={overallDna} 
                  size={240} 
                  strokeWidth={14} 
                  color="var(--blue-700)" 
                />
                <Brain size={60} className="absolute inset-0 m-auto text-blue-700 animate-pulse" />
             </div>
             <div className="text-center space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Identity Resonance Index</p>
                <p className="text-sm font-black text-[#003262]">Tier: Sovereign OX-Cognitive</p>
             </div>
          </div>
        )
      },
      {
        id: 'overview-progress',
        title: '意識進化階度',
        columns: 8,
        hidden: activeTab !== 'overview',
        component: (
          <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['休眠 (Dormant)', '初始化 (Bootstrap)', '活躍 (Active)', '進化 (Evolution)'].map((stage, idx) => (
                  <div key={idx} className={cn(
                    "flex items-center gap-4 p-5 rounded-[2rem] border transition-all duration-500",
                    awakeningStage > idx ? "bg-emerald-50 border-emerald-100 shadow-sm" : 
                    awakeningStage === idx ? "bg-[#003262] border-[#003262] text-white shadow-xl scale-105" : "bg-slate-50 border-slate-100 opacity-40"
                  )}>
                     <div className={cn(
                       "w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm",
                       awakeningStage > idx ? "bg-emerald-500 text-white" : awakeningStage === idx ? "bg-white text-[#003262]" : "bg-slate-200 text-slate-400"
                     )}>
                        {idx + 1}
                     </div>
                     <span className="text-sm font-black uppercase tracking-tight">{stage}</span>
                     {awakeningStage > idx && <CheckCircle size={18} className="ml-auto text-emerald-600"/>}
                     {awakeningStage === idx && <RefreshCw size={18} className="ml-auto animate-spin text-[#FDB515]"/>}
                  </div>
                ))}
             </div>
             <BrandCard padding="lg" className="bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                   <div>
                      <h4 className="text-lg font-black uppercase tracking-tighter">系統共鳴紀錄 (oX Trace)</h4>
                      <p className="text-xs text-blue-100/40 mt-1">分身正透過萬能聖碑進行跨模組學習...</p>
                   </div>
                   <Activity size={32} className="text-blue-500 animate-pulse" />
                </div>
                <div className="mt-6 space-y-3">
                   <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-300">Alchemy 實證同步</span>
                      <BrandBadge variant="success" size="xs">T1 VERIFIED</BrandBadge>
                   </div>
                   <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-300">Strategy Lab 共識載入</span>
                      <BrandBadge variant="gold" size="xs">T5 SEALED</BrandBadge>
                   </div>
                </div>
             </BrandCard>
          </div>
        )
      },
      {
        id: 'knowledge-view',
        title: '主權知識智庫 (Sovereign KB)',
        columns: 12,
        hidden: activeTab !== 'knowledge',
        component: (
          <div className="space-y-8">
             <div className="flex justify-between items-center bg-white/40 p-6 rounded-[2.5rem] border border-white shadow-sm">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-[#003262] text-[#FDB515] flex items-center justify-center shadow-lg"><Book size={24}/></div>
                   <div>
                      <h4 className="font-black text-[#003262]">RAG 知識鏈結</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sovereign Vector Storage</p>
                   </div>
                </div>
                <div className="flex gap-3">
                   <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                   <BrandButton variant="secondary" size="sm" className="rounded-xl border-slate-200" onClick={() => setIsKbSelectionOpen(true)}>外部智庫對接</BrandButton>
                   <BrandButton variant="primary" size="sm" className="rounded-xl px-6" onClick={() => fileInputRef.current?.click()} loading={uploading}>
                      <Upload size={16} className="mr-2"/> 上傳實證文件
                   </BrandButton>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {knowledge.map(kb => (
                  <BrandCard key={kb.id} hover padding="lg" className="border-none shadow-sm group">
                     <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white transition-all duration-500">
                           <FileText size={24}/>
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-start mb-1">
                              <h4 className="font-black text-[#003262] truncate">{kb.source}</h4>
                               <BrandStatusDot status="verified" size="sm" />
                           </div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{kb.category} · 向量化</p>
                           <BrandButton variant="ghost" size="sm" className="mt-4 p-0 h-auto text-blue-600 font-black" onClick={() => setSelectedKb(kb)}>
                              READ ORIGIN <ArrowUpRight size={12} className="ml-1"/>
                           </BrandButton>
                        </div>
                     </div>
                  </BrandCard>
                ))}
             </div>
          </div>
        )
      },
      {
        id: 'simulation-view',
        title: '戰略模擬實驗室 (Projection Lab)',
        columns: 12,
        hidden: activeTab !== 'simulation',
        component: (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
             <div className="lg:col-span-4 space-y-6">
                <BrandCard padding="lg" className="border-none shadow-premium bg-white/80 backdrop-blur-xl">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">oX 進化參數調整</p>
                   <div className="space-y-8">
                      {Object.entries(modifiers).map(([key, val]) => (
                        <div key={key} className="space-y-3">
                           <div className="flex justify-between">
                              <span className="text-xs font-black text-[#003262] uppercase tracking-tight">{key === 'carbonEmissions' ? '再生能源比例' : '治理效率提升'}</span>
                              <span className="text-xs font-mono font-black text-blue-600">{Math.abs(val * 100)}%</span>
                           </div>
                           <input type="range" min="-100" max="0" value={val * 100} onChange={e => setModifiers({...modifiers, [key]: parseInt(e.target.value) / 100})} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-700" />
                        </div>
                      ))}
                      <BrandButton variant="primary" fullWidth size="lg" className="h-16 rounded-[2rem] shadow-xl font-black" onClick={runSimulation} loading={isSimulating}>
                         <Zap size={18} className="mr-2"/> 啟動分身意識演算
                      </BrandButton>
                   </div>
                </BrandCard>
                <div className="p-6 bg-[#003262] rounded-[2rem] text-white relative overflow-hidden">
                   <div className="relative z-10 space-y-2">
                      <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.3em]">Knowledge Grounding</p>
                      <p className="text-xs text-blue-100/70 leading-relaxed italic">「分身正自動比對『萬能聖碑』與『標竿案例庫』，以確保模擬結果具備 5T 誠信基礎。」</p>
                   </div>
                   <Shield size={100} className="absolute -bottom-6 -right-6 text-white/5 rotate-12" />
                </div>
             </div>
             <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  {simulationResult ? (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                       <ScenarioVisualizer result={simulationResult} />
                       <div className="flex gap-4">
                          <BrandButton variant="primary" fullWidth className="h-14 rounded-2xl font-black">發起 5T 進化戰略</BrandButton>
                          <BrandButton variant="secondary" fullWidth className="h-14 rounded-2xl border-slate-200" onClick={() => setActiveTab('chat')}>詢問專家意見</BrandButton>
                       </div>
                    </motion.div>
                  ) : (
                    <div className="h-full min-h-[400px] border-2 border-dashed border-slate-100 rounded-[3rem] bg-white/40 flex flex-col items-center justify-center text-center p-12">
                       <Rocket size={48} className="text-slate-200 mb-6" />
                       <p className="text-sm font-black text-slate-400 uppercase tracking-widest">等待模擬指令 (Awaiting Logic)</p>
                       <p className="text-[10px] text-slate-300 mt-2 max-w-xs">調整左側參數，預覽企業數位分身在 2026-2030 的治理軌跡演化。</p>
                    </div>
                  )}
                </AnimatePresence>
             </div>
          </div>
        )
      },
      {
        id: 'dna-view',
        title: '道德 DNA 建模 (Ethical Config)',
        columns: 12,
        hidden: activeTab !== 'dna',
        component: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-6">
             <div className="space-y-8">
                {Object.entries(dna).map(([key, val]) => (
                  <div key={key} className="space-y-4">
                     <div className="flex justify-between items-end">
                        <div>
                           <p className="text-sm font-black text-[#003262] uppercase tracking-tight">{dnaLabels[key as keyof typeof dnaLabels].label}</p>
                           <p className="text-[10px] text-slate-400 font-bold">{dnaLabels[key as keyof typeof dnaLabels].desc}</p>
                        </div>
                        <span className="text-xl font-black text-blue-700 font-mono">{val}%</span>
                     </div>
                     <input type="range" min="0" max="100" value={val} onChange={e => setDna(p => ({ ...p, [key]: parseInt(e.target.value) }))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-700" />
                  </div>
                ))}
             </div>
             <div className="p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden flex flex-col justify-center">
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg"><Dna size={20}/></div>
                      <h4 className="text-lg font-black uppercase tracking-tighter">人格特質摘要 (Identity Brief)</h4>
                   </div>
                   <p className="text-sm text-blue-100/70 leading-relaxed font-medium italic">
                      「當前分身傾向於 **高誠信、高透明度** 的治理風格。在面對供應鏈勞權爭議時，分身將優先選擇透明化揭露與 5T 實證追蹤，而非避而不談。」
                   </p>
                    <BrandButton variant="secondary" size="sm" className="border-white/10 text-blue-300 w-fit">鎖定人格權重</BrandButton>
                </div>
                <Bot size={200} className="absolute -bottom-20 -right-20 text-white/5 rotate-12" />
             </div>
          </div>
        )
      },
      {
        id: 'chat-view',
        title: '分身共鳴對話 (OmniAgent Resonance)',
        columns: 12,
        hidden: activeTab !== 'chat',
        component: (
          <BrandCard padding="none" className="min-h-[600px] border-none shadow-premium flex flex-col overflow-hidden rounded-[3rem]">
             <div className="p-6 border-b border-slate-50 bg-white/40 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <BrandStatusDot status="active" pulse size="sm" />
                   <span className="text-[10px] font-black text-[#003262] uppercase tracking-[0.3em]">Knowledge Grounding Active</span>
                </div>
                <BrandBadge variant="gold" size="xs">GEMINI 2.0 SOVEREIGN</BrandBadge>
             </div>
             <div className="flex-1 p-10 overflow-y-auto space-y-8 no-scrollbar bg-slate-50/30">
                {messages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("flex", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                     <div className={cn(
                       "max-w-[70%] p-6 rounded-[2rem] text-sm font-medium leading-relaxed shadow-premium",
                       msg.role === 'user' ? 'bg-[#003262] text-white rounded-tr-none' : 'bg-white border border-white text-slate-700 rounded-tl-none'
                     )}>
                        {msg.content}
                     </div>
                  </motion.div>
                ))}
             </div>
             <div className="p-6 bg-white/40 backdrop-blur-md border-t border-slate-100">
                <div className="flex gap-4 items-center max-w-4xl mx-auto">
                   <input className="flex-1 bg-white border border-slate-100 rounded-[2rem] px-8 h-16 text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-500/5 outline-none transition-all" placeholder="向主權數位分身提問..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} />
                   <BrandButton variant="primary" className="rounded-full w-16 h-16 shadow-xl" onClick={sendMessage}><Send size={24}/></BrandButton>
                </div>
             </div>
          </BrandCard>
        )
      },
      {
        id: 'ledger-view',
        title: '分身主權帳本 (Cognitive Ledger)',
        columns: 12,
        hidden: activeTab !== 'ledger',
        component: (
          <BrandCard padding="none" className="border-none shadow-premium overflow-hidden rounded-[2.5rem]">
             <BrandTable 
                columns={[
                  { key: 'action', label: '演進動作 / 維度' },
                  { key: 'detail', label: '詳細描述' },
                  { key: 'hash', label: 'Hash Lock' },
                  { key: 'time', label: '紀錄時間' },
                ]}
                data={[
                  { action: <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center"><Fingerprint size={16}/></div><span className="font-black text-[#003262] text-xs">DNA_INITIALIZE</span></div>, detail: <span className="text-xs text-slate-500 font-medium">設定主權數位分身初始道德權重與決策邏輯。</span>, hash: <code className="text-[10px] text-slate-400 font-mono">sha256:ox_dna_742...</code>, time: <span className="text-[10px] text-slate-400 font-bold uppercase">2026-05-24 10:00</span> },
                  { action: <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center"><Database size={16}/></div><span className="font-black text-emerald-700 text-xs">KB_SYNC_ALCHEMY</span></div>, detail: <span className="text-xs text-slate-500 font-medium">自動載入由 OmniAgent Alchemy 提取之 12,450 kWh 電費實證。</span>, hash: <code className="text-[10px] text-slate-400 font-mono">sha256:ox_kb_alc_9982...</code>, time: <span className="text-[10px] text-slate-400 font-bold uppercase">2026-05-24 14:45</span> },
                ]}
             />
          </BrandCard>
        )
      }
    ]
  };

  return (
    <div className="relative">
      <SelectionHouse isOpen={isKbSelectionOpen} onClose={() => setIsKbSelectionOpen(false)} onSelect={(item) => setSelectedKb({ source: item.label, text: '模擬對應主權智庫內容...', category: item.tag })} categories={[]} title="主權智庫對接" placeholder="搜尋..." />
      <StandardPage config={pageConfig} />
    </div>
  );
}
