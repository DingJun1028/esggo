import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle } from 'lucide-react';

interface TiffanyInputProps {
    label?: string;
    placeholder?: string;
    error?: string;
    value: string;
    onChange: (val: string) => void;
    className?: string;
}

export const TiffanyInput: React.FC<TiffanyInputProps> = ({
    label,
    placeholder,
    error,
    value,
    onChange,
    className = '',
}) => {
    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            {label && <label className="text-sm font-bold text-[var(--tiffany-text-secondary)] ml-1 uppercase tracking-widest">{label}</label>}

            <div className="relative group">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`
            w-full bg-[var(--tiffany-glass-bg)] backdrop-filter var(--tiffany-blur) border rounded-xl px-4 py-3 
            text-[var(--tiffany-text)] placeholder-[var(--tiffany-text-secondary)] outline-none transition-all duration-300
            ${error
                            ? 'border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.1)] focus:border-red-500/60'
                            : 'border-[var(--tiffany-border)] group-hover:border-[var(--tiffany-text)]/40 focus:border-[var(--tiffany-text)] shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]'}
          `}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-[#81D8D0]/50 transition-colors">
                    <Search className="w-4 h-4" />
                </div>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 text-red-400 text-xs mt-1 ml-1"
                    >
                        <AlertCircle className="w-3 h-3" />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
