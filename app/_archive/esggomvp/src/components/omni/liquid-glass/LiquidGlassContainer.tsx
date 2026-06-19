'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IComponentCore } from '@/core/types/omni-types';

interface LiquidGlassContainerProps {
    children: React.ReactNode;
    variant?: 'default' | 'high-contrast' | 'ethereal';
    className?: string;
    glowColor?: string;
    intensity?: string;
    enablePerspective?: boolean;
    isSealed?: boolean;
    coreContext?: IComponentCore | any;
    stitchId?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
}

/**
 * 🧪 LiquidGlassContainer (永續視覺容器)
 * 實作 4D 玻璃質感核心視覺層，支持 7 大品牌主題切換。
 * 具備強烈毛玻璃效果、邊框勾勒與霓虹光暈支援。
 */
export const LiquidGlassContainer: React.FC<LiquidGlassContainerProps> = ({
    children,
    variant = 'default',
    className = '',
    glowColor = 'var(--theme-primary)',
    onClick,
    style,
    coreContext
}) => {
    // [Sentient Logic] Adjust fluidity based on coreContext
    const fluidity = coreContext?.sentiment?.score || 0.5;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{
                opacity: 1,
                scale: 1,
                boxShadow: `var(--theme-shadow), 0 0 ${10 + fluidity * 5}px -10px ${glowColor}33`
            }}
            whileHover={onClick ? { scale: 1.005, transition: { duration: 0.2 } } : undefined}
            whileTap={onClick ? { scale: 0.995 } : undefined}
            transition={{ ease: "easeInOut", duration: 0.4 }}
            onClick={onClick}
            className={`
        relative overflow-hidden rounded-[2.5rem]
        backdrop-blur-2xl bg-omni-glass-bg border border-omni-glass-border
        transition-all duration-500
        ${onClick ? 'cursor-pointer hover:border-omni-primary/30' : ''}
        ${className}
      `}
            style={{ ...style }}
        >
            {/* Glass Inner Reflection (Light Tone) */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/40 via-white/10 to-transparent opacity-60 rounded-[2.5rem]" />

            {/* 容器內容 */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>

            {/* Subtle Aesthetic Accent - Bottom Line */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-omni-primary/20 to-transparent pointer-events-none"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
        </motion.div>
    );
};
