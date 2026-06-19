import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User as UserIcon, Bot } from 'lucide-react';
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";

interface TwinChatProps {
    twinId: string | null;
    twinName?: string;
    onSendMessage: (message: string) => Promise<void>;
    messages: { role: 'user' | 'assistant', content: string, timestamp: number }[];
    isLoading?: boolean;
}

export const TwinChat: React.FC<TwinChatProps> = ({ twinId, twinName, onSendMessage, messages, isLoading }) => {
    const [input, setInput] = useState('');

    const handleSend = async () => {
        if (!input.trim() || !twinId || isLoading) return;
        const msg = input;
        setInput('');
        await onSendMessage(msg);
    };

    return (
        <LiquidGlassContainer glowColor="blue" intensity="low" className="flex flex-col h-[500px]">
            <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-md rounded-t-3xl">
                <h3 className="text-white font-black tracking-widest text-lg ml-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    {twinName ? `${twinName} - 通訊鏈路` : '未連接 Twin (No Twin Connected)'}
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
                        此頻道尚無訊息，請發送場景參數以開始模擬...
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`
                                max-w-[80%] rounded-2xl p-4 flex gap-3
                                ${msg.role === 'user'
                                    ? 'bg-blue-600/20 border border-blue-500/30 rounded-br-sm'
                                    : 'bg-white/5 border border-white/10 rounded-bl-sm backdrop-blur-sm'}
                            `}>
                                <div className={`mt-0.5 ${msg.role === 'user' ? 'text-blue-400' : 'text-fuchsia-400'}`}>
                                    {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
                                </div>
                                <div className="text-sm font-['Outfit'] text-white/90 whitespace-pre-wrap leading-relaxed">
                                    {msg.content}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm p-4 flex gap-2 items-center">
                            <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-bounce"></span>
                            <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20 rounded-b-3xl flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={!twinId || isLoading}
                    placeholder={twinId ? "輸入決策場景或參數..." : "請先選擇 Twin"}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || !twinId || isLoading}
                    className="p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-xl transition-colors shrink-0"
                >
                    <Send size={18} />
                </button>
            </div>
        </LiquidGlassContainer>
    );
};
