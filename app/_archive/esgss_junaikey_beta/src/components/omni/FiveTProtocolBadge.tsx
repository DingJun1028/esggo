import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Eye, Database, FileDigit, Fingerprint, Lock } from 'lucide-react';
import { FiveTCertification } from '@/types/omniTag';

interface FiveTProtocolBadgeProps {
    certification?: FiveTCertification;
    size?: 'sm' | 'md' | 'lg';
    showLabels?: boolean;
    variant?: 'active' | 'standby' | 'disabled';
}

/**
 * FiveTProtocolBadge: Visual representation of the 5T Protocol Certification.
 */
const FiveTProtocolBadge: React.FC<FiveTProtocolBadgeProps> = ({
    certification,
    size = 'md',
    showLabels = false,
    variant = 'active'
}) => {
    const defaultCert: FiveTCertification = {
        tangible: variant === 'active',
        traceable: variant === 'active',
        trackable: variant === 'active',
        transparent: variant === 'active',
        trustworthy: variant === 'active',
    };

    const cert = certification || defaultCert;

    const items = [
        { id: 'tangible', label: 'T1', title: 'Tangible', icon: Eye, active: variant !== 'disabled' && cert.tangible, color: 'text-blue-400' },
        { id: 'traceable', label: 'T2', title: 'Traceable', icon: Database, active: variant !== 'disabled' && cert.traceable, color: 'text-indigo-400' },
        { id: 'trackable', label: 'T3', title: 'Trackable', icon: FileDigit, active: variant !== 'disabled' && cert.trackable, color: 'text-purple-400' },
        { id: 'transparent', label: 'T4', title: 'Transparent', icon: Fingerprint, active: variant !== 'disabled' && cert.transparent, color: 'text-rose-400' },
        { id: 'trustworthy', label: 'T5', title: 'Trustworthy', icon: Lock, active: variant !== 'disabled' && cert.trustworthy, color: 'text-amber-400' },
    ];

    const iconSize = size === 'sm' ? 10 : size === 'lg' ? 16 : 12;

    return (
        <div className={`inline-flex items-center gap-1 p-1 rounded-full bg-slate-950/40 border border-white/10 backdrop-blur-md`}>
            <div className="flex -space-x-1 px-1">
                {items.map((item) => (
                    <div
                        key={item.id}
                        title={`${item.title}: ${item.active ? 'Verified' : 'Pending'}`}
                        className={`
                            relative w-6 h-6 rounded-full flex items-center justify-center border transition-all
                            ${item.active
                                ? `bg-slate-900 border-white/20 ${item.color}`
                                : 'bg-slate-950 border-white/5 text-slate-700'}
                        `}
                    >
                        <item.icon size={iconSize} className={item.active ? 'opacity-100' : 'opacity-20'} />
                        {item.active && (
                            <motion.div
                                layoutId={`pulse-${item.id}`}
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity, delay: Math.random() }}
                                className="absolute inset-x-0 inset-y-0 rounded-full bg-current opacity-10"
                            />
                        )}
                    </div>
                ))}
            </div>

            {showLabels && (
                <div className="flex items-center gap-2 px-2 border-l border-white/10 ml-1">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span className="text-[10px] font-black text-white tracking-widest uppercase">5T Certified</span>
                </div>
            )}
        </div>
    );
};

export default FiveTProtocolBadge;
