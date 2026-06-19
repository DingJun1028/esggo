import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Cpu, Database, Tag, Sparkles } from 'lucide-react';
import { omniClient } from '../api/omniClient';
import type { Message, ApiResponse } from '../../shared/types';
import { OmniRequestType } from '../../shared/types';

/**
 * 🌌 OmniCoreChat UI Component
 * Features a deep space theme with liquid glass effects.
 */
export const OmniCoreChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [trustScore, setTrustScore] = useState(0.99);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const response: ApiResponse = await omniClient.process(input);

            const aiMsg: Message = {
                id: response.metadata.uuid,
                role: "assistant",
                content: response.content,
                timestamp: response.metadata.timestamp,
                metadata: response.data as unknown as Record<string, any>
            };

            setMessages(prev => [...prev, aiMsg]);
            setTrustScore(response.metadata.trustScore);
        } catch (error) {
            console.error("OmniCore Chat Error:", error);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0f1e] text-white p-6 rounded-3xl border border-[#63a6b0]/20 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            {/* 🌌 Background Glimmer */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#63a6b0]/5 to-transparent pointer-events-none" />

            {/* 💎 Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-sm border-white/10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#63a6b0]/20 rounded-xl">
                        <Cpu className="text-[#63a6b0]" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">萬能心核 (Universal Heart Core)</h2>
                        <p className="text-xs text-white/50">OmniCore v1.0.0 · Trust Score: {(trustScore * 100).toFixed(1)}%</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Sparkles className="text-amber-400 opacity-50" size={18} />
                    <Database className="text-[#63a6b0] opacity-50" size={18} />
                </div>
            </div>

            {/* 💬 Chat Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                            ? 'bg-[#63a6b0]/20 border border-[#63a6b0]/40'
                            : 'bg-white/5 border border-white/10'
                            } backdrop-blur-md`}>
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                            <span className="text-[10px] opacity-30 mt-2 block italic">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    </motion.div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                            <motion.div
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="w-8 h-2 bg-[#63a6b0]/50 rounded-full"
                            />
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* ⌨️ Input Area */}
            <div className="mt-6 flex gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="輸入意圖 (Intent)..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-[#63a6b0]/50 transition-all"
                />
                <button
                    onClick={handleSend}
                    className="p-3 bg-[#63a6b0] hover:bg-[#63a6b0]/80 rounded-2xl transition-all shadow-lg shadow-[#63a6b0]/20"
                >
                    <Send size={20} />
                </button>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 166, 176, 0.3); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default OmniCoreChat;
