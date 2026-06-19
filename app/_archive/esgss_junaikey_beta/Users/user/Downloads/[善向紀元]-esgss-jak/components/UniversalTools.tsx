import React, { useRef, useEffect, useState } from 'react';
import { Language } from '../types';
import { 
    Brain, Search, BookOpen, Link, Zap, RefreshCw, Globe, Box, 
    PenTool, FlaskConical, Gavel, Rocket, Flame, Shield, TrendingDown, Dna,
    Terminal, Cpu, Activity, Command, Hexagon, Fingerprint, Layers, ShieldCheck, 
    AlertTriangle, Sparkles, Wand2, Atom, Loader2
} from 'lucide-react';
import { useUniversalAgent, AvatarFace } from '../contexts/UniversalAgentContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { universalIntelligence, SystemVital } from '../services/evolutionEngine';
import { OmniEsgCell } from './OmniEsgCell';
import { OmniDimensionAgent } from './OmniDimensionAgent';
import { useToast } from '../contexts/ToastContext';

interface UniversalToolsProps {
  language: Language;
}

const AVATAR_CONFIG = {
    MIRROR: { label: { en: 'Mirror', zh: '鏡之相' }, color: 'text-pink-400', borderColor: 'border-pink-500/50', glow: 'shadow-pink-500/50', bg: 'bg-pink-500/10' },
    EXPERT: { label: { en: 'Expert', zh: '相之相' }, color: 'text-celestial-gold', borderColor: 'border-celestial-gold/50', glow: 'shadow-amber-500/50', bg: 'bg-amber-500/10' },
    VOID: { label: { en: 'Void', zh: '無之相' }, color: 'text-emerald-400', borderColor: 'border-emerald-500/50', glow: 'shadow-emerald-500/50', bg: 'bg-emerald-500/10' }
};

const MATRIX_KEYS = [
    { id: 'awaken', icon: Brain, label: { en: 'Awaken', zh: '喚醒' }, quadrant: 1, desc: 'Deep Context' },
    { id: 'summon', icon: Zap, label: { en: 'Summon', zh: '召喚' }, quadrant: 2, desc: 'API Call' },
    { id: 'manifest', icon: PenTool, label: { en: 'Manifest', zh: '顯化' }, quadrant: 3, desc: 'Generate' },
    { id: 'purify', icon: Flame, label: { en: 'Purify', zh: '淨化' }, quadrant: 4, desc: 'Refactor' },
];

