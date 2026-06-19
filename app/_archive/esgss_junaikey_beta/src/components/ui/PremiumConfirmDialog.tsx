import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Info, X } from 'lucide-react';

interface PremiumConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    options: {
        title: string;
        message: string;
        confirmLabel?: string;
        cancelLabel?: string;
        variant?: 'danger' | 'info' | 'success';
    };
}

export const PremiumConfirmDialog: React.FC<PremiumConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    options,
}) => {
    const {
        title,
        message,
        confirmLabel = 'ç¢ºè?',
        cancelLabel = '?–æ?',
        variant = 'info',
    } = options;

    const getIcon = () => {
        switch (variant) {
            case 'danger':
                return <AlertTriangle className="w-8 h-8 text-red-500" />;
            case 'success':
                return <ShieldCheck className="w-8 h-8 text-[#0ABAB5]" />;
            default:
                return <Info className="w-8 h-8 text-[#00FFFF]" />;
        }
    };

    const getAccentColor = () => {
        switch (variant) {
            case 'danger':
                return 'border-red-500/50 shadow-red-500/20';
            case 'success':
                return 'border-[#0ABAB5]/50 shadow-[#0ABAB5]/20';
            default:
                return 'border-[#00FFFF]/50 shadow-[#00FFFF]/20';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                    />

                    {/* Dialog Card */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className={`relative w-full max-w-md bg-slate-900/90 border-2 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-2xl ${getAccentColor()}`}
                    >
                        {/* Glossy Header FX */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8 pt-10 flex flex-col items-center text-center">
                            <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                                {getIcon()}
                            </div>

                            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-3 px-4">
                                {title}
                            </h3>

                            <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                {message}
                            </p>

                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all active:scale-95"
                                >
                                    {cancelLabel}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 transition-all active:scale-95 shadow-lg ${variant === 'danger'
                                        ? 'bg-red-500 hover:bg-red-400 shadow-red-500/20'
                                        : 'bg-[#0ABAB5] hover:bg-[#00FFFF] shadow-[#0ABAB5]/20'
                                        }`}
                                >
                                    {confirmLabel}
                                </button>
                            </div>
                        </div>

                        {/* Subtle Reflection FX */}
                        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

