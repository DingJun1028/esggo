import React, { useState, useEffect } from 'react';
import { Language, View } from '../types';
import { 
    Cpu, Activity, Zap, ShieldCheck, Layers, Sparkles, 
    Network, Database, Terminal, Fingerprint, Command,
    Globe, Search, Briefcase, RefreshCw, Loader2, Gauge, Users,
    ArrowUpRight, Heart, Star, BarChart3, ShieldAlert
} from 'lucide-react';
import { UniversalPageHeader } from './UniversalPageHeader';
import { universalIntelligence, SystemVital } from '../services/evolutionEngine';
import { useToast } from '../contexts/ToastContext';
import { OmniDimensionAgent } from './OmniDimensionAgent';
import { OmniEsgCell } from './OmniEsgCell';

export const UniversalSystem: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [vitals, setVitals] = useState<SystemVital | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [entropyWave, setEntropyWave] = useState<number[]>(Array(20).fill(50));

  useEffect(() => {
    const sub = universalIntelligence.vitals$.subscribe(v => {
        setVitals(v);
        setEntropyWave(prev => [...prev.slice(1), 30 + Math.random() * 40]);
    });
    return () => sub.unsubscribe();
  }, []);

  const handleGlobalSync = () => {
      setIsSyncing(true);
      addToast('info', isZh ? '啟動全系統萬能同步協定...' : 'Initiating Global Universal Sync...', 'Kernel');
      setTimeout(() => {
          setIsSyncing(false);
          addToast('success', isZh ? '同步完成' : 'Sync Complete', 'Matrix');
      }, 2500);
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden">
        <UniversalPageHeader 
            icon={Command}
            title={{ zh: '萬能系統中樞', en: 'Universal System Hub' }}
            description={{ zh: '整合感知、認知、行動與生態共鳴', en: 'Perception, Cognition & Action Sync' }}
            language={language}
            tag={{ zh: '系統核心 v16.1', en: 'SYSTEM_CORE_v16.1' }}
        />

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 overflow-hidden min-h-0">
                <div className="flex-1 glass-bento p-10 bg-slate-950/80 border-celestial-gold/30 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col min-h-0">
                    <div className="flex justify-between items-center mb-8 shrink-0 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-celestial-gold/20 rounded-[1.5rem] text-celestial-gold border border-celestial-gold/30">
                                <Cpu className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="zh-main text-2xl text-white">內核運行狀態</h3>
                                <span className="en-sub !mt-0 text-celestial-gold font-black">KERNEL_L16_STABLE</span>
                            </div>
                        </div>
                        <button onClick={handleGlobalSync} disabled={isSyncing} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white">
                            {isSyncing ? <Loader2 className="w-6 h-6 animate-spin" /> : <RefreshCw className="w-6 h-6" />}
                        </button>
                    </div>

                    <div className="flex-1 p-6 bg-black/40 rounded-[2.5rem] border border-white/5 relative overflow-hidden min-h-0 flex flex-col">
                         <div className="flex justify-between items-center mb-4 shrink-0">
                             <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Negative_Entropy_Wave</div>
                             <div className="text-xl font-mono font-bold text-emerald-400">ΔS: {vitals?.entropy.toFixed(3)}</div>
                         </div>
                         <div className="flex-1 min-h-[60px] flex items-end justify-between gap-1 overflow-hidden">
                             {entropyWave.map((h, i) => (
                                 <div 
                                    key={i} 
                                    className="flex-1 bg-emerald-500/30 rounded-t-sm transition-all duration-500" 
                                    style={{ height: `${h}%`, opacity: 0.3 + (i / 20) * 0.7 }}
                                 />
                             ))}
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8 shrink-0">
                        <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
                            <div className="text-[10px] text-gray-500 uppercase font-black mb-1">Logic_Purity</div>
                            <div className="text-3xl font-mono font-bold text-white tracking-tighter">99.8%</div>
                        </div>
                        <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
                            <div className="text-[10px] text-gray-500 uppercase font-black mb-1">Response_Lat</div>
                            <div className="text-3xl font-mono font-bold text-blue-400 tracking-tighter">12ms</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-span-12 lg:col-span-7 flex flex-col gap-6 overflow-hidden min-h-0">
                <div className="flex-1 glass-bento p-10 bg-slate-900/60 border-white/5 rounded-[3.5rem] shadow-2xl flex flex-col overflow-hidden relative min-h-0">
                    <div className="flex justify-between items-center mb-8 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-celestial-purple/20 rounded-[1.5rem] text-celestial-purple border border-celestial-purple/30">
                                <Layers className="w-7 h-7" />
                            </div>
                            <h3 className="zh-main text-2xl text-white uppercase">Trinity_Architecture</h3>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-2 relative z-10 min-h-0">
                        <section className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-px bg-emerald-500/30 flex-1" />
                                <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">01_Perception</h5>
                                <div className="h-px bg-emerald-500/30 flex-1" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <OmniEsgCell id="P_IoT_PULSE" mode="card" label="IoT 全球傳感" value="STABLE" color="emerald" dataLink="live" className="!h-32" />
                                <OmniEsgCell id="P_SENTIMENT" mode="card" label="輿情雷達" value="HIGH" color="blue" dataLink="ai" className="!h-32" />
                            </div>
                        </section>

                        <section className="space-y-4">
                             <div className="flex items-center gap-4">
                                <div className="h-px bg-celestial-gold/30 flex-1" />
                                <h5 className="text-[10px] font-black text-celestial-gold uppercase tracking-[0.3em]">02_Cognition</h5>
                                <div className="h-px bg-celestial-gold/30 flex-1" />
                            </div>
                            <OmniDimensionAgent id="C_CORE_REASONER" label="推理引擎" value="99.8% ACC" dimensions={['A3', 'A11', 'A12']} color="gold" className="!p-8" />
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-px bg-purple-500/30 flex-1" />
                                <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">03_Action</h5>
                                <div className="h-px bg-purple-500/30 flex-1" />
                            </div>
                            <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] flex items-center justify-between group hover:bg-white/[0.05] transition-all shrink-0">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-purple-500/20 border border-white/5 shadow-inner">
                                        <Zap className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <div className="zh-main text-xl text-white">行動執行終端</div>
                                        <div className="text-[10px] text-gray-500 font-mono">STANDBY_MODE</div>
                                    </div>
                                </div>
                                <button className="px-8 py-3 bg-white/5 hover:bg-purple-500 hover:text-black rounded-xl text-[10px] font-black uppercase transition-all border border-white/10">Execute</button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
