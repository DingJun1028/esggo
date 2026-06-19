
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, StopCircle, RefreshCw, Zap, Brain, Sparkles, User, Bot } from 'lucide-react';
import { celestialApi, ChatEvent, InteractionMessage } from '../../services/celestial-api';

interface ResonanceChamberProps {
    agentid: string;
    agentName: string;
}

interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
    type: 'text' | 'thought' | 'skill';
    timestamp: number;
}

export const ResonanceChamber: React.FC<ResonanceChamberProps> = ({ agentid, agentName }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [currentThought, setCurrentThought] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<(() => void) | null>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, currentThought]);

    const handleSend = async () => {
        if (!input.trim() || isStreaming) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            type: 'text',
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsStreaming(true);

        const history: InteractionMessage[] = messages
            .filter(m => m.type === 'text') // Only send text history for now
            .map(m => ({
                role: m.role,
                parts: [{ text: m.content }]
            }));

        // Optimistic model message
        const modelMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, {
            id: modelMsgId,
            role: 'model',
            content: '', // Start empty
            type: 'text',
            timestamp: Date.now(),
        }]);

        abortControllerRef.current = celestialApi.interact(
            agentid,
            userMsg.content,
            history,
            (event: ChatEvent) => {
                if (event.type === 'thought') {
                    setCurrentThought(prev => (prev ? prev + event.content : event.content));
                } else if (event.type === 'text') {
                    setMessages(prev => prev.map(m =>
                        m.id === modelMsgId
                            ? { ...m, content: m.content + (event.content || '') }
                            : m
                    ));
                } else if (event.type === 'done') {
                    setIsStreaming(false);
                    setCurrentThought(null);
                } else if (event.type === 'error') {
                    setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        role: 'model',
                        content: `Error: ${event.content}`,
                        type: 'text',
                        timestamp: Date.now(),
                    }]);
                    setIsStreaming(false);
                }
            }
        );
    };

    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current();
            setIsStreaming(false);
            setCurrentThought(null);
        }
    };

    return (
        <div className="flex flex-col h-full bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-[#0df2df]/20 flex items-center justify-center text-[#0df2df]">
                        <Bot size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">{agentName}</h3>
                        <div className="flex items-center gap-2">
                            <span className={`size-1.5 rounded-full ${isStreaming ? 'bg-[#0df2df] animate-pulse' : 'bg-white/30'}`} />
                            <span className="text-[10px] text-white/50 uppercase tracking-wider">
                                {isStreaming ? 'Resonating...' : 'Dormant'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-[#ffd700]">
                        RESONANCE: 99.8%
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.role === 'model' && (
                            <div className="size-8 rounded-full bg-[#0df2df]/20 flex-shrink-0 flex items-center justify-center mt-1">
                                <Sparkles size={14} className="text-[#0df2df]" />
                            </div>
                        )}

                        <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div
                                className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-[#0df2df]/10 border border-[#0df2df]/20 text-white rounded-tr-none'
                                        : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none'
                                    }`}
                            >
                                {msg.content}
                            </div>
                            <span className="text-[10px] text-white/30 px-2">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>

                        {msg.role === 'user' && (
                            <div className="size-8 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center mt-1">
                                <User size={14} className="text-white" />
                            </div>
                        )}
                    </motion.div>
                ))}

                {/* Current Thought Stream */}
                <AnimatePresence>
                    {currentThought && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex justify-start gap-4"
                        >
                            <div className="size-8 flex-shrink-0 flex items-center justify-center">
                                <Brain size={16} className="text-pink-400 animate-pulse" />
                            </div>
                            <div className="p-4 rounded-2xl bg-pink-500/5 border border-pink-500/20 text-pink-200/80 text-xs font-mono italic max-w-[80%] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-pink-500/50" />
                                <p className="mb-2 text-[10px] uppercase tracking-widest text-pink-500 font-bold opacity-70">Internal Monologue</p>
                                {currentThought}
                                <span className="inline-block w-1 h-3 ml-1 bg-pink-500 animate-blink" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-white/5">
                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder={isStreaming ? "Listening..." : "Send a message to the Omnipotent Think Tank..."}
                        disabled={isStreaming}
                        className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0df2df]/50 transition-colors disabled:opacity-50"
                    />

                    {isStreaming ? (
                        <button
                            onClick={handleStop}
                            className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all"
                        >
                            <StopCircle size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="p-3 rounded-xl bg-[#0df2df]/10 border border-[#0df2df]/20 text-[#0df2df] hover:bg-[#0df2df]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={18} />
                        </button>
                    )}
                </div>
                <p className="text-[10px] text-white/20 text-center mt-2 font-mono">
                    Omnipotent Think Tank v2.0 - 5T Protocol Enabled
                </p>
            </div>
        </div>
    );
};
