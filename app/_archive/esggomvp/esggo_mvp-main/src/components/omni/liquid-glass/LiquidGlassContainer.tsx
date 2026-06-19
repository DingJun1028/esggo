'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IComponentCore } from '@/core/types/omni-types';
import { cn } from "@/lib/utils";

interface LiquidGlassContainerProps {
    children: React.ReactNode;
    variant?: 'default' | 'high-contrast' | 'ethereal';
    className?: string;
    glowColor?: string;
    intensity?: 'low' | 'medium' | 'high';
    enablePerspective?: boolean;
    isSealed?: boolean;
    coreContext?: IComponentCore;
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
    className = '',
    intensity = 'medium',
    onClick,
    style,
}) => {
    // 善向永續版：去發光、物理模糊、超細邊框、專業啞光
    const blurAmount = intensity === 'low' ? '8px' : intensity === 'medium' ? '12px' : '20px';

    return (
        <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={onClick ? { y: -1, transition: { duration: 0.15 } } : undefined}
            whileTap={onClick ? { scale: 0.985 } : undefined}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={onClick}
            className={cn(
                'relative overflow-hidden rounded-md',
                'bg-[var(--theme-glass-bg)] border border-[var(--theme-glass-border)]',
                'shadow-sm transition-all duration-200',
                onClick ? 'cursor-pointer hover:border-[var(--theme-primary)]/30' : '',
                className
            )}
            style={{ 
                ...style,
                backdropFilter: `blur(${blurAmount}) saturate(150%)`,
                WebkitBackdropFilter: `blur(${blurAmount}) saturate(150%)`,
            }}
        >
            {/* 容器內容 */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>

            {/* 微弱的數據感顆粒紋理 */}
            <div className="absolute inset-0 pointer-events-none data-matrix-grain opacity-[0.03]" />
        </motion.div>
    );
};

