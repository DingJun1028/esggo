import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sliders,
    ShieldCheck,
    Zap,
    Heart,
    Brain,
    Sparkles,
    Save,
    RefreshCw,
    Info,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CalibrationService, AgentTraits } from '@/services/CalibrationService';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { useOmniTheme } from '@/omni/infrastructure/ui/OmniThemeProvider';

const ResonanceCalibrationPage: React.FC = () => {
    const navigate = useNavigate();
    const { theme } = useOmniTheme();
    const [traits, setTraits] = useState<AgentTraits>({
        transparency: 50,
        efficiency: 50,
        altruism: 50,
        logic: 50,
        creativity: 50
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [lastSaved, setLastSaved] = useState<number | null>(null);

    const calibrationService = CalibrationService.getInstance();

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        setIsLoading(true);
        // Mock user ID for demo - in real app would come from auth context
        const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
        const config = await calibrationService.getConfiguration(mockUserId);
        if (config) {
            setTraits(config.traits);
        }
        setIsLoading(false);
    };

    const handleSliderChange = (trait: keyof AgentTraits, value: number) => {
        setTraits(prev => ({ ...prev, [trait]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
        const success = await calibrationService.saveConfiguration(mockUserId, traits);
        if (success) {
            setLastSaved(Date.now());
            omniLogger.info(LogCategory.SYSTEM, 'ResonanceCalibration', 'Configuration saved successfully');
        }
        setIsSaving(false);
    };

    const traitDefinitions = [
        { key: 'transparency', icon: ShieldCheck, label: 'Transparency', color: 'text-blue-400', desc: 'How much the agent explains its reasoning.' },
        { key: 'efficiency', icon: Zap, label: 'Efficiency', color: 'text-yellow-400', desc: 'Prioritize speed and directness over detail.' },
        { key: 'altruism', icon: Heart, label: 'Altruism', color: 'text-pink-400', desc: 'Focus on social and ethical impact.' },
        { key: 'logic', icon: Brain, label: 'Logic', color: 'text-purple-400', desc: 'Heavily weigh statistical and causal data.' },
        { key: 'creativity', icon: Sparkles, label: 'Creativity', color: 'text-orange-400', desc: 'Openness to non-traditional solutions.' },
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <RefreshCw className="w-12 h-12 text-tiffany-blue opacity-50" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans selection:bg-tiffany-blue/30">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-tiffany-blue/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sovereign-gold/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <header className="fixed top-0 left-0 right-0 h-24 px-8 z-50 flex justify-between items-center backdrop-blur-md bg-black/40 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                            title="Back to Dashboard"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xl font-extralight tracking-tight leading-none"
                            >
                                Resonance <span className="text-tiffany-blue font-light">Calibration</span>
                            </motion.h1>
                            <p className="text-[9px] text-gray-500 font-light uppercase tracking-widest mt-1.5 leading-none">
                                Fine-tune behavioral & cognitive resonance
                            </p>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full border transition-all duration-500 text-xs font-bold uppercase tracking-widest ${isSaving
                            ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-tiffany-blue/10 border-tiffany-blue/30 text-tiffany-blue hover:bg-tiffany-blue/20'
                            }`}
                    >
                        {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        <span>{isSaving ? 'Synchronizing...' : 'Lock Configuration'}</span>
                    </motion.button>
                </header>

                <div className="h-28" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Sliders */}
                    <section className="space-y-6">
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                            <Sliders className="w-4 h-4" /> Core Resonance Traits
                        </h2>

                        {traitDefinitions.map((trait, idx) => (
                            <motion.div
                                key={trait.key}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl group hover:border-white/20 transition-all duration-300"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-black/40 ${trait.color}`}>
                                            <trait.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-light text-lg">{trait.label}</h3>
                                        </div>
                                    </div>
                                    <span className={`text-2xl font-mono ${trait.color}`}>{traits[trait.key as keyof AgentTraits]}%</span>
                                </div>

                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={traits[trait.key as keyof AgentTraits]}
                                    onChange={(e) => handleSliderChange(trait.key as keyof AgentTraits, parseInt(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-tiffany-blue group-hover:accent-white transition-all"
                                />

                                <div className="mt-3 flex items-start gap-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Info className="w-3 h-3 mt-0.5" />
                                    <span>{trait.desc}</span>
                                </div>
                            </motion.div>
                        ))}
                    </section>

                    {/* Right Column: Visualization & Status */}
                    <section className="space-y-6">
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Cognitive Visualization
                        </h2>

                        <div className="aspect-square bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl relative flex items-center justify-center overflow-hidden">
                            {/* Radial Progress Grid */}
                            <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 opacity-10">
                                {Array.from({ length: 25 }).map((_, i) => (
                                    <div key={i} className="border-[0.5px] border-white/20" />
                                ))}
                            </div>

                            {/* Dynamic Aura */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.3, 0.5, 0.3],
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute w-64 h-64 rounded-full blur-[80px]"
                                style={{
                                    background: `conic-gradient(from 0deg, #81e6d980, #f6e05e80, #f687b380, #b794f480, #ed893680, #81e6d980)`
                                }}
                            />

                            {/* Core Symbol */}
                            <div className="relative z-10 text-center">
                                <div className="relative">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="absolute -inset-12 border border-tiffany-blue/20 rounded-full"
                                    />
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-tiffany-blue/30 to-sovereign-gold/10 flex items-center justify-center border border-white/20 shadow-[0_0_50px_rgba(129,230,217,0.2)]">
                                        <Brain className="w-10 h-10 text-white" />
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <p className="text-sm font-mono text-tiffany-blue tracking-tighter uppercase">Agent Resonance Fixed</p>
                                    <p className="text-xs text-gray-500 mt-1 italic">Vibe: {traits.creativity > 70 ? 'Visionary' : traits.logic > 70 ? 'Analytical' : 'Balanced'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Audit Status */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-green-400" /> Integrity Sync Status
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 font-light italic">Last Synchronized</span>
                                    <span className="text-gray-300">{lastSaved ? new Date(lastSaved).toLocaleTimeString() : 'Never'}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 font-light italic">Database Connection</span>
                                    <span className="text-green-500">Active</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ResonanceCalibrationPage;
