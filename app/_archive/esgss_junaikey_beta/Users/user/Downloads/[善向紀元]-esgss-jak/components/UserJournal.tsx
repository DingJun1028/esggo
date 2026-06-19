import React, { useMemo } from 'react';
import { Language } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { 
    Book, TrendingUp, Award, Zap, Clock, Activity, Target, Star, 
    ShieldCheck, Gem, Sparkles, ChevronRight, Layout, Database, 
    Fingerprint, MessageSquare, Flame, CheckCircle2, Trophy, History
} from 'lucide-react';
import { UniversalPageHeader } from './UniversalPageHeader';

export const UserJournal: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { journal, xp, level, activeTitle } = useCompany();

  // Simple stats calculation
  const totalImpact = journal.length;
  const milestones = journal.filter(j => j.type === 'milestone').length;
  const xpGained = journal.reduce((acc, curr) => acc + curr.xpGained, 0);

  const stats = [
      { label: isZh ? '總影響力事件' : 'Total Events', value: totalImpact, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
      { label: isZh ? '已達成里程碑' : 'Milestones', value: milestones, icon: Award, color: 'text-celestial-gold', bg: 'bg-amber-500/10' },
      { label: isZh ? '當前權能等級' : 'Authority Level', value: `Lv. ${level}`, icon: Zap, color: 'text-celestial-purple', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden pb-4">
        <UniversalPageHeader 
            icon={Book}
            title={{ zh: '使用者永續日誌', en: 'User Sustainability Journal' }}
            description={{ zh: '刻印成長足跡：追蹤您的權能演進、重大里程碑與智慧沉澱', en: 'Imprinting growth: Tracking authority evolution and wisdom precipitation.' }}
            language={language}
            tag={{ zh: '記憶內核 v16.1', en: 'MEM_CORE_V16.1' }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0 px-2">
            {stats.map((s, i) => (
                <div key={i} className="glass-bento p-8 rounded-[2.5rem] border-white/5 bg-slate-900/60 shadow-2xl flex items-center gap-6 group hover:border-white/15 transition-all">
                    <div className={`p-5 rounded-3xl ${s.bg} ${s.color} shadow-lg group-hover:scale-110 transition-transform duration-700`}>
                        <s.icon className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{s.label}</div>
                        <div className="text-3xl font-mono font-bold text-white tracking-tighter">{s.value}</div>
                    </div>
                </div>
            ))}
        </div>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden px-2">
            {/* Timeline Area (8/12) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 glass-bento p-10 bg-slate-950/40 border-white/5 rounded-[3.5rem] flex flex-col shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none"><Database className="w-96 h-96 text-white" /></div>
                    
                    <div className="flex justify-between items-center mb-10 shrink-0 relative z-10">
                        <h3 className="zh-main text-xl text-white tracking-widest uppercase flex items-center gap-3">
                            <Clock className="w-5 h-5 text-gray-500" />
                            Temporal_Evolution_Stream
                        </h3>
                        <div className="flex gap-2">
                             <div className="uni-mini bg-emerald-500/10 text-emerald-400 border-none">LIVE_SYNC</div>
                             <div className="uni-mini bg-slate-800 text-gray-500 border-none">IMMUTABLE</div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 pr-4">
                        {journal.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale">
                                {/* Fix: Use the correctly imported History component from lucide-react */}
                                <History className="w-24 h-24 mb-6" />
                                <p className="zh-main text-xl uppercase tracking-widest">Awaiting First Imprint</p>
                            </div>
                        ) : (
                            <div className="space-y-12 relative pb-20">
                                {/* Vertical Timeline Line */}
                                <div className="absolute left-[27px] top-4 bottom-12 w-[1px] bg-white/5" />
                                
                                {journal.map((entry, idx) => (
                                    <div key={entry.id} className="relative pl-16 group/item animate-slide-up">
                                        {/* Node Marker */}
                                        <div className={`absolute left-[20px] top-2 w-4 h-4 rounded-full border-2 transform transition-all duration-700 z-10 group-hover/item:scale-125
                                            ${entry.type === 'milestone' ? 'bg-celestial-gold border-celestial-gold shadow-[0_0_15px_rgba(251,191,36,0.6)]' : 
                                              entry.type === 'insight' ? 'bg-celestial-purple border-celestial-purple' : 'bg-emerald-500 border-emerald-500'}
                                        `} />
                                        
                                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest">TS: {new Date(entry.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                                                <div className="w-1 h-1 rounded-full bg-gray-800" />
                                                <span className="text-[10px] text-gray-500 font-bold uppercase">{new Date(entry.timestamp).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                {entry.tags.map(tag => (
                                                    <span key={tag} className="text-[8px] font-black px-2 py-0.5 bg-white/5 rounded-md text-gray-500 border border-white/5 uppercase">#{tag}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 group-hover/item:bg-white/[0.04] group-hover/item:border-white/10 transition-all shadow-xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover/item:opacity-[0.07] transition-opacity">
                                                {entry.type === 'milestone' ? <Trophy className="w-20 h-20" /> : <Sparkles className="w-20 h-20" />}
                                            </div>
                                            <div className="flex justify-between items-start relative z-10">
                                                <div className="space-y-2">
                                                    <h4 className={`zh-main text-2xl tracking-tight transition-colors ${entry.type === 'milestone' ? 'text-celestial-gold' : 'text-white'}`}>
                                                        {entry.title}
                                                    </h4>
                                                    <p className="text-gray-400 text-sm leading-relaxed font-light italic">"{entry.impact}"</p>
                                                </div>
                                                <div className="text-right shrink-0 ml-8">
                                                    <div className="text-emerald-400 text-lg font-mono font-bold">+{entry.xpGained} XP</div>
                                                    <div className="text-[8px] text-gray-700 font-mono mt-1">HASH_0x{entry.id.substring(2,6).toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Side Stats (4/12) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
                <div className="glass-bento p-10 bg-slate-900 border-white/10 rounded-[3.5rem] shadow-2xl relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none"><Fingerprint className="w-64 h-64 text-white" /></div>
                    <h4 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em] mb-10 flex items-center gap-4 relative z-10">
                        <Target className="w-5 h-5 text-celestial-purple" /> ARCHITECT_DNA_SYNC
                    </h4>
                    
                    <div className="space-y-10 relative z-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-celestial-gold to-amber-600 p-1 shadow-2xl mb-4">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=masculine_${xp}`} className="w-full h-full rounded-full bg-slate-900 object-cover" alt="User" />
                            </div>
                            <h5 className="zh-main text-2xl text-white tracking-tight">{activeTitle?.text || 'Novice Architect'}</h5>
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1">SYNC_ESTABLISHED</span>
                        </div>

                        <div className="space-y-4">
                             <div className="p-6 bg-black/40 rounded-[2rem] border border-white/5 shadow-inner">
                                <div className="flex justify-between items-end mb-3">
                                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Total_Impact_Xp</div>
                                    <div className="text-3xl font-mono font-bold text-emerald-400 tracking-tighter">{xp.toLocaleString()}</div>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 animate-pulse" style={{ width: '65%' }} />
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="glass-bento p-8 flex-1 flex flex-col bg-slate-900/60 border-white/5 rounded-[3rem] shadow-2xl overflow-hidden min-h-0">
                    <div className="flex justify-between items-center mb-6 shrink-0">
                         <h4 className="zh-main text-lg text-white tracking-widest uppercase">System_Insights</h4>
                         <span className="uni-mini bg-celestial-purple text-white border-none">AI_Gen</span>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
                        <div className="p-6 bg-purple-500/5 rounded-[2rem] border border-purple-500/20 flex items-start gap-4 shadow-inner">
                             <Sparkles className="w-6 h-6 text-celestial-purple shrink-0 mt-0.5" />
                             <div className="text-[12px] text-gray-400 leading-relaxed italic">
                                <b className="text-white not-italic uppercase text-[9px] block mb-1">AI_Chronicle_Advisor:</b>
                                {isZh ? "偵測到您的影響力事件主要集中在「實用主義」維度。建議參與更多「利他性」專案以優化靈魂共鳴平衡度。" : "Focus more on altruism to balance resonance."}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
