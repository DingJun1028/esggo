"use client";

import { motion } from 'framer-motion';
import { Share2, FileText, Link as LinkIcon, Target, Users } from 'lucide-react';

interface Node {
    id: string;
    label: string;
    type: 'note' | 'entity' | 'agent';
    x: number;
    y: number;
}

interface Edge {
    source: string;
    target: string;
}

const mockNodes: Node[] = [
    { id: 'root', label: 'Omni Wuzuo', type: 'note', x: 50, y: 50 },
    { id: 'n1', label: 'ESG Reporting', type: 'note', x: 20, y: 30 },
    { id: 'n2', label: 'Carbon Scope 1', type: 'entity', x: 80, y: 25 },
    { id: 'n3', label: 'Trust Seal Protocol', type: 'agent', x: 30, y: 75 },
    { id: 'n4', label: 'Market Trends', type: 'note', x: 75, y: 70 },
];

const mockEdges: Edge[] = [
    { source: 'root', target: 'n1' },
    { source: 'root', target: 'n2' },
    { source: 'root', target: 'n3' },
    { source: 'root', target: 'n4' },
    { source: 'n1', target: 'n2' },
];

/**
 * Universal Object Graph (Inspired by Capacities)
 * 指向性的物聯圖譜，展示筆記與實體間的動態關聯
 */
export const UniversalObjectGraph = () => {
    return (
        <div className="relative w-full h-[400px] bg-black/20 rounded-3xl overflow-hidden border border-white/5">
            {/* 動態星空背景 */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />

            <svg className="w-full h-full p-10">
                <defs>
                    <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(6,182,212,0.2)" />
                        <stop offset="100%" stopColor="rgba(139,92,246,0.2)" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* 繪製連線 (Edges) */}
                {mockEdges.map((edge, i) => {
                    const source = mockNodes.find(n => n.id === edge.source)!;
                    const target = mockNodes.find(n => n.id === edge.target)!;
                    return (
                        <motion.line
                            key={`edge-${i}`}
                            x1={`${source.x}%`}
                            y1={`${source.y}%`}
                            x2={`${target.x}%`}
                            y2={`${target.y}%`}
                            stroke="url(#edgeGradient)"
                            strokeWidth="1.5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, delay: i * 0.2 }}
                            className="stroke-cyan-500/20"
                        />
                    );
                })}

                {/* 繪製節點 (Nodes) */}
                {mockNodes.map((node, i) => (
                    <motion.g
                        key={node.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="cursor-pointer group/node"
                    >
                        {/* 節點光環 */}
                        <circle
                            cx={`${node.x}%`}
                            cy={`${node.y}%`}
                            r="25"
                            className="fill-cyan-500/5 stroke-cyan-500/20 group-hover/node:stroke-cyan-400 group-hover/node:fill-cyan-500/10 transition-all duration-300"
                            filter="url(#glow)"
                        />

                        {/* 節點圖示 */}
                        <foreignObject
                            x={`${node.x - 2}%`}
                            y={`${node.y - 2}%`}
                            width="4%"
                            height="4%"
                            className="overflow-visible"
                        >
                            <div className="flex items-center justify-center w-full h-full text-white/60 group-hover/node:text-cyan-400 transition-colors">
                                {node.type === 'note' && <FileText className="w-5 h-5" />}
                                {node.type === 'entity' && <Target className="w-5 h-5" />}
                                {node.type === 'agent' && <Users className="w-5 h-5" />}
                            </div>
                        </foreignObject>

                        {/* 節點標籤 */}
                        <text
                            x={`${node.x}%`}
                            y={`${node.y + 8}%`}
                            textAnchor="middle"
                            className="fill-white/40 text-[10px] uppercase tracking-tighter font-mono group-hover/node:fill-cyan-300 transition-colors"
                        >
                            {node.label}
                        </text>
                    </motion.g>
                ))}
            </svg>

            {/* 控制面板 */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/40 hover:text-cyan-300 transition-all">
                    <Share2 className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/40 hover:text-cyan-300 transition-all">
                    <LinkIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
