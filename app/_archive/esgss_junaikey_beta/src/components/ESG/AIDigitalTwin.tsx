/**
 * 🤖 AI Agent - Digital Twin (v4.0 Ultimate)
 * --------------------------------------------------
 * [Feature] E1 - Hacker/Jarvis Style Chat Interface
 * [Style] Matrix / Cyberpunk Terminal
 * [Language] Traditional Chinese (UI), English (Code)
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  Sparkles,
  Brain,
  Cpu,
  Settings,
  X,
  Terminal,
  Activity,
  Wifi,
  Battery,
  Database,
  Lock,
  Shield,
  Eye,
  Code,
  Command,
  TrendingUp,
} from 'lucide-react';
import { useESGStore } from '@/store/useESGStore';
import { useOmniResonance } from '../../5-store/useOmniResonance';

// --- Type Definitions ---
export interface ChatMessage {
  id: string;
  role: 'user' | 'system';
  content: string;
  timestamp: number;
  type?: 'text' | 'code' | 'alert';
}

export const AIDigitalTwin: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'system',
      content: 'SYSTEM ONLINE. OMNI-ADAPTIVE PROTOCOL ENGAGED.',
      timestamp: Date.now(),
      type: 'code',
    },
    {
      id: 'init-2',
      role: 'system',
      content: '歡迎回來，指揮官。數位分身系統已同步就緒。',
      timestamp: Date.now(),
      type: 'text',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use global hook (returns resonance instead of resonanceLevel)
  const { resonance } = useOmniResonance();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
      type: 'text',
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      const newSystemMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: `正在分析指令: "${newUserMsg.content}"... \n計算影響機率: ${(
          Math.random() * 100
        ).toFixed(2)}%`,
        timestamp: Date.now(),
        type: 'text',
      };
      setMessages(prev => [...prev, newSystemMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-green-500 font-mono p-4 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-black/80 pointer-events-none radial-gradient(circle at center, transparent 0%, black 100%)"></div>

      {/* Header */}
      <header className="flex justify-between items-center mb-4 border-b border-green-500/30 pb-2 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-green-500 rounded bg-green-500/10 animate-pulse">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
              OMNI-AI TWIN
            </h1>
            <div className="text-[10px] text-green-600 flex gap-2">
              <span>V4.0.1 ULTIMATE</span>
              <span>|</span>
              <span>共鳴值: {resonance?.toFixed(2) || 'OFFLINE'}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 text-xs text-green-600/80">
          <div className="flex flex-col items-end">
            <span className="flex items-center gap-1">
              <Wifi size={10} /> 網路: 安全
            </span>
            <span className="flex items-center gap-1">
              <Activity size={10} /> CPU: 12%
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="flex items-center gap-1">
              <Database size={10} /> 記憶體: 34TB
            </span>
            <span className="flex items-center gap-1">
              <Battery size={10} /> 能量: 98%
            </span>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto mb-4 border border-green-500/20 rounded bg-black/40 p-4 custom-scrollbar z-10 relative shadow-[inset_0_0_20px_rgba(0,50,0,0.5)]">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded ${
                  msg.role === 'user'
                    ? 'bg-green-900/20 border border-green-500/50 text-green-300'
                    : 'bg-black/60 border border-green-500/30 text-green-400'
                }`}
              >
                <div className="text-[10px] opacity-50 mb-1 flex items-center gap-2">
                  {msg.role === 'user' ? (
                    <>
                      <span>使用者</span> <Command size={10} />
                    </>
                  ) : (
                    <>
                      <Terminal size={10} /> <span>系統核心</span>
                    </>
                  )}
                  <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed font-mono">
                  {msg.type === 'code' ? (
                    <code className="block bg-black/80 p-2 rounded border border-green-900/50 text-xs">
                      {msg.content}
                    </code>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-500/50 text-xs animate-pulse flex items-center gap-2"
            >
              <Cpu size={12} className="animate-spin" /> 處理中...
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-2 z-10 relative">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="請輸入指令或查詢..."
            className="w-full bg-black/80 border border-green-500/30 text-green-400 p-3 pl-4 rounded focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(74,222,128,0.2)] placeholder-green-800 font-mono transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 text-green-800">
            <Code size={16} />
            <Lock size={16} />
          </div>
        </div>
        <button
          onClick={handleSendMessage}
          className="bg-green-900/20 border border-green-500/50 text-green-400 px-6 rounded hover:bg-green-500/20 hover:text-green-300 transition-all flex items-center justify-center active:scale-95"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
