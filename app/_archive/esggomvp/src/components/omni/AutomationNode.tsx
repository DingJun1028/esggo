import React from 'react';
import { OmniIcon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';

export interface AutomationStatus {
    state: 'idle' | 'processing' | 'success' | 'error' | 'queued';
    message?: string;
    progress?: number;
}

interface AutomationNodeProps {
    status: AutomationStatus;
    onReset?: () => void;
    onTrigger?: () => void;
    className?: string;
    compact?: boolean;
}

/**
 * 🤖 AutomationNode
 * Manages the UI for automation status and triggers (Make/Boost.space integration).
 */
export const AutomationNode: React.FC<AutomationNodeProps> = ({
    status,
    onReset,
    onTrigger,
    className = '',
    compact = false
}) => {
    const getStatusConfig = () => {
        switch (status.state) {
            case 'processing':
            case 'queued':
                return { icon: 'Automation', color: 'text-omni-primary', bg: 'bg-omni-primary/10', label: 'Syncing...' };
            case 'success':
                return { icon: 'Success', color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Synchronized' };
            case 'error':
                return { icon: 'Error', color: 'text-rose-500', bg: 'bg-rose-500/10', label: 'Sync Failed' };
            default:
                return { icon: 'Automation', color: 'text-omni-text-muted', bg: 'bg-omni-surface-2', label: 'Trigger Sync' };
        }
    };

    const config = getStatusConfig();

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onTrigger}
                disabled={status.state === 'processing' || status.state === 'queued'}
                className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300
                    ${config.bg} border-omni-glass-border group
                    ${status.state === 'success' ? 'border-emerald-500/40' :
                        status.state === 'error' ? 'border-rose-500/40' :
                            'hover:border-omni-primary/40'}
                `}
            >
                <div className="relative">
                    <OmniIcon
                        name={config.icon as any}
                        size={14}
                        className={`${config.color} ${status.state === 'processing' ? 'animate-spin' : ''}`}
                    />
                    {status.state === 'processing' && (
                        <div className="absolute inset-0 bg-omni-primary/20 blur-sm rounded-full animate-pulse" />
                    )}
                </div>
                {!compact && (
                    <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>
                        {config.label}
                    </span>
                )}
            </motion.button>

            <AnimatePresence>
                {status.state !== 'idle' && !compact && (
                    <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        onClick={onReset}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-omni-text-muted transition-colors"
                    >
                        <OmniIcon name="History" size={12} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};
