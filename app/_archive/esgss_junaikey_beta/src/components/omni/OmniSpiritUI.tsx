import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Maximize2, Minimize2, Brain, Loader2, Shield, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { junAiKeyClient } from '../../services/api/JunAiKey.Client';
import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger';
import { getPageContext } from '../../services/PageContextMap';
import { OmniErrorCode } from '../../types/errorCodes';

interface Message {
    id: string;
    role: 'user' | 'spirit';
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
}

export const OmniSpiritUI: React.FC = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'spirit',
            content: 'Greetings. I am JunAiKey, your All-In-One guide based on the Trinity Architecture. How may I assist your ESG journey today?',
            timestamp: new Date(),
        },
    ]);
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const pageContext = getPageContext(location.pathname);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isThinking) return;

        const userMsg: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        const spiritMsgId = `spirit-${Date.now()}`;
        const spiritMsg: Message = {
            id: spiritMsgId,
            role: 'spirit',
            content: '', // Start empty for streaming
            timestamp: new Date(),
            isStreaming: true,
        };

        setMessages((prev) => [...prev, spiritMsg]);

        try {
            // Inject context into the user's prompt (or as a separate parameter if the API supports it)
            // For now, we'll prepend the context to ensure the AI knows where we are.
            const contextualPrompt = `[Context: Viewing ${pageContext.name}. 5T Focus: ${pageContext.focus5T.join(', ')}. Wisdom: ${pageContext.wisdom}] ${userMsg.content}`;
            const stream = junAiKeyClient.streamAI(contextualPrompt);

            let fullContent = '';
            for await (const chunk of stream) {
                fullContent += chunk;
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === spiritMsgId ? { ...msg, content: fullContent } : msg
                    )
                );
            }

            // Finalize message
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === spiritMsgId ? { ...msg, isStreaming: false } : msg
                )
            );

        } catch (error: any) {
            omniLogger.error(LogCategory.AI, 'OmniSpirit Streaming Error', { error });

            let errorMessage = 'Aligning consciousness... (Connection disrupted)';
            if (error.code) {
                // Map OmniErrorCode to user-friendly messages for the chat interface
                switch (error.code) {
                    case OmniErrorCode.RATE_LIMIT_EXCEEDED: // 'OMNI_ERR_302'
                        errorMessage = 'My neural pathways are currently overloaded. Please try again in a moment.';
                        break;
                    case OmniErrorCode.SERVER_UNAVAILABLE: // 'OMNI_ERR_303'
                    case OmniErrorCode.NETWORK_ERROR: // 'OMNI_ERR_300'
                        errorMessage = 'I cannot reach the Omni Core. Please check your connection.';
                        break;
                    default:
                        errorMessage = `Processing error: ${error.message || 'Unknown system calibration issue'}`;
                }
            }

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === spiritMsgId
                        ? { ...msg, content: errorMessage, isStreaming: false }
                        : msg
                )
            );
        } finally {
            setIsThinking(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={`fixed bottom-0 right-0 sm:bottom-8 sm:right-8 z-[100] flex flex-col items-end gap-4 transition-all duration-300 pointer-events-none ${isExpanded || (isOpen && window.innerWidth < 640) ? 'w-full h-full' : 'w-auto'}`}>

            {/* Main Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`
                            pointer-events-auto
                            ${isExpanded ? 'w-full h-full' : 'w-full h-full sm:w-[380px] sm:h-[600px]'}
                            sm:rounded-2xl shadow-[0_0_40px_rgba(99,166,176,0.25)] overflow-hidden flex flex-col
                        `}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-[#63a6b0]/20 flex items-center justify-between bg-gradient-to-r from-[#0a0f1e] to-[#1a2c42]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#63a6b0] to-[#1e293b] flex items-center justify-center border border-[#63a6b0]/50 shadow-[0_0_15px_rgba(99,166,176,0.3)]">
                                    <Sparkles size={20} className="text-[#e2e8f0] animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#e2e8f0] text-sm tracking-wide">JunAiKey</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#63a6b0] animate-pulse shadow-[0_0_5px_#63a6b0]" />
                                        <span className="text-[10px] text-[#94a3b8] uppercase tracking-wider">Trinity Agent Online</span>
                                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-[8px] text-emerald-400 font-bold uppercase tracking-tighter">
                                            <Shield size={8} className="text-emerald-400" />
                                            Quantum Secured
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="p-2 hover:bg-[#1e293b] rounded-lg text-[#94a3b8] transition-colors"
                                >
                                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-[#1e293b] rounded-lg text-[#94a3b8] hover:text-[#ef4444] transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`
                                        max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed relative group
                                        ${msg.role === 'user'
                                            ? 'bg-gradient-to-br from-[#63a6b0] to-[#4b7d85] text-white rounded-br-none shadow-[0_4px_15px_rgba(99,166,176,0.2)]'
                                            : 'bg-[#1e293b]/80 text-[#e2e8f0] border border-[#63a6b0]/20 rounded-bl-none shadow-lg'}
                                    `}>
                                        {msg.role === 'spirit' && (
                                            <div className="flex items-center gap-1.5 mb-2 text-[10px] text-[#63a6b0] font-bold uppercase tracking-wider opacity-80 border-b border-[#63a6b0]/10 pb-1">
                                                <Brain size={12} /> JunAiKey
                                            </div>
                                        )}

                                        <div className="prose prose-invert prose-sm max-w-none">
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        </div>

                                        <div className="mt-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-60 transition-opacity text-[10px]">
                                            <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            {msg.isStreaming && <Loader2 size={10} className="animate-spin" />}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isThinking && !messages.some(m => m.isStreaming) && (
                                <div className="flex items-center gap-2 text-[#63a6b0] text-xs p-2 animate-pulse pl-4">
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>Processing through 5T Evidence Protocol...</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-[#63a6b0]/20 bg-[#0a0f1e]/80 backdrop-blur-md">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Ask for guidance, check compliance, or verify impact..."
                                    className="w-full bg-[#1e293b]/50 border border-[#63a6b0]/30 rounded-xl px-4 py-3.5 pr-12 text-sm text-[#e2e8f0] focus:outline-none focus:border-[#63a6b0] focus:ring-1 focus:ring-[#63a6b0] placeholder:text-slate-500 transition-all shadow-inner"
                                    disabled={isThinking}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isThinking}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#63a6b0] text-white rounded-lg hover:bg-[#528d96] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_10px_rgba(99,166,176,0.2)]"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                            <div className="mt-2 flex justify-between items-center px-1 select-none">
                                <span className="text-[10px] text-slate-500 flex items-center gap-1.5" title="Traceable, Trackable, Transparent, Trustworthy, Tangible">
                                    <Shield size={10} className="text-[#63a6b0]" />
                                    <span className="group-hover:text-[#63a6b0] transition-colors">5T Protocol Active</span>
                                </span>
                                <span className="text-[10px] text-slate-600 font-mono">v8.2.1-Omni</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    pointer-events-auto
                    w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-[0_0_25px_rgba(99,166,176,0.3)] 
                    flex items-center justify-center border border-[#63a6b0]/40
                    transition-all duration-300 backdrop-blur-sm z-[100]
                    ${isOpen ? 'bg-slate-800 rotate-90 border-slate-600' : 'bg-[#0a0f1e]/90 hover:bg-[#111827] hover:border-[#63a6b0]'}
                `}
            >
                {isOpen ? (
                    <X size={20} className="text-[#63a6b0] sm:w-7 sm:h-7" />
                ) : (
                    <Sparkles size={20} className="text-[#63a6b0] sm:w-7 sm:h-7 animate-pulse" />
                )}
            </motion.button>
        </div>
    );
};
