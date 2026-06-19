'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Settings as SettingsIcon, Zap, Globe, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useLanguage } from '@/components/LanguageProvider';

export default function SettingsPage() {
    const { locale, setLocale } = useLanguage();
    const [julesKey, setJulesKey] = useState('');
    const [geminiKey, setGeminiKey] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setJulesKey(localStorage.getItem('JULES_API_KEY') || '');
            setGeminiKey(localStorage.getItem('GEMINI_API_KEY') || '');
        }
    }, []);

    const handleSaveAPIKeys = () => {
        if (julesKey) {
            import('@/lib/jules-client').then(m => m.julesClient.setApiKey(julesKey));
        }
        if (geminiKey) {
            import('@/core/GeminiService').then(m => m.GeminiService.setApiKey(geminiKey));
        }
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <header className="mb-8">
                <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                    <SettingsIcon className="text-omni-primary" />
                    <span>{locale === 'zh-TW' ? '系統設定' : 'System Configuration'}</span>
                </h1>
                <p className="text-omni-text-muted text-sm">
                    {locale === 'zh-TW' ? '調整全域偏好與接取權限' : 'Global preferences and access controls'}
                </p>
            </header>

            <div className="flex justify-center">
                {/* API Settings */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="liquid-glass rounded-2xl p-6 w-full max-w-md border border-omni-glass-border"
                >
                    <h3 className="font-bold flex items-center gap-2 mb-6 text-omni-text-main border-b border-omni-glass-border pb-3">
                        <Cpu className="text-omni-primary" size={18} />
                        核心授權 (Core Auth)
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-omni-text-muted uppercase tracking-widest">Jules Engine Key</label>
                            <input
                                type="password"
                                value={julesKey}
                                onChange={(e) => setJulesKey(e.target.value)}
                                placeholder="Jules API Key"
                                className="w-full bg-omni-surface-2 border border-omni-glass-border rounded-xl px-4 py-2 text-sm outline-none focus:border-omni-primary transition-all text-omni-text-main font-mono"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-omni-text-muted uppercase tracking-widest">Sentient Gemini Key</label>
                            <input
                                type="password"
                                value={geminiKey}
                                onChange={(e) => setGeminiKey(e.target.value)}
                                placeholder="Gemini API Key"
                                className="w-full bg-omni-surface-2 border border-omni-glass-border rounded-xl px-4 py-2 text-sm outline-none focus:border-omni-primary transition-all text-omni-text-main font-mono"
                            />
                        </div>

                        <button
                            onClick={handleSaveAPIKeys}
                            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all mt-6 ${isSaved ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-omni-primary text-white hover:opacity-90 active:scale-95 shadow-lg shadow-omni-primary/20'}`}
                        >
                            {isSaved ? <ShieldCheck size={18} /> : <Zap size={18} />}
                            {isSaved ? '已授權存取 (Authorized)' : '更新金鑰 (Update Keys)'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
