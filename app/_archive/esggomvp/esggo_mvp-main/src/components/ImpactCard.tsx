'use client';


import { motion } from 'framer-motion';
import {
    ShieldCheck,
    Zap,
    Activity,
    Fingerprint,
    Eye,
    PackageCheck,
    Lock,
    Link as LinkIcon
} from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { ICrossChainManifest } from '../core/omni-types';

export interface VirtueStats {
    zhi: number;
    ren: number;
    cheng: number;
    yong: number;
    jie: number;
    he: number;
}

interface ImpactCardProps {
    id: string;
    name: string;
    title: string;
    description: string;
    stats: VirtueStats;
    protocolStage: number; // 0-5
    imageUrl?: string;
    notarization?: ICrossChainManifest;
}

/**
 * 🎴 ImpactCard: The core unit of the Impact Village RPG.
 * Visualizing real ESG cases as "Truth Crystals" with Six Virtues.
 */
export default function ImpactCard({
    id,
    name,
    title,
    description,
    stats,
    protocolStage,
    imageUrl,
    notarization
}: ImpactCardProps) {
    const { t } = useLanguage();
    const v = t.impact_village.virtues;

    const protocolSteps = [
        { key: 'traceable', icon: <Fingerprint size={12} /> },
        { key: 'trackable', icon: <Activity size={12} /> },
        { key: 'transparent', icon: <Eye size={12} /> },
        { key: 'tangible', icon: <PackageCheck size={12} /> },
        { key: 'trustworthy', icon: <ShieldCheck size={12} /> },
    ];

    const isLocked = protocolStage === 5;

    return (
        <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            className={`relative w-full max-w-sm rounded-[2rem] overflow-hidden liquid-glass border transition-all duration-500 ${isLocked ? 'border-aqua/50 shadow-[0_0_40px_rgba(99,162,176,0.3)]' : 'border-white/10'
                }`}
        >
            {/* Card Background / Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/40 z-0" />

            {/* Header: ID & Name */}
            <div className="relative z-10 p-6 flex justify-between items-center bg-white/5 border-b border-white/10">
                <span className="text-[10px] font-black tracking-widest text-aqua/60 uppercase">
                    Crystal #{id}
                </span>
                <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">
                    {name}
                </span>
            </div>

            {/* Illustration / Image Placeholder */}
            <div className="relative z-10 h-48 bg-gradient-to-tr from-aqua/20 to-blue-500/10 flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                ) : (
                    <Zap size={64} className="text-aqua/20 animate-pulse" />
                )}

                {isLocked && (
                    <div className="absolute top-4 right-4 p-2 bg-aqua text-black rounded-lg shadow-lg">
                        <Lock size={16} />
                    </div>
                )}
            </div>

            {/* Content: Title & Desc */}
            <div className="relative z-10 p-6 space-y-4">
                <div>
                    <h3 className="text-xl font-black text-white tracking-tighter uppercase mb-1">{title}</h3>
                    <p className="text-[10px] text-aqua brightness-150 font-bold tracking-widest uppercase">Real-World Case</p>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                    {description}
                </p>

                {/* Virtue Radar (Simple List for MVP) */}
                <div className="grid grid-cols-3 gap-2 py-4 border-t border-white/5">
                    {[
                        { label: v.zhi, value: stats.zhi, color: 'text-blue-400' },
                        { label: v.ren, value: stats.ren, color: 'text-emerald-400' },
                        { label: v.cheng, value: stats.cheng, color: 'text-aqua' },
                        { label: v.yong, value: stats.yong, color: 'text-red-400' },
                        { label: v.jie, value: stats.jie, color: 'text-amber-400' },
                        { label: v.he, value: stats.he, color: 'text-purple-400' },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-[8px] text-gray-500 font-black uppercase mb-1">{stat.label}</span>
                            <span className={`text-sm font-black ${stat.color}`}>{stat.value}</span>
                        </div>
                    ))}
                </div>

                {/* 5T Protocol Journey */}
                <div className="flex items-center justify-between gap-1 pt-2">
                    {protocolSteps.map((step, i) => (
                        <div key={step.key} className="flex flex-col items-center gap-1 group/step">
                            <div className={`size-6 rounded-md flex items-center justify-center border transition-all ${protocolStage > i
                                ? 'bg-aqua text-black border-aqua shadow-[0_0_10px_rgba(99,162,176,0.5)]'
                                : 'bg-white/5 text-gray-600 border-white/10'
                                }`}>
                                {step.icon}
                            </div>
                        </div>
                    ))}
                    <div className="flex-1 ml-2 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(protocolStage / 5) * 100}%` }}
                            className="absolute inset-0 bg-aqua"
                        />
                    </div>
                </div>

                {/* Phase 18: Trust Anchor Notarization Badge */}
                {notarization && (
                    <div className="mt-4 p-2 bg-aqua/10 border border-aqua/20 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <LinkIcon size={10} className="text-aqua" />
                            <span className="text-[8px] font-black text-white uppercase tracking-tighter">Notarized</span>
                        </div>
                        <span className="text-[8px] font-mono text-aqua/80 truncate max-w-[100px]">{notarization.notarizationHash}</span>
                    </div>
                )}
            </div>

            {/* Success Reality Marker */}
            {isLocked && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-aqua animate-pulse" />
            )}
        </motion.div>
    );
}
