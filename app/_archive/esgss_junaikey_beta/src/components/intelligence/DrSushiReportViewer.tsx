import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, Share2, Sparkles, ShieldCheck } from 'lucide-react';
import { DrSushiReport } from '../../services/MarketIntelligenceService';

interface DrSushiReportViewerProps {
    report: DrSushiReport | null;
    isOpen: boolean;
    onClose: () => void;
}

export const DrSushiReportViewer: React.FC<DrSushiReportViewerProps> = ({ report, isOpen, onClose }) => {
    if (!report) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-4xl max-h-[90vh] glass-panel border border-[#63a6b0]/30 rounded-[2.5rem] flex flex-col overflow-hidden bg-[#0f172a]/90 shadow-[0_0_50px_rgba(99,166,176,0.2)]"
                    >
                        {/* Header */}
                        <header className="p-8 border-b border-white/10 flex justify-between items-start bg-[#63a6b0]/10">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-[#63a6b0] flex items-center justify-center shadow-[0_0_20px_rgba(99,166,176,0.5)]">
                                    <Sparkles size={32} className="text-white animate-pulse" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black tracking-[0.2em] text-[#63a6b0] uppercase">Dr. Sushi Intelligence Report</span>
                                        <div className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-[8px] font-black text-emerald-400 uppercase tracking-widest">
                                            5T Verified
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-black text-white tracking-tight">{report.title}</h2>
                                    <div className="flex items-center gap-4 mt-2 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                                        <span>Type: {report.type}</span>
                                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                                        <span>Created: {new Date(report.created_at).toLocaleString()}</span>
                                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                                        <span>ID: {report.id.substring(0, 8)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="p-3 hover:bg-white/10 rounded-xl transition-all text-white/60 hover:text-[#63a6b0]">
                                    <Download size={20} />
                                </button>
                                <button className="p-3 hover:bg-white/10 rounded-xl transition-all text-white/60 hover:text-[#63a6b0]">
                                    <Share2 size={20} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-3 hover:bg-[#ff4d4d]/20 rounded-xl transition-all text-white/60 hover:text-[#ff4d4d]"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </header>

                        {/* Content Body */}
                        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                            <div className="max-w-3xl mx-auto space-y-12">
                                {report.content.map((section, idx) => (
                                    <motion.section
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="relative"
                                    >
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="h-px flex-1 bg-gradient-to-r from-[#63a6b0]/50 to-transparent" />
                                            <h3 className="text-lg font-black text-[#63a6b0] uppercase tracking-[0.1em]">{section.heading}</h3>
                                        </div>
                                        <div className="text-white/80 leading-relaxed text-base font-medium whitespace-pre-wrap pl-4 border-l-2 border-[#63a6b0]/20">
                                            {section.content}
                                        </div>
                                    </motion.section>
                                ))}

                                {/* Footer Insight */}
                                <div className="p-8 rounded-3xl bg-[#ffd700]/5 border border-[#ffd700]/20 relative overflow-hidden mt-16">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <ShieldCheck size={80} className="text-[#ffd700]" />
                                    </div>
                                    <h4 className="text-xs font-black text-[#ffd700] uppercase tracking-widest mb-2">博士終極洞察 (Doctoral Final Insight)</h4>
                                    <p className="text-sm text-white/70 italic leading-relaxed">
                                        「本質提純並非僅是數據的過濾，而是靈魂的淬鍊。我們所建立的每一份資產，都必須在永續的長河中經得起時間的洗刷。」
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <footer className="px-8 py-4 bg-black/40 border-t border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">
                                <Sparkles size={12} className="text-[#63a6b0]" />
                                Powered by JunAiKey "Dr. Sushi" Persona
                            </div>
                            <div className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">
                                Security Protocol: 5T-SENTIENT-V1
                            </div>
                        </footer>
                    </motion.div>
                </div>
            )}

            <style>{`
        .glass-panel {
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 166, 176, 0.3);
          border-radius: 10px;
        }
      `}</style>
        </AnimatePresence>
    );
};
