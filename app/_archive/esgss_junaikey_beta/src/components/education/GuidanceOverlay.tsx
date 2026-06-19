import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, GraduationCap } from 'lucide-react';

interface GuidanceOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    learningPoints?: string[];
}

/**
 * GuidanceOverlay
 * ---------------
 * The "Sherpa" layer. 
 * Overlays the current view with educational context, explaining "Why this matters".
 * Implements "Service as Teaching".
 */
export const GuidanceOverlay: React.FC<GuidanceOverlayProps> = ({
    isOpen,
    onClose,
    title,
    description,
    learningPoints = []
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="w-full max-w-lg bg-[#0a1520] border border-[#00FFF0] shadow-[0_0_30px_rgba(0,255,240,0.2)] rounded-3xl overflow-hidden relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#00FFF0]/10 to-transparent p-6 border-b border-[#00FFF0]/20 flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className="p-3 bg-[#00FFF0]/20 rounded-xl text-[#00FFF0]">
                                    <GraduationCap size={24} />
                                </div>
                                <div>
                                    <h6 className="text-[#00FFF0] text-xs font-bold tracking-widest uppercase mb-1">Service is Teaching</h6>
                                    <h2 className="text-xl font-bold text-white">{title}</h2>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white/50 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-[#00FFF0]/80 text-sm font-semibold">
                                    <Lightbulb size={16} />
                                    <span>核心概念</span>
                                </div>
                                <p className="text-gray-300 leading-relaxed text-sm">
                                    {description}
                                </p>
                            </div>

                            {learningPoints.length > 0 && (
                                <div className="bg-[#00FFF0]/5 rounded-2xl p-4 border border-[#00FFF0]/10">
                                    <h5 className="text-white text-sm font-bold mb-3">關鍵學習點 (Key Takeaways)</h5>
                                    <ul className="space-y-2">
                                        {learningPoints.map((point, idx) => (
                                            <li key={idx} className="flex gap-2 text-sm text-gray-400">
                                                <span className="text-[#00FFF0] mt-1">•</span>
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-black/20 text-center">
                            <p className="text-[10px] text-gray-500 font-mono">ADK INTELLIGENT GUIDANCE SYSTEM v3.0</p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
