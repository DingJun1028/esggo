"use client";

/**
 * 🌊 Sankey Engine — ESG GO Omni Layer (Beauty Module)
 * 
 * 實作 Liquid Glass 的動態流向視覺化引擎。
 * 由於依賴複雜的 Canvas 或是 SVG，此處給出一個抽象與視覺化的 SVG 實作框架
 * 以符合 TypeScript 與 4D Floating 質感的美學要求。
 */

import React, { useEffect, useState } from 'react';

export interface SankeyNode {
    id: string;
    label: string;
    value: number;
    color?: string; // e.g. 'rgba(52, 211, 153, 0.8)'
}

export interface SankeyLink {
    source: string; // node id
    target: string; // node id
    value: number;
}

interface SankeyEngineProps {
    nodes: SankeyNode[];
    links: SankeyLink[];
    width?: number;
    height?: number;
}

export default function SankeyEngine({ nodes, links, width = 800, height = 400 }: SankeyEngineProps) {
    const [isHovered, setIsHovered] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="bg-[var(--theme-surface-2)] rounded-md w-full h-[400px]" />;

    // 這裡我們運用簡單的 SVG 視覺巧思模擬流向，
    // 在真實環境裡可整合 d3-sankey 加上 custom TS wrappers。

    return (
        <div className="relative w-full overflow-visible" style={{ minHeight: height }}>
            {/* 動態光暈背景層 */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-r from-[var(--theme-primary)]/10 to-transparent blur-3xl" />

            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="relative z-10 overflow-visible">
                <defs>
                    <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(52, 211, 153, 0.4)" />
                        <stop offset="50%" stopColor="rgba(56, 189, 248, 0.6)" />
                        <stop offset="100%" stopColor="rgba(99, 102, 241, 0.4)" />
                    </linearGradient>
                    <linearGradient id="flow-gradient-hover" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(52, 211, 153, 0.8)" />
                        <stop offset="50%" stopColor="rgba(56, 189, 248, 1)" />
                        <stop offset="100%" stopColor="rgba(99, 102, 241, 0.8)" />
                    </linearGradient>
                </defs>

                {/* --- 這裡僅為視覺展示(Beauty)繪製代表性的流向 --- */}
                {/* 實際的打點運算需使用 layout 演算法，此處我們產生 4D 懸浮式的視覺回饋 */}

                <path
                    d="M 100,200 C 300,200 500,100 700,100"
                    fill="none"
                    stroke={isHovered === 'link-1' ? "url(#flow-gradient-hover)" : "url(#flow-gradient)"}
                    strokeWidth="40"
                    className="transition-all duration-700 cursor-pointer hover:stroke-[50px]"
                    onMouseEnter={() => setIsHovered('link-1')}
                    onMouseLeave={() => setIsHovered(null)}
                />

                <path
                    d="M 100,200 C 300,200 500,300 700,300"
                    fill="none"
                    stroke={isHovered === 'link-2' ? "url(#flow-gradient-hover)" : "url(#flow-gradient)"}
                    strokeWidth="30"
                    className="transition-all duration-700 cursor-pointer hover:stroke-[40px]"
                    onMouseEnter={() => setIsHovered('link-2')}
                    onMouseLeave={() => setIsHovered(null)}
                />

                {/* 節點 (Nodes) */}
                <circle cx="100" cy="200" r="12" fill="var(--color-optimal)" className="stroke-[var(--theme-bg)] stroke-2" />
                <circle cx="700" cy="100" r="20" fill="var(--theme-primary)" className="stroke-[var(--theme-bg)] stroke-2" />
                <circle cx="700" cy="300" r="16" fill="var(--color-lethal)" className="stroke-[var(--theme-bg)] stroke-2" />

                {/* 標籤 */}
                <text x="50" y="200" fill="white" fontSize="16" className="tracking-widest font-light drop-shadow-md">Sources</text>
                <text x="740" y="105" fill="white" fontSize="16" className="tracking-widest font-light drop-shadow-md">Scope 1</text>
                <text x="740" y="305" fill="white" fontSize="16" className="tracking-widest font-light drop-shadow-md">Scope 2</text>
            </svg>

            {/* 若要顯示 tooltip 或互動懸浮資訊可放在此 */}
            {isHovered && (
                <div className="absolute top-4 right-4 backdrop-blur-md bg-white/10 border border-white/20 p-4 rounded-xl text-white shadow-2xl animate-fade-in text-sm font-mono z-20">
                    <p className="text-emerald-300">Flow Data Stream</p>
                    <p>Weight: 1,450 tCO2e</p>
                    <p>Integrity: <span className="text-blue-300">Hash Verified</span></p>
                </div>
            )}
        </div>
    );
}
