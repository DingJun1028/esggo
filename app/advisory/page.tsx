'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { MessageSquare, Send, Sparkles, ShieldCheck, Zap, Heart, Brain, Search, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PERSONAS = [
  { id: 'compliance', name: '合規專家 Compliance', icon: <ShieldCheck className="text-emerald-400" />, desc: '嚴謹、精確，專注於 GRI/ISSB 與法規一致性。', color: 'border-emerald-500/50' },
  { id: 'strategy', name: '策略師 Strategy', icon: <Zap className="text-cyan-400" />, desc: '宏觀、前瞻，致力於將 ESG 轉化為企業競爭優勢。', color: 'border-cyan-500/50' },
  { id: 'impact', name: '共榮使者 Impact', icon: <Heart className="text-rose-400" />, desc: '同理、包容，關注利害關係人福祉與社會價值。', color: 'border-rose-500/50' },
];

const MOCK_MESSAGES = [
  { role: 'assistant', persona: 'strategy', text: '您好，我是您的 ESG 策略助手。今天有什麼治理議題想討論嗎？' },
];

export default function AdvisoryPage() {
  const [activePersona, setActivePersona] = useState(PERSONAS[1]);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { role: 'user', text: input };
    setMessages([...messages, newMsg as any]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        persona: activePersona.id, 
        text: `針對您提到的「${input}」，從${activePersona.name}的角度來看，建議優先盤點現有的數據鏈路，並確保其符合 5T 誠信協議。` 
      } as any]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700 flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="✨">
              旅程 IV. AI 賦能與撰寫
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <MessageSquare className="text-cyan-core" /> 專家諮詢 Advisory
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              與 SPIRIT AI 專家團隊對話。結合 RAG 知識庫與 5T 數據，獲取精準的治理建議。
            </p>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[600px]">
          {/* Persona Selection */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 px-2">切換專家視角 Persona</h3>
            <div className="space-y-3">
              {PERSONAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePersona(p)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all group ${
                    activePersona.id === p.id 
                    ? `bg-white/5 ${p.color} shadow-lg shadow-black/40` 
                    : 'bg-transparent border-white/5 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {p.icon}
                    <span className={`font-bold ${activePersona.id === p.id ? 'text-white' : 'text-white/40'}`}>{p.name}</span>
                  </div>
                  <p className="text-[11px] text-white/30 leading-relaxed group-hover:text-white/50 transition-colors">
                    {p.desc}
                  </p>
                </button>
              ))}
            </div>

            <UniversalCard title="對話情境" variant="bordered">
              <div className="space-y-4">
                <button className="w-full py-2 px-4 rounded-xl bg-white/5 border border-white/10 text-xs text-left hover:bg-white/10 transition-all">
                  分析氣候風險情境
                </button>
                <button className="w-full py-2 px-4 rounded-xl bg-white/5 border border-white/10 text-xs text-left hover:bg-white/10 transition-all">
                  優化 DEI 章節措辭
                </button>
                <button className="w-full py-2 px-4 rounded-xl bg-white/5 border border-white/10 text-xs text-left hover:bg-white/10 transition-all">
                  解釋 GRI 305-1 指標
                </button>
              </div>
            </UniversalCard>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3 flex flex-col bg-white/5 rounded-[2.5rem] border border-white/10 overflow-hidden backdrop-blur-xl">
            {/* Chat Header */}
            <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-core/10 flex items-center justify-center text-cyan-core">
                  {activePersona.icon}
                </div>
                <div>
                  <h3 className="font-bold">{activePersona.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 animate-pulse">Online & Synchronized</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <UniversalButton variant="secondary" className="px-3 h-10"><Search size={16} /></UniversalButton>
                 <UniversalButton variant="secondary" className="px-3 h-10"><Brain size={16} /></UniversalButton>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar min-h-[400px]">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.role === 'user' 
                    ? 'bg-cyan-500/20 border border-cyan-500/30 text-white rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none'
                  }`}>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-cyan-core/70">
                         <Sparkles size={12} /> AI Thought
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1">
                      <span className="w-1.5 h-1.5 bg-cyan-core/50 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-cyan-core/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-cyan-core/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                   </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/10 bg-white/5">
              <div className="relative flex items-center gap-4">
                <input
                  type="text"
                  placeholder={`向 ${activePersona.name} 詢問任何 ESG 治理問題...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-cyan-500/50 outline-none transition-all"
                />
                <UniversalButton 
                  variant="primary" 
                  className="rounded-xl w-14 h-14 p-0 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  onClick={handleSend}
                >
                  <Send size={20} />
                </UniversalButton>
              </div>
              <p className="mt-3 text-[10px] text-center text-white/20 italic">
                AI 回覆僅供參考，請結合企業實際情況進行決策。所有對話均受 5T 數據安全保護。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
