'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Sun, Box, Palette, Terminal, Type } from 'lucide-react';

const themes = [
    { id: 'aqua', name: '上善若水 (Classic)', icon: <Droplets size={16} />, color: '#63a6b0' },
    { id: 'solar', name: '白日清爽 (Daylight)', icon: <Sun size={16} />, color: '#00A3A3' },
    { id: 'nordic', name: '北歐粗獷 (Brutalist)', icon: <Box size={16} />, color: '#000000' },
    { id: 'terminal', name: '終端極簡 (Terminal)', icon: <Terminal size={16} />, color: '#00FF41' },
    { id: 'swiss', name: '瑞士表現 (Swiss)', icon: <Type size={16} />, color: '#FF0000' },
    { id: 'apple', name: '蘋果極簡 (Apple)', icon: <Palette size={16} />, color: '#0071E3' },
    { id: 'google', name: '谷歌活力 (Google)', icon: <Palette size={16} />, color: '#1A73E8' },
];

export default function ThemeSwitcher() {
    const [currentTheme, setCurrentTheme] = useState('solar');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // 優先讀取保存的，預設改為 solar (白日模式) 確保視覺清爽起點
        const savedTheme = localStorage.getItem('omni-theme') || 'solar';
        setTheme(savedTheme);
    }, []);

    const setTheme = (themeId: string) => {
        setCurrentTheme(themeId);
        document.documentElement.setAttribute('data-theme', themeId);
        localStorage.setItem('omni-theme', themeId);
        setIsOpen(false);
    };

    return (
        <div className="flex items-center gap-2">
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 lg:p-3 rounded-xl transition-all hover:bg-omni-primary/10 text-omni-primary border border-omni-primary/20 flex items-center gap-2 group"
                    title="Switch Theme Universe"
                >
                    <Palette size={18} className="group-hover:rotate-12 transition-transform" />
                    <span className="hidden xl:inline text-[10px] font-bold uppercase tracking-widest leading-none">
                        {themes.find(t => t.id === currentTheme)?.name.split(' (')[0] || 'Theme'}
                    </span>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10, x: -50 }}
                            animate={{ opacity: 1, scale: 1, y: 0, x: -50 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10, x: -50 }}
                            className="absolute top-14 left-1/2 p-2 bg-omni-surface border-2 border-omni-glass-border rounded-2xl shadow-2xl flex flex-col gap-1 min-w-[200px] z-[200]"
                        >
                            <div className="px-3 py-2 border-b border-omni-glass-border mb-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-omni-text-muted">Style Multiverse</span>
                            </div>
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${currentTheme === t.id
                                        ? 'bg-omni-primary text-white shadow-lg'
                                        : 'hover:bg-omni-surface-2 text-omni-text-sub'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {t.icon}
                                        <span className="text-xs font-bold whitespace-nowrap">{t.name}</span>
                                    </div>
                                    <div
                                        className="w-2 h-2 rounded-full border border-white/20"
                                        style={{ backgroundColor: t.color }}
                                    />
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[190]"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
