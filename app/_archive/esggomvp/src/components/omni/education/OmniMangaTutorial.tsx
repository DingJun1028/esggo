"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, CheckCircle, Lock, Eye, Search, Globe } from 'lucide-react';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';

export interface MangaPanel {
    id: string;
    title: string;
    titleEn: string;
    description: string;
    illustration?: string; // AI-generated image URL
    color: 'primary' | 'accent' | 'danger' | 'success' | 'warning';
    /** 5T 驗算指標 */
    indicators?: {
        tangible?: boolean;
        traceable?: boolean;
        trackable?: boolean;
        transparent?: boolean;
        trustworthy?: boolean;
    };
}

interface OmniMangaTutorialProps {
    panels: [MangaPanel, MangaPanel, MangaPanel, MangaPanel];
    className?: string;
    title?: string;
    subtitle?: string;
}

/**
 * 🖼️ OmniMangaTutorial: 四格漫畫服務教學 (Four-Panel Service Tutorial)
 * 
 * 秉持「服務即教學」的核心信念，為每個核心組件/頁面導入四格漫畫先導圖。
 * 支援：
 * - framer-motion 进场动画
 * - AI 生成插图
 * - 5T 驗算指標展示
 * 
 * 主题：上善若水 (The highest good is like water)
 */
export const OmniMangaTutorial: React.FC<OmniMangaTutorialProps> = ({ 
    panels, 
    className = '',
    title = '四格服務指南',
    subtitle = 'Four-Panel Service Guide'
}) => {

    const colorMap = {
        primary: {
            bg: 'bg-gradient-to-br from-cyan-500/20 to-blue-600/10',
            border: 'border-cyan-500/30',
            text: 'text-cyan-400',
            dot: 'bg-cyan-400'
        },
        accent: {
            bg: 'bg-gradient-to-br from-amber-500/20 to-yellow-600/10',
            border: 'border-amber-500/30',
            text: 'text-amber-400',
            dot: 'bg-amber-400'
        },
        danger: {
            bg: 'bg-gradient-to-br from-rose-500/20 to-red-600/10',
            border: 'border-rose-500/30',
            text: 'text-rose-400',
            dot: 'bg-rose-400'
        },
        success: {
            bg: 'bg-gradient-to-br from-emerald-500/20 to-green-600/10',
            border: 'border-emerald-500/30',
            text: 'text-emerald-400',
            dot: 'bg-emerald-400'
        },
        warning: {
            bg: 'bg-gradient-to-br from-violet-500/20 to-purple-600/10',
            border: 'border-violet-500/30',
            text: 'text-violet-400',
            dot: 'bg-violet-400'
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            transition: { 
                type: 'spring', 
                stiffness: 180, 
                damping: 22 
            } 
        }
    };

    // 5T 指標圖標
    const T5Icon = ({ active, label }: { active: boolean; label: string }) => (
        <div 
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] ${
                active 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-slate-700/50 text-slate-500'
            }`}
            title={label}
        >
            {active ? <CheckCircle className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
            <span>{label}</span>
        </div>
    );

    return (
        <div className={className}>
            {/* 標題 */}
            <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                    <span className="text-amber-400">◆</span>
                    {title}
                    <span className="text-amber-400">◆</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative"
            >
                {/* 連接線 - 上善若水主題 */}
                <div className="hidden lg:block absolute top-[45%] left-[8%] right-[8%] h-0.5">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                        animate={{ 
                            backgroundPosition: ['0% 0%', '100% 0%', '100% 0%', '0% 0%'],
                            opacity: [0.3, 0.8, 0.8, 0.3]
                        }}
                        transition={{ 
                            duration: 4, 
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{ 
                            background: 'linear-gradient(90deg, transparent, #22d3ee, #22d3ee, transparent)',
                            backgroundSize: '200% 100%'
                        }}
                    />
                </div>

                {panels.map((panel, index) => {
                    const theme = colorMap[panel.color] || colorMap.primary;
                    
                    return (
                        <motion.div 
                            key={panel.id} 
                            variants={itemVariants}
                            className="relative"
                        >
                            {/* 面板卡片 */}
                            <div className={`
                                relative p-4 rounded-2xl border backdrop-blur-xl overflow-hidden
                                ${theme.bg} ${theme.border}
                                group hover:scale-[1.02] transition-all duration-300
                            `}>
                                {/* 面板編號 */}
                                <div className={`
                                    absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center
                                    text-xs font-bold text-slate-900 ${theme.dot}
                                    shadow-lg
                                `}>
                                    {index + 1}
                                </div>

                                {/* AI 插圖區域 */}
                                {panel.illustration && (
                                    <div className="mt-6 mb-3 rounded-lg overflow-hidden aspect-video bg-slate-800/50">
                                        <img 
                                            src={panel.illustration} 
                                            alt={panel.title}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                )}

                                {/* 標題 */}
                                <div className="mt-2">
                                    <h3 className="text-sm font-bold text-white leading-tight">
                                        {panel.title}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                        {panel.titleEn}
                                    </p>
                                </div>

                                {/* 描述 */}
                                <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-3">
                                    {panel.description}
                                </p>

                                {/* 5T 指標 */}
                                {panel.indicators && (
                                    <div className="mt-3 pt-3 border-t border-white/10">
                                        <p className="text-[9px] text-slate-500 mb-1.5 uppercase tracking-wider">
                                            5T 驗算
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            <T5Icon active={panel.indicators.tangible ?? false} label="感知" />
                                            <T5Icon active={panel.indicators.traceable ?? false} label="溯源" />
                                            <T5Icon active={panel.indicators.trackable ?? false} label="追蹤" />
                                            <T5Icon active={panel.indicators.transparent ?? false} label="透明" />
                                            <T5Icon active={panel.indicators.trustworthy ?? false} label="可信" />
                                        </div>
                                    </div>
                                )}

                                {/* 水波紋裝飾 */}
                                <div className="absolute -bottom-8 -right-8 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <div className="w-full h-full rounded-full border-2 border-cyan-400" />
                                </div>
                            </div>

                            {/* 箭头 */}
                            {index < panels.length - 1 && (
                                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                                    <motion.div
                                        animate={{ x: [0, 6, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className={`
                                            p-1.5 rounded-full 
                                            ${theme.bg} ${theme.border}
                                        `}
                                    >
                                        <ArrowRight className={`w-3 h-3 ${theme.text}`} />
                                    </motion.div>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default OmniMangaTutorial;