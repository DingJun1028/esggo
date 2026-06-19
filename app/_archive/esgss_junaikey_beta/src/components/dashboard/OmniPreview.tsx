import React from 'react';
import { motion } from 'framer-motion';
import {
    Layout,
    Zap,
    ShieldCheck,
    Globe,
    Search,
    Download,
    Eye
} from 'lucide-react';
import { BentoCard } from '../ui/BentoCard';

interface OmniPreviewProps {
    data: {
        metrics: Array<{
            key: string;
            value: string | number;
            unit?: string;
            category: string;
            confidence: number;
        }>;
        frameworks?: string[];
        structuredContent: string;
        correlationScore: number;
    };
    onClose: () => void;
}

export const OmniPreview: React.FC<OmniPreviewProps> = ({ data, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-2xl"
        >
            <div className="w-full max-w-6xl max-h-full overflow-hidden bg-[#0a0f18] border border-white/10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col">
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                            <Eye className="text-aqua-500 w-6 h-6" />
                            數據採樣預覽 OmniPreview Snapshot
                        </h2>
                        <p className="text-white/40 text-xs font-light italic mt-1 uppercase tracking-widest">
                            5T Protocol Verification & Structured Insight Preview
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors"
                    >
                        Close [Esc]
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Major Insight */}
                        <div className="lg:col-span-8 flex flex-col gap-8">
                            <BentoCard title="結構化知識段落" subtitle="Structured Knowledge" icon={<Layout size={18} />}>
                                <div className="p-6 rounded-2xl bg-black/40 border border-white/5 font-serif italic text-white/80 leading-relaxed text-lg">
                                    {data.structuredContent}
                                </div>
                            </BentoCard>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <BentoCard title="識別框架" subtitle="ESG Frameworks" icon={<Globe size={18} />}>
                                    <div className="flex flex-wrap gap-3 pt-2">
                                        {data.frameworks && data.frameworks.length > 0 ? (
                                            data.frameworks.map(f => (
                                                <span key={f} className="px-4 py-2 rounded-xl bg-aqua-500/10 border border-aqua-500/30 text-aqua-400 font-black text-xs uppercase tracking-widest">
                                                    {f}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-white/20 italic text-xs">No frameworks identified.</span>
                                        )}
                                    </div>
                                </BentoCard>

                                <BentoCard title="誠信驗證" subtitle="Verification" icon={<ShieldCheck size={18} />}>
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="text-left">
                                            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1">Correlation</p>
                                            <p className="text-3xl font-black text-aqua-500">{(data.correlationScore * 100).toFixed(1)}%</p>
                                        </div>
                                        <div className="size-16 rounded-full border-4 border-aqua-500/20 flex items-center justify-center">
                                            <Search className="text-aqua-500 w-6 h-6" />
                                        </div>
                                    </div>
                                </BentoCard>
                            </div>
                        </div>

                        {/* Metrics Sidebar */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <BentoCard title="提取指標" subtitle="Metrics" icon={<Zap size={18} />}>
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {data.metrics.map((m, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-aqua-500/20 transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/40 text-[8px] font-black uppercase">{m.category}</span>
                                                <span className="text-[10px] text-aqua-500 font-bold">{(m.confidence * 100).toFixed(0)}%</span>
                                            </div>
                                            <h4 className="text-sm font-bold text-white mb-1">{m.key}</h4>
                                            <p className="text-lg font-black italic text-aqua-400">{m.value} <span className="text-[10px] not-italic text-white/40">{m.unit}</span></p>
                                        </div>
                                    ))}
                                </div>
                            </BentoCard>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t border-white/5 bg-white/[0.02] flex items-center justify-between gap-6">
                    <p className="text-white/20 text-[10px] italic">
                        * All preview data is temporary and must be crystallized to become a Knowledge Asset.
                    </p>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-colors">
                            <Download size={14} /> Export JSON
                        </button>
                        <button
                            onClick={onClose}
                            className="px-8 py-3 rounded-xl bg-aqua-500 text-black font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(0,255,255,0.3)] hover:scale-105 transition-all"
                        >
                            Accept & Continue
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0,255,255, 0.2);
                    border-radius: 10px;
                }
            `}</style>
        </motion.div>
    );
};
