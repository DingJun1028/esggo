import React, { useState, useEffect } from 'react';
import { useStitchTheme } from '@/contexts/StitchThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Zap, Shield, Sparkles } from 'lucide-react';

interface ThemeNode {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    position: { x: number; y: number };
    angle: number;
}

export const ThemeSelectorTaiji: React.FC = () => {
    const { mode, setMode, resolvedMode } = useStitchTheme();
    const [activeTheme, setActiveTheme] = useState(resolvedMode);
    const [isRotating, setIsRotating] = useState(false);

    useEffect(() => {
        setActiveTheme(resolvedMode);
    }, [resolvedMode]);

    const themes: ThemeNode[] = [
        {
            id: 'void',
            label: '無 (Void)',
            description: '極簡深邃，歸於沉靜',
            icon: <Shield size={24} />,
            color: '#FFFFFF',
            position: { x: 0, y: -160 },
            angle: 0
        },
        {
            id: 'moon',
            label: '自 (Self/Aqua)',
            description: '上善若水，本質共鳴',
            icon: <Compass size={24} />,
            color: '#00FFFF',
            position: { x: -160, y: 0 },
            angle: -90
        },
        {
            id: 'gold',
            label: '通 (Omni)',
            description: '永恆金質，大通無礙',
            icon: <Zap size={24} />,
            color: '#FFD700',
            position: { x: 160, y: 0 },
            angle: 90
        },
        {
            id: 'sentient',
            label: '深 (Deepen)',
            description: '感官深化，矩陣鏈接',
            icon: <Sparkles size={24} />,
            color: '#14B8A6',
            position: { x: 0, y: 160 },
            angle: 180
        },
    ];

    const handleThemeChange = (themeId: string) => {
        // Map 'moon' to 'dark' or 'moon' based on what index.css expects
        // But since we want the new themes, we specify them as is.
        setMode(themeId as any);
        setIsRotating(true);
        setTimeout(() => setIsRotating(false), 2000);
    };

    return (
        <div className="relative w-[400px] h-[400px] flex items-center justify-center">
            {/* Background Milky Way Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-primary/5 via-transparent to-brand-secondary/5 blur-3xl" />

            {/* Central Taiji Symbol */}
            <motion.div
                className="relative size-40 rounded-full border border-white/10 p-1 bg-black/40 backdrop-blur-xl shadow-2xl z-10"
                animate={{ rotate: isRotating ? 360 : 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
            >
                <div className="w-full h-full rounded-full overflow-hidden relative rotate-90">
                    <div className="absolute top-0 w-full h-1/2 bg-white flex items-center justify-center">
                        <div className="size-8 rounded-full bg-black flex items-center justify-center">
                            <div className="size-2 rounded-full bg-white animate-pulse" />
                        </div>
                    </div>
                    <div className="absolute bottom-0 w-full h-1/2 bg-black flex items-center justify-center">
                        <div className="size-8 rounded-full bg-white flex items-center justify-center">
                            <div className="size-2 rounded-full bg-black animate-pulse" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Interactive Theme Nodes */}
            <div className="absolute inset-0">
                {themes.map((theme) => {
                    const isActive = activeTheme === theme.id;
                    return (
                        <motion.div
                            key={theme.id}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                            animate={{
                                x: theme.position.x,
                                y: theme.position.y,
                                scale: isActive ? 1.2 : 1
                            }}
                            whileHover={{ scale: 1.3 }}
                            onClick={() => handleThemeChange(theme.id)}
                        >
                            <div className="relative flex flex-col items-center">
                                <div className={`
                                    size-14 rounded-full flex items-center justify-center 
                                    transition-all duration-500 border-2
                                    ${isActive
                                        ? 'bg-white/10 border-white shadow-[0_0_30px_rgba(255,255,255,0.4)]'
                                        : 'bg-black/40 border-white/20 hover:border-white/50'
                                    }
                                    backdrop-blur-md
                                `}
                                    style={{
                                        boxShadow: isActive ? `0 0 30px ${theme.color}66` : 'none',
                                        borderColor: isActive ? theme.color : undefined
                                    }}
                                >
                                    <div style={{ color: isActive ? theme.color : 'rgba(255,255,255,0.5)' }}>
                                        {theme.icon}
                                    </div>
                                </div>

                                <div className={`
                                    absolute -bottom-12 w-32 text-center pointer-events-none transition-all duration-300
                                    ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}
                                `}>
                                    <p className="text-xs font-black uppercase tracking-widest text-white mb-1" style={{ textShadow: `0 0 10px ${theme.color}` }}>
                                        {theme.label}
                                    </p>
                                    <p className="text-[10px] text-white/40 leading-tight">
                                        {theme.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* OmniCircle Decorative Label */}
            <div className="absolute -top-16 text-center">
                <h3 className="text-xl font-black italic uppercase italic aqua-text-glow tracking-tighter">
                    奧秘圓通 <span className="text-brand-primary">OmniCircle</span>
                </h3>
                <p className="text-[10px] text-white/30 font-black tracking-[0.4em] uppercase">自通無通深化</p>
            </div>

            {/* Connecting Circular Ring */}
            <div className="absolute size-80 rounded-full border border-dashed border-white/5 animate-spin-slow pointer-events-none" />
        </div>
    );
};
