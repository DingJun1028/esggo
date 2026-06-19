import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ChevronRight, MessageSquare, AlertTriangle, Lightbulb } from 'lucide-react';
import { contextualActionService, type ProactiveAdvice } from '@/services/ContextualActionService';

const ActiveAdvice: React.FC = () => {
  const [adviceItems, setAdviceItems] = useState<ProactiveAdvice[]>([]);

  useEffect(() => {
    setAdviceItems(contextualActionService.getAdvice());
    const unsubscribe = contextualActionService.subscribe(items => setAdviceItems([...items]));
    return () => {
      unsubscribe();
    };
  }, []);

  const getIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <AlertTriangle className="text-rose-500" size={16} />;
      case 'MEDIUM':
        return <Lightbulb className="text-amber-400" size={16} />;
      default:
        return <MessageSquare className="text-cyan-400" size={16} />;
    }
  };

  if (adviceItems.length === 0) return null;

  return (
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-4 max-w-sm pointer-events-none">
      <AnimatePresence>
        {adviceItems.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="pointer-events-auto p-5 rounded-[2rem] bg-black/60 border border-white/10 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-3 group overflow-hidden relative"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-8 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                  {getIcon(item.priority)}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                  {item.sourceAgentId} Advice
                </span>
              </div>
              <button
                onClick={() => contextualActionService.dismissAdvice(item.id)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors opacity-40 hover:opacity-100"
              >
                <X size={14} className="text-white" />
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-black italic text-white tracking-tighter uppercase">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                {item.content}
              </p>
            </div>

            <div className="flex items-center justify-end mt-2">
              <button className="flex items-center gap-2 text-[10px] font-black uppercase text-[#0df2df] tracking-widest italic group/btn">
                Take Action
                <ChevronRight
                  size={12}
                  className="group-hover/btn:translate-x-1 transition-transform"
                />
              </button>
            </div>

            {/* Progress Bar for priority */}
            <div
              className={`absolute bottom-0 left-0 h-1 transition-all ${
                item.priority === 'HIGH'
                  ? 'bg-rose-500'
                  : item.priority === 'MEDIUM'
                    ? 'bg-amber-400'
                    : 'bg-cyan-500'
              }`}
              style={{ width: '100%' }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ActiveAdvice;
