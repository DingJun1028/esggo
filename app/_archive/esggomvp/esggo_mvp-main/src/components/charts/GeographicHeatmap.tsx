'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';

interface IHeatPoint {
    id: string;
    lat: number;
    lng: number;
    intensity: number; // 0-1
    label: string;
}

const GeographicHeatmap: React.FC<{ points?: IHeatPoint[] }> = ({ points = [] }) => {
    // 簡單的經緯度投影轉換 (Mercator approximation)
    const project = (lat: number, lng: number) => {
        const x = (lng + 180) * (800 / 360);
        const y = (90 - lat) * (400 / 180);
        return { x, y };
    };

    const heatmapPoints = useMemo(() => {
        return points.map(p => ({
            ...p,
            ...project(p.lat, p.lng)
        }));
    }, [points]);

    return (
        <LiquidGlassContainer className="relative w-full aspect-[2/1] bg-omni-surface-2 overflow-hidden group">
            <div className="absolute inset-0 p-8">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-omni-primary">Global Impact Heatmap</h3>
                    <div className="flex gap-2">
                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-omni-text-muted">LIVE_SATELLITE_FEED</span>
                    </div>
                </div>

                {/* SVG World Map Placeholder / Outline */}
                <svg viewBox="0 0 800 400" className="w-full h-full opacity-20 filter grayscale contrast-125">
                    <path
                        d="M150,150 L200,150 L200,200 L150,200 Z M400,100 L450,100 L450,150 L400,150 Z M600,250 L650,250 L650,300 L600,300 Z"
                        fill="currentColor"
                        className="text-omni-primary"
                    />
                    {/* Simplified World Grid */}
                    <g stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.1">
                        {[...Array(20)].map((_, i) => (
                            <line key={`h-${i}`} x1="0" y1={i * 20} x2="800" y2={i * 20} />
                        ))}
                        {[...Array(40)].map((_, i) => (
                            <line key={`v-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="400" />
                        ))}
                    </g>
                </svg>

                {/* Heat Points */}
                <svg viewBox="0 0 800 400" className="absolute inset-0 w-full h-full pointer-events-auto">
                    {heatmapPoints.map((p) => (
                        <g key={p.id}>
                            <motion.circle
                                initial={{ r: 0, opacity: 0 }}
                                animate={{ r: p.intensity * 20 + 5, opacity: 0.4 }}
                                transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                                cx={p.x}
                                cy={p.y}
                                fill="var(--theme-primary)"
                                className="blur-md"
                            />
                            <circle
                                cx={p.x}
                                cy={p.y}
                                r="3"
                                fill="var(--theme-primary)"
                                className="cursor-pointer"
                            />
                            {/* Hover Label Placeholder */}
                            <motion.g
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                initial={false}
                            >
                                <text
                                    x={p.x + 8}
                                    y={p.y - 8}
                                    className="text-[10px] font-black fill-omni-text-main"
                                    style={{ pointerEvents: 'none' }}
                                >
                                    {p.label}
                                </text>
                            </motion.g>
                        </g>
                    ))}
                </svg>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-8 flex items-center gap-4">
                <div className="h-1.5 w-24 bg-gradient-to-r from-omni-primary/10 to-omni-primary rounded-full" />
                <span className="text-[10px] font-bold text-omni-text-muted uppercase tracking-tighter">Impact Intensity</span>
            </div>
        </LiquidGlassContainer>
    );
};

export default GeographicHeatmap;
