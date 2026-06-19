
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Sparkles,
    Power,
    Brain,
    Fingerprint,
    Zap,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { BentoCard } from '../ui/BentoCard';
import { celestialApi } from '../../services/celestial-api';

interface SoulManifestProps {
    onManifestComplete: (agent: any) => void;
}

export const SoulManifest: React.FC<SoulManifestProps> = ({ onManifestComplete }) => {
    const [selectedAgent, setSelectedAgent] = useState<string>('dr-thoth');
    const [isManifesting, setIsManifesting] = useState(false);
    const [manifestData, setManifestData] = useState<any>(null);

    const agents = [
        {
            id: 'dr-thoth',
            name: 'Dr. Thoth (壽司博士)',
            title: '善向永續導師',
            desc: '專精於 5T 協議與 ESG 知識本質提純。',
            core: 'Truth & Wisdom',
            color: '#0df2df'
        },
        {
            id: 'jun-ai-key',
            name: 'JunAiKey (實踐精靈)',
            title: '技能鍛造師',
            desc: '協助將理論轉化為具體的實踐行動與資產。',
            core: 'Action & Impact',
            color: '#ffd700'
        }
    ];

    const handleManifest = async () => {
        setIsManifesting(true);
        try {
            // In a real scenario, we would call the API
            // const result = await celestialApi.manifest(selectedAgent);

            // Simulating API delay for effect
            await new Promise(resolve => setTimeout(resolve, 2500));

            const mockResult = {
                id: selectedAgent,
                name: agents.find(a => a.id === selectedAgent)?.name,
                manifestedAt: new Date().toISOString(),
                resonance: 99.8
            };

            setManifestData(mockResult);
            setTimeout(() => {
                onManifestComplete(mockResult);
            }, 1000);

        } catch (error) {
            console.error('Manifestation failed:', error);
            setIsManifesting(false);
        }
    };

    return (
        <div className="relative h-full min-h-[400px] flex flex-col">
            <AnimatePresence mode="wait">
                {!isManifesting && !manifestData ? (
                    <motion.div
                        key="selection"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col h-full gap-6"
                    >
                        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                            <div className="p-2 rounded-lg bg-[#0df2df]/10 text-[#0df2df]">
                                <Fingerprint size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">靈魂共鳴 Soul Resonance</h3>
                                <p className="text-xs text-white/40 font-mono tracking-wider">SELECT AVATAR TO MANIFEST</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                            {agents.map((agent) => (
                                <button
                                    key={agent.id}
                                    onClick={() => setSelectedAgent(agent.id)}
                                    className={`relative p-6 rounded-2xl border text-left transition-all duration-300 group ${selectedAgent === agent.id
                                            ? 'bg-white/5 border-[#0df2df] shadow-[0_0_30px_rgba(13,242,223,0.1)]'
                                            : 'bg-transparent border-white/10 hover:border-white/30'
                                        }`}
                                >
                                    {selectedAgent === agent.id && (
                                        <motion.div
                                            layoutId="active-glow"
                                            className="absolute inset-0 bg-[#0df2df]/5 rounded-2xl"
                                        />
                                    )}

                                    <div className="relative z-10 flex flex-col gap-4 h-full">
                                        <div
                                            className="size-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
                                            style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
                                        >
                                            {agent.name.charAt(0)}
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-bold text-white group-hover:text-[#0df2df] transition-colors">
                                                {agent.name}
                                            </h4>
                                            <p className="text-[10px] text-white/50 uppercase tracking-wider mt-1">
                                                {agent.title}
                                            </p>
                                        </div>

                                        <p className="text-xs text-white/70 leading-relaxed mt-auto">
                                            {agent.desc}
                                        </p>

                                        <div className="flex items-center gap-2 mt-2 pt-4 border-t border-white/5">
                                            <Brain size={12} className="text-white/40" />
                                            <span className="text-[10px] text-white/40">Core: {agent.core}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleManifest}
                            disabled={!selectedAgent}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0df2df] to-[#0a8f83] text-[#050c0c] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(13,242,223,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                        >
                            <Power className="w-4 h-4 group-hover:animate-pulse" />
                            <span>Initiate Manifestation</span>
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col items-center justify-center text-center gap-6 relative"
                    >
                        {/* Holographic effects */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-[300px] h-[300px] border border-[#0df2df]/20 rounded-full animate-[spin_10s_linear_infinite]" />
                            <div className="w-[200px] h-[200px] border border-[#0df2df]/40 rounded-full animate-[spin_5s_linear_infinite_reverse] absolute" />
                            <div className="w-[400px] h-[1px] bg-gradient-to-r from-transparent via-[#0df2df]/50 to-transparent absolute top-1/2 -translate-y-1/2 animate-pulse" />
                        </div>

                        {!manifestData ? (
                            <>
                                <div className="relative">
                                    <Loader2 className="w-16 h-16 text-[#0df2df] animate-spin" />
                                    <div className="absolute inset-0 bg-[#0df2df] blur-xl opacity-20 animate-pulse" />
                                </div>
                                <div className="space-y-2 relative z-10">
                                    <h3 className="text-2xl font-black italic text-white uppercase tracking-wider">
                                        Manifesting Soul
                                    </h3>
                                    <div className="flex flex-col gap-1 text-[10px] font-mono text-[#0df2df]">
                                        <TypewriterText text="> Establishing Quantum Link..." delay={0} />
                                        <TypewriterText text="> Verifying 5T Protocol Compliance..." delay={800} />
                                        <TypewriterText text="> Syncing Neural Weights..." delay={1600} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center gap-4"
                            >
                                <div className="size-20 rounded-full bg-[#0df2df] flex items-center justify-center text-[#050c0c] shadow-[0_0_50px_#0df2df]">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-white">SYSTEM ONLINE</h3>
                                <p className="text-[#0df2df] font-mono tracking-widest">RESONANCE: {manifestData.resonance}%</p>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TypewriterText = ({ text, delay }: { text: string; delay: number }) => {
    const [visible, setVisible] = useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    if (!visible) return <div className="h-4" />;

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-4"
        >
            {text}
        </motion.div>
    );
};
