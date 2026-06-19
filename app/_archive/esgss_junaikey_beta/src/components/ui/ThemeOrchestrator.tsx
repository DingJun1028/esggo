import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themeStyleService, ThemeMode, TimeMode } from '../../services/ThemeStyleService';
import { Sun, Moon, Zap, Sparkles, Factory, Brain, Palette } from 'lucide-react';

/**
 * 🎨 ThemeOrchestrator: One-Click Switcher
 * ---------------------------------------
 * Bento-style UI for atmosphere management.
 */
export const ThemeOrchestrator: React.FC = () => {
    const [currentMode, setCurrentMode] = useState<ThemeMode>('DEFAULT');
    const [currentTime, setCurrentTime] = useState<TimeMode>('MOON');

    useEffect(() => {
        // Initial load
        const interval = setInterval(() => {
            // Poll for external changes if needed, but service should ideally emit
            setCurrentMode(localStorage.getItem('omni-theme-mode') as ThemeMode || 'DEFAULT');
            setCurrentTime(localStorage.getItem('omni-time-mode') as TimeMode || 'MOON');
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleThemeChange = (mode: ThemeMode) => {
        themeStyleService.applyTheme(mode);
        setCurrentMode(mode);
    };

    const handleTimeToggle = () => {
        themeStyleService.toggleTimeMode();
        setCurrentTime(themeStyleService.getTimeMode());
    };

    const themes: { mode: ThemeMode; label: string; icon: any; color: string }[] = [
        { mode: 'TACTICAL', label: 'Tactical (Aqua)', icon: Zap, color: '#63a6b0' },
        { mode: 'ETHEREAL', label: 'Ethereal (Mystic)', icon: Sparkles, color: '#a855f7' },
        { mode: 'INDUSTRIAL', label: 'Industrial (Core)', icon: Factory, color: '#f59e0b' },
        { mode: 'SENTIENT', label: 'Sentient (Void)', icon: Brain, color: '#ffffff' },
    ];

    return (
        <div className="p-6 bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Palette className="text-[#63a6b0]" size={20} />
                    <h3 className="text-sm font-black tracking-widest text-white/80 uppercase">Theme Orchestration</h3>
                </div>

                {/* ☀️/🌙 Time Toggle */}
                <button
                    onClick={handleTimeToggle}
                    className="relative w-14 h-8 bg-black/40 rounded-full border border-white/10 flex items-center px-1 overflow-hidden group"
                >
                    <motion.div
                        animate={{ x: currentTime === 'SUN' ? 24 : 0 }}
                        className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-colors ${currentTime === 'SUN' ? 'bg-amber-400 text-amber-900' : 'bg-indigo-600 text-indigo-100'
                            }`}
                    >
                        {currentTime === 'SUN' ? <Sun size={14} /> : <Moon size={14} />}
                    </motion.div>
                </button>
            </div>

            {/* Bento Grid Themes */}
            <div className="grid grid-cols-2 gap-3">
                {themes.map((t) => (
                    <button
                        key={t.mode}
                        onClick={() => handleThemeChange(t.mode)}
                        className={`
                            relative overflow-hidden p-4 rounded-2xl border transition-all duration-300
                            ${currentMode === t.mode
                                ? 'bg-white/10 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                                : 'bg-white/5 border-transparent hover:border-white/10 hover:bg-white/[0.07]'}
                        `}
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div className="p-2 rounded-xl" style={{ backgroundColor: `${t.color}22` }}>
                                <t.icon size={24} style={{ color: t.color }} />
                            </div>
                            <span className="text-[10px] font-bold tracking-wider text-white/60 uppercase">
                                {t.label}
                            </span>
                        </div>

                        {currentMode === t.mode && (
                            <motion.div
                                layoutId="active-highlight"
                                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r"
                                style={{ background: t.color }}
                            />
                        )}
                    </button>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-[9px] font-mono text-white/30 text-center uppercase tracking-[0.2em]">
                    Powered by Auto-Palette & 5T Protocol
                </p>
            </div>
        </div>
    );
};
