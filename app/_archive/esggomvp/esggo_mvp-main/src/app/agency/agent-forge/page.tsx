'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle, Sparkles, Activity, ShieldCheck, Cpu, Zap, Radio, Check } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useLanguage } from '@/components/LanguageProvider';
import { OmniAgent, AgentRole, AgentPersonality } from '@/core/OmniAgent';

export default function AgentForgePage() {
    const { t } = useLanguage();
    const [agentName, setAgentName] = useState('');
    const [selectedRole, setSelectedRole] = useState<AgentRole>('SENTINEL');
    const [selectedPersonality, setSelectedPersonality] = useState<AgentPersonality>('STOIC');
    const [isForging, setIsForging] = useState(false);
    const [createdAgents, setCreatedAgents] = useState<any[]>([]);

    const handleForge = () => {
        if (!agentName) return;
        setIsForging(true);

        setTimeout(() => {
            const newAgent = OmniAgent.forgeAgent(
                agentName,
                selectedRole,
                selectedPersonality,
                { wisdom: 10, benevolence: 8, integrity: 9, courage: 7, efficiency: 8, harmony: 9, temperance: 8 }
            );
            setCreatedAgents([newAgent, ...createdAgents]);
            setIsForging(false);
            setAgentName('');
        }, 2500);
    };

    const roles: { id: AgentRole; icon: any; color: string }[] = [
        { id: 'SENTINEL', icon: ShieldCheck, color: 'text-aqua' },
        { id: 'AUDITOR', icon: Check, color: 'text-purple-400' },
        { id: 'ANALYST', icon: Cpu, color: 'text-blue-400' },
        { id: 'SHEPHERD', icon: Activity, color: 'text-emerald-400' },
    ];

    const personalities: AgentPersonality[] = ['STOIC', 'ENTHUSIASTIC', 'ANALYTICAL', 'EMPATHETIC'];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-aqua pb-24">
            <PageHeader
                title={t.agent_forge.title}
                subtitle={t.agent_forge.subtitle}
                category="Agency"
            />

            <main className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-16">

                {/* 🧬 Creation Chamber */}
                <div className="space-y-12">
                    <div className="liquid-glass border border-white/10 rounded-[3rem] p-10 space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Sparkles size={120} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Agent Identity</label>
                            <input
                                type="text"
                                value={agentName}
                                onChange={(e) => setAgentName(e.target.value)}
                                placeholder="Enter Agent Name..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-bold focus:border-aqua outline-none transition-all"
                            />
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase">{t.agent_forge.aura}</label>
                            <div className="grid grid-cols-2 gap-4">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => setSelectedRole(role.id)}
                                        className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 ${selectedRole === role.id ? `bg-white/10 border-aqua ${role.color}` : 'bg-white/5 border-white/5 text-gray-400 grayscale'
                                            }`}
                                    >
                                        <role.icon size={32} />
                                        <span className="text-[10px] font-black tracking-widest uppercase">{role.id}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Personality Matrix */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase">{t.agent_forge.personality}</label>
                            <div className="flex flex-wrap gap-3">
                                {personalities.map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setSelectedPersonality(p)}
                                        className={`px-6 py-3 rounded-full border text-[10px] font-black tracking-widest uppercase transition-all ${selectedPersonality === p ? 'bg-aqua text-black border-aqua' : 'bg-white/5 border-white/5 text-gray-500'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            disabled={!agentName || isForging}
                            onClick={handleForge}
                            className="w-full py-6 rounded-full bg-white text-black font-black uppercase tracking-[0.4em] text-sm hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:hover:scale-100 transition-all flex items-center justify-center gap-4 group"
                        >
                            {isForging ? <Zap size={20} className="animate-spin text-aqua" /> : <Sparkles size={20} className="group-hover:animate-pulse" />}
                            {t.agent_forge.create}
                        </button>
                    </div>
                </div>

                {/* 🌌 Active Agency Hub */}
                <div className="space-y-8">
                    <h3 className="text-xs font-black tracking-[0.5em] text-gray-600 uppercase flex items-center gap-2">
                        <Radio size={14} className="animate-pulse" /> Active Agency Patrol
                    </h3>

                    <div className="space-y-4">
                        <AnimatePresence>
                            {createdAgents.map((agent) => (
                                <motion.div
                                    key={agent.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="liquid-glass p-6 border border-white/5 rounded-3xl flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="size-16 rounded-3xl border-2 border-white/10 flex items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: agent.auraColor }} />
                                            <UserCircle size={32} className="relative z-10" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold">{agent.name}</h4>
                                            <div className="flex gap-3 text-[8px] font-black tracking-widest uppercase text-gray-500">
                                                <span className="text-aqua">{agent.role}</span>
                                                <span>•</span>
                                                <span>{agent.personality}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] font-black text-aqua animate-pulse uppercase tracking-[0.2em]">PATROLLING...</span>
                                        <span className="text-[8px] italic text-gray-500 max-w-[150px] text-right">
                                            {OmniAgent.generateWhisper(agent, 'IDLE')}
                                        </span>
                                        <span className="text-[8px] font-mono text-gray-700">{agent.id}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {createdAgents.length === 0 && (
                            <div className="p-12 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-center opacity-30">
                                <UserCircle size={64} className="mb-4" />
                                <p className="text-[10px] font-black tracking-widest uppercase">No Agents Manifested</p>
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}
