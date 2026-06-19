
import React, { useState } from 'react';
import { 
    FileCode, ShieldCheck, Zap, Layers, Cpu, Globe, 
    Database, Activity, Target, Crown, Sparkles, Binary,
    Flame, Code2, Network, Fingerprint, Layout, MessageSquare,
    Box, GitCommit, Settings, Terminal, ShieldAlert, Rocket,
    Braces, ListTree, Share2, Download, Link, ArrowUpRight, Search
} from 'lucide-react';
import { Language } from '../types';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useToast } from '../contexts/ToastContext';

interface TechSpecCardProps {
    title: string;
    icon: any;
    color: string;
    children: React.ReactNode;
    tag?: string;
}

// Added comment above fix: explicitly typed as React.FC to handle children prop correctly and prevent TS missing property error
const TechSpecCard: React.FC<TechSpecCardProps> = ({ title, icon: Icon, color, children, tag }) => (
    <div className={`glass-bento p-6 flex flex-col bg-slate-900/60 border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:border-${color}-500/30 transition-all h-full`}>
        <div className={`absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform text-${color}-400`}>
            <Icon className="w-32 h-32" />
        </div>
        <div className="flex justify-between items-center mb-6 shrink-0 relative z-10">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-${color}-500/20 text-${color}-400`}>
                    <Icon className="w-4 h-4" />
                </div>
                <h4 className="zh-main text-sm text-white uppercase tracking-widest">{title}</h4>
            </div>
            {tag && <div className={`uni-mini !bg-black/60 !text-${color}-400 border-${color}-500/20 px-2 !text-[7px]`}>{tag}</div>}
        </div>
        <div className="flex-1 min-h-0 relative z-10 overflow-hidden">
            {children}
        </div>
    </div>
);

export const TechnicalWhitepaper: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';
    const { addToast } = useToast();
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const handleDownload = () => {
        addToast('info', isZh ? '正在編譯 2026 最終進化版技術聖典...' : 'Compiling 2026 Final Evolution Tech Codex...', 'Codex');
    };

    return (
        <div className="h-full flex flex-col space-y-4 animate-fade-in overflow-hidden relative pb-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="shrink-0">
                <UniversalPageHeader 
                    icon={FileCode}
                    title={{ zh: '2026 專案完全技術規格聖典', en: '2026 Project Technical Compendium' }}
                    description={{ zh: '全知之眼 · 萬能內核 · 永恆架構規範', en: 'All-Seeing Eye: Omnipotent Kernel Technical Specs.' }}
                    language={language}
                    tag={{ zh: '核心白皮書 v16.1', en: 'CORE_WHITEPAPER_v16.1' }}
                />
            </div>

            {/* 四象限佈局：預設即巔峰，一覽無遺 */}
            <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden relative">
                
                {/* 1. 核心骨架 (NW) */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
                    <TechSpecCard title={isZh ? "系統支柱" : "ARCH_PILLARS"} icon={Layers} color="emerald" tag="MECE_SYNC">
                        <div className="space-y-3">
                            {[
                                { t: '聖典審查', d: 'RAG 萬能智庫 (95%+ 召回)', i: GitCommit },
                                // Added comment above fix: correctly using imported Link icon
                                { t: '契約鑄造', d: 'API 符文系統 (Flowlu 集成)', i: Link },
                                { t: '神使架構', d: 'Agentic Workflow (50+ 任務)', i: Network }
                            ].map((item, i) => (
                                <div key={i} className="p-3 bg-black/40 rounded-xl border border-white/5 group-hover:border-emerald-500/20 transition-all">
                                    <div className="flex items-center gap-3 mb-1">
                                        <item.i className="w-3.5 h-3.5 text-emerald-500" />
                                        <span className="zh-main text-xs text-white">{item.t}</span>
                                    </div>
                                    <p className="text-[9px] text-gray-500 font-light">{item.d}</p>
                                </div>
                            ))}
                        </div>
                    </TechSpecCard>
                </div>

                {/* 2. 邏輯靈魂與中心聖典 (MID) */}
                <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
                    <div className="flex-1 glass-bento bg-slate-950/80 border-celestial-gold/30 rounded-[3rem] p-10 shadow-[0_0_80px_rgba(251,191,36,0.05)] relative overflow-hidden flex flex-col">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.08)_0%,transparent_70%)]" />
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-8">
                                <div className="space-y-1">
                                    <h3 className="zh-main text-4xl text-white tracking-tighter uppercase leading-none">The Great Compendium</h3>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="w-2 h-2 rounded-full bg-celestial-gold animate-pulse" />
                                        <span className="en-sub !mt-0 text-celestial-gold font-black !text-[8px]">OMNI_KERNEL_AUTHORITY_L16.1</span>
                                    </div>
                                </div>
                                <button onClick={handleDownload} className="p-4 bg-white text-black rounded-2xl hover:bg-celestial-gold transition-all shadow-xl active:scale-95 group/btn">
                                    <Download className="w-6 h-6 group-hover/btn:animate-bounce" />
                                </button>
                            </div>

                            <div className="flex-1 bg-black/40 rounded-[2.5rem] border border-white/5 p-8 overflow-y-auto no-scrollbar relative shadow-inner">
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <h4 className="zh-main text-xl text-celestial-gold mb-4 border-l-4 border-celestial-gold pl-4">第一章：核心哲學</h4>
                                    <p className="text-gray-300 leading-relaxed italic text-lg font-light mb-8">
                                        「我們不編寫代碼，我們締結神聖架構契約。在數據熵增的混沌中，JunAiKey 是唯一指向永續的北極星。」
                                    </p>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Logic_Folding</div>
                                            <p className="text-xs text-gray-400">所有冗餘資訊自動壓縮為具備文明價值的知識碎片。</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Entropy_Purge</div>
                                            <p className="text-xs text-gray-400">每週自動修復 10% 技術債，確保內核穩定運行。</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-between items-center px-4">
                                <div className="flex gap-8">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-gray-600 uppercase">Integrity_Hash</span>
                                        <span className="text-xs font-mono text-emerald-500">0x8B32...F02</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-gray-600 uppercase">Security_Seal</span>
                                        <span className="text-xs font-bold text-white flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-emerald-400"/> VALIDATED</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
                                    <Zap className="w-3 h-3 text-celestial-gold" />
                                    <span className="text-[9px] font-black text-gray-500 uppercase">Resonance: 99.9%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. 視覺面相 (SW) */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
                    <TechSpecCard title={isZh ? "視覺奧義" : "VISUAL_MANIFESTO"} icon={Layout} color="purple" tag="DESIGN_TOKEN">
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden">
                                <div className="text-[9px] font-black text-gray-500 uppercase mb-3 tracking-widest">Interface_Logic</div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center"><span className="text-[10px] text-gray-400">Bento Box 佈局</span><span className="text-[8px] text-purple-400 font-mono">GRID_MECE</span></div>
                                    <div className="flex justify-between items-center"><span className="text-[10px] text-gray-400">Glassmorphism</span><span className="text-[8px] text-purple-400 font-mono">BLUR_20PX</span></div>
                                    <div className="flex justify-between items-center"><span className="text-[10px] text-gray-400">428 浮動鍵</span><span className="text-[8px] text-purple-400 font-mono">QUICK_ACT</span></div>
                                </div>
                            </div>
                            <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-2xl">
                                <div className="flex items-center gap-2 mb-2"><Activity className="w-3 h-3 text-purple-400" /><span className="text-[10px] font-black text-white uppercase">Neural_Pulse_Color</span></div>
                                <div className="flex gap-2">
                                    {['emerald', 'gold', 'blue', 'purple'].map(c => <div key={c} className={`w-4 h-4 rounded-full bg-${c === 'gold' ? 'amber' : c}-500 shadow-lg`} />)}
                                </div>
                            </div>
                        </div>
                    </TechSpecCard>

                    <TechSpecCard title={isZh ? "生態共鳴" : "ECO_RESONANCE"} icon={Globe} color="blue" tag="AFFILIATE_v1">
                         <div className="space-y-3">
                            {[
                                { n: '山衛科技', d: '工業安全數據餵口', i: Microscope },
                                { n: '墾趣永續', d: '無痕山林教育路徑', i: Mountain }
                            ].map((p, i) => (
                                <div key={i} className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between group-hover:border-blue-500/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <p.i className="w-5 h-5 text-blue-400" />
                                        <div>
                                            <div className="zh-main text-xs text-white">{p.n}</div>
                                            <div className="text-[8px] text-gray-600">{p.d}</div>
                                        </div>
                                    </div>
                                    {/* Added comment above fix: correctly using imported ArrowUpRight icon */}
                                    <ArrowUpRight className="w-3 h-3 text-gray-800 group-hover:text-blue-400" />
                                </div>
                            ))}
                            <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
                                <div className="text-xl font-mono font-bold text-white">15% GWC</div>
                                <div className="text-[8px] text-blue-400 font-black uppercase">Standard_Sharing_Ratio</div>
                            </div>
                         </div>
                    </TechSpecCard>
                </div>

            </div>

            {/* Bottom Global HUD: 最終穩定性指示器 */}
            <div className="h-10 shrink-0 glass-panel bg-black/60 border border-white/5 rounded-2xl flex items-center justify-between px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_5s_infinite]" />
                <div className="flex items-center gap-8 relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Aeterna_Codex_Synced</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Terminal className="w-3 h-3 text-gray-600" />
                        <span className="text-[9px] font-mono text-gray-600 uppercase">Build: JAK_2026_FINAL_EVO</span>
                    </div>
                </div>
                <div className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] relative z-10">© 2026 JunAiKey_Omni_OS • Technical Documentation Authority L1</div>
            </div>
        </div>
    );
};

const Mountain = (props: any) => <Globe {...props} />;
// Added comment above fix: correctly using imported Search icon
const Microscope = (props: any) => <Search {...props} />;
