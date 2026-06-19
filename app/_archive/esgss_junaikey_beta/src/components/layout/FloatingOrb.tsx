import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import {
    LayoutGrid,
    FileText,
    TrendingUp,
    UserCircle,
    Users,
    Home,
    Settings,
    Shield,
    X,
    Maximize2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FloatingOrbProps {
    onModuleSelect?: (moduleId: string) => void;
}

const MODULES = [
    { id: 'report', name: '永續報告', nameEn: 'Sustainability Report', icon: FileText, path: '/esg-report-center', color: '#63a6b0' },
    { id: 'intelligence', name: '商業偵情', nameEn: 'Business Intelligence', icon: TrendingUp, path: '/intelligence/market', color: '#3b82f6' },
    { id: 'avatar', name: '數位分身', nameEn: 'Digital Twin', icon: UserCircle, path: '/avatar/center', color: '#8b5cf6' },
    { id: 'users', name: '用戶管理', nameEn: 'User Management', icon: Users, path: '/personal-hub', color: '#10b981' },
    { id: 'village', name: '善向永續村', nameEn: 'Benevolent Village', icon: Home, path: '/esg/village', color: '#f59e0b' },
    { id: 'backend', name: '萬能後台', nameEn: 'Omni Backend', icon: Settings, path: '/omni-backend', color: '#ec4899' },
];

export const FloatingOrb: React.FC<FloatingOrbProps> = ({ onModuleSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const orbRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const dragControls = useDragControls();

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleModuleClick = (path: string, id: string) => {
        if (onModuleSelect) onModuleSelect(id);
        navigate(path);
        setIsOpen(false);
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            <motion.div
                drag
                dragMomentum={false}
                dragElastic={0.1}
                className="pointer-events-auto absolute top-20 right-20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* The Core Orb */}
                <motion.div
                    onClick={toggleMenu}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    className="relative w-16 h-16 cursor-grab active:cursor-grabbing"
                >
                    {/* Liquid Glass Effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#63a6b0]/80 via-[#63a6b0]/40 to-white/30 backdrop-blur-xl border border-white/40 shadow-[0_0_30px_rgba(99,166,176,0.5)] overflow-hidden">
                        <motion.div
                            animate={{
                                x: [0, 10, -5, 0],
                                y: [0, -5, 10, 0],
                                scale: [1, 1.2, 0.9, 1]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-white/20 blur-md rounded-full"
                        />
                    </div>

                    {/* Icon / Status */}
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ opacity: 0, rotate: -90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 90 }}
                                >
                                    <X size={24} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="logo"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.5 }}
                                >
                                    <Shield size={24} className="drop-shadow-lg" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Pulse Rings */}
                    <div className="absolute inset-[-10px] pointer-events-none">
                        <motion.div
                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full border border-[#63a6b0]/30"
                        />
                    </div>
                </motion.div>

                {/* Circular Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] pointer-events-none"
                        >
                            {MODULES.map((module, idx) => {
                                const angle = (idx * (360 / MODULES.length)) - 90;
                                const radius = 100;
                                const x = radius * Math.cos(angle * (Math.PI / 180));
                                const y = radius * Math.sin(angle * (Math.PI / 180));

                                return (
                                    <motion.button
                                        key={module.id}
                                        initial={{ scale: 0, x: 0, y: 0 }}
                                        animate={{ scale: 1, x, y }}
                                        exit={{ scale: 0, x: 0, y: 0 }}
                                        whileHover={{ scale: 1.2, zIndex: 10 }}
                                        onClick={() => handleModuleClick(module.path, module.id)}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 group shadow-xl"
                                        style={{ backgroundColor: `${module.color}20`, borderColor: `${module.color}40` }}
                                    >
                                        <module.icon className="text-white group-hover:scale-110 transition-transform" size={20} style={{ color: module.color }} />

                                        {/* Label */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-white px-2 py-1 bg-black/50 rounded-md">
                                                {module.name}
                                            </span>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
