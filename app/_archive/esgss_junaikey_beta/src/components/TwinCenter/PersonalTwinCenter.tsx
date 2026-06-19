
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User, Shield, Award, TrendingUp, Zap, Hash, Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // Assuming context exists
import { IPersonalTwin } from '../../types/twin/index.js';
import { digitalTwinService } from '../../../server/services/DigitalTwinService.js'; // Direct service for demo

export const PersonalTwinCenter: React.FC = () => {
    const { user } = useAuth();
    const [twin, setTwin] = useState<IPersonalTwin | null>(null);

    useEffect(() => {
        // Hydrate Twin Data (Simulation)
        const loadTwin = async () => {
            // In a real app, fetch via API. Here we assume a simulation or auto-mint.
            // For visual demo, we mint a mock if not exists or fetch.
            const demo = await digitalTwinService.mintPersonalTwin({
                userId: user?.uid || 'demo-user',
                displayName: user?.displayName || 'Traveler',
                description: 'Exploring the Impact Nexus.'
            });
            setTwin(demo);
        };
        loadTwin();
    }, [user]);

    if (!twin) return <div className="p-10 text-center text-cyan-400">Initializing Digital Twin...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 text-white">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                        Personal Digital Twin
                    </h1>
                    <p className="text-slate-400">Identity: <span className="font-mono text-xs text-emerald-400">{twin.twinId}</span></p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs border border-purple-500/30">
                        Level {twin.level}
                    </span>
                </div>
            </header>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 1. Avatar Card (Large Left) */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="md:col-span-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />

                    <div className="relative w-48 h-48 rounded-full border-4 border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.3)] mb-6 flex items-center justify-center bg-black">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <User size={64} className="text-cyan-400" />
                        )}
                        <div className="absolute inset-0 border border-white/10 rounded-full animate-pulse"></div>
                    </div>

                    <h2 className="text-2xl font-bold">{twin.displayName}</h2>
                    <p className="text-cyan-400 text-sm mb-4">{twin.avatarProfile.archetype}</p>

                    <div className="w-full space-y-2">
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>Evolution</span>
                            <span>{twin.balance.xp} / 1000 XP</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 w-[45%]" />
                        </div>
                    </div>
                </motion.div>

                {/* Right Column Grid */}
                <div className="md:col-span-2 grid grid-cols-2 gap-6">

                    {/* 2. Impact Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
                    >
                        <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                            <Activity size={18} className="text-amber-400" /> Impact Metrics
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-white/5 rounded-xl text-center">
                                <div className="text-2xl font-bold text-white">12</div>
                                <div className="text-xs text-slate-400">Carbon Credits</div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl text-center">
                                <div className="text-2xl font-bold text-white">4</div>
                                <div className="text-xs text-slate-400">Trees Planted</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 3. Badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
                    >
                        <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                            <Award size={18} className="text-purple-400" /> Badges
                        </h3>
                        <div className="flex gap-2 flex-wrap">
                            {['Early Adopter', 'Green Pioneer', 'Guardian'].map((badge, i) => (
                                <span key={i} className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-300">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* 4. Career Path / Skills (Wide) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="col-span-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
                    >
                        <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                            <Zap size={18} className="text-yellow-400" /> Career Alignment
                        </h3>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="text-xs text-slate-500">Current</div>
                                    <div className="font-bold">{twin.careerPath.currentRole}</div>
                                </div>
                                <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                                <div>
                                    <div className="text-xs text-slate-500">Target</div>
                                    <div className="font-bold text-cyan-400">{twin.careerPath.targetRole}</div>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-sm border border-cyan-500/30 transition-all">
                                Update Path
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* 5T Protocol Identity Footer */}
            <div className="mt-8 pt-6 border-t border-white/5">
                <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Shield size={12} className="text-emerald-500" /> 5T Protocol Identity Verification
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs font-mono">

                    {/* Tangible */}
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2 mb-1 text-emerald-400">
                            <Award size={14} /> <span>Tangible (可感知)</span>
                        </div>
                        <div className="text-slate-400 truncate">Visualized: Yes</div>
                    </div>

                    {/* Traceable */}
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2 mb-1 text-blue-400">
                            <TrendingUp size={14} /> <span>Traceable (可溯源)</span>
                        </div>
                        <div className="text-slate-400 truncate" title={twin.evidence.traceable?.source_origin}>
                            src: {twin.evidence.traceable?.source_origin || 'Unknown'}
                        </div>
                    </div>

                    {/* Trackable */}
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2 mb-1 text-amber-400">
                            <Activity size={14} /> <span>Trackable (可追蹤)</span>
                        </div>
                        <div className="text-slate-400 truncate">
                            hooks: {(twin.evidence as any).trackable?.lifecycle_hooks?.length || 0}
                        </div>
                    </div>

                    {/* Transparent */}
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2 mb-1 text-purple-400">
                            <Zap size={14} /> <span>Transparent (可透明)</span>
                        </div>
                        <div className="text-slate-400 truncate" title={(twin.evidence as any).transparent?.formula}>
                            {(twin.evidence as any).transparent?.formula || 'Standard'}
                        </div>
                    </div>

                    {/* Trustworthy */}
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2 mb-1 text-red-400">
                            <Hash size={14} /> <span>Trustworthy (不可篡改)</span>
                        </div>
                        <div className="text-slate-400 truncate" title={twin.evidence.trustworthy?.hash_lock}>
                            {twin.evidence.trustworthy?.hash_lock?.substring(0, 12)}...
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
