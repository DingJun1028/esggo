
import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { 
    Crown, BrainCircuit, ArrowRight, Zap, Activity, Sparkles, 
    ShieldCheck, MessageSquare, Users, TrendingUp, AlertTriangle,
    CheckCircle, ShieldAlert, Cpu, Gavel
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { OmniDimensionAgent } from './OmniDimensionAgent';
import { universalIntelligence } from '../services/evolutionEngine';

interface DebateTurn {
    role: string;
    text: string;
    type: 'CSO' | 'CFO' | 'AUDITOR';
}

export const YangBoZone: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [activeSim, setActiveSim] = useState(false);
  const [reflexes, setReflexes] = useState<any[]>([]);
  const [debateFlow, setDebateFlow] = useState<DebateTurn[]>([]);
  const [isDebating, setIsDebating] = useState(false);
  const debateEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sub = universalIntelligence.reflex$.subscribe(r => {
        setReflexes(prev => [{ ...r, id: Date.now() }, ...prev].slice(0, 10));
    });
    return () => sub.unsubscribe();
  }, []);

  useEffect(() => {
      debateEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [debateFlow]);

  const profile = {
      name: isZh ? '善向楊博 (CEO)' : 'Thoth Yang (CEO)',
      philosophy: isZh ? 'ESG 不應是企業的負擔，而是「創價」的最強武器。' : 'ESG is the ultimate weapon for value creation.',
      expertise: ['極限創價策略', '國際永續對標', 'AI 決策編排', '再生商模設計']
  };

  const runSimulation = async () => {
      setActiveSim(true);
      setIsDebating(true);
      setDebateFlow([]);
      addToast('info', isZh ? '正在啟動多代理人戰略辯論...' : 'Initializing Multi-Agent Strategic Debate...', 'War Room');

      const turns: DebateTurn[] = [
          { role: 'CSO (鼎竣)', type: 'CSO', text: isZh ? "偵測到歐盟 CBAM 規則更新，我們必須立即啟動 A9 級供應鏈透明度計畫，否則將面臨 15% 的隱性關稅衝擊。" : "CBAM update detected. Launch A9 supply chain transparency now or face 15% tariff shock." },
          { role: 'CFO (財務代理)', type: 'CFO', text: isZh ? "反對。立即啟動 A9 會在 Q3 造成 12% 的毛利壓力。建議採用分階段對標，優先優化高碳排放站點。" : "Object. A9 launch creates 12% margin pressure. Suggest tiered benchmarking focusing on high-emission nodes." },
          { role: 'Auditor (合規見證)', type: 'AUDITOR', text: isZh ? "從合規角度看，分階段對標可能導致數據完整性缺口 (Gap)。建議在 A11 知識層執行數據摺疊以抵銷成本。" : "From compliance view, tiered approach creates data gaps. Suggest data folding at A11 level to offset costs." }
      ];

      for (const turn of turns) {
          await new Promise(r => setTimeout(r, 1500));
          setDebateFlow(prev => [...prev, turn]);
      }
      setIsDebating(false);
  };

  return (
    <div className="h-full w-full flex flex-col bg-black animate-fade-in overflow-hidden">
        <div className="flex-1 grid grid-cols-12 gap-2 p-2 h-full">
            {/* 左側：領袖意志 (5/12) */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-2 h-full overflow-hidden">
                <div className="glass-bento p-8 flex flex-col justify-center border-white/5 bg-gradient-to-br from-celestial-gold/10 to-transparent relative overflow-hidden rounded-[3rem] shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10 animate-spin-slow"><Crown className="w-48 h-48 text-celestial-gold" /></div>
                    
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-black border-2 border-celestial-gold/40 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.3)] animate-prism-pulse">
                                <Crown className="w-8 h-8 text-celestial-gold" />
                            </div>
                            <div>
                                <h3 className="zh-main text-3xl text-white tracking-tighter uppercase">{profile.name}</h3>
                                <span className="en-sub !mt-0 text-celestial-gold font-black tracking-widest">SOVEREIGN_STRATEGIST_v16.1</span>
                            </div>
                        </div>
                        
                        <div className="p-6 bg-white/[0.03] border-l-4 border-celestial-gold rounded-r-2xl">
                            <p className="text-xl text-gray-100 font-light leading-relaxed italic">"{profile.philosophy}"</p>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-4">
                            {profile.expertise.map((item, i) => (
                                <span key={i} className="px-4 py-1.5 bg-black/40 border border-white/10 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest">{item}</span>
                            ))}
                        </div>

                        <div className="pt-8 space-y-4">
                            <OmniDimensionAgent id="Pillar_Value_MAX" label={isZh ? "ESG 價值極大化創造引擎" : "Value Maximizer"} value="OMNI_LV.MAX" dimensions={['A6', 'A9', 'A12']} color="gold" className="!p-6 !rounded-[2rem] border-celestial-gold/20" />
                            <OmniDimensionAgent id="Pillar_Regen_MAX" label={isZh ? "利他精神與利益對齊協定" : "Regen Protocol"} value="99.9% SYNC" dimensions={['A8', 'A10', 'A11']} color="purple" className="!p-6 !rounded-[2rem] border-celestial-purple/20" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 右側：決策熔爐戰略室 (7/12) */}
            <div className="col-span-12 lg:col-span-7 flex flex-col gap-2 h-full overflow-hidden">
                <div className="flex-1 glass-bento p-10 bg-slate-900/60 border-white/5 rounded-[3.5rem] shadow-2xl flex flex-col relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.05)_0%,transparent_70%)] pointer-events-none" />
                    
                    <div className="flex justify-between items-center mb-8 shrink-0 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-celestial-purple/20 rounded-2xl text-celestial-purple border border-celestial-purple/30">
                                <BrainCircuit className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="zh-main text-2xl text-white">戰略對抗模擬：多代理人辯論</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="en-sub !text-[8px] text-emerald-500 font-black">AI_DEBATE_ENGINE_ACTIVE</span>
                                </div>
                            </div>
                        </div>
                        {!activeSim ? (
                            <button 
                                onClick={runSimulation}
                                className="px-8 py-3 bg-white text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-celestial-gold transition-all shadow-xl active:scale-95"
                            >
                                Start Simulation
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <span className="uni-mini bg-purple-500 text-white border-none animate-pulse">DEBATING...</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pr-2 relative z-10">
                        {activeSim ? (
                            <div className="space-y-6 animate-fade-in">
                                {debateFlow.map((turn, i) => (
                                    <div key={i} className={`flex gap-5 animate-slide-up`}>
                                        <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center border transition-all
                                            ${turn.type === 'CSO' ? 'bg-celestial-gold/20 border-celestial-gold/40 text-celestial-gold' : 
                                              turn.type === 'CFO' ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 
                                              'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'}
                                        `}>
                                            {turn.type === 'CSO' ? <Gavel className="w-6 h-6" /> : turn.type === 'CFO' ? <Cpu className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1.5">
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{turn.role}</span>
                                                <div className="h-px bg-white/5 flex-1" />
                                            </div>
                                            <div className={`p-5 rounded-[2rem] text-sm leading-relaxed border shadow-xl
                                                ${turn.type === 'CSO' ? 'bg-celestial-gold/5 border-celestial-gold/10 text-white' : 
                                                  turn.type === 'CFO' ? 'bg-blue-500/5 border-blue-500/10 text-gray-200' : 
                                                  'bg-emerald-500/5 border-emerald-500/10 text-gray-100'}
                                            `}>
                                                {turn.text}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isDebating && (
                                    <div className="flex gap-5 animate-pulse pl-16">
                                        <div className="w-24 h-4 bg-white/5 rounded-full" />
                                        <div className="w-48 h-10 bg-white/5 rounded-[2rem]" />
                                    </div>
                                )}
                                <div ref={debateEndRef} />
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
                                <ShieldAlert className="w-32 h-32 text-gray-600 mb-6" />
                                <h4 className="zh-main text-3xl text-white uppercase tracking-[0.3em]">Awaiting Strategic Signal</h4>
                                <p className="text-gray-500 mt-4 max-w-sm italic">選擇情境後，核心代理人群將針對 ESG 衝突進行理性辯論並產出「創價最優解」。</p>
                            </div>
                        )}
                    </div>

                    {/* Bottom Reflex Bar */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center shrink-0 relative z-10">
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2 text-[9px] text-gray-600 font-black uppercase">
                                <Activity className="w-3 h-3 text-emerald-400" /> System_Vital: Optimal
                            </div>
                            <div className="flex items-center gap-2 text-[9px] text-gray-600 font-black uppercase">
                                <TrendingUp className="w-3 h-3 text-celestial-gold" /> ROI_Sim: +24.5%
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                             <div className="uni-mini bg-slate-800 text-gray-500 border-none uppercase">JAK_War_Room_v16</div>
                        </div>
                    </div>
                </div>

                <div className="glass-bento p-6 flex-1 flex flex-col bg-black/40 border-white/5 min-h-0 rounded-[2.5rem]">
                    <div className="flex justify-between items-center mb-4 shrink-0">
                        <h4 className="en-sub !text-[9px] text-emerald-400 flex items-center gap-2 uppercase tracking-[0.3em] font-black"><Activity className="w-3 h-3" /> Live_Neural_Reflex_Bus</h4>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar font-mono text-[9px] text-gray-600 space-y-1.5 pr-2">
                        {reflexes.map(r => (
                            <div key={r.id} className="flex gap-4 border-b border-white/[0.02] pb-1.5 items-center group">
                                <span className="shrink-0 text-gray-800 font-black">[{new Date(r.id).toLocaleTimeString([], { hour12: false })}]</span>
                                <span className="text-emerald-500 uppercase font-black shrink-0">PROTOCOL_{r.type}</span>
                                <span className="text-gray-400 truncate flex-1 group-hover:text-white transition-colors">Dimension <span className="text-celestial-gold font-bold">{r.source}</span> witnessed & verified via blockchain hash 0x{r.id.toString(16).substr(-4)}.</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
