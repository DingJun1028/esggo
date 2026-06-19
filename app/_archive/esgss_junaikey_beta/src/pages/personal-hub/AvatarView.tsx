import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Zap,
    ShieldCheck,
    Activity,
    RefreshCw,
    CheckCircle2,
    Search,
    Trophy,
    Plus,
    Sparkles
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { avatarOrchestrator } from '@/omni/services/OmniAvatarOrchestrator';
import { AvatarPersona, PERSONA_CAPABILITIES } from '@/types/agency';
import { useI18n } from '../../utils/i18n';

const AGENT_ID = 'primary-agent';

export const AvatarView: React.FC = () => {
    const { t } = useI18n();
    const [activePersona, setActivePersona] = useState<AvatarPersona>(AvatarPersona.ANALYST);
    const [avatarRepo, setAvatarRepo] = useState<any>(null);
    const [isTransforming, setIsTransforming] = useState(false);

    const personaDetails = useMemo(() => PERSONA_CAPABILITIES[activePersona], [activePersona]);

    const activeAvatar = useMemo(() => {
        if (!avatarRepo || !avatarRepo.avatarStates) return null;
        return avatarRepo.avatarStates instanceof Map
            ? avatarRepo.avatarStates.get(activePersona)
            : (avatarRepo.avatarStates as any)[activePersona];
    }, [avatarRepo, activePersona]);

    const attributes = useMemo(() => {
        const baseDNA = { intelligence: 50, creativity: 50, empathy: 50, resilience: 50, precision: 50, speed: 50 };
        let currentDNA = baseDNA;
        if (activeAvatar && activeAvatar.capabilities && activeAvatar.capabilities.dnaModifiers) {
            const modifiers = activeAvatar.capabilities.dnaModifiers;
            currentDNA = {
                intelligence: baseDNA.intelligence + (modifiers.intelligence || 0),
                creativity: baseDNA.creativity + (modifiers.creativity || 0),
                empathy: baseDNA.empathy + (modifiers.empathy || 0),
                resilience: baseDNA.resilience + (modifiers.resilience || 0),
                precision: baseDNA.precision + (modifiers.precision || 0),
                speed: baseDNA.speed + (modifiers.speed || 0),
            };
        } else {
            const modifiers = personaDetails.dnaModifiers;
            currentDNA = {
                intelligence: baseDNA.intelligence + (modifiers.intelligence || 0),
                creativity: baseDNA.creativity + (modifiers.creativity || 0),
                empathy: baseDNA.empathy + (modifiers.empathy || 0),
                resilience: baseDNA.resilience + (modifiers.resilience || 0),
                precision: baseDNA.precision + (modifiers.precision || 0),
                speed: baseDNA.speed + (modifiers.speed || 0),
            };
        }
        return [
            { subject: t('avatar.attributes.wisdom'), value: Math.min(100, currentDNA.intelligence), full: 100 },
            { subject: t('avatar.attributes.benevolence'), value: Math.min(100, currentDNA.empathy), full: 100 },
            { subject: t('avatar.attributes.courage'), value: Math.min(100, currentDNA.resilience), full: 100 },
            { subject: t('avatar.attributes.integrity'), value: Math.min(100, currentDNA.precision), full: 100 },
            { subject: t('avatar.attributes.creation'), value: Math.min(100, currentDNA.creativity), full: 100 },
            { subject: t('avatar.attributes.agility'), value: Math.min(100, currentDNA.speed), full: 100 },
        ];
    }, [personaDetails, avatarRepo, activePersona, t]);

    useEffect(() => {
        const fetchAvatarState = async () => {
            const repo = avatarOrchestrator.getRepository(AGENT_ID);
            if (repo && repo.currentPersona) {
                setAvatarRepo({ ...repo });
                setActivePersona(repo.currentPersona);
            } else {
                await avatarOrchestrator.initializeAgents();
                const mockAgent = { id: AGENT_ID, name: 'Jun', role: 'Sovereign' } as any;
                await avatarOrchestrator.awaken(mockAgent, AvatarPersona.ANALYST);
                const newRepo = avatarOrchestrator.getRepository(AGENT_ID);
                if (newRepo && newRepo.currentPersona) {
                    setAvatarRepo({ ...newRepo });
                    setActivePersona(newRepo.currentPersona);
                }
            }
        };
        fetchAvatarState();
    }, []);

    const handlePersonaSwitch = async (persona: AvatarPersona) => {
        if (persona === activePersona) return;
        setIsTransforming(true);
        try {
            const repo = avatarOrchestrator.getRepository(AGENT_ID);
            if (repo && !repo.unlockedPersonas.includes(persona)) {
                await avatarOrchestrator.unlockPersona(AGENT_ID, persona);
            }
            await avatarOrchestrator.transformPersona(AGENT_ID, persona);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setActivePersona(persona);
            setAvatarRepo({ ...avatarOrchestrator.getRepository(AGENT_ID) });
        } catch (error) {
            console.error('Transformation failed:', error);
        } finally {
            setIsTransforming(false);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
            <AnimatePresence>
                {isTransforming && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050c14]/90 backdrop-blur-xl"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="size-96 rounded-full border-2 border-white/5 flex items-center justify-center border-dashed"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 left-0 size-96 rounded-full border border-[#63a6b0]/20 flex items-center justify-center"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="p-8 bg-[#63a6b0]/20 rounded-full mb-6"
                                >
                                    <RefreshCw className="w-16 h-16 text-[#63a6b0] animate-spin" />
                                </motion.div>
                                <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white mb-2">{t('avatar.persona.switch')}</h2>
                                <p className="text-[#63a6b0] text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">{t('avatar.persona.transforming')} / {t('avatar.persona.rewiring')}</p>
                            </div>
                        </div>

                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: "50%", y: "50%", opacity: 0, scale: 0 }}
                                    animate={{
                                        x: `${Math.random() * 100}%`,
                                        y: `${Math.random() * 100}%`,
                                        opacity: [0, 1, 0],
                                        scale: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 2 + Math.random() * 2,
                                        repeat: Infinity,
                                        delay: i * 0.1
                                    }}
                                    className="absolute size-2 bg-[#63a6b0] rounded-full blur-sm"
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Avatar Profile Header */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] flex flex-wrap items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="size-24 rounded-3xl bg-gradient-to-br from-[#63a6b0] to-[#ffd700] p-1">
                        <div className="w-full h-full bg-slate-950 rounded-[1.3rem] flex items-center justify-center text-[#63a6b0]">
                            {isTransforming ? (
                                <RefreshCw className="w-12 h-12 animate-spin opacity-50" />
                            ) : (
                                <User className="w-12 h-12" />
                            )}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white">
                            <span className="text-[#63a6b0]">OMNI</span>-JUN
                            <span className="text-brand-primary">OMNI</span>-JUN
                        </h2>
                        <div className="flex gap-2 mt-2">
                            <span className="px-3 py-1 bg-brand-primary/20 rounded-full text-[10px] font-black text-brand-primary uppercase">{t('avatar.persona.level')} {activeAvatar?.level || 1}</span>
                            <div className="flex gap-1">
                                {personaDetails.specialAbilities.slice(0, 2).map((ability, i) => (
                                    <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-white/5 rounded text-[9px] font-bold text-slate-400 uppercase border border-white/5">
                                        <ShieldCheck className="w-3 h-3 text-brand-primary" />
                                        {ability}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-10 bg-black/20 p-6 rounded-[2rem]">
                    <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{t('avatar.persona.current')}</p>
                        <p className="text-sm font-bold text-brand-secondary uppercase">{personaDetails.displayName}</p>
                    </div>
                    <div className="h-10 w-px bg-white/10" />
                    <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{t('avatar.persona.mastery')}</p>
                        <p className="text-sm font-mono text-white/50">{activeAvatar?.experience || 0} / 1000 XP</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Radar Chart */}
                <div className="lg:col-span-8 liquid-glass p-10">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3 text-white">
                            <Activity className="text-brand-primary" /> {t('avatar.attributes.matrix')}
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={attributes}>
                                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 900 }} />
                                    <Radar
                                        name="Avatar"
                                        dataKey="value"
                                        stroke="var(--brand-primary)"
                                        fill="var(--brand-primary)"
                                        fillOpacity={0.6}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-4">
                            {attributes.map((attr, idx) => (
                                <div key={attr.subject} className="bg-white/5 rounded-2xl p-4 flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-white/60 uppercase">{attr.subject}</span>
                                        <span className="text-xs font-mono font-bold text-brand-primary">{attr.value}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${attr.value}%` }} className="h-full bg-brand-primary" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Persona Selector & Assets */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="liquid-glass p-8">
                        <h3 className="text-xs font-black uppercase text-brand-primary mb-6 flex items-center gap-2">
                            <Zap size={14} /> {t('avatar.persona.switch')}
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.values(AvatarPersona).slice(0, 4).map((persona) => {
                                const isActive = activePersona === persona;
                                return (
                                    <button
                                        key={persona}
                                        onClick={() => handlePersonaSwitch(persona)}
                                        disabled={isTransforming}
                                        className={`p-4 rounded-2xl border transition-all text-center relative
                                            ${isActive ? 'bg-brand-primary border-brand-primary text-black shadow-lg scale-105' : 'bg-white/5 border-white/10 text-white/40 hover:border-brand-primary/50 hover:bg-white/10'}`}
                                    >
                                        <div className="text-[10px] font-black uppercase">{PERSONA_CAPABILITIES[persona].displayName}</div>
                                        {isActive && <CheckCircle2 size={12} className="absolute top-2 right-2" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Evolution Log (New) */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6 flex items-center gap-2 italic">
                            <Activity className="w-3 h-3" /> {t('avatar.logs.title')}
                        </h3>
                        <div className="space-y-4 relative ml-2">
                            <div className="absolute top-0 bottom-0 left-[7px] w-px bg-white/5" />
                            {avatarRepo?.transformHistory?.slice(-3).reverse().map((log: any) => (
                                <div key={log.transformId} className="relative flex gap-4 pl-4">
                                    <div className="absolute left-[-2px] top-1.5 size-4 rounded-full bg-[#050c14] border-2 border-white/10 flex items-center justify-center">
                                        <div className="size-1.5 bg-[#63a6b0] rounded-full" />
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-bold text-white/20 uppercase mb-0.5">{new Date(log.transformedAt as any).toLocaleTimeString()}</div>
                                        <p className="text-[10px] font-bold text-white/80 leading-tight">{t('avatar.logs.transformTo')} {PERSONA_CAPABILITIES[log.toPersona as AvatarPersona].displayName}</p>
                                    </div>
                                </div>
                            ))}
                            {(!avatarRepo?.transformHistory || avatarRepo.transformHistory.length === 0) && (
                                <div className="text-[10px] text-white/20 italic pl-4">{t('avatar.logs.empty')}</div>
                            )}
                        </div>
                    </div>

                    {/* Assets */}
                    <div className="bg-gradient-to-b from-[#63a6b0]/10 to-transparent border border-[#63a6b0]/20 p-8 rounded-[2.5rem]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xs font-black uppercase text-[#63a6b0] flex items-center gap-2">
                                <Trophy size={14} /> {t('avatar.assets.title')}
                            </h3>
                            <Plus size={14} className="text-[#63a6b0] cursor-pointer" />
                        </div>
                        <div className="space-y-3">
                            <div className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center gap-4 group hover:border-[#63a6b0]/50 transition-colors">
                                <ShieldCheck className="text-[#63a6b0] group-hover:scale-110 transition-transform" />
                                <div className="text-[11px] font-bold text-white">{t('avatar.assets.shield')} <span className="text-white/30 text-[9px] uppercase ml-1 block">{t('avatar.assets.locked')}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
