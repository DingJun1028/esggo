'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Sparkles, BrainCircuit, Activity, FileText, ArrowUpRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FloatingFunctionKey428() {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();
    const controls = useAnimation();

    // 隨機發光特效 (Liquid Glass 動態感)
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isHovered && !isOpen) {
                controls.start({
                    boxShadow: [
                        '0 0 0px rgba(0, 163, 163, 0)',
                        '0 0 20px rgba(0, 163, 163, 0.4)',
                        '0 0 0px rgba(0, 163, 163, 0)'
                    ],
                    transition: { duration: 2 }
                });
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [isHovered, isOpen, controls]);

    const menuItems = [
        { id: 'hub', label: '總樞紐', icon: Activity, path: '/omni/reports' },
        { id: 'wizard', label: '引導精靈', icon: Sparkles, path: '/omni/ai-wizard' },
        { id: 'calc', label: '透明驗算', icon: FileText, path: '/omni/esg-calculator' },
        { id: 'twin', label: 'Agentic Twin', icon: BrainCircuit, path: '/omni/agentic-twin' },
    ];

    const navigate = (path: string) => {
        setIsOpen(false);
        router.push(path);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-[0_0_30px_rgba(0,163,163,0.15)] origin-bottom-right"
                    >
                        <div className="px-3 py-2 border-b border-white/5 mb-1">
                            <span className="text-[10px] font-mono text-omni-primary uppercase tracking-widest">Navigation 428</span>
                        </div>
                        {menuItems.map((item, idx) => (
                            <motion.button
                                key={item.id}
                                whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                onClick={() => navigate(item.path)}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-4 h-4 text-omni-primary/70" />
                                    <span className="whitespace-nowrap">{item.label}</span>
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                animate={controls}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full flex items-center justify-center bg-transparent border border-white/20 hover:border-omni-primary/50 relative group shadow-[0_0_15px_rgba(0,163,163,0.3)] transition-colors overflow-hidden backdrop-blur-3xl"
            >
                {/* 內部背景與特效 */}
                <div className="absolute inset-0 bg-gradient-to-br from-omni-primary/30 to-black pointer-events-none" />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity mix-blend-overlay pointer-events-none" />

                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10"
                >
                    {isOpen ? (
                        <X className="w-6 h-6 text-white" />
                    ) : (
                        <Sparkles className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    )}
                </motion.div>
            </motion.button>
        </div>
    );
}

