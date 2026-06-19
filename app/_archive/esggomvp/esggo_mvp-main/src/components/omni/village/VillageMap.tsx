'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, TreePine, Factory, School, Heart, Shield } from 'lucide-react';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';

interface VillageNode {
    id: string;
    type: 'residential' | 'nature' | 'industrial' | 'education' | 'health';
    label: string;
    status: 'thriving' | 'developing' | 'risk';
    x: number;
    y: number;
}

const NODES: VillageNode[] = [
    { id: 'v1', type: 'residential', label: 'Eco-Housing Zone', status: 'thriving', x: 20, y: 30 },
    { id: 'v2', type: 'nature', label: 'Carbon Sink Forest', status: 'thriving', x: 70, y: 20 },
    { id: 'v3', type: 'industrial', label: 'Clean Tech Park', status: 'developing', x: 50, y: 60 },
    { id: 'v4', type: 'education', label: 'Sustainability School', status: 'thriving', x: 25, y: 75 },
    { id: 'v5', type: 'health', label: 'Wellness Center', status: 'risk', x: 80, y: 70 },
];

/**
 * 🏘️ VillageMap: 影響力村莊地圖
 * 以遊戲化地圖展示 ESG 影響力節點。
 */
export const VillageMap: React.FC = () => {
    return (
        <LiquidGlassContainer className="w-full aspect-video rounded-[3rem] p-8 relative overflow-hidden bg-omni-surface-2 border-omni-glass-border">
            {/* Background Texture/Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle, var(--theme-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Connection Lines (Aura Bridges) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <line x1="20%" y1="30%" x2="50%" y2="60%" stroke="var(--theme-primary)" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="70%" y1="20%" x2="50%" y2="60%" stroke="var(--theme-primary)" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="50%" y1="60%" x2="80%" y2="70%" stroke="var(--theme-danger)" strokeWidth="2" />
            </svg>

            {/* Nodes */}
            {NODES.map((node) => (
                <VillageNodeItem key={node.id} node={node} />
            ))}

            {/* UI Overlay */}
            <div className="absolute top-8 left-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-black text-omni-text-main">Impact Village</h2>
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-omni-text-muted uppercase tracking-widest">
                            Real-time ESG Synchronization
                        </span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 right-8 flex gap-2">
                <div className="px-4 py-2 rounded-2xl bg-omni-surface border border-omni-glass-border shadow-xl backdrop-blur-xl">
                    <span className="text-xs font-black text-omni-text-main flex items-center gap-2">
                        <Shield size={14} className="text-omni-accent" />
                        Village Trust Score: 94
                    </span>
                </div>
            </div>
        </LiquidGlassContainer>
    );
};

const VillageNodeItem = ({ node }: { node: VillageNode }) => {
    const Icon = () => {
        switch (node.type) {
            case 'residential': return <Home size={20} />;
            case 'nature': return <TreePine size={20} />;
            case 'industrial': return <Factory size={20} />;
            case 'education': return <School size={20} />;
            case 'health': return <Heart size={20} />;
        }
    };

    return (
        <motion.div
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.2, zIndex: 50 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
        >
            {/* Halo Effect */}
            <div className={`absolute inset-[-15px] rounded-full blur-xl opacity-30 transition-all group-hover:opacity-60 ${
                node.status === 'thriving' ? 'bg-omni-accent' :
                node.status === 'risk' ? 'bg-omni-danger' : 'bg-omni-primary'
            }`} />

            <div className={`relative size-12 rounded-2xl flex items-center justify-center border-2 shadow-2xl transition-all ${
                node.status === 'thriving' ? 'bg-omni-accent/10 border-omni-accent text-omni-accent' :
                node.status === 'risk' ? 'bg-omni-danger/10 border-omni-danger text-omni-danger' :
                'bg-omni-primary/10 border-omni-primary text-omni-primary'
            }`}>
                <Icon />
            </div>

            {/* Label */}
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <div className="px-3 py-1.5 rounded-xl bg-omni-surface border border-omni-glass-border shadow-2xl">
                    <span className="text-[10px] font-black text-omni-text-main uppercase tracking-wider">
                        {node.label}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
