'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Maximize2, Minimize2, Sparkles, Activity, History, Zap } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useOmniResonance } from '../../src/client/hooks/useOmniResonance';
import { cn } from '../../lib/utils';

export default function OmniAgentFloatingAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const { rs, status: rsStatus } = useOmniResonance();
  const [input, setInput] = useState('');

  return (
    <div className="fixed bottom-10 right-10 z-[10000] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={cn(
              "mb-6 flex flex-col transition-all duration-500 origin-bottom-right",
              isMaximized ? "w-[640px] h-[800px]" : "w-[400px] h-[580px]"
            )}
          >
            <Card className="w-full h-full flex flex-col shadow-glass border-white/60 bg-white/80 backdrop-blur-3xl rounded-[3rem] p-0 overflow-hidden">
               {/* Agent Header */}
               <header className="p-8 bg-berkeley-blue text-white flex items-center justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-full bg-white/5 blur-3xl -z-0" />
                  <div className="flex items-center gap-5 relative z-10">
                     <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shadow-inner border border-white/10">
                        <Bot size={28} className="text-california-gold" />
                     </div>
                     <div>
                        <div className="flex items-center gap-3">
                           <p className="text-lg font-black tracking-tight uppercase">OmniAgent Oracle</p>
                           <Badge variant="verified" className="bg-emerald-400/20 text-emerald-300 border-none px-2 py-0.5 text-[9px]">ACTIVE</Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                           <div className="w-1.5 h-1.5 rounded-full bg-california-gold animate-pulse" />
                           <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Resonance: {(rs * 100).toFixed(1)}%</p>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 relative z-10">
                     <button onClick={() => setIsMaximized(!isMaximized)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-white/60 hover:text-white">
                        {isMaximized ? <Minimize2 size={18}/> : <Maximize2 size={18}/>}
                     </button>
                     <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-white/60 hover:text-white">
                        <X size={20} />
                     </button>
                  </div>
               </header>

               {/* Agent Body / Ren-Du Balancing */}
               <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-slate-50/30 no-scrollbar">
                  <div className="flex gap-4">
                     <div className="w-8 h-8 rounded-xl bg-berkeley-blue/5 text-berkeley-blue flex items-center justify-center shrink-0">
                        <Bot size={16} />
                     </div>
                     <Card className="bg-white p-5 rounded-3xl rounded-tl-none border border-slate-100/50 shadow-sm text-[13px] text-slate-600 leading-relaxed font-medium">
                        您好，我是您的 **OmniAgent 數據大祭司**。我正在即時平衡系統的任督二脈能量流。當前共鳴算力為 **{(rs * 100).toFixed(1)}%**，全域 5T 狀態穩定。
                     </Card>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <Card className="p-5 bg-white/60 border-white/80 shadow-sm flex flex-col items-center text-center gap-3">
                        <History size={16} className="text-berkeley-blue" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ren (DNA)</span>
                        <Badge variant="primary" className="text-[9px]">STABLE</Badge>
                     </Card>
                     <Card className="p-5 bg-white/60 border-white/80 shadow-sm flex flex-col items-center text-center gap-3">
                        <Zap size={16} className="text-california-gold" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Du (EXEC)</span>
                        <Badge variant="warning" className="text-[9px]">ACTIVE</Badge>
                     </Card>
                  </div>
               </div>

               {/* Agent Footer */}
               <footer className="p-6 bg-white border-t border-slate-100/50">
                  <div className="relative group">
                     <input 
                       className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-6 pr-16 text-sm font-medium focus:ring-4 focus:ring-berkeley-blue/5 focus:bg-white transition-all outline-none"
                       placeholder="輸入指令解鎖晶核..." 
                       value={input}
                       onChange={e => setInput(e.target.value)}
                       onKeyDown={e => e.key === 'Enter' && setInput('')}
                     />
                     <Button variant="primary" className="absolute right-2 top-2 w-10 h-10 p-0 rounded-xl" onClick={() => setInput('')}>
                        <Send size={16} />
                     </Button>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-6">
                     <button className="text-[10px] font-black text-slate-300 hover:text-berkeley-blue transition-colors uppercase tracking-widest">5T_SEAL</button>
                     <div className="w-1 h-1 rounded-full bg-slate-200" />
                     <button className="text-[10px] font-black text-slate-300 hover:text-berkeley-blue transition-colors uppercase tracking-widest">SWARM_SYNC</button>
                     <div className="w-1 h-1 rounded-full bg-slate-200" />
                     <button className="text-[10px] font-black text-slate-300 hover:text-berkeley-blue transition-colors uppercase tracking-widest">TRACE_DNA</button>
                  </div>
               </footer>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-glass transition-all duration-500",
          isOpen ? "bg-white text-berkeley-blue rotate-90 border border-white" : "bg-berkeley-blue text-california-gold"
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? <X key="x" size={32} /> : <Bot key="bot" size={36} className="animate-pulse" />}
        </AnimatePresence>
        
        {!isOpen && (
           <motion.span 
             initial={{ scale: 0 }} animate={{ scale: 1 }}
             className="absolute -top-1 -right-1 w-6 h-6 bg-error rounded-xl border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-lg"
           >
              !
           </motion.span>
        )}
      </motion.button>
    </div>
  );
}
