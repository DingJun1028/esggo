import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Sparkles, BookOpen, GraduationCap } from 'lucide-react';
import { useI18n } from '@/utils/i18n';


/**
 * 🎓 Dr. Thoth Teaching Guide
 * Implementation of "Service as Teaching" (服務即教學)
 */
interface DrThothGuideProps {
    resonance: number;
}

export const DrThothGuide: React.FC<DrThothGuideProps> = ({ resonance }) => {
    const { t } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');

    // 📝 Teaching Logic based on Resonance
    useEffect(() => {
        if (resonance === 100) {
            setMessage(t('myNorthStar.guide.instruction')); // Perfect
        } else if (resonance > 90) {
            setMessage('Excellent! You are almost perfectly aligned. Keep fine-tuning the sliders.');
        } else {
            setMessage(t('myNorthStar.guide.welcome') + ' ' + t('myNorthStar.guide.resonance'));
        }
    }, [resonance, t]);

    // Initial nudge
    useEffect(() => {
        const timer = setTimeout(() => setIsOpen(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-72 bg-slate-900/80 backdrop-blur-2xl border border-[#0ABAB5]/30 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group"
                    >
                        {/* Glass Sheen */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0ABAB5]/10 to-transparent pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-[#0ABAB5]/20 flex items-center justify-center border border-[#0ABAB5]/30 shadow-[0_0_15px_rgba(10,186,181,0.2)]">
                                        <GraduationCap className="w-5 h-5 text-[#0ABAB5]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-black text-white tracking-widest uppercase">Dr. Thoth</h3>
                                        <p className="text-[8px] text-[#0ABAB5] font-mono tracking-tighter uppercase">Essence Mentor</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white/10 rounded-full transition-colors group-hover:block hidden"
                                >
                                    <X className="w-3 h-3 text-slate-400" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="text-sm text-slate-200 leading-relaxed font-medium">
                                    "{message}"
                                </div>

                                <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-2">
                                    <div className="flex items-center gap-1">
                                        <Sparkles className="w-3 h-3 text-[#0ABAB5]" />
                                        <span className="text-[9px] text-[#0ABAB5] font-bold uppercase tracking-widest">Alignment Active</span>
                                    </div>
                                    <BookOpen className="w-3 h-3 text-slate-500" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${isOpen ? 'bg-[#0ABAB5] text-white' : 'bg-slate-900 border border-[#0ABAB5]/30 text-[#0ABAB5]'
                    } shadow-[0_0_30px_rgba(10,186,181,0.2)] relative`}
            >
                {isOpen ? <X /> : <MessageSquare />}
                {!isOpen && (
                    <motion.div
                        className="absolute -top-1 -right-1 w-4 h-4 bg-[#0ABAB5] rounded-full border-2 border-slate-950 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
                        <span className="text-[8px] font-black text-white">!</span>
                    </motion.div>
                )}
            </motion.button>
        </div>
    );
};
