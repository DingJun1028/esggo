import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Save, RefreshCw, MessageSquare, Sliders, BrainCircuit } from 'lucide-react';
import { BentoCard } from '../../components/ui/BentoCard';
import Button from '../../components/ui/Button';
import { omniGemini } from '../../services/OmniGeminiService';

interface PersonaConfig {
    name: string;
    tone: string;
    strictness: number;
    focus: string;
}

export const AgentPersonaConfigPage = () => {
    const [config, setConfig] = useState<PersonaConfig>({
        name: 'Sovereign Mentor',
        tone: 'Socratic',
        strictness: 5,
        focus: 'General'
    });
    const [loading, setLoading] = useState(false);
    const [testMessage, setTestMessage] = useState('');
    const [testResponse, setTestResponse] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('agent_persona_config');
        if (saved) {
            setConfig(JSON.parse(saved));
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('agent_persona_config', JSON.stringify(config));
        // In a real app, we'd also update the AgentCore instance
        // For now, this is persisted state
        alert('Persona Configuration Saved!');
    };

    const handleTestChat = async () => {
        if (!testMessage) return;
        setLoading(true);
        try {
            // Simulate/Real Call with context
            const response = await geminiService.chat(testMessage, {
                systemInstruction: `Act as ${config.name}. Tone: ${config.tone}. Strictness: ${config.strictness}/10.`
            });
            setTestResponse(response);
        } catch (error) {
            setTestResponse('Error connecting to neural core.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2 flex items-center gap-3">
                        <BrainCircuit className="text-primary" size={32} />
                        Agent Persona Forge
                    </h1>
                    <p className="text-white/40 font-light">Customize the soul of your digital companion.</p>
                </div>
                <Button onClick={handleSave} className="gap-2">
                    <Save size={16} /> Save Configuration
                </Button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Configuration Panel */}
                <BentoCard title="Core Personality Traits" icon={<Sliders size={20} />} gridSpan={1}>
                    <div className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-secondary">Agent Name</label>
                            <input
                                type="text"
                                value={config.name}
                                onChange={e => setConfig({ ...config, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary/50 outline-none transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-secondary">Communication Tone</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Professional', 'Casual', 'Socratic', 'Empathetic', 'Strict', 'Pirate'].map(tone => (
                                    <button
                                        key={tone}
                                        onClick={() => setConfig({ ...config, tone })}
                                        className={`p-2 rounded-lg text-xs font-bold border transition-all ${config.tone === tone
                                            ? 'bg-primary/20 border-primary text-primary'
                                            : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                                            }`}
                                    >
                                        {tone}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <label className="text-xs uppercase tracking-widest text-secondary">Strictness Level</label>
                                <span className="text-primary font-mono">{config.strictness}/10</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={config.strictness}
                                onChange={e => setConfig({ ...config, strictness: parseInt(e.target.value) })}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <p className="text-[10px] text-white/30 italic">
                                Higher values increase adherence to 5T protocols but reduce creative flexibility.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-secondary">Focus Area</label>
                            <select
                                value={config.focus}
                                onChange={e => setConfig({ ...config, focus: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary/50 outline-none transition-colors"
                            >
                                <option value="General">General</option>
                                <option value="Environment">Environment (E)</option>
                                <option value="Social">Social (S)</option>
                                <option value="Governance">Governance (G)</option>
                            </select>
                        </div>
                    </div>
                </BentoCard>

                {/* Preview / Test Panel */}
                <BentoCard title="Neural Resonance Test" icon={<Bot size={20} />} gridSpan={1}>
                    <div className="flex flex-col h-[400px] gap-4 pt-4">
                        <div className="flex-1 bg-black/20 rounded-xl p-4 overflow-y-auto border border-white/5 space-y-4">
                            {!testResponse && (
                                <div className="flex items-center justify-center h-full text-white/20 text-sm italic">
                                    Initiate test sequence...
                                </div>
                            )}
                            {testResponse && (
                                <div className="flex items-start gap-4">
                                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <Bot size={16} className="text-primary" />
                                    </div>
                                    <div className="bg-white/5 rounded-2xl rounded-tl-none p-3 text-sm text-white/80 leading-relaxed">
                                        {testResponse}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={testMessage}
                                onChange={e => setTestMessage(e.target.value)}
                                placeholder="Ask something..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50"
                                onKeyDown={e => e.key === 'Enter' && handleTestChat()}
                            />
                            <Button onClick={handleTestChat} variant="primary" disabled={loading}>
                                {loading ? <RefreshCw className="animate-spin" size={18} /> : <MessageSquare size={18} />}
                            </Button>
                        </div>
                    </div>
                </BentoCard>
            </div>
        </div>
    );
};
