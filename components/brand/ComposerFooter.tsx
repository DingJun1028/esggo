'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Square, Paperclip, Mic, Bot, ChevronUp, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { BrandBadge } from './index';

export default function ComposerFooter() {
  const [prompt, setQuery] = useState('');
  const [profile, setProfile] = useState('ESG_AUDITOR');
  const [isFocused, setIsFocused] = useState(false);

  const profiles = [
    { id: 'ESG_AUDITOR', label: 'GRI 審核員', icon: <ShieldCheck size={12}/>, color: '#10B981' },
    { id: 'CARBON_EXPERT', label: '碳盤查專家', icon: <Zap size={12}/>, color: '#3B7EA1' },
    { id: 'LEGAL_REVIEWER', label: '法規比對員', icon: <Bot size={12}/>, color: '#8B5CF6' }
  ];

  const activeProfile = profiles.find(p => p.id === profile);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-6 pb-6 pointer-events-none lg:left-[var(--sidebar-width)] transition-all duration-500">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`max-w-4xl mx-auto glass-panel border border-white/20 shadow-extreme rounded-[32px] p-2 pointer-events-auto transition-all duration-500 ${isFocused ? 'ring-4 ring-blue-500/5 -translate-y-2' : ''}`}
      >
        <div className="flex flex-col">
          {/* Header Actions */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-50 mb-2">
             <div className="flex items-center gap-2">
                <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100">
                   {profiles.map(p => (
                     <button 
                       key={p.id}
                       onClick={() => setProfile(p.id)}
                       className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${profile === p.id ? 'bg-white text-[#003262] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                     >
                        {p.icon} {!isFocused && p.id === profile ? p.label : ''}
                     </button>
                   ))}
                </div>
             </div>
             
             {/* Context Ring (Simplified) */}
             <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Context_Usage</span>
                   <span className="text-[11px] font-black text-[#003262] font-mono leading-none mt-1">4.2K / 128K</span>
                </div>
                <div className="relative w-10 h-10 flex items-center justify-center">
                   <svg className="w-full h-full -rotate-90">
                      <circle cx="20" cy="20" r="16" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                      <circle cx="20" cy="20" r="16" fill="transparent" stroke={activeProfile?.color} strokeWidth="4" strokeDasharray="100" strokeDashoffset="75" strokeLinecap="round" className="transition-all duration-1000" />
                   </svg>
                   <Sparkles size={10} className="absolute text-amber-400 animate-pulse" />
                </div>
             </div>
          </div>

          {/* Input Area */}
          <div className="flex items-end gap-3 p-2">
             <button className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all">
                <Paperclip size={20} />
             </button>
             <div className="flex-1 relative">
                <textarea 
                  rows={1}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  value={prompt}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="輸入指令啟動 5T 協作，或按 '/' 瀏覽技能庫..."
                  className="w-full bg-transparent border-none outline-none text-sm font-bold text-[#003262] placeholder:text-slate-300 py-3 resize-none no-scrollbar max-h-32"
                />
             </div>
             <div className="flex items-center gap-2">
                <button className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all">
                   <Mic size={20} />
                </button>
                <button 
                  disabled={!prompt}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg ${prompt ? 'bg-[#003262] shadow-blue-500/20 scale-100' : 'bg-slate-200 scale-95'}`}
                >
                   <Send size={20} />
                </button>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
