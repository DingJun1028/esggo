'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, BookOpen, PenTool, LayoutDashboard, Globe, Shield, Sparkles, Binary } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

/**
 * 🌠 FloatingFunctionKey428 (428 懸浮功能鍵 / 全局導航中樞)
 * 4 大支柱、雙棲狀態 (展開/收合)、8 方符文，Liquid Glass 視覺展現
 */
export const FloatingFunctionKey428: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { locale } = useLanguage();

    const toggleExpand = () => setIsExpanded(!isExpanded);

    // 8方符文導航項目
    const runes = [
        { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: locale === 'zh-TW' ? '戰略樞紐' : 'Strategic Hub', color: 'text-omni-primary' },
        { id: 'gnosis', icon: <Globe size={20} />, label: locale === 'zh-TW' ? '萬能智庫' : 'Omni Gnosis', color: 'text-aqua' },
        { id: 'write', icon: <PenTool size={20} />, label: locale === 'zh-TW' ? '三路織稿' : 'Tri-Weave', color: 'text-gold' },
        { id: 'trust', icon: <Shield size={20} />, label: locale === 'zh-TW' ? '誠信護照' : 'Trust Passport', color: 'text-emerald-400' },
        { id: 'library', icon: <BookOpen size={20} />, label: locale === 'zh-TW' ? '知識聖殿' : 'Knowledge Temple', color: 'text-purple-400' },
        { id: 'agent', icon: <Sparkles size={20} />, label: locale === 'zh-TW' ? '萬能精靈' : 'Omni Sprite', color: 'text-blue-400' },
        { id: 'rules', icon: <Binary size={20} />, label: locale === 'zh-TW' ? '法規矩陣' : 'Law Matrix', color: 'text-orange-400' },
    ];

    const radius = 90; // 展開的半徑

    return (
        <div className="fixed bottom-8 right-8 z-[9999]">
            <AnimatePresence>
                {isExpanded && (
                    <>
                        {/* 背景防護罩 (點擊收合) */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                            onClick={() => setIsExpanded(false)}
                        />

                        {/* 8 方符文 */}
                        {runes.map((rune, index) => {
                            const angle = (index * (360 / runes.length)) * (Math.PI / 180);
                            const x = Math.cos(angle) * radius;
                            const y = Math.sin(angle) * (-radius); // 向上半圓或全圓分佈

                            return (
                                <motion.div
                                    key={rune.id}
                                    initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                                    animate={{ opacity: 1, x, y, scale: 1 }}
                                    exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.05 }}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 group"
                                >
                                    <button
                                        className="relative p-3 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:bg-slate-800 transition-colors flex items-center justify-center"
                                        title={rune.label}
                                        onClick={() => {
                                            console.log(`Navigating to: ${rune.id}`);
                                            setIsExpanded(false);
                                        }}
                                    >
                                        <div className={rune.color}>{rune.icon}</div>

                                        {/* Tooltip */}
                                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <div className="bg-black/90 text-white text-[10px] px-2 py-1 rounded border border-white/10 uppercase tracking-widest font-bold shadow-lg">
                                                {rune.label}
                                            </div>
                                        </div>
                                    </button>
                                </motion.div>
                            );
                        })}
                    </>
                )}
            </AnimatePresence>

            {/* Core Button */}
            <motion.button
                onClick={toggleExpand}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-50 w-16 h-16 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-omni-primary to-aqua shadow-[0_0_30px_rgba(99,162,176,0.3)] border border-white/20 group"
            >
                {/* Liquid Glass Overlay */}
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors" />

                {/* Pulse ring when not expanded */}
                {!isExpanded && (
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 rounded-full border-2 border-white/50"
                    />
                )}

                <Compass size={28} className={`text-slate-900 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </motion.button>
        </div>
    );
};
