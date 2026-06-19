'use client';

import React, { useId } from 'react';
import { motion } from 'framer-motion';

interface IHelix {
    /** 0-100 score for each of E, S, G */
    scores: { E: number; S: number; G: number };
    size?: number;
}

const STRAND_COUNT = 14;   // number of rung pairs

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

/**
 * 🧬 EsgDnaViz — SVG ESG Genome Double Helix
 * 
 * Two strands twisted around a vertical axis.
 * Rung color reflects ESG domain health:
 *   E = emerald, S = blue, G = purple
 * Rung thickness reflects individual score.
 */
export default function EsgDnaViz({ scores, size = 280 }: IHelix) {
    const id = useId();
    const cx = size / 2;
    const totalHeight = size * 1.4;
    const amplitude = size * 0.28;
    const yStep = totalHeight / (STRAND_COUNT + 1);

    const domains: Array<'E' | 'S' | 'G'> = ['E', 'S', 'G'];
    const domainColors = {
        E: { stroke: '#34d399', glow: 'rgba(52,211,153,0.4)' },
        S: { stroke: '#60a5fa', glow: 'rgba(96,165,250,0.4)' },
        G: { stroke: '#a78bfa', glow: 'rgba(167,139,250,0.4)' },
    };

    const rungs = Array.from({ length: STRAND_COUNT }, (_, i) => {
        const t = i / (STRAND_COUNT - 1);   // 0..1
        const y = yStep * (i + 1);
        const phase = t * Math.PI * 2;     // full rotation

        const x1 = cx + amplitude * Math.sin(phase);
        const x2 = cx + amplitude * Math.sin(phase + Math.PI);

        // cycle through E, S, G
        const domain = domains[i % 3];
        const score = scores[domain] / 100;
        const col = domainColors[domain];
        const opacity = lerp(0.25, 1, score);
        const strokeW = lerp(0.8, 3.5, score);

        return { x1, x2, y, col, opacity, strokeW, domain, score };
    });

    return (
        <div className="relative w-full flex items-center justify-center" style={{ height: totalHeight }}>
            <svg width={size} height={totalHeight} className="overflow-visible">
                <defs>
                    <filter id={`${id}-glow`} x="-40%" y="-40%" width="180%" height="180%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Strand 1 (left-side sine) */}
                <motion.polyline
                    points={rungs.map(r => `${r.x1},${r.y}`).join(' ')}
                    fill="none"
                    stroke="url(#strand1)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                />

                {/* Strand 2 (right-side sine, phase+π) */}
                <motion.polyline
                    points={rungs.map(r => `${r.x2},${r.y}`).join(' ')}
                    fill="none"
                    stroke="url(#strand2)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
                />

                {/* Gradient definitions */}
                <defs>
                    <linearGradient id="strand1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity="0.6" />
                        <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="strand2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.6" />
                        <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#34d399" stopOpacity="0.6" />
                    </linearGradient>
                </defs>

                {/* Rungs */}
                {rungs.map((r, i) => (
                    <motion.g key={i}
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: r.opacity, scaleX: 1 }}
                        transition={{ delay: i * 0.055, duration: 0.4 }}
                        style={{ transformOrigin: `${cx}px ${r.y}px` }}
                        filter={r.score > 0.7 ? `url(#${id}-glow)` : undefined}
                    >
                        <line
                            x1={r.x1} y1={r.y}
                            x2={r.x2} y2={r.y}
                            stroke={r.col.stroke}
                            strokeWidth={r.strokeW}
                            strokeLinecap="round"
                        />
                        {/* Domain node left */}
                        <circle cx={r.x1} cy={r.y} r={r.strokeW * 1.6}
                            fill={r.col.stroke} opacity={r.opacity} />
                        {/* Domain node right */}
                        <circle cx={r.x2} cy={r.y} r={r.strokeW * 1.6}
                            fill={r.col.stroke} opacity={r.opacity} />

                        {/* Domain label on every 3rd rung (domain cycles) */}
                        {i % 3 === 0 && (
                            <text
                                x={cx} y={r.y - 4}
                                textAnchor="middle"
                                fontSize="6"
                                fill={r.col.stroke}
                                opacity={0.7}
                                fontFamily="monospace"
                                fontWeight="bold"
                            >
                                {r.domain}:{Math.round(r.score * 100)}
                            </text>
                        )}
                    </motion.g>
                ))}

                {/* Center axis line (faint) */}
                <line x1={cx} y1={yStep} x2={cx} y2={yStep * STRAND_COUNT}
                    stroke="white" strokeWidth="0.5" strokeDasharray="3 5" opacity="0.08" />
            </svg>

            {/* Score badges floating beside */}
            {Object.entries(scores).map(([domain, score], i) => {
                const colors = domainColors[domain as 'E' | 'S' | 'G'];
                const top = 20 + i * 32;
                return (
                    <motion.div
                        key={domain}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        style={{ top, right: -8 }}
                        className="absolute flex items-center gap-1"
                    >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.stroke }} />
                        <span className="text-[9px] font-black font-mono uppercase"
                            style={{ color: colors.stroke }}>
                            {domain} {score}
                        </span>
                    </motion.div>
                );
            })}
        </div>
    );
}
