"use client";

import { motion } from 'framer-motion';
import { Server, Database, Globe, Zap, Cpu } from 'lucide-react';

interface Node {
    id: string;
    label: string;
    type: 'internal' | 'external' | 'db';
    x: number;
    y: number;
}

const nodes: Node[] = [
    { id: 'hub', label: 'Omni Hub', type: 'internal', x: 50, y: 50 },
    { id: 'wuzuo', label: 'Wuzuo Engine', type: 'internal', x: 25, y: 25 },
    { id: 'ncb', label: 'NoCodeBackend', type: 'external', x: 75, y: 25 },
    { id: 'supabase', label: 'Supabase DB', type: 'db', x: 50, y: 80 },
    { id: 'gcp', label: 'Cloud Run', type: 'external', x: 80, y: 60 },
];

const edges = [
    { from: 'hub', to: 'wuzuo' },
    { from: 'hub', to: 'ncb' },
    { from: 'hub', to: 'supabase' },
    { from: 'wuzuo', to: 'supabase' },
    { from: 'ncb', to: 'gcp' },
];

export const DependencyGraph = () => {
    return (
        <div className="relative w-full h-[300px] rounded-3xl overflow-hidden bg-black/40 border border-white/5 p-4">
            <svg className="w-full h-full">
                <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                        <path d="M0,0 L10,5 L0,10 Z" fill="rgba(255,255,255,0.1)" />
                    </marker>
                </defs>

                {edges.map((edge, i) => {
                    const from = nodes.find(n => n.id === edge.from)!;
                    const to = nodes.find(n => n.id === edge.to)!;
                    return (
                        <motion.line
                            key={`edge-${i}`}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.2 }}
                            transition={{ duration: 2, delay: i * 0.3 }}
                            x1={`${from.x}%`}
                            y1={`${from.y}%`}
                            x2={`${to.x}%`}
                            y2={`${to.y}%`}
                            stroke="white"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />
                    );
                })}

                {nodes.map((node, i) => (
                    <motion.g
                        key={node.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <circle
                            cx={`${node.x}%`}
                            cy={`${node.y}%`}
                            r="15"
                            className="fill-blue-500/10 stroke-blue-500/30"
                        />
                        <foreignObject
                            x={`${node.x - 3}%`}
                            y={`${node.y - 3}%`}
                            width="6%"
                            height="6%"
                            className="overflow-visible"
                        >
                            <div className="flex items-center justify-center w-full h-full text-blue-400">
                                {node.type === 'internal' && <Cpu size={14} />}
                                {node.type === 'external' && <Globe size={14} />}
                                {node.type === 'db' && <Database size={14} />}
                            </div>
                        </foreignObject>
                        <text
                            x={`${node.x}%`}
                            y={`${node.y + 10}%`}
                            textAnchor="middle"
                            className="fill-white/30 text-[8px] font-mono uppercase tracking-widest"
                        >
                            {node.label}
                        </text>
                    </motion.g>
                ))}
            </svg>
        </div>
    );
};
