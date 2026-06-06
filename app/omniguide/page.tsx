'use client';

import React, { useState } from 'react';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';
import { Search, ChevronRight, BookOpen, MessageSquare, Sparkles, Send, BrainCircuit, Activity } from 'lucide-react';

export default function OmniGuidePage() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Greetings. I am Jun.Ai.Key, the OmniGuide. My Eternal Memory has synced your recent activity in SustainWrite. You were struggling with GRI 302-1. How may I assist you with your energy consumption disclosures?',
      timestamp: 'Just now'
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: inputText, timestamp: 'Just now' }]);
    setInputText('');
    setIsThinking(true);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'According to GRI 302-1 (2016), you must report total fuel consumption within the organization from non-renewable sources, in joules or multiples. I have retrieved your Q1 electricity bills from the Vault-Omni which indicates 1.2M kWh. Shall I draft the disclosure text?',
        timestamp: 'Just now'
      }]);
      setIsThinking(false);
    }, 2000);
  };

  const knowledgeTree = [
    { name: 'GRI Standards (2021)', active: true, children: ['Omni (100)', 'Sector Standards (200)', 'Topic Standards (300)'] },
    { name: 'SASB Standards', active: false, children: [] },
    { name: 'Internal Benchmarks 2025', active: false, children: [] },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-void-stark text-white p-6 lg:p-8 animate-in fade-in duration-700 flex flex-col">
      <div className="max-w-[1600px] w-full mx-auto flex-1 flex flex-col space-y-6 h-full">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <OmniBadge variant="success" icon="🔮">
                萬能法典 (OmniGuide)
              </OmniBadge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white/90 font-mono flex items-center gap-3">
              Jun.Ai.Key Nexus
              <Activity className="w-6 h-6 text-emerald-soul animate-pulse" />
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-white/40 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-core shadow-[0_0_8px_#06b6d4]"></div>
              Eternal Memory: Active
            </span>
            <span className="flex items-center gap-2 border-l border-white/10 pl-4">
              <div className="w-2 h-2 rounded-full bg-emerald-soul shadow-[0_0_8px_#10b981]"></div>
              Semantic Engine: Online
            </span>
          </div>
        </header>

        {/* Dual-Pane Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
          
          {/* Left Pane: Knowledge Tree */}
          <div className="lg:col-span-1 h-full overflow-hidden flex flex-col">
            <OmniBaseCard title="Codex Knowledge Tree" variant="bordered" className="h-full flex flex-col">
              <div className="relative mb-4 shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="text" 
                  placeholder="Search standards & policies..." 
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-core/50 transition-colors"
                />
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {knowledgeTree.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${item.active ? 'bg-cyan-core/10 text-cyan-core' : 'hover:bg-white/5 text-white/70'}`}>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      {item.children.length > 0 && <ChevronRight className={`w-4 h-4 ${item.active ? 'rotate-90' : ''}`} />}
                    </div>
                    {item.active && item.children.length > 0 && (
                      <div className="pl-6 space-y-1 border-l border-white/10 ml-4">
                        {item.children.map((child, cIdx) => (
                          <div key={cIdx} className="p-2 text-sm text-white/50 hover:text-white/80 cursor-pointer rounded-lg hover:bg-white/5 transition-colors">
                            {child}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </OmniBaseCard>
          </div>

          {/* Right Pane: Immersive Chat */}
          <div className="lg:col-span-3 h-[600px] lg:h-full flex flex-col">
            <div className="flex-1 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl relative flex flex-col overflow-hidden">
              
              {/* Background ambient effect */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-core/5 rounded-full blur-[100px] pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-soul/5 rounded-full blur-[100px] pointer-events-none"></div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.role === 'user' 
                        ? 'bg-cyan-core/20 border border-cyan-core/30 text-white' 
                        : 'bg-white/5 border border-white/10 text-white/90 backdrop-blur-md'
                    }`}>
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2 text-emerald-soul/80 text-xs font-mono font-bold tracking-wider">
                          <BrainCircuit className="w-4 h-4" /> JUN.AI.KEY
                        </div>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <div className={`text-[10px] mt-2 font-mono ${msg.role === 'user' ? 'text-cyan-core/50 text-right' : 'text-white/30'}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isThinking && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-soul animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-soul animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-soul animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      <span className="text-xs text-emerald-soul ml-2 font-mono">Semantic Processing...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Omni-Prompt Input */}
              <div className="p-4 border-t border-white/10 bg-black/40 relative z-10 shrink-0">
                <div className="flex gap-2">
                  <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                    <Sparkles className="w-5 h-5" />
                  </button>
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask Jun.Ai.Key or use /analyze, /generate..." 
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-core/50 focus:bg-cyan-core/5 transition-all"
                  />
                  <button 
                    onClick={handleSend}
                    className="p-3 rounded-xl bg-cyan-core/20 border border-cyan-core/30 text-cyan-core hover:bg-cyan-core/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
