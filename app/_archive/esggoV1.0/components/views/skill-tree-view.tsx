"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRPGStore, SkillNode } from '@/lib/stores/rpg-store';
import {
    Zap,
    Shield,
    Search,
    Award,
    Lock,
    Sparkles,
    ChevronRight,
    Leaf
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SKILL_GROUPS = {
    ENVIRONMENT: { name: '東宮蒼龍', color: '#10b981', nodes: ['eco_pioneer', 'carbon_guardian', 'biodiversity_sage'] },
    SOCIAL: { name: '南宮朱雀', color: '#ef4444', nodes: ['social_architect', 'equity_diplomat', 'community_hero'] },
    TECH_DATA: { name: '西宮白虎', color: '#3b82f6', nodes: ['data_forensic', 'cipher_master', 'quantum_shaper'] },
    GOVERNANCE: { name: '北宮玄武', color: '#64748b', nodes: ['integrity_knight', 'sovereign_auditor', 'ethic_overseer'] }
};

const SKILL_POSITIONS: Record<string, { x: number; y: number, group: keyof typeof SKILL_GROUPS }> = {
    // East - Environment
    'eco_pioneer': { x: 30, y: 30, group: 'ENVIRONMENT' },
    'carbon_guardian': { x: 20, y: 45, group: 'ENVIRONMENT' },
    'biodiversity_sage': { x: 10, y: 60, group: 'ENVIRONMENT' },
    // South - Social
    'social_architect': { x: 70, y: 30, group: 'SOCIAL' },
    'equity_diplomat': { x: 80, y: 45, group: 'SOCIAL' },
    'community_hero': { x: 90, y: 60, group: 'SOCIAL' },
    // West - Tech
    'data_forensic': { x: 30, y: 70, group: 'TECH_DATA' },
    'cipher_master': { x: 20, y: 85, group: 'TECH_DATA' },
    'quantum_shaper': { x: 10, y: 95, group: 'TECH_DATA' },
    // North - Governance
    'integrity_knight': { x: 70, y: 70, group: 'GOVERNANCE' },
    'sovereign_auditor': { x: 80, y: 85, group: 'GOVERNANCE' },
    'ethic_overseer': { x: 90, y: 95, group: 'GOVERNANCE' },
};

const CONNECTIONS = [
    { from: 'eco_pioneer', to: 'carbon_guardian' },
    { from: 'carbon_guardian', to: 'biodiversity_sage' },
    { from: 'social_architect', to: 'equity_diplomat' },
    { from: 'equity_diplomat', to: 'community_hero' },
    { from: 'data_forensic', to: 'cipher_master' },
    { from: 'cipher_master', to: 'quantum_shaper' },
    { from: 'integrity_knight', to: 'sovereign_auditor' },
    { from: 'sovereign_auditor', to: 'ethic_overseer' }
];

export function SkillTreeView() {
    const { skills, knowledgeXP, unlockSkill } = useRPGStore();

    const renderNode = (node: SkillNode) => {
        const pos = SKILL_POSITIONS[node.id];
        if (!pos) return null;

        const group = SKILL_GROUPS[pos.group];
        const canUnlock = !node.unlocked && knowledgeXP >= node.requirements.xp;

        return (
            <motion.div
                key={node.id}
                style={{
                    position: 'absolute',
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: 'translate(-50%, -50%)'
                }}
                className="z-10"
            >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none">
                    <span className="text-[10px] font-black whitespace-nowrap text-white uppercase tracking-[0.3em] font-serif italic">{group.name}</span>
                </div>
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => canUnlock && unlockSkill(node.id)}
                    className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-500 border-2",
                        node.unlocked
                            ? 'bg-stone-900 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                            : canUnlock
                                ? 'bg-amber-500/20 border-amber-500 animate-pulse'
                                : 'bg-stone-900 border-stone-800 grayscale opacity-40'
                    )}
                    style={{ borderColor: node.unlocked ? group.color : undefined }}
                >
                    <div className="relative">
                        {node.id.includes('eco') || node.id.includes('carbon') ? <Leaf className={cn("w-6 h-6", node.unlocked ? "text-emerald-400" : "text-stone-600")} /> :
                            node.id.includes('social') || node.id.includes('equity') ? <Shield className={cn("w-6 h-6", node.unlocked ? "text-red-400" : "text-stone-600")} /> :
                                node.id.includes('data') || node.id.includes('cipher') ? <Zap className={cn("w-6 h-6", node.unlocked ? "text-blue-400" : "text-stone-600")} /> :
                                    <Award className={cn("w-6 h-6", node.unlocked ? "text-slate-400" : "text-stone-600")} />}

                        {!node.unlocked && !canUnlock && <Lock className="w-3 h-3 absolute -bottom-1 -right-1 text-stone-500" />}
                    </div>
                </motion.div>

                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                    <p className={`text-[10px] font-black uppercase tracking-tighter ${node.unlocked ? 'text-emerald-400' : 'text-stone-500'}`}>
                        {node.name}
                    </p>
                    {!node.unlocked && (
                        <p className="text-[8px] text-stone-600 font-bold uppercase">
                            XP: {node.requirements.xp}
                        </p>
                    )}
                </div>
            </motion.div>
        );
    };

    return (
        <div className="relative w-full h-[600px] bg-stone-950 rounded-[40px] overflow-hidden border border-white/5 shadow-2xl">
            {/* Star background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(20,20,20,1)_0%,_rgba(0,0,0,1)_100%)]" />
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

            {/* SVG Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {CONNECTIONS.map((conn, idx) => {
                    const startArr = SKILL_POSITIONS[conn.from];
                    const endArr = SKILL_POSITIONS[conn.to];

                    if (!startArr || !endArr) return null;

                    const isUnlocked = (skills as any)[conn.from]?.unlocked && (skills as any)[conn.to]?.unlocked;

                    return (
                        <line
                            key={idx}
                            x1={`${startArr.x}%`}
                            y1={`${startArr.y}%`}
                            x2={`${endArr.x}%`}
                            y2={`${endArr.y}%`}
                            stroke={isUnlocked ? '#10b981' : '#292524'}
                            strokeWidth="2"
                            strokeDasharray={isUnlocked ? "" : "4 4"}
                        />
                    );
                })}
            </svg>

            {/* Header */}
            <div className="absolute top-8 left-8 z-20">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Sparkles className="w-5 h-5 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">精通技能樹 / Evolution_SkillTree</h2>
                </div>
                <p className="text-stone-500 text-[10px] font-bold uppercase tracking-widest leading-none">
                    解鎖主權永續的秘密 / Unlock the secrets of sovereign sustainability.
                </p>
            </div>

            {/* Knowledge XP Display */}
            <div className="absolute top-8 right-8 z-20 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-[8px] text-stone-500 font-black uppercase tracking-widest">知識池 / Knowledge_Pool</span>
                    <span className="text-xl font-black text-amber-500 tracking-tighter">{knowledgeXP} <span className="text-[10px] text-stone-600">XP</span></span>
                </div>
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-amber-500" />
                </div>
            </div>

            {/* Render Nodes */}
            <div className="relative w-full h-full">
                {Object.values(skills).map(renderNode)}
            </div>

            {/* Footer Tip */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-3/4 flex items-center justify-between px-6 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] text-white/50 uppercase font-black tracking-widest">系統狀態：等待經驗注入 / System Status: Awaiting Experience Infusion</span>
                </div>
                <div className="flex items-center gap-2 group cursor-pointer">
                    <span className="text-[8px] text-white font-black uppercase tracking-widest group-hover:text-emerald-400 transition-colors">開啟博導檔案 / Open Master's Archive</span>
                    <ChevronRight className="w-3 h-3 text-white/30 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </div>
    );
}
