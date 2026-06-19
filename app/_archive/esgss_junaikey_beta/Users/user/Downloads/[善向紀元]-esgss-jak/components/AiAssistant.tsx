
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Sparkles, X, ChevronRight, Bot, Maximize2, Minimize2, Loader2 } from 'lucide-react';
import { Language, View } from '../types';
import { streamChat } from '../services/ai-service';
import { useToast } from '../contexts/ToastContext';
import { marked } from 'marked';

interface AiAssistantProps {
    language: Language;
    onNavigate: (view: View) => void;
    currentView: View;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ language, onNavigate, currentView }) => {
    const isZh = language === 'zh-TW';
    const { addToast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{role: 'user' | 'model', content: string}[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [isThinkingMode, setIsThinkingMode] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isOpen, isTyping]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;
        
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        try {
            const systemPrompt = isThinkingMode 
                ? "You are a deep-reasoning AI assistant. Think step-by-step." 
                : "You are a helpful ESG assistant.";
            
            const stream = streamChat(userMsg, language, systemPrompt, [], [], 'gemini-3-flash-preview', isThinkingMode);
            
            let fullResponse = '';
            let hasStartedResponse = false;

            for await (const chunk of stream) {
                fullResponse += chunk.text || '';
                
                if (!hasStartedResponse) {
                    hasStartedResponse = true;
                    setMessages(prev => [...prev, { role: 'model', content: fullResponse }]);
                } else {
                    setMessages(prev => [
                        ...prev.slice(0, -1),
                        { role: 'model', content: fullResponse }
                    ]);
                }
            }
        } catch (error) {
            addToast('error', 'AI Service Unavailable', 'Assistant');
            setMessages(prev => [
                ...prev,
                { role: 'model', content: "I'm sorry, I encountered an error connecting to the neural core." }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 p-4 bg-celestial-purple text-white rounded-full shadow-2xl hover:scale-110 transition-all z-[150] group"
            >
                <Bot className="w-6 h-6" />
                <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    AI Assistant
                </span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl z-[150] flex flex-col overflow-hidden animate-slide-up origin-bottom-right">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-celestial-purple/20 rounded-xl">
                        <Bot className="w-5 h-5 text-celestial-purple" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">JunAiKey Assistant</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] text-gray-400 uppercase tracking-wider">Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsThinkingMode(!isThinkingMode)}
                        className={`p-2 rounded-lg transition-all ${isThinkingMode ? 'bg-celestial-gold/20 text-celestial-gold' : 'text-gray-500 hover:text-white'}`}
                        title="Toggle Deep Thinking"
                    >
                        <Sparkles className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                        <Bot className="w-16 h-16 mb-4" />
                        <p className="text-sm">How can I help you navigate the system today?</p>
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-500' : 'bg-celestial-purple/20'}`}>
                            {msg.role === 'user' ? <span className="text-xs font-bold">ME</span> : <Bot className="w-4 h-4 text-celestial-purple"/>}
                        </div>
                        <div className={`rounded-2xl p-3 text-sm max-w-[85%] leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none'}`}>
                            <div className="markdown-body" dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) as string }} />
                        </div>
                    </div>
                ))}
                
                {/* Typing Indicator: Show only when processing AND no model response has started yet (handled by message list) */}
                {isTyping && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex gap-3 animate-fade-in">
                        <div className="w-8 h-8 rounded-full bg-celestial-purple/20 flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4 text-celestial-purple"/>
                        </div>
                        <div className="bg-white/10 rounded-2xl rounded-tl-none p-4 flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-slate-950/50">
                <div className="relative">
                    <input 
                        value={input} 
                        onChange={e => setInput(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handleSend()} 
                        className={`w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:ring-1 focus:ring-celestial-purple outline-none transition-all ${isTyping ? 'opacity-50 cursor-wait bg-white/5' : ''}`} 
                        placeholder={isVoiceActive ? "Voice mode active..." : (isTyping ? "AI is reasoning..." : (isThinkingMode ? "Query with Deep Thinking..." : "Ask something..."))} 
                        disabled={isVoiceActive || isTyping} 
                    />
                    <button 
                        onClick={() => handleSend()} 
                        disabled={!input.trim() || isTyping || isVoiceActive} 
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-celestial-purple text-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-celestial-purple/80"
                    >
                        {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
};
