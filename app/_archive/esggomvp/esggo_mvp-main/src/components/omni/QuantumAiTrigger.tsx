import React from 'react';
import { OmniIcon } from './icons';
import { motion } from 'framer-motion';

interface QuantumAiTriggerProps {
    onClick?: () => void;
    isLoading?: boolean;
    status?: 'idle' | 'analyzing' | 'success' | 'error';
    className?: string;
}

/**
 * 🎇 QuantumAiTrigger
 * A specialized trigger component for AI analysis with Liquid Glass aesthetics.
 */
export const QuantumAiTrigger: React.FC<QuantumAiTriggerProps> = ({
    onClick,
    isLoading = false,
    status = 'idle',
    className = ''
}) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            disabled={isLoading}
            className={`
                relative p-2 rounded-xl border transition-all duration-300 group
                ${status === 'success' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500' :
                    status === 'error' ? 'bg-rose-500/10 border-rose-500/40 text-rose-500' :
                        'bg-omni-surface-2 border-omni-glass-border text-omni-text-muted hover:text-omni-primary hover:border-omni-primary/40'}
                ${className}
            `}
        >
            {/* Sparkle background effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-omni-primary/20 to-transparent animate-pulse" />
                <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-omni-primary/20 to-transparent animate-pulse delay-75" />
            </div>

            <div className="relative z-10">
                {isLoading || status === 'analyzing' ? (
                    <div className="relative">
                        <OmniIcon name="Bot" size={16} className="animate-pulse" />
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="absolute -inset-1 border-t border-omni-primary/40 rounded-full"
                        />
                    </div>
                ) : (
                    <OmniIcon name="Bot" size={16} />
                )}
            </div>

            {/* Label for Tooltip (if integrated externally) */}
            <span className="sr-only">AI Analysis</span>
        </motion.button>
    );
};
