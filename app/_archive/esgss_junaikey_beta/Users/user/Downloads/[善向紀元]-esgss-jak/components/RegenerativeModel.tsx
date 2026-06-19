import React, { useState } from 'react';
import { Language, View } from '../types';
import { 
    Leaf, Target, Zap, Activity, Info, 
    Globe, Heart, Target as Narrative, Compass, 
    Microscope, TrendingUp, Layers, PenTool, 
    ArrowRight, CheckCircle2, Star, Sparkles, ShieldCheck
} from 'lucide-react';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useToast } from '../contexts/ToastContext';

export const RegenerativeModel: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [activeLayer, setActiveLayer] = useState<number>(0);

  const layers = [
    { id: 'idea', title: isZh ? '理念層 (Philosophy)' : 'Philosophy', desc: isZh ? '願景與文明敘事定義' : 'Narrative & Vision' },
    { id: 'strat', title: isZh ? '策略層 (Strategy)' : 'Strategy', desc: isZh ? '再生商模與定位' : 'Regen Business Model' },
    { id: 'inn', title: isZh ? '創新層 (Innovation)' : 'Innovation', desc: isZh ? '再生設計與產品' : 'Regen Design' },
    { id: 'learn', title: isZh ? '學習層 (Learning)' : 'Learning', desc: isZh ? '再生治理文化' : 'Regen Culture' },
    { id: 'regen', title: isZh ? '再生層 (Regen)' : 'Regenerative', desc: isZh ? '社會影響力與正向擴散' : 'Positive Impact' },
  ];

  const modules = [
    { id: 1, name: isZh ? '願景與文明敘事' : 'Civilization Narrative', icon: Narrative },
    { id: 2, name: isZh ? '創新商模與再生設計' : 'Regen Business Model', icon: Sparkles },
    { id: 3, name: isZh ? '多方利益創造' : 'Stakeholder Value', icon: Heart },
    { id: 4, name: isZh ? '再生治理與文化' : 'Regen Governance', icon: ShieldCheck },
    { id: 5, name: isZh ? '社會影響力' : 'Social Impact', icon: Globe },
    { id: 6, name: isZh ? '品牌與願景一致性' : 'Brand Alignment', icon: Compass },
    { id: 7, name: isZh ? '永續領導力' : 'Regen Leadership', icon: Target },
  ];

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden">
        <UniversalPageHeader 
            icon={Leaf}
            title={{ zh: 'ESG 再生模型分析', en: 'Regenerative ESG Model' }}
            description={{ zh: '透過創價型七大模組，打造能「再生」且具「文明價值」的永續策略', en: 'Creating Value & Civilization through Regenerative Design' }}
            language={language}
            tag={{ zh: '再生內核 v15.9', en: 'REGEN_CORE_V15.9' }}
        />

        <div className="flex-1 grid grid-cols-12 gap-8 min-h-0 overflow-hidden">
            {/* 左側：五層方法學 (5 Layers Visualization) */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 overflow-hidden">
                <div className="glass-bento p-10 flex flex-col bg-slate-900/60 border-emerald-500/20 rounded-[3rem] shadow-2xl h-full">
                    <h3 className="zh-main text-lg text-white mb-10 flex items-center gap-3 uppercase tracking-widest">
                        <Layers className="w-5 h-5 text-emerald-400" />
                        5-Layer Methodology
                    </h3>
                    <div className="flex-1 flex flex-col gap-3 justify-center">
                        {layers.reverse().map((layer, i) => (
                            <div 
                                key={layer.id}
                                onClick={() => setActiveLayer(i)}
                                className={`p-6 rounded-3xl border transition-all cursor-pointer group relative overflow-hidden
                                    ${activeLayer === i ? 'bg-emerald-500/20 border-emerald-500/50 scale-[1.05] z-10 shadow-2xl' : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100'}
                                `}
                                style={{ width: `${100 - (i * 8)}%`, alignSelf: 'center' }}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="zh-main text-base text-white">{layer.title}</div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{layer.desc}</div>
                                    </div>
                                    {activeLayer === i && <Star className="w-4 h-4 text-celestial-gold animate-pulse" />}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 p-5 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
                        <Info className="w-5 h-5 text-emerald-400 shrink-0" />
                        <p className="text-xs text-gray-400 leading-relaxed italic">
                            ESG Sunshine 專屬：從底層理念出發，層層堆疊出具備再生能力的組織系統。
                        </p>
                    </div>
                </div>
            </div>

            {/* 右側：七大分析模組 (7 Modules Analysis) */}
            <div className="col-span-12 lg:col-span-7 flex flex-col gap-6 overflow-hidden">
                <div className="flex-1 glass-bento p-10 bg-slate-900/40 border-white/5 rounded-[3rem] shadow-2xl overflow-y-auto no-scrollbar">
                    <div className="flex justify-between items-end mb-10">
                        <div className="space-y-2">
                             <h3 className="zh-main text-3xl text-white uppercase tracking-tighter">Regenerative Potential Analysis</h3>
                             <p className="text-gray-500 text-sm">{isZh ? '基於 135 項永續工具組之深度量測' : 'Deep Analytics via 135 Sustainability Tools'}</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-[10px] font-black text-gray-600 uppercase">System_Sync</div>
                            <div className="text-2xl font-mono font-bold text-emerald-400 tracking-widest">98.4%</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {modules.map((mod) => (
                            <div key={mod.id} className="p-6 bg-black/40 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-white/5 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
                                        <mod.icon className="w-6 h-6" />
                                    </div>
                                    <div className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black text-gray-500 uppercase">Module_0{mod.id}</div>
                                </div>
                                <h4 className="zh-main text-base text-white mb-4 group-hover:text-emerald-400 transition-colors leading-tight">{mod.name}</h4>
                                <div className="flex-1 flex flex-col gap-3">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-[10px]">
                                            <span className="text-gray-500 uppercase">Regen_Score</span>
                                            <span className="text-white font-mono">82%</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 opacity-60" style={{ width: '82%' }} />
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-gray-500 leading-relaxed font-light italic">
                                        偵測到高度系統正向性，建議強化「{mod.name}」之品牌敘事。
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 flex gap-6">
                         <button className="flex-1 py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-2xl">
                             <Sparkles className="w-5 h-5" /> {isZh ? '生成再生行動藍圖' : 'Generate Regen Roadmap'}
                         </button>
                         <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center gap-3">
                             <PenTool className="w-5 h-5" /> {isZh ? '導出文明敘事' : 'Export Narrative'}
                         </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
