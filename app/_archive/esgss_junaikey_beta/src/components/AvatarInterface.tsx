
import React, { useState, useEffect, useRef } from 'react';
import { useAvatar, IAvatarState } from '../hooks/useAvatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Sparkles, Mic, Volume2 } from 'lucide-react'; // Assuming lucide-react is installed

const AvatarInterface: React.FC = () => {
    const { avatarState, isLoading, sendMessage, switchPersona } = useAvatar();
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<{ sender: 'user' | 'avatar'; text: string }[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setInput('');
        setHistory(prev => [...prev, { sender: 'user', text: userMsg }]);

        const response = await sendMessage(userMsg);
        if (response) {
            setHistory(prev => [...prev, { sender: 'avatar', text: response }]);
        }
    };

    const currentPersona = avatarState?.currentPersonaId === 'thoth' ? 'Dr. Thoth' : 'JunAiKey';
    const moodColor = avatarState?.mood === 'Happy' ? 'text-green-400' : avatarState?.mood === 'Concerned' ? 'text-yellow-400' : 'text-blue-400';

    return (
        <div className="flex flex-col h-[600px] w-full max-w-2xl bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header / Avatar Visual */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                <div className="flex items-center space-x-4">
                    <div className={`relative w-12 h-12 rounded-full border-2 ${avatarState?.isSpeaking ? 'border-green-400 animate-pulse' : 'border-gray-500'} flex items-center justify-center bg-black/50`}>
                        {avatarState?.currentPersonaId === 'thoth' ? (
                            <Sparkles className="w-6 h-6 text-purple-400" />
                        ) : (
                            <div className="text-xs font-bold text-blue-400">JUNA</div>
                        )}
                        {/* Status Dot */}
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border border-black ${avatarState?.isSpeaking ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">{currentPersona}</h3>
                        <p className={`text-xs ${moodColor} flex items-center gap-1`}>
                            {avatarState?.mood || 'Neutral'} • {avatarState?.isSpeaking ? 'Speaking...' : 'Listening'}
                        </p>
                    </div>
                </div>

                {/* Persona Switcher */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => switchPersona('thoth')}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${avatarState?.currentPersonaId === 'thoth' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                        Thoth
                    </button>
                    <button
                        onClick={() => switchPersona('juna')}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${avatarState?.currentPersonaId === 'juna' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                        JunAiKey
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <AnimatePresence>
                    {history.length === 0 && (
                        <div className="text-center text-gray-500 mt-20">
                            <p>Greetings, Traveler. I am {currentPersona}.</p>
                            <p className="text-xs mt-2">Ask me anything about sustainability or the 5T Protocol.</p>
                        </div>
                    )}
                    {history.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                    ? 'bg-blue-600/20 text-white rounded-br-sm border border-blue-500/30'
                                    : 'bg-white/5 text-gray-200 rounded-bl-sm border border-white/10'
                                }`}>
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="bg-white/5 p-3 rounded-2xl rounded-bl-sm flex space-x-1 items-center">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={`Ask ${currentPersona}...`}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvatarInterface;
