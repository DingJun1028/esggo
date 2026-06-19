'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SustainabilityGemProps {
    size?: number;
    color?: 'rose' | 'emerald' | 'aqua' | 'amber';
    glow?: boolean;
    className?: string;
}

/**
 * 💎 SustainabilityGem: 永續寶石 Premium 4D 視覺組件
 * 採用多層漸層與動態旋轉，模擬高階永續資產的折射感。
 */
export const SustainabilityGem: React.FC<SustainabilityGemProps> = ({
    size = 40,
    color = 'rose',
    glow = true,
    className = ""
}) => {
    const getColorConfig = () => {
        switch (color) {
            case 'rose': return {
                primary: '#f43f5e',
                secondary: '#fb7185',
                accent: '#ffe4e6',
                shadow: 'rgba(244, 63, 94, 0.4)'
            };
            case 'emerald': return {
                primary: '#10b981',
                secondary: '#34d399',
                accent: '#d1fae5',
                shadow: 'rgba(16, 185, 129, 0.4)'
            };
            case 'aqua': return {
                primary: '#06b6d4',
                secondary: '#22d3ee',
                accent: '#cffafe',
                shadow: 'rgba(6, 182, 212, 0.4)'
            };
            case 'amber': return {
                primary: '#f59e0b',
                secondary: '#fbbf24',
                accent: '#fef3c7',
                shadow: 'rgba(245, 158, 11, 0.4)'
            };
            default: return {
                primary: '#f43f5e',
                secondary: '#fb7185',
                accent: '#ffe4e6',
                shadow: 'rgba(244, 63, 94, 0.4)'
            };
        }
    };

    const config = getColorConfig();

    return (
        <div
            className={`relative flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
        >
            {/* 寶石主體 (SVG) */}
            <motion.svg
                viewBox="0 0 100 100"
                className="w-full h-full relative z-10"
                animate={{
                    rotateY: [0, 360],
                    y: [0, -2, 0]
                }}
                transition={{
                    rotateY: { duration: 6, repeat: Infinity, ease: "linear" },
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{ perspective: 1000 }}
            >
                <defs>
                    <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: config.accent, stopOpacity: 1 }} />
                        <stop offset="50%" style={{ stopColor: config.secondary, stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: config.primary, stopOpacity: 1 }} />
                    </linearGradient>
                    <filter id="f1" x="0" y="0">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                    </filter>
                </defs>

                {/* 稜鏡結構 */}
                <path
                    d="M50 5 L90 35 L75 90 L25 90 L10 35 Z"
                    fill={`url(#grad-${color})`}
                    stroke="white"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                />

                {/* 內部折射面 */}
                <path
                    d="M50 5 L50 90 M50 5 L10 35 L90 35 M10 35 L25 90 M90 35 L75 90"
                    stroke="white"
                    strokeWidth="0.5"
                    strokeOpacity="0.5"
                />

                {/* 亮點 */}
                <circle cx="35" cy="25" r="4" fill="white" fillOpacity="0.6" filter="url(#f1)" />
            </motion.svg>

        </div>
    );
};
