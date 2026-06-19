'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Scroll, Sparkles, Quote, MapPin } from 'lucide-react';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';

interface StoryProps {
    title: string;
    location: string;
    content: string;
    impact: string;
    timestamp: string;
}

/**
 * 📜 ImpactStory: 永續敘事組件
 * 以敘事手法展示 5T 驗證後的 ESG 故事。
 */
export const ImpactStory: React.FC<StoryProps> = ({ title, location, content, impact, timestamp }) => {
    return (
        <LiquidGlassContainer className="p-8 group relative overflow-hidden bg-omni-surface-2 border-omni-glass-border rounded-[2.5rem]">
            {/* Decorative Quote Icon */}
            <div className="absolute top-6 right-8 text-omni-primary/10 group-hover:text-omni-primary/20 transition-colors">
                <Quote size={80} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-2xl bg-omni-primary/10 text-omni-primary">
                        <Scroll size={20} />
                    </div>
                    <div className="flex flex-col">
                        <h4 className="text-xl font-black text-omni-text-main group-hover:text-omni-primary transition-colors uppercase tracking-tight">
                            {title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                            <MapPin size={10} className="text-omni-text-muted" />
                            <span className="text-[10px] font-bold text-omni-text-muted uppercase tracking-widest">{location} | {timestamp}</span>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <p className="text-sm leading-relaxed text-omni-text-main font-medium opacity-90">
                        {content}
                    </p>
                </div>

                <div className="pt-6 border-t border-omni-glass-border flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-omni-accent" />
                            <span className="text-[11px] font-black text-omni-accent uppercase tracking-[0.2em]">
                                Key Impact Achievement
                            </span>
                        </div>
                        <div className="p-1 px-3 rounded-xl bg-omni-accent/10 border border-omni-accent/30 text-[9px] font-black text-omni-accent uppercase tracking-widest">
                            5T Verified
                        </div>
                    </div>
                    
                    <div className="p-4 rounded-2xl bg-omni-accent/5 border border-omni-accent/10">
                        <p className="text-xs font-bold text-omni-accent/90 italic leading-snug">
                            "{impact}"
                        </p>
                    </div>
                </div>
            </div>
        </LiquidGlassContainer>
    );
};
