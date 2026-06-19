import React, { useState, useRef, useEffect } from 'react';
import { BentoCard } from '../layout/BentoCard';
import { CircularProgress } from '@mui/material';
import { MessageSquare, Send as SendIcon, Bot, User } from 'lucide-react';

interface ChatMessage {
    role: 'user' | 'agent';
    text: string;
    tools?: string[];
    workflowState?: any;
}

interface AdkAssistantCardProps {
    messages: ChatMessage[];
    loading: boolean;
    onSend: (query: string) => void;
    className?: string;
    onGuidanceClick?: () => void;
}

export const AdkAssistantCard: React.FC<AdkAssistantCardProps> = ({
    messages,
    loading,
    onSend,
    className,
    onGuidanceClick
}) => {
    const [query, setQuery] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendClick = () => {
        if (!query.trim()) return;
        onSend(query);
        setQuery('');
    };

    return (
        <BentoCard
            colSpan={8}
            rowSpan={3}
            title="ADK Intelligent Lab"
            subtitle="5T Protocol Driven Research"
            icon={<Bot size={24} />}
            className={className}
            onGuidanceClick={onGuidanceClick}
        >
            <div className="flex flex-col h-full bg-white/5 rounded-xl overflow-hidden border border-white/10">
                {/* Chat History Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
                >
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full opacity-30 text-aqua-100">
                            <Bot size={48} className="mb-2" />
                            <p>Ready to assist with your research...</p>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed relative ${msg.role === 'user'
                                    ? 'bg-aqua-500/20 border border-aqua-500/30 text-white rounded-tr-sm'
                                    : 'bg-white/10 border border-white/10 text-gray-200 rounded-tl-sm'
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-1 opacity-50 text-xs">
                                    {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                                    <span>{msg.role === 'user' ? 'You' : 'ADK Agent'}</span>
                                </div>
                                <div className="whitespace-pre-wrap">{msg.text}</div>

                                {msg.tools && msg.tools.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {msg.tools.map((tool, i) => (
                                            <span key={i} className="text-[10px] px-2 py-0.5 bg-black/30 rounded border border-white/10 text-aqua-300">
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {msg.workflowState?.sentientScore && (
                                    <div className="mt-2 pt-2 border-t border-white/5">
                                        <button
                                            onClick={() => window.open(`/src/adk/reports/audit_sess_${Date.now()}.md`, '_blank')}
                                            className="text-[10px] text-aqua-300 hover:text-aqua-100 flex items-center gap-1 cursor-pointer transition-colors"
                                        >
                                            <MessageSquare size={10} /> View Audit Report
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                                <CircularProgress size={16} sx={{ color: '#00FFF0' }} />
                                <span className="text-xs text-aqua-300 animate-pulse">Running 5T Protocol Scan...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-black/20 border-t border-white/10">
                    <div className="flex gap-3 relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendClick()}
                            disabled={loading}
                            placeholder="輸入研究課題（例如：2024 ESG 趨勢）..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-aqua-500/50 focus:bg-white/10 transition-all font-light"
                        />
                        <button
                            onClick={handleSendClick}
                            disabled={loading}
                            className="bg-aqua-500/10 hover:bg-aqua-500/20 text-aqua-300 border border-aqua-500/30 rounded-xl px-4 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <SendIcon size={20} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </BentoCard>
    );
};
