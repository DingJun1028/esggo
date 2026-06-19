'use client';

import React, { useState, useEffect } from 'react';
import {
    Globe,
    Zap,
    Layers,
    Cpu,
    Database,
    Tag,
    Terminal,
    UserCheck,
    Search,
    BookOpen,
    Sparkles,
    ChevronRight,
    Loader2,
    RefreshCw,
    ShieldCheck,
    ExternalLink,
    Layout,
    Map,
    Briefcase,
    FileUp,
    FileDown,
    Link2
} from 'lucide-react';
import { IOmniNote } from "@/core/wuzuo-note";
import { IOmniAtom } from "@/core/omni-types";
import { UserKnowledgeBase } from "@/core/user-knowledge-base";
import { OmniKnowledgeBridge } from "@/core/omni-knowledge-bridge";
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    activeNote: IOmniNote | null;
    onAction?: (action: string, payload?: any) => void;
}

/**
 * 🔮 OmniYuantong (萬能圓通) - 全域整合閘道
 * 深度整合核心：[智庫][標籤][API][技能][MCP][代理][光球]
 * 貫徹「服務即教學，知識即資產」
 */
export const OmniYuantong: React.FC<Props> = ({ activeNote, onAction }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [summary, setSummary] = useState<string | null>(null);
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const [linkedKnowledge, setLinkedKnowledge] = useState<IOmniAtom<any>[]>([]);
    const [activeTab, setActiveTab] = useState<'insight' | 'universal' | 'bridge'>('insight');
    const [aiPosture, setAiPosture] = useState<'Idle' | 'Deep_Thinking' | 'Synthesizing'>('Idle');

    // 🌪️ 萬能洞悉核心邏輯 (Omni-Insight Engine)
    const handleAnalyze = async () => {
        if (!activeNote || !activeNote.content) return;

        if (onAction) {
            onAction('start-analyze', { note: activeNote });
        }

        setIsAnalyzing(true);
        setAiPosture('Deep_Thinking');

        try {
            // 這裡未來將串接真實的 /api/omni/ai/analyze 端點
            // 目前實作進階版啟發式邏輯，模擬「萬能光球」的思考
            await new Promise(resolve => setTimeout(resolve, 2500));

            setAiPosture('Synthesizing');

            // 1. 生成智能摘要 (Abstract Generation)
            const text = activeNote.content;
            const title = activeNote.title || 'Untitled';

            // 模擬分析結果
            const insights = [
                `這項妙計聚焦於「${title}」，內容核心在於對「${text.slice(0, 15)}...」的深層意識抽取。`,
                `建議將此資產與「萬能智庫」中的 ESG 核心規範進行跨域聯動。`,
                `偵測到關鍵概念的演化潛力，建議執行 5T 封印以固定價值。`
            ];
            setSummary(insights.join('\n\n'));

            // 2. 萬能標籤自動推論 (Semantic Tagging)
            const tags = ['#萬能洞悉', '#無作妙計', '#知識資產'];
            if (text.includes('ESG')) tags.push('#ESG_Core');
            if (text.includes('AI') || text.includes('萬能')) tags.push('#Omni_Intelligence');
            setSuggestedTags(tags);

            // 3. 聯動智庫 (Knowledge Base Linkage)
            const kb = UserKnowledgeBase.getLibrary();
            const relevant = kb.filter(atom =>
                atom.payload.title.toLowerCase().includes(title.toLowerCase()) ||
                tags.some(t => atom.tags?.some(at => at.semantic.includes(t.replace('#', ''))))
            );
            setLinkedKnowledge(relevant.length > 0 ? relevant.slice(0, 3) : kb.slice(0, 2));

            if (onAction) {
                onAction('finish-analyze', { summary: insights.join('\n\n'), tags });
            }

        } catch (error) {
            console.error("Omni-Insight error:", error);
        } finally {
            setIsAnalyzing(false);
            setAiPosture('Idle');
        }
    };

    useEffect(() => {
        if (activeNote) {
            // 切換筆記時自動清空前一次的洞悉內容
            setSummary(null);
            setSuggestedTags([]);
            setLinkedKnowledge([]);
        }
    }, [activeNote]);

    return (
        <div className="h-full w-full bg-black/40 backdrop-blur-3xl rounded-[32px] border border-white/10 flex flex-col overflow-hidden shadow-2xl relative">
            {/* 🌌 Omni-Orb Background Glow */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] transition-all duration-1000 ${aiPosture === 'Deep_Thinking' ? 'bg-purple-500/30 scale-150' :
                aiPosture === 'Synthesizing' ? 'bg-amber-500/30 scale-125' :
                    'bg-cyan-500/20'
                }`} />

            {/* Header: Omni-Orb & Title */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-transparent relative z-10">
                <div className="flex items-center gap-3">
                    <div className="relative group cursor-help">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 blur-[2px] ${isAnalyzing ? 'animate-spin-slow scale-110 shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'animate-pulse'
                            }`} />
                        <Globe className={`absolute inset-0 m-auto text-white ${isAnalyzing ? 'animate-spin' : ''}`} size={18} />

                        {/* Status Tooltip */}
                        <div className="absolute -bottom-8 left-0 scale-0 group-hover:scale-100 transition-transform origin-top-left bg-black/80 border border-white/10 rounded px-2 py-1 text-[8px] text-cyan-400 font-mono whitespace-nowrap">
                            AI POSTURE: {aiPosture}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-white tracking-[0.2em] uppercase">萬能圓通</h3>
                        <p className="text-[8px] text-cyan-400 font-bold uppercase tracking-widest opacity-60">Omni-Yuantong Gateway</p>
                    </div>
                </div>

                <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
                    <button
                        onClick={() => setActiveTab('insight')}
                        className={`px-3 py-1 rounded-full text-[9px] font-bold transition-all ${activeTab === 'insight' ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-white/40 hover:text-white'}`}
                    >
                        萬能洞悉
                    </button>
                    <button
                        onClick={() => setActiveTab('universal')}
                        className={`px-3 py-1 rounded-full text-[9px] font-bold transition-all ${activeTab === 'universal' ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-white/40 hover:text-white'}`}
                    >
                        全域連結
                    </button>
                    <button
                        onClick={() => setActiveTab('bridge')}
                        className={`px-3 py-1 rounded-full text-[9px] font-bold transition-all ${activeTab === 'bridge' ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-white/40 hover:text-white'}`}
                    >
                        知識橋接
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar relative z-10">
                {!activeNote ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                        <Zap size={32} className="mb-4 text-cyan-400" />
                        <p className="text-[10px] uppercase font-black tracking-widest leading-loose text-white">
                            以終為始 · 始終如一<br />無始無終 · 善向永續
                        </p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {activeTab === 'insight' ? (
                            <motion.div
                                key="insight"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                className="space-y-6"
                            >
                                {/* Summary Section */}
                                <section>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Sparkles size={14} className="text-amber-400" />
                                            <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest">智能洞悉 (Gnosis)</h4>
                                        </div>
                                        <button
                                            onClick={handleAnalyze}
                                            disabled={isAnalyzing}
                                            className="text-[9px] px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-all border border-cyan-500/20 flex items-center gap-2 group disabled:opacity-50"
                                        >
                                            {isAnalyzing ? <RefreshCw size={10} className="animate-spin" /> : <Zap size={10} className="group-hover:animate-pulse" />}
                                            {summary ? '重新洞悉' : '啟動洞悉'}
                                        </button>
                                    </div>

                                    <div className={`p-4 rounded-2xl border transition-all duration-500 ${isAnalyzing ? 'bg-cyan-500/5 border-cyan-500/20 blur-[1px]' : 'bg-white/[0.03] border-white/5'
                                        }`}>
                                        {isAnalyzing ? (
                                            <div className="h-24 flex flex-col items-center justify-center gap-3">
                                                <div className="flex gap-1">
                                                    {[0, 1, 2].map(i => (
                                                        <motion.div
                                                            key={i}
                                                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                                            className="w-1 h-1 rounded-full bg-cyan-400"
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-[8px] text-cyan-400/40 uppercase font-black tracking-[0.3em]">{aiPosture}...</span>
                                            </div>
                                        ) : summary ? (
                                            <div className="space-y-4">
                                                <p className="text-[11px] text-white/80 leading-relaxed font-light whitespace-pre-line border-l-2 border-cyan-500/30 pl-4 py-1">
                                                    {summary}
                                                </p>

                                                {/* Suggested Tags Area */}
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {suggestedTags.map(tag => (
                                                        <span
                                                            key={tag}
                                                            onClick={() => onAction?.('tag-click', tag)}
                                                            className="px-2 py-0.5 rounded-md bg-cyan-500/5 border border-cyan-500/20 text-[8px] font-mono text-cyan-400/70 hover:bg-cyan-500/10 cursor-pointer transition-colors"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-24 flex flex-col items-center justify-center text-center opacity-30">
                                                <Database size={20} className="mb-2 text-white/20" />
                                                <p className="text-[9px] text-white/40 uppercase font-bold tracking-widest">待命。點擊啟動萬能共鳴。</p>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Linked Knowledge Section */}
                                <section>
                                    <div className="flex items-center justify-between mb-3 px-1">
                                        <div className="flex items-center gap-2">
                                            <BookOpen size={14} className="text-purple-400" />
                                            <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest">關聯智庫 (Knowledge Nexus)</h4>
                                        </div>
                                        {linkedKnowledge.length > 0 && <span className="text-[8px] font-mono text-white/20">MATCHES: {linkedKnowledge.length}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        {linkedKnowledge.length > 0 ? linkedKnowledge.map(atom => (
                                            <motion.div
                                                key={atom.uuid}
                                                whileHover={{ x: 4 }}
                                                className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all flex items-center justify-between group cursor-pointer"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                                        <Database size={12} className="text-purple-400" />
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[10px] font-bold text-white/80 group-hover:text-purple-300 transition-colors">{atom.payload.title}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[7px] text-white/20 font-mono uppercase">AtomID: {atom.uuid.slice(0, 8)}</span>
                                                            <span className="w-0.5 h-0.5 rounded-full bg-white/10" />
                                                            <span className="text-[7px] text-purple-400/60 font-black uppercase tracking-widest">Verified</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight size={12} className="text-white/10 group-hover:text-purple-400 transition-all group-hover:translate-x-1" />
                                            </motion.div>
                                        )) : (
                                            <div className="py-8 flex flex-col items-center justify-center gap-2 border border-dashed border-white/5 rounded-[24px]">
                                                <Layers size={20} className="text-white/5" />
                                                <p className="text-[9px] text-white/10 uppercase font-black tracking-widest">知識尚未交織</p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="universal"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                className="grid grid-cols-2 gap-4"
                            >
                                {/* Universal Grid Items - Enhanced with real interactions */}
                                <UniversalItem
                                    icon={<Database size={16} />}
                                    label="萬能智庫"
                                    status="Live"
                                    color="bg-cyan-500/10 text-cyan-400"
                                    description="存取全域 ESG 原子資產"
                                    onClick={() => onAction?.('tool:kb')}
                                />
                                <UniversalItem
                                    icon={<Tag size={16} />}
                                    label="萬能標籤"
                                    status="Synced"
                                    color="bg-purple-500/10 text-purple-400"
                                    description="語意錨點與跨域連結"
                                    onClick={() => onAction?.('tool:tags')}
                                />
                                <UniversalItem
                                    icon={<Globe size={16} />}
                                    label="萬能API"
                                    status="Ready"
                                    color="bg-green-500/10 text-green-400"
                                    description="外部數據橋接與轉換"
                                    onClick={() => onAction?.('tool:api')}
                                />
                                <UniversalItem
                                    icon={<Zap size={16} />}
                                    label="萬能技能"
                                    status="Forgeable"
                                    color="bg-amber-500/10 text-amber-400"
                                    description="AI 代理任務鍛造與執行"
                                    onClick={() => onAction?.('tool:skills')}
                                />
                                <UniversalItem
                                    icon={<Terminal size={16} />}
                                    label="萬能MCP"
                                    status="Resonant"
                                    color="bg-blue-500/10 text-blue-400"
                                    description="模型上下文協定橋接"
                                    onClick={() => onAction?.('tool:mcp')}
                                />
                                <UniversalItem
                                    icon={<UserCheck size={16} />}
                                    label="萬能代理"
                                    status="Active"
                                    color="bg-rose-500/10 text-rose-400"
                                    description="協同代理共鳴與分工"
                                    onClick={() => onAction?.('tool:agents')}
                                />
                                <UniversalItem
                                    icon={<Layout size={16} />}
                                    label="萬能表格"
                                    status="4D_Glass"
                                    color="bg-fuchsia-500/10 text-fuchsia-400"
                                    description="智庫級結構化數據視圖"
                                    onClick={() => onAction?.('tool:table')}
                                />
                                <UniversalItem
                                    icon={<Map size={16} />}
                                    label="萬能時空"
                                    status="Mapping"
                                    color="bg-sky-500/10 text-sky-400"
                                    description="全域知識資產座標導航"
                                    onClick={() => onAction?.('tool:space')}
                                />
                                <UniversalItem
                                    icon={<Briefcase size={16} />}
                                    label="萬能資產"
                                    status="Verified"
                                    color="bg-orange-500/10 text-orange-400"
                                    description="永恒宮殿中的封印資產"
                                    onClick={() => onAction?.('tool:asset')}
                                />

                                {/* Full Row CTA: Omni-Orb Activation */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onAction?.('omni-orb-resonance')}
                                    className="col-span-2 mt-2 p-[1px] rounded-3xl bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-cyan-500/40 group cursor-pointer overflow-hidden"
                                >
                                    <div className="w-full h-full bg-black/80 rounded-3xl p-6 flex items-center justify-between group-hover:bg-black/60 transition-all">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[12px] font-black text-white uppercase tracking-[0.2em] group-hover:text-cyan-400 transition-colors">啟動全域圓通共鳴</span>
                                            <span className="text-[8px] text-white/30 uppercase font-mono tracking-widest">Execute Omni-Orb Resonator</span>
                                        </div>
                                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center relative">
                                            <Globe size={20} className="text-white group-hover:animate-spin-slow" />
                                            <div className="absolute inset-0 rounded-full border border-cyan-500/40 animate-ping opacity-20" />
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>

            {/* Footer: System Declaration & Verification */}
            <div className="px-6 py-5 border-t border-white/5 bg-black/40 flex items-center justify-between">
                <div className="flex items-center gap-2 opacity-30 group hover:opacity-100 transition-opacity">
                    <ShieldCheck size={10} className="text-cyan-400" />
                    <span className="text-[7px] font-black text-white uppercase tracking-[0.3em] whitespace-nowrap">以終為始 · 始終如一 · 無始無終 · 善向永續</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[8px] font-mono text-white/10 uppercase tracking-widest">Ver: 8.2.5</span>
                    <ExternalLink size={10} className="text-white/10" />
                </div>
            </div>
        </div>
    );
};

interface UniversalItemProps {
    icon: React.ReactNode;
    label: string;
    status: string;
    color: string;
    description: string;
    onClick?: () => void;
}

const UniversalItem = React.memo(({ icon, label, status, color, description, onClick }: UniversalItemProps) => (
    <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        onClick={onClick}
        className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all flex flex-col group cursor-pointer relative overflow-hidden"
    >
        {/* Hover Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className={`mb-4 w-10 h-10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${color}`}>
            {icon}
        </div>
        <div className="relative z-10 flex flex-col gap-1 text-left">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{label}</span>
            <span className="text-[8px] text-white/30 leading-tight group-hover:text-white/50 transition-colors">{description}</span>
        </div>

        <div className="mt-4 flex items-center gap-2 relative z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            <span className="text-[7px] font-mono text-white/40 uppercase tracking-widest group-hover:text-green-400 transition-colors">{status}</span>
        </div>
    </motion.div>
));

UniversalItem.displayName = 'UniversalItem';
