"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';

export interface ComicPanel {
    id: string;
    title: string;
    description: string;
    color: 'primary' | 'accent' | 'danger' | 'success';
}

interface OmniComicStripProps {
    panels: [ComicPanel, ComicPanel, ComicPanel, ComicPanel];
    className?: string;
}

/**
 * 🖼️ OmniComicStrip: 4-Panel Teaching Guide (四格教學導引)
 * 
 * 核心機制：以四格漫畫的形式，視覺化說明當前服務遭遇的痛點、解決方案、執行過程與最終成果。
 * 貫徹「服務即教學」的理念，降低使用者的認知門檻。
 */
export const OmniComicStrip: React.FC<OmniComicStripProps> = ({ panels, className = '' }) => {

    const colorMap = {
        primary: 'text-[#63a6b0] bg-[#63a6b0]/10 border-[#63a6b0]/30',
        accent: 'text-[#ffd700] bg-[#ffd700]/10 border-[#ffd700]/30',
        danger: 'text-[#F5222D] bg-[#F5222D]/10 border-[#F5222D]/30',
        success: 'text-[#52C41A] bg-[#52C41A]/10 border-[#52C41A]/30',
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative ${className}`}
        >
            {/* Connecting Lines for Desktop */}
            <div className="hidden lg:block absolute top-[40%] left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-slate-200 -z-10" />

            {panels.map((panel, index) => {
                const colorTheme = colorMap[panel.color] || colorMap.primary;
                return (
                    <motion.div key={panel.id} variants={itemVariants} className="relative group">
                        <LiquidGlassContainer className="h-full p-5 flex flex-col items-center text-center space-y-4 hover:-translate-y-2 transition-transform duration-300">

                            <div className={`absolute top-2 left-2 text-[10px] font-black border rounded-full size-5 flex items-center justify-center ${colorTheme}`}>
                                {index + 1}
                            </div>

                            <div>
                                <h3 className="text-sm font-black text-slate-900 tracking-tight leading-tight">{panel.title}</h3>
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                    {panel.description}
                                </p>
                            </div>

                        </LiquidGlassContainer>

                        {/* Arrow between panels */}
                        {index < panels.length - 1 && (
                            <div className="hidden lg:flex absolute -right-4 top-[40%] text-slate-300 -translate-y-1/2 z-10">
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <ArrowRight size={20} />
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                );
            })}
        </motion.div>
    );
};