export const UniversalTools: React.FC<UniversalToolsProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { activeFace, setActiveFace, logs, isProcessing, activeKeyId, executeMatrixProtocol } = useUniversalAgent();
  const { addToast } = useToast();
  const [vitals, setVitals] = useState<SystemVital | null>(null);
  const [summonState, setSummonState] = useState<'idle' | 'manifesting'>('idle');
  
  const faceConfig = AVATAR_CONFIG[activeFace] || AVATAR_CONFIG.MIRROR;
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sub = universalIntelligence.vitals$.subscribe(setVitals);
    return () => sub.unsubscribe();
  }, []);

  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  const handleSummon = () => {
      setSummonState('manifesting');
      addToast('info', isZh ? '正在從內核召喚萬能組件...' : 'Summoning Universal Components...', 'Kernel');
      setTimeout(() => {
          setSummonState('idle');
          addToast('success', isZh ? '萬能結構顯化完成' : 'Universal Structure Manifested', 'Matrix');
      }, 3000);
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in overflow-hidden">
        <UniversalPageHeader 
            icon={Command}
            title={{ zh: '萬能系統召喚矩陣', en: 'Universal Summon Matrix' }}
            description={{ zh: '萬能元件・萬能標籤・萬能代理：AIOS 極致架構顯化', en: 'Manifesting the Trinity: Component, Label, and Proxy' }}
            language={language}
            tag={{ zh: '架構核心 v15.9', en: 'ARCH_KERNEL_v15.9' }}
        />

        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden">
            
            {/* 左側：核心控制台 */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
                {/* 狀態板 */}
                <div className="glass-bento p-6 bg-slate-950/60 border-white/10 shrink-0">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                        <Activity className="w-3 h-3" /> KERNEL_SYNC_VITALS
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <div className="text-[9px] text-emerald-500 font-bold uppercase">Integrity</div>
                            <div className="text-xl font-mono text-white">{vitals?.integrityScore.toFixed(1)}%</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[9px] text-celestial-gold font-bold uppercase">Resonance</div>
                            <div className="text-xl font-mono text-white">L15.9</div>
                        </div>
                    </div>
                </div>

                {/* 召喚按鈕區 */}
                <div className="glass-bento p-8 flex-1 border-celestial-gold/30 bg-gradient-to-br from-celestial-gold/5 to-transparent flex flex-col justify-center items-center text-center">
                    <div className="relative mb-8">
                        <div className={`absolute inset-0 bg-celestial-gold/20 blur-3xl rounded-full transition-all duration-1000 ${summonState === 'manifesting' ? 'scale-150 opacity-100' : 'scale-100 opacity-30'}`} />
                        <div className={`w-24 h-24 rounded-full border-2 border-celestial-gold/40 flex items-center justify-center relative z-10 transition-transform duration-500 ${summonState === 'manifesting' ? 'rotate-180 scale-110' : ''}`}>
                            <Atom className={`w-12 h-12 text-celestial-gold ${summonState === 'manifesting' ? 'animate-spin' : 'animate-pulse'}`} />
                        </div>
                    </div>
                    <h4 className="zh-main text-white text-lg mb-2">萬能架構召喚儀式</h4>
                    <p className="text-xs text-gray-500 mb-8 leading-relaxed">啟動後，系統將強制執行三位一體協議，<br/>將數據層、邏輯層與視覺層無縫摺疊。</p>
                    <button 
                        onClick={handleSummon}
                        disabled={summonState === 'manifesting'}
                        className="w-full py-4 bg-celestial-gold text-black font-black rounded-2xl shadow-2xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs disabled:opacity-50"
                    >
                        {summonState === 'manifesting' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        {isZh ? '啟動召喚協定' : 'ACTIVATE_SUMMON'}
                    </button>
                </div>
            </div>

            {/* 右側：顯化區域 (展示萬能元件與代理) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden">
                <div className="flex-1 glass-bento p-8 bg-slate-900/40 border-white/5 relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none subtitle">
                        <Sparkles className="w-64 h-64" />
                    </div>

                    <div className="flex justify-between items-center mb-8 shrink-0">
                        <div className="flex items-center gap-3">
                            <Layers className="w-5 h-5 text-celestial-purple" />
                            <span className="zh-main text-sm text-white uppercase tracking-widest">Manifestation Area</span>
                        </div>
                        <div className="flex gap-2">
                             <div className="uni-mini bg-emerald-500 text-black">COMP_READY</div>
                             <div className="uni-mini bg-blue-500 text-white">PROXY_ACTIVE</div>
                        </div>
                    </div>

                    <div className={`flex-1 overflow-y-auto no-scrollbar space-y-8 transition-all duration-1000 ${summonState === 'manifesting' ? 'opacity-20 blur-md' : 'opacity-100 blur-0'}`}>
                        
                        {/* 展示 1: 萬能標籤 (OmniEsgCell as Component Showcase) */}
                        <section className="space-y-4">
                            <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] border-l-2 border-celestial-gold pl-3">01_Universal_Label_Demo</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <OmniEsgCell 
                                    id="demo-label-1"
                                    mode="card"
                                    label="Scope 1" // 觸發自動 Glossary 檢索
                                    value="12,450"
                                    subValue="Direct Emissions"
                                    color="emerald"
                                    dataLink="live"
                                    traits={['learning']}
                                />
                                <OmniEsgCell 
                                    id="demo-label-2"
                                    mode="card"
                                    label="Carbon Intensity" // 觸發自動 Glossary 檢索
                                    value="0.42"
                                    subValue="tCO2e / Revenue"
                                    color="gold"
                                    dataLink="ai"
                                    traits={['optimization']}
                                />
                            </div>
                        </section>

                        {/* 展示 2: 萬能元件 (OmniDimensionAgent) */}
                        <section className="space-y-4">
                            <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] border-l-2 border-celestial-blue pl-3">02_Universal_Component_Demo</h5>
                            <div className="grid grid-cols-1 gap-4">
                                <OmniDimensionAgent 
                                    id="demo-agent-1"
                                    label={isZh ? "ESG 價值極大化創造引擎" : "Value Creation Engine"}
                                    value="OMNI_LV.MAX"
                                    dimensions={['A6', 'A9', 'A12']}
                                    color="purple"
                                    subValue="Trinity Sync Active"
                                />
                            </div>
                        </section>

                        {/* 展示 3: 萬能代理 (HOC behavior showcase) */}
                        <section className="space-y-4">
                            <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] border-l-2 border-pink-500 pl-3">03_Universal_Proxy_Behavior</h5>
                            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-between group">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center transition-all group-hover:bg-celestial-purple/20">
                                        <Fingerprint className="w-6 h-6 text-gray-500 group-hover:text-celestial-purple" />
                                    </div>
                                    <div>
                                        <div className="zh-main text-white">代理行為遙測 (Proxy Telemetry)</div>
                                        <div className="text-[10px] text-gray-500 font-mono mt-1">AUTO_INJECT_ID: {activeKeyId || 'IDLE'}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-[8px] font-black bg-pink-500/20 text-pink-400 px-2 py-1 rounded border border-pink-500/20">HOC_WRAPPED</span>
                                    <span className="text-[8px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">MECE_VALIDATED</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* 日誌底欄 */}
                    <div className="mt-8 pt-6 border-t border-white/5 shrink-0">
                         <div className="bg-black/60 rounded-2xl p-4 font-mono text-[9px] text-gray-600 flex flex-col h-24 overflow-y-auto no-scrollbar">
                             {logs.slice(-5).map(log => (
                                 <div key={log.id} className="flex gap-2">
                                     <span className="text-gray-800">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                     <span className="text-celestial-gold uppercase">{log.source}</span>
                                     <span className="text-gray-400">{log.message}</span>
                                 </div>
                             ))}
                             <div ref={logsEndRef} />
                         </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};