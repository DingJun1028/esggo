import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Check, Zap } from 'lucide-react';

interface TiffanyButtonProps {
    variant?: 'primary' | 'secondary' | 'locked';
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

export const TiffanyButton: React.FC<TiffanyButtonProps> = ({
    variant = 'primary',
    children,
    onClick,
    className = '',
    disabled = false,
}) => {
    const isLocked = variant === 'locked' || disabled;

    const baseStyles = "relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 active:scale-95";

    const variants = {
        primary: "bg-[#81D8D0] text-slate-950 shadow-[0_0_20px_var(--tiffany-glow)] border border-white/30 hover:shadow-[0_0_30px_var(--tiffany-glow)]",
        secondary: "bg-[var(--tiffany-glass-bg)] backdrop-filter var(--tiffany-blur) border border-[var(--tiffany-border)] text-[var(--tiffany-text)] hover:bg-[var(--tiffany-border)] shadow-lg",
        locked: "bg-slate-900/20 backdrop-filter var(--tiffany-blur) text-slate-500 border border-white/5 cursor-not-allowed grayscale",
    };

    return (
        <motion.button
            whileHover={!isLocked ? { y: -2 } : {}}
            onClick={!isLocked ? onClick : undefined}
            disabled={isLocked}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {variant === 'primary' && <Zap className="w-4 h-4" />}
            {variant === 'secondary' && <Check className="w-4 h-4" />}
            {variant === 'locked' && <Lock className="w-4 h-4" />}
            <span>{children}</span>

            {!isLocked && (
                <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
            )}
        </motion.button>
    );
};
