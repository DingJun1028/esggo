import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SovereignVisionService } from '@/1-service/SovereignVisionService';
import { IComponentCore } from '@/0-domain/contracts/IComponentCore';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

/**
 * 👁️ Vision Portal (v85)
 * --------------------------------------------------
 * Futuristic drop zone for the Sovereign Soul to "see" ESG evidence.
 */
export const VisionPortal: React.FC = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [lastInsight, setLastInsight] = useState<IComponentCore | null>(null);

    const handleSimulateInjest = async () => {
        setIsAnalyzing(true);
        try {
            // Simulate an image URL ingestion
            const mockUrl = `https://omni-vision.ai/evidence-${Math.random().toString(36).slice(7)}.jpg`;
            const insight = await SovereignVisionService.analyzeAndSeal(mockUrl, 'Sovereign_Portal_Ingest');
            setLastInsight(insight);
            omniLogger.info(LogCategory.SYSTEM, 'Vision Portal synthesized a new insight.', { uuid: insight.uuid });
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, 'Vision Portal failed to synthesize.', { error });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="relative group p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-3xl overflow-hidden transition-all hover:border-[#0df2df]/30">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#0df2df]/10 blur-[80px] group-hover:bg-[#0df2df]/20 transition-all" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className={`size-24 rounded-full border-2 border-dashed flex items-center justify-center transition-all ${isAnalyzing ? 'border-[#0df2df] animate-spin-slow' : 'border-white/20 group-hover:border-[#0df2df]/40'}`}>
                    <span className={`material-symbols-outlined text-4xl ${isAnalyzing ? 'text-[#0df2df] animate-pulse' : 'text-white/40 group-hover:text-[#0df2df]'}`}>
                        visibility
                    </span>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">Vision Portal</h3>
                    <p className="text-xs text-slate-500 italic max-w-[200px]">
                        Drop visual evidence here for the Sovereign Soul to analyze and seal.
                    </p>
                </div>

                <button
                    onClick={handleSimulateInjest}
                    disabled={isAnalyzing}
                    className="h-12 px-8 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#0df2df]/10 transition-all disabled:opacity-50"
                >
                    {isAnalyzing ? 'Analyzing Pattern...' : 'Simulate Visual Ingest'}
                </button>

                <AnimatePresence>
                    {lastInsight && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full pt-4 border-t border-white/5"
                        >
                            <div className="flex items-center justify-between text-[9px] uppercase font-black italic tracking-widest text-[#0df2df]">
                                <span>Insight Crystallized</span>
                                <span className="material-symbols-outlined text-[14px]">lock</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 truncate">
                                Hash: {lastInsight.evidence.trustworthy?.hash_lock.slice(0, 20)}...
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
        </div>
    );
};
