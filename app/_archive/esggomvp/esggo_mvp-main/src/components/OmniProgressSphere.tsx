'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    Globe,
    ShieldCheck,
    Database,
    Activity,
    Sparkles
} from 'lucide-react';

interface OmniProgressSphereProps {
    progress: number; // 0 to 100
    unityScore: number;
    status: string;
}

export default function OmniProgressSphere({ progress, unityScore, status }: OmniProgressSphereProps) {
    // A stylized 3D sphere visualizer for report completion
    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-aqua/10 blur-[60px] rounded-full animate-pulse" />

            {/* Outer Orbit */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-white/5 rounded-full"
            />

            {/* Progress Ring 1 */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                    cx="128"
                    cy="128"
                    r="110"
                    fill="transparent"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="8"
                />
                <motion.circle
                    cx="128"
                    cy="128"
                    r="110"
                    fill="transparent"
                    stroke="#63a6b0"
                    strokeWidth="8"
                    strokeDasharray="691"
                    initial={{ strokeDashoffset: 691 }}
                    animate={{ strokeDashoffset: 691 - (691 * progress) / 100 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_rgba(99,162,176,0.6)]"
                />
            </svg>

            {/* Inner Core (The "Atom") */}
            <motion.div
                animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                        "0 0 20px rgba(99,162,176,0.2)",
                        "0 0 60px rgba(99,162,176,0.4)",
                        "0 0 20px rgba(99,162,176,0.2)"
                    ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-40 h-40 rounded-full bg-gradient-to-br from-black via-slate-900 to-black border border-aqua/30 flex flex-col items-center justify-center relative z-10 p-4 text-center overflow-hidden"
            >
                {/* Micro-animations inside core */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-aqua/5 to-transparent animate-pulse" />

                <div className="relative z-20">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-aqua/60 mb-1">Unification</p>
                    <div className="text-4xl font-black text-white italic tracking-tighter mb-1">
                        {progress}%
                    </div>
                    <div className="flex items-center justify-center gap-1">
                        <Activity size={10} className="text-aqua animate-pulse" />
                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{status}</span>
                    </div>
                </div>

                {/* Satellite Elements */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 border border-dashed border-white/10 rounded-full"
                />
            </motion.div>

            {/* Floating Protocol Labels */}
            {[
                { label: '5T', pos: 'top-0 left-1/2 -translate-x-1/2 -translate-y-8' },
                { label: 'GRI', pos: 'bottom-0 left-1/4 -translate-y-4' },
                { label: 'SASB', pos: 'bottom-0 right-1/4 -translate-y-4' }
            ].map((tag, i) => (
                <div key={i} className={`absolute ${tag.pos} px-2 py-0.5 bg-black/50 border border-white/10 rounded text-[8px] font-black text-gray-400 uppercase tracking-widest backdrop-blur-md`}>
                    {tag.label}
                </div>
            ))}
        </div>
    );
}
