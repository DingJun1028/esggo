'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Zap, Activity } from 'lucide-react';

interface MangaPanel {
    id: number;
    src: string;
    title: string;
    description: string;
    pill: string;
}

interface OmniMangaTutorialProps {
    panels: MangaPanel[];
    title: string;
    subtitle?: string;
}

export const OmniMangaTutorial: React.FC<OmniMangaTutorialProps> = ({ panels, title, subtitle }) => {
    return (
        <div className="mb-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-[#63a6b0] to-transparent rounded-full" />
                <div>
                    <h3 className="text-lg font-black text-[var(--theme-text-main)] flex items-center gap-2">
                        {title}
                        <Sparkles size={16} className="text-[#ffd700]" />
                    </h3>
                    {subtitle && <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{subtitle}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {panels.map((panel, index) => (
                    <motion.div
                        key={panel.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative flex flex-col gap-3"
                    >
                        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/20 shadow-xl group-hover:shadow-[0_0_20px_rgba(99,166,176,0.2)] transition-all bg-[var(--theme-surface-2)]">
                            <Image
                                src={panel.src}
                                alt={panel.title}
                                fill
                                unoptimized
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[8px] font-black rounded uppercase tracking-widest">
                                Panel {panel.id}
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1">
                                <div className="px-2 py-0.5 bg-[#63a6b0]/80 backdrop-blur-md text-white text-[8px] font-black rounded uppercase tracking-widest border border-white/20">
                                    {panel.pill}
                                </div>
                            </div>
                            {/* 5T Badge overlay on hover */}
                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-1 text-[8px] text-white/80 font-bold">
                                    <ShieldCheck size={10} className="text-[#52C41A]" />
                                    <span>5T PROTOCOL VERIFIED</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-black text-gray-800 mb-1 leading-tight">{panel.title}</h4>
                            <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                                {panel.description}
                            </p>
                        </div>

                        {/* Connection arrow for desktop */}
                        {index < 3 && (
                            <div className="hidden md:block absolute -right-3 top-1/3 z-10 text-[#63a6b0]/20">
                                <Zap size={12} className="rotate-90 animate-pulse" />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
            
            <div className="mt-6 flex justify-center">
                <div className="px-4 py-1.5 rounded-full bg-[#63a6b0]/5 border border-[#63a6b0]/10 flex items-center gap-2">
                    <Activity size={12} className="text-[#63a6b0] animate-pulse" />
                    <span className="text-[10px] text-gray-400 font-black tracking-widest uppercase">了解機制後，即可開啟自主運轉</span>
                </div>
            </div>
        </div>
    );
};
