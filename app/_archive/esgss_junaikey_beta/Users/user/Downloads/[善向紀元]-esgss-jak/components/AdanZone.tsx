import React, { useState } from 'react';
import { Language } from '../types';
import { Search, ArrowRight, MessageCircle, Mic2, Hexagon, Activity, Sparkles, TrendingUp } from 'lucide-react';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { BUILTIN_SCRIPTURES } from '../constants';
import { useCompany } from './providers/CompanyProvider';

export const AdanZone: React.FC<{ language: Language }> = ({ language }) => {
  const { soul, expMultiplier, luckFactor } = useUniversalAgent();
  const { activeTitle } = useCompany();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = Array.from(new Set(BUILTIN_SCRIPTURES.map(s => s.category)));
  const filteredScriptures = BUILTIN_SCRIPTURES.filter(s => {
      const matchSearch = s.title.includes(searchQuery) || s.content.includes(searchQuery);
      const matchCat = !selectedCategory || s.category === selectedCategory;
      return matchSearch && matchCat;
  });

  return (
    <div className="h-full w-full flex flex-col bg-[#020617] animate-fade-in overflow-hidden">
        <div className="flex-1 grid grid-cols-12 gap-1 p-2 h-full">
            {/* 左側：智慧聖典 (8/12) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-2 h-full overflow-hidden">
                <div className="glass-bento p-4 flex flex-col h-full border-white/5">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <h3 className="zh-main text-white">王道阿丹智慧聖典</h3>
                            <div className="uni-mini bg-celestial-gold text-black">CODEX_MAX</div>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                            <input 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="bg-black/40 border border-white/10 rounded-md pl-8 pr-3 py-1.5 text-[12px] text-white focus:border-celestial-gold outline-none w-48 transition-all"
                                placeholder="Search Codex..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4 shrink-0">
                        <button 
                            onClick={() => setSelectedCategory(null)}
                            className={`px-3 py-1 rounded text-[11px] font-bold border transition-all ${!selectedCategory ? 'bg-celestial-gold text-black border-celestial-gold' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'}`}
                        >
                            全部 (ALL)
                        </button>
                        {categories.map(cat => (
                            <button 
                                key={cat} 
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1 rounded text-[11px] font-bold border transition-all ${selectedCategory === cat ? 'bg-celestial-gold text-black border-celestial-gold' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                        {filteredScriptures.map((node) => (
                            <div key={node.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-lg group hover:border-celestial-gold/30 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-0.5 bg-celestial-gold text-black font-black rounded text-[9px]">{node.code}</span>
                                        <h4 className="zh-main text-gray-100">{node.title}</h4>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-800 group-hover:text-celestial-gold transition-all" />
                                </div>
                                <p className="zh-main text-[13px] text-gray-400 leading-relaxed italic border-l-2 border-white/5 pl-4">{node.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 右側：修煉動態 (4/12) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-2 h-full overflow-hidden">
                <div className="glass-bento p-6 flex-[2] flex flex-col justify-center gap-6 border-white/5 bg-slate-950/40">
                    <div className="space-y-4">
                        <div>
                            <span className="en-sub !text-[9px] text-emerald-500 mb-1 block">Neural_Resonance</span>
                            <div className="flex items-end justify-between mb-1.5">
                                <span className="zh-main text-3xl text-white font-mono">{soul.alignment}%</span>
                                <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${soul.alignment}%` }} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            <div className="p-3 bg-white/5 border border-white/5 rounded-lg flex items-center justify-between group hover:bg-white/[0.08]">
                                <div>
                                    <span className="en-sub !text-[8px] mb-0.5 block text-gray-600">XP_Mult</span>
                                    <span className="zh-main text-white">{expMultiplier.toFixed(2)}x</span>
                                </div>
                                <TrendingUp className="w-5 h-5 text-celestial-gold opacity-30 group-hover:opacity-100" />
                            </div>
                            <div className="p-3 bg-white/5 border border-white/5 rounded-lg flex items-center justify-between group hover:bg-white/[0.08]">
                                <div>
                                    <span className="en-sub !text-[8px] mb-0.5 block text-gray-600">Luck_Prob</span>
                                    <span className="zh-main text-emerald-400">{luckFactor.toFixed(2)}x</span>
                                </div>
                                <Sparkles className="w-5 h-5 text-emerald-500 opacity-30 group-hover:opacity-100" />
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-3 bg-celestial-gold text-black font-black rounded text-[11px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-amber-500/10">
                        Enter_Meditation
                    </button>
                </div>

                <div className="glass-bento p-4 flex-1 bg-black/40 border-white/5 overflow-hidden flex flex-col">
                    <h4 className="en-sub !text-[9px] mb-3 text-gray-600">Kernel_Dialogue</h4>
                    <div className="p-3 bg-white/5 border border-white/5 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-all">
                        <div className="p-2 bg-slate-900 rounded-md border border-celestial-gold/20"><MessageCircle className="w-4 h-4 text-celestial-gold" /></div>
                        <div className="flex-1">
                            <h5 className="zh-main text-[12px] text-gray-300">關於「共感領導力」辯論</h5>
                            <span className="en-sub !text-[8px] opacity-40">ADAN × KERNEL</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};