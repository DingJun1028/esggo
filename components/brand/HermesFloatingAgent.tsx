'use client';
// [Stitch Integrity Sealed] 2026-05-22
import React, { useState } from 'react';
import { Bot, X, Send, Maximize2, Minimize2 } from 'lucide-react';
import { BrandCard, BrandButton, BrandInput, BrandStatusDot } from './';
import { motion, AnimatePresence } from 'framer-motion';

export default function HermesFloatingAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[10000] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`mb-4 ${isMaximized ? 'w-[600px] h-[700px]' : 'w-[380px] h-[500px]'} max-w-[90vw] max-h-[85vh]`}
          >
            <BrandCard padding="none" className="w-full h-full flex flex-col shadow-[0_8px_32px_rgba(0,50,98,0.12)] border-slate-200/60 overflow-hidden">
               {/* Chat Header */}
               <div className="p-4 bg-[#003262] text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <Bot size={18} />
                     </div>
                     <div>
                        <p className="text-xs font-bold">OmniHermes Agent</p>
                        <BrandStatusDot status="active" label="Ready to assist" size="sm" />
                     </div>
                  </div>
                  <div className="flex items-center gap-1">
                     <button onClick={() => setIsMaximized(!isMaximized)} className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/70">
                        {isMaximized ? <Minimize2 size={14}/> : <Maximize2 size={14}/>}
                     </button>
                     <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/70">
                        <X size={14} />
                     </button>
                  </div>
               </div>

               {/* Chat Body */}
               <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
                  <div className="flex gap-3">
                     <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                        <Bot size={12} />
                     </div>
                     <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 text-xs text-slate-600 shadow-sm leading-relaxed max-w-[85%]">
                        您好，我是您的 OmniHermes 永續助手。我已準備好協助您進行 GRI 合規檢查、數據映射或 Swarm 任務調度。
                     </div>
                  </div>
               </div>

               {/* Chat Footer */}
               <div className="p-4 bg-white border-t border-slate-100">
                  <div className="flex gap-2">
                     <BrandInput 
                       placeholder="請輸入指令..." 
                       className="flex-1"
                       autoFocus
                     />
                     <BrandButton variant="primary" size="sm" className="px-3">
                        <Send size={14} />
                     </BrandButton>
                  </div>
               </div>
            </BrandCard>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isOpen ? 'bg-white text-[#003262] rotate-90 border border-slate-100' : 'bg-[#003262] text-white hover:scale-105'}`}
      >
        {isOpen ? <X size={24} /> : <Bot size={28} />}
        {!isOpen && (
           <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFB703] rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-black">
              1
           </span>
        )}
      </button>
    </div>
  );
}
