'use client';

import React, { useState, useEffect, useRef } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Send, Bot, User, Activity, ShieldCheck, Target, Cpu } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { chat } from '@/lib/ollama';
import { RagEngine } from '@/core/rag-engine';
import { SkillRegistry, ISkillPackage } from '@/core/omni-agent-skills';

/**
 * 🔮 OmniAI Universal Light-Sphere (萬能光球)
 * 整合「服務即教學」與「知識即資產」的核心樞紐。
 */
export default function AIAssistantPage() {
    const { t, locale } = useLanguage();
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [availableSkills, setAvailableSkills] = useState<ISkillPackage[]>([]);

    useEffect(() => {
        // Fetch all registered skills on mount
        setAvailableSkills(SkillRegistry.listAll());
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userText = input;
        const userMessage = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // 1. Retrieve Context via RagEngine
            const contextChunks = await RagEngine.query(userText);
            const contextText = RagEngine.formatContext(contextChunks);

            // 2. Prepare Messages with Context
            const systemPrompt = `你是一個萬能級 AI 代理總和「萬能光球 OmniAI」。
以下是從 ESG 知識庫中檢索到的相關資訊，請參考這些資訊來回答使用者的問題：

${contextText}

請用溫暖、宏大、且專業的語氣回答。`;

            const response = await chat([
                { role: 'system', content: systemPrompt },
                ...messages,
                userMessage
            ]);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: '抱歉，萬能光球目前感應中斷，請稍後再試。' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-120px)] flex flex-col gap-8">
            <PageHeader
                title={locale === 'zh-TW' ? '萬能光球 (OmniAI)' : 'OmniAI Universal Sphere'}
                subtitle={locale === 'zh-TW' ? '融合 5T 協議的萬能級認知智能' : 'Universal Cognitive Intelligence with 5T Protocol'}
                category="認知智能助理"
            />

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
                {/* Left: The Universal Light-Sphere (Visual Core) */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center relative bg-black/20 rounded-[2.5rem] border border-white/5 overflow-hidden p-8">
                    <div className="absolute inset-0 bg-gradient-to-b from-aqua/10 via-transparent to-transparent opacity-30" />

                    {/* 🔮 The Light-Sphere */}
                    <div className="relative w-64 h-64 lg:w-80 lg:h-80 flex items-center justify-center">
                        {/* Outer Glows */}
                        <div className="absolute inset-0 bg-aqua/20 blur-[80px] rounded-full animate-pulse" />
                        <motion.div
                            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                            transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity } }}
                            className="absolute inset-[-20px] border border-dashed border-aqua/30 rounded-full"
                        />

                        {/* Central Sphere */}
                        <motion.div
                            animate={{
                                boxShadow: [
                                    "0 0 20px rgba(99,162,176,0.2)",
                                    "0 0 80px rgba(99,162,176,0.6)",
                                    "0 0 20px rgba(99,162,176,0.2)"
                                ]
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="w-48 h-48 lg:w-60 lg:h-60 rounded-full bg-gradient-to-br from-white/20 via-black to-aqua/40 border border-white/20 relative z-10 flex flex-col items-center justify-center overflow-hidden backdrop-blur-xl"
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,162,176,0.4),transparent)]" />
                            <Sparkles className="text-aqua animate-pulse mb-2" size={48} />
                            <span className="text-[10px] font-black text-aqua tracking-[0.5em] uppercase">OmniAI</span>
                        </motion.div>

                        {/* Orbiting Elements */}
                        <div className="absolute top-0 right-10 bg-black/60 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-2">
                            <Activity size={12} className="text-aqua" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Swarm Sync</span>
                        </div>
                        <div className="absolute top-10 left-[-20px] bg-black/60 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-2">
                            <Bot size={12} className="text-purple-400" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">OmniCrew+</span>
                        </div>
                        <div className="absolute bottom-10 left-0 bg-black/60 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-2">
                            <ShieldCheck size={12} className="text-gold" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">OpenCrew+ Secure</span>
                        </div>
                    </div>

                    <div className="mt-12 text-center z-20">
                        <h3 className="text-xl font-bold text-white mb-2">
                            {locale === 'zh-TW' ? '萬能級 ADK 模組：啟動' : 'Universal ADK Module: Active'}
                        </h3>
                        <p className="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed italic">
                            「融合 Swarm 蜂群協作與 OpenCrew/OmniCrew 角色分工。服務即教學，我是您的萬能代理總和。」
                        </p>
                    </div>
                </div>

                {/* Right: Intelligence Hub (Chat Area) */}
                <div className="lg:col-span-7 flex flex-col bg-black/20 rounded-[2.5rem] border border-white/5 overflow-hidden">
                    {/* Chat Messages */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10"
                    >
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50 text-center p-8">
                                <Bot size={48} className="mb-4" />
                                <p className="text-sm uppercase font-black tracking-widest">
                                    {locale === 'zh-TW' ? '等待光球感應...' : 'Waiting for connection...'}
                                </p>
                            </div>
                        ) : (
                            messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`size-10 rounded-2xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-gold/20 text-gold' : 'bg-aqua/20 text-aqua'
                                        }`}>
                                        {msg.role === 'user' ? <User size={20} /> : <Zap size={20} />}
                                    </div>
                                    <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-gold/10 text-white rounded-tr-none border border-gold/20'
                                        : 'bg-white/5 text-gray-200 rounded-tl-none border border-white/5'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))
                        )}
                        {isLoading && (
                            <div className="flex gap-4">
                                <div className="size-10 rounded-2xl bg-aqua/20 text-aqua flex items-center justify-center shrink-0 animate-pulse">
                                    <Zap size={20} />
                                </div>
                                <div className="p-4 bg-white/5 rounded-3xl rounded-tl-none border border-white/5 flex gap-1 items-center">
                                    <div className="w-1.5 h-1.5 bg-aqua rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1.5 h-1.5 bg-aqua rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 bg-aqua rounded-full animate-bounce" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 🛠️ Skills Panel (代理技能包快捷列) */}
                    {availableSkills.length > 0 && (
                        <div className="px-6 py-3 border-t border-white/5 bg-black/30">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <Cpu size={10} className="text-aqua" />
                                {locale === 'zh-TW' ? '代理技能包' : 'Agent Skills'}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {availableSkills.map((skill) => (
                                    <motion.button
                                        key={skill.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setInput(`[技能] ${skill.name}: `)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-aqua/5 border border-aqua/20 rounded-full text-[11px] font-semibold text-aqua hover:bg-aqua/10 hover:border-aqua/40 transition-all"
                                        title={skill.description}
                                    >
                                        <Target size={10} />
                                        {skill.name}
                                        <span className="text-gray-600 text-[9px] font-mono">⚡{skill.energyCost}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-6 bg-black/40 border-t border-white/5">
                        <div className="relative flex items-center gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder={locale === 'zh-TW' ? '向萬能光球提問...' : 'Ask OmniAI...'}
                                className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm outline-none focus:border-aqua transition-all text-white placeholder:text-gray-600"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !input.trim()}
                                className="size-12 bg-aqua rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(99,162,176,0.3)] disabled:opacity-50 disabled:scale-100"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
